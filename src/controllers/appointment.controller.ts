import { Request, Response } from 'express';
import {
    CreateAppointmentDTO,
    GetMapping,
    PostMapping,
    RestController,
    UserAccessLevel,
} from 'internal';
import { AppointmentService } from 'services';
import { parseValidationErrors, validateToken } from 'utils';
import { validate } from 'class-validator';
import { PutMapping } from '../internal/decorators/rest/RequestMapping.decorator';

@RestController('/appointment', UserAccessLevel.Public)
export class AppointmentController {
    constructor(private appointmentService: AppointmentService) {}

    @GetMapping('/')
    getList(_: Request, res: Response): void {
        res.status(200).json({
            status: 'OK',
            message: 'Application is running',
        });
    }

    /**
     * @swagger
     * /rest/appointment:
     *   post:
     *     summary: creación de cita
     *     parameters:
     *     - in: header
     *       name: authorization
     *       description: Token Autorización
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
     *                 data:
     *                   type: string
     *                   description: Data de la cita creada.
     *                   example: {}
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
    @PostMapping('/', UserAccessLevel.Authenticated)
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { headers, body } = req;
            if (!body) {
                res.status(400).json({ message: 'Body is required' });
                return;
            }
            // remove Bearer if using Bearer Authorization mechanism
            const token = headers.authorization?.replace('Bearer ', '') ?? '';

            // verify request has token
            if (!token) {
                res.status(401).json({ message: 'Invalid token' });
            }

            const request = new CreateAppointmentDTO(body);
            const dtoValidation = await validate(request);
            if (dtoValidation && dtoValidation.length > 0) {
                console.log(dtoValidation);
                const errors = parseValidationErrors(dtoValidation);
                res.status(400).send(errors);
                return;
            }
            // verify token hasn't expired yet
            const isValidToken = await validateToken(token);
            if (isValidToken) {
                res.status(200).json({
                    status: 'OK',
                    data: await this.appointmentService.create(token, request),
                });
            }
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
                message: error.message ?? error?.errors[0]?.message ?? 'Internal Server Error',
            });
               console.error(error);
        }
    }

    @PutMapping('/:id', UserAccessLevel.Authenticated)
    async updated(req: Request, res: Response): Promise<void> {
        try {
            const { headers, body, params } = req;

            if (!body) {
                res.status(400).json({ message: 'Body is required' });
                return;
            }
            // remove Bearer if using Bearer Authorization mechanism
            const token = headers.authorization?.replace('Bearer ', '') ?? '';

            // verify request has token
            if (!token) {
                res.status(401).json({ message: 'Invalid token' });
                return;
            }
            if(!params || !params.id || isNaN(Number(params.id))) {
                res.status(400).json({ message: 'Id is required' });
                return;
            }

            const request = new CreateAppointmentDTO(body);
            const dtoValidation = await validate(request);
            if (dtoValidation && dtoValidation.length > 0) {
                const errors = parseValidationErrors(dtoValidation);
                res.status(400).send(errors);
            }
            // verify token hasn't expired yet
            const isValidToken = await validateToken(token);
            if (isValidToken) {
                res.status(200).json({
                    status: 'OK',
                    data: await this.appointmentService.update(token, request, Number(params.id)),
                });
            }
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
                message: error.message ?? error?.errors[0]?.message ?? 'Internal Server Error',
            });
            console.error(error);
        }
    }
}
