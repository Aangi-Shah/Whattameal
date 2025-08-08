import { u_STATES } from "../constants/data.js";
import { childrenTemp, mainMenu, registerTemp, textMessage } from "../utils/whatsapp.js";

export const initial_state_method = async (from, type, message, user, msgID) => {
  try {
    if (!user.name || !user.email || !user.surName) {
      await textMessage(from, "Welcome to Whattameal!");
      const res = await registerTemp(from);

      if (res) user.state = u_STATES.REGISTER;
      else {
        user.state = u_STATES.INIT;
        await textMessage(from, "Temporary server is not able to response.");
      }

    } else if (user.children.length <= 0) {
      const res = await childrenTemp(from);

      if (res) user.state = u_STATES.REGISTER_CHILD;
      else {
        user.state = u_STATES.INIT;
        await textMessage(from, "Temporary server is not able to response.");
      }

    } else {
      
      const res = await mainMenu(from);

      if (res) user.state = u_STATES.MAIN_MENU;
      else {
        user.state = u_STATES.INIT;
        await textMessage(from, "Temporary server is not able to response.");
      }

    }
    
    await user.save();
  } catch (error) {
    console.log("Error in initial_state_method", error);
    user.state = u_STATES.INIT;
    await user.save();
  }
};
