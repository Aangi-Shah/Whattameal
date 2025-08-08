import { UserAuth } from '@/types'
import { HttpClient } from '../helpers'

function AuthService() {
	return {
		login: (creds: UserAuth) => {
			return HttpClient.post('/auth/login', creds)
		},
		logout(token: string) {
			return HttpClient.get('/auth/logout', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
		forgetPassword: (userName: string) => {
			return HttpClient.post('/auth/forget-password', userName)
		},
	}
}

export default AuthService()
