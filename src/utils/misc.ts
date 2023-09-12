/**
 * Miscellaneous shared functions go here.
 */

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

export function findChanges(object1: any, object2: any) {
    const result = {} as any;

    for (const key in object1) {
        if (Array.isArray(object1[key]) && Array.isArray(object2[key])) {
            for (let i = 0; i < object1[key].length; i++) {
                if (
                    (typeof object1[key][i] === 'object' &&
                        typeof object2[key][i] === 'object' &&
                        Object.entries(object1[key][i]).toString() !==
                            Object.entries(object2[key][i]).toString()) ||
                    (typeof object1[key][i] !== 'object' &&
                        typeof object2[key][i] !== 'object' &&
                        object1[key][i] !== object2[key][i])
                ) {
                    result[key][i] = object2[key][i];
                }
            }
        } else if (
            (object1.hasOwnProperty(key) &&
                object2.hasOwnProperty(key) &&
                typeof object1[key] !== 'object' &&
                typeof object2[key] !== 'object' &&
                object1[key] !== object2[key]) ||
            (typeof object1[key] === 'object' &&
                typeof object2[key] === 'object' &&
                Object.entries(object1[key]).toString() !==
                    Object.entries(object2[key]).toString())
        ) {
            const regexDateIso =
                /[+-]?\d{4}(-[01]\d(-[0-3]\d(T[0-2]\d:[0-5]\d:?([0-5]\d(\.\d+)?)?([+-][0-2]\d:[0-5]\d)?Z?)?)?)?/;
            if (
                typeof object1[key] === 'string' &&
                typeof object2[key] === 'string' &&
                regexDateIso.test(object1[key]) &&
                regexDateIso.test(object2[key])
            ) {
                const date1 = new Date(
                    object1[key].includes('.000Z')
                        ? object1[key]
                        : object1[key] + '.000Z',
                );
                const date2 = new Date(
                    object2[key].includes('.000Z')
                        ? object2[key]
                        : object2[key] + '.000Z',
                );
                if (
                    date1.toString() !== 'Invalid Date' &&
                    date2.toString() !== 'Invalid Date' &&
                    date1.getTime() !== date2.getTime()
                )
                    result[key] = object2[key];
            } else if (object1[key] !== object2[key]) {
                result[key] = object2[key];
            }
        }
    }

    return result;
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
