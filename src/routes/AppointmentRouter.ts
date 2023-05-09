/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express, { Router } from "express";
import jetValidator from "jet-validator";

import Paths from "./constants/Paths";
import AppointRoutes from "../controller/AppointmentController";

const validateAppointment = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { title, start, end, patientId, doctorId, reason } = req.body;
  if (!title || !start || !end || !patientId || !doctorId || !reason) {
    return res.status(400).send("Invalid appointment data.");
  }
  next();
};

// **** Variables **** //

const router = Router(),
  validate = jetValidator();

// ** Add AppointRouter ** //
const appointRouter = Router();

// Get all appoints
appointRouter.get(Paths.Appointments.Get, AppointRoutes.getAll);

// Add one appoint
appointRouter.post(
  Paths.Appointments.Add,
  AppointRoutes.add
);

// Update one appoint
appointRouter.put(
  Paths.Appointments.Update,
  validateAppointment,
  AppointRoutes.update
);

// Delete one appoint
appointRouter.delete(
  Paths.Appointments.Delete,
  validate(["id", "string", "params"]),
  AppointRoutes.delete
);


// Add AppointRouter
router.use(Paths.Appointments.Base, appointRouter);

// **** Export default **** //

export default router;
