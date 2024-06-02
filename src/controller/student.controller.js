import { EMessage, SMessage } from "../service/message.js";
import { sendCreate, sendError, sendSuccess } from "../service/response.js";
import { ValidateData } from "../service/vaildate.js";
import con from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
export default class StudentController {
  static selectAll = async (req, res) => {
    try {
      const mysql = "Select * from student";
      con.query(mysql, function (err, result) {
        if (err) throw err;
        return sendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
  static selectByUserId = async (req, res) => {
    try {
      const userId = req.params.user_id;
      if (!userId) {
        return sendError(res, 400, "user is reqiured!");
      }
      const mysql = "Select * from student WHERE user_id = ?";
      con.query(mysql, userId, function (err, result) {
        if (err) throw err;
        return sendSuccess(res, SMessage.selectBy, result);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
  static selectOne = async (req, res) => {
    try {
      const studentId = req.params.sID;
      if (!studentId) {
        return sendError(res, 400, "student is reqiured!");
      }
      const mysql = "Select * from student WHERE sID =?";
      con.query(mysql, studentId, function (err, result) {
        if (err) throw err;
        return sendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
  static insert = async (req, res) => {
    try {
      const userId = req.user;
      const {
        sID,
        sName,
        sSurname,
        birthday,
        nationallity,
        gender,
        village,
        district,
        province,
        tel,
      } = req.body;
      const validate = await ValidateData({
        sID,
        sName,
        sSurname,
        birthday,
        nationallity,
        gender,
        village,
        district,
        province,
        tel,
      });
      if (validate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      const uuid = uuidv4();
      var date = new Date()
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");
      const mysql =
        "Insert into student (sID,sUuid,sName,birthday,nationallity,gender,village,district,province,tel,user_id,createdAt,updatedAt,sSurname) Values (?, ?, ?, ? ,? ,? ,?, ? ,?, ? ,?, ?, ?,?)";
      con.query(
        mysql,
        [
          sID,
          uuid,
          sName,
          birthday,
          nationallity,
          gender,
          village,
          district,
          province,
          tel,
          userId,
          date,
          date,
          sSurname,
        ],
        function (err) {
          if (err) throw err;
          return sendCreate(res, SMessage.insert);
        }
      );
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
  static updateStudent = async (req, res) => {
    try {
      const studentId = req.params.sUuid;
      if (!studentId) {
        return sendError(res, 400, "student is reqiured!");
      }
      const {
        sID,
        birthday,
        nationallity,
        gender,
        village,
        district,
        province,
        tel,
      } = req.body;
      const validate = await ValidateData({
        sID,
        birthday,
        nationallity,
        gender,
        village,
        district,
        province,
        tel,
      });
      if (validate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      const update =
        "UPDATE student set sID=?,birthday =?,nationallity =?,gender =?,village =?,district =? ,province =?,tel =? WHERE sUuid =?";

      con.query(
        update,
        [sID, birthday, nationallity, gender, village, district, province, tel, studentId],
        function (err) {
          if (err) throw err;
          return sendSuccess(res, SMessage.update);
        }
      );
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
  static deleteStudent = (req, res) => {
    try {
      const studentId = req.params.sUuid;
      if (!studentId) {
        return sendError(res, 400, "student is reqiured!");
      }
      const deleteStudent = "DELETE From student WHERE sUuid =?";
      con.query(deleteStudent, studentId, function (err) {
        if (err) throw err;
        return sendSuccess(res, SMessage.delete);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
}
