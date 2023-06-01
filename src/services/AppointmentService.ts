/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable node/no-extraneous-import */
import { RouteError } from "@src/other/classes";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { IAppointment, Appointment } from "@src/models/Appointment";
import { UpdateWriteOpResult } from "mongoose";
import { Doctor } from "@src/models/Doctor";
import { Patient } from "@src/models/Patient";
import { IAppointmentCreateRequest } from "@src/models/Appointment";
import { DOCTOR_NOT_FOUND_ERROR } from "./DoctorService";
import { PATIENT_NOT_FOUND_ERROR } from "./PatientService";

// **** Variables **** //

export const APPOINTMENT_NOT_FOUND_ERROR = "Appointment not found";

export default {
  async getAll(): Promise<IAppointment[]> {
    return Appointment.find({}).sort("date");
  },

  async create(request: IAppointmentCreateRequest): Promise<IAppointment> {
    const doctor = await Doctor.findById(request.appointment.doctorId);
    if (!doctor) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, DOCTOR_NOT_FOUND_ERROR);
    }

    const patient = await Patient.findById(request.appointment.patientId);
    if (!patient) {
      if (!request.patient) {
        throw new RouteError(
          HttpStatusCodes.NOT_FOUND,
          PATIENT_NOT_FOUND_ERROR
        );
      }
      const newPatient = await Patient.create(request.patient);
      request.appointment.patientId = newPatient._id;
    }
    return await Appointment.create(request.appointment);
  },

  async updateOne(appointment: IAppointment): Promise<UpdateWriteOpResult> {
    const persists = await Appointment.findById(appointment._id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        APPOINTMENT_NOT_FOUND_ERROR
      );
    }
    return await Appointment.updateOne({ _id: appointment._id }, appointment);
  },

  async remove(_id: string): Promise<IAppointment | null> {
    const persists = await Appointment.findById(_id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        APPOINTMENT_NOT_FOUND_ERROR
      );
    }
    return await Appointment.findByIdAndDelete(_id);
  },
} as const;
