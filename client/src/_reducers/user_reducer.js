import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "../_actions/types";

export default function (prevState = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...prevState, loginSuccess: action.payload };
      break;
    case REGISTER_USER:
      return { ...prevState, register: action.payload };
      break;
    case AUTH_USER:
      return { ...prevState, userData: action.payload };
      break;
    default:
      return prevState;
  }
}
