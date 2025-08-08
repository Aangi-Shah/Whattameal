import React from 'react'
import { Route, RouteProps } from 'react-router-dom'

// components
import PrivateRoute from './PrivateRoute'
import NextBooking from '@/pages/features/booking/Nextbooking'
import Multybooking from '../pages/features/booking/Multybooking'

// auth
const Login = React.lazy(() => import('../pages/auth/Login'))
const Logout = React.lazy(() => import('../pages/auth/Logout')) 	

// // dashboard
const Dashboard = React.lazy(() => import('../pages/Dashboard'))

// // error
const Error404 = React.lazy(() => import('../pages/error/Error404'))
const Error500 = React.lazy(() => import('../pages/error/Error500'))

// // // Features Routes

// User
const User = React.lazy(() => import('../pages/features/user'))
const UserForm = React.lazy(() => import('../pages/features/user/UserForm'))
const ViewUser = React.lazy(() => import('../pages/features/user/View'))

// Parent
const Parent = React.lazy(() => import('../pages/features/parent'))
const ParentForm = React.lazy(
	() => import('../pages/features/parent/ParentForm')
)
const ViewParent = React.lazy(() => import('../pages/features/parent/View'))
const ChildForm = React.lazy(
	() => import('../pages/features/parent/children/ChildForm')
)

// Menu
const Menu = React.lazy(() => import('../pages/features/menu'))

export interface RoutesProps {
	path: RouteProps['path']
	name?: string
	element?: RouteProps['element']
	route?: any
	exact?: boolean
	icon?: string
	header?: string
	roles?: string[]
	children?: RoutesProps[]
}

// dashboards
const dashboardRoutes: RoutesProps = {
	path: '/admin',
	name: 'Dashboards',
	icon: 'home',
	header: 'Navigation',
	children: [
		{
			path: '/',
			name: 'Root',
			element: <Dashboard />,
			route: PrivateRoute,
		},
		{
			path: '/dashboard',
			name: 'Dashboard',
			element: <Dashboard />,
			route: PrivateRoute,
		},
	],
}

const userRoutes: RoutesProps = {
	path: '/user',
	name: 'User',
	icon: 'home',
	element: <User />,
	route: PrivateRoute,
}
const customUserRoutes = {
	path: '/user',
	name: 'User',
	icon: 'home',
	header: 'Custom',
	children: [
		{
			path: '/user/new',
			name: 'NewUser',
			element: <UserForm />,
			route: PrivateRoute,
		},
		{
			path: '/user/view/:id',
			name: 'ViewUser',
			element: <ViewUser />,
			route: PrivateRoute,
		},
		{
			path: '/user/edit/:id',
			name: 'ViewUser',
			element: <UserForm />,
			route: PrivateRoute,
		},
	],
}

const parentRoutes: RoutesProps = {
	path: '/parent',
	name: 'Parent',
	icon: 'home',
	element: <Parent />,
	route: PrivateRoute,
}

const customViewRoutes = {
	path: '/parent',
	name: 'Parent',
	icon: 'home',
	header: 'Custom',
	children: [
		{
			path: '/parent/new',
			name: 'NewParent',
			element: <ParentForm />,
			route: PrivateRoute,
		},
		{
			path: '/parent/view/:id',
			name: 'ViewParent',
			element: <ViewParent />,
			route: PrivateRoute,
		},
		{
			path: '/parent/edit/:id',
			name: 'ViewParent',
			element: <ParentForm />,
			route: PrivateRoute,
		},
		{
			path: '/parent/:id/children/new',
			name: 'NewChild',
			element: <ChildForm />,
			route: PrivateRoute,
		},
	],
}

const menuRoutes: RoutesProps = {
	path: '/menu',
	name: 'Menus',
	icon: 'home',
	element: <Menu />,
	route: PrivateRoute,
}

// auth
const authRoutes: RoutesProps[] = [
	{
		path: '/auth/login',
		name: 'Login',
		element: <Login />,
		route: Route,
	},

	{
		path: '/:id/book_customize_meal',
		name: 'Summery',
		icon: 'home',
		element: <Multybooking />,
		route: PrivateRoute,
	},

	{
		path: '/:id/book_next_meal',
		name: 'Summery',
		icon: 'home',
		element: <NextBooking />,
		route: PrivateRoute,
	},

	{
		path: '/auth/logout',
		name: 'Logout',
		element: <Logout />,
		route: Route,
	},

]

// public routes
const otherPublicRoutes = [
	{
		path: '*',
		name: 'Error - 404',
		element: <Error404 />,
		route: Route,
	},
	{
		path: 'pages/error-404',
		name: 'Error - 404',
		element: <Error404 />,
		route: Route,
	},
	{
		path: 'pages/error-500',
		name: 'Error - 500',
		element: <Error500 />,
		route: Route,
	},
	
]

// flatten the list of all nested routes
const flattenRoutes = (routes: RoutesProps[]) => {
	let flatRoutes: RoutesProps[] = []

	routes = routes || []
	routes.forEach((item: RoutesProps) => {
		flatRoutes.push(item)
		if (typeof item.children !== 'undefined') {
			flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)]
		}
	})
	return flatRoutes
}

// All routes
const authProtectedRoutes = [
	dashboardRoutes,
	userRoutes,
	customUserRoutes,
	parentRoutes,
	customViewRoutes,
	menuRoutes,
]
const publicRoutes = [...authRoutes, ...otherPublicRoutes]

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes])
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes])
export {
	publicRoutes,
	authProtectedRoutes,
	authProtectedFlattenRoutes,
	publicProtectedFlattenRoutes,
}
