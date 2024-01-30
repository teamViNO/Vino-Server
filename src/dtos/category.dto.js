//category.dto.js

// 카테고리 조회
export const getCategoryResponseDTO = (category) => {
    return {
        "categoryId": category.id,
        "name": category.name,
        "topCategoryId": category.top_category,
        "createdAt": category.created_at
    };
}

// 상위 또는 하위 카테고리 추가
export const addCategoryResponseDTO = (category,categoryID) => {
    return {
        "topCategoryId": category.top_category,
        "categoryId": categoryID,
        "name": category.name,
    };
}

// 카테고리 수정 또는 카테고리 이동
export const fixCategoryResponseDTO = (category) => {
    return {
        "topCategoryId": category.top_category,
        "categoryId": category.category_id,
        "name": category.name,
    };
}
//--------------------------------------------------------------------------------------

// 카테고리 이동 (하위 -> 하위)
export const moveCategoryRequestDTO = (category) => {
    return {
        "categoryID": category.params.categoryID,
        "userID": category.userID,
        "topCategoryID": category.params.topCategoryID,
    };
};