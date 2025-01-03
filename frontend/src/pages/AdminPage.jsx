import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	return (
		<div className='min-h-screen bg-gray-900 text-white'>
			<div className='container mx-auto px-4 py-16'>
				<motion.h1
					className='text-4xl font-extrabold text-center text-emerald-400 mb-12'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Admin Dashboard
				</motion.h1>

				<motion.div
					className='flex justify-center space-x-4 mb-12'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-6 py-3 rounded-lg font-semibold shadow-sm transition-colors duration-200 ${
								activeTab === tab.id
									? "bg-emerald-600 text-white"
									: "bg-gray-700 hover:bg-gray-600 text-gray-300"
							}`}
						>
							<tab.icon className='h-6 w-6 mr-2' />
							<span>{tab.label}</span>
						</button>
					))}
				</motion.div>

				<div className='bg-gray-800 p-8 rounded-lg shadow-md'>
					{activeTab === "create" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<CreateProductForm />
						</motion.div>
					)}
					{activeTab === "products" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<ProductsList />
						</motion.div>
					)}
					{activeTab === "analytics" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<AnalyticsTab />
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminPage;
