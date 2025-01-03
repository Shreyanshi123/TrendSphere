import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

	return (
		<motion.div
			className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<table className="min-w-full divide-y divide-gray-700">
				<thead className="bg-gray-700">
					<tr>
						{["Product", "Price", "Category", "Featured", "Actions"].map((heading) => (
							<th
								key={heading}
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
							>
								{heading}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="bg-gray-800 divide-y divide-gray-700">
					{products?.map((product) => (
						<tr key={product._id} className="hover:bg-gray-700">
							{/* Product Details */}
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="flex items-center">
									<img
										className="h-10 w-10 rounded-full object-cover"
										src={product.image}
										alt={product.name}
									/>
									<div className="ml-4 text-sm font-medium text-white">{product.name}</div>
								</div>
							</td>
							{/* Price */}
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="text-sm text-gray-300">${product.price.toFixed(2)}</div>
							</td>
							{/* Category */}
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="text-sm text-gray-300">{product.category}</div>
							</td>
							{/* Featured Toggle */}
							<td className="px-6 py-4 whitespace-nowrap">
								<button
									onClick={() => toggleFeaturedProduct(product._id)}
									className={`p-1 rounded-full transition-colors duration-200 ${
										product.isFeatured
											? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
											: "bg-gray-600 text-gray-300 hover:bg-gray-500"
									}`}
									aria-label={`Toggle featured status for ${product.name}`}
								>
									<Star className="h-5 w-5" />
								</button>
							</td>
							{/* Actions */}
							<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<button
									onClick={() => deleteProduct(product._id)}
									className="text-red-400 hover:text-red-300 transition-colors duration-200"
									aria-label={`Delete ${product.name}`}
								>
									<Trash className="h-5 w-5" />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</motion.div>
	);
};

export default ProductsList;
