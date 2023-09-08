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
export class BlockAppointmentDTO {
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

    @IsDefined({ message: "The 'professional_id' field is required." })
    professional_id: number;

    @IsArray()
    @ArrayNotEmpty({ message: 'The list of services not empty' })
    @IsNumber({}, { each: true })
    @IsDefined({
        message: "The  Array 'service_id' field is required.",
    })
    service_id: number[];

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

    @IsBoolean()
    @IsOptional()
    sent_email_profesional: boolean;

    constructor(params: {
        event_id: number;
        title: string;
        start: Date;
        end: Date;
        professional_id: number;
        service_id: number[];
        sent_email_profesional: boolean;
        description: string;
        state_id: number;
        pay_id: number;
    }) {
        const {
            event_id,
            title,
            start,
            end,
            professional_id,
            service_id,
            sent_email_profesional,
            description,
            state_id,
            pay_id,
        } = params;
        this.event_id = event_id;
        this.title = title;
        this.start = start;
        this.end = end;
        this.professional_id = professional_id;
        this.service_id = service_id;
        this.description = description;
        this.state_id = state_id;
        this.pay_id = pay_id;
        this.sent_email_profesional = sent_email_profesional;
    }
}
