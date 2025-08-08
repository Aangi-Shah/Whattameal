import { u_STATES } from "../constants/data.js";
import { getChildrenByParent, getNextMeal } from "../repo/repo.methods.js";
import { formatDate } from "../utils/data.helper.js";
import { validateObjectID } from "../utils/validations.js";
import { ChildListTobookMeal, textMessage, textWithLinkMessage, YesNoQuickReply } from "../utils/whatsapp.js";

export const book_meal_state_method = async (from, type, message, user, msgID) => {
  try {
    if (type === "interactive" && message.interactive?.type === "list_reply") {
      const children = await getChildrenByParent(user._id);
      const childId = message.interactive?.list_reply?.id;

      if (validateObjectID(childId)) {
        await textMessage(from, "Please select a child to book meals.");
        const res = await ChildListTobookMeal(from, children);

        if (res) user.state = u_STATES.BOOK_MEAL;
        else {
          user.state = u_STATES.BOOK_MEAL;
          await textMessage(from, "Temporary server is not able to response.");
        }
        return;
      }

      const res = await YesNoQuickReply(msgID,from,"Please select the meal options accordingly",[{ id: childId + "_book_next_meal", title: "Book A Next Meal" },{ id: childId + "_book_customize", title: "Customize" }]);
      if (res) user.state = u_STATES.BOOK_MEAL;
      else {
        user.state = u_STATES.BOOK_MEAL;
        await textMessage(from,"Temporary server is not able to response.");
      }

    } else if (type === "interactive" && message.interactive?.type === "button_reply") {
      const replays = message.interactive?.button_reply?.id.split("_book_");

      if (message.interactive?.button_reply?.id && replays[1] && replays[1] == "next_meal") {
        const menu = await getNextMeal();
        if (!menu) {
          await textMessage(from,"Temporary no menu available to book any meals");
          return false;
        }

        const summaryRes = await textMessage(from,`Order Summary for next meal:\nDate: ${formatDate(menu.date)}\nMeal: ${menu.meal}\nTotal Payable Amount: ₹${menu.price}`);
        if (summaryRes) {
          const bookingquery = `childID__${replays[0]}__mealID__${menu._id}___book_next_meal__`;
          const res = await YesNoQuickReply(msgID,from,"Do you want to confirm your order?",[{ id: bookingquery + "yes", title: "Yes" },{ id: bookingquery + "no", title: "No" }]);

          if (res) user.state = u_STATES.BOOK_NEXT_MEAL;
          else {
            user.state = u_STATES.BOOK_MEAL;
            await textMessage(from,"Temporary server is not able to response.");
          }

        } else {
          user.state = u_STATES.BOOK_MEAL;
          await textMessage(from,"Temporary server is not able to response.");
        }

      } else if (message.interactive?.button_reply?.id && replays[1] && replays[1] == "customize") {
        const uri = `${process.env.LOCAL_FE_DOMAIN_URI}/${user._id}/book_customize_meal?childID=${replays[0]}`;
        const res = await textWithLinkMessage(from,`Please visit the below link to customize your meal.\n${uri}`);

        if (res) user.state = u_STATES.MAIN_MENU;
        else {
          user.state = u_STATES.BOOK_MEAL;
          await textMessage(from,"Temporary server is not able to response.");
        }

      }

    } else {

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
      
    }

    await user.save();
  } catch (error) {
    console.log("Error in book_meal_state_method", error);
    user.state = u_STATES.INIT;
    await user.save();
  }
};
