import { parse, format, isValid, parseISO } from 'date-fns'

export const getFormatedDate = (
	date: string,
	dateFormat: string,
	returnFormat: string
): string => {
	try {
		if (!date) return ''

		let parsedDate
		if (date.includes('T') && date.includes('Z')) {
			parsedDate = parseISO(date)
		} else {
			parsedDate = parse(date, dateFormat, new Date())
		}

		if (!isValid(parsedDate)) {
			throw new Error(
				`Invalid date or format. Date: "${date}", Format: "${dateFormat}"`
			)
		}
		return format(parsedDate, returnFormat)
	} catch (error) {
		console.error('getFormatedDate Error:', (error as Error).message)
		return ''
	}
}
export const getFormatedMonth = (
	date: string | Date,
	inputFormat = 'yyyy-MM-dd',
	outputFormat = 'MM-yyyy' 
): string => {
	if (typeof date === 'string') {
		return format(parse(date, inputFormat, new Date()), outputFormat)
	} else {
		return format(date, outputFormat)
	}
}
export const getDisplayDateFormat = (dateStr: string): string => {
	if (!dateStr) return dateStr

	const cleanedDateStr = dateStr.trim()
	const date = new Date(cleanedDateStr)

	if (isNaN(date.getTime())) return dateStr

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]

	const day = date.getDate()
	const month = monthNames[date.getMonth()]
	const year = date.getFullYear()

	let hours = date.getHours()
	const minutes = date.getMinutes()
	const seconds = date.getSeconds()
	const ampm = hours >= 12 ? 'PM' : 'AM'

	hours = hours % 12
	hours = hours ? hours : 12

	const pad = (n: number) => n.toString().padStart(2, '0')

	return `${day} ${month}, ${year}, ${pad(hours)}:${pad(minutes)}:${pad(
		seconds
	)} ${ampm}`
}

export const getMinAllowedDOB = () => {
	const date = new Date()
	date.setFullYear(date.getFullYear() - 20) // Optional: child not older than 20 years
	return date.toISOString().split('T')[0]
}

// export const getDisplayDateFormat = (dateStr: string): string => {
//   if(!dateStr) return dateStr;

//   const cleanedDateStr = dateStr.trim();
//   const date = new Date(cleanedDateStr);
//   const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

//   if(!date) return dateStr;

//   const day = date.getUTCDate();
//   const month = monthNames[date.getUTCMonth()];
//   const year = date.getUTCFullYear();

//   let hours = date.getUTCHours();
//   const minutes = date.getUTCMinutes();
//   const seconds = date.getUTCSeconds();
//   const ampm = hours >= 12 ? 'PM' : 'AM';

//   hours = hours % 12;
//   hours = hours ? hours : 12;
//   const pad = (n: number) => n.toString().padStart(2, '0');
//   return `${day} ${month}, ${year}, ${pad(hours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
// }

// Users

export const super_user = 'SUPER_USER'
export const admin_user = 'ADMIN_USER'
export const getUserTypes = () => [admin_user, super_user]

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']