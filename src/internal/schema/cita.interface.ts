
import { IPatient, IProfessional, ISalaServicio, IService  } from 'internal';

export interface IAppointment {
    id?: number;
    titulo: string;
    inicio: Date; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    fin: Date; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    paciente?: IPatient | number;
    profesional: IProfessional | number;
    servicios: ICitaSalaServicio[];
    enviar_correo: boolean;
    comentario: string;
    estado?: EstadoCita | number;
    user_created?: string; // UUID
    date_created?: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    user_updated?: string; // UUID
    date_updated?: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    estado_pago?: EstadoPago | number;
}

export interface ICitaSalaServicio {
    id?: number | string;
    citas_id: IAppointment | number | string;
    salas_servicios_id: ISalaServicio | number;
}

export interface ICitaServicio {
    id: number;
    citas_id: IAppointment;
    servicios_id: IService;
}

export interface EstadoCita {
    id: number;
    estado: string;
    nombre: string;
    color: string;
}

export interface EstadoPago {
    id: number;
    estado: string;
    user_created: string; // UUID
    date_created: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    user_updated: string; // UUID
    date_updated: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    code: string;
    nombre: string;
}