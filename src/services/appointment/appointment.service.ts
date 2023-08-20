import { CreateAppointmentDTO, IAppointment, IPatient } from 'internal';
import { Service } from 'typedi';
import * as Directus from '@directus/sdk';
import app from '../../app';
@Service()
export class AppointmentService {
    constructor() {}

    async create(token: string, request: CreateAppointmentDTO) {
        const client = Directus.createDirectus(process.env.DIRECTUS_URI ?? '')
            .with(Directus.staticToken(token))
            .with(Directus.rest());

        let patientCreate;
        if (!request.patient_id) {
            const patient: IPatient = {
                documento: request.identification,
                nombres: request.first_name + ' ' + request.middle_name,
                apellido_paterno: request.last_name,
                apellido_materno: request.last_name_2,
                correo: request.email,
                telefono: request.phone,
                registrado: false,
                estado: 'Pendiente',
            };

            patientCreate = await client.request<IPatient>(
                Directus.createItem('pacientes', patient),
            );
        }

        const appointment: IAppointment = {
            titulo: request.title,
            inicio: request.start,
            fin: request.end,
            paciente: patientCreate ?? request.patient_id,
            profesional: request.professional_id,
            services: request.service_id,
            comentario: request.description,
            estado: 1,
            estado_pago: 1,
        };

        const appoinmentCreate = await client.request<IAppointment>(
            Directus.createItem('citas', appointment),
        );

        patientCreate = appoinmentCreate.paciente as IPatient;

        return {
            event_id: appoinmentCreate.id,
            title: appoinmentCreate.titulo,
            start: appoinmentCreate.inicio,
            end: appoinmentCreate.fin,
            professional_id: appoinmentCreate.profesional,
            box_id: 0,
            service_id: appoinmentCreate.services,
            client_id: appoinmentCreate.paciente,
            data_sheet: '',
            identification: patientCreate.documento,
            first_name: patientCreate.nombres,
            middle_name: patientCreate.nombres,
            last_name: patientCreate.apellido_paterno,
            last_name_2: patientCreate.apellido_materno,
            phone: patientCreate.telefono,
            phone_2: patientCreate.telefono,
            dialling: '',
            dialling_2: 'string',
            email: patientCreate.correo,
            sent_email: false,
            description: appoinmentCreate.comentario,
        };
    }
}
