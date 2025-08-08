// Validation.ts
import { getUserTypes } from './helper'

export function validateFullName(name: string, field: string): string | null {
	if (!name || name.trim().length === 0) return field + " shouldn't be empty"
	if (!/[a-zA-Z]/.test(name[0]))
		return 'First character of name should be alphabet'
	if (name.includes('  ')) return "Name shouldn't contain consecutive spaces"
	if (!/[a-zA-Z]$/.test(name))
		return 'Last character of name should be alphabet'
	if (/[0-9]/.test(name)) return "Name shouldn't contain numbers"
	if (/[!@#$%^&*(),.?":{}|<>]/.test(name))
		return "Name shouldn't contain special characters"
	return null
}

export function validateName(name: string, type: string): string | null {
	if (name.includes(' ')) return type + "name shouldn't contain empty space"
	if (!name || name.trim().length === 0) return type + "name shouldn't be empty"
	if (!/^[a-zA-Z]+$/.test(name))
		return type + 'name should contain only alphabets'
	if (!/[a-zA-Z]/.test(name[0]))
		return 'First character of name should be alphabet'
	if (name.includes('  '))
		return type + "name shouldn't contain consecutive spaces"
	if (!/[a-zA-Z]$/.test(name))
		return 'Last character of name should be alphabet'
	if (/[0-9]/.test(name)) return type + "name shouldn't contain numbers"
	if (/[!@#$%^&*(),.?":{}|<>]/.test(name))
		return type + "name shouldn't contain special characters"
	return null
}

export function validateUserName(userName: string): string | null {
	const userNamePattern = /^[a-zA-Z0-9\W_]+$/
	if (!userName || userName.trim().length === 0)
		return "Username shouldn't be empty"
	if (userName.trim().length > 30)
		return 'Username must be between 1 and 30 characters long'
	if (!userNamePattern.test(userName))
		return 'Username should contain Alphabets, Numbers and special character'
	return null
}

export function validateMobileNumber(mobileNumber: string): string | null {
	if (!mobileNumber || mobileNumber.trim().length === 0)
		return "Mobile number shouldn't be empty"
	if (mobileNumber.includes(' '))
		return 'Mobile number should not contain any space'
	if (mobileNumber.length !== 10) return 'Mobile number should be of 10 digits'
	if (!/^[0-9]+$/.test(mobileNumber))
		return 'Mobile number should contain only numbers'
	if (mobileNumber.startsWith('0'))
		return "Mobile number shouldn't start with 0"
	return null
}

export function validateEmail(email: string): string | null {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	const ipRegex =
		/^(?!-)[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,}|(\.\d{1,3}){3})$/
	if (!email || email.trim().length === 0) return "Email shouldn't be empty"
	const parts = email.split('@')
	if (parts.length !== 2)
		return "Email should contain exactly one '@' character"
	const localPart = parts[0]
	const domainPart = parts[1]
	if (localPart.length === 0 || localPart.length > 64)
		return 'Local part should be between 1 to 64 characters'
	if (localPart.endsWith('.') || localPart.startsWith('.'))
		return "Local part shouldn't start or end with a dot"
	if (/\.{2,}/.test(localPart))
		return "Local part shouldn't have consecutive dots"
	if (!ipRegex.test(domainPart) && !emailRegex.test(domainPart))
		return 'Email domain should be valid'
	if (!emailRegex.test(email)) return 'Email should be valid'
	if (/[A-Z]/.test(email)) return 'Email should not contain uppercase letters'
	return null
}

export function validatePassword(password: string): string | null {
	if (!password || password.trim().length === 0)
		return "Password shouldn't be empty"

	if (password.trim().length < 5 || password.trim().length > 15)
		return 'Password must be between 5 and 15 characters long'

	// Check for valid characters: allow any printable character except whitespace
	const validCharPattern = /^[\x21-\x7E]+$/ // printable ASCII excluding space
	if (!validCharPattern.test(password))
		return 'Password contains invalid characters. Only printable non-space characters are allowed.'

	// Check for required elements
	const hasLowercase = /[a-z]/.test(password)
	const hasUppercase = /[A-Z]/.test(password)
	const hasDigit = /\d/.test(password)
	const hasSpecial = /[^A-Za-z\d]/.test(password) // any non-alphanumeric

	if (!hasLowercase || !hasUppercase || !hasDigit || !hasSpecial)
		return 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'

	return null
}

export function validateRole(role: string): string | null {
	const roles = getUserTypes()
	const isRole: string | undefined = roles.find((e: string) => e === role)
	if (!role || role.trim().length === 0) return "Role shouldn't be empty"
	if (!isRole) return 'Select a valid role'
	return null
}

export function validatePinCode(pinCode: string): string | null {
	if (!pinCode || pinCode.trim().length === 0)
		return "Pin code shouldn't be empty"
	if (pinCode.includes(' ')) return "Pin code shouldn't contain empty space"
	if (pinCode.length > 6) return 'Pin code should be of 6 digits'
	return null
}

export function validateEmptyValue(
	value: string,
	field: string
): string | null {
	if (!value || value.trim().length === 0) return field + " shouldn't be empty"
	return null
}

export const validateMultySelectEmptyValue = (value: string, name: string) => {
	if (Array.isArray(value) && value.length === 0) {
		return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
	}
	return null // or other validation logic
}

export function validateWorkTypes(
	checkedItems: Record<string, boolean>
): string | null {
	const isAnySelected = Object.values(checkedItems).some((checked) => checked)
	if (!isAnySelected) return 'At least one work type must be selected.'
	return null
}

export function validateDOB(value: string, fieldName = 'DOB'): string | null {
	if (!value || value.trim().length === 0) {
		return `${fieldName} shouldn't be empty`
	}

	const selectedDate = new Date(value)
	const today = new Date()
	const twoYearsAgo = new Date()
	twoYearsAgo.setFullYear(today.getFullYear() - 2)

	if (selectedDate > today) {
		return `${fieldName} cannot be in the future`
	}

	if (selectedDate > twoYearsAgo) {
		return `${fieldName} must be at least 2 years old`
	}

	return null // Valid
}
