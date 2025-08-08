import { u_STATES } from "../constants/data.js";
import { registerChild } from "../repo/repo.methods.js";
import { childrenTemp, mainMenu, replayTextMessage, textMessage, YesNoQuickReply } from "../utils/whatsapp.js";

export const register_child_state_method = async (from, type, message, user, msgID) => {
  try {
    if (type === "interactive" && message.interactive?.type === "nfm_reply") {

      const rawJson = message.interactive?.nfm_reply?.response_json;
      const parsed = JSON.parse(rawJson);
      const response = await registerChild(parsed, user._id);
      const child = response.data;

      if (response.success) {
        await replayTextMessage(msgID,from,`Child '${child.name || ""}' added successfully.`);
        const res = await YesNoQuickReply(msgID,from,"Do you want to add another child?",[{ id: "add_child_yes", title: "Yes" },{ id: "add_child_no", title: "No" }]);
        
        if (res) user.state = u_STATES.REGISTER_CHILD;
        else {
          const res = await mainMenu(from);

          if (res) user.state = u_STATES.MAIN_MENU;
          else {
            user.state = u_STATES.INIT;
            await textMessage(from, "Temporary server is not able to response.");
          }

        }

      } else {
        
        if(response && response.validationError && !response.success) await textMessage(from, `${response.validationError || ""}, Please fill out valid details.`)
        else await textMessage(from,"Unable to add your child, Please fill out the following form to add your child.");

        const res = await childrenTemp(from);

        if (res) user.state = u_STATES.REGISTER_CHILD;
        else {
          user.state = u_STATES.INIT;
          await textMessage(from, "Temporary server is not able to response.");
        }

      }

    } else if (type === "interactive" && message.interactive?.type === "button_reply") {

      if (message.interactive?.button_reply?.id == "add_child_yes") {

        await textMessage(from,"Please fill out the following form to add another child. write 'Cancel' to cancel and go back");

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

    } else {

      await textMessage(from,"Please fill out the following form to add your child. write 'Cancel' to cancel and go back");
      const res = await childrenTemp(from);

      if (res) user.state = u_STATES.REGISTER_CHILD;
      else {
        user.state = u_STATES.INIT;
        await textMessage(from, "11.Temporary server is not able to response.");
      }
      
    }

    await user.save();
  } catch (error) {
    console.log("Error in register_child_state_method", error);
    user.state = u_STATES.INIT;
    await user.save();
  }
};
