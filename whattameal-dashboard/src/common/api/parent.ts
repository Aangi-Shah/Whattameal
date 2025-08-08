import { Parent } from '@/types/Parent'
import { HttpClient } from '../helpers'

function ParentService() {
	return {
		getAllPerents: (token: string) => {
			return HttpClient.get('/parent/get', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		getParentByID: (token: string, id: string) => {
			return HttpClient.get(`/parent/get/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		getChildByPerentID: (token: string, id: string) => {
			return HttpClient.get(`/child/get/parent/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		new: (token: string, data: Parent) => {
			return HttpClient.post(`/parent/new`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		update: (token: string, id: string, data: Parent) => {
			return HttpClient.put(`/parent/update/${id}`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		delete: (token: string, id: string) => {
			return HttpClient.delete(`/parent/delete/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
	}
}

export default ParentService()
