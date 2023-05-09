/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable node/no-extraneous-import */
import { AuthInstance as mongoose } from "..";
import { Document } from "mongoose";

export interface IPaciente extends Document {
  nombre: string;
  apellido: string;
  edad: number;
  genero: "Masculino" | "Femenino" | "Otro";
  email: string;
  telefono: string;
  ciudad: string;
  eps: string;
  fechaRegistro?: Date;
}

const pacienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
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
  eps: {
    type: String,
    required: true,
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model("Patients", pacienteSchema);

module.exports = Patient;
