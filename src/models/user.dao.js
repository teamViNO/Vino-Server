import bcrypt from 'bcryptjs';
import {pool} from '../../config/db.connect.js';
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { insertVideoAlarmSql,insertNoticeAlarmSql,getAlarmSql,setConfirmSql,deleteAlarmSql, deleteAllAlarmSql } from './user.sql.js';

export const createUser = async (name, birth_date, gender, phone_number, email, password, platform, theme) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const [rows] = await pool.query(
    'INSERT INTO user (name, birth_date, gender, phone_number, email, password, platform, theme) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
    [name, birth_date, gender, phone_number, email, hashedPassword, platform, theme]
  );

  const [idRows] = await pool.query('SELECT LAST_INSERT_ID() as id');
  const userId = idRows[0].id;

  const [nameRows] = await pool.query('SELECT name FROM user WHERE id = ?', [userId]);
  const userName = nameRows[0].name;

  return { id: userId, name: userName };
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

// 환영인사 알림 추가
export const addWelcomeAlarm = async(req) => {
  const [rows] = await pool.query(
    'INSERT INTO alarm (is_confirm, created_at, updated_at, type, content, user_id, title) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [req.is_confirm,req.created_at,req.updated_at,req.type,req.content,req.user_id, req.title]
  );
  return rows;
}

// 회원 가입시 기본 카테고리 추가
export const createDefaultCategory = async(data) => {
  const [rows] = await pool.query(
    "INSERT INTO category (user_id, name, created_at, top_category) VALUES (?, ?, ?, ?)",
    [data.user_id, data.name, data.created_at, data.top_category]
  );
  const [idRows] = await pool.query('SELECT LAST_INSERT_ID() as id');
  const catecoryId = idRows[0].id;

  return { id: catecoryId};
}

export const addVideoAlarm=async(req)=>{
  try {
    const conn =await pool.getConnection();
    console.log(req);
    const videoAlarm = await pool.query(insertVideoAlarmSql,[req.is_confirm,req.created_at,req.updated_at,req.type,req.content,req.status,req.user_id,req.video_id]);
    conn.release();
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
    conn.release();
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
    conn.release();
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
    conn.release();
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
    conn.release();
    return "success";
  } catch (error) {
    console.error(error);
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
}
export const deleteSelectAlarm=async(user,alarm)=>{
  try {
    const conn = await pool.getConnection();
    const alarms=await pool.query(deleteAllAlarmSql,[user,alarm]);
    conn.release();
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
    return {status: 200,
            success: true, 
            message: '정보를 성공적으로 조회 했습니다.' , 
            result: row[0]
          };
  
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const updateInfo = async(nickname, gender, userId) => {
  const query = `
    UPDATE user
    SET nick_name = ?
    ,gender = ?
    WHERE id = ?;
  `;
  const values = [nickname, gender, userId];
  await pool.query(query, values);
}