import { LOGIN_USER } from "../_actions/types";

export default function (prevState = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...prevState, loginSuccess: action.payload };
      break;

    default:
      return prevState;
  }
}
