export const getEUserModel = () => ({
  firstName: "",
  lastName: "",
  userName: "",
  password: "",
});
export const eParentModel = (phone = "") => ({
  state: "INIT",
  phone: phone,
  name: "",
  surName: "",
  email: "",
  children: [],
});
export const eChildModel = () => ({
  parent: null,
  name: "",
  dob: "",
  school: "",
  className: "",
  divison: "",
  mealType: "",
  shift: "",
});
export const getEMenuModel = (date="", meal="", price=0, createdBy=null, createdByName="", updatedBy=null, updatedByName="") => ({
  date: new Date(date) || date || "",
  meal,
  price,
  createdBy,
  createdByName,
  updatedBy,
  updatedByName,
});
export const getEMealModel = () => ({
  parent: null,
  child: null,
  bookingType: "",
  menus: [],
  menuItem: null,
  price: 0,
  isPaid: false,
  createdBy: null,
  createdByName: "",
  updatedBy: null,
  updatedByName: "",
});
