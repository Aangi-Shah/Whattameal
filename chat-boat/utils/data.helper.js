export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export const getChildText = (child, index, onlyName=false, onlyDetails=false) => {
  if(onlyName) return `${index + 1}. ${child.name}`
  if(onlyDetails) return `School:${child.school} Class:${child.className} Division:${child.divison}`;
  return `${index + 1}. ${child.name}\nBirthdate: ${formatDate(child.dob)}\nSchool: ${child.school}\nClass: ${child.className}\nDivision: ${child.divison}\nMeal Type: ${child.mealType}\nShift: ${child.shift}\n`;
};

export const getFullNameByDoc = (doc) => {
  if (!doc) return "";
  const { firstName, lastName, middleName, name } = doc;
  if (name) return `${name}`;
  else if (firstName && lastName && middleName) return `${firstName} ${middleName} ${lastName}`;
  else if (firstName && lastName) return `${firstName} ${lastName}`;
  else if (firstName) return `${firstName}`;
  else if (lastName) return `${lastName}`;
  else return "";
};

export const getTodaysDate = (format="mm-dd-yyyy") => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  if(format === "dd-mm-yyyy") return `${day}-${month}-${year}`;
  else if(format === "yyyy-mm-dd") return `${year}-${month}-${day}`;
  return Date.now();
};

export const formatDate = (dateInput) => {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based month
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export async function callBackFunction(func, seconds) {
  if (typeof func !== 'function') return null;
  if (typeof seconds !== 'number' || seconds < 0) return null;
  setTimeout(async () => {
    return await func();
  }, seconds * 1000);
}
