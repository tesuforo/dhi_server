/* eslint-disable node/no-extraneous-import */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import "./pre-start"; // Must be the first import
import logger from "jet-logger";

import EnvVars from "@src/constants/EnvVars";
import server from "./server";

// Import required modules
import mongoose from "mongoose";

// Connect to the MongoDB database
mongoose
  .connect(EnvVars.MongoDBURI, {autoCreate: true})
  .then(() => {
    logger.info("Connected to MongoDB...");
  })
  .catch((err: { message: string }) => {
    logger.err(`Could not connect to MongoDB: ${err.message}`);
  });

export const AuthInstance = new mongoose.Mongoose();

const SERVER_START_MSG =
  "Express server started on port: " + EnvVars.Port.toString();

server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));
