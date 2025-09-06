import axios from "axios";
import { getUser } from "../reducers/userReducer";

export const asynchFetchUserDetails = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:8000/user/check-auth", {
      withCredentials: true, 
    });
    dispatch(getUser(response.data.user)); 
  } catch (error) {
    console.log(error.message);
    dispatch(getUser({})); 
  }
};
