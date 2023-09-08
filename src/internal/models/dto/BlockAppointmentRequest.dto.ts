import {
    IsString,
    IsDefined,
    IsNumber,
    IsBoolean,
    IsOptional,
    IsDateString
} from 'class-validator';
import { Service } from 'typedi';

@Service()
export class BlockAppointmentDTO {
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

    @IsString()
    @IsOptional()
    description: string;
    
    @IsNumber(
        { allowInfinity: false, allowNaN: false },
        { message: "The 'state_id' field must be number." },
    )
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
            title,
            start,
            end,
            professional_id,
            sent_email_profesional,
            description,
            state_id,
            pay_id,
        } = params;
        this.title = title;
        this.start = start;
        this.end = end;
        this.professional_id = professional_id;
        this.sent_email_profesional = sent_email_profesional;
        this.description = description;
        this.state_id = state_id;
        this.pay_id = pay_id;
    }
}
