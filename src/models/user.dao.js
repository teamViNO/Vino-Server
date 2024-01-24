import bcrypt from 'bcryptjs';
import {pool} from '../../config/db.connect.js';

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