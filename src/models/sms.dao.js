import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const createCode = async (verificationCode) => {

  const [rows] = await pool.query(
    'INSERT INTO sms (verification_code) VALUES (?)', 
    [verificationCode]
  );

  const [idRows] = await pool.query('SELECT LAST_INSERT_ID() as id');
  const codeId = idRows[0].id;

  return { id: codeId};
};

export const findCode = async (id) => {
  const [rows] = await pool.query('SELECT verification_code FROM sms WHERE id = ?',[id]);

  return rows[0];
}

export const deleteCode = async (id) => {
  const [rows] = await pool.query('DELETE FROM sms WHERE id = ?',[id]);

  return rows[0];
}

export const findPhoneNumber = async (phone_number) => {
  const [rows] = await pool.query('SELECT * FROM user WHERE phone_number = ?', [phone_number]);

  return rows[0];
}