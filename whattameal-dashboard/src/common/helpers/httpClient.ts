import axios from 'axios'

const ErrorCodeMessages: { [key: number]: string } = {
	401: 'Invalid credentials',
	403: 'Access Forbidden',
	500: 'Internal Server Error',
}

const _errorHandler = (error: any) => {
	const status = error?.response?.status
	const message =
		ErrorCodeMessages[status] ||
		error?.response?.data?.message ||
		error?.message ||
		'An unknown error occurred.'

	return Promise.reject({ status, message })
}


function HttpClient() {
	const _httpClient = axios.create({
		baseURL: import.meta.env.VITE_API_URL,
		timeout: 6000,
		headers: {
			'Content-Type': 'application/json',
		},
	})

	_httpClient.interceptors.response.use(
		(response) => response.data,
		_errorHandler
	)

	return {
		get: (url: string, config = {}) => _httpClient.get(url, config),
		post: (url: string, data: any, config = {}) =>
			_httpClient.post(url, data, config),
		patch: (url: string, config = {}) => _httpClient.patch(url, config),
		put: (url: string, data: any, config = {}) =>
			_httpClient.put(url, data, config),
		delete: (url: string, config = {}) => _httpClient.delete(url, config),
		client: _httpClient,
	}
}

export default HttpClient()
