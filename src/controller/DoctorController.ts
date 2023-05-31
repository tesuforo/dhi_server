import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import DoctorService from "@src/services/DoctorService";

import { IReq, IRes } from "../routes/types/express/misc";
import { IDoctor } from "@src/models/Doctor";



/**
 * Get all doctor.
 * @param {IReq} req - The request object.
 * @param {IRes} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the response object.
 */
const getAll = async (_: IReq, res: IRes) => {
  try {
    const doctor = await DoctorService.getAll();
    return res.status(HttpStatusCodes.OK).json({ doctor });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

/**
 * Add one doctor.
 */
const add = async (req: IReq<IDoctor>, res: IRes) => {
  const doctor = req.body;
  await DoctorService.create(doctor);
  return res.sendStatus(HttpStatusCodes.CREATED);
};

/**
 * Update one doctor.
 */
const update = async (req: IReq<IDoctor>, res: IRes) => {
  const doctor = req.body;
  await DoctorService.updateOne(doctor);
  return res.sendStatus(HttpStatusCodes.OK);
};

/**
 * Delete one doctor.
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
    await DoctorService.remove(id);
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
