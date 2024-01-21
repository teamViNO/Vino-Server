//category.dto.js

// 카테고리 조회
export const getCategoryResponseDTO = (category) => {
    return {
    "id": category.id,
    "name": category.name,
    "topCategory": category.top_category
    };
}

// 상위 카테고리 추가
export const addCategory1RequestDTO = (category) => {
    return {
        "name": category.body.name,
        "userID": category.params.userID,
    };
};

// 하위 카테고리 추가
export const addCategory2RequestDTO = (category) => {
    return {
        "name": category.body.name,
        "userID": category.params.userID,
        "categoryID":category.params.topCategoryID
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

// 카테고리 삭제
export const deleteCategoryRequestDTO = (category) => {
    return {
        "userID": category.params.userID,
        "categoryID": category.params.categoryID
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