import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
	return (
		<div className="relative overflow-hidden h-96 w-full rounded-lg group">
			<Link to={`/category${category.href}`} aria-label={`Explore ${category.name}`}>
				<div className="w-full h-full">
					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10"></div>

					{/* Category Image */}
					<img
						src={category.imageUrl}
						alt={`Category: ${category.name}`}
						className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
						loading="lazy"
					/>

					{/* Category Details */}
					<div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
						<h3 className="text-2xl font-bold mb-2">{category.name}</h3>
						<p className="text-sm text-gray-200">Explore {category.name}</p>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default CategoryItem;
