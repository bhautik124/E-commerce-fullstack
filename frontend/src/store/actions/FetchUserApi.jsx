import axios from "axios";
import { getUser } from "../reducers/userReducer";
import { showErrorToast, showSuccessToast } from "../../utils/toast.jsx";

export const asynchFetchUserDetails = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:8000/user/check-auth", {
      withCredentials: true, 
    });
    
    if (response.data.user && Object.keys(response.data.user).length > 0) {
      dispatch(getUser(response.data.user));
      showSuccessToast(`Welcome back ${response.data.user.username}!`);
    } else {
      dispatch(getUser({}));
    }
  } catch (error) {
    console.error("Auth check error:", error);
    dispatch(getUser({}));
    
    // Only show error if it's not a 401 (unauthorized) which is normal for non-logged in users
    if (error.response && error.response.status !== 401) {
      showErrorToast("Failed to load user information");
    }
  }
};
