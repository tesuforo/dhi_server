/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express, { Router } from "express";
import jetValidator from "jet-validator";

import Paths from "./constants/Paths";
import PatientRoutes from "../controller/PatientController";

const validatePatient = (
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
const patientRouter = Router();

// Get all appoints
patientRouter.get(Paths.Patient.Get, PatientRoutes.getAll);

// Add one appoint
patientRouter.post(Paths.Patient.Add, PatientRoutes.add);

// Update one appoint
patientRouter.put(
  Paths.Patient.Update,
  validatePatient,
  PatientRoutes.update
);

// Delete one appoint
patientRouter.delete(
  Paths.Patient.Delete,
  validate(["id", "string", "params"]),
  PatientRoutes.delete
);

// Add AppointRouter
router.use(Paths.Patient.Base, patientRouter);

// **** Export default **** //

export default router;
