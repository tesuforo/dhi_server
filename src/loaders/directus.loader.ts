/*import { rest, createDirectus, DirectusClient } from '@directus/sdk';
export default (): DirectusClient<any> => {
    const uri = process.env.DIRECTUS_URI ?? '';
    return createDirectus(uri).with(rest());
};



        try {
            console.log(token);
            const client = new Directus<Schema>(process.env.DIRECTUS_URI ?? '');
            await client.auth.static(token);
            console.log(client);
            const profesionals = await client.items<
                'profesionales',
                IProfessional[]
            >('profesionales').readByQuery();
            console.log(profesionals);
        } catch (error) {
            console.log(error);
        }

*/