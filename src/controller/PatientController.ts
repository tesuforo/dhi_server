import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import PatientService from "@src/services/PatientService";

import { IReq, IRes } from "../routes/types/express/misc";
import { IPatient } from "@src/models/Patient";



/**
 * Get all patient.
 * @param {IReq} req - The request object.
 * @param {IRes} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the response object.
 */
const getAll = async (_: IReq, res: IRes) => {
  try {
    const patient = await PatientService.getAll();
    return res.status(HttpStatusCodes.OK).json({ patient });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

/**
 * Add one patient.
 */
const add = async (req: IReq<IPatient>, res: IRes) => {
  const patient = req.body;
  await PatientService.create(patient);
  return res.sendStatus(HttpStatusCodes.CREATED);
};

/**
 * Update one patient.
 */
const update = async (req: IReq<IPatient>, res: IRes) => {
  const patient = req.body;
  await PatientService.updateOne(patient);
  return res.sendStatus(HttpStatusCodes.OK);
};

/**
 * Delete one patient.
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
    await PatientService.remove(id);
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
