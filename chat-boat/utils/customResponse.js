export const customResponse = (success, message, data) => ({ success: success, message: message, ...data });
export const errorResponse = (message) => ({ success: false, message: message });
  