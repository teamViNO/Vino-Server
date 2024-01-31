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

// 카테고리 수정
export const renameCategoryDAO = async (req) => {
    try {
        const conn = await pool.getConnection();
        await pool.query(
            "update category set name = ? where id = ? and user_id = ?;",
            [req.name, req.category_id, req.user_id]
        );
        conn.release();
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 카테고리 삭제 => video가 삭제할 카테고리를 참조하고 있다면 참조무결성 오류 => 나중에 해결
export const deleteCategoryDAO = async (req) => {
    try {
        const conn = await pool.getConnection();
        // 삭제할 현재 카테고리의 하위 카테고리 ID를 가져오기
        const [subCategories] = await pool.query("SELECT id FROM category WHERE user_id = ? AND top_category = ?", [req.user_id, req.category_id]);
        // 하위 카테고리들 삭제
        for (const subCategory of subCategories) {
            await pool.query("DELETE FROM category WHERE user_id = ? AND id = ?", [req.user_id, subCategory.id]);
        }
        // 현재 카테고리 삭제
        await pool.query("DELETE FROM category WHERE user_id = ? AND id = ?", [req.user_id, req.category_id]);

        conn.release();
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};



// 카테고리 이동1 (하위의 상위 카테고리가 변경될 때)
export const move1CategoryDAO = async (req) => {
    try {
        const conn = await pool.getConnection();
        await pool.query(
            "UPDATE category SET top_category = ? WHERE id = ? AND user_id = ?;",
            [req.top_category, req.category_id, req.user_id]
        );
        conn.release();
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 카테고리 이동2 (하위가 새로운 상위가 될 때)
export const move2CategoryDAO = async (req) => {
    try {
        const conn = await pool.getConnection();
        await pool.query(
            "UPDATE category SET top_category = NULL WHERE id = ? AND user_id = ?;",
            [req.category_id, req.user_id]
        );
        conn.release();
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 카테고리 이동3 (하위가 새로운 상위가 될 때)
export const move3CategoryDAO = async (req) => {
    try {
        const conn = await pool.getConnection();
        await pool.query(
            "UPDATE category SET top_category = ? WHERE id = ? AND user_id = ?;",
            [req.top_category, req.category_id, req.user_id]
        );
        conn.release();
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 카테고리 이동4 (상위가 다른 상위의 하위와 합쳐질 때)
export const move4CategoryDAO = async (req) => {
    //넘어온 top_category 연동 데이터를 없애고, 콘텐츠들을 category_id와 연동
};