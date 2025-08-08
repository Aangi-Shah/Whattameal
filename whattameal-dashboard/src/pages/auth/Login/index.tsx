import { Button } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AuthLayout from '../AuthLayout'
import useLogin from './useLogin'

// components
import { VerticalForm, FormInput, PageBreadcrumb } from '@/components'
import { useAuthContext } from '@/common'
import { useEffect } from 'react'

interface UserData {
	userName: string
	password: string
}

const schemaResolver = yupResolver(
	yup.object().shape({
		userName: yup.string().required('Please enter Username'),
		password: yup.string().required('Please enter Password'),
	})
)

const Login = () => {
	const { loading, login, redirectUrl, isAuthenticated, error, clearError } = useLogin()

	console.log(clearError)

	const { removeSession } = useAuthContext()
	
		useEffect(() => {
			removeSession()
		}, [removeSession])

	return (
		<>
			<PageBreadcrumb title="Log In" />

			{isAuthenticated && <Navigate to={redirectUrl} replace />}

			<AuthLayout
				authTitle="Sign In"
				helpText="Enter your User Name and password to access account."
				hasThirdPartyLogin>
				<VerticalForm<UserData>
					onSubmit={login}
					resolver={schemaResolver}
					defaultValues={{ userName: '', password: '' }}
					onInputChange={(data) => {
						if (error && (data.userName || data.password)) {
							clearError()
						}
					}}
					>
					<FormInput
						label="User Name"
						type="text"
						name="userName"
						placeholder="Enter your UserName"
						containerClass="mb-3"
						required
					/>
					<FormInput
						label="Password"
						name="password"
						type="password"
						required
						id="password"
						placeholder="Enter your password"
						containerClass="mb-3"></FormInput>
					{error && <p className="alert alert-danger">{error}</p>}
					<div className="mb-0 text-start">
						<Button
							variant="soft-primary"
							className="w-100"
							type="submit"
							disabled={loading}>
							<i className="ri-login-circle-fill me-1" />
							<span className="fw-bold">Log In</span>
						</Button>
					</div>
				</VerticalForm>
			</AuthLayout>
		</>
	)
}

export default Login
