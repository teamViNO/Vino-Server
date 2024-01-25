//category.dto.js

// 카테고리 조회
export const getCategoryResponseDTO = (category) => {
    return {
    "categoryID": category.id,
    "name": category.name,
    "topCategoryID": category.top_category,
    "createdAt": category.created_at
    };
}

// 카테고리 변경 사항 있을 때
export const categoryResponseDTO = (category) => {
    return {
    "categoryID": category.id,
    "name": category.name,
    "topCategoryID": category.top_category
    };
}

//--------------------------------------------------------------------------------------

// 상위 또는 하위 카테고리 추가
export const addCategoryRequestDTO = (category) => {
    const time = new Date
    return {
        "name": category.body.name,
        "userID": category.params.userID,
        "topCategoryID" : category.params.topCategoryID,
        "createdAt" : time
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

// 카테고리 이동 (하위 -> 하위)
export const moveCategoryRequestDTO = (category) => {
    return {
        "userID": category.params.userID,
        "categoryID": category.params.categoryID,
        "topCategoryID": category.params.topCategoryID,
    };
};