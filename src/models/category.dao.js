//category.dao.js

import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const getCategoryDAO=async (userID) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await pool.query("select * from category where user_id = ?",[userID])
        conn.release();
        return result;
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

export const addCategoryDAO=async (req) =>{
    try{
        const conn =await pool.getConnection();
        const result = await pool.query(
        "insert into category(name, is_fix, fixed_at, user_id, top_category) values(?,?,?,?,?);",
        [req.name, req.is_fix, req.fixed_at, req.user_id, req.top_category]);
        conn.release();
        return result;
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

