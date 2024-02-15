//category.dto.js

// 모든 카테고리 조회
export const getCategoryResponseDTO = (category) => {
    return {
        "categoryId": category.id,
        "name": category.name,
        "topCategoryId": category.top_category,
        "createdAt": category.created_at
    };
}

// 카테고리 하나 조회
export const getCategoryIdResponseDTO = (category) => {
    return {
        "categoryId": category[0].id,
        "name": category[0].name,
        "topCategoryId": category[0].top_category,
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

// 카테고리 수정
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
        "topCategoryId": category[0].top_category,
        "categoryId": category[0].id,
        "name": category[0].name,
        "etcId": etc
    };
}

// 카테고리 태그 가져오기
export const categoryTagResponseDTO = (categoryData, tags) => {
    return {
        user_id: categoryData.user_id,
        category_id: categoryData.category_id,
        tags: tags.map(tag => ({
            tag_id: tag.tag_id,
            name: tag.name,
        })),
    };

};
