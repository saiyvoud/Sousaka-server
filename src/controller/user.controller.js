import { sendError, sendSuccess } from "../service/response.js";

import con from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { EMessage, Role, SMessage } from "../service/message.js";
import {
  GeneratePassword,
  GenerateToken,
  Decrypt,
  UploadImageToServer,
} from "../service/service.js";
import { UloadToCloudinary } from "../config/cloudinary.js";

export default class UserController {
  static userInfo = async (req, res) => {
    try {
      const userId = req.user;
      console.log("=====>", userId);
      const mysql = "Select * from user where uuid =?";
      con.query(mysql, userId, function (err, rows) {
        if (err) throw err;
        return sendSuccess(res, SMessage.selectOne, rows[0]);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };

  static login = async (req, res) => {
    try {
      // validate data
      const { email, password } = req.body;
      if (!email || !password) {
        return sendError(res, 404, "email and password is required!");
      }
      const mysql = "Select * from user where email =?";
      // query search email
      con.query(mysql, email, async function (err, userData) {
        if (err) throw err;
        if (
          userData == null ||
          userData == undefined ||
          userData == [] ||
          userData == 0
        ) {
          return sendError(res, 400, "Email not found");
        }

        const decryptPassword = await Decrypt(userData[0]["password"]);

        if (password != decryptPassword) {
          return sendError(res, 401, EMessage.passwordNotMatch);
        }
        var data = {
          id: userData[0]["uuid"],
          role: userData[0]["role"],
        };

        const token = await GenerateToken(data);
        const newData = Object.assign(
          JSON.parse(JSON.stringify(userData[0])),
          JSON.parse(JSON.stringify(token))
        );

        return sendSuccess(res, SMessage.login, newData);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };

  static register = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return sendError(res, 400, "email and password is required!");
      }
      const image = req.files;
      if (image == null || image == undefined) {
        return sendError(res, 400, "profile is required!");
      }

      // validate email
      const mysqlEmail = "Select * from user where email =?";
      con.query(mysqlEmail, email, async function (err, result) {
        if (err) throw err;
        if (result[0]) {
          return sendError(res, 400, EMessage.EmailAleardy);
        }
        // const image_url = await UloadToCloudinary(image.profile.data);
        const image_url = await UploadImageToServer(image.profile.data);
        const genpassword = await GeneratePassword(password);

        const uuid = uuidv4();
        var date = new Date()
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");
        console.log(date);

        var mysql =
          "INSERT INTO user (uuid,email,password,role,createdAt,updateAt,profile) VALUES (? ,?, ?, ?, ?, ?,?)";

        con.query(
          mysql,
          [uuid, email, genpassword, Role.student, date, date, image_url],
          async function (err, result) {
            if (err) throw err;
            var data = {
              id: uuid,
              role: Role.student,
            };
            const token = await GenerateToken(data);
            return sendSuccess(res, SMessage.register, token);
          }
        );
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: EMessage.server, error });
    }
  };
  static forgotPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) {
        return sendError(res, 400, "email and newPassword is required!");
      }
      const mysqlEmail = "Select email from user where email =?";
      con.query(mysqlEmail, email, async function (err, result) {
        if (err) throw err;

        if (
          result[0] == undefined ||
          result[0] == null ||
          result[0] == [] ||
          result[0].length == 0
        ) {
          return sendError(res, 404, "email not found!");
        }
        const genpassword = await GeneratePassword(newPassword);
        const forgot = "UPDATE user set password =? WHERE email =?";

        con.query(forgot, [genpassword, email], function (error, success) {
          if (error) throw error;
          return sendSuccess(res, "Forgot Success");
        });
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
}
