export interface DirectusError<Extensions = void> extends Error {
    extensions: Extensions;
    code: string;
    status: number;
}

export interface DirectusErrorConstructor<Extensions = void> {
    new (
        extensions: Extensions,
        options?: ErrorOptions,
    ): DirectusError<Extensions>;
    readonly prototype: DirectusError<Extensions>;
}

export const createError = <Extensions = void>(
    code: string,
    message: string | ((extensions: Extensions) => string),
    status = 500,
): DirectusErrorConstructor<Extensions> => {
    return class extends Error implements DirectusError<Extensions> {
        override name = 'DirectusError';
        extensions: Extensions;
        code = code.toUpperCase();
        status = status;

        constructor(extensions: Extensions, options?: ErrorOptions) {
            const msg =
                typeof message === 'string'
                    ? message
                    : message(extensions as Extensions);

            super(msg, options);

            this.extensions = extensions;
        }

        override toString() {
            return `${this.name} [${this.code}]: ${this.message}`;
        }
    };
};

/**
 * Check whether or not a passed thing is a valid Directus error
 *
 * @param err - Any input
 */
export const isDirectusError = <T = unknown>(
    err: unknown,
    code?: string,
): err is DirectusError<T> => {
    const isDirectusError =
        typeof err === 'object' &&
        err !== null &&
        Array.isArray(err) === false &&
        'name' in err &&
        err.name === 'DirectusError';

    if (code) {
        return (
            isDirectusError && 'code' in err && err.code === code.toUpperCase()
        );
    }

    return isDirectusError;
};
