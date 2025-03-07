"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: string
  title: string
  price: number
  img: string
  detail: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)

  // Load cart from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart))
        } catch (error) {
          console.error("Failed to parse cart from localStorage", error)
          localStorage.removeItem("cart")
        }
      }
    }
  }, [])

  // Update localStorage and cart metrics whenever cartItems changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems))

      // Update cart count
      const count = cartItems.reduce((total, item) => total + item.quantity, 0)
      setCartCount(count)
      localStorage.setItem("cartCount", count.toString())

      // Update cart total
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      setCartTotal(total)
    }
  }, [cartItems])

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      // console.log(prevItems);
      
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);
      let updatedItems;

  
  
      if (existingItemIndex >= 0) {
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
      } else {
        updatedItems = [...prevItems, { ...product, quantity: 1 }];
      }
  
      // Calculate new cart count immediately
      const newCartCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const newCartTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
      // Update count and total immediately
      setCartCount(newCartCount);
      setCartTotal(newCartTotal);
  
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(updatedItems));
        localStorage.setItem("cartCount", newCartCount.toString());
      }
  
      return updatedItems;
    });
  };
  

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("cart")
    localStorage.setItem("cartCount", "0")
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

