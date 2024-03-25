import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { SECREAT_KEY } from "../config/globleKey.js";

export const GeneratePassword = async (password) => {
  const encryptPassword = CryptoJS.AES.encrypt(
    password,
    SECREAT_KEY
  ).toString();
  return encryptPassword;
};
export const encrypt = async (data) => {
  const encrypt = CryptoJS.AES.encrypt(data, SECREAT_KEY).toString();
  return encrypt;
};
export const GenerateToken = async (data) => {
  var paylod = {
    id: await encrypt(data.id),
    role: await encrypt(data.role),
  };
  var paylod_refresh = {
    id: await encrypt(data.id),
    role: await encrypt("USER_MANUAN"),
  };
  const token = jwt.sign(paylod, SECREAT_KEY,{expiresIn: '4h'});
  const refreshToken = jwt.sign(paylod_refresh, SECREAT_KEY,{expiresIn: '1d'});
  console.log(token);
  console.log(refreshToken);
  return {token,refreshToken};
};
