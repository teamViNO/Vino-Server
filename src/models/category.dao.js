//category.dao.js

import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

// 카테고리 조회
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

// 카테고리 추가
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

// 카테고리 수정
export const renameCategoryDAO = async (req) => {
    try {
        const conn = await pool.getConnection();
        const result = await pool.query(
            "update category set name = ? where id = ? and user_id = ?;",
            [req.name, req.categoryID, req.userID]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 카테고리 상단 고정/해제
export const fixCategoryDAO = async (categoryData) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await pool.query(
            "UPDATE category SET is_fix = 1, fixed_at = NOW() WHERE id = ? and user_id = ?;",
            [categoryData.categoryID, categoryData.userID]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

