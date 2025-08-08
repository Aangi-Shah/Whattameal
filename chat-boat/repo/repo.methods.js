import { Child } from '../models/Child.model.js';
import { Menu } from '../models/Menu.model.js';
import { Parent } from '../models/Parent.model.js';
import { eChildModel, eParentModel } from '../utils/model.helper.js';
import { validateChild, validateObjectID, validateParent } from '../utils/validations.js';

export const getParentByPhone = async (phone="91") => {
  try {
    return await Parent.findOne({ phone });
  } catch (error) {
    console.log('Error while fetching parent by phone:', error);
    return null;
  }
}
export const getChildrenByParent = async (id) => {
  try {
    if (validateObjectID(id)) return null;
    return await Child.find({ parent: id });
  } catch (error) {
    console.log('Error fetching children by parent:', error);
    return null;
  }
}
export const getChildren = async (id) => {
  try {
    if (validateObjectID(id)) return null;
    return await Child.findById(id)
  } catch (error) {
    console.log('Error fetching children:', error);
    return null;
  }
}
export const saveNewParent = async (phone="91") => {
  try{
    return await Parent.create(eParentModel(phone));
  } catch (error) {
    console.log(`Error while saving new user with only phone :${phone}`, error)
    return null;
  }
}
export const registerParentData = async (parsed, phone) => {
  try {
    if(!parsed) return { validationError: "Unable to register, please try again", success: false };

    const name = parsed["name"] ? parsed["name"].trim() : parsed["name"];
    const surName = parsed["surName"] ? parsed["surName"].trim() : parsed["surName"];
    const email = parsed["email"] ? parsed["email"].toLocaleLowerCase().trim() : parsed["email"];
    const validateData = validateParent(name, surName, phone, email)
    
    if (validateData !== null) return { validationError: validateData, success: false };
    const model = await getParentByPhone(phone);
    if (!model) return null;
    model.name = name;
    model.surName = surName;
    model.email = email;
    console.log("👤 Registering new user:", model);
    await model.save();
    return { data: model, success: true }
  } catch (error) {
    console.log(`Error while parent registration process :${phone}`, error)
    return null;
  }
};
export const registerChild = async (parsed, _id) => {
  try {
    if(!parsed) return { validationError: "Unable to register, please try again", success: false };
    
    const name = parsed["name"] ? parsed["name"].trim() : parsed["name"];
    const birthdate = parsed["birthdate"];
    const school = parsed["school"];
    const className = parsed["class"];
    const division = parsed["division"];
    const mealType = parsed["mealType"];
    const schoolShift = parsed["schoolShift"];

    const validateData = validateChild(name,birthdate,school,className,division,mealType,schoolShift)
    if (validateData !== null) return { validationError: validateData, success: false };
    const model = eChildModel();
    model.parent = _id;
    model.name = name;
    model.dob = birthdate;
    model.school = school;
    model.className = className;
    model.divison = division;
    model.mealType = mealType;
    model.shift = schoolShift;
    const child = await Child.create(model);
    if(!child) return { validationError: "Temporary server is not able to add child", success: false }
    await Parent.findByIdAndUpdate(child.parent,{ $push: { children: child._id } },{ new: true });
    console.log("👶 Registered new child:", child);
    return { data: child, success: true }
  } catch (error) {
    console.log(`Error while child registration process :${_id}`, error)
    return null;
  }
};
export const deleteParent = async (id) => {
  try {
    if (validateObjectID(id)) return null;
    const parent = await Parent.findById(id);
    if(!parent) return null;
    const children = await Child.find({ parent: parent._id });
    if(children && children.length > 0) {
      children.forEach(async (child) => {
        await child.deleteOne();
      });
    }
    await parent.deleteOne();
    console.log("👤 Removed parent successfully:", parent);
    return { parent, success: true };
  } catch (error) {
    console.log(`Error while parent removal process :${id}`, error)
    return null;
  }
};
export const deleteChild = async (id) => {
  try {
    if (validateObjectID(id)) return null;
    const child = await Child.findById(id);
    if(!child) return null;
    const parent = await Parent.findByIdAndUpdate(child.parent, { $pull: { children: child._id } }, { new: true });
    if(!parent) return null;
    await child.deleteOne();
    console.log("👶 Removed child successfully:", child);
    return child;
  } catch (error) {
    console.log(`Error while child removal process :${id}`, error)
    return null;
  }
};
export const getMonthMeal = async (reqMonth) => {
  try {
    let firstDay, lastDay;
    if (!reqMonth || !/^\d{2}-\d{4}$/.test(reqMonth)) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      firstDay = new Date(year, month, 1);
      lastDay = new Date(year, month + 1, 0);
    } else {
      const [monthStr, yearStr] = reqMonth.split("-");
      const month = parseInt(monthStr, 10) - 1;
      const year = parseInt(yearStr, 10);
      if (isNaN(month) || isNaN(year) || month < 0 || month > 11) throw new CustomError(400, "Invalid month format. Please use MM-YYYY.");
      firstDay = new Date(year, month, 1);
      lastDay = new Date(year, month + 1, 0);
    }
    firstDay.setHours(0, 0, 0, 0);
    lastDay.setHours(23, 59, 59, 999);

    const menus = await Menu.find({ date: { $gte: firstDay, $lte: lastDay }});
    const sortedMenus = menus.sort((a, b) => new Date(a.date) - new Date(b.date));
    return sortedMenus;
  } catch (error) {
    console.log(`Error while finding next meal :${id}`, error)
    return null;
  }
};
export const getNextMeal = async () => {
  try {
    const now = new Date();
    let targetDate = new Date();
    if (now.getHours() < 21) {
      targetDate.setDate(now.getDate() + 1);
    } else {
      targetDate.setDate(now.getDate() + 2);
    }
    const startUTC = new Date(Date.UTC(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate(),0,0,0,0));
    const menu = await Menu.findOne({ date: { $gte: startUTC } }).sort({date: 1});
    if(!menu) return null
    return menu;
  } catch (error) {
    console.log(`Error while finding next meal :${id}`, error)
    return null;
  }
};
export const getMenuItem = async (id) => {
  try {
    if (validateObjectID(id)) return null;
    return await Menu.findById(id);
  } catch (error) {
    console.log(`Error while finding menu by id :${id}`, error)
    return null;
  }
};