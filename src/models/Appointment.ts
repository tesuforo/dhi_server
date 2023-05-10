/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable node/no-extraneous-import */
//import { AuthInstance as mongoose } from "..";
import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  title: string;
  start: Date;
  end: Date;
  patientId: Schema.Types.ObjectId;
  doctorId: Schema.Types.ObjectId;
  servicesId: Schema.Types.ObjectId[];
  reason: string;
}

const appointmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    patientId: { type: Schema.Types.ObjectId, required: true, ref: "Patients" },
    doctorId: { type: Schema.Types.ObjectId, required: true, ref: "Doctors" },
    servicesId: [
      { type: Schema.Types.ObjectId, required: true, ref: "Services" },
    ],
    reason: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

appointmentSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
  },
});

export const Appointment = mongoose.model<IAppointment>(
  "Appointments",
  appointmentSchema
);
