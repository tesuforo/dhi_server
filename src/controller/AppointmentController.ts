import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import AppointmentService from "@src/services/AppointmentService";

import { IReq, IRes } from "../routes/types/express/misc";
import { IAppointment } from "@src/models/Appointment";

/**
 * Get all appointments.
 * @param {IReq} req - The request object.
 * @param {IRes} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the response object.
 */
const getAll = async (_: IReq, res: IRes) => {
  try {
    const appointments = await AppointmentService.getAll();
    return res.status(HttpStatusCodes.OK).json({ appointments });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

/**
 * Add one appointment.
 */
const add = async (req: IReq<IAppointment>, res: IRes) => {
  const appointment = req.body;
  await AppointmentService.create(appointment);
  return res.sendStatus(HttpStatusCodes.CREATED);
};

/**
 * Update one appointment.
 */
const update = async (req: IReq<IAppointment>, res: IRes) => {
  const appointment = req.body;
  await AppointmentService.updateOne(appointment);
  return res.sendStatus(HttpStatusCodes.OK);
};

/**
 * Delete one appointment.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
const delete_ = async (req: IReq, res: IRes) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    return res.sendStatus(HttpStatusCodes.BAD_REQUEST);
  }
  try {
    await AppointmentService.remove(id);
    return res.sendStatus(HttpStatusCodes.OK);
  } catch (error) {
    console.error(error);
    return res.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// **** Export default **** //

export default {
  getAll,
  add,
  update,
  delete: delete_,
} as const;
