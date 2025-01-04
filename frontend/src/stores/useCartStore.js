import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	// Fetch user's coupon
	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
			toast.error("Failed to fetch coupon");
		}
	},

	// Apply a coupon code
	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},

	// Remove the applied coupon
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	// Fetch all cart items
	getCartItems: async () => {
		try {
			const response = await axios.get("/cart");
			set({ cart: response.data });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response?.data?.message || "Failed to fetch cart items");
		}
	},

	// Clear the cart
	clearCart: () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
		toast.success("Cart cleared");
	},

	// Add a product to the cart
	addToCart: async (product) => {
		try {
			await axios.post("/cart", { productId: product._id });
			set((state) => {
				const existingItem = state.cart.find((item) => item._id === product._id);
				const updatedCart = existingItem
					? state.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...state.cart, { ...product, quantity: 1 }];
				return { cart: updatedCart };
			});
			get().calculateTotals();
			toast.success("Product added to cart");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to add product to cart");
		}
	},

	// Remove a product from the cart
	removeFromCart: async (productId) => {
		try {
			await axios.delete("/cart", { data: { productId } });
			set((state) => ({
				cart: state.cart.filter((item) => item._id !== productId),
			}));
			get().calculateTotals();
			toast.success("Product removed from cart");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to remove product from cart");
		}
	},

	// Update the quantity of a product
	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}

		try {
			await axios.put(`/cart/${productId}`, { quantity });
			set((state) => ({
				cart: state.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
			}));
			get().calculateTotals();
			toast.success("Quantity updated");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update quantity");
		}
	},

	// Calculate totals for the cart
	calculateTotals: () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));
