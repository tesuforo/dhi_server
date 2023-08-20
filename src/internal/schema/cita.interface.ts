
import { IPatient, IProfessional, SalaServicio, IService  } from 'internal';

export interface IAppointment {
    id?: number;
    titulo: string;
    inicio: Date; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    fin: Date; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    paciente: IPatient | number;
    profesional: IProfessional | number;
    services: IService[] | number[];
    comentario: string;
    estado: EstadoCita | number;
    user_created?: string; // UUID
    date_created?: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    user_updated?: string; // UUID
    date_updated?: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    estado_pago: EstadoPago | number;
}

export interface CitaSalaServicio {
    id: number;
    citas_id: IAppointment;
    salas_servicios_id: SalaServicio[];
}

export interface CitaServicio {
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