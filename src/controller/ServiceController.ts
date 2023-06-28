import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import ServiceService from "@src/services/ServiceService";

import { IReq, IRes } from "../routes/types/express/misc";
import { IService } from "@src/models/Service";



/**
 * Get all Service.
 * @param {IReq} req - The request object.
 * @param {IRes} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the response object.
 */
const getAll = async (_: IReq, res: IRes) => {
  try {
    const Service = await ServiceService.getAll();
    return res.status(HttpStatusCodes.OK).json({ Service });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

/**
 * Add one Service.
 */
const add = async (req: IReq<IService>, res: IRes) => {
  const Service = req.body;
  await ServiceService.create(Service);
  return res.sendStatus(HttpStatusCodes.CREATED);
};

/**
 * Update one Service.
 */
const update = async (req: IReq<IService>, res: IRes) => {
  const Service = req.body;
  await ServiceService.updateOne(Service);
  return res.sendStatus(HttpStatusCodes.OK);
};

/**
 * Delete one Service.
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
    await ServiceService.remove(id);
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
