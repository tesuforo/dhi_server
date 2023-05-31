/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable node/no-extraneous-import */
import { RouteError } from "@src/other/classes";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { UpdateWriteOpResult } from "mongoose";
import { Doctor, IDoctor } from "@src/models/Doctor";

// **** Variables **** //

export const DOCTOR_NOT_FOUND_ERROR = "Doctor not found";

export default {
  async getAll(): Promise<IDoctor[]> {
    return Doctor.find({}).sort("date");
  },

  async create(appointment: IDoctor): Promise<IDoctor> {
    return Doctor.create(appointment);
  },

  async updateOne(appointment: IDoctor): Promise<UpdateWriteOpResult> {
    const persists = await Doctor.findById(appointment._id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        DOCTOR_NOT_FOUND_ERROR
      );
    }
    return Doctor.updateOne({ _id: appointment._id }, appointment);
  },

  async remove(_id: string): Promise<IDoctor | null> {
    const persists = await Doctor.findById(_id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        DOCTOR_NOT_FOUND_ERROR
      );
    }
    return Doctor.findByIdAndDelete(_id);
  },
} as const;
