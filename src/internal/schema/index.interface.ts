import { IAppointment } from "./cita.interface";
import { IPatient } from "./paciente.interface";
import { IProfessional } from "./profesional.interface";
import { IService } from "./servicio";


export type Schema = {
	cita: IAppointment[];
    paciente: IPatient[];
    profesionales: IProfessional[];
    servicio: IService[];
}
