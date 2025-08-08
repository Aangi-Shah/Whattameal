import { Image } from 'react-bootstrap'
import { ThemeSettings, useThemeContext } from '@/common'
import { Link } from 'react-router-dom'

// assets
import logo from '@/assets/images/logo.png'
import logoSm from '@/assets/images/logo-sm.png'
import logoDark from '@/assets/images/logo-dark.png'
// components
import {
	// NotificationDropdown,
	ProfileDropdown,
} from '@/components'
import { useViewport } from '@/hooks'
import useThemeCustomizer from '@/components/ThemeCustomizer/useThemeCustomizer'
/**
 * for subtraction minutes
 */
// function subtractHours(date: Date, minutes: number) {
// 	date.setMinutes(date.getMinutes() - minutes)
// 	return date
// }
export interface MessageItem {
	id: number
	name: string
	subText: string
	avatar: string
	createdAt: Date
}

export interface NotificationItem {
	id: number
	title: string
	icon: string
	variant: string
	createdAt: Date
}

export interface ProfileOption {
	label: string
	icon: string
	redirectTo: string
}
/**
 * notification items
 */
// const Notifications: NotificationItem[] = [
// 	{
// 		id: 1,
// 		title: 'Caleb Flakelar commented on Admin',
// 		icon: 'mdi mdi-comment-account-outline',
// 		variant: 'primary',
// 		createdAt: subtractHours(new Date(), 1),
// 	},
// 	{
// 		id: 2,
// 		title: 'New user registered.',
// 		icon: 'mdi mdi-account-plus',
// 		variant: 'warning',
// 		createdAt: subtractHours(new Date(), 300),
// 	},
// 	{
// 		id: 3,
// 		title: 'Carlos Crouch liked',
// 		icon: 'mdi mdi-heart',
// 		variant: 'danger',
// 		createdAt: subtractHours(new Date(), 4320),
// 	},
// 	{
// 		id: 4,
// 		title: 'Caleb Flakelar commented on Admi',
// 		icon: 'mdi mdi-comment-account-outline',
// 		variant: 'pink',
// 		createdAt: subtractHours(new Date(), 5760),
// 	},
// 	{
// 		id: 5,
// 		title: 'New user registered.',
// 		icon: 'mdi mdi-account-plus',
// 		variant: 'purple',
// 		createdAt: subtractHours(new Date(), 10960),
// 	},
// 	{
// 		id: 6,
// 		title: 'Carlos Crouch liked Admin',
// 		icon: 'mdi mdi-heart',
// 		variant: 'success',
// 		createdAt: subtractHours(new Date(), 10960),
// 	},
// ]
const profileMenus: ProfileOption[] = [
	{
		label: 'Logout',
		icon: 'ri-logout-box-line',
		redirectTo: '/auth/login',
	},
]

type TopbarProps = {
	topbarDark?: boolean
	toggleMenu?: () => void
	navOpen?: boolean
}
const Topbar = ({ toggleMenu, navOpen }: TopbarProps) => {
	const { sideBarType } = useThemeCustomizer()
	const { width } = useViewport()

	/**
	 * Toggle the leftmenu when having mobile screen
	 */

	const handleLeftMenuCallBack = () => {
		if (width < 768) {
			if (sideBarType === 'full') {
				showLeftSideBarBackdrop()
				document.getElementsByTagName('html')[0].classList.add('sidebar-enable')
			} else {
				updateSidebar({ size: ThemeSettings.sidebar.size.full })
			}
		} else if (sideBarType === 'condensed') {
			updateSidebar({ size: ThemeSettings.sidebar.size.default })
		} else if (sideBarType === 'full') {
			showLeftSideBarBackdrop()
			document.getElementsByTagName('html')[0].classList.add('sidebar-enable')
		} else if (sideBarType === 'fullscreen') {
			updateSidebar({ size: ThemeSettings.sidebar.size.default })
			document.getElementsByTagName('html')[0].classList.add('sidebar-enable')
		} else {
			updateSidebar({ size: ThemeSettings.sidebar.size.condensed })
		}
	}

	/**
	 * creates backdrop for leftsidebar
	 */
	function showLeftSideBarBackdrop() {
		const backdrop = document.createElement('div')
		backdrop.id = 'custom-backdrop'
		backdrop.className = 'offcanvas-backdrop fade show'
		document.body.appendChild(backdrop)

		backdrop.addEventListener('click', function () {
			document
				.getElementsByTagName('html')[0]
				.classList.remove('sidebar-enable')
			hideLeftSideBarBackdrop()
		})
	}

	function hideLeftSideBarBackdrop() {
		const backdrop = document.getElementById('custom-backdrop')
		if (backdrop) {
			document.body.removeChild(backdrop)
			document.body.style.removeProperty('overflow')
		}
	}
	const { updateSidebar } = useThemeContext()

	/**
	 * Toggle Dark Mode
	 */
	
	return (
		<>
			<div className="navbar-custom">
				<div className="topbar container-fluid">
					<div className="d-flex align-items-center gap-1">
						<div className="logo-topbar">
							<Link to="/" className="logo-light">
								<span className="logo-lg">
									<Image src={logo} alt="logo" />
								</span>
								<span className="logo-sm">
									<Image src={logoSm} alt="small logo" />
								</span>
							</Link>
							<Link to="/" className="logo-dark">
								<span className="logo-lg">
									<img src={logoDark} alt="dark logo" />
								</span>
								<span className="logo-sm">
									<img src={logoSm} alt="small logo" />
								</span>
							</Link>
						</div>
						<button
							className="button-toggle-menu"
							onClick={handleLeftMenuCallBack}
						>
							<i className="ri-menu-line" />
						</button>
						<button
							className={`navbar-toggle ${navOpen ? 'open' : ''}`}
							data-bs-toggle="collapse"
							data-bs-target="#topnav-menu-content"
							onClick={toggleMenu}
						>
							<div className="lines">
								<span />
								<span />
								<span />
							</div>
						</button>
					</div>
					<ul className="topbar-menu d-flex align-items-center gap-3">
{/* 				
						<li className="dropdown notification-list">
							<NotificationDropdown notifications={Notifications} />
						</li>
				 */}
						<li className="dropdown">
							<ProfileDropdown
								menuItems={profileMenus}
								username="Thomson"
							/>
						</li>
					</ul>
				</div>
			</div>
		</>
	)
}

export default Topbar
