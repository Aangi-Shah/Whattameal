export interface MenuItemTypes {
	key: string
	label: string
	isTitle?: boolean
	icon?: string
	url?: string
	badge?: {
		variant: string
		text: string
	}
	parentKey?: string
	target?: string
	children?: MenuItemTypes[]
}

const MENU_ITEMS: MenuItemTypes[] = [
	{
		key: 'dashboard',
		label: 'Dashboards',
		isTitle: false,
		url: '/',
		icon: 'ri-dashboard-2-fill',
	},
	{
		key: 'user',
		label: 'Users',
		isTitle: false,
		url: '/user',
		icon: 'ri-user-fill',
	},
	{
		key: 'parent',
		label: 'Parents',
		isTitle: false,
		url: '/parent',
		icon: 'ri-user-heart-fill',
	},
	{
		key: 'menu',
		label: 'Menus',
		isTitle: false,
		url: '/menu',
		icon: 'ri-file-list-line',
	},
]


export { MENU_ITEMS}
