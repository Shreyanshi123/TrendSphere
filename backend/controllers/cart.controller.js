import Product from '../models/product.model.js';



export const addToCart = async(req, res)=>{
try {
   const {productId} = req.body;
   const user = req.user;
   const exisitingItem = user.cartItems.find(item=>item.id === productId);
   if(exisitingItem){
    exisitingItem.quantity+=1;
   }
   else{
    user.cartItems.push(productId);
   }
   await user.save();
   res.json(user.cartItems);
} catch (error) {
    console.log("Error in addtoacrt controller",error.message);
    res.status(500).json({message:"Server error",error:error.message});
}
};
export const getCartProducts = async(req,res)=>{
try {
    const products = await Product.find({_id:{$in:req.user.cartItems}});
    //  add 
    const cartItems = products.map(product=>{
        const item = req.user.cartItems.find(cartItem=> cartItem.id === product.id);
        return{...product.toJSON(),quantity:item.quantity};
    })
    res.json(cartItems);
} catch (error) {
    console.log("Error in getCartItems controller",error.message);
    res.status(500).json({message:"Server error",error:error.message});
}

};
export const removeAllFromCart = async(req,res)=>{
   try {
    const {productId} = req.body;
    const user = req.user;
    if(!productId){
        user.cartItems =[];
    }
    else{
        user.cartItems = user.cartItems.filter((item)=> item.id !== productId);
    }
        await user.save();
        res.json(user.cartItems);
   } catch (error) {
    console.log("Error in remove all product controller",error.message);
    res.status(500).json({message:"Server error",error:error.message});
   }
};

export const updateQuantity = async(req,res)=>{
    try {
    const {id:productId} = req.params;
    const {quantity} = req.body;
    const user = req.user;
    const exisitingItem = user.cartItems.find((item)=>item.id === productId);
    if(exisitingItem){
        if(quantity===0){
            user.cartItems = user.cartItems.filter((item)=>item.id !== productId);
            await user.save();
            res.json(user.cartItems);
        }
        exisitingItem.quantity = quantity;
        await user.save();
        res.json(user.cartItems);
    }
    else{
        res.status(400).json({message:"Product not found"});
    }
    } catch (error) {
        console.log("Error in update product controller",error.message);
    res.status(500).json({message:"Server error",error:error.message});
    }
};