import { u_STATES } from "../constants/data.js";
import { registerParentData } from "../repo/repo.methods.js";
import { getGreeting } from "../utils/data.helper.js";
import { childrenTemp, registerTemp, replayTextMessage, textMessage } from "../utils/whatsapp.js";

export const register_state_method = async (from, type, message, user, msgID) => {
  try {
    if (type === "interactive" && message.interactive?.type === "nfm_reply") {

      const rawJson = message.interactive?.nfm_reply?.response_json;
      const parsed = JSON.parse(rawJson);
      const response = await registerParentData(parsed, from);
      const parent = response.data

      if (response.success) {
        await replayTextMessage(msgID,from,`${getGreeting()} ${parent?.name || ""} ${parent?.surName || ""}. You are registered successfully.`);
        const res = await childrenTemp(from);

        if (res) user.state = u_STATES.REGISTER_CHILD;
        else {
          user.state = u_STATES.INIT;
          await textMessage(from, "Temporary server is not able to response.");
        }

      }else{
        if(response && response.validationError && !response.success) await textMessage(from,`${response.validationError || ""}, Please fill out valid details.`);
        else await textMessage(from,"Unable to register, Please fill out the following form to register.");

        const res = await registerTemp(from);

        if (res) user.state = u_STATES.REGISTER;
        else {
          user.state = u_STATES.INIT;
          await textMessage(from, "Temporary server is not able to response.");
        }

      }

    } else {
      await textMessage(from, `${getGreeting()}, You are not registered yet. please fill the following form to start Whattameal services`);
      const res = await registerTemp(from);

      if (res) user.state = u_STATES.REGISTER;
      else {
        user.state = u_STATES.INIT;
        await textMessage(from, "Temporary server is not able to response.");
      }

    }
    
    await user.save();
  } catch (error) {
    console.log("Error in register_state_method", error);
    user.state = u_STATES.INIT;
    await user.save();
  }
};
