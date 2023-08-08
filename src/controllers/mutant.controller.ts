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


    @GetMapping('/stats')
    async getStats(_req: Request, res: Response) {
        try {
            res.send(await this.mutantService.getStats());
        } catch (err) {
            res.status(400).send(err);
        }
    }
}
