import express from 'express'
import expressAsyncHandler from 'express-async-handler';
import { sendLinkToFreind } from '../controller/session.js';
export const sessionRoute = express.Router();
sessionRoute.post("/session/join",expressAsyncHandler(sendLinkToFreind))

