import { Request, Response } from 'express';
import { GetMapping, RestController, UserAccessLevel } from 'internal';
import { validateToken } from 'utils';

@RestController('/app', UserAccessLevel.Public)
export class AppInfoController {
    @GetMapping('/health-check')
    healthCheck(_: Request, res: Response): void {
        res.status(200).json({
            status: 'OK',
            message: 'Application is running',
        });
    }

    /**
     * @swagger
     * /rest/app/validate-token:
     *   get:
     *     summary: Valida si el token que va en el header es válido
     *     parameters:
     *     - in: header
     *       name: authorization
     *       description: Token Bearer a validar
     *       required: true
     *       type: string
     *     responses:
     *       200:
     *         description: Respuesta exitosa
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: estado.
     *                   example: OK
     *                 message:
     *                   type: string
     *                   description: Resultado si es valido el token.
     *                   example: Token is valid
     *       401:
     *         description: Respuesta token expirado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: estado.
     *                   example: ERROR
     *                 message:
     *                   type: string
     *                   description: Resultado si el token está vencido.
     *                   example: Expired token
     *       500:
     *         description: Error general o de validación de token
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: estado.
     *                   example: ERROR
     *                 message:
     *                   type: string
     *                   description: Resultado existe un error.
     *                   example: Failed to authenticate user
     */
    @GetMapping('/validate-token')
    async validateToken(req: Request, res: Response): Promise<void> {
        try {
            const { headers } = req;
            // remove Bearer if using Bearer Authorization mechanism
            const token = headers.authorization?.replace('Bearer ', '') ?? '';

            // verify request has token
            if (!token) {
                res.status(401).json({ message: 'Invalid token' });
            }

            // verify token hasn't expired yet
            await validateToken(token);
            res.status(200).json({
                status: 'OK',
                message: 'Token is valid',
            });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({
                    status: 'ERR_JWT_EXPIRED',
                    message: 'Expired token',
                });
                return;
            }

            res.status(500).json({
                status: 'ERROR',
                message: 'Failed to authenticate user',
            });
        }
    }
}
