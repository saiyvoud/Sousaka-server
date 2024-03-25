import { sendError, sendSuccess } from "../service/response.js";

import con from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { Role } from "../service/message.js";
import { GeneratePassword, GenerateToken } from "../service/service.js";
export default class UserController {
  static register = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return sendError(res, 404, "email and password is required!");
      }
      const genpassword = await GeneratePassword(password);
      console.log(genpassword);
      const uuid = uuidv4();
      var date = new Date()
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");
      console.log(date);

      var mysql =
        "INSERT INTO user (uuid,email,password,role,createdAt,updateAt) VALUES (? ,?, ?, ?, ?, ?)";

      con.query(
        mysql,
        [uuid, email, genpassword, Role.student, date, date],
        async function (err, result) {
          if (err) throw err;
          var data = {
            id: uuid,
            role: Role.student
          }
          const token = await GenerateToken(data);
          return sendSuccess(res, "Register Success", token);
        }
      );
    } catch (error) {
      return res.status(500).json({ error: "Server Error" });
    }
  };
}
