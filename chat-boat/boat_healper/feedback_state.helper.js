import { u_STATES } from "../constants/data.js";
import { Feedback } from "../models/FeedBack.model.js";
import { mainMenu, replayTextMessage, textMessage } from "../utils/whatsapp.js";

export const feedback_state_method = async (from, type, message, user, msgID) => {
  try {
    const feedback = Feedback.create({ parent: user._id, feedback: message.text?.body || "" })

    if(feedback) {
      await replayTextMessage(msgID,from,"Whattmeal is thankful for your feedback.");
      await mainMenu(from)
    }
    else await textMessage(from, "Sorry, something went wrong. Please try again later.");
    
    user.state = u_STATES.MAIN_MENU;
    await user.save();
  } catch (error) {
    console.log("Error in feedback_state_method", error);
    user.state = u_STATES.MAIN_MENU;
    await user.save();
  }
};
