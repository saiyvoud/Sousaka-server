import express from "express"
import CheckListController from "../controller/checklist.controller.js";
import MajorController from "../controller/major.controller.js";
import PartController from "../controller/part.controller.js";
import StudentController from "../controller/student.controller.js";
import TeacherController from "../controller/teach.controller.js";
import UserController from "../controller/user.controller.js";
import YearController from "../controller/year.controller.js";
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
//======== part ======
route.get("/part/selectone/:pUuid",auth,PartController.selectOne);
route.get("/part/selectall",auth,PartController.selectAll);
route.post("/part/insert",auth,PartController.insert);
route.put("/part/update/:pUuid",auth,PartController.updatePart);
route.delete("/part/delete/:pUuid",auth,PartController.deletePart);
//======== major ======
route.get("/major/selectone/:mUuid",auth,MajorController.selectOne);
route.get("/major/selectall",auth,MajorController.selectAll);
route.post("/major/insert",auth,MajorController.insert);
route.put("/major/update/:mUuid",auth,MajorController.updateMajor);
route.delete("/major/delete/:mUuid",auth,MajorController.deleteMajor);
//======== year ======
route.get("/year/selectone/:yUuid",auth,YearController.selectOne);
route.get("/year/selectall",auth,YearController.selectAll);
route.post("/year/insert",auth,YearController.insert);
route.put("/year/update/:yUuid",auth,YearController.updateYear);
route.delete("/year/delete/:yUuid",auth,YearController.deleteYear);
//======== checklist ======
route.get("/checklist/selectone/:chUuid",auth,CheckListController.selectOne);
route.get("/checklist/selectall",auth,CheckListController.selectAll);
route.post("/checklist/insert",auth,CheckListController.insert);
route.put("/checklist/update/:chUuid",auth,CheckListController.updateCheckList);
route.delete("/checklist/delete/:chUuid",auth,CheckListController.deleteCheckList);
export default route;