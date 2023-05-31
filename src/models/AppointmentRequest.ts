import { IAppointment } from '@src/models/Appointment';
import { IPatient } from '@src/models/Patient';

export interface IAppointmentCreateRequest {
appointment: IAppointment;
patient: IPatient;
}