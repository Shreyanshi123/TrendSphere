import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	const handleQuantityChange = (newQuantity) => {
		if (newQuantity >= 1) {
			updateQuantity(item._id, newQuantity);
		}
	};

	return (
		<div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm md:p-6">
			<div className="md:flex md:items-center md:justify-between md:gap-6">
				{/* Product Image */}
				<div className="shrink-0">
					<img
						className="h-20 md:h-32 rounded object-cover"
						src={item.image}
						alt={item.name}
					/>
				</div>

				{/* Product Details */}
				<div className="flex-1 space-y-4 md:max-w-md">
					<p className="text-base font-medium text-white hover:text-emerald-400 hover:underline">
						{item.name}
					</p>
					<p className="text-sm text-gray-400">{item.description}</p>
				</div>

				{/* Quantity Control and Price */}
				<div className="flex items-center justify-between space-x-4 md:justify-end">
					{/* Quantity Control */}
					<div className="flex items-center gap-2">
						<button
							className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							onClick={() => handleQuantityChange(item.quantity - 1)}
							aria-label="Decrease quantity"
						>
							<Minus className="text-gray-300" />
						</button>
						<p aria-live="polite">{item.quantity}</p>
						<button
							className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							onClick={() => handleQuantityChange(item.quantity + 1)}
							aria-label="Increase quantity"
						>
							<Plus className="text-gray-300" />
						</button>
					</div>

					{/* Price */}
					<p className="text-base font-bold text-emerald-400">${item.price}</p>
				</div>

				{/* Remove Button */}
				<div>
					<button
						className="inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 hover:underline"
						onClick={() => removeFromCart(item._id)}
						aria-label={`Remove ${item.name} from cart`}
					>
						<Trash className="mr-1" />
						Remove
					</button>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
