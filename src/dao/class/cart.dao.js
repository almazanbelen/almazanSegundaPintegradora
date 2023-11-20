const {
  ConversationContextImpl,
} = require("twilio/lib/rest/conversations/v1/conversation");
const { cartModel } = require("../models/cart.model");

module.exports = class Cart {
  getCart = async () => {
    try {
      let cart = await cartModel.find();
      return cart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getCartById = async (cid) => {
    try {
      const result = await cartModel
        .findOne({ _id: cid });
      return result;
    } catch (error) {
      console.log("error: " + error);
      return null;
    }
  };

  postCart = async (uid) => {
    try {
      let carts = await cartModel.create({
        user: uid
      });
      return carts;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  putCart = async (cid, cartToReplace) => {
    try {
      let cart = await cartModel.updateOne({ _id: cid }, cartToReplace);
      return cart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  addProduct= async(cid, pid, quantity) => {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      cart.products.push({ product: pid, quantity: quantity });
      await cart.save();
      return cart;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  calculateTotalPrice = async (cid) => {
    try {
      let cart = await cartModel.findOne({ _id: cid });
      let totalPrice = 0;
      cart.products.map((p) => {
        totalPrice += p.product.price * p.quantity;
      });
      const result = await cartModel.updateOne(cart, {
        totalPrice: totalPrice,
      });
      return result
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  deleteCart = async (cid) => {
    try {
      let cart = await cartModel.deleteOne({ _id: cid });
      return cart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  deleteProduct = async (cid, pid) => {
    try {
      let cart = await cartModel.findOne({_id:cid});
      cart.products.splice({ _id: pid });
      let result = await cartModel.updateOne({ _id: cid }, cart);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
};
