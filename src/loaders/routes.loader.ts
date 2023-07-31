import { AppInfoController, MutantController, TestController } from 'controllers';
import { Application, Router } from 'express';
import { Dictionary, RequestHandler } from 'express-serve-static-core';
import { Class, ControllerMetadata, MetadataKey, RouteMetadata, UserAccessLevel } from 'internal';
import Container from 'typedi';

const ResourceApiPrefix = '/rest';

const Controllers: Class<any>[] = [AppInfoController, MutantController, TestController];

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
    _controllerAccessLevel: UserAccessLevel,
    routeMetadata: RouteMetadata,
    ...handlers: RequestHandler<Dictionary<string>>[]
): void => {
    const { handlerName, method } = routeMetadata;

    const controllerClass = controllerInstance.constructor;
    const controllerName = controllerClass.name;

    // Obtener el manejador de punto final del controlador y añadirlo a la lista de handlers.
    const endpointHandler = controllerInstance[handlerName];
    if (typeof endpointHandler !== 'function') {
        console.error(`No se pudo registrar la ruta: ${controllerName}.${handlerName} no es una función.`);
        return;
    }
    handlers.push(endpointHandler.bind(controllerInstance));

    // Construir la ruta para el mapeo de la ruta.
    const path = prefix + (routeMetadata.path || '');

    // Registrar la ruta en el enrutador.
    router[method](path, handlers);

    // Imprimir la ruta en la consola.
    console.log(
        `Registrado método ${(method as string).toUpperCase()} en '${path}' utilizando el controlador ${controllerName}.${handlerName}`
    );
};

/**
 * Registra los endpoints de un controlador en el enrutador.
 * @param controller El clase del controlador.
 */
const registerController = (prefix: string, controllerClass: Class<any>, ...handlers: RequestHandler<Dictionary<string>>[]): void => {
    const controllerInstance = Container.get(controllerClass);
    const controllerMetadata: ControllerMetadata = Reflect.getOwnMetadata(MetadataKey.RestController, controllerClass);
    if (controllerMetadata === undefined) {
        console.error(`No se pudo registrar el controlador: ${controllerClass.name} no es un controlador.`);
        return;
    }
    const routeMetadataMap: Record<string, RouteMetadata> = Reflect.getMetadata(MetadataKey.RequestMapping, controllerClass);
    for (const routeMetadata of Object.values(routeMetadataMap)) {
        registerRoute(
            controllerInstance,
            prefix + controllerMetadata.prefix,
            controllerMetadata.defaultAccessLevel,
            routeMetadata,
            ...handlers
        );
    }
};

/**
 * Registra una lista de controladores en el enrutador.
 */
const registerControllers = (prefix: string, controllers: Class<any>[], ...handlers: RequestHandler<Dictionary<string>>[]): void => {
    for (const controllerClass of controllers) {
        registerController(prefix, controllerClass, ...handlers);
    }
};

export default (app: Application): void => {
    registerControllers(ResourceApiPrefix, Controllers);
    app.use(router);
};
