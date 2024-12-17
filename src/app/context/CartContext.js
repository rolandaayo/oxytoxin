'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const savedCart = localStorage.getItem('cartItems')
      return savedCart ? JSON.parse(savedCart) : []
    } catch {
      return []
    }
  })
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }
  }, [cartItems])

  const addToCart = (item) => {
    setCartItems(prev => {
      const newItems = [...prev, item]
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(newItems))
      }
      return newItems
    })
  }

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => item.id !== itemId)
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(newItems))
      }
      return newItems
    })
  }

  const clearCart = () => {
    setCartItems([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cartItems')
    }
  }

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        setCartItems, 
        showCart, 
        setShowCart,
        addToCart,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
} 