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
        if (
            object1.hasOwnProperty(key) &&
            object2.hasOwnProperty(key) &&
            object1[key] !== object2[key]
        ) {
            result[key] = object2[key];
        }
    }

    return result;
}
