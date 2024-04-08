import { EMessage, SMessage } from "../service/message.js";
import { sendCreate, sendError,sendSuccess } from "../service/response.js";
import con from "../config/db.js";
import { v4 as uuid } from "uuid";
import { ValidateData } from "../service/vaildate.js";
export default class CheckListController {
  static selectAll = async (req, res) => {
    try {
      const mysql = "select * from checklist";
      con.query(mysql, function (err, result) {
        if (err) throw err;
        return sendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static selectOne = async (req, res) => {
    try {
      const chUuid = req.params.chUuid;
      if (!chUuid) {
        return sendError(res, 400, "checklist is reqiured!");
      }
      const mysql = "Select * from checklist WHERE chUuid =?";
      con.query(mysql, chUuid, function (err, result) {
        if (err) throw err;
        return sendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
  static insert = async (req, res) => {
    try {
      const { status, statusName,reson } = req.body;
      const vaildate = await ValidateData({ status, statusName});
      if (vaildate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + vaildate.join(","));
      }
      const mysql =
        "insert into checklist (chUuid,status,statusName,createdAt,updatedAt,reson) values (?,?,?,?,?,?)";
      const chUuid = uuid();
      var date = new Date()
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");
      con.query(mysql, [chUuid,status,statusName, date, date,reson], function (err) {
        if (err) return sendError(res, 404, "Error Insert",err);
        return sendCreate(res, SMessage.insert);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static updateCheckList = async (req, res) => {
    try {
      const chUuid = req.params.chUuid;
      if (!chUuid) {
        return sendError(res, 400, "checklist params is required");
      }
      const { status, statusName,reson } = req.body;
      const vaildate = await ValidateData({ status, statusName,reson });
      if (vaildate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + vaildate.join(","));
      }
      var date = new Date()
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");
      const mysql = "update checklist set status =?,statusName=?,updatedAt=?,reson=? where chUuid=?";

      con.query(mysql, [status,statusName, date,reson, chUuid], function (err) {
        if (err) return sendError(res, 404, "Error Update");
        return sendCreate(res, SMessage.update);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static deleteCheckList = (req, res) => {
    try {
      const chUuid = req.params.chUuid;
      if (!chUuid) {
        return sendError(res, 400, "checklist is reqiured!");
      }
      const deleteCheckList = "DELETE From checklist WHERE chUuid =?";
      con.query(deleteCheckList, chUuid, function (err) {
        if (err) throw err;
        return sendSuccess(res, SMessage.delete);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
}
