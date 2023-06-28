import mongoose, { Document } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  specialization: string;
  experience: number;
  email: string;
  phone: string;
  address: string;
  office: string;
  schedule: string;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    office: {
      type: String,
      required: true,
    },
    schedule: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

doctorSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
  },
});

export const Doctor = mongoose.model<IDoctor>("Doctors", doctorSchema);
