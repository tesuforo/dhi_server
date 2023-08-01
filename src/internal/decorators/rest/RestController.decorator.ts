import { Service } from 'typedi';
import { UserAccessLevel } from '../../enum/UserAccessLevel.enum';
import { MetadataKey } from '../MetadataKeyConstants';
import 'reflect-metadata';

type Decorator = (target: any) => void;

type RestControllerParams = {
    prefix: string,
    defaultAccessLevel: UserAccessLevel
};

/**
 * Función de ayuda para analizar los parámetros de entrada de `RestController`.
 */
const parseInputs = (param1?: string | UserAccessLevel, param2?: UserAccessLevel): RestControllerParams => {
    let prefix = '';
    let defaultAccessLevel: UserAccessLevel = UserAccessLevel.Admin;
    if (typeof param1 === 'string') {
        prefix = param1;
        if (param2 !== undefined) {
            defaultAccessLevel = param2;
        }
    } else if (typeof param1 === 'number') {
        defaultAccessLevel = param1;
    }
    return { prefix, defaultAccessLevel };
};

/**
 * Decorador para indicar que la clase es un controlador REST. Los métodos en
 * esta clase se pueden mapear como recursos web utilizando `RequestMapping` y los
 * decoradores de acceso directo equivalentes.
 * 
 * El nivel de acceso mínimo requerido para acceder a cualquier método en el
 * controlador se establece por defecto como 'solo administrador'.
 */
export function RestController(): Decorator;

/**
 * Decorador para indicar que la clase es un controlador REST. Los métodos en
 * esta clase se pueden mapear como recursos web utilizando `RequestMapping` y los
 * decoradores de acceso directo equivalentes.
 * 
 * El nivel de acceso mínimo requerido para acceder a cualquier método en el
 * controlador se establece por defecto como 'solo administrador'.
 * 
 * @param prefix Un prefijo opcional que se agregará a cada URI de recurso
 *               mapeada en este controlador.
 */
export function RestController(prefix: string): Decorator;

/**
 * Decorador para indicar que la clase es un controlador REST. Los métodos en
 * esta clase se pueden mapear como recursos web utilizando `RequestMapping` y los
 * decoradores de acceso directo equivalentes.
 * 
 * @param defaultAccessLevel Establece el nivel de acceso de usuario que se requiere
 *                           para acceder a los recursos en este controlador.
 */
export function RestController(defaultAccessLevel: UserAccessLevel): Decorator;

/**
 * Decorador para indicar que la clase es un controlador REST. Los métodos en
 * esta clase se pueden mapear como recursos web utilizando `RequestMapping` y los
 * decoradores de acceso directo equivalentes.
 * 
 * @param prefix Un prefijo opcional que se agregará a cada URI de recurso
 *               mapeada en este controlador.
 * @param defaultAccessLevel Establece el nivel de acceso de usuario que se requiere
 *                           para acceder a los recursos en este controlador.
 */
export function RestController(prefix: string, defaultAccessLevel: UserAccessLevel): Decorator;

/**
 * Implementación de la función `RestController`.
 */
export function RestController(param1?: string | UserAccessLevel, param2?: UserAccessLevel): Decorator {
    const params = parseInputs(param1, param2);

    return (target: any) => {
        Reflect.defineMetadata(MetadataKey.RestController, params, target);

        // Registra el RestController como un servicio de typedi.
        Service()(target);
    };
}
