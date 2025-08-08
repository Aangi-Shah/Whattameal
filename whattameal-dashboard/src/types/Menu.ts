export type Menu = {
	date: string
	meal: string
	price: string
}

export interface ICalenderData {
	_id: string
	date: string
	meal: string
	price: string
	createdAt?: string
	updatedAt?: string
	__v?: number
	isDeleted?: boolean
}


export type LoadingStates = {
	isLoading: boolean
	isError: boolean
}

