import { u_STATES } from "../constants/data.js";
import { deleteChild, getChildrenByParent } from "../repo/repo.methods.js";
import { validateObjectID } from "../utils/validations.js";
import { childrenTemp, removeChildTemp, replayTextMessage, textMessage, YesNoQuickReply, mainMenu } from "../utils/whatsapp.js";

export const remove_child_state_method = async (from, type, message, user, msgID) => {
  try {
    if (type === "interactive" && message.interactive?.type === "list_reply") {
      const children = await getChildrenByParent(user._id);
      const childId = message.interactive?.list_reply?.id;

      if (validateObjectID(childId)) {
        await textMessage(from, "Please select a child to remove.");
        const res = await removeChildTemp(from, children);

        if (res) user.state = u_STATES.REMOVE_CHILD;
        else {
          user.state = u_STATES.MANAGE_CHILDREN;
          await textMessage(from, "Temporary server is not able to response.");
        }
        
        return;
      }

      const child = await deleteChild(childId);
      if (child) {
        await replayTextMessage(msgID,from,`Child '${child.name || ""}' removed successfully.`);
        const children = await getChildrenByParent(user._id);

        if (children.length > 0) {

          const res = await YesNoQuickReply(msgID,from,"Do you want to remove another child?",[{ id: "remove_child_yes", title: "Yes" },{ id: "remove_child_no", title: "No" }]);
          if (res) user.state = u_STATES.REMOVE_CHILD;
          else {
            user.state = u_STATES.MAIN_MENU;
            await textMessage(from, "Temporary server is not able to response.");
          }

        } else {

          await textMessage(from,"No children are found, please add a child to start services.");
          const res = await childrenTemp(from);

          if (res) user.state = u_STATES.REGISTER_CHILD;
          else {
            user.state = u_STATES.INIT;
            await textMessage(from, "25.Temporary server is not able to response.");
          }

        }
      }
    } else if (type === "interactive" && message.interactive?.type === "button_reply") {

      if (message.interactive?.button_reply?.id == "remove_child_yes") {
        const children = await getChildrenByParent(user._id);

        if (children.length > 0) {
          const rmvChqrRes = await removeChildTemp(from, children);

          if (rmvChqrRes) user.state = u_STATES.REMOVE_CHILD;
          else {
            user.state = u_STATES.MANAGE_CHILDREN;
            await textMessage(from, "Temporary server is not able to response.");
          }

        } else {

          await textMessage(from,"No child found, please add a child to start services.");
          const res = await childrenTemp(from);

          if (res) user.state = u_STATES.REGISTER_CHILD;
          else {
            user.state = u_STATES.INIT;
            await textMessage(from, "27.Temporary server is not able to response.");
          }

        }

      } else {

        const res = await mainMenu(from);
        if (res) user.state = u_STATES.MAIN_MENU;
        else {
          user.state = u_STATES.INIT;
          await textMessage(from, "28.Temporary server is not able to response.");
        }

      }

    } else {

      const res = await mainMenu(from);
      if (res) user.state = u_STATES.MAIN_MENU;
      else {
        user.state = u_STATES.INIT;
        await textMessage(from, "29.Temporary server is not able to response.");
      }

    }
    
    await user.save();
  } catch (error) {
    console.log("Error in remove_child_state_method", error);
    user.state = u_STATES.INIT;
    await user.save();
  }
};
