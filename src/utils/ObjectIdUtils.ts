import { ObjectId } from 'bson';

type Nullable<T> = T | null;
export class ObjectIdUtils {

    /**
     * Wrapper for the `ObjectId` constructor that throws an exception on a `null`
     * or `undefined` input instead of returning a new `ObjectId`.
     */
    static instantiate(id: Nullable<string | number | ObjectId>): ObjectId {
        if (id == null) {
            throw Error('Input ID is null or undefined.');
        }
        if (!ObjectId.isValid(id)) {
            throw Error(`'${id}' is not a valid ObjectId.`);
        }
        return new ObjectId(id);
    }

    static toString(id: ObjectId): string {
        return id.toString();
    }

}
