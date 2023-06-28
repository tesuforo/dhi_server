/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express, { Router } from "express";
import jetValidator from "jet-validator";

import Paths from "./constants/Paths";
import ServiceRoutes from "../controller/ServiceController";

const validateService = (
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
    return res.status(400).send("Invalid service data.");
  }
  next();
};

// **** Variables **** //

const router = Router(),
  validate = jetValidator();

// ** Add AppointRouter ** //
const serviceRouter = Router();

// Get all appoints
serviceRouter.get(Paths.Service.Get, ServiceRoutes.getAll);

// Add one appoint
serviceRouter.post(Paths.Service.Add, ServiceRoutes.add);

// Update one appoint
serviceRouter.put(
  Paths.Service.Update,
  validateService,
  ServiceRoutes.update
);

// Delete one appoint
serviceRouter.delete(
  Paths.Service.Delete,
  validate(["id", "string", "params"]),
  ServiceRoutes.delete
);

// Add AppointRouter
router.use(Paths.Service.Base, serviceRouter);

// **** Export default **** //

export default router;
