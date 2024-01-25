//category.dao.js

import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

// 카테고리 조회
export const getCategoryDAO=async (userID) => {
    try {
        const conn = await pool.getConnection();
        const result = await pool.query("select * from category where user_id = ?",[userID])
        console.log(result);
        conn.release();
        return result;
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 상위 또는 하위 카테고리 추가
export const addCategoryDAO=async (req) =>{
    try{
        const conn =await pool.getConnection();
        const result = await pool.query(
        "insert into category(name, user_id, top_category, created_at) values(?,?,?,?);",
        [req.name, req.user_id, req.top_category, req.created_at]);
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

// 카테고리 삭제 
export const deleteCategoryDAO = async (req) => {
    try {
        const conn = await pool.getConnection();
        const result = await pool.query("delete from category where id = ? and user_id = ?", [req.categoryID,req.userID]);
        conn.release();
        return result;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 카테고리 이동 (하위 -> 하위)
export const moveCategoryDAO = async (data) => {
    try {
        const conn = await pool.getConnection();
        const result = await pool.query(
            "UPDATE category SET top_category = ? WHERE id = ? AND user_id = ?;",
            [data.topCategoryID, data.categoryID, data.userID]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};