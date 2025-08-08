import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'

// components
import { useAuthContext, childrenApi, DropdownList } from '@/common'
import { PageBreadcrumb } from '@/components'
import { useNavigate, useParams } from 'react-router-dom'
import {
	validateDOB,
	validateEmptyValue,
	validateFullName,
} from '@/utils/validation'
import { Children, ChildrenValidation, DropdownOption } from '@/types'
import { LoadingStates } from '@/types/Menu'
const ChildrenForm = () => {
	const [state, setState] = useState<Children>({
		name: '',
		dob: '',
		school: '',
		className: '',
		divison: '',
		mealType: '',
		shift: '',
		parent: '',
		_id: '',
		isDeleted: false,
		__v: 0,
	})

	const [validationState, setValidationState] = useState<ChildrenValidation>({
		name: '',
		dob: '',
		school: '',
		className: '',
		divison: '',
		mealType: '',
		shift: '',
		parent: '',
	})

	const [loaderStates, setLoaderStates] = useState<LoadingStates>({
		isLoading: false,
		isError: false,
	})

	const [errorState, setErrorState] = useState<string>('')

	const [validated, setValidated] = useState(false)
	const { user } = useAuthContext()
	const params = useParams()
	const navigate = useNavigate()

	const reSetStates = () => {
		setState({
			name: '',
			dob: '',
			school: '',
			className: '',
			divison: '',
			mealType: '',
			shift: '',
			parent: '',
			_id: '',
			isDeleted: false,
			__v: 0,
		})
		setLoaderStates({ isLoading: false, isError: false })
	}

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = event.target
		let error = ''

		switch (name) {
			case 'name':
				error = validateFullName(value, 'Name') || ''
				break
			case 'dob':
				error = validateDOB(value, 'Birthdate') || ''
				break
			case 'school':
				error = validateEmptyValue(value, 'School') || ''
				break
			case 'className':
				error = validateEmptyValue(value, 'Class') || ''
				break
			case 'divison':
				error = validateEmptyValue(value, 'Divison') || ''
				break
			case 'mealType':
				error = validateEmptyValue(value, 'Meal Type') || ''
				break
			case 'shift':
				error = validateEmptyValue(value, 'Shift') || ''
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
		const dobError = validateEmptyValue(state.dob, 'birthdate') || ''
		const schoolError = validateEmptyValue(state.school, 'school') || ''
		const classError = validateEmptyValue(state.className, 'class') || ''
		const divisonError = validateEmptyValue(state.divison, 'divison') || ''
		const mealTypeError = validateEmptyValue(state.mealType, 'mealType') || ''
		const shiftError = validateEmptyValue(state.shift, 'shift') || ''

		const hasError =
			nameError ||
			dobError ||
			schoolError ||
			classError ||
			divisonError ||
			mealTypeError ||
			shiftError

		setValidationState({
			name: nameError,
			dob: dobError,
			school: schoolError,
			className: classError,
			divison: divisonError,
			mealType: mealTypeError,
			shift: shiftError,
			parent: '',
		})

		if (hasError) return

		setLoaderStates({ ...loaderStates, isLoading: true })
		setValidated(true)

		try {
			const res: any = await childrenApi.new(user.token, state)
			if (res?.success) {
				navigate(`/parent/view/${params.id}`)
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

	const handleCancel = () => {
		if (params?.id) {
			navigate(`/parent/view/${params.id}`)
		} else {
			navigate('/parent')
		}
		reSetStates()
	}

	const [schoolsDD, setSchoolsDD] = useState<DropdownOption[]>([])
	const [classesDD, setClassesDD] = useState<DropdownOption[]>([])
	const [divisonsDD, setDivisonsDD] = useState<DropdownOption[]>([])
	const [mealTypesDD, setMealTypesDD] = useState<DropdownOption[]>([])
	const [schoolShiftsDD, setSchoolShiftsDD] = useState<DropdownOption[]>([])

	const getSchoolsDD = async () => {
		try {
			const res: any = await DropdownList.getSchoolsDD(user.token)
			if (res?.success) {
				setSchoolsDD(res.data)
			}
		} catch (error) {
			console.log('Error fetching schools:', error)
		}
	}

	const getClassesDD = async () => {
		try {
			const res: any = await DropdownList.getClassesDD(user.token)
			if (res?.success) {
				setClassesDD(res.data)
			}
		} catch (error) {
			console.log('Error fetching schools:', error)
		}
	}

	const getDivisonsDD = async () => {
		try {
			const res: any = await DropdownList.getDivisonsDD(user.token)
			if (res?.success) {
				setDivisonsDD(res.data)
			}
		} catch (error) {
			console.log('Error fetching schools:', error)
		}
	}

	const getMealTypesDD = async () => {
		try {
			const res: any = await DropdownList.getMealTypesDD(user.token)
			if (res?.success) {
				setMealTypesDD(res.data)
			}
		} catch (error) {
			console.log('Error fetching schools:', error)
		}
	}

	const getSchoolShiftsDD = async () => {
		try {
			const res: any = await DropdownList.getSchoolShiftsDD(user.token)
			if (res?.success) {
				setSchoolShiftsDD(res.data)
			}
		} catch (error) {
			console.log('Error fetching schools:', error)
		}
	}

	useEffect(() => {
		if (params.id && user?.token) {
			setState({ ...state, parent: params.id })
		}
		if (user?.token) {
			getSchoolsDD()
			getClassesDD()
			getDivisonsDD()
			getMealTypesDD()
			getSchoolShiftsDD()
		}
	}, [params, user])

	return (
		<>
			<PageBreadcrumb title="New Child" subName="Child" />

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
										<div className="error">{validationState.name}</div>
									</div>
								</Form.Group>
								<Form.Group className="mb-3 d-flex justify-content-between">
									<Form.Label
										className="mb-0 pt-2"
										style={{ minWidth: '100px' }}>
										DOB:
									</Form.Label>
									<div
										className="d-flex flex-column"
										style={{ width: '100%' }}
										onClick={() =>
											(
												document.getElementById('dobInput') as HTMLInputElement
											)?.showPicker?.()
										}>
										<input
											type="date"
											id="dobInput"
											placeholder="Please enter birthdate"
											value={state.dob}
											name="dob"
											onChange={handleChange}
										/>
										<div className="error">{validationState.dob}</div>
									</div>
								</Form.Group>
								<Form.Group className="mb-3 d-flex justify-content-between">
									<Form.Label
										className="mb-0 pt-2"
										style={{ minWidth: '100px' }}>
										School:
									</Form.Label>
									<div className="d-flex flex-column" style={{ width: '100%' }}>
										<select
											id="validationCustom03"
											value={state.school}
											name="school"
											onChange={handleChange}
											className="form-control">
											<option value="">--Select--</option>
											{schoolsDD.map(({ value, label }) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</select>
										<div className="error">{validationState.school}</div>
									</div>
								</Form.Group>
								<Form.Group className="mb-3 d-flex justify-content-between">
									<Form.Label
										className="mb-0 pt-2"
										style={{ minWidth: '100px' }}>
										Class:
									</Form.Label>
									<div className="d-flex flex-column" style={{ width: '100%' }}>
										<select
											value={state.className}
											name="className"
											onChange={handleChange}
											className="form-control">
											<option value="">--Select--</option>
											{classesDD.map(({ value, label }) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</select>
										<div className="error">{validationState.className}</div>
									</div>
								</Form.Group>
								<Form.Group className="mb-3 d-flex justify-content-between">
									<Form.Label
										className="mb-0 pt-2"
										style={{ minWidth: '100px' }}>
										Division:
									</Form.Label>
									<div className="d-flex flex-column" style={{ width: '100%' }}>
										<select
											value={state.divison}
											name="divison"
											onChange={handleChange}
											className="form-control">
											<option value="">--Select--</option>
											{divisonsDD.map(({ value, label }) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</select>
										<div className="error">{validationState.divison}</div>
									</div>
								</Form.Group>
								<Form.Group className="mb-3 d-flex justify-content-between">
									<Form.Label
										className="mb-0 pt-2"
										style={{ minWidth: '100px' }}>
										Meal Type:
									</Form.Label>
									<div className="d-flex flex-column" style={{ width: '100%' }}>
										<select
											value={state.mealType}
											name="mealType"
											onChange={handleChange}
											className="form-control">
											<option value="">--Select--</option>
											{mealTypesDD.map(({ value, label }) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</select>
										<div className="error">{validationState.mealType}</div>
									</div>
								</Form.Group>
								<Form.Group className="mb-3 d-flex justify-content-between">
									<Form.Label
										className="mb-0 pt-2"
										style={{ minWidth: '100px' }}>
										Shift:
									</Form.Label>
									<div className="d-flex flex-column" style={{ width: '100%' }}>
										<select
											value={state.shift}
											name="shift"
											onChange={handleChange}
											className="form-control">
											<option value="">--Select--</option>
											{schoolShiftsDD.map(({ value, label }) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</select>
								
										<div className="error">{validationState.shift}</div>
									</div>
								</Form.Group>

								{errorState && (
									<div className="alert alert-danger text-center mb-3 fw-semibold">
										{errorState}
									</div>
								)}

								<div className="d-flex justify-content-center gap-2 mt-4">
									<Button variant="primary" type="submit" className="w-50">
										Submit
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

export default ChildrenForm
