import { CreateAppointmentDTO, IAppointment, IPatient } from 'internal';
import { Service } from 'typedi';
import * as Directus from '@directus/sdk';

@Service()
export class AppointmentService {
    constructor() {}

    async create(token: string, request: CreateAppointmentDTO) {
        const client = Directus.createDirectus(process.env.DIRECTUS_URI ?? '')
            .with(Directus.staticToken(token))
            .with(Directus.rest());

        let patientCreate;
        if (!request.client_id) {
            const patient: IPatient = {
                documento: request.identification,
                nombres: request.first_name + ' ' + request.middle_name,
                apellido_paterno: request.last_name,
                apellido_materno: request.last_name_2,
                correo: request.email,
                telefono: request.dialling + request.phone,
                telefono_2: request.dialling_2 + request.phone_2,
                registrado: false,
            };

            patientCreate = await client.request<IPatient>(
                Directus.createItem('pacientes', patient),
            );
        }

        if (!patientCreate && !request.client_id) {
            throw new Error('Error create Patient or Patient id is required');
        }

        const appointment: IAppointment = {
            titulo: request.title,
            inicio: request.start,
            fin: request.end,
            paciente: patientCreate ?? request.client_id,
            profesional: request.professional_id,
            servicios: request.service_id.map((id) => ({
                citas_id: '+',
                salas_servicios_id: { id },
            })) as any,
            comentario: request.description,
        };

        const appoinmentCreate = await client.request<IAppointment>(
            Directus.createItem('citas', appointment),
        );

        patientCreate = appoinmentCreate.paciente as IPatient;

        return {
            ...request,
            event_id: appoinmentCreate.id,
            client_id: appointment.paciente,
            service_id: appoinmentCreate.servicios,
        };
    }

    async update(token: string, request: CreateAppointmentDTO, id: number) {
        if (!request.client_id) {
            throw new Error('Client id is required');
        }

        const client = Directus.createDirectus(process.env.DIRECTUS_URI ?? '')
            .with(Directus.staticToken(token))
            .with(Directus.rest());

        const patient: IPatient = {
            tipo_documento: request.identification_type,
            nombres: request.first_name + ' ' + request.middle_name,
            apellido_paterno: request.last_name,
            apellido_materno: request.last_name_2,
            correo: request.email,
            telefono: request.dialling + request.phone,
            telefono_2: request.dialling_2 + request.phone_2,
        };

        await client.request<IPatient>(
            Directus.updateItem('pacientes', request.client_id, patient),
        );

        const appointment: IAppointment = {
            titulo: request.title,
            inicio: request.start,
            fin: request.end,
            profesional: request.professional_id,
            servicios: request.service_id.map((idService) => ({
                citas_id: id,
                salas_servicios_id: { id: idService },
            })) as any,
            comentario: request.description,
            estado: request.state_id,
            estado_pago: request.pay_id,
        };

        await client.request<IAppointment>(
            Directus.updateItem('citas', id, appointment),
        );
        return request;
    }
}
