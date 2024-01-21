//category.dto.js

// 카테고리 조회
export const getCategoryResponseDTO = (category) => {
    return {
    "id": category.id,
    "name": category.name,
    "isFix": category.is_fix,
    "fixedAt": category.fixed_at,
    "userId": category.user_id,
    "topCategory": category.top_category
    };
}

// 카테고리 추가
export const addCategoryRequestDTO = (category) => {
    return {
        "name": category.body.name,
        "userID": category.params.userID,
    };
};

// 카테고리 수정
export const renameCategoryRequestDTO = (category) => {
    return {
        "name": category.body.name,
        "userID": category.params.userID,
        "categoryID": category.params.categoryID,
    };
};

// 카테고리 상단 고정/해제
export const fixCategoryRequestDTO = (category) => {
    return {
        "userID": category.params.userID,
        "categoryID": category.params.categoryID,
        "is_fix": category.is_fix,
    };
};

// 카테고리 삭제
export const deleteCategoryRequestDTO = (category) => {
    return {
        "userID": category.params.userID,
        "categoryID": category.params.categoryID
    };
};