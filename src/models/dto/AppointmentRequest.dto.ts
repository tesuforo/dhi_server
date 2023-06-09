import {
  IsArray,
  IsString,
  IsDate,
  IsEnum,
  IsMongoId,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import { Schema } from 'mongoose';
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

  @IsDefined({ message: "The 'patientId' field is required." })
  @IsMongoId()
  patientId: string | Schema.Types.ObjectId;

  @IsDefined({ message: "The 'doctorId' field is required." })
  @IsMongoId()
  doctorId: string | Schema.Types.ObjectId;

  @IsArray()
  @ValidateNested({ each: true })
  @IsMongoId({ each: true })
  servicesId: string[] | Schema.Types.ObjectId[];

  @IsString()
  reason: string;

  @IsDefined({ message: "The 'status' field is required." })
  @IsEnum(StatusAppointment)
  status: StatusAppointment;

  constructor(params: {
    title: string;
    start: Date;
    end: Date;
    patientId: string | Schema.Types.ObjectId;
    doctorId: string | Schema.Types.ObjectId;
    servicesId: string[] | Schema.Types.ObjectId[];
    reason: string;
    status: StatusAppointment;
  }) {
    const {
      title,
      start,
      end,
      patientId,
      doctorId,
      servicesId,
      reason,
      status,
    } = params;
    this.title = title;
    this.start = start;
    this.end = end;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.servicesId = servicesId;
    this.reason = reason;
    this.status = status;
  }
}
