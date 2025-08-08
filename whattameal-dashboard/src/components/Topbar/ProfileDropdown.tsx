import { Dropdown } from 'react-bootstrap'
import { ProfileOption } from '@/Layouts/Topbar'
import { Link } from 'react-router-dom'
import { useToggle } from '@/hooks'
import { useAuthContext, userApi } from '@/common'
import { useEffect, useState } from 'react'

type ProfileDropdownProps = {
	menuItems: Array<ProfileOption>
	username: string
}

const ProfileDropdown = ({ menuItems }: ProfileDropdownProps) => {
	const [isOpen, toggleDropdown] = useToggle()
	const { user } = useAuthContext()
	const [state, setState] = useState({
		firstName: '',
		lastName: '',
		userName: '',
		password: '',
	})

	const getLoginUser = async (token: string) => {
		try {
			const res: any = await userApi.getLoggedinUser(token)
			if (res?.success) {
				setState(res.data)
			}
		} catch (error) {
			console.error('Error fetching user data:', error)
		}
	}

	useEffect(() => {
		if (user?.token) getLoginUser(user.token)
	}, [user?.token])

	return ( 
		<Dropdown show={isOpen} onToggle={toggleDropdown}>
			<Dropdown.Toggle
				className="nav-link dropdown-toggle arrow-none nav-user"
				to="#"
				role="button"
				as={Link}
				onClick={toggleDropdown}>
				<span className="d-lg-block d-none">
					<h5 className="my-0 fw-normal">
						{state?.firstName && state?.lastName
							? `${state.firstName} ${state.lastName}`
							: 'User'}
						<i className="ri-arrow-down-s-line d-none d-sm-inline-block align-middle" />
					</h5>
				</span>
			</Dropdown.Toggle>
			<Dropdown.Menu
				align="end"
				className="dropdown-menu-animated profile-dropdown">
				<div onClick={toggleDropdown}>
					<div className=" dropdown-header noti-title"></div>
					{(menuItems || []).map((item, idx) => {
						return (
							<Link key={idx} to={item.redirectTo} className="dropdown-item">
								<i className={`${item.icon} fs-18 align-middle me-1`} />
								<span>{item.label}</span>
							</Link>
						)
					})}
				</div>
			</Dropdown.Menu>
		</Dropdown>
	)
}

export default ProfileDropdown
