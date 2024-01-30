//category.service.js

import { BaseError } from "../../config/error.js";
import {status} from "../../config/response.status.js"
import { getCategoryResponseDTO,addCategoryResponseDTO,fixCategoryResponseDTO } from "../dtos/category.dto.js";
import { addCategoryDAO,getCategoryDAO,renameCategoryDAO,deleteCategoryDAO,moveCategoryDAO } from "../models/category.dao.js"

// 카테고리 조회
export const getCategoryService = async (data) => {
    console.log("서비스 요청 정보", data);
    const result = await getCategoryDAO(data);
    return result.map(category => getCategoryResponseDTO(category));
}

// 상위 카테고리 추가 
export const addCategory1Service = async (req) => {
    const categoryData = {
        name : req.body.name,
        user_id : req.userID,
        top_category : null,
        created_at : new Date
    };
    const categoryID = await addCategoryDAO(categoryData);

    const defaultSubCategoryData = {
        name: "기본",
        user_id: req.userID,
        top_category: categoryID, // 상위 카테고리의 ID를 사용
        created_at: new Date
    };

    await addCategoryDAO(defaultSubCategoryData); // 기본 하위 폴더 생성
    return addCategoryResponseDTO(categoryData,categoryID);
}

// 하위 카테고리 추가 
export const addCategory2Service = async (req) => {
    const categoryData = {
        name : req.body.name,
        user_id : req.userID,
        top_category : req.params.topCategoryID,
        created_at : new Date
    };
    const categoryID = await addCategoryDAO(categoryData);
    return addCategoryResponseDTO(categoryData,categoryID);
}

// 카테고리 수정 
export const renameCategoryService = async (req) => {
    const categoryData =  {
        name : req.body.name,
        user_id : req.userID,
        category_id : req.params.categoryID,
    };
    await renameCategoryDAO(categoryData);
    return fixCategoryResponseDTO(categoryData);
};

// 카테고리 삭제
export const deleteCategoryService = async (req) => {
    const categoryData =  {
        user_id : req.userID,
        category_id : req.params.categoryID,
    };
    console.log("서비스에서 ", categoryData);
    await deleteCategoryDAO(categoryData);
}

// 카테고리 이동 (하위 -> 하위)
export const moveCategoryService = async (data) => {
    console.log("서비스 요청 정보", data);
    const result = await moveCategoryDAO(data);
    return fixCategoryResponseDTO(result);
}