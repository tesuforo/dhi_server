import {
    BlockAppointmentDTO,
    CreateAppointmentDTO,
    IAppointment,
    ICitaSalaServicio,
    IPatient,
} from 'internal';
import { Service } from 'typedi';
import * as Directus from '@directus/sdk';
import { isDirectusError, findChanges, validateDateStartEnd } from 'utils';

@Service()
export class AppointmentService {
    constructor() {}

    async create(token: string, request: CreateAppointmentDTO) {
        validateDateStartEnd(request.start, request.end);
        const client = Directus.createDirectus(process.env.DIRECTUS_URI ?? '')
            .with(Directus.staticToken(token))
            .with(Directus.rest());

        let patientCreate;

        if (!request.client_id) {
            const patient: IPatient = {
                full_name: `${request.first_name} ${request.middle_name} ${request.last_name} ${request.last_name_2}`,
                tipo_documento: request.identification_type,
                documento: request.identification,
                primer_nombre: request.first_name,
                segundo_nombre: request.middle_name,
                apellido_paterno: request.last_name,
                apellido_materno: request.last_name_2,
                correo: request.email,
                indicativo: request.dialling,
                telefono: request.phone,
                indicativo_2: request.dialling_2,
                telefono_2: request.phone_2,
                registrado: false,
                ficha_id: { estado: 'published' },
            };

            try {
                patientCreate = await client.request<IPatient>(
                    Directus.createItem('pacientes', patient),
                );
            } catch (error) {
                if (isDirectusError(error)) {
                    throw error;
                }
                console.error(error);
            }
        }

        if (!patientCreate && !request.client_id) {
            throw new Error(
                'Error in create Patient required: [identification, first_name, middle_name, last_name, last_name_2, email, dialling, dialling_2, phone_2] or client_id is required',
            );
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
            })),
            comentario: request.description,
            estado: request.state_id,
            estado_pago: request.pay_id,
            enviar_correo: request.sent_email,
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

    async block(token: string, request: BlockAppointmentDTO) {
        validateDateStartEnd(request.start, request.end);
        const client = Directus.createDirectus(process.env.DIRECTUS_URI ?? '')
            .with(Directus.staticToken(token))
            .with(Directus.rest());
        const services = await client.request<ICitaSalaServicio[]>(
            Directus.readItems('salas_servicios', {
                fields: ['*'],
                filter: {
                    salas_id: { nombre: { _eq: 'Bloqueo' } },
                },
            }),
        );
        if (!services || !services.length) {
            throw new Error('No services found Block');
        }
        const appointment: IAppointment = {
            titulo: request.title,
            inicio: request.start,
            fin: request.end,
            profesional: request.professional_id,
            servicios: services.map(
                (service) =>
                    ({
                        citas_id: '+',
                        salas_servicios_id: { id: service.id },
                    }) as ICitaSalaServicio,
            ),
            comentario: request.description,
            estado: request.state_id,
            estado_pago: request.pay_id,
            enviar_correo: request.sent_email_profesional,
        };

        const appoinmentCreate = await client.request<IAppointment>(
            Directus.createItem('citas', appointment),
        );

        return {
            ...request,
            event_id: appoinmentCreate.id,
            client_id: appointment.paciente,
            service_id: appoinmentCreate.servicios,
        };
    }

    async update(token: string, request: CreateAppointmentDTO, id: number) {
        validateDateStartEnd(request.start, request.end);

        if (!request.client_id) {
            throw new Error('Client id is required');
        }

        const client = Directus.createDirectus(process.env.DIRECTUS_URI ?? '')
            .with(Directus.staticToken(token))
            .with(Directus.rest());

        const patient: IPatient = {
            full_name: `${request.first_name} ${request.middle_name} ${request.last_name} ${request.last_name_2}`,
            tipo_documento: request.identification_type,
            primer_nombre: request.first_name,
            segundo_nombre: request.middle_name,
            apellido_paterno: request.last_name,
            apellido_materno: request.last_name_2,
            correo: request.email,
            indicativo: request.dialling,
            telefono: request.phone,
            indicativo_2: request.dialling_2,
            telefono_2: request.phone_2,
        };

        const patientCurrent = await client.request<IPatient>(
            Directus.readItem('pacientes', request.client_id),
        );

        const updatePatientOnlyChanges = findChanges(patientCurrent, patient);
        console.log(updatePatientOnlyChanges);
        if (Object.keys(updatePatientOnlyChanges).length > 0) {
            await client.request<IPatient>(
                Directus.updateItem('pacientes', request.client_id, patient),
            );
        }

        const appointment: IAppointment = {
            titulo: request.title,
            inicio: request.start,
            fin: request.end,
            profesional: request.professional_id,
            servicios: request.service_id.map((idService) => ({
                citas_id: id,
                salas_servicios_id: { id: idService },
            })),
            comentario: request.description,
            estado: request.state_id,
            estado_pago: request.pay_id,
            enviar_correo: request.sent_email,
        };

        const appoinmentCurrent = await client.request<IAppointment>(
            Directus.readItem('citas', id, {
                fields: [
                    '*',
                    'servicios.citas_id',
                    'servicios.salas_servicios_id.id',
                ],
            }),
        );

        const updateOnlyChanges = findChanges(appoinmentCurrent, appointment);
        if (
            updateOnlyChanges.inicio ||
            updateOnlyChanges.enviar_correo ||
            (updateOnlyChanges.servicios &&
                updateOnlyChanges.servicios.length > 0)
        ) {
            updateOnlyChanges.enviar_correo =
                updateOnlyChanges.enviar_correo ??
                appoinmentCurrent.enviar_correo;
        }
        console.log(updateOnlyChanges);
        if (
            updateOnlyChanges.servicios &&
            updateOnlyChanges.servicios.length === 0
        ) {
            delete updateOnlyChanges.servicios;
        }
        if (Object.keys(updateOnlyChanges).length > 0) {
            await client.request<IAppointment>(
                Directus.updateItem('citas', id, updateOnlyChanges),
            );
        }

        return {
            ...request,
            event_id: id,
            update: updateOnlyChanges,
            updatePatient: updatePatientOnlyChanges,
            correo_enviado: updateOnlyChanges.enviar_correo,
        };
    }
}
