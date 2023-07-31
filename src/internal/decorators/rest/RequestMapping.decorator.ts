
import { RequestMethod } from '../../enum/RequestMethod.enum';
import { UserAccessLevel } from '../../enum/UserAccessLevel.enum';
import { RouteMetadata } from '../../types/RouteMetadata.type';
import { MetadataKey } from '../MetadataKeyConstants';
import 'reflect-metadata';

type Decorator = (target: any, propertyKey: string) => void;

type RequestMappingParams = {
    path: string,
    accessLevel?: UserAccessLevel
};

/**
 * Función de ayuda para analizar los parámetros de entrada de `RequestMapping`.
 */
const parseInputs = (param1?: string | UserAccessLevel, param2?: UserAccessLevel): RequestMappingParams => {
    let path = '';
    let accessLevel = undefined;
    if (typeof param1 === 'string') {
        path = param1;
        if (param2 !== undefined) {
            accessLevel = param2;
        }
    } else if (typeof param1 === 'number') {
        accessLevel = param1;
    }
    return { path, accessLevel };
};

/**
 * Decorador para asignar las solicitudes web a un método controlador en una clase de controlador
 * decorada con `RestController`.
 * 
 * El método se asigna a la ruta predeterminada '/', en relación con el
 * prefijo de URI del controlador.
 * 
 * El nivel de acceso mínimo requerido para acceder al método se hereda del controlador.
 * 
 * @param method El tipo de método de solicitud HTTP.
 */
export function RequestMapping(method: RequestMethod): Decorator;

/**
 * Decorador para asignar las solicitudes web a un método controlador en una clase de controlador
 * decorada con `RestController`.
 * 
 * El nivel de acceso mínimo requerido para acceder al método se hereda del controlador.
 * 
 * @param method El tipo de método de solicitud HTTP.
 */
export function RequestMapping(method: RequestMethod, path: string): Decorator;

/**
 * Decorador para asignar las solicitudes web a un método controlador en una clase de controlador
 * decorada con `RestController`.
 * 
 * El nivel de acceso mínimo requerido para acceder al método se hereda del controlador.
 *
 * @param method El tipo de método de solicitud HTTP.
 * @param accessLevel El nivel de acceso mínimo requerido para acceder al
 *                    método. Esto anula el valor del controlador.
 */
export function RequestMapping(method: RequestMethod, accessLevel: UserAccessLevel): Decorator;

/**
 * Decorador para asignar las solicitudes web a un método controlador en una clase de controlador
 * decorada con `RestController`.
 *
 * @param method El tipo de método de solicitud HTTP.
 * @param path La ruta URI del método en relación con el prefijo de URI del controlador.
 * @param accessLevel El nivel de acceso mínimo requerido para acceder al
 *                    método. Esto anula el valor del controlador.
 */
// eslint-disable-next-line max-len
export function RequestMapping(method: RequestMethod, path: string, accessLevel: UserAccessLevel): Decorator;

/**
 * Implementación de la función `RequestMapping`.
 */
export function RequestMapping(method: RequestMethod, param1?: string | UserAccessLevel, param2?: UserAccessLevel): Decorator {
    const { path, accessLevel } = parseInputs(param1, param2);

    return (target: any, propertyKey: string) => {
        // Agrega el mapeo de ruta a los metadatos del controlador si aún no está presente.
        // TODO: Verificar que la clase esté decorada con `RestController`.
        if (!Reflect.hasMetadata(MetadataKey.RequestMapping, target.constructor)) {
            Reflect.defineMetadata(MetadataKey.RequestMapping, {}, target.constructor);
        }

        // Registra los metadatos de la ruta en el mapa.
        const routes: Record<string, RouteMetadata> = Reflect.getMetadata(MetadataKey.RequestMapping, target.constructor);
        routes[propertyKey] = {
            path,
            method,
            accessLevel,
            handlerName: propertyKey
        };
    };
}

/**
 * Decorador para asignar solicitudes GET a un método controlador en un controlador.
 * 
 * Equivalente abreviado de `@RequestMapping(RequestMethod.GET)`.
 */
export function GetMapping(): Decorator;

/**
 * Decorador para asignar solicitudes GET a un método controlador en un controlador.
 * 
 * Equivalente abreviado de `@RequestMapping(RequestMethod.GET, path)`.
 */
export function GetMapping(path: string): Decorator;

/**
 * Decorador para asignar solicitudes GET a un método controlador en un controlador.
 * 
 * Equivalente abreviado de `@RequestMapping(RequestMethod.GET, accessLevel)`.
 */
export function GetMapping(accessLevel: UserAccessLevel): Decorator;

/**
 * Decorador para asignar solicitudes GET a un método controlador en un controlador.
 * 
 * Equivalente abreviado de
 * `@RequestMapping(RequestMethod.GET, path, accessLevel)`.
 */
export function GetMapping(path: string, accessLevel: UserAccessLevel): Decorator;

/**
 * Implementación de la función `GetMapping`.
 */
export function GetMapping(param1?: string | UserAccessLevel, param2?: UserAccessLevel): Decorator {
    const { path, accessLevel } = parseInputs(param1, param2);
    if (!accessLevel) {
        return RequestMapping(RequestMethod.GET, path);
    }
    return RequestMapping(RequestMethod.GET, path, accessLevel);
}

/**
 * Decorador para asignar solicitudes POST a un método controlador en un controlador.
 * 
 * Equivalente abreviado de `@RequestMapping(RequestMethod.POST)`.
 */
export function PostMapping(): Decorator;

/**
 * Decorador para asignar solicitudes POST a un método controlador en un controlador.
 * 
 * Equivalente abreviado de `@RequestMapping(RequestMethod.POST, path)`.
 */
export function PostMapping(path: string): Decorator;

/**
 * Decorador para asignar solicitudes POST a un método controlador en un controlador.
 * 
 * Equivalente abreviado de `@RequestMapping(RequestMethod.POST, accessLevel)`.
 */
export function PostMapping(accessLevel: UserAccessLevel): Decorator;

/**
 * Decorador para asignar solicitudes POST a un método controlador en un controlador.
 * 
 * Equivalente abreviado de 
 * `@RequestMapping(RequestMethod.POST, path, accessLevel)`.
 */
export function PostMapping(path: string, accessLevel: UserAccessLevel): Decorator;

/**
 * Implementación de la función `PostMapping`.
 */
export function PostMapping(param1?: string | UserAccessLevel, param2?: UserAccessLevel): Decorator {
    const { path, accessLevel } = parseInputs(param1, param2);
    if (!accessLevel) {
        return RequestMapping(RequestMethod.POST, path);
    }
    return RequestMapping(RequestMethod.POST, path, accessLevel);
}

/**
 * Decorador para asignar solicitudes PUT a un método controlador en un controlador.
 * 
 * Equivalente abreviado de `@RequestMapping(RequestMethod.PUT)`.
 */
export function PutMapping(): Decorator;

/**
 * Decorador para asignar solicitudes PUT a un método controlador en

 un controlador.
 * 
 * Equivalente abreviado de `@RequestMapping(RequestMethod.PUT, path)`.
 */
export function PutMapping(path: string): Decorator;

/**
 * Decorador para asignar solicitudes PUT a un método controlador en un controlador.
 * 
 * Equivalente abreviado de `@RequestMapping(RequestMethod.PUT, accessLevel)`.
 */
export function PutMapping(accessLevel: UserAccessLevel): Decorator;

/**
 * Decorador para asignar solicitudes PUT a un método controlador en un controlador.
 * 
 * Equivalente abreviado de
 * `@RequestMapping(RequestMethod.PUT, path, accessLevel)`.
 */
export function PutMapping(path: string, accessLevel: UserAccessLevel): Decorator;

/**
 * Implementación de la función `PutMapping`.
 */
export function PutMapping(param1?: string | UserAccessLevel, param2?: UserAccessLevel): Decorator {
    const { path, accessLevel } = parseInputs(param1, param2);
    if (!accessLevel) {
        return RequestMapping(RequestMethod.PUT, path);
    }
    return RequestMapping(RequestMethod.PUT, path, accessLevel);
}

/**
 * Decorador para asignar solicitudes DELETE a un método controlador en un controlador.
 * 
 * Equivalente abreviado de `@RequestMapping(RequestMethod.DELETE)`.
 */
export function DeleteMapping(): Decorator;

/**
 * Decorador para asignar solicitudes DELETE a un método controlador en un controlador.
 * 
 * Equivalente abreviado de `@RequestMapping(RequestMethod.DELETE, path)`.
 */
export function DeleteMapping(path: string): Decorator;

/**
 * Decorador para asignar solicitudes DELETE a un método controlador en un controlador.
 * 
 * Equivalente abreviado de `@RequestMapping(RequestMethod.DELETE, accessLevel)`.
 */
export function DeleteMapping(accessLevel: UserAccessLevel): Decorator;

/**
 * Decorador para asignar solicitudes DELETE a un método controlador en un controlador.
 *
 * Equivalente abreviado de
 * `@RequestMapping(RequestMethod.DELETE, path, accessLevel)`.
 */
export function DeleteMapping(path: string, accessLevel: UserAccessLevel): Decorator;

/**
 * Implementación de la función `DeleteMapping`.
 */
export function DeleteMapping(param1?: string | UserAccessLevel, param2?: UserAccessLevel): Decorator {
    const { path, accessLevel } = parseInputs(param1, param2);
    if (!accessLevel) {
        return RequestMapping(RequestMethod.DELETE, path);
    }
    return RequestMapping(RequestMethod.DELETE, path, accessLevel);
}
