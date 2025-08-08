import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'

import {
	format,
	startOfMonth,
	endOfMonth,
	addDays,
	subMonths,
	addMonths,
	isSameDay,
	parse,
} from 'date-fns'
import { getFormatedDate, WEEK_DAYS } from '@/utils/helper'
import { useNavigate } from 'react-router-dom'

import '@/assets/scss/common.css'

import React, { useEffect, useState } from 'react'
import { validateEmptyValue, validateFullName } from '@/utils/validation'
import { childrenApi, DropdownList, menuApi, useAuthContext } from '@/common'
import { useModal } from '@/hooks'
import { ChildrenEdit, ChildrenEditValidation, DropdownOption } from '@/types'
import { ICalenderData, LoadingStates } from '@/types/Menu'

const CustomCalendarCards = ({
	data,
	token,
	onUpdate,
	onDelete,
	onMonthChange,
}: {
	data: ICalenderData[]
	token: string
	onUpdate: (updatedItem: ICalenderData) => void
	onDelete: (id: string) => void
	onMonthChange: (date: Date) => void
}) => {
	const [currentMonth, setCurrentMonth] = useState(new Date())
	const [showModal, setShowModal] = useState(false)
	const [editIDX, setEditIDX] = useState<string | null>(null)
	const [formData, setFormData] = useState<ICalenderData>({
		_id: '',
		date: '',
		meal: '',
		price: '',
		isDeleted: false,
	})

	useEffect(() => {
		onMonthChange(currentMonth)
	}, [currentMonth])

	const monthStart = startOfMonth(currentMonth)
	const monthEnd = endOfMonth(monthStart)
	const startOffset = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1

	const calendarDays: Date[] = []
	for (let i = 0; i < startOffset; i++) {
		calendarDays.push(addDays(monthStart, -startOffset + i))
	}

	let currentDate = new Date(monthStart)
	while (currentDate <= monthEnd) {
		calendarDays.push(new Date(currentDate))
		currentDate = addDays(currentDate, 1)
	}

	while (calendarDays.length % 7 !== 0) {
		calendarDays.push(new Date(currentDate))
		currentDate = addDays(currentDate, 1)
	}

	const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
	const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

	const isSunday = (date: Date) => date.getDay() === 0

	const isSecondOrFourthSaturday = (date: Date) => {
		if (date.getDay() !== 6) return false // Not Saturday

		let count = 0
		const d = new Date(date.getFullYear(), date.getMonth(), 1)

		while (d.getMonth() === date.getMonth()) {
			if (d.getDay() === 6) {
				count++
				if (isSameDay(d, date) && (count === 2 || count === 4)) {
					return true
				}
			}
			d.setDate(d.getDate() + 1)
		}
		return false
	}

	const handleDayClick = (day: Date) => {
		const meal = data.find((item) =>
			isSameDay(parse(item.date, 'dd-MM-yyyy', new Date()), day)
		)
		if (meal) {
			setEditIDX(meal._id)
			setFormData(meal)
		} else {
			setEditIDX(null)
			setFormData({
				_id: '',
				date: format(day, 'dd-MM-yyyy'),
				meal: '',
				price: '',
				isDeleted: false,
			})
		}
		setShowModal(true)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]:
				name === 'date'
					? getFormatedDate(value, 'yyyy-MM-dd', 'dd-MM-yyyy')
					: name === 'price'
					? value === ''
						? ''
						: parseFloat(value)
					: value,
		}))
	}

	const handleEditCancel = () => {
		setEditIDX(null)
		setFormData({ date: '', meal: '', price: '', _id: '', isDeleted: false })
		setShowModal(false)
	}

	const handleEditSave = async () => {
		const payload = {
			date: getFormatedDate(formData.date, 'dd-MM-yyyy', 'yyyy-MM-dd'),
			meal: formData.meal,
			price: formData.price.toString(),
		}

		try {
			let res: any
			if (editIDX) {
				res = await menuApi.update(token, editIDX, payload)
			} else {
				res = await menuApi.new(token, payload)
			}
			if (res?.success) {
				onUpdate(res.data)
			}
		} catch (err) {
			console.error('Save failed:', err)
		} finally {
			handleEditCancel()
		}
	}

	const handleConfirmDelete = async (id: string) => {
		if (!id) return

		const confirmDelete = window.confirm(
			'Are you sure you want to delete this entry?'
		)
		if (!confirmDelete) return

		try {
			onDelete(id)
			handleEditCancel()
		} catch (error) {
			console.error('Delete failed:', error)
		}
	}

	return (
		<div className="calendar-container">
			<div className="calendar-header d-flex justify-content-between align-items-center mb-3">
				<Button variant="light" onClick={handlePrevMonth}>
					←
				</Button>
				<h5 className="m-0 fw-bold">{format(currentMonth, 'MMMM yyyy')}</h5>
				<Button variant="light" onClick={handleNextMonth}>
					→
				</Button>
			</div>

			<div className="calendar-weekdays">
				{WEEK_DAYS.map((day) => (
					<div className="calendar-weekday" key={day}>
						{day}
					</div>
				))}
			</div>

			<div className="calendar-grid">
				{calendarDays.map((day, index) => {
					// const isWeekend = day.getDay() === 0 || day.getDay() === 6
					const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
					const meals = data.filter((item) =>
						isSameDay(parse(item.date, 'dd-MM-yyyy', new Date()), day)
					)

					return (
						<div
							key={index}
							className={`calendar-day 
		${!isCurrentMonth ? 'not-current' : ''} 
		${isSunday(day) || isSecondOrFourthSaturday(day) ? 'red-day' : ''}
	`}
							onClick={() => handleDayClick(day)}
							style={{ cursor: 'pointer' }}>
							<div className="calendar-date">{format(day, 'dd')}</div>
							{meals.map((mealItem) => (
								<div className="calendar-meal" key={mealItem._id}>
									<strong>₹{mealItem.price}</strong>
									<br />
									{mealItem.meal}
								</div>
							))}
						</div>
					)
				})}
			</div>

			<Modal show={showModal} onHide={handleEditCancel} centered>
				<Modal.Header closeButton>
					<Modal.Title>
						{formData.date
							? format(
									parse(formData.date, 'dd-MM-yyyy', new Date()),
									'dd MMMM yyyy'
							  )
							: 'Details'}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3">
							<Form.Label>Date</Form.Label>
							<Form.Control
								type="date"
								name="date"
								value={getFormatedDate(
									formData.date,
									'dd-MM-yyyy',
									'yyyy-MM-dd'
								)}
								onChange={handleChange}
								disabled
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Meal</Form.Label>
							<Form.Control
								type="text"
								name="meal"
								value={formData.meal}
								onChange={handleChange}
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Price</Form.Label>
							<Form.Control
								type="number"
								name="price"
								value={formData.price}
								onChange={handleChange}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="danger"
						onClick={() => handleConfirmDelete(formData._id)}
						disabled={!formData._id}>
						Delete
					</Button>

					<Button variant="secondary" onClick={handleEditCancel}>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={handleEditSave}
						disabled={!formData.meal || formData.price === ''}>
						{editIDX ? 'Update' : 'Add'}
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

// edit child
interface CustomChildCardsProps {
	data: ChildrenEdit
	onChildDeleted?: (id: string) => void
}

export const CustomChildCards = (props: CustomChildCardsProps) => {
	const [editIDX, setEditIDX] = useState<string | null>(null)

	const [data, setData] = useState<ChildrenEdit>({
		_id: '',
		parent: '',
		name: '',
		dob: '',
		school: '',
		className: '',
		divison: '',
		mealType: '',
		shift: '',
		__v: 0,
		isDeleted: false,
	})

	const [selectedId, setSelectedId] = useState<string | null>(null)

	const [loaderStates, setLoaderStates] = useState<LoadingStates>({
		isLoading: false,
		isError: false,
	})

	const [validationState, setValidationState] =
		useState<ChildrenEditValidation>({
			name: '',
			dob: '',
			school: '',
			className: '',
			divison: '',
			mealType: '',
			shift: '',
			parent: '',
		})

	const reSetStates = () => {
		setValidationState({
			name: '',
			dob: '',
			school: '',
			className: '',
			divison: '',
			mealType: '',
			shift: '',
			parent: '',
		})
		setLoaderStates({ isLoading: false, isError: false })
	}

	// const [validated, setValidated] = useState(false)
	const { user } = useAuthContext()
	const navigate = useNavigate()

	const { isOpen, scroll, toggleModal, openModalWithSize } = useModal()

	const handleEditClick = (id: string | undefined) => {
		if (id && props.data._id === id) {
			setEditIDX(id)
			setData(props.data)
		}
	}

	// get all dropdown list form api
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
		if (user?.token) {
			getSchoolsDD()
			getClassesDD()
			getDivisonsDD()
			getMealTypesDD()
			getSchoolShiftsDD()
		}
	}, [data, user])

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = event.target
		let error = ''

		switch (name) {
			case 'name':
				error = validateFullName(value, 'name') || ''
				break
			case 'dob':
				error = validateEmptyValue(value, 'dob') || ''
				break
			case 'school':
				error = validateEmptyValue(value, 'school') || ''
				break
			case 'className':
				error = validateEmptyValue(value, 'class') || ''
				break
			case 'divison':
				error = validateEmptyValue(value, 'divison') || ''
				break
			case 'mealType':
				error = validateEmptyValue(value, 'mealType') || ''
				break
			case 'shift':
				error = validateEmptyValue(value, 'shift') || ''
				break
			default:
				break
		}

		setData((prev) => ({ ...prev, [name]: value }))
		setValidationState((prev) => ({ ...prev, [name]: error }))
	}

	const handleEditCancel = () => {
		setEditIDX(null)
		setData({
			_id: '',
			parent: '',
			name: '',
			dob: '',
			school: '',
			className: '',
			divison: '',
			mealType: '',
			shift: '',
			__v: 0,
			isDeleted: false,
		})
		reSetStates()
	}

	const handleEditSave = async () => {
		// console.log('child data edit ', data)

		const nameError = validateFullName(data.name, 'Name') || ''
		const dobError = validateEmptyValue(data.dob, 'dob') || ''
		const schoolError = validateEmptyValue(data.school, 'school') || ''
		const classNameError = validateEmptyValue(data.className, 'class') || ''
		const divisonError = validateEmptyValue(data.divison, 'divison') || ''
		const mealTypeError = validateEmptyValue(data.mealType, 'mealType') || ''
		const shiftError = validateEmptyValue(data.shift, 'shift') || ''

		const hasError =
			nameError ||
			dobError ||
			schoolError ||
			classNameError ||
			divisonError ||
			mealTypeError ||
			shiftError

		setValidationState({
			name: nameError,
			dob: dobError,
			school: schoolError,
			className: classNameError,
			divison: divisonError,
			mealType: mealTypeError,
			shift: shiftError,
			parent: '',
		})

		if (hasError) return

		setLoaderStates({ ...loaderStates, isLoading: true })

		try {
			const res: any = await childrenApi.update(user.token, data._id, data)

			if (res?.success) {
				navigate(`/parent/view/${data.parent}`)
				setEditIDX(null)
			}
		} catch (error: any) {
			setLoaderStates((prev) => ({ ...prev, isError: true }))
			if (error?.message === 'Network Error') {
				console.log('error 500')
				navigate('/pages/error-500')
			}
		} finally {
			setLoaderStates({ ...loaderStates, isLoading: false })
		}
	}

	if (!props.data) {
		return (
			<>
				<blockquote className="blockquote text-center mb-0">
					<p className="mb-0">No such data found to show.</p>
				</blockquote>
			</>
		)
	}

	const deleteChild = async (id: string) => {
		setLoaderStates({ ...loaderStates, isLoading: true })
		try {
			const res: any = await childrenApi.delete(user.token, id)
			if (res?.success) {
				toggleModal()
				setSelectedId(null)
				props.onChildDeleted?.(id)
			}
		} catch (error: any) {
			setLoaderStates((prev) => ({ ...prev, isError: true }))

			if (error?.message === 'Network Error') {
				console.log('error 500')
				navigate('/pages/error-500')
			}
		} finally {
			setLoaderStates({ ...loaderStates, isLoading: false })
		}
	}

	return (
		<Row className="d-flex justify-content-center align-items-center">
			<Col lg={3} md={4} sm={12} className="mb-1" style={{ width: 500 }}>
				<Card
					className={`border shadow-sm ${
						editIDX === props.data._id ? 'bg-warning text-dark' : ''
					}`}
					style={{ minHeight: '425px' }}>
					<Card.Body className="position-relative">
						<div className="position-absolute top-0 end-0 m-2 d-flex gap-1">
							{editIDX !== props.data._id ? (
								<>
									<Button
										variant="warning"
										className="d-flex align-items-center justify-content-center btn-sm p-0"
										style={{
											width: '35px',
											height: '35px',
											borderRadius: '4px',
										}}
										title="Edit Child"
										onClick={() => handleEditClick(props.data._id)}>
										<i className="ri-pencil-fill fs-4"></i>
									</Button>
									<Button
										variant="danger"
										className="d-flex align-items-center justify-content-center btn-sm p-0"
										style={{
											width: '35px',
											height: '35px',
											borderRadius: '4px',
										}}
										title="Delete Child"
										onClick={(e) => {
											e.preventDefault()
											setSelectedId(props.data._id)
											openModalWithSize('sm')
										}}>
										<i className="ri-delete-bin-7-fill fs-5"></i>
									</Button>
									<Modal
										//className="fade"
										show={isOpen}
										onHide={toggleModal}
										//dialogClassName={className}
										size={'sm'}
										scrollable={scroll}
										//centered
									>
										<Modal.Header onHide={toggleModal} closeButton>
											<h4 className="modal-title">Delete Child</h4>
										</Modal.Header>
										<Modal.Body className="text-danger">
											<h3>Are you sure you want to delete this child?</h3>
										</Modal.Body>
										<Modal.Footer>
											<Button
												variant="light"
												onClick={toggleModal}
												disabled={loaderStates.isLoading}>
												Close
											</Button>
											<Button
												variant="danger"
												onClick={() => {
													if (selectedId) deleteChild(selectedId)
												}}>
												Delete
											</Button>
										</Modal.Footer>
									</Modal>
								</>
							) : (
								<>
									<Button
										variant="success"
										className="d-flex align-items-center justify-content-center btn-sm p-0"
										style={{
											width: '35px',
											height: '35px',
											borderRadius: '4px',
										}}
										onClick={handleEditSave}>
										<i className="ri-save-3-line fs-4"></i>
									</Button>
									<Button
										variant="danger"
										className="d-flex align-items-center justify-content-center btn-sm p-0"
										style={{
											width: '35px',
											height: '35px',
											borderRadius: '4px',
										}}
										onClick={handleEditCancel}>
										<i className="ri-close-fill fs-3"></i>
									</Button>
								</>
							)}
						</div>

						<Row className="mb-4"></Row>

						<Row className="mb-2">
							<Col xs={6}>
								<strong className="text-dark">Name:</strong>
							</Col>
							<Col xs={6}>
								{editIDX === props.data._id ? (
									<>
										<input
											type="text"
											className={`form-control form-control-sm ${
												validationState.name ? 'is-invalid' : ''
											}`}
											name="name"
											value={data.name}
											onChange={handleChange}
										/>
										{validationState.name && (
											<div className="invalid-feedback">
												{validationState.name}
											</div>
										)}
									</>
								) : (
									props.data.name || '--N/A--'
								)}
							</Col>
						</Row>

						<hr className="my-1" />

						<Row className="mb-2">
							<Col xs={6}>
								<strong className="text-dark">DOB:</strong>
							</Col>
							<Col
								xs={6}
								onClick={() =>
									(
										document.getElementById('dobInput') as HTMLInputElement
									)?.showPicker?.()
								}>
								{editIDX === props.data._id ? (
									<>
										<input
											type="date"
											id="dobInput"
											className={`form-control form-control-sm ${
												validationState.dob ? 'is-invalid' : ''
											}`}
											name="dob"
											value={data.dob}
											onChange={handleChange}
										/>
										{validationState.dob && (
											<div className="invalid-feedback">
												{validationState.dob}
											</div>
										)}
									</>
								) : (
									props.data.dob || '--N/A--'
								)}
							</Col>
						</Row>

						<hr className="my-1" />

						<Row className="mb-2">
							<Col xs={6}>
								<strong className="text-dark">School:</strong>
							</Col>
							<Col xs={6}>
								{editIDX === props.data._id ? (
									<>
										<select
											className={`form-control form-control-sm ${
												validationState.school ? 'is-invalid' : ''
											}`}
											name="school"
											value={data.school}
											onChange={handleChange}>
											{schoolsDD.map(({ value, label }) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</select>
										{validationState.school && (
											<div className="invalid-feedback">
												{validationState.school}
											</div>
										)}
									</>
								) : (
									schoolsDD.find((opt) => opt.value === props.data.school)
										?.label || '--N/A--'
								)}
							</Col>
						</Row>

						<hr className="my-1" />

						<Row className="mb-2">
							<Col xs={6}>
								<strong className="text-dark">Class:</strong>
							</Col>
							<Col xs={6}>
								{editIDX === props.data._id ? (
									<>
										<select
											className={`form-control form-control-sm ${
												validationState.className ? 'is-invalid' : ''
											}`}
											name="className"
											value={data.className}
											onChange={handleChange}>
											{classesDD.map(({ value, label }) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</select>
										{validationState.className && (
											<div className="invalid-feedback">
												{validationState.className}
											</div>
										)}
									</>
								) : (
									classesDD.find((opt) => opt.value === props.data.className)
										?.label || '--N/A--'
								)}
							</Col>
						</Row>

						<hr className="my-1" />

						<Row className="mb-2">
							<Col xs={6}>
								<strong className="text-dark">Division:</strong>
							</Col>
							<Col xs={6}>
								{editIDX === props.data._id ? (
									<>
										<select
											className={`form-control form-control-sm ${
												validationState.divison ? 'is-invalid' : ''
											}`}
											name="divison"
											value={data.divison}
											onChange={handleChange}>
											{divisonsDD.map(({ value, label }) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</select>
										{validationState.divison && (
											<div className="invalid-feedback">
												{validationState.divison}
											</div>
										)}
									</>
								) : (
									divisonsDD.find((opt) => opt.value === props.data.divison)
										?.label || '--N/A--'
								)}
							</Col>
						</Row>

						<hr className="my-1" />

						<Row className="mb-2">
							<Col xs={6}>
								<strong className="text-dark">Meal Type:</strong>
							</Col>
							<Col xs={6}>
								{editIDX === props.data._id ? (
									<>
										<select
											className={`form-control form-control-sm ${
												validationState.mealType ? 'is-invalid' : ''
											}`}
											name="mealType"
											value={data.mealType}
											onChange={handleChange}>
											{mealTypesDD.map(({ value, label }) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</select>
										{validationState.mealType && (
											<div className="invalid-feedback">
												{validationState.mealType}
											</div>
										)}
									</>
								) : (
									mealTypesDD.find((opt) => opt.value === props.data.mealType)
										?.label || '--N/A--'
								)}
							</Col>
						</Row>

						<hr className="my-1" />

						<Row>
							<Col xs={6}>
								<strong className="text-dark">Shift:</strong>
							</Col>
							<Col xs={6}>
								{editIDX === props.data._id ? (
									<>
										<select
											className={`form-control form-control-sm ${
												validationState.shift ? 'is-invalid' : ''
											}`}
											name="shift"
											value={data.shift}
											onChange={handleChange}>
											{schoolShiftsDD.map(({ value, label }) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</select>
										{validationState.shift && (
											<div className="invalid-feedback">
												{validationState.shift}
											</div>
										)}
									</>
								) : (
									schoolShiftsDD.find((opt) => opt.value === props.data.shift)
										?.label || '--N/A--'
								)}
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	)
}

export default CustomCalendarCards
