'use client'
import Wishlist from '../components/Wishlist'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

export default function WishlistPage() {
  const { cartItems, setCartItems, showCart, setShowCart } = useCart();

  const addToCart = (item) => {
    setCartItems(prev => [...prev, item])
    localStorage.setItem('cartItems', JSON.stringify([...cartItems, item]))
  }

  return (
    <>
      <Navbar 
        cartItems={cartItems} 
        setShowCart={setShowCart}
      />
      <Wishlist 
        addToCart={addToCart}
        setShowCart={setShowCart}
      />
      <Footer />
    </>
  )
} 