import { Application } from 'express';
import express from './express.loader';
//import directus from './directus.loader';
import routes from './routes.loader';

export default (app: Application): void => {
    express(app);
    routes(app);
};
