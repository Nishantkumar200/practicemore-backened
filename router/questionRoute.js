import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  getQuestionDetail,
  postOneQuestionDetail,
} from "../controller/question.js";

const questionRoute = express.Router();;

questionRoute.get("/question/:id", expressAsyncHandler(getQuestionDetail));
questionRoute.post("/question", expressAsyncHandler(postOneQuestionDetail));


export default questionRoute;