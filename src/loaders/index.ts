import { Application } from 'express';
import express from './express.loader';
import directus from './directus.loader';
import routes from './routes.loader';

export default (app: Application): void => {
    directus();
    express(app);
    routes(app);
};
