import cookieParser from 'cookie-parser';
import express, { Application, NextFunction, Request, Response } from 'express';
import multer from 'multer';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Documentación del reclutador de mutantes'
    }
};

const options = {
    swaggerDefinition,
    apis: ['./src/controllers/*.ts']
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default (app: Application): void => {
    app.set('port', process.env.PORT || 3000);
    app.use(cookieParser(), express.json(), express.text(), upload.single('file'));

    const swaggerSpec = swaggerJSDoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // CORS
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
    });
};
