import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import AppointmentService from "@src/services/AppointmentService";

import { IReq, IRes } from "../routes/types/express/misc";
import { IAppointment } from "@src/models/Appointment";

/**
 * Get all appointments.
 */
async function getAll(_: IReq, res: IRes) {
  const appointments = await AppointmentService.getAll();
  return res.status(HttpStatusCodes.OK).json({ appointments });
}

/**
 * Add one appointment.
 */
async function add(req: IReq<IAppointment>, res: IRes) {
  const appointment = req.body;
  await AppointmentService.addOne(appointment);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one appointment.
 */
async function update(req: IReq<IAppointment>, res: IRes) {
  const appointment = req.body;
  await AppointmentService.updateOne(appointment);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one appointment.
 */
async function delete_(req: IReq, res: IRes) {
  const id = req.params.id;
  await AppointmentService.delete(id);
  return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //

export default {
  getAll,
  add,
  update,
  delete: delete_,
} as const;
