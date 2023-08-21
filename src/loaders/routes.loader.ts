import {
    AppInfoController,
    AppointmentController,
    MutantController,
    TestController,
} from 'controllers';
import { Application, NextFunction, Request, Response, Router } from 'express';
import { Dictionary, RequestHandler } from 'express-serve-static-core';
import {
    Class,
    ControllerMetadata,
    MetadataKey,
    RouteMetadata,
    UserAccessLevel,
} from 'internal';
import Container from 'typedi';
import jwt from 'jsonwebtoken';

const ResourceApiPrefix = '/rest';

const Controllers: Class<any>[] = [
    AppInfoController,
    AppointmentController,
    MutantController,
    TestController,
];

const router = Router();

/**
 * Registra un endpoint del controlador en el enrutador.
 *
 * @param controllerInstance La instancia del controlador.
 * @param prefix El prefijo de la ruta definido a nivel de controlador.
 * @param controllerAccessLevel El nivel de acceso definido a nivel de controlador.
 *                              Se utilizará si no se define a nivel de ruta.
 * @param routeMetadata Los metadatos de la ruta.
 */
const registerRoute = (
    controllerInstance: any,
    prefix: string,
    controllerAccessLevel: UserAccessLevel,
    routeMetadata: RouteMetadata,
    ...handlers: RequestHandler<Dictionary<string>>[]
): void => {
    const { handlerName, method } = routeMetadata;

    const controllerClass = controllerInstance.constructor;
    const controllerName = controllerClass.name;

    // Obtener el manejador de punto final del controlador y añadirlo a la lista de handlers.
    const endpointHandler = controllerInstance[handlerName];
    if (typeof endpointHandler !== 'function') {
        console.error(
            `No se pudo registrar la ruta: ${controllerName}.${handlerName} no es una función.`,
        );
        return;
    }

    // Agregar el middleware de verificación del token antes de los demás handlers
    if (
        controllerAccessLevel === UserAccessLevel.Authenticated ||
        controllerAccessLevel === UserAccessLevel.Admin ||
        routeMetadata.accessLevel === UserAccessLevel.Authenticated ||
        routeMetadata.accessLevel === UserAccessLevel.Admin
    ) {
        handlers.unshift(verifyToken);
    }

    handlers.push(endpointHandler.bind(controllerInstance));

    // Construir la ruta para el mapeo de la ruta.
    const path = prefix + (routeMetadata.path || '');

    // Registrar la ruta en el enrutador.
    router[method](path, handlers);

    // Imprimir la ruta en la consola.
    console.log(
        `Registrado método ${(
            method as string
        ).toUpperCase()} en '${path}' utilizando el controlador ${controllerName}.${handlerName} Nivel ${
            UserAccessLevel.getName(routeMetadata.accessLevel)
        }`,
    );
};

// Agregar validación del token JWT
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({
            error: 'Acceso no autorizado. Token no proporcionado.',
        });
    }
    const jwtSecret = process.env.JWT_SECRET ?? '';
    try {
        jwt.verify(token, jwtSecret);
        next();
    } catch (err) {
        console.log(err);
        return res
            .status(403)
            .json({ error: 'Acceso no autorizado. Token inválido.' });
    }
};

/**
 * Registra los endpoints de un controlador en el enrutador.
 * @param controller El clase del controlador.
 */
const registerController = (
    prefix: string,
    controllerClass: Class<any>,
    ...handlers: RequestHandler<Dictionary<string>>[]
): void => {
    const controllerInstance = Container.get(controllerClass);
    const controllerMetadata: ControllerMetadata = Reflect.getOwnMetadata(
        MetadataKey.RestController,
        controllerClass,
    );
    if (controllerMetadata === undefined) {
        console.error(
            `No se pudo registrar el controlador: ${controllerClass.name} no es un controlador.`,
        );
        return;
    }
    const routeMetadataMap: Record<string, RouteMetadata> = Reflect.getMetadata(
        MetadataKey.RequestMapping,
        controllerClass,
    );

    for (const routeMetadata of Object.values(routeMetadataMap)) {
        registerRoute(
            controllerInstance,
            prefix + controllerMetadata.prefix,
            controllerMetadata.defaultAccessLevel,
            routeMetadata,
            ...handlers,
        );
    }
};

/**
 * Registra una lista de controladores en el enrutador.
 */
const registerControllers = (
    prefix: string,
    controllers: Class<any>[],
    ...handlers: RequestHandler<Dictionary<string>>[]
): void => {
    for (const controllerClass of controllers) {
        registerController(prefix, controllerClass, ...handlers);
    }
    console.log(handlers);
};

export default (app: Application): void => {
    registerControllers(ResourceApiPrefix, Controllers);
    app.use(router);
};
