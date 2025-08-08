import { useEffect, useState } from 'react'
import { Button, Card, Col, Modal, Row } from 'react-bootstrap'
import { parentApi } from '@/common/api'
import '@/assets/scss/common.css'

import { Column } from 'react-table'

// components
import { PageSize, Table } from '@/components' 
import { PageBreadcrumb } from '@/components'
import { CustomSpinner } from '@/pages/ui/Spinners'
import { useModal } from '@/hooks'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/common'
import { getDisplayDateFormat } from '@/utils/helper'
import { Parent } from '@/types'
import { LoadingStates } from '@/types/Menu'

const ParantTable = () => {
	const [data, setData] = useState<Parent[]>([])
	const [loaderStates, setLoaderStates] = useState<LoadingStates>({
		isLoading: false,
		isError: false,
	})
	const [selectedId, setSelectedId] = useState<string | null>(null)

	const { user } = useAuthContext()
	const navigate = useNavigate()

	const { isOpen, scroll, toggleModal, openModalWithSize } = useModal()

	const columns: ReadonlyArray<Column> = [
		{
			Header: 'Sr No.',
			Cell: (rows: any) => <>{rows.row.index + 1}</>,
		},
		{
			Header: 'Name',
			accessor: 'name',
			defaultCanSort: true,
			Cell: ({ value }: any) => value || '--N/A--',
		},
		{
			Header: 'Surame',
			accessor: 'surName',
			defaultCanSort: true,
			Cell: ({ value }: any) => value || '--N/A--',
		},
		{
			Header: 'Phone Number',
			accessor: 'phone',
			defaultCanSort: false,
			Cell: ({ value }: any) => value || '--N/A--',
		},
		{
			Header: 'Email',
			accessor: 'email',
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
								to={`/parent/view/${id}`}
								className="custom_app_icon btn btn-sm btn-info me-1  d-flex align-items-center justify-content-center"
								title="View parent details">
								<i className="mdi mdi-eye fs-5"></i>
							</Link>
							<Link
								to={`/parent/edit/${id}`}
								className="custom_app_icon btn btn-sm btn-warning me-1 d-flex align-items-center justify-content-center"
								title="Edit parent details"
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
								title="Delete parent details"
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
							scrollable={scroll}
						>
							<Modal.Header onHide={toggleModal} closeButton>
								<h4 className="modal-title">Delete Parent</h4>
							</Modal.Header>
							<Modal.Body className="text-danger">
								<h3>Are you sure you want to delete this parent?</h3>
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
										if (selectedId) deleteParent(selectedId)
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
			const res: any = await parentApi.getAllPerents(user.token)
			if (res?.success) {
				const typedData = res.data as Parent[]
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

	const deleteParent = async (id: string) => {
		setLoaderStates({ ...loaderStates, isLoading: true })
		try {
			const res: any = await parentApi.delete(user.token, id)
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
			<PageBreadcrumb title="" subName="Parents" />
			<Row className="mt-2">
				<Col sm={10}></Col>
				<Col sm={2}>
					<Button
						variant={'primary'}
						className="w-100"
						onClick={() => {
							navigate('/parent/new')
						}}>
						Add Parent
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
								<Table<Parent>
									columns={columns}
									data={data}
									pageSize={10}
									sizePerPageList={sizePerPageList}
									isSortable={true}
									pagination={true}
									isSearchable
									tableClass="table-bold"
								/>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default ParantTable
