import axios from "axios";
import dotenv from "dotenv";
import { getChildText } from "./data.helper.js";

dotenv.config();

const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const headers = { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,"Content-Type": "application/json" };
const getConfigue = ( method, data ) => ({ method, maxBodyLength: Infinity, url: WHATSAPP_API_URL, headers: headers, data });

export const textMessage = async (to, text) => {
  try {
    const response = await axios.post( WHATSAPP_API_URL, { messaging_product: "whatsapp", recipient_type: "individual", to, type: "text", text: { body: text } }, { headers: headers });
    console.log("✅ Text message Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending text message:", error.response?.data || error.message);
    return null;
  }
};
export const textWithLinkMessage = async (to, text) => {
  try {
    const response = await axios.post( WHATSAPP_API_URL, { messaging_product: "whatsapp", recipient_type: "individual", to, type: "text", text: { preview_url: true, body: text } }, { headers: headers });
    console.log("✅ Text message Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending text message:", error.response?.data || error.message);
    return null;
  }
};
export const imgMessage = async (to, url) => {
  let data = JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to, type: "image", image: { link: url } });
  let config = getConfigue("post", data);
  try {
    const response = await axios.request(config);
    console.log("✅ Image message Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending imgage message:", error.response?.data || error.message);
    return null;
  }
};
export const registerTemp = async (to) => {
  const payload = { messaging_product: "whatsapp", to, type: "template", template: { name: "new_user_register_v2_temp", language: { code: "en_US" },
      components: [
        { type: "header", parameters: [{ type: "image", image: { link: `${process.env.LOCAL_BE_DOMAIN_URI}/public/assets/img/logo.jpg` }}]},
        { type: "body", parameters: [] },
        { type: "button", sub_type: "flow", index: "0", parameters: [] },
      ]}};
  try {
    const response = await axios.post( WHATSAPP_API_URL, payload, { headers: headers });
    console.log("✅ Register Template Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending register template message:",error.response?.data || error.message);
    return null;
  }
};
export const childrenTemp = async (to) => {
  const payload = { messaging_product: "whatsapp", to, type: "template", template: { name: "new_child_register_v1_temp", language: { code: "en_US" },
      components: [
        { type: "body", parameters: [] },
        { type: "button", sub_type: "flow", index: "0", parameters: [] },
      ]}};
  try {
    const response = await axios.post( WHATSAPP_API_URL, payload, { headers: headers });
    console.log("✅ Child Template Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending Child template message:",error.response?.data || error.message);
    return null;
  }
};
export const replayTextMessage = async (message_id, to, text) => {
  const data = JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to, context: { message_id }, type: "text", text: { preview_url: false, body: text }, });
  const config = getConfigue("post", data);
  try {
    const response = await axios.request(config);
    console.log("✅ Replay text message Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending replay text message:",error.response?.data || error.message);
    return null;
  }
};
export const mainMenu = async (to) => {
  let data = JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: to, type: "interactive",
    interactive: { type: "list", header: { type: "text", text: "Whattameal" }, body: { text: "Select option for services." }, footer: { text: "" }, action: { button: "Options",
        sections: [{ title: "",
            rows: [
              {id:"option_full_menu", title:"Full Menu", description:"",},
              {id:"option_next_days_meal", title:"Next Day's Meal", description:"",},
              {id:"option_book_meal", title:"Book Meal", description:"",},
              {id:"option_order_history", title:"Order History", description:"",},
              {id:"option_meal_cancellation", title:"Meal Cancellation", description:"",},
              {id:"option_manage_children", title:"Manage Children", description:"",},
              {id:"option_give_feedback", title:"Give Feedback", description:"",},
              {id:"option_other_queries", title:"Other Queries", description:"",},
            ]}]}}});
  try {
    const response = await axios.request(getConfigue("post", data));
    console.log("✅ Main Services Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending main services:",error.response?.data || error.message);
    return null;
  }
};
export const YesNoQuickReply = async (messageId, to, text, data = []) => {
  const body = { messaging_product: "whatsapp", to, context: { message_id: messageId }, type: "interactive", interactive: { type: "button", body: { text }, action: { buttons: [ ...data.map((opt) => ({ type: opt.type || "reply", reply: { id: opt.id, title: opt.title }, })), ]}}};
  try {
    const response = await axios.post(WHATSAPP_API_URL, body, { headers: headers });
    console.log("✅ Quick reply sent:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Error sending quick reply:",err.response?.data || err.message);
    return null;
  }
};
export const childrenQuickReply = async ( messageId, to, text, ids = { add: "add_child", remove: "remove_child", view: "view_children" } ) => {
  const body = { messaging_product: "whatsapp", to, context: { message_id: messageId }, type: "interactive", interactive: { type: "button", body: { text }, action: { buttons: [
          { type: "reply", reply: { id: ids.add, title: "Add Child" } },
          { type: "reply", reply: { id: ids.remove, title: "Remove Child" } },
          { type: "reply", reply: { id: ids.view, title: "View Children" } },
        ]}}};
  try {
    const response = await axios.post(WHATSAPP_API_URL, body, { headers: headers });
    console.log("✅ Quick children reply sent:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Error sending quick children reply:",err.response?.data || err.message);
    return null;
  }
};
export const removeChildTemp = async (to, children = []) => {
  let data = JSON.stringify({messaging_product: "whatsapp",recipient_type: "individual",to: to,type: "interactive",interactive: { type: "list", header: { type: "text", text: "Whattameal" },
      body: { text: "Select child, which you want to remove or enter 'Cancel' to abort" }, footer: { text: "" },
      action: { button: "Options", sections: [{ title: "", rows: [ ...children.map((child, idx) => ({ id: child._id, title: getChildText(child, idx, true), description: getChildText(child, idx, false, true) }))]}]}}
  });
  try {
    const response = await axios.request(getConfigue("post", data));
    console.log("✅ remove children templete Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending remove children templete:",error.response?.data || error.message);
    return null;
  }
};
export const bookMealMainList = async (to) => {
  let data = JSON.stringify({messaging_product: "whatsapp",recipient_type: "individual",to: to,type: "interactive",interactive: { type: "list", header: { type: "text", text: "Whattameal" }, body: { text: "Select from following to book meal like.." }, footer: { text: "" },
      action: { button: "Options", sections: [ { title: "", rows: [
              { id: "meal_option_1", title: "Book Tomorrow Meal", description: "", },
              { id: "meal_option_2", title: "Book 5 Day's Meal", description: "", },
              { id: "meal_option_3", title: "Book Entire Month's Meal", description: "", },]}]}}});
  try {
    const response = await axios.request(getConfigue("post", data));
    console.log("✅ Book Meal Main List Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending Book Meal Main List:",error.response?.data || error.message);
    return null;
  }
};
export const ChildListTobookMeal = async (to, children = []) => {
  let data = JSON.stringify({messaging_product: "whatsapp",recipient_type: "individual",to: to,type: "interactive",interactive: { type: "list", header: { type: "text", text: "Whattameal" },
      body: { text: "Select child, For which you want to book meal" }, footer: { text: "" },
      action: { button: "Options", sections: [{ title: "", rows: [ ...children.map((child, idx) => ({ id: child._id, title: getChildText(child, idx, true), description: getChildText(child, idx, false, true) }))]}]}}
  });
  try {
    const response = await axios.request(getConfigue("post", data));
    console.log("✅ children templete for meal booking Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending children templete for meal booking:",error.response?.data || error.message);
    return null;
  }
};  