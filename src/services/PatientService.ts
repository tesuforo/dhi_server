/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable node/no-extraneous-import */
import { RouteError } from "@src/other/classes";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { UpdateWriteOpResult } from "mongoose";
import { Patient, IPatient } from "@src/models/Patient";

// **** Variables **** //

export const PATIENT_NOT_FOUND_ERROR = "Patient not found";

export default {
  async getAll(): Promise<IPatient[]> {
    return Patient.find({}).sort("registrationDate");
  },

  async create(patient: IPatient): Promise<IPatient> {
    return Patient.create(patient);
  },

  async updateOne(patient: IPatient): Promise<UpdateWriteOpResult> {
    const persists = await Patient.findById(patient._id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        PATIENT_NOT_FOUND_ERROR
      );
    }
    return Patient.updateOne({ _id: patient._id }, patient);
  },

  async remove(_id: string): Promise<IPatient | null> {
    const persists = await Patient.findById(_id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        PATIENT_NOT_FOUND_ERROR
      );
    }
    return Patient.findByIdAndDelete(_id);
  },
} as const;
