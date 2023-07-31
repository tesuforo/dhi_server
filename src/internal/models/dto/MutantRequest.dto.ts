import {
    ArrayNotEmpty,
    IsArray,
    IsString,
    Matches,
    MinLength,
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import { Service } from 'typedi';

@ValidatorConstraint({ name: 'custom', async: false })
class ArrayLengthEqualsStringLength implements ValidatorConstraintInterface {
    validate(array: string[], _args: ValidationArguments) {
        const longitudEsperada = array.length;
        return array.every((str) => str.length === longitudEsperada);
    }

    defaultMessage(_args: ValidationArguments) {
        return 'La longitud de cada string debe ser igual al tamaño del arreglo, cumpliento en NxN';
    }
}

@Service()
export class MutantRequestDTO {
    @IsArray()
    @ArrayNotEmpty({ message: 'El listado de ADN no puede estar vacío' })
    @Matches(/^[ATCG]+$/, { message: 'El listado de ADN solo puede contener los caracteres A, T, C y G', each: true })
    @IsString({ each: true, message: 'Todos los elementos deben ser de tipo string' })
    @Validate(ArrayLengthEqualsStringLength)
    @MinLength(4, { each: true, message: 'Cada string debe tener una longitud de 4 caracter' })
    dna: string[];

    constructor(params: { dna: string[] }) {
        const { dna } = params;
        this.dna = dna;
    }
}
