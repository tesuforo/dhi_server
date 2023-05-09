/* eslint-disable node/no-extraneous-import */
import { RouteError } from "@src/other/classes";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { IAppointment, Appointment } from "@src/models/Appointment";
import { UpdateWriteOpResult } from "mongoose";

// **** Variables **** //

export const APPOINTMENT_NOT_FOUND_ERR = "User not found";

// **** Functions **** //

/**
 * Get all users.
 */
function getAll(): Promise<IAppointment[]> {
  return Appointment.find({}).sort("date");
}

/**
 * Add one user.
 */
function addOne(appointment: IAppointment): Promise<IAppointment> {
  return Appointment.create(appointment);
}

/**
 * Update one user.
 */
async function updateOne(
  appointment: IAppointment
): Promise<UpdateWriteOpResult> {
  const persists = await Appointment.findById(appointment._id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, APPOINTMENT_NOT_FOUND_ERR);
  }
  // Return user
  return Appointment.updateOne({}, appointment);
}

/**
 * Delete a user by their id.
 */
async function _delete(_id: string): Promise<IAppointment | null> {
  const persists = await Appointment.findById(_id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, APPOINTMENT_NOT_FOUND_ERR);
  }
  // Delete user
  return Appointment.findByIdAndDelete(_id);
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
} as const;
