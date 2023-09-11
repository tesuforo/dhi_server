import {
    BlockAppointmentDTO,
    CreateAppointmentDTO,
    IAppointment,
    ICitaSalaServicio,
    IPatient,
} from 'internal';
import { Service } from 'typedi';
import * as Directus from '@directus/sdk';
import { isDirectusError, findChanges } from 'utils';

@Service()
export class AppointmentService {
    constructor() {}

    async create(token: string, request: CreateAppointmentDTO) {
        this.validateDateStartEnd(request.start, request.end);
        const client = Directus.createDirectus(process.env.DIRECTUS_URI ?? '')
            .with(Directus.staticToken(token))
            .with(Directus.rest());

        let patientCreate;

        if (!request.client_id) {
            const patient: IPatient = {
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
        this.validateDateStartEnd(request.start, request.end);
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
        this.validateDateStartEnd(request.start, request.end);

        if (!request.client_id) {
            throw new Error('Client id is required');
        }

        const client = Directus.createDirectus(process.env.DIRECTUS_URI ?? '')
            .with(Directus.staticToken(token))
            .with(Directus.rest());

        const patient: IPatient = {
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
            Directus.readItem('citas', id, { fields: ['*', 'servicios.*'] }),
        );

        const updateOnlyChanges = findChanges(appoinmentCurrent, appointment);
        if (updateOnlyChanges.inicio || updateOnlyChanges.enviar_correo) {
            updateOnlyChanges.enviar_correo =
                updateOnlyChanges.enviar_correo ??
                appoinmentCurrent.enviar_correo;
        }
        if (Object.keys(updateOnlyChanges).length > 0) {
            await client.request<IAppointment>(
                Directus.updateItem('citas', id, updateOnlyChanges),
            );
        }

        return request;
    }

    private validateDateStartEnd(start: Date, end: Date) {
        // Obtener la fecha actual en UTC
        const fechaActual = new Date();

        // Ajustar la fecha actual a la 1am en UTC
        fechaActual.setUTCHours(1, 0, 0, 0);

        // Convertir las cadenas de fecha en objetos Date en UTC
        const fechaInicioUTC = new Date(start);
        const fechaFinUTC = new Date(end);

        // Validar que las cadenas de fecha sean en formato válido
        if (isNaN(fechaInicioUTC.getTime()) || isNaN(fechaFinUTC.getTime())) {
            throw new Error('Las fechas ingresadas no son válidas.');
        }

        // Validar que la fecha de inicio no sea mayor que la de fin
        if (fechaInicioUTC >= fechaFinUTC) {
            throw new Error(
                'La fecha de inicio no puede ser mayor o igual que la fecha de fin.',
            );
        }

        // Validar que la fecha de inicio no sea menor que la 1am del día actual en UTC
        if (fechaInicioUTC < fechaActual) {
            throw new Error(
                'La fecha de inicio no puede ser menor que la 1am del día actual en UTC.',
            );
        }
    }
}
