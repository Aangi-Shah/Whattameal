export type Children = {
	_id: string
	parent: string
	name: string
	dob: string
	school: string
	className: string
	divison: string
	mealType: string
	shift: string
	__v?: number
	isDeleted: boolean
}

export type ChildrenValidation = {
	name: null | string
	dob: null | string
	school: null | string
	className: null | string
	divison: null | string
	mealType: null | string
	shift: null | string
	parent: null | string
}

export type ChildrenEdit = {
	_id: string
	parent: string
	name: string
	dob: string
	school: string
	className: string
	divison: string
	mealType: string
	shift: string
	__v?: number
	isDeleted: boolean
}

export type ChildrenEditValidation = {
	name: null | string
	dob: null | string
	school: null | string
	className: null | string
	divison: null | string
	mealType: null | string
	shift: null | string
	parent: null | string
}
