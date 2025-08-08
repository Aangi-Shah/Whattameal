import { HttpClient } from '../helpers'
import { Meal } from '@/types'

function MealService() {
	return {
		getAllmeals: (token: string) => {
			return HttpClient.get('/meal/get', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		getmealByID: (token: string, id: string) => {
			return HttpClient.get(`/meal/get/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},

		new: (token: string, data: Meal) => {
			return HttpClient.post(`/meal/new`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		update: (token: string, id: string, data: Meal) => {
			return HttpClient.put(`/meal/update/${id}`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		delete: (token: string, id: string) => {
			return HttpClient.delete(`/meal/delete/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
	}
}

export default MealService()
