import { ChildrenEdit, Children } from '@/types/Children'
import { HttpClient } from '../helpers'

function ChildrenService() {
	return {
        new: (token: string, data: Children) => {
                return HttpClient.post(`/child/new`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        },
        update: (token: string, id: string, data: ChildrenEdit) => {
                return HttpClient.put(`/child/update/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        },
        delete: (token: string, id: string) => {
                return HttpClient.delete(`/child/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        },
        getAllChild: (token: string) => {
			return HttpClient.get('/child/get', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
        getChildByID: (token: string, id: string) => {
			return HttpClient.get(`/child/get/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
        getParentByChildID: (token: string, id: string) => {
			return HttpClient.get(`/parent/get/child/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
    }
}
        
export default ChildrenService()