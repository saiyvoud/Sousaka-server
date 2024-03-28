import express from "express"
import UserController from "../controller/user.controller.js";
import {auth} from "../middleware/auth.middleware.js";
const route = express.Router();

route.post("/user/register",UserController.register);
route.post("/user/login",UserController.login);
route.put("/user/forgot",UserController.forgotPassword)
route.get("/user/info",auth,UserController.userInfo)
export default route;