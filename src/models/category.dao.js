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

// 상위 또는 하위 카테고리 추가
export const addCategoryDAO=async (req) =>{
    try{
        const conn =await pool.getConnection();
        const result = await pool.query(
        "insert into category(name, user_id, top_category, created_at) values(?,?,?,?);",
        [req.name, req.user_id, req.top_category, req.created_at]);
        const categoryId = result[0] && result[0].insertId;
        conn.release();
        return categoryId;
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 카테고리 삭제 => video가 삭제할 카테고리를 참조하고 있다면 참조무결성 오류 => 나중에 해결
export const deleteCategoryDAO = async (req) => {
    try {
        const conn = await pool.getConnection();
        
        // 삭제할 현재 카테고리의 하위 카테고리 ID를 가져오기
        const [subCategories] = await pool.query("SELECT id FROM category WHERE user_id = ? AND top_category = ?", [req.userID, req.categoryID]);

        // 하위 카테고리들 삭제
        for (const subCategory of subCategories) {
            await pool.query("DELETE FROM category WHERE user_id = ? AND id = ?", [req.userID, subCategory.id]);
        }

        // 현재 카테고리 삭제
        await pool.query("DELETE FROM category WHERE user_id = ? AND id = ?", [req.userID, req.categoryID]);

        conn.release();
    } catch (err) {
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

        const [updatedCategory] = await pool.query("SELECT * FROM category WHERE id = ? AND user_id = ?", [req.categoryID, req.userID]);
        conn.release();
        return {
            categoryID: updatedCategory[0].id,
            name: updatedCategory[0].name,
            topCategoryID: updatedCategory[0].top_category
        };

    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 카테고리 이동 (하위 -> 하위)
export const moveCategoryDAO = async (req) => {
    try {
        const conn = await pool.getConnection();
        const result = await pool.query(
            "UPDATE category SET top_category = ? WHERE id = ? AND user_id = ?;",
            [req.topCategoryID, req.categoryID, req.userID]
        );
        const [movedCategory] = await pool.query("SELECT * FROM category WHERE id = ? AND user_id = ?", [req.categoryID, req.userID]);
        conn.release();
        return {
            categoryID: movedCategory[0].id,
            name: movedCategory[0].name,
            topCategoryID: movedCategory[0].top_category
        };
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};