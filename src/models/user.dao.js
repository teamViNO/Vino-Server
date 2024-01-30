import bcrypt from 'bcryptjs';
import {pool} from '../../config/db.connect.js';
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { insertVideoAlarmSql,insertNoticeAlarmSql,getAlarmSql,setConfirmSql,deleteAlarmSql } from './user.sql.js';

export const createUser = async (name, birth_date, gender, phone_number, email, password, platform, theme) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const [rows] = await pool.query(
    'INSERT INTO user (name, birth_date, gender, phone_number, email, password, platform, theme) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
    [name, birth_date, gender, phone_number, email, hashedPassword, platform, theme]
  );

  return rows;
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
  
  return rows[0];
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const updatePassword = async (id, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  await pool.query(
    'UPDATE user SET password = ? WHERE id = ?',
    [hashedPassword, id]
  );
};


export const findUserById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
  return rows[0];
};


export const updateUserNickname = async (userId, nickname) => {
  const query = `
    UPDATE user
    SET nick_name = ?
    WHERE id = ?;
  `;
  const values = [nickname, userId];
  await pool.query(query, values);

};

export const addVideoAlarm=async(req)=>{
  try {
    const conn =await pool.getConnection();
    console.log(req);
    const videoAlarm = await pool.query(insertVideoAlarmSql,[req.is_confirm,req.created_at,req.updated_at,req.type,req.content,req.status,req.user_id,req.video_id]);
    return videoAlarm[0].insertId;
  } catch (error) {
    console.error(error);
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
}
export const addNoticeAlarm=async(req)=>{
  try {
    const conn = await pool.getConnection();
    console.log(req);
    const noticeAlarm=await pool.query(insertNoticeAlarmSql,[req.is_confirm,req.created_at,req.updated_at,req.type,req.content,req.user_id]);
    return noticeAlarm[0].insertId;
  } catch (error) {
    console.error(error);
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
}

export const getAlarm=async(user)=>{
  try{
    const conn = await pool.getConnection();
    console.log(user);
    const [alarmData]=await pool.query(getAlarmSql,[user]);
    return alarmData;
  } catch(error){
    console.error(error);
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
}

export const setConfirm=async(data)=>{
  try {
    const conn = await pool.getConnection();
    console.log(data);
    const alarm=await pool.query(setConfirmSql,[data.alarm_id,data.userId]);
    return "success";
  } catch (error) {
    console.error(error);
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
}

export const deleteAlarm=async(data)=>{
  try {
    const conn = await pool.getConnection();
    console.log(data);
    const alarm=await pool.query(deleteAlarmSql,[data.alarm_id,data.userId]);
    return "success";
  } catch (error) {
    console.error(error);
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
}

export const findUserByNameAndPhone = async (name, phone_number) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM user WHERE name = ? AND phone_number = ?',
      [name, phone_number]
    );
    return rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findUserByNamePhoneAndEmail = async (name, phone_number, email) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM user WHERE name = ? AND phone_number = ? AND email = ?',
      [name, phone_number, email]
    );
    return rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserInfo = async (userId) => {
  try {
    const [row] = await pool.query(
      'SELECT name, birth_date, gender, phone_number, email, nick_name FROM user WHERE id = ?',[userId]
    );
    return row[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
  
}