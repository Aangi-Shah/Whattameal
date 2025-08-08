import { userApi } from '@/common/api'
import { useEffect, useState } from 'react'
import { Button, Card, Col, Modal, Row } from 'react-bootstrap'
import { Column } from 'react-table'
import '@/assets/scss/common.css'

// components
import { PageBreadcrumb, PageSize, Table } from '@/components'
import { CustomSpinner } from '@/pages/ui/Spinners'
import { useModal } from '@/hooks'
import { User } from '@/types'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/common'
import { getDisplayDateFormat } from '@/utils/helper'
import { LoadingStates } from '@/types/Menu'

const UserTable = () => {
	const [data, setData] = useState<User[]>([]) 
	const [loaderStates, setLoaderStates] = useState<LoadingStates>({
		isLoading: false,
		isError: false,
	})
	const [selectedId, setSelectedId] = useState<string | null>(null)

	const { user } = useAuthContext()
	const navigate = useNavigate()

	const { isOpen, toggleModal, openModalWithSize } = useModal()

	const columns: ReadonlyArray<Column> = [
		{
			Header: 'Sr No.',
			Cell: ({ row }: { row: { index: number } }) => <>{row.index + 1}</>,
		},
		{
			Header: 'First Name',
			accessor: 'firstName',
			defaultCanSort: true,
			Cell: ({ value }: any) => value || '--N/A--',
		},
		{
			Header: 'Last Name',
			accessor: 'lastName',
			defaultCanSort: true,
			Cell: ({ value }: any) => value || '--N/A--',
		},
		{
			Header: '@User Name',
			accessor: 'userName',
			defaultCanSort: true,
			Cell: ({ value }: any) => value || '--N/A--',
		},
		{
			Header: 'Created At',
			accessor: 'createdAt',
			defaultCanSort: false,
			Cell: (row: any) =>
				row.value ? getDisplayDateFormat(row.value) : '--N/A--',
		},
		{
			Header: 'Updated At',
			accessor: 'updatedAt',
			defaultCanSort: false,
			Cell: (row: any) =>
				row.value ? getDisplayDateFormat(row.value) : '--N/A--',
		},
		{
			Header: 'Actions',
			accessor: 'actions',
			defaultCanSort: false,
			Cell: ({ row }: any) => {
				const id = row.original._id
				return (
					<>
						<div className="d-flex gap-0">
							<Link
								to={`/user/view/${id}`}
								className="custom_app_icon btn btn-sm btn-info me-1  d-flex align-items-center justify-content-center"
								title="View user details">
								<i className="mdi mdi-eye fs-5"></i>
							</Link>
							<Link
								to={`/user/edit/${id}`}
								className="custom_app_icon btn btn-sm btn-warning me-1 d-flex align-items-center justify-content-center"
								title="Edit user details"
								style={{
									width: '30px',
									height: '30px',
									borderRadius: '4px',
									fontSize: '1.00rem',
									lineHeight: 1,
								}}>
								<i className="ri-pencil-fill"></i>
							</Link>
							<Link
								to="#"
								onClick={(e) => {
									e.preventDefault()
									setSelectedId(id)
									openModalWithSize('sm')
								}}
								className="custom_app_icon btn btn-sm btn-danger d-flex align-items-center justify-content-center"
								title="Delete user details"
								style={{
									width: '30px',
									height: '30px',
									borderRadius: '4px',
									fontSize: '1.00rem',
									lineHeight: 1,
								}}>
								<i className="ri-delete-bin-7-fill fs-5"></i>
							</Link>
						</div>
						<Modal
							show={isOpen}
							onHide={toggleModal}
							size={'sm'}
							className="bg-none">
							<Modal.Header onHide={toggleModal} closeButton>
								<h4 className="modal-title">Delete User</h4>
							</Modal.Header>
							<Modal.Body className="text-danger">
								<h3>Are you sure you want to delete this user? </h3>
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
										if (selectedId) deleteUser(selectedId)
									}}>
									Delete
								</Button>
							</Modal.Footer>
						</Modal>
					</>
				)
			},
		},
	]

	const sizePerPageList: PageSize[] = [
		{ text: '10', value: 10 },
		{ text: '20', value: 20 },
		{ text: '50', value: 50 },
		{ text: 'All', value: data.length },
	]

	const fetchData = async () => {
		setLoaderStates({ ...loaderStates, isLoading: true })
		try { 
			const res: any = await userApi.get(user.token)
			if (res?.success) {
				const typedData = res.data as User[]
				setData(typedData)
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

	const deleteUser = async (id: string) => {
		setLoaderStates({ ...loaderStates, isLoading: true })
		try {
			const res: any = await userApi.delete(user.token, id)
			if (res?.success) {
				toggleModal()
				setSelectedId(null)
				fetchData()
			}
		} catch (error : any) {
			
			if (error?.message === 'Network Error') {
				console.log(error?.message)
				navigate('/pages/error-500')
			}
			setLoaderStates({ ...loaderStates, isError: true })
		} finally {
			setLoaderStates({ ...loaderStates, isLoading: false })
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<>
			<PageBreadcrumb title="" subName="Users" />
			<Row className="mt-2 d-flex justify-content-end">
				<Col sm={2}>
					<Button
						variant={'primary'}
						className="w-100"
						onClick={() => {
							navigate('/user/new')
						}}>
						Add User
					</Button>
				</Col>
			</Row>
			<Row className="mt-2">
				<Col>
					<Card>
						<Card.Body>
							{loaderStates.isLoading ? (
								<CustomSpinner />
							) : (
								<Table<User>
									columns={columns}
									data={data}
									pageSize={10}
									sizePerPageList={sizePerPageList}
									isSortable={true}
									pagination={true}
								/>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default UserTable
