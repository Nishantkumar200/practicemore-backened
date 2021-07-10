import express from 'express'
import expressAsyncHandler  from 'express-async-handler'
import { executeCode } from '../controller/execute.js';


const executionRoute = express.Router();

executionRoute.post('/executeCode',expressAsyncHandler(executeCode))

export default executionRoute;