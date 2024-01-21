//category.service.js

import { BaseError } from "../../config/error.js";
import {status} from "../../config/response.status.js"
import { getCategoryResponseDTO} from "../dtos/category.dto.js";
import { addCategoryDAO,getCategoryDAO,renameCategoryDAO,fixCategoryDAO  } from "../models/category.dao.js"

// 카테고리 조회
export const getCategoryService = async (data) => {
    console.log("서비스 요청 정보", data);
    const result = await getCategoryDAO(data);
    return result.map(category=>getCategoryResponseDTO(category));
}

// 카테고리 추가 => result가 null인 것도 해결해야 함
export const addCategoryService = async (data) => {
    const id = Math.floor(Math.random() * 1000000); // id 랜덤 생성 -> 나중에 수정
    const is_fix = 0;
    const fixed_at = null;
    const top_category = null;
    const categoryData = {
        id,
        name : data.name,
        is_fix,
        fixed_at,
        user_id : data.userID,
        top_category,
    };
    const result = await addCategoryDAO(categoryData);
    console.log('데이터:',categoryData);
    return getCategoryResponseDTO(result);
}

// 카테고리 수정 => result가 null인 것도 해결해야 함
export const renameCategoryService = async (data) => {
    console.log("서비스 요청 정보", data);
    const result = await renameCategoryDAO(data);
    return getCategoryResponseDTO(result);
};

// 카테고리 상단 고정/해제
export const fixCategoryService = async (data) => {
    console.log("서비스 요청 정보", data);
    const result = await fixCategoryDAO(data);
    return getCategoryResponseDTO(result);
};