/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable node/no-extraneous-import */
import { AuthInstance as mongoose } from "..";
import { Document } from "mongoose";

export interface IDoctor extends Document {
  nombre: string;
  especialidad: string;
  experiencia: number;
  email: string;
  telefono: string;
  direccion: string;
  consultorio: string;
  horario: string;
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
    type: String,
    required: true,
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
