import mongoose, { Schema, Document } from 'mongoose';
import { IPatient } from './Patient';
import { StatusAppointment } from './dto/AppointmentRequest.dto';

export interface IAppointment extends Document {
  title: string;
  start: Date;
  end: Date;
  patientId: Schema.Types.ObjectId | string;
  doctorId: Schema.Types.ObjectId | string;
  servicesId: Schema.Types.ObjectId[] | string[];
  reason: string;
  status: StatusAppointment;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    patientId: { type: Schema.Types.ObjectId, required: true, ref: 'Patients' },
    doctorId: { type: Schema.Types.ObjectId, required: true, ref: 'Doctors' },
    servicesId: [
      { type: Schema.Types.ObjectId, required: true, ref: 'Services' },
    ],
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: [
        'Pendiente',
        'Confirmada',
        'Cancelada',
        'Completada',
        'Desabilitada',
        'Reprogramada',
      ],
      default: 'Pendiente',
      required: true,
    },
  },
  { timestamps: true },
);

appointmentSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
  },
});

export const Appointment = mongoose.model<IAppointment>(
  'Appointments',
  appointmentSchema,
);

export interface IAppointmentCreateRequest {
  appointment: IAppointment;
  patient: IPatient;
}
