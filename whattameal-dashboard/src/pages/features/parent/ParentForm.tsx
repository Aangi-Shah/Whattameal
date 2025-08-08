import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'

// components
import { useAuthContext, parentApi } from '@/common'
import { PageBreadcrumb } from '@/components'
import { useNavigate, useParams } from 'react-router-dom'
import { Parent } from '@/types'
import {
	validateEmail,
	validateFullName,
	validateMobileNumber,
} from '@/utils/validation'
import { LoadingStates } from '@/types/Menu'

const ParentForm = () => {
	const [state, setState] = useState<Parent>({
		name: '',
		surName: '',
		phone: '',
		email: '',
	})

	const [validationState, setValidationState] = useState({
		name: '',
		surName: '',
		phone: '',
		email: '',
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
			name: '',
			surName: '',
			phone: '',
			email: '',
		})
		setLoaderStates({ isLoading: false, isError: false })
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		let error = ''

		switch (name) {
			case 'name':
				error = validateFullName(value, 'Name') || ''
				break
			case 'surName':
				error = validateFullName(value, 'surName') || ''
				break
			case 'phone':
				error = validateMobileNumber(value) || ''
				break
			case 'email':
				error = validateEmail(value) || ''
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

		const nameError = validateFullName(state.name, 'Name') || ''
		const surNameError = validateFullName(state.surName, 'surName') || ''
		const phoneError = validateMobileNumber(state.phone) || ''
		const emailError = validateEmail(state.email) || ''

		const hasError = nameError || surNameError || phoneError || emailError

		setValidationState({
			name: nameError,
			surName: surNameError,
			phone: phoneError,
			email: emailError,
		})
		if (hasError) return

		const formattedState = {
			...state,
			phone: state.phone.startsWith('91') ? state.phone : `91${state.phone}`,
		}

		setLoaderStates({ ...loaderStates, isLoading: true })
		setValidated(true)
		if (params?.id) {
			try {
				const res: any = await parentApi.update(
					user.token,
					params.id,
					formattedState
				)
				if (res?.success) {
					navigate('/parent')
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

				setLoaderStates({ ...loaderStates, isError: true })
			} finally {
				setLoaderStates({ ...loaderStates, isLoading: false })
			}
		} else {
			try {
				const res: any = await parentApi.new(user.token, formattedState)
				if (res?.success) {
					navigate('/parent')
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
				setLoaderStates({ ...loaderStates, isError: true })
			} finally {
				setLoaderStates({ ...loaderStates, isLoading: false })
			}
		}
	}

	const handleCancel = () => {
		reSetStates()
		navigate('/parent')
	}

	const fetchData = async (id: string) => {
		setLoaderStates({ ...loaderStates, isLoading: true })
		try {
			const res: any = await parentApi.getParentByID(user.token, id)
			if (res?.success) {
				const typedData = res.data as Parent
				if (typedData.phone.startsWith('91')) {
					typedData.phone = typedData.phone.slice(2)
				}
				setState(typedData)
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
				title={`${params?.id ? 'Edit Parent' : 'New Parent'}`}
				subName="Parent"
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
										Name:
									</Form.Label>
									<div className="d-flex flex-column" style={{ width: '100%' }}>
										<input
											type="text"
											id="validationCustom01"
											placeholder="Please enter name"
											value={state.name}
											name="name"
											onChange={handleChange}
										/>
										<div className="error">
											{validationState.name}
										</div>
									</div>
								</Form.Group>
								<Form.Group className="mb-3 d-flex justify-content-between ">
									<Form.Label
										className="mb-0  pt-2"
										style={{ minWidth: '100px' }}>
										surName:
									</Form.Label>
									<div className="d-flex flex-column" style={{ width: '100%' }}>
										<input
											type="text"
											id="validationCustom02"
											placeholder="Please enter surName"
											value={state.surName}
											name="surName"
											onChange={handleChange}
										/>
										<div className="error">
											{validationState.surName}
										</div>
									</div>
								</Form.Group>
								<Form.Group className="mb-3 d-flex justify-content-between ">
									<Form.Label
										className="mb-0 pt-2"
										style={{ minWidth: '100px' }}>
										Phone Number:
									</Form.Label>
									<div className="d-flex flex-column" style={{ width: '100%' }}>
										<input
											type="text"
											id="validationCustom03"
											placeholder="Please enter phone number"
											value={state.phone}
											name="phone"
											onChange={handleChange}
										/>
										<div className="error">
											{validationState.phone}
										</div>
									</div>
								</Form.Group>
								<Form.Group className="mb-3 d-flex justify-content-between ">
									<Form.Label
										className="mb-0  pt-2"
										style={{ minWidth: '100px' }}>
										Email:
									</Form.Label>
									<div className="d-flex flex-column" style={{ width: '100%' }}>
										<input
											type="email"
											placeholder="Please enter email address"
											value={state.email}
											name="email"
											onChange={handleChange}
										/>
										<div className="error">
											{validationState.email}
										</div>
									</div>
								</Form.Group>

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

export default ParentForm
