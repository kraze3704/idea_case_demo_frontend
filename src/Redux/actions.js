import axios from 'axios';

import ActionTypes from './actionTypes';

const HOST_URL = `http://localhost:8080`;

// import TestCategories from '../Models/TestData';

/*
 * old addCategory
// action creators
export const addCategory = category => ({
    type: ActionTypes.ADD_CATEGORY,
    payload: {
        id: category.id,
        name: category.name,
        budget: category.budget,
    }
});
*/

// actions for requesting ADD category then returning response
export const category_ADD_REQ = () => ({
    type: ActionTypes.CATEGORY_ADD_REQ,
});

export const category_ADD_OK = () => ({
    type: ActionTypes.CATEGORY_ADD_OK,
});

export const category_ADD_X = () => ({
    type: ActionTypes.CATEGORY_ADD_X,
});

export function addCategory(category) {
    return async (dispatch, getState) => {
        dispatch(category_ADD_REQ());
        // console.dir(category);

        if( !category.name || !category.budget ) {
            dispatch(category_ADD_X());
        } else {
            const returnValue = await axios.post(`${HOST_URL}/categoryADD`, category)
                .then(res => { return {"message": res.data, "status": res.status} })
                .catch(err => console.error(err));

            if( returnValue.status === 200) {
                // send back a success message
                dispatch(category_ADD_OK());
                //then fetch the current state again with fetchAll helper function
                dispatch(Category_ALL_FETCH());
            }else { // if add fails log the error message and dispatch failure function
                console.log(returnValue.message);
                dispatch(category_ADD_X());
            }
        }
    }
};

// actions for fetching all the category list from Redux
export const category_ALL_REQ = () => ({
    type: ActionTypes.CATEGORY_ALL_REQ,
});

export const category_ALL_OK = (categoryList) => ({
    type: ActionTypes.CATEGORY_ALL_OK,
    categoryList,
});

export const category_ALL_X = () => ({
    type: ActionTypes.CATEGORY_ALL_X,
});

export function Category_ALL_FETCH() {
    return async (dispatch, getState) => {
        dispatch(category_ALL_REQ());

        /* old mock db example
         * const categoryList = TestCategories();
        */

        const returnValue = await axios.get(`${HOST_URL}/category/all`)
            .then(res => { return {"categoryList": res.data, "status": res.status} })
            .catch(err => console.error(err));

        if(returnValue.status !== 200) {
            dispatch(category_ALL_X());
            //console.log('ADD_X', categoryList);
        } else {
            dispatch(category_ALL_OK(returnValue.categoryList));
            //console.log('ADD_OK', categoryList);
        }
    }
};

export const category_DEL_REQ = () => ({
    type: ActionTypes.CATEGORY_DEL_REQ,
});

export const category_DEL_OK = () => ({
    type: ActionTypes.CATEGORY_DEL_OK,
});

export const category_DEL_X = () => ({
    type: ActionTypes.CATEGORY_DEL_X,
})

export function deleteCategory(categoryId) {
    return async(dispatch, getState) => {
        dispatch(category_DEL_REQ());
        // console.dir(categoryId);

        const returnValue = await axios.get(`${HOST_URL}/categoryDELETE?id=${categoryId}`)
            .then(res => { return {"message": res.data, "status": res.status}; })
            .catch(err => console.error(err));

        // check store if the id exists to decide
        // => check the return status code to determine if the id was found
        // 400: id value missing / 404: data not found with id / 200: delete successful
        if ( returnValue.status === 200 ) {
            // success return
            dispatch(category_DEL_OK());
            // fetch and return the current state of Store
            dispatch(Category_ALL_FETCH());
        } else {
            console.log(returnValue.message);
            dispatch(category_DEL_X());
        }
    }
}

export const category_FILTER_BY_BUDGET_LIMIT_REQ = () => ({
    type: ActionTypes.CAT_FILTER_BY_BUDGET_LIMIT_REQ,
})

export const category_FILTER_BY_BUDGET_LIMIT_OK = (idsSelected) => ({
    type: ActionTypes.CAT_FILTER_BY_BUDGET_LIMIT_OK,
    idsSelected,
})

export const category_FILTER_BY_BUDGET_LIMIT_X = () => ({
    type: ActionTypes.CAT_FILTER_BY_BUDGET_LIMIT_X,
})

export function CategoryFilterBudgetLimit(limit) {
    return async(dispatch, getState) => {
        // first dispatch REQ action
        dispatch(category_FILTER_BY_BUDGET_LIMIT_REQ());

        // then call the AJAX with axios(GET, param limit & above = true)
        const returnValue = await axios.get(`${HOST_URL}/categoryBudgetLimit?limit=${limit}&above=true`)
            .then(res => {return { "response": res.data, "status": res.status }})
            .catch(err => console.log(err));

        // then dispatch the OK / X Action
        // passing the id array to the Redux store "idsSelected" property under 'categories' store option
        if( returnValue.status === 200 ) {
            dispatch(category_FILTER_BY_BUDGET_LIMIT_OK(returnValue.response));
        } else {
            console.log(returnValue.response);
            dispatch(category_FILTER_BY_BUDGET_LIMIT_X());
        }
    }
}