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
export const addCategoryResponseDTO = (category) => {
    return {
        "id": category.id,
        "name": category.name,
        "is_fix": category.is_fix,
        "fixed_at": category.fixed_at,
        "userId": category.user_id,
        "top_category": category.top_category,
    };
};

