//category.dao.js

import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { dropVideo } from "./video.dao.js"

// 모든 카테고리 조회
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

// 카테고리 하나 조회
export const getC = async (id)=>{
    try {
        const conn = await pool.getConnection();
        const result = await pool.query("SELECT * FROM category WHERE id = ?", [id])
        conn.release();
        return result[0];
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 상위 또는 하위 카테고리 추가
export const addCategoryDAO=async (req) =>{
    try{
        const conn = await pool.getConnection();
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
        const updateCategory = await pool.query(
            "update category set name = ? where id = ? and user_id = ?;",
            [req.name, req.category_id, req.user_id]
        );

        const result = getC(req.category_id)
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
        const [categoryInfo] = await conn.query("SELECT top_category FROM category WHERE user_id = ? AND id = ?", [req.user_id, req.category_id]);
        const isNull = categoryInfo[0].top_category;
        
        if(isNull===null){ // 상위 카테고리일 때
            
            // 하위 카테고리 id 가져오기 
            const [subCategories] = await pool.query("SELECT id FROM category WHERE user_id = ? AND top_category = ?", [req.user_id, req.category_id]);
            
            for (const subCategory of subCategories) {
                // 비디오 삭제
                const [videoIds] = await pool.query("SELECT id FROM video WHERE user_id = ? AND category_id = ?", [req.user_id, subCategory.id]);
                for (const videoIdObj of videoIds) {
                    const dropedVideo = await dropVideo({ videoID: videoIdObj.id });
                }
                // 하위 카테고리 삭제
                const dropCategory = await pool.query("DELETE FROM category WHERE user_id = ? AND id = ?", [req.user_id, subCategory.id]);
            }

            // 상위 카테고리 삭제하기
            const dropTopCategory = await pool.query("DELETE FROM category WHERE user_id = ? AND id = ?", [req.user_id, req.category_id]);

        } else { // 하위 카테고리일 때
            // 비디오 삭제
            const [videoIds] = await pool.query("SELECT id FROM video WHERE user_id = ? AND category_id = ?", [req.user_id, req.category_id]);
            for (const videoIdObj of videoIds) {
                const dropedVideo = await dropVideo({ videoID: videoIdObj.id });
            }

            // 해당 카테고리 삭제
            const dropCategory = await pool.query("DELETE FROM category WHERE user_id = ? AND id = ?", [req.user_id, req.category_id]);
        }

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
        const updateCategory = await pool.query(
            "UPDATE category SET top_category = ? WHERE id = ? AND user_id = ?;",
            [req.top_category, req.category_id, req.user_id]
        );
        const result = getC(req.category_id)
        conn.release();
        return result;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 카테고리 이동2 (하위가 새로운 상위가 될 때) 
export const move2CategoryDAO = async (data,etc) => {
    try {
        const conn = await pool.getConnection();
        const updateCategory = await pool.query(
            "UPDATE category SET top_category = NULL WHERE id = ? AND user_id = ?;",
            [data.category_id, data.user_id]
        );

        const etcCategory = await pool.query( 
            "UPDATE video SET category_id = ? WHERE category_id = ? AND user_id = ?;",
            [etc, data.category_id, data.user_id]
        );

        const result = getC(req.category_id)
        conn.release();
        return result;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 카테고리 이동3 (상위가 다른 상위의 새로운 하위가 될 때) 
export const move3CategoryDAO = async (data) => {
    try {
        const conn = await pool.getConnection();
        // 1. :categoryID를 top_Category로 갖는 하위 카테고리들의 id를 모두 가져오기
        const [subCategories] = await conn.query("SELECT id FROM category WHERE user_id = ? AND top_category = ?", [data.user_id, data.category_id]);
        
        // 2. 1번에서 가져온 id들을 category_id로 갖는 비디오들의 category_id를 :categoryID로 변경
        for (const subCategory of subCategories) {
            const updateCategory = await conn.query("UPDATE video SET category_id = ? WHERE category_id = ?", [data.category_id, subCategory.id]);
        }

        // 3. 1번에서 가져온 하위 카테고리들을 삭제
        const dropCategory = await conn.query("DELETE FROM category WHERE user_id = ? AND top_category = ?", [data.user_id, data.category_id]);

        // 4. :categoryID에 해당하는 카테고리의 top_category를 :topCategoryID로 변경
        const updateTopCategory = await pool.query(
            "UPDATE category SET top_category = ? WHERE id = ? AND user_id = ?;",
            [data.top_category, data.category_id, data.user_id]
        );

        const result = getC(req.category_id)
        conn.release();
        return result;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 카테고리 태그 가져오기
export const getCategoryTagDAO = async (req) => {
    try {
        const conn = await pool.getConnection();
        
        // 1. 카테고리에 해당하는 비디오 아이디 가져오기
        const [videoIds] = await pool.query(
            "SELECT DISTINCT id FROM video WHERE category_id = ? AND user_id = ?;",
            [req.category_id, req.user_id]
        );

        // 2. 비디오 아이디에 해당하는 태그 아이디와 태그 네임 가져오기
        const [tags] = await pool.query(
            "SELECT DISTINCT vt.tag_id, t.name FROM video_tag vt JOIN tag t ON vt.tag_id = t.id WHERE vt.video_id IN (?);",
            [videoIds.map(video => video.id)]
        );
        conn.release();
        return tags;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// // 카테고리 이동4 (상위가 다른 상위의 하위와 합쳐질 때)
// export const move4CategoryDAO = async (data) => {
//     //넘어온 top_category 연동 데이터를 없애고, 콘텐츠들을 category_id와 연동
//     try {
//         const conn = await pool.getConnection();

//          // 1. :topCategoryID를 top_category로 갖는 카테고리들의 id를 모두 가져오기
//          const [subCategories] = await conn.query("SELECT id FROM category WHERE user_id = ? AND top_category = ?", [data.user_id, data.top_category]);

//          // 2. 1번에서 가져온 id들을 category_id로 갖는 비디오들의 category_id를 :categoryID로 변경
//          for (const subCategory of subCategories) {
//              await conn.query("UPDATE video SET category_id = ? WHERE category_id = ?", [data.category_id, subCategory.id]);
//          }

//          // 3. 1번에서 가져온 카테고리들을 삭제
//          await conn.query("DELETE FROM category WHERE user_id = ? AND top_category = ?", [data.user_id, data.top_category]);

//          // 4. topCategoryID에 해당하는 카테고리 삭제
//          await conn.query("DELETE FROM category WHERE user_id = ? AND id = ?", [data.user_id, data.top_category]);
//          conn.release();
//     } catch (err) {
//         console.error(err);
//         throw new BaseError(status.PARAMETER_IS_WRONG);
//     }
// };