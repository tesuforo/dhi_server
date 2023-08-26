import { isDirectusError as isDirectusErrorR } from 'utils';

export interface DirectusError<Extensions = void> extends Error {
    extensions: Extensions;
    message: string;
}

/**
 * Check whether or not a passed thing is a valid Directus error
 *
 * @param err - Any input
 */
export const isDirectusError = <T = unknown>(
    err: any,
    code?: string,
): err is DirectusError<T> => {
    if (Array.isArray(err?.errors)) {
        for (const error of err?.errors) {
            return isDirectusErrorR(error);
        }
    }
    const isDirectusError =
        typeof err === 'object' &&
        err !== null &&
        Array.isArray(err) === false &&
        'extensions' in err &&
        err.extensions;

    if (code) {
        return (
            isDirectusError && 'code' in err && err.code === code.toUpperCase()
        );
    }

    return isDirectusError;
};
