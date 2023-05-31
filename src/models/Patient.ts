/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable node/no-extraneous-import */
import { AuthInstance as mongoose } from "..";
import { Document } from "mongoose";

export interface IPatient extends Document {
  documentType: { code: string; name: string };
  documentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  age: number;
  gender: "Male" | "Female" | "Other";
  email: string;
  phone: string;
  country: string;
  registered: true | false;
  district?: string;
  city?: string;
  residentialZone?: string;
  eps?: string;
  maritalStatus?: string;
  stratum?: 1 | 2 | 3 | 4 | 5 | 6;
  occupation?: string;
  guardian?: string;
  registrationDate?: Date;
}

const patientSchema = new mongoose.Schema({
  documentType: {
    code: { type: String, required: true },
    name: { type: String, required: true }
  },
  documentNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  registered: { type: Boolean, required: true },
  district: { type: String },
  city: { type: String },
  residentialZone: { type: String },
  eps: { type: String },
  maritalStatus: { type: String },
  stratum: { type: Number, enum: [1, 2, 3, 4, 5, 6] },
  occupation: { type: String },
  guardian: { type: String },
  registrationDate: { type: Date }
});


patientSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
  },
});

export const Patient = mongoose.model<IPatient>(
  "Patients",
  patientSchema
);


