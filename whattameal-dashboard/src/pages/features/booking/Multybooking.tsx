import { MealBooking } from '@/types'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'


const Multybooking = () => {
	const params = useParams()
	const [searchParams] = useSearchParams()
	const childId = searchParams.get('childID')

	useEffect(() => {
		console.log('Parent ID:', params.id)
		console.log('Child ID:', childId)
	}, [childId, params])

	const meals: MealBooking[] = [
		{
			date: '6-12-2023',
			price: 140,
			meal: 'Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits  Poha, Tea, Fruits   Poha, Tea, Fruits   Poha, Tea, Fruits ',
		},
		{ date: '29-5-2025', price: 140, meal: 'Samosa, Jalebi' },
		{ date: '10-6-2025', price: 140, meal: 'Chapati, Rice, Dal, Aloo Sabzi' },
		{ date: '11-6-2025', price: 140, meal: 'Paneer Curry, Naan, Salad' },
		{
			date: '6-12-2023',
			price: 140,
			meal: 'Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits  Poha, Tea, Fruits   Poha, Tea, Fruits   Poha, Tea, Fruits ',
		},
		{ date: '29-5-2025', price: 140, meal: 'Samosa, Jalebi' },
		{ date: '10-6-2025', price: 140, meal: 'Chapati, Rice, Dal, Aloo Sabzi' },
		{ date: '11-6-2025', price: 140, meal: 'Paneer Curry, Naan, Salad' },
		{
			date: '6-12-2023',
			price: 140,
			meal: 'Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits  Poha, Tea, Fruits   Poha, Tea, Fruits   Poha, Tea, Fruits ',
		},
		{ date: '29-5-2025', price: 140, meal: 'Samosa, Jalebi' },
		{ date: '10-6-2025', price: 140, meal: 'Chapati, Rice, Dal, Aloo Sabzi' },
		{ date: '11-6-2025', price: 140, meal: 'Paneer Curry, Naan, Salad' },
		{
			date: '6-12-2023',
			price: 140,
			meal: 'Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits  Poha, Tea, Fruits   Poha, Tea, Fruits   Poha, Tea, Fruits ',
		},
		{ date: '29-5-2025', price: 140, meal: 'Samosa, Jalebi' },
		{ date: '10-6-2025', price: 140, meal: 'Chapati, Rice, Dal, Aloo Sabzi' },
		{ date: '11-6-2025', price: 140, meal: 'Paneer Curry, Naan, Salad' },
		{
			date: '6-12-2023',
			price: 140,
			meal: 'Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits  Poha, Tea, Fruits   Poha, Tea, Fruits   Poha, Tea, Fruits ',
		},
		{ date: '29-5-2025', price: 140, meal: 'Samosa, Jalebi' },
		{ date: '10-6-2025', price: 140, meal: 'Chapati, Rice, Dal, Aloo Sabzi' },
		{ date: '11-6-2025', price: 140, meal: 'Paneer Curry, Naan, Salad' },
		{
			date: '6-12-2023',
			price: 140,
			meal: 'Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits Poha, Tea, Fruits  Poha, Tea, Fruits   Poha, Tea, Fruits   Poha, Tea, Fruits ',
		},
		{ date: '29-5-2025', price: 140, meal: 'Samosa, Jalebi' },
		{ date: '10-6-2025', price: 140, meal: 'Chapati, Rice, Dal, Aloo Sabzi' },
		{ date: '11-6-2025', price: 140, meal: 'Paneer Curry, Naan, Salad' },
		// ... repeat or update others
	]

	const [selected, setSelected] = useState<number[]>([])

	const handleCheckboxChange = (index: number) => {
		setSelected((prev) =>
			prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
		)
	}

	const isAllSelected = selected.length === meals.length

	const handleSelectAll = () => {
		if (isAllSelected) {
			setSelected([])
		} else {
			setSelected(meals.map((_, i) => i))
		}
	}

	const total = selected.reduce((sum, index) => sum + meals[index].price, 0)

	return (
		<section className="background-image">
			<div className="summary-container">
				<h2 className="summary-title">Meal Payment Summary</h2>

				<div className="select-all-container">
						<input
							type="checkbox"
							checked={isAllSelected}
							onChange={handleSelectAll}
								className="meal-checkbox"

						/>{' '}
						Select All
				</div>

				<div className="meal-list">
					{meals.map((meal, index) => (
						<div key={index} className="meal-card">
							<input
								type="checkbox"
								checked={selected.includes(index)}
								onChange={() => handleCheckboxChange(index)}
								className="meal-checkbox"
							/>
							<div className="meal-info-row">
								<div className="meal-top">
									<span className="meal-date">{meal.date}</span>
									<span className="meal-price">₹{meal.price}</span>
								</div>
								<div className="meal-desc">{meal.meal}</div>
							</div>
						</div>
					))}
				</div>

				<div className="summary-footer">
					<div className="total-amount">Total Payable Amount: ₹{total}</div>
					<button className="pay-button" disabled={total === 0}>
						Pay Now
					</button>
				</div>
			</div>
		</section>
	)
}

export default Multybooking
