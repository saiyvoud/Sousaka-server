import { EMessage, SMessage } from "../service/message.js";
import { sendCreate, sendError } from "../service/response.js";
import { ValidateData } from "../service/vaildate.js";
import con from "../config/db.js";
import { v4 as uuid } from "uuid";
export default class SubjectController {
  static insert = async (req, res) => {
    try {
      const { subName, subTime, teacher_id } = req.body;
      const vaildate = await ValidateData({ subName, subTime, teacher_id });
      if (vaildate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + vaildate.join(","));
      }
      const check = "Select * from teacher where tUuid=?";
      con.query(check, teacher_id, function (err, result) {
        if (err) return sendError(res, 400, "Not Found",err);
        if (result.length == 0) {
          return sendError(res, 404, "Not Found");
        }
        const subUuid = uuid();
        var date = new Date()
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");
        const mysql =
          "insert into subject (subUuid,subName,subTime,teacher_id,createdAt,updatedAt) values (?,?,?,?,?,?)";
        con.query(
          mysql,
          [subUuid, subName, subTime, teacher_id, date, date],
          function (err2) {
            if (err2) throw err2;
            return sendCreate(res, SMessage.insert);
          }
        );
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
}
