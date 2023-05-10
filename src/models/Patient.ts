/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable node/no-extraneous-import */
import { AuthInstance as mongoose } from "..";
import { Document } from "mongoose";

export interface IPaciente extends Document {
  tipoDocumento: { code: string; name: string };
  documento: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  edad: number;
  genero: "Masculino" | "Femenino" | "Otro";
  email: string;
  telefono: string;
  pais: string;
  registrado: true | false;
  distrito?: string;
  ciudad?: string;
  zonaResidencial?: string;
  eps?: string;
  estadoCivil?: string;
  estrato?: 1 | 2 | 3 | 4 | 5 | 6;
  ocupacion?: string;
  acudiente?: string;
  fechaRegistro?: Date;
}

const pacienteSchema = new mongoose.Schema({
  tipoDocumento: { type: Object, required: true },
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
  pais: {
    type: String,
    required: true,
  },
  registrado: {
    type: Boolean,
    required: true,
  },
  distrito: {
    type: String,
    required: false,
  },
  ciudad: {
    type: String,
    required: false,
  },
  zonaResidencial: {
    type: String,
    required: false,
  },
  eps: {
    type: String,
    required: false,
  },
  estadoCivil: {
    type: String,
    required: false,
  },
  estrato: {
    type: String,
    enum: [1, 2, 3, 4, 5, 6],
    required: false,
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

pacienteSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
  },
});

const Patient = mongoose.model("Patients", pacienteSchema);

module.exports = Patient;
