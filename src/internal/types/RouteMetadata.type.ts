import { RequestMethod } from '../enum/RequestMethod.enum';
import { UserAccessLevel } from '../enum/UserAccessLevel.enum';

type Nullable<T> = T | null | undefined;
/**
 * Maps a route to an endpoint method in a controller.
 */
export type RouteMetadata = {

    path: string;

    accessLevel: Nullable<UserAccessLevel>;

    /**
     * The request method type (get, post, put, or delete).
     */
    method: RequestMethod;

    handlerName: string;

};
