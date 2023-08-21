import { IService  } from 'internal';

export interface ISala {
    id: number;
    estado: string;
    nombre: string;
    color: string;
    user_created: string; // UUID
    date_created: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    user_updated: string; // UUID
    date_updated: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
}

export interface ISalaServicio {
    id: number;
    salas_id: ISala;
    servicios_id: IService[];
}