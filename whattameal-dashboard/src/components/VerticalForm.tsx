import React, { useEffect } from 'react'
import { FieldValues, Resolver, useForm } from 'react-hook-form'

interface VerticalFormProps<TFormValues extends FieldValues> {
	defaultValues?: any
	resolver?: Resolver<TFormValues>
	children?: any
	onSubmit: any
	formClass?: string
	onInputChange?: (data: TFormValues) => void
}

// const VerticalForm = <
// 	TFormValues extends Record<string, any> = Record<string, any>,
// >({
// 	defaultValues,
// 	resolver,
// 	children,
// 	onSubmit,
// 	formClass,
// }: VerticalFormProps<TFormValues>) => {
// 	/*
// 	 * form methods
// 	 */
// 	const methods = useForm<TFormValues>({ defaultValues, resolver })

// 	const {
// 		handleSubmit,
// 		register,
// 		control,
// 		formState: { errors },
// 	} = methods

// 	return (
// 		<form onSubmit={handleSubmit(onSubmit)} className={formClass} noValidate>
// 			{Array.isArray(children)
// 				? children.map((child) => {
// 						return child.props && child.props.name
// 							? React.createElement(child.type, {
// 									...{
// 										...child.props,
// 										register,
// 										key: child.props.name,
// 										errors,
// 										control,
// 									},
// 							  })
// 							: child
// 				  })
// 				: children}
// 		</form>
// 	)
// }

const VerticalForm = <
	TFormValues extends Record<string, any> = Record<string, any>,
>({
	defaultValues,
	resolver,
	children,
	onSubmit,
	formClass,
	onInputChange,
}: VerticalFormProps<TFormValues>) => {
	const methods = useForm<TFormValues>({ defaultValues, resolver })

	const {
		handleSubmit,
		register,
		control,
		formState: { errors },
		watch,
	} = methods

	// useEffect to call onInputChange
	useEffect(() => {
		if (onInputChange) {
			const subscription = watch((value) => {
				onInputChange(value as TFormValues)
			})
			return () => subscription.unsubscribe()
		}
	}, [watch, onInputChange])

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={formClass} noValidate>
			{Array.isArray(children)
				? children.map((child) =>
						child.props && child.props.name
							? React.createElement(child.type, {
									...{
										...child.props,
										register,
										key: child.props.name,
										errors,
										control,
									},
							  })
							: child
				  )
				: children}
		</form>
	)
}


export default VerticalForm
