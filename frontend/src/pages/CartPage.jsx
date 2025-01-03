import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";

const CartPage = () => {
	const { cart } = useCartStore();

	return (
		<div className='py-8 md:py-16'>
			<div className='container mx-auto max-w-screen-xl px-4 2xl:px-0'>
				<div className='mt-6 sm:mt-8 flex flex-col lg:flex-row lg:gap-8'>
					<motion.div
						className='w-full lg:max-w-3xl'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						{cart.length === 0 ? (
							<EmptyCartUI />
						) : (
							<div className='space-y-6'>
								{cart.map((item) => (
									<CartItem key={item._id} item={item} />
								))}
							</div>
						)}
						{cart.length > 0 && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.3 }}
							>
								<PeopleAlsoBought />
							</motion.div>
						)}
					</motion.div>

					{cart.length > 0 && (
						<motion.aside
							className='w-full lg:w-1/3 mt-8 lg:mt-0 space-y-6'
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<OrderSummary />
							<GiftCouponCard />
						</motion.aside>
					)}
				</div>
			</div>
		</div>
	);
};

const EmptyCartUI = () => (
	<motion.div
		className='flex flex-col items-center justify-center space-y-6 py-16'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<ShoppingCart className='h-24 w-24 text-gray-300' />
		<h3 className='text-2xl font-semibold text-gray-200'>Your cart is empty</h3>
		<p className='text-gray-400'>It looks like you haven’t added anything to your cart yet.</p>
		<Link
			className='rounded-md bg-emerald-500 px-6 py-2 text-white hover:bg-emerald-600 transition duration-200'
			to='/'
		>
			Start Shopping
		</Link>
	</motion.div>
);

export default CartPage;
