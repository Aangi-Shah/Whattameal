import { useEffect, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { menuApi, useAuthContext } from '@/common'
import { PageBreadcrumb } from '@/components'
import { FileType, FileUploader } from '@/components/FileUploader'
import { useModal } from '@/hooks'
import { CustomSpinner } from '@/pages/ui/Spinners'
import { getFormatedDate, getFormatedMonth } from '@/utils/helper'
import CustomCalendarCards from '@/pages/ui/Cards'
import { ICalenderData, LoadingStates } from '@/types/Menu'

const Menu = () => {
	const [data, setData] = useState<ICalenderData[]>([])
	const [files, setFiles] = useState<FileType[]>([])
	const [loaderStates, setLoaderStates] = useState<LoadingStates>({
		isLoading: false,
		isError: false,
	})

	const { user } = useAuthContext()
	const navigate = useNavigate()
	const { isOpen, size, className, scroll, toggleModal, openModalWithSize } =
		useModal()

	const handleFile = (files: FileType[]) => {
		if (files[0].name.split('.').pop() === 'xlsx') {
			setFiles(files)
		} else {
			alert('Please upload a valid file')
			toggleModal()
		}
	}

	const handleFileUpload = async () => {
		setLoaderStates({ ...loaderStates, isLoading: true })

		try {
			if (files.length === 0) {
				alert('Please upload a valid file')
				setLoaderStates({ ...loaderStates, isLoading: false })
				return
			}

			const formData = new FormData()
			formData.append('file', files[0])

			const res: any = await menuApi.uploadMenu(user.token, formData)
			if (res?.success) {
				const typedData = res.data as ICalenderData[]
				setData(typedData)
			}
		} catch (error: any) {
			if (error?.message === 'Network Error') {
				navigate('/pages/error-500')
			}
			setLoaderStates({ ...loaderStates, isError: true })
		} finally {
			setLoaderStates({ ...loaderStates, isLoading: false })
			toggleModal()
		}
	}

	const fetchMenuByMonth = async (date: Date) => {
		const month = getFormatedMonth(date, 'MM-yyyy')
		try {
			setLoaderStates({ ...loaderStates, isLoading: true })
			const res: any = await menuApi.getMenuData(user.token, month)
			console.log(res.data)
			if (res?.success) {
				const typedData = res.data as ICalenderData[]
				setData(typedData)
			}
		} catch (error: any) {
			console.error(error)
			if (error?.message === 'Network Error') {
				navigate('/pages/error-500')
			}
		} finally {
			setLoaderStates({ ...loaderStates, isLoading: false })
		}
	}

	const handleItemUpdate = async (updatedItem: ICalenderData) => {
		const formattedItem = {
			...updatedItem,
			date: getFormatedDate(updatedItem.date, 'yyyy-MM-dd', 'dd-MM-yyyy'),
		}

		setData((prev) =>
			prev.map((item) => (item._id === updatedItem._id ? formattedItem : item))
		)
		await fetchMenuByMonth(new Date(updatedItem.date))
	}

	const handleItemDelete = async (id: string) => {
		try {
			const deletedItem = data.find((item) => item._id === id)
			const res: any = await menuApi.delete(user.token, id)

			console.log(res?.success)

			if (res?.success && deletedItem) {
				const itemDate = new Date(
					getFormatedDate(deletedItem.date, 'dd-MM-yyyy', 'yyyy-MM-dd')
				)
				await fetchMenuByMonth(itemDate)
			}
		} catch (error: any) {
			const errorMessage =
				error?.message || 'Something went wrong. Please try again.'

			console.log(errorMessage)
			if (error?.message === 'Network Error') {
				navigate('/pages/error-500')
			}
		}
	}

	useEffect(() => {
		if (data.length === 0) {
			fetchMenuByMonth(new Date())
		}
	}, [])

	return (
		<>
			<PageBreadcrumb title="" subName="Menus" />

			<Row className="mt-2">
				<Col>
					<div className="d-flex justify-content-end w-100 gap-2">
						<Button
							variant="primary"
							className="btn fs-s fw-bold"
							onClick={() => openModalWithSize('lg')}>
							{data.length === 0 ? 'Upload Menu' : 'Upload New Menu'}
						</Button>
					</div>
				</Col>
			</Row>

			<Row className="mt-3">
				<CustomCalendarCards
					data={data}
					token={user.token}
					onUpdate={handleItemUpdate}
					onDelete={handleItemDelete}
					onMonthChange={fetchMenuByMonth}
				/>
			</Row>

			<Modal
				className="fade"
				show={isOpen}
				onHide={toggleModal}
				dialogClassName={className}
				size={size}
				scrollable={scroll}>
				<Modal.Header onHide={toggleModal} closeButton>
					<h4 className="modal-title">Upload Menu File (.xlsx)</h4>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col sm={12}>
							{loaderStates.isLoading ? (
								<CustomSpinner />
							) : (
								<FileUploader
									icon="ri-upload-cloud-2-line"
									text="Drop files here or click to upload."
									onFileUpload={handleFile}
								/>
							)}
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="light"
						onClick={toggleModal}
						disabled={loaderStates.isLoading}>
						Close
					</Button>
					<Button
						onClick={handleFileUpload}
						disabled={loaderStates.isLoading || files.length === 0}>
						Upload
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default Menu
