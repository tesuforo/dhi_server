/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable node/no-extraneous-import */
import { AuthInstance as mongoose } from "..";
import { Document } from "mongoose";

export interface IDoctor extends Document {
  nombre: string;
  orden: string;
  especialidad: string;
  experiencia: number;
  email: string;
  telefono: string;
  direccion: string;
  consultorio: string;
  horario: { day: string; start: Date; end: Date }[];
  color: string;
}

const doctorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  especialidad: {
    type: String,
    required: true,
  },
  experiencia: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  consultorio: {
    type: String,
    required: true,
  },
  horario: {
    type: Object,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

doctorSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
  },
});


export const Service = mongoose.model<IDoctor>(
  "Services",
  doctorSchema
);

