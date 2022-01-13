import axios from "axios";
import { 
  GET_ITEMS,
  GET_LOCATION,
  UPDATE_CART,
  GET_HOMESCREENDATA,
  UPDATE_USER_DETAILS,
  GET_USERDATA,
  POSTS_LOADING} from "./types";

export const getUserData = (data) => async dispatch =>{
  dispatch(setPostsLoading());
  console.log(`Get User Data Action called with data:- ${data}`)
  await dispatch({
    type:GET_USERDATA,
    payload:{
      userData:data
    }
  })
}
export const updateUserdetails = (data) => async dispatch =>{
  dispatch(setPostsLoading());
  console.log(`Update User Details Action called with data:- ${data}`)
  await dispatch({
    type:UPDATE_USER_DETAILS,
    payload:{
      userDetails:data
    }
  })
}
export const getLocation = (latitude,longitude) => async dispatch =>{
  dispatch(setPostsLoading());
  console.log("Location action Called ");
  await dispatch({
    type:GET_LOCATION , 
    payload:
    {
      latitude: latitude,
      longitude: longitude
    }})
}
export const getItems = (productResponseStatus,productResponseData) => async dispatch => 
{
    dispatch(setPostsLoading());
    console.log("called in getItems action");
    dispatch({type:GET_ITEMS , 
      payload:{
          productResponseData: productResponseData,
          status: productResponseStatus
      }})
    // axios.get("/api/items/getPosts")
    //     .then(res => dispatch({type:GET_POSTS , payload:res.data}))
    //this return is going to the postReducer.js and would give value to action
    // return{
    //     type:GET_POSTS
    // };
}
export const updatedCart = (cartItemsArray,partOf,description) => async dispatch =>{
  dispatch(setPostsLoading());
  console.log("Update cart action Called ");
  await dispatch({
    type:UPDATE_CART , 
    payload:
    {
      cartItemsArray:cartItemsArray,
      partOf:partOf,
      description:description
    }})
}
export const getHomescreenData = (status,message,banner1,banner2,top_selling,recent_selling,whats_new,deal_products,top_category) => async dispatch =>
{
  dispatch(setPostsLoading());
  console.log("Update Homescreen data action Called ");
  dispatch({
                type:GET_HOMESCREENDATA , 
                payload:
                {
                  status: status,
                  message: message,
                  banner1: banner1,
                  banner2: banner2,
                  top_selling: top_selling,
                  recent_selling: recent_selling,
                  whats_new: whats_new,
                  deal_products: deal_products,
                  top_category: top_category
                }})
  
}



export const setPostsLoading = () => {
    return{
        type: POSTS_LOADING
    }
}