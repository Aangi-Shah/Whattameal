import { HttpClient } from '../helpers'

function DropdownList() {
	return {
		getUserStatesDD: (token: string) => {
			return HttpClient.get('/dd/get/user-states', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},

		getSchoolsDD: (token: string) => {
			return HttpClient.get('/dd/get/schools', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},

		getClassesDD: (token: string) => {
			return HttpClient.get('/dd/get/class', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},

		getDivisonsDD: (token: string) => {
			return HttpClient.get('/dd/get/divisions', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},

		getMealTypesDD: (token: string) => {
			return HttpClient.get('/dd/get/meal-types', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},

		getSchoolShiftsDD: (token: string) => {
			return HttpClient.get('/dd/get/shcool-shifts', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
	}
}

export default DropdownList()
