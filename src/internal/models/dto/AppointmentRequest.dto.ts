import {
    IsArray,
    IsString,
    IsDefined,
    IsNumber,
    IsBoolean,
    IsOptional,
    IsDateString,
    ArrayNotEmpty
} from 'class-validator';
import { Service } from 'typedi';

@Service()
export class CreateAppointmentDTO {
    @IsNumber(
        { allowInfinity: false, allowNaN: false },
        { message: "The 'event_id' field must be number." },
    )
    @IsOptional()
    event_id: number;

    @IsDefined({ message: "The 'title' field is required." })
    @IsString()
    title: string;

    @IsDefined({ message: "The 'start' field is required." })
    @IsDateString()
    start: Date;

    @IsDefined({ message: "The 'end' field is required." })
    @IsDateString()
    end: Date;

    @IsNumber(
        { allowInfinity: false, allowNaN: false },
        { message: "The 'client_id' field must be number." },
    )
    @IsOptional()
    client_id: number;

    @IsDefined({ message: "The 'professional_id' field is required." })
    professional_id: number;

    @IsDefined({ message: "The 'box_id' field is required." })
    box_id: number;

    @IsArray()
    @ArrayNotEmpty({ message: 'The list of services not empty' })
    @IsNumber({},{each: true})
    @IsDefined({
        message: "The  Array 'service_id' field is required.",
    })
    service_id: number[];

    @IsString()
    @IsOptional()
    data_sheet: string;

    @IsString()
    @IsOptional()
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
    @IsBoolean()
    @IsOptional()
    sent_email: boolean;
    @IsString()
    description: string;
    @IsNumber(
        { allowInfinity: false, allowNaN: false },
        { message: "The 'state_id' field must be number." },
    )
    @IsOptional()
    state_id: number;

    @IsNumber(
        { allowInfinity: false, allowNaN: false },
        { message: "The 'pay_id' field must be number." },
    )
    @IsOptional()
    pay_id: number;

    @IsOptional()
    identification_type: string;

    constructor(params: {
        event_id: number;
        title: string;
        start: Date;
        end: Date;
        client_id: number;
        professional_id: number;
        box_id: number;
        service_id: number[];
        data_sheet: string;
        identification_type: string;
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
        state_id: number;
        pay_id: number;
    }) {
        const {
            event_id,
            title,
            start,
            end,
            client_id,
            professional_id,
            service_id,
            box_id,
            data_sheet,
            identification_type,
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
            state_id,
            pay_id,
        } = params;
        this.event_id = event_id;
        this.title = title;
        this.start = start;
        this.end = end;
        this.client_id = client_id;
        this.professional_id = professional_id;
        this.box_id = box_id;
        this.service_id = service_id;
        this.data_sheet = data_sheet;
        this.identification_type = identification_type;
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
        this.state_id = state_id;
        this.pay_id = pay_id;
    }
}
