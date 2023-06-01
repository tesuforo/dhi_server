import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import AppointmentService from '@src/services/AppointmentService';

import { IReq, IRes } from '../routes/types/express/misc';
import { IAppointment } from '@src/models/Appointment';
import { IAppointmentCreateRequest } from '@src/models/Appointment';
import { CreateAppointmentDTO } from '@src/models/dto/AppointmentRequest.dto';
import { validate } from 'class-validator';
import { parseValidationErrors } from '@src/util/message';

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
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' });
  }
};

/**
 * Add one appointment.
 */
const add = async (req: IReq<IAppointmentCreateRequest>, res: IRes) => {
  const request = req.body;
  const params: CreateAppointmentDTO = req.body.appointment;

  const valueDto = new CreateAppointmentDTO(params);
  const dtoValidation = await validate(valueDto);
  if (dtoValidation && dtoValidation.length > 0) {
    const errors = parseValidationErrors(dtoValidation);
    return res.sendStatus(404).send(errors);
  }
  await AppointmentService.create(request);
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
  if (!id || typeof id !== 'string') {
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
