import { u_STATES } from "../constants/data.js";
import { mainMenu, textMessage, textWithLinkMessage } from "../utils/whatsapp.js";

export const book_next_meal_state_method = async (from, type, message, user, msgID) => {
  try {
    if (type === "interactive" && message.interactive?.type === "button_reply") {
      const replays = message.interactive?.button_reply?.id.split("__");
      if (replays[5] == "yes") {
        const uri = `${process.env.LOCAL_FE_DOMAIN_URI}/${user._id}/book_next_meal?childID=${replays[1]}&menuID${replays[3]}`;
        const res = await textWithLinkMessage(from,`Please visit the below link to pay and confirm your booking.\n${uri}`);
        if (res) user.state = u_STATES.MAIN_MENU;
        else {
          user.state = u_STATES.BOOK_MEAL;
          await textMessage(from,"Temporary server is not able to response.");
        }

      } else {
        user.state = u_STATES.MAIN_MENU;
        const res = await textMessage(from, "Your next meal order process is cancelled successfully.");
        if(!res) await textMessage(from, "Temporary server is not able to response.")
      }
    } else {
      user.state = u_STATES.MAIN_MENU;
      await mainMenu(from)
    }
    await user.save();
  } catch (error) {
    console.log("Error in book_meal_state_method", error);
    user.state = u_STATES.INIT;
    await user.save();
  }
};
