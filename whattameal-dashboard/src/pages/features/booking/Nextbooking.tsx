import { useParams, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { MealBooking } from '@/types'

const NextBooking = () => {
	const [searchParams] = useSearchParams()
	const params = useParams()

	const childId = searchParams.get('childID')
	const menuId = searchParams.get('menuID')

	useEffect(() => {
		console.log('Parent ID:', params.id)
		console.log('Child ID:', childId)
		console.log('Menu ID:', menuId)
	}, [childId, menuId, params])

	const meal: MealBooking = {
		date: '30-06-2025',
		meal: 'Paneer Curry, Naan, Salad',
		price: 140,
	}

	return (
		<section className="background-image">
			<div className="nextbooking-container">
				<h2 className="summary-title">Your Next Meal Booking</h2>

				<div className="meal-list">
					<div className="meal-card">
						<div className="meal-info-row">
							<div className="meal-top">
								<span className="meal-date">{meal.date}</span>
								<span className="meal-price">₹{meal.price}</span>
							</div>
							<div className="meal-desc">{meal.meal}</div>
						</div>
					</div>
				</div>

				<div className="summary-footer">
					<div className="total-amount">Total Payable Amount: ₹{meal.price}</div>
					<button className="pay-button">Pay Now</button>
				</div>
			</div>
		</section>
	)
}

export default NextBooking
