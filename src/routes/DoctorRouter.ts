/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express, { Router } from "express";
import jetValidator from "jet-validator";

import Paths from "./constants/Paths";
import DoctorRoutes from "../controller/DoctorController";

const validateDoctor = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { title, start, end, patientId, doctorId, reason, status } = req.body;
  if (
    !title ||
    !start ||
    !end ||
    !patientId ||
    !doctorId ||
    !reason ||
    !status
  ) {
    return res.status(400).send("Invalid appointment data.");
  }
  next();
};

// **** Variables **** //

const router = Router(),
  validate = jetValidator();

// ** Add AppointRouter ** //
const doctorRouter = Router();

// Get all appoints
doctorRouter.get(Paths.Doctor.Get, DoctorRoutes.getAll);

// Add one appoint
doctorRouter.post(Paths.Doctor.Add, DoctorRoutes.add);

// Update one appoint
doctorRouter.put(
  Paths.Doctor.Update,
  validateDoctor,
  DoctorRoutes.update
);

// Delete one appoint
doctorRouter.delete(
  Paths.Doctor.Delete,
  validate(["id", "string", "params"]),
  DoctorRoutes.delete
);

// Add AppointRouter
router.use(Paths.Doctor.Base, doctorRouter);

// **** Export default **** //

export default router;
