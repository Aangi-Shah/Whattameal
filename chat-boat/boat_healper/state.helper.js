import { u_STATES } from "../constants/data.js";
import { book_meal_state_method } from "./book_meal_state.helper.js";
import { book_next_meal_state_method } from "./book_next_meal_state.helper.js";
import { feedback_state_method } from "./feedback_state.helper.js";
import { initial_state_method } from "./initial_state.helper.js";
import { main_menu_state_method } from "./main_menu_state.helper.js";
import { manage_children_state_method } from "./manage_childrent_state.helper.js";
import { register_child_state_method } from "./register_child_state.helper.js";
import { register_state_method } from "./register_state.helper.js";
import { remove_child_state_method } from "./remove_child_state.helper.js";

export const handleState = async (user, message) => {
  console.log(`👤 --> USER IN ACTION, ${user.name} ${user.surName} : "${user.state}"`);

  const from = message.from;
  const msgID = message.id;
  const type = message.type;

  switch (user.state) {

    case u_STATES.INIT:
      await initial_state_method(from, type, message, user, msgID);
      break;

    case u_STATES.REGISTER:
      await register_state_method(from, type, message, user, msgID);
      break;

    case u_STATES.REGISTER_CHILD:
      await register_child_state_method(from, type, message, user, msgID);
      break;

    case u_STATES.MAIN_MENU:
      await main_menu_state_method(from, type, message, user, msgID);
      break;

    case u_STATES.MANAGE_CHILDREN:
      await manage_children_state_method(from, type, message, user, msgID);
      break;

    case u_STATES.REMOVE_CHILD:
      await remove_child_state_method(from, type, message, user, msgID);
      break;

    case u_STATES.BOOK_MEAL:
      await book_meal_state_method(from, type, message, user, msgID);
      break;
      
    case u_STATES.BOOK_NEXT_MEAL:
      await book_next_meal_state_method(from, type, message, user, msgID);
      break;

    case u_STATES.GIVE_FEEDBACK:
      await feedback_state_method(from, type, message, user, msgID);
      break;

    default:
      user.state = u_STATES.INIT;
      await user.save();
      break;
  }

  console.log(`👤 --> USER OUT ACTION, ${user.name} ${user.surName} : "${user.state}"`);
};
