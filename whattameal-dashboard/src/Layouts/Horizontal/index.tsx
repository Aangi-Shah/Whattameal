import React, { Suspense, useEffect } from 'react'
import { useToggle } from '@/hooks'
import { Container } from 'react-bootstrap'
import { ThemeSettings, useThemeContext } from '@/common/context'
import { changeHTMLAttribute } from '@/utils'
import Preloader from '@/components/Preloader'

const Topbar = React.lazy(() => import('../Topbar'))
// const Navbar = React.lazy(() => import('./NavBar'))
const RightSidebar = React.lazy(() => import('../RightSidebar'))

interface HorizontaLayoutProps {
	children?: any
}

const HorizontalLayout = ({ children }: HorizontaLayoutProps) => {
	const [horizontalDropdownOpen, toggleMenu] = useToggle()
	const { settings } = useThemeContext()

	/*
	 * layout defaults
	 */
	useEffect(() => {
		changeHTMLAttribute('data-layout', 'topnav')
		changeHTMLAttribute('data-leftbar-theme', ThemeSettings.sidebar.theme.dark)
		changeHTMLAttribute(
			'data-leftbar-compact-mode',
			ThemeSettings.layout.menuPosition.fixed
		)
		return () => {
			document.getElementsByTagName('html')[0].removeAttribute('data-layout')
		}
	}, [])

	useEffect(() => {
		changeHTMLAttribute('data-bs-theme', settings.theme)
	}, [settings.theme])

	useEffect(() => {
		changeHTMLAttribute('data-layout-mode', settings.layout.mode)
	}, [settings.layout.mode])

	useEffect(() => {
		changeHTMLAttribute('data-topbar-color', settings.topbar.theme)
	}, [settings.topbar.theme])

	useEffect(() => {
		changeHTMLAttribute('data-menu-color', settings.sidebar.theme)
	}, [settings.sidebar.theme])

	useEffect(() => {
		changeHTMLAttribute('data-layout-position', settings.layout.menuPosition)
	}, [settings.layout.menuPosition])

	return (
		<Suspense fallback={<div />}>
			<div className="wrapper">
				<Suspense fallback={<div />}>
					<Topbar toggleMenu={toggleMenu} navOpen={horizontalDropdownOpen} />
				</Suspense>

				<div className="content-page">
					<div className="content">
						<Container fluid>
							<Suspense fallback={<Preloader />}>{children}</Suspense>
						</Container>
					</div>
				</div>
			</div>

			<Suspense fallback={<div />}>
				<RightSidebar />
			</Suspense>
		</Suspense>
	)
}

export default HorizontalLayout
