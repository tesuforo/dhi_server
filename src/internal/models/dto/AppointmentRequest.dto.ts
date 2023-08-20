import {
    IsArray,
    IsString,
    IsDate,
    IsEnum,
    ValidateNested,
    IsDefined,
    IsNumber,
} from 'class-validator';
import { Service } from 'typedi';

export enum StatusAppointment {
    PENDIENTE = 'Pendiente',
    CONFIRMADA = 'Confirmada',
    CANCELADA = 'Cancelada',
    COMPLETADA = 'Completada',
    DESABILITADA = 'Desabilitada',
    REPROGRAMADA = 'Reprogramada',
}

@Service()
export class CreateAppointmentDTO {
    @IsDefined({ message: "The 'title' field is required." })
    @IsString()
    title: string;

    @IsDefined({ message: "The 'start' field is required." })
    @IsDate()
    start: Date;

    @IsDefined({ message: "The 'end' field is required." })
    @IsDate()
    end: Date;

    @IsNumber(
        { allowInfinity: false, allowNaN: false },
        { message: "The 'start' field must be number." },
    )
    patient_id: number;

    @IsDefined({ message: "The 'professional_id' field is required." })
    professional_id: number;

    @IsDefined({ message: "The 'box_id' field is required." })
    box_id: number;

    @IsArray()
    @ValidateNested({ each: true })
    service_id: number[];

    @IsString()
    data_sheet: string;

    @IsString()
    identification: string;

    @IsString()
    first_name: string;
    @IsString()
    middle_name: string;
    @IsString()
    last_name: string;
    @IsString()
    last_name_2: string;
    phone: string;
    @IsString()
    phone_2: string;
    @IsString()
    dialling: string;
    @IsString()
    dialling_2: string;
    @IsString()
    email: string;
    @IsString()
    sent_email: boolean;
    @IsString()
    description: string;

    @IsDefined({ message: "The 'status' field is required." })
    @IsEnum(StatusAppointment)
    status: StatusAppointment;

    constructor(params: {
        title: string;
        start: Date;
        end: Date;
        patient_id: number;
        professional_id: number;
        box_id: number;
        service_id: number[];
        data_sheet: string;
        identification: string;
        first_name: string;

        middle_name: string;
        last_name: string;
        last_name_2: string;
        phone: string;
        phone_2: string;
        dialling: string;
        dialling_2: string;
        email: string;
        sent_email: boolean;
        description: string;
        status: StatusAppointment;
    }) {
        const {
            title,
            start,
            end,
            patient_id,
            professional_id,
            service_id,
            box_id,
            data_sheet,
            identification,
            first_name,
            middle_name,
            last_name,
            last_name_2,
            phone,
            phone_2,
            dialling,
            dialling_2,
            email,
            sent_email,
            description,
            status,
        } = params;
        this.title = title;
        this.start = start;
        this.end = end;
        this.patient_id = patient_id;
        this.professional_id = professional_id;
        this.box_id = box_id;
        this.service_id = service_id;
        this.data_sheet = data_sheet;
        this.identification = identification;
        this.first_name = first_name;
        this.middle_name = middle_name;
        this.last_name = last_name;
        this.last_name_2 = last_name_2;
        this.phone = phone;
        this.phone_2 = phone_2;
        this.dialling = dialling;
        this.dialling_2 = dialling_2;
        this.email = email;
        this.sent_email = sent_email;
        this.description = description;
        this.status = status;
    }
}
