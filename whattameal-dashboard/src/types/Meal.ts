export type Meal = {
	parent: string
	child: string
	menuIDs: string[]
	price: number
	isPaid: boolean
}

export type MealBooking = {
	date: string
	meal: string
	price: number
}
