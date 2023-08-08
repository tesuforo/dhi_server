import { Service } from 'typedi';
import * as Directus from '@directus/sdk';
import { StatsResponse, IProfessional } from 'internal';

@Service()
export class MutantService {
    constructor() {}

    async isMutant(adn: string[], token: string): Promise<boolean> {
        const n = adn.length; // Tamaño de la tabla NxN
        const sequences = []; // Almacenará las secuencias encontradas

        // Verificar secuencias horizontales, verticales y oblicuas
        for (let i = 0; i < n; i++) {
            let horizontalSequence = '';
            let verticalSequence = '';
            let diagonalRightSequence = '';
            let diagonalLeftSequence = '';

            for (let j = 0; j < n; j++) {
                horizontalSequence += adn[i][j]; // Secuencia horizontal

                verticalSequence += adn[j][i]; // Secuencia vertical

                if (i + j < n) {
                    diagonalRightSequence += adn[j][i + j]; // Secuencia diagonal derecha
                    diagonalLeftSequence += adn[j][n - i - j - 1]; // Secuencia diagonal izquierda
                }
            }

            const sequencesFound = [
                horizontalSequence.match(/([ATCG])\1{3}/g), // Secuencias horizontales de 4 letras iguales
                verticalSequence.match(/([ATCG])\1{3}/g), // Secuencias verticales de 4 letras iguales
                diagonalRightSequence.match(/([ATCG])\1{3}/g), // Secuencias diagonales derechas de 4 letras iguales
                diagonalLeftSequence.match(/([ATCG])\1{3}/g), // Secuencias diagonales izquierdas de 4 letras iguales
            ];

            sequences.push(...sequencesFound.filter((sequence) => sequence));
        }

        try {
            console.log(token);
            const client = Directus.createDirectus(
                process.env.DIRECTUS_URI ?? '',
            )
                .with(Directus.staticToken(token))
                .with(Directus.rest());
            console.log(client);
            const profesionals = await client.request<IProfessional[]>(
                Directus.readItems('profesionales', {
                    fields: ['*'],
                }),
            );
            console.log(profesionals);
        } catch (error) {
            console.log(error);
        }

        // Verificar si se encontraron más de una secuencia de 4 letras iguales
        return sequences.length > 1;
    }

    async getStats(): Promise<StatsResponse> {
        // Trae de la BD los registros guardados
        /* const adns = await this.adnRepository.model.find({ status: true });
        if (adns?.length) {
            // Calcular estadísticas
            const countMutantDna = adns.filter((adn) => adn.isMutant).length;
            const countHumanDna = adns.filter((adn) => !adn.isMutant).length;
            const ratio = countHumanDna !== 0 ? countMutantDna / countHumanDna : countMutantDna;
            // Devolver estadísticas en formato JSON
            return {
                count_mutant_dna: countMutantDna,
                count_human_dna: countHumanDna,
                ratio: ratio.toFixed(2)
            };
        }*/

        return {};
    }
}
