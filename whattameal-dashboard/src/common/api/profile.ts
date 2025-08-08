import { HttpClient } from '../helpers'

function ProfileService() {
	return {
		profile: (token:string) => {
			return HttpClient.get('/profile',{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		},
	}
}

export default ProfileService()
