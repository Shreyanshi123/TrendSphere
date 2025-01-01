import Product from "../models/product.model.js";

const getAllProducts = async(req,res) =>{
    try {
        const products = await Product.find({});
        res.json({products});
    } catch (error) {
        console.log("Error in the product controller product get all function");
        res.status(500).json({message:"Server Error", error:error.message});
    }
}
export default getAllProducts;