import { rest, createDirectus, DirectusClient } from '@directus/sdk';
export default (): DirectusClient<any> => {
    const uri = process.env.DIRECTUS_URI ?? '';
    return createDirectus(uri).with(rest());
};
