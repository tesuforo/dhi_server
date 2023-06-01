/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable node/no-extraneous-import */
import { RouteError } from "@src/other/classes";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { UpdateWriteOpResult } from "mongoose";
import { Service, IService } from "@src/models/Service";

// **** Variables **** //

export const Service_NOT_FOUND_ERROR = "Service not found";

export default {
  async getAll(): Promise<IService[]> {
    return Service.find({}).sort("date");
  },

  async create(service: IService): Promise<IService> {
    return Service.create(service);
  },

  async updateOne(service: IService): Promise<UpdateWriteOpResult> {
    const persists = await Service.findById(service._id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        Service_NOT_FOUND_ERROR
      );
    }
    return Service.updateOne({ _id: service._id }, service);
  },

  async remove(_id: string): Promise<IService | null> {
    const persists = await Service.findById(_id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        Service_NOT_FOUND_ERROR
      );
    }
    return Service.findByIdAndDelete(_id);
  },
} as const;
