import { authApi, useAuthContext } from '@/common'
import type { UserAuth } from '@/types'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// export default function useLogin() {
// 	const [loading, setLoading] = useState(false)
// 	const [error, setError] = useState('')
// 	const location = useLocation()
// 	const navigate = useNavigate()

// 	const { isAuthenticated, saveSession } = useAuthContext()

// 	const redirectUrl = useMemo(
// 		() =>
// 			location.state && location.state.from
// 				? location.state.from.pathname
// 				: '/',
// 		[location.state]
// 	)

// 	const login = async ({ userName, password }: UserAuth) => {
// 		setLoading(true)
// 		try {
// 			const res: any = await authApi.login({ userName, password })
// 			if (res.success === false) {
// 				console.error(res.message)
// 				throw new Error(res.message || 'Login failed')
// 			}

// 			if (res.token) {
// 				saveSession({ ...(res.user ?? {}), token: res.token })
// 				navigate(redirectUrl)
// 			}
// 		} catch (error: any) {
// 			setError(error.message || error)
// 		} finally {
// 			setLoading(false)
// 		}
// 	}

// 	return { loading, login, redirectUrl, isAuthenticated, error }
// }

// useLogin.ts
export default function useLogin() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const location = useLocation()
	const navigate = useNavigate()

	const { isAuthenticated, saveSession } = useAuthContext()

	const redirectUrl = useMemo(
		() =>
			location.state && location.state.from
				? location.state.from.pathname
				: '/',
		[location.state]
	)

	const login = async ({ userName, password }: UserAuth) => {
		setLoading(true)
		try {
			const res: any = await authApi.login({ userName, password })
			if (res.success === false) {
				throw new Error(res.message || 'Login failed')
			}

			if (res.token) {
				saveSession({ ...(res.user ?? {}), token: res.token })
				navigate(redirectUrl)
			}
		} catch (error: any) {
			const errorMessage =
				error?.message || 'Something went wrong. Please try again.'

			if (error?.message === 'Network Error') {
				// console.log('error 500')
				navigate('/pages/error-500')
			}
			setError(errorMessage || error)
		} finally {
			setLoading(false)
		}
	}

	const clearError = () => setError('')
	return { loading, login, redirectUrl, isAuthenticated, error, clearError }
}
