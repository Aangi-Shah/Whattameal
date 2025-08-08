import { u_STATES } from "../constants/data.js";
import { getChildrenByParent } from "../repo/repo.methods.js";
import { getChildText } from "../utils/data.helper.js";
import { childrenQuickReply, childrenTemp, mainMenu, removeChildTemp, textMessage } from "../utils/whatsapp.js";

export const manage_children_state_method = async (from, type, message, user, msgID) => {
  try {

    if (type === "interactive" && message.interactive?.type === "button_reply") {
      const children = await getChildrenByParent(user._id);

      switch (message.interactive?.button_reply?.id) {

        case "add_child": // Add Child
          await textMessage(from,"Please fill out the detials of following form to add new child. write 'Cancel' to cancel and go back");

          const reschildrenTemp = await childrenTemp(from);
          if (reschildrenTemp) user.state = u_STATES.REGISTER_CHILD;
          else {
            user.state = u_STATES.MANAGE_CHILDREN;
            await textMessage(from, "Temporary server is not able to response.");
          }
          break;

        case "remove_child": // Remove Child
          const rmvChqrRes = await removeChildTemp(from, children);
          if (rmvChqrRes) user.state = u_STATES.REMOVE_CHILD;
          else {
            user.state = u_STATES.MANAGE_CHILDREN;
            await textMessage(from, "Temporary server is not able to response.");
          }
          break;

        case "view_children": // View Children
          if (children.length > 0) {
            let msg = "Your children are:\n";
            children.forEach(async (child, index) => (msg += getChildText(child, index)));

            const res = await textMessage(from, msg);
            if (res) user.state = u_STATES.MAIN_MENU;
            else {
              user.state = u_STATES.MANAGE_CHILDREN;
              await textMessage(from, "Temporary server is not able to response.");
            }
            await mainMenu(from);
            
          } else {
            await textMessage(from,"No children are found, please add a child to start services.");
            user.state = u_STATES.MAIN_MENU;
            await mainMenu(from);
          }

          break;

        default:
          const res = await childrenQuickReply(msgID,from,"Reply with folowing options to manage your children or enter 'Cancel' to cencel and go back");

          if (res) user.state = u_STATES.MANAGE_CHILDREN;
          else {
            user.state = u_STATES.MAIN_MENU;
            await textMessage(from, "21.Temporary server is not able to response.");
          }
          
          break;
      }

    } else {
      const res = await childrenQuickReply(msgID,from,"Reply with folowing options to manage your children or enter 'Cancel' to abort");

      if (res) user.state = u_STATES.MANAGE_CHILDREN;
      else {
        user.state = u_STATES.MAIN_MENU;
        await textMessage(from, "Temporary server is not able to response.");
      }

    }

    await user.save();
  } catch (error) {
    console.log("Error in manage_children_state_method", error);
    user.state = u_STATES.INIT;
    await user.save();
  }
};
