import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (
    product,
    variant = null,
    freeFillings = [],
    paidFillings = []
  ) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: variant ? variant.price : product.price,
      mainImage: product.mainImage,
      variant: variant ? variant.size : null,
      freeFillings: freeFillings,
      paidFillings: paidFillings,
      quantity: 1,
    };

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.variant === cartItem.variant &&
        JSON.stringify(item.freeFillings) ===
          JSON.stringify(cartItem.freeFillings) &&
        JSON.stringify(item.paidFillings) ===
          JSON.stringify(cartItem.paidFillings)
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, cartItem]);
    }
  };

  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return;
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = quantity;
    setCartItems(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
