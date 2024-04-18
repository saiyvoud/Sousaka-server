import { EMessage, SMessage } from "../service/message.js";
import { sendCreate, sendError, sendSuccess } from "../service/response.js";
import { ValidateData } from "../service/vaildate.js";
import con from "../config/db.js";
import { v4 as uuid } from "uuid";
export default class ClassController {
  // INNER JOIN part ON class.part_id = part.pUuid
  // INNER JOIN subject ON class.subject_id = subject.subUuid
  // INNER JOIN teacher ON subject.teacher_id = teacher.tUuid
  static selectAll = async (req, res) => {
    try {
      const mysql = `SELECT class.cID,class.cUuid,class.cName,termNo,year.yearNumber,year.schoolyear,major.mName,class.createdAt,class.updatedAt
      FROM class
      INNER JOIN year ON class.year_id = year.yUuid 
      INNER JOIN major ON class.major_id = major.mUuid`;
      con.query(mysql, function (err, result) {
        if (err) throw err;
        return sendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
  static selectOne = async (req, res) => {
    try {
      const classId = req.params.cUuid;
      if (!classId) {
        return sendError(res, 400, "class id is reqiured!");
      }
      const mysql = `SELECT class.cID,class.cUuid,class.cName,termNo,year.yearNumber,year.schoolyear,major.mName,class.createdAt,class.updatedAt
      FROM class
      INNER JOIN year ON class.year_id = year.yUuid 
      INNER JOIN major ON class.major_id = major.mUuid where cUuid=?`;
      con.query(mysql, classId, function (err, result) {
        if (err) throw err;
        return sendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };

  static insert = async (req, res) => {
    try {
      const { year_id, major_id, cName,termNo } = req.body;
      const vaildate = await ValidateData({
        year_id,
        major_id,
        cName,
        termNo
      });
      if (vaildate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + vaildate.join(","));
      }
      const checkYear = "Select * from year where yUuid=?";
      // const checkPart = "Select * from part where pUuid=?";
      const checkMajor = "Select * from major where mUuid=?";
      // const checkSub = "Select * from subject where subUuid=?";
      const insert =
        "insert into class (cUuid,year_id,major_id,cName,termNo,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?)";
      con.query(checkYear, year_id, function (errYear, year) {
        if (errYear) return sendError(res, 404, "Not Found Year", errYear);
        if (year.length == 0) {
          return sendError(res, 404, "Not Found Year");
        }
        const cUuid = uuid();
        var date = new Date()
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");
        // con.query(checkPart, part_id, function (errPart, part) {
        //   if (errPart) return sendError(res, 404, "Not Found Part", errPart);
        // if (part.length == 0) return sendError(res, 404, "Not Found part");
        con.query(checkMajor, major_id, function (errMajor, major) {
          if (errMajor) return sendError(res, 404, "Not Found Major", errMajor);
          if (major.length == 0) return sendError(res, 404, "Not Found Major");
          // con.query(checkSub, subject_id, function (errSub, sub) {
          // if (errSub)
          //   return sendError(res, 404, "Not Found subject", errSub);
          // if (sub.length == 0)
          //   return sendError(res, 404, "Not Found subject");
          con.query(
            insert,
            [cUuid, year_id, major_id, cName, date, date],
            function (errInsert) {
              if (errInsert)
                return sendError(res, 500, "Error Insert Class", errInsert);
              return sendSuccess(res, SMessage.insert);
            }
          );
        });
      });
      // });
      // });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static updateClass = async (req, res) => {
    try {
      const cUuid = req.params.cUuid;
      if (!cUuid) {
        return sendError(res, 400, "class params is required");
      }

      const { cName } = req.body;
      const validate = await ValidateData({ cName });
      if (validate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      const checkClass = "select * from class where cUuid=?";
      con.query(checkClass, cUuid, function (err, result) {
        if (err) return sendError(res, 400, "Not Found", err);
        if (result[0].length == 0) {
          return sendError(res, 404, "Not Found");
        }
        const update = "update class set cName=? where cUuid=?";
        con.query(update, [cName, cUuid], function (error) {
          if (error) throw error;
          return sendSuccess(res, SMessage.update);
        });
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static deleteClass = (req, res) => {
    try {
      const cUuid = req.params.cUuid;
      if (!cUuid) {
        return sendError(res, 400, "class params is required");
      }
      const deleteClass = "Delete from class where cUuid=?";
      con.query(deleteClass, cUuid, function (err) {
        if (err) return sendError(res, 404, "Not Found ClassID");
        return sendSuccess(res, SMessage.delete);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
}
