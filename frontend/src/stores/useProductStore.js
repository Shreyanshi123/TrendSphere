import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,
	error: null,

	// Set products
	setProducts: (products) => set({ products }),

	// Create a new product
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const response = await axios.post("/products", productData);
			set((state) => ({
				products: [...state.products, response.data],
				loading: false,
			}));
			toast.success("Product created successfully!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to create product");
		}
	},

	// Fetch all products
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ loading: false, error: "Failed to fetch products" });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		}
	},

	// Fetch products by category
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ loading: false, error: "Failed to fetch products by category" });
			toast.error(error.response?.data?.error || "Failed to fetch products by category");
		}
	},

	// Delete a product
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((state) => ({
				products: state.products.filter((product) => product._id !== productId),
				loading: false,
			}));
			toast.success("Product deleted successfully!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to delete product");
		}
	},

	// Toggle the featured status of a product
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			set((state) => ({
				products: state.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
			toast.success("Product updated successfully!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to update product");
		}
	},

	// Fetch featured products
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ loading: false, error: "Failed to fetch featured products" });
			toast.error("Error fetching featured products");
			console.error("Error fetching featured products:", error);
		}
	},
}));
