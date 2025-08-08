import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Collapse } from 'react-bootstrap'

// helpers
import { findAllParent, findMenuItem } from '@/common'

// constants
import { MenuItemTypes } from '../constants/menu'

interface SubMenus {
	item: MenuItemTypes
	linkClassName?: string
	subMenuClassNames?: string
	activeMenuItems?: Array<string>
	toggleMenu?: (item: any, status: boolean) => void
	className?: string
}

const MenuItemWithChildren = ({
	item,
	linkClassName,
	subMenuClassNames,
	activeMenuItems = [],
	toggleMenu,
}: SubMenus) => {
	const [open, setOpen] = useState<boolean>(activeMenuItems.includes(item.key))

	useEffect(() => {
		setOpen(activeMenuItems.includes(item.key))
	}, [activeMenuItems, item])

	const toggleMenuItem = () => {
		const status = !open
		setOpen(status)
		if (toggleMenu) toggleMenu(item, status)
		return false
	}

	return (
		<li className={`side-nav-item ${open ? 'menuitem-active' : ''}`}>
			<Link
				to="#"
				className={`side-nav-link ${linkClassName} ${open ? 'open' : ''}`}
				aria-expanded={open}
				data-menu-key={item.key}
				onClick={toggleMenuItem}
			>
				{item.icon && <i className={item.icon} />}
				{item.badge ? (
					<span className={`badge bg-${item.badge.variant} float-end`}>
						{item.badge.text}
					</span>
				) : (
					<span className="menu-arrow" />
				)}
				<span>{item.label}</span>
			</Link>

			<Collapse in={open}>
				<div>
					<ul className={`side-nav-second-level ${subMenuClassNames}`}>
						{(item.children || []).map((child, idx) => (
							<React.Fragment key={idx}>
								{child.children ? (
									<MenuItemWithChildren
										item={child}
										linkClassName={activeMenuItems.includes(child.key) ? 'active' : ''}
										activeMenuItems={activeMenuItems}
										subMenuClassNames="sub-menu"
										toggleMenu={toggleMenu}
									/>
								) : (
									<MenuItem
										item={child}
										className={activeMenuItems.includes(child.key) ? 'menuitem-active' : ''}
										linkClassName={activeMenuItems.includes(child.key) ? 'active' : ''}
									/>
								)}
							</React.Fragment>
						))}
					</ul>
				</div>
			</Collapse>
		</li>
	)
}

const MenuItem = ({ item, className, linkClassName }: SubMenus) => {
	return (
		<li className={`side-nav-item ${className || ''}`}>
			<MenuItemLink item={item} className={linkClassName} />
		</li>
	)
}

const MenuItemLink = ({ item, className }: SubMenus) => {
	return (
		<Link
			to={item.url!}
			target={item.target}
			className={`side-nav-link-ref ${className || ''}`}
			data-menu-key={item.key}
		>
			{item.icon && <i className={item.icon} />}
			{item.badge && (
				<span className={`badge bg-${item.badge.variant} float-end`}>
					{item.badge.text}
				</span>
			)}
			<span>{item.label}</span>
		</Link>
	)
}

// Main Component
interface AppMenuProps {
	menuItems: MenuItemTypes[]
}

const AppMenu = ({ menuItems }: AppMenuProps) => {
	const location = useLocation()
	const menuRef = useRef(null)

	const [activeMenuItems, setActiveMenuItems] = useState<Array<string>>([])

	const toggleMenu = (menuItem: MenuItemTypes, show: boolean) => {
		if (show) {
			setActiveMenuItems([
				menuItem.key,
				...findAllParent(menuItems, menuItem),
			])
		}
	}

	const activeMenu = useCallback(() => {
		const menuContainer = document.getElementById('main-side-menu')
		if (!menuContainer) return

		let matchingMenuItem: HTMLElement | null = null
		const items = menuContainer.getElementsByClassName('side-nav-link-ref')
		const currentPath = location.pathname

		for (let i = 0; i < items.length; ++i) {
			const item = items[i] as HTMLAnchorElement
			if (item.pathname === window.location.origin + currentPath) {
				matchingMenuItem = item
				break
			}
		}

		if (matchingMenuItem) {
			const menuKey = matchingMenuItem.getAttribute('data-menu-key')
			const matched = findMenuItem(menuItems, menuKey!)
			if (matched) {
				setActiveMenuItems([
					matched.key,
					...findAllParent(menuItems, matched),
				])
			}

			setTimeout(() => {
				const container = document.querySelector(
					'#leftside-menu-container .simplebar-content-wrapper'
				)
				if (container && matchingMenuItem) {
					const offset = matchingMenuItem.offsetTop - 300
					if (offset > 100) {
						smoothScrollTo(container, offset, 600)
					}
				}
			}, 200)
		}
	}, [location.pathname, menuItems])

	useEffect(() => {
		activeMenu()
	}, [activeMenu])

	return (
		<ul className="side-nav" ref={menuRef} id="main-side-menu">
			{menuItems.map((item, idx) => (
				<React.Fragment key={idx}>
					{item.isTitle ? (
						<li className="side-nav-title">{item.label}</li>
					) : item.children ? (
						<MenuItemWithChildren
							item={item}
							toggleMenu={toggleMenu}
							subMenuClassNames=""
							activeMenuItems={activeMenuItems}
							linkClassName="side-nav-link"
						/>
					) : (
						<MenuItem
							item={item}
							linkClassName="side-nav-link"
							className={activeMenuItems.includes(item.key) ? 'menuitem-active' : ''}
						/>
					)}
				</React.Fragment>
			))}
		</ul>
	)
}

// Smooth Scroll Helper
function smoothScrollTo(element: Element, to: number, duration: number) {
	let start = element.scrollTop,
		change = to - start,
		currentTime = 0,
		increment = 20

	const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
		t /= d / 2
		if (t < 1) return (c / 2) * t * t + b
		t--
		return (-c / 2) * (t * (t - 2) - 1) + b
	}

	const animateScroll = () => {
		currentTime += increment
		const val = easeInOutQuad(currentTime, start, change, duration)
		element.scrollTop = val
		if (currentTime < duration) {
		}
	}
	animateScroll()
}

export default AppMenu
