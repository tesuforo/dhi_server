import { Jwt, JwtPayload, VerifyOptions, verify } from 'jsonwebtoken';

/**
 * checks if JWT token is valid
 *
 * @param token the expected token payload
 */
export const validateToken = (
    token: string,
): Promise<
    | string
    | Jwt
    | JwtPayload
    | PromiseLike<string | Jwt | JwtPayload>
    | undefined
> => {
    const publicKey = process.env.JWT_SECRET ?? '';

    const verifyOptions: VerifyOptions & { complete?: boolean } = {};
    return new Promise((resolve, reject) => {
        verify(
            token,
            publicKey,
            verifyOptions,
            (
                error,
                decoded:
                    | string
                    | Jwt
                    | JwtPayload
                    | PromiseLike<string | Jwt | JwtPayload>
                    | undefined,
            ) => {
                if (error) return reject(error);

                resolve(decoded);
            },
        );
    });
};
