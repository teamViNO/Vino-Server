//category.service.js

import { BaseError } from "../../config/error.js";
import {status} from "../../config/response.status.js"
import { getCategoryResponseDTO,categoryResponseDTO } from "../dtos/category.dto.js";
import { addCategory1DAO,addCategory2DAO,getCategoryDAO,renameCategoryDAO,deleteCategoryDAO,moveCategoryDAO } from "../models/category.dao.js"

// 카테고리 조회
export const getCategoryService = async (data) => {
    console.log("서비스 요청 정보", data);
    const result = await getCategoryDAO(data);
    return result.map(category => getCategoryResponseDTO(category));
}

// 상위 카테고리 추가 => result가 null인 것도 해결해야 함
export const addCategory1Service = async (data) => {
    console.log("서비스 요청 정보", data);
    //const top_category = null;
    const categoryData = {
        name : data.name,
        user_id : data.userID,
        top_category : null,
        created_at : Date
    };
    await addCategory1DAO(categoryData);
    return categoryResponseDTO(categoryData);
}

// 하위 카테고리 추가 => result가 null인 것도 해결해야 함
export const addCategory2Service = async (data) => {
    console.log("서비스 요청 정보", data);
    const top_category = data.categoryID
    const categoryData = {
        name : data.name,
        user_id : data.userID,
        top_category
    };
    await addCategory2DAO(categoryData);
    return categoryResponseDTO(categoryData);
}

// 카테고리 수정 => result가 null인 것도 해결해야 함
export const renameCategoryService = async (data) => {
    console.log("서비스 요청 정보", data);
    await renameCategoryDAO(data);
    return categoryResponseDTO(data);
};

// 카테고리 삭제
export const deleteCategoryService = async (data) => {
    console.log("서비스 요청 정보", data);
    await deleteCategoryDAO(data);
}

// 카테고리 이동 (하위 -> 하위)
export const moveCategoryService = async (data) => {
    console.log("서비스 요청 정보", data);
    await moveCategoryDAO(data);
    return categoryResponseDTO(data);
}