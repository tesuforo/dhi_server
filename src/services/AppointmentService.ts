/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable node/no-extraneous-import */
import { RouteError } from "@src/other/classes";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { IAppointment, Appointment } from "@src/models/Appointment";
import { UpdateWriteOpResult } from "mongoose";

// **** Variables **** //

export const APPOINTMENT_NOT_FOUND_ERROR = "Appointment not found";

export default {
  async getAll(): Promise<IAppointment[]> {
    return Appointment.find({}).sort("date");
  },

  async create(appointment: IAppointment): Promise<IAppointment> {
    return Appointment.create(appointment);
  },

  async updateOne(appointment: IAppointment): Promise<UpdateWriteOpResult> {
    const persists = await Appointment.findById(appointment._id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        APPOINTMENT_NOT_FOUND_ERROR
      );
    }
    return Appointment.updateOne({ _id: appointment._id }, appointment);
  },

  async remove(_id: string): Promise<IAppointment | null> {
    const persists = await Appointment.findById(_id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        APPOINTMENT_NOT_FOUND_ERROR
      );
    }
    return Appointment.findByIdAndDelete(_id);
  },
} as const;
