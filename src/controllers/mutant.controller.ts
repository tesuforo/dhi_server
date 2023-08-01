import {
    GetMapping,
    PostMapping,
    RestController,
    UserAccessLevel,
} from 'internal';
import { MutantService } from 'services';
import { Request, Response } from 'express';
import { MutantRequestDTO } from 'internal';
import { validate } from 'class-validator';
import { parseValidationErrors } from 'utils';

@RestController('/mutant', UserAccessLevel.Public)
export class MutantController {
    constructor(private mutantService: MutantService) {}

    /**
     * @swagger
     * /rest/mutant:
     *   post:
     *     summary: Calcula el ADN de los humanos para saber si es mutante
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               dna:
     *                 type: array
     *                 description: ADN analizar.
     *                 example: ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCACTA","CCACTA"]
     *     responses:
     *       200:
     *         description: Respuesta cuando es mutante
     *         content:
     *           application/text:
     *             schema:
     *               type: string
     *               example: OK
     *       400:
     *         description: Respuesta cuando existe un error de validaciones
     *       403:
     *         description: Respuesta cuando no es mutante
     */
    @PostMapping('/', UserAccessLevel.Authenticated)
    async isMutant(req: Request, res: Response) {
        const { body, headers } = req;

        const request = new MutantRequestDTO(body);
        const dtoValidation = await validate(request);
        if (dtoValidation && dtoValidation.length > 0) {
            const errors = parseValidationErrors(dtoValidation);
            res.status(400).send(errors);
        }
        try {
            const data = await this.mutantService.isMutant(
                request.dna.map((str) => str.toUpperCase()),
                headers.authorization?.replace('Bearer ','') ?? '',
            );
            if (data) {
                res.send('OK');
            } else {
                res.status(403).send('Error');
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }

    /**
     * @swagger
     * /rest/mutant/stats:
     *   get:
     *     summary: Consulta las estadisticas sobre los mutantes reclutados
     *     responses:
     *       200:
     *         description: Respuesta exitosa
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 count_mutant_dna:
     *                   type: integer
     *                   description: conteo de mutantes reclutados.
     *                   example: 4
     *                 count_human_dna:
     *                   type: integer
     *                   description: conteo de humanos encontrados.
     *                   example: 2
     *                 ratio:
     *                   type: string
     *                   description: ratio de efectividad.
     *                   example: 2.00
     *
     */
    @GetMapping('/stats')
    async getStats(_req: Request, res: Response) {
        try {
            res.send(await this.mutantService.getStats());
        } catch (err) {
            res.status(400).send(err);
        }
    }
}
