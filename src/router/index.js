import express from "express"
import UserController from "../controller/user.controller.js";
import {auth} from "../middleware/auth.middleware.js";
const route = express.Router();
//========= auth =======
route.post("/user/register",UserController.register);
route.post("/user/login",UserController.login);
route.put("/user/forgot",UserController.forgotPassword)
route.put("/user/changepassword",auth,UserController.changePassword)
route.put("/user/update",auth,UserController.updateProfile)
route.put("/user/updateprofileimage",auth,UserController.updateProfileImage)
route.post("/user/refresh",UserController.refreshToken)
route.delete("/user/delete",auth,UserController.deleteUser)
route.get("/user/info",auth,UserController.userInfo)
//======== student =====

export default route;