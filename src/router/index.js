import express from "express"
import UserController from "../controller/user.controller.js";
const route = express.Router();

route.post("/user/register",UserController.register);
export default route;