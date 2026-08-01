import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Function to add food to the cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Check if the item is already in the cart
      const existingItem = prevItems.find((cartItem) => cartItem._id === item._id);
      
      if (existingItem) {
        // If it is, just increase the quantity by 1
        return prevItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      // If it's new, add it to the cart with a quantity of 1
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  // Function to remove an item completely
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  // Calculate the total price of everything in the cart
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Count how many total items are in the cart (for the Navbar badge)
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Clear cart after checkout
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartTotal, cartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};