import { u_STATES } from "../constants/data.js";
import { getChildrenByParent } from "../repo/repo.methods.js";
import { callBackFunction } from "../utils/data.helper.js";
import { ChildListTobookMeal, childrenQuickReply, mainMenu, textMessage, YesNoQuickReply } from "../utils/whatsapp.js";
import { handleFullMenuReq, handleNextMealMenuReq } from "./meal_menu.helper.js";
import { handleOrderHistoryReq } from './order_history_state.helper.js';

export const main_menu_state_method = async (from, type, message, user, msgID) => {
  try {

    if (type === "interactive" && message.interactive?.type === "list_reply") {

      switch (message.interactive?.list_reply?.id) {

        case "option_full_menu": // Full Menu
          const fullMenuRes = await handleFullMenuReq(from);
          if(fullMenuRes.success){
            await callBackFunction(async() => {await mainMenu(from)}, 2);
          }else{
            if(!fullMenuRes.success && fullMenuRes.message) await textMessage(from, fullMenuRes.message);
            else await textMessage(from, "Temporary server is not able to response.");
          }

          user.state = u_STATES.MAIN_MENU;
          break;

        case "option_next_days_meal": // Next Meal's Menu
          const nextMealMenuRes = await handleNextMealMenuReq(from);
          if(nextMealMenuRes.success){
            await callBackFunction(async() => {await mainMenu(from)}, 2);
          }else{
            if(!nextMealMenuRes.success && nextMealMenuRes.message) await textMessage(from, nextMealMenuRes.message);
            else await textMessage(from, "Temporary server is not able to response.");
          }

          user.state = u_STATES.MAIN_MENU;
          break;

        case "option_book_meal": // Book Meal
          const children = await getChildrenByParent(user._id);
          if (!children || children.length <= 0 ) return textMessage(from,"No such child found, For which meals can be booked.");
          else if (children.length == 1) {
            const childId = children[0]._id;
            const res = await YesNoQuickReply(msgID,from,"Please select the meal options accordingly",[{ id: childId + "_book_next_meal", title: "Book A Next Meal" },{ id: childId + "_book_customize", title: "Customize" }]);
            if (res) user.state = u_STATES.BOOK_MEAL;
            else {
              user.state = u_STATES.BOOK_MEAL;
              await textMessage(from,"Temporary server is not able to response.");
            }
          }else{
            const bmlRes = await ChildListTobookMeal(from, children);
            if (bmlRes) user.state = u_STATES.BOOK_MEAL;
            else {
              user.state = u_STATES.INIT;
              await textMessage(from, "Temporary server is not able to response.");
            }
          }
          break;

        case "option_order_history": // Order History
          const ohRes = await handleOrderHistoryReq(from);
          if (!ohRes) textMessage(from, "No order history found.");
          user.state = u_STATES.MAIN_MENU;
          await mainMenu(from);
          break;
        
        case "option_meal_cancellation": // Meal Cancellation
          await textMessage(from, "No such booked meal found.");
          user.state = u_STATES.MAIN_MENU;
          await mainMenu(from);
          break;

        case "option_manage_children": // Manage Children
          const chqrRes = await childrenQuickReply(msgID,from,"Reply with folowing options to manage your children or enter 'Cancel' to abort");
          if (chqrRes) user.state = u_STATES.MANAGE_CHILDREN;
          else {
            user.state = u_STATES.MAIN_MENU;
            await textMessage(from, "Temporary server is not able to response.");
          }
          break;

        case "option_give_feedback": // Give Feedback
          const feedbackRes = await textMessage(from,"Please type your feedback message and send.");
          if (feedbackRes) user.state = u_STATES.GIVE_FEEDBACK;
          else {
            user.state = u_STATES.MAIN_MENU;
            await textMessage(from, "Temporary server is not able to response.");
          }
          break;

        case "option_other_queries": // Other Queries
          await textMessage(from,"Please write on hello@whattameal.com or dial +91 88660 59595 \nThank You.");
          await mainMenu(from);
          user.state = u_STATES.MAIN_MENU;
          break;
          
        default:
          user.state = u_STATES.MAIN_MENU;
          await mainMenu(from);
          break;
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
    console.log("Error in main_menu_state_method", error);
    user.state = u_STATES.INIT;
    await user.save();
  }
};
