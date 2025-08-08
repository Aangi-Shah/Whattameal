import { useEffect, useState } from 'react'
import {
	Button,
	Card,
	Col,
	Form,
	Row,
	Spinner,
} from 'react-bootstrap'

// components
import { useAuthContext, userApi } from '@/common'
import { PageBreadcrumb } from '@/components'
import { User, UserValidation } from '@/types'
import { useNavigate, useParams } from 'react-router-dom'
import {
	validateUserName,
	validateName,
	validatePassword,
} from '@/utils/validation'
import { LoadingStates } from '@/types/Menu'

const UserForm = () => {
	const [state, setState] = useState<User>({
		firstName: '',
		lastName: '',
		userName: '',
		password: '',
	})

	const [validationState, setValidationState] = useState<UserValidation>({
		firstName: '',
		lastName: '',
		userName: '',
		password: '',
	})

	const [loaderStates, setLoaderStates] = useState<LoadingStates>({
		isLoading: false,
		isError: false,
	})

	const [errorState, setErrorState] = useState<string>('')

	const [validated, setValidated] = useState(false)
	const { user } = useAuthContext()
	const navigate = useNavigate()
	const params = useParams()

	const reSetStates = () => {
		setState({
			firstName: '',
			lastName: '',
			userName: '',
			password: '',
		})
		setLoaderStates({ isLoading: false, isError: false })
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		let error = ''

		switch (name) {
			case 'firstName':
				error = validateName(value, 'First ') || ''
				break
			case 'lastName':
				error = validateName(value, 'Last ') || ''
				break
			case 'userName':
				error = validateUserName(value) || ''
				break
			case 'password':
				error = validatePassword(value) || ''
				break
			default:
				break
		}

		setState((prev) => ({ ...prev, [name]: value }))
		setValidationState((prev) => ({ ...prev, [name]: error }))

		if (errorState) setErrorState('')
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		event.stopPropagation()

		const firstNameError = validateName(state.firstName, 'First ') || ''
		const lastNameError = validateName(state.lastName, 'Last ') || ''
		const userNameError = validateUserName(state.userName) || ''

		const passwordError = !params?.id
			? validatePassword(state.password) || ''
			: ''

		const hasError =
			firstNameError || lastNameError || userNameError || passwordError

		setValidationState({
			firstName: firstNameError,
			lastName: lastNameError,
			userName: userNameError,
			password: passwordError,
		})

		if (hasError) return

		setLoaderStates({ ...loaderStates, isLoading: true })
		setValidated(true)
		if (params?.id) {
			try {
				const res: any = await userApi.update(user.token, params.id, state)
				if (res?.success) {
					navigate('/user')
					reSetStates()
				}
			} catch (error: any) {
				const errorMessage =
					error?.message || 'Something went wrong. Please try again.'

				setErrorState(errorMessage)

				if (error?.message === 'Network Error') {
					console.log('error 500')
					navigate('/pages/error-500') 
				}
				setLoaderStates({ ...loaderStates, isError: true })
			} finally {
				setLoaderStates({ ...loaderStates, isLoading: false })
			}
		} else {
			try {
				const res: any = await userApi.new(user.token, state)
				if (res?.success) {
					navigate('/user')
					reSetStates()
				}
			} catch (error: any) {
				const errorMessage =
					error?.message || 'Something went wrong. Please try again.'

				setErrorState(errorMessage)
				setLoaderStates((prev) => ({ ...prev, isError: true }))

				if (error?.message === 'Network Error') {
					console.log('error 500')
					navigate('/pages/error-500')
				}
			} finally {
				setLoaderStates((prev) => ({ ...prev, isLoading: false }))
			}

		}
	}

	const handleCancel = () => {
		navigate('/user')
		reSetStates()
	}

	const fetchData = async (id: string) => {
		setLoaderStates({ ...loaderStates, isLoading: true })
		try {
			const res: any = await userApi.getUserByID(user.token, id)
			if (res?.success) {
				const typedData = res.data as User
				setState(typedData)
			}
		} catch (error) {
			setLoaderStates({ ...loaderStates, isError: true })
		} finally {
			setLoaderStates({ ...loaderStates, isLoading: false })
		}
	}

	useEffect(() => {
		if (params?.id && user?.token) fetchData(params.id)
	}, [params, user])

	return (
		<>
			<PageBreadcrumb
				title={`${params?.id ? 'Edit User' : 'New User'}`}
				subName="User"
			/>

			{loaderStates.isLoading && (
				<div className="text-center my-3">
					<Spinner animation="border" />
				</div>
			)}

			<Row className="v-100 d-flex justify-content-center align-items-center">
				<Col xs={12} sm={10} md={6} lg={5} xl={5}>
					<Card className="p-3 shadow">
						<Card.Body>
							<Form noValidate validated={validated} onSubmit={handleSubmit}>
								<Form.Group className="mb-3 d-flex justify-content-between">
									<Form.Label
										className="mb-0 pt-2"
										style={{ minWidth: '100px' }}>
										First name:
									</Form.Label>
									<div className="d-flex flex-column" style={{ width: '100%' }}>
										<input
											type="text"
											placeholder="Please enter first name"
											value={state.firstName}
											name="firstName"
											onChange={handleChange}
										/>
										<div className="error">
											{validationState.firstName}
										</div>
									</div>
								</Form.Group>
								<Form.Group className="mb-3 d-flex justify-content-between">
									<Form.Label
										className="mb-0 pt-2"
										style={{ minWidth: '100px' }}>
										Last name:
									</Form.Label>
									<div className="d-flex flex-column" style={{ width: '100%' }}>
										<input
											type="text"
											id="validationCustom03"
											placeholder="Please enter last name"
											value={state.lastName}
											name="lastName"
											onChange={handleChange}
										/>
										<div className="error">
											{validationState.lastName}
										</div>
									</div>
								</Form.Group>
								<Form.Group className="mb-3 d-flex justify-content-between">
									<Form.Label
										className="mb-0 pt-2"
										style={{ minWidth: '100px' }}>
										Username:
									</Form.Label>
									<div className="d-flex flex-column" style={{ width: '100%' }}>
										<input
											type="text"
											id="validationCustomUsername"
											placeholder="Please enter a username"
											value={state.userName}
											name="userName"
											onChange={handleChange}
										/>
										<div className="error">
											{validationState.userName}
										</div>
									</div>
								</Form.Group>

								{!params?.id && (
									<Form.Group className="mb-3 d-flex justify-content-between">
										<Form.Label
											className="mb-0 pt-2"
											style={{ minWidth: '100px' }}>
											Password
										</Form.Label>
										<div
											className="d-flex flex-column"
											style={{ width: '100%' }}>
											<input
												type="password"
												placeholder="Please enter a password"
												value={state.password}
												name="password"
												onChange={handleChange}
											/>
											<div className="error">
												{validationState.password}
											</div>
										</div>
									</Form.Group>
								)}

								{errorState && (
									<div className="alert alert-danger text-center mb-3 fw-semibold">
										{errorState}
									</div>
								)}

								<div className="d-flex justify-content-center gap-2 mt-4">
									<Button
										variant="primary"
										type="submit"
										className="w-50"
										disabled={loaderStates.isLoading}>
										{loaderStates.isLoading ? 'Saving...' : 'Save'}
									</Button>

									<Button
										variant="danger"
										type="button"
										className="w-50"
										onClick={handleCancel}>
										Cancel
									</Button>
								</div>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default UserForm
