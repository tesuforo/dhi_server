
interface ParsedQs { [key: string]: undefined | Query }

type Nullable<T> = T | null;

type Query = Nullable<string | Array<string> | ParsedQs | Array<ParsedQs>>;

export class HttpRequestUtils {

    /**
     * Parses a string of comma delimited integers from request params.
     * 
     * @deprecated Current not in use
     */
    static parseIntegerList(query: Query): Array<number> {
        const values = HttpRequestUtils.flattenParamsList(query);
        return values.map(Number).filter(Number.isInteger);
    }

    /**
     * Parses a string of comma delimited values from request params.
     * 
     * @deprecated Current not in use
     */
    static flattenParamsList(query: Query, result: Array<string> = []): Array<string> {
        if (!query) {
            return result;
        }
        if (typeof query === 'string') {
            if (query.indexOf(',') === -1) {
                result.push(query);
            } else {
                result.push(...query.split(','));
            }
            return result;
        }
        if (Array.isArray(query)) {
            for (const sub of query) {
                this.flattenParamsList(sub, result);
            }
        }
        return result;
    }

}
