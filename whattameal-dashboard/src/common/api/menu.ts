import { HttpClient } from '../helpers'
import { Menu } from '@/types/Menu'

function MenuService() {
	return {
		getMenuData: (token: string, month: string) => {
			return HttpClient.get(`/menu/get?reqMonth=${month}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		getMenuByID: (token: string, id: string) => {
			return HttpClient.get(`/menu/get/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		new: (token: string, data: Menu) => {
			return HttpClient.post(`/menu/new`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		update: (token: string, id: string, data: Menu) => {
			return HttpClient.put(`/menu/update/${id}`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		delete: (token: string, id: string) => {
			return HttpClient.delete(`/menu/delete/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},

		uploadMenu: (token: string, data: FormData) => {
			return HttpClient.post('/menu/upload', data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
	}
}

export default MenuService()
