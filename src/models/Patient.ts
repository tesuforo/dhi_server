/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable node/no-extraneous-import */
import { AuthInstance as mongoose } from "..";
import { Document } from "mongoose";

export interface IPaciente extends Document {
  tipoDocumento: "CC" | "CE";
  documento: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  edad: number;
  genero: "Masculino" | "Femenino" | "Otro";
  email: string;
  telefono: string;
  ciudad: string;
  distrito: string;
  pais: string;
  zonaResidencial: string;
  eps: string;
  estadoCivil: string;
  ocupacion?: string;
  acudiente?: string;
  fechaRegistro?: Date;
}

const pacienteSchema = new mongoose.Schema({
  tipoDocumento: { type: String, enum: ["CC", "CE"], required: true },
  documento: { type: String, required: true, unique: true },
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  fechaNacimiento: {
    type: Date,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  genero: {
    type: String,
    enum: ["Masculino", "Femenino", "Otro"],
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
  ciudad: {
    type: String,
    required: true,
  },
  distrito: {
    type: String,
    required: true,
  },
  pais: {
    type: String,
    required: true,
  },
  zonaResidencial: {
    type: String,
    required: true,
  },
  eps: {
    type: String,
    required: true,
  },
  estadoCivil: {
    type: String,
    required: true,
  },
  ocupacion: {
    type: String,
    required: false,
  },
  acudiente: {
    type: String,
    required: false,
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model("Patients", pacienteSchema);

module.exports = Patient;
