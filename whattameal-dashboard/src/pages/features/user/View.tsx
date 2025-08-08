import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageBreadcrumb } from '@/components'
import { Card, Col, Row, Alert, Button } from 'react-bootstrap'
import { User } from '@/types'
import { useAuthContext, userApi } from '@/common'
import { getDisplayDateFormat } from '@/utils/helper'
import { CustomSpinner } from '@/pages/ui/Spinners'
import { LoadingStates } from '@/types/Menu'

const labelStyle: React.CSSProperties = {
	fontWeight: 'bold',
	width: '40%',
	color: '#333',
}

const valueStyle: React.CSSProperties = {
	width: '60%',
	color: '#555',
}

const rowStyle: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	padding: '10px 0',
	borderBottom: '1px solid #e0e0e0',
}

const ViewUser = () => {
	const [state, setState] = useState<User | null>(null)
	const [loaderStates, setLoaderStates] = useState<
		LoadingStates & { errorMessage?: string }
	>({
		isLoading: false,
		isError: false,
		errorMessage: '',
	})

	const params = useParams()
	const { user } = useAuthContext()
	const navigate = useNavigate()

	const fetchData = async (id: string) => {
		setLoaderStates({ ...loaderStates, isLoading: true })
		try {
			const res: any = await userApi.getUserByID(user.token, id)
			if (res?.success) {
				const typedData = res.data as User
				setState(typedData)
			}
		} catch (error: any) {
			if (error?.message === 'Network Error') {
				console.log(error?.message)
				navigate('/pages/error-500')
			}
			setLoaderStates({ ...loaderStates, isError: true })
		} finally {
			setLoaderStates({ ...loaderStates, isLoading: false })
		}
	}

	const handleCancel = () => {
		navigate('/user')
	}

	useEffect(() => {
		if (params?.id && user?.token) fetchData(params.id)
	}, [params, user])

	return (
		<>
			<PageBreadcrumb title="View" subName="User" />
			<Row className="v-100 d-flex justify-content-center align-items-center mt-1">
				<Col xs={12} sm={10} md={6} lg={5} xl={5}>
					<Card className="p-3 shadow">
						<Card.Body>
							{loaderStates.isLoading ? (
								<CustomSpinner />
							) : state ? (
								<>
									<h4 className="text-primary mb-3 text-center">
										User Details: {params.id || '--N/A--'}
									</h4>
									<div style={rowStyle}>
										<span style={labelStyle}>User ID:</span>
										<span style={valueStyle}>{params?.id || '--N/A--'}</span>
									</div>
									<div style={rowStyle}>
										<span style={labelStyle}>First Name:</span>
										<span style={valueStyle}>
											{state.firstName || '--N/A--'}
										</span>
									</div>
									<div style={rowStyle}>
										<span style={labelStyle}>Last Name:</span>
										<span style={valueStyle}>
											{state.lastName || '--N/A--'}
										</span>
									</div>
									<div style={rowStyle}>
										<span style={labelStyle}>Username:</span>
										<span style={valueStyle}>
											{state.userName || '--N/A--'}
										</span>
									</div>
									<div style={rowStyle}>
										<span style={labelStyle}>Created At:</span>
										<span style={valueStyle}>
											{getDisplayDateFormat(state.createdAt || '--N/A--')}
										</span>
									</div>
									<div style={rowStyle}>
										<span style={labelStyle}>Updated At:</span>
										<span style={valueStyle}>
											{getDisplayDateFormat(state.updatedAt || 'N/A')}
										</span>
									</div>
									<div className="d-flex justify-content-center gap-2 mt-4">
										<Button
											variant="warning"
											type="submit"
											className="w-50"
											onClick={() => {
												navigate(`/user/edit/${params?.id}`)
											}}>
											Edit
										</Button>
										<Button
											variant="danger"
											type="button"
											className="w-50"
											onClick={handleCancel}>
											Back
										</Button>
									</div>
								</>
							) : (
								<Alert variant="danger">No user data found to show.</Alert>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default ViewUser
