import express from "express"
import StudentController from "../controller/student.controller.js";
import TeacherController from "../controller/teach.controller.js";
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
route.get("/student/selectone/:sID",auth,StudentController.selectOne);
route.get("/student/selectall",auth,StudentController.selectAll);
route.get("/student/selectby/:user_id",auth,StudentController.selectByUserId);
route.post("/student/insert",auth,StudentController.insert);
route.put("/student/update/:sUuid",auth,StudentController.updateStudent);
route.delete("/student/delete/:sUuid",auth,StudentController.deleteStudent);
//======== teacher ======
route.get("/teacher/selectone/:tUuid",auth,TeacherController.selectOne);
route.get("/teacher/selectall",auth,TeacherController.selectAll);
route.get("/teacher/selectby/:user_id",auth,TeacherController.selectByUser);
route.post("/teacher/insert",auth,TeacherController.insert);
route.put("/teacher/update/:tUuid",auth,TeacherController.updateTeacher);
route.delete("/teacher/delete/:tUuid",auth,TeacherController.deleteTeacher);
export default route;