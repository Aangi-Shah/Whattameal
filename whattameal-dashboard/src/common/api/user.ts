import { User } from '@/types'
import { HttpClient } from '../helpers'

function UserService() {
	return {
		get: (token: string) => {
			return HttpClient.get('/user/get', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		getUserByID: (token: string, id: string) => {
			return HttpClient.get(`/user/get/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		getLoggedinUser: (token: string) => {
			return HttpClient.get(`/user/get/loggedin`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		new: (token: string, data: User) => {
			return HttpClient.post(`/user/new`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		update: (token: string, id: string, data: User) => {
			return HttpClient.put(`/user/update/${id}`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		delete: (token: string, id: string) => {
			return HttpClient.delete(`/user/delete/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
	}
}

export default UserService()
