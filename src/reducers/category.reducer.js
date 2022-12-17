import { categoryConstansts } from "../constants/constants";

const initState = {
    categories: [],
    loading: false,
    error: null
};


const buildNewCategories = (parentId, categories, category) => {
    let myCategories = [];

    if(parentId == undefined){
        return [
            ...categories,
            {
                _id: category._id,
                name: category.name,
                slug: category.slug,
                img : category.img,
                hours : category.hours,
                language : category.language,
                children: []
            }
        ];
    }
    
    for(let cat of categories){

        if(cat._id == parentId){
            myCategories.push({
                ...cat,
                children: cat.children ? buildNewCategories(parentId, [...cat.children, {
                    _id: category._id,
                    name: category.name,
                    slug: category.slug,
                    hours: category.hours,
                    language: category.language,
                    parentId: category.parentId,
                    children: category.children
                }], category) : []
            });
        }else{
            myCategories.push({
                ...cat,
                children: cat.children ? buildNewCategories(parentId, cat.children, category) : []
            });
        }

        
    }


    return myCategories;
}


export default (state = initState, action) => {
    switch(action.type){
        case categoryConstansts.GET_ALL_CATEGORIES_SUCCESS:
            state = {
                ...state,
                categories: action.payload.categories
            }
            break;
        case categoryConstansts.ADD_NEW_CATEGORY_REQUEST:
            state = {
                ...state,
                loading: true
            }
            break;
        case categoryConstansts.ADD_NEW_CATEGORY_SUCCESS:
            const category = action.payload.category;
            const updatedCategories = buildNewCategories(category.parentId, state.categories, category);
            
            state = {
                ...state,
                categories: updatedCategories,
                loading: false,
            }
            break;
        case categoryConstansts.ADD_NEW_CATEGORY_FAILURE:
            state = {
                ...initState
            }
            break;
            case 'GET_CATEGORY_BY_ID':
                state = {
                  ...state,
                  category: action.payload
                };
                break;
    }

    return state;
}