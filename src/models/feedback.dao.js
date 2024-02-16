import {pool} from '../../config/db.connect.js';

export const saveFeedback = async (userId, text) => {
  const time = new Date;
  const [row] = await pool.query(`INSERT INTO feedback (user_id, text, created_at) VALUES (?, ?, ?)`, [userId, text, time]);
  return row[0];
}