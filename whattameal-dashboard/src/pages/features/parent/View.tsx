import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageBreadcrumb } from '@/components'
import { Card, Col, Row, Alert, Button } from 'react-bootstrap'
import { useAuthContext } from '@/common'
import { parentApi } from '@/common'
import { getDisplayDateFormat } from '@/utils/helper'
import { CustomSpinner } from '@/pages/ui/Spinners'
import { CustomChildCards } from '@/pages/ui/Cards'
import { ChildrenEdit } from '@/types/Children'
import { Parent } from '@/types'
import { LoadingStates } from '@/types/Menu'

const labelStyle: React.CSSProperties = {
	fontWeight: 'bold',
	width: '40%',
	color: '#333',
}

const valueStyle: React.CSSProperties = {
	width: '120%',
	color: '#555',
	paddingLeft: '10px',
}

const ViewParent = () => {
	const [state, setState] = useState<Parent | null>(null)
	const [data, setData] = useState<ChildrenEdit[]>([])
	const [loaderStates, setLoaderStates] = useState<LoadingStates>({
		isLoading: false,
		isError: false,
	})

	const params = useParams()
	const { user } = useAuthContext()
	const navigate = useNavigate()

	const fetchData = async (id: string) => {
		setLoaderStates({ ...loaderStates, isLoading: true })
		try {
			const res: any = await parentApi.getParentByID(user.token, id)
			if (res?.success) {
				const typedData = res.data as Parent
				setState(typedData)
				await fetchChildData(typedData?._id || '')
			}
		} catch (error: any) {
			setLoaderStates((prev) => ({ ...prev, isError: true }))

			if (error?.message === 'Network Error') {
				navigate('/pages/error-500')
			}
			setLoaderStates({ ...loaderStates, isError: true })
		} finally {
			setLoaderStates({ ...loaderStates, isLoading: false })
		}
	}

	const fetchChildData = async (id: string) => {
		setLoaderStates({ ...loaderStates, isLoading: true })
		try {
			const res: any = await parentApi.getChildByPerentID(user.token, id)
			if (res?.success) {
				const childData = res.data as ChildrenEdit[]
				setData(childData)
			}
		} catch (error: any) {
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
		navigate('/parent')
	}

	const handleChildDeleted = (deletedChildId: string) => {
		setData((prevData) =>
			prevData.filter((child) => child._id !== deletedChildId)
		)
	}

	useEffect(() => {
		if (params.id && user?.token) fetchData(params.id)
	}, [params, user])

	return (
		<>
			<PageBreadcrumb title="View" subName="Parent" />
			<Row className="d-flex justify-content-start align-items-center mt-0">
				<Col sm={12}>
					<Card className="p-3 shadow">
						<Card.Body>
							{loaderStates.isLoading ? (
								<div
									className="d-flex justify-content-center align-items-center"
									style={{ width: '100vw' }}>
									<CustomSpinner />
								</div>
							) : state ? (
								<>
									<h4 className="text-primary mb-4 text-center">
										Parent ID: {params.id || '--N/A--'}
									</h4>
									<Row className="view_form">
										<Col sm={4} className="input_feild">
											<span style={labelStyle}>Name :</span>
											<span style={valueStyle}>{state.name || '--N/A--'}</span>
										</Col>
										<Col sm={4} className="input_feild">
											<span style={labelStyle}>Surname :</span>
											<span style={valueStyle}>
												{state.surName || '--N/A--'}
											</span>
										</Col>
									</Row>
									<Row className="view_form">
										<Col sm={4} className="input_feild">
											<span style={labelStyle}>Email :</span>
											<span style={valueStyle}>{state.email || '--N/A--'}</span>
										</Col>
										<Col sm={4} className="input_feild">
											<span style={labelStyle}>Phone :</span>
											<span style={valueStyle}>{state.phone || '--N/A--'}</span>
										</Col>
									</Row>
									<Row className="view_form">
										<Col sm={4} className="input_feild">
											<span style={labelStyle}>State :</span>
											<span style={valueStyle}>{state.state || '--N/A--'}</span>
										</Col>

										<Col sm={4} className="input_feild">
											<span style={labelStyle}>Created At :</span>
											<span style={valueStyle}>
												{getDisplayDateFormat(state.createdAt || '--N/A--')}
											</span>
										</Col>

									</Row>

									<Row className="view_form">
										<Col sm={4} className="input_feild">
											<span style={labelStyle}>Updated At :</span>
											<span style={valueStyle}>
												{getDisplayDateFormat(state.updatedAt || '--N/A--')}
											</span>
										</Col>

										<Col sm={4} className=""></Col>
									</Row>

									<div className="d-flex justify-content-center mt-4">
										<div className="d-flex gap-4 w-50 justify-content-center">
											<Button
												variant="primary"
												type="submit"
												className="w-50"
												onClick={() =>
													navigate(`/parent/${params?.id}/children/new`)
												}>
												Add Child
											</Button>
											<Button
												variant="warning"
												type="submit"
												className="w-50"
												onClick={() => navigate(`/parent/edit/${params?.id}`)}>
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
									</div>
								</>
							) : (
								<Alert variant="warning">No parent data found to show.</Alert>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
			{state && (
				<>
					<hr className="my-1" />
					<h4 className="mt-2">Children</h4>
					<Row className="mt-2 g-2 justify-content-start">
						{data.length === 0 ? (
							<Col>
								<blockquote className="blockquote text-center mb-0">
									<p className="mb-0">No such data found to show.</p>
								</blockquote>
							</Col>
						) : (
							data.map((child, idx) => (
								<Col xs={12} sm={4} md={4} key={idx}>
									<CustomChildCards
										data={child}
										onChildDeleted={handleChildDeleted}
									/>
								</Col>
							))
						)}
					</Row>
				</>
			)}
		</>
	)
}

export default ViewParent
