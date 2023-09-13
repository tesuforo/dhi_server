/**
 * Miscellaneous shared functions go here.
 */

import { differenceBy, isEmpty } from 'lodash';

/**
 * Get a random number between 1 and 1,000,000,000,000
 */
export function getRandomInt(): number {
    return Math.floor(Math.random() * 1_000_000_000_000);
}

/**
 * Wait for a certain number of milliseconds.
 */
export function tick(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}

export function findChanges(original: any, updated: any) {
    const changes = {} as any;

    for (const key in updated) {
        const originalValue = original[key];
        const updatedValue = updated[key];

        if (isArray(originalValue) && isArray(updatedValue)) {
            changes[key] = differenceBy(
                updatedValue,
                originalValue,
                JSON.stringify,
            );
        } else if (isObject(originalValue) && isObject(updatedValue)) {
            const changes = findObjectChanges(originalValue, updatedValue);
            if (!isEmpty(changes)) {
                changes[key] = changes;
            }
        } else if (
            isStringDateISO(originalValue) &&
            isStringDateISO(updatedValue)
        ) {
            if (findDateChanges(originalValue, updatedValue))
                changes[key] = updatedValue;
        } else if (originalValue !== updatedValue) {
            changes[key] = updatedValue;
        }
    }

    return changes;
}

function isArray(value: any) {
    return Array.isArray(value);
}

function isObject(value: any) {
    return value && typeof value === 'object';
}

function isUndefined(value: any) {
    return typeof value === 'undefined';
}

export function isDate(value: any) {
    return value instanceof Date;
}

function isStringDateISO(value: any) {
    const regexDateISO =
        /[+-]?^\d{4}-[01]\d-[0-3]\d(((T[0-2]\d:[0-5]\d:?([0-5]\d(\.\d+)?)?([+-][0-2]\d:[0-5]\d)?Z?)?)?)?/;
    return regexDateISO.exec(value) !== null;
}

function findArrayChanges(original: any, updated: any) {
    const changes = [];

    for (let i = 0; i < updated.length; i++) {
        if (!updated[i]) continue;

        if (
            (isObject(original[i]) || isUndefined(original[i])) &&
            isObject(updated[i]) &&
            JSON.stringify(original[i] ?? {}) !== JSON.stringify(updated[i])
        ) {
            changes.push(updated[i]);
        } else if (
            !isObject(original[i]) &&
            !isObject(updated[i]) &&
            original[i] !== updated[i]
        ) {
            changes.push(updated[i]);
        }
    }

    return changes;
}

function findObjectChanges(original: any, updated: any) {
    const changes = {} as any;

    for (const key in updated) {
        if (!original.hasOwnProperty(key)) continue;

        const originalValue = original[key];
        const updatedValue = updated[key];

        if (isArray(originalValue) && isArray(updatedValue)) {
            changes[key] = findArrayChanges(originalValue, updatedValue);
        } else if (
            isObject(originalValue) &&
            isObject(updatedValue) &&
            JSON.stringify(originalValue) !== JSON.stringify(updatedValue)
        ) {
            changes[key] = updatedValue;
        } else if (
            !isObject(originalValue) &&
            !isObject(updatedValue) &&
            originalValue !== updatedValue
        ) {
            changes[key] = updatedValue;
        }
    }

    return changes;
}

function findDateChanges(original: any, updated: any) {
    const originalDate = new Date(
        original.includes('.000Z') ? original : original + '.000Z',
    );
    const updatedDate = new Date(
        updated.includes('.000Z') ? updated : updated + '.000Z',
    );
    return originalDate.getTime() !== updatedDate.getTime();
}

class DateValidatorError extends Error {
    code: string;
    constructor(code: string, message: string) {
        super(message);
        this.name = 'DateValidatorError';
        this.code = code;
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        } else {
            (this as any).__proto__ = actualProto;
        }
    }

    sayHello() {
        return 'hello ' + this.message;
    }
}

export function validateDateStartEnd(start: Date, end: Date) {
    // Obtener la fecha actual en UTC
    const fechaActual = new Date();

    // Ajustar la fecha actual a la 1am en UTC
    fechaActual.setUTCHours(1, 0, 0, 0);

    // Convertir las cadenas de fecha en objetos Date en UTC
    const fechaInicioUTC = new Date(start);
    const fechaFinUTC = new Date(end);

    // Validar que las cadenas de fecha sean en formato válido
    if (isNaN(fechaInicioUTC.getTime()) || isNaN(fechaFinUTC.getTime())) {
        throw new DateValidatorError(
            'DATE_ERROR',
            'Las fechas ingresadas no son válidas.',
        );
    }

    // Validar que la fecha de inicio no sea mayor que la de fin
    if (fechaInicioUTC >= fechaFinUTC) {
        throw new DateValidatorError(
            'START_DATE_ERROR',
            'La fecha de inicio no puede ser mayor o igual que la fecha de fin.',
        );
    }

    // Validar que la fecha de inicio no sea menor que la 1am del día actual en UTC
    if (fechaInicioUTC < fechaActual) {
        throw new DateValidatorError(
            'OLD_DATE_ERROR',
            'La fecha de inicio no puede ser menor que la 1am del día actual en UTC o está intentando actualizar una cita antigua.',
        );
    }
}
