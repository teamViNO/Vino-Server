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

// 상위 카테고리 추가
export const add1CategoryResponseDTO = (category,categoryID,etc) => {
    return {
        "topCategoryId": category.top_category,
        "categoryId": categoryID,
        "name": category.name,
        "etcId": etc
    };
}

// 하위 카테고리 추가
export const add2CategoryResponseDTO = (category,categoryID) => {
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

// 이동2
export const move2CategoryResponseDTO = (category,etc) => {
    return {
        "topCategoryId": category.top_category,
        "categoryId": category.category_id,
        "name": category.name,
        "etcId": etc
    };
}

// 카테고리 태그 가져오기
export const categoryTagResponseDTO = (categoryData, tags) => {
    return {
        user_id: categoryData.user_id,
        category_id: categoryData.category_id,
        tags: tags,
    };
};
