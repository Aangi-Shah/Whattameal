import dotenv from "dotenv";
import { deleteParent, getParentByPhone, saveNewParent } from "../repo/repo.methods.js";
import { handleState } from "../boat_healper/state.helper.js";
import { u_STATES } from "../constants/data.js";
import { textMessage } from "../utils/whatsapp.js";

dotenv.config();

export async function handleWebhookVerification(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === process.env.VERIFY_TOKEN) {
    console.log("✅ Webhook Verified!");
    return res.status(200).send(challenge);
  }

  console.log("❌ Webhook Verification Failed!");
  return res.sendStatus(403);
}

export async function handleUserIntaraction(req, res) {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    console.log("👤 user interaction, message recived --> ", entry);
    if (!entry) return res.sendStatus(200);

    const phone = entry.from;
    const message = entry;

    let user = await getParentByPhone(phone);
    if (!user) user = await saveNewParent(phone);
    if(!user) return res.sendStatus(200);

    const smgText = message.text?.body?.toLowerCase();

    if (smgText == "reset") {
      const response = await deleteParent(user._id);
      if (response.success) await textMessage(phone, "Your account has been reset successfully.");
      return res.sendStatus(200);
    }

    if (smgText == "cancel" || smgText == "close" || smgText == "back") user.state = u_STATES.INIT;

    await handleState(user, message);
    res.sendStatus(200);
  } catch (error) {
    console.log("❌ ERROR HANDLING USER INTERACTION: ", error);
    res.sendStatus(200);
  }
}
