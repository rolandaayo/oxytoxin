import React, { createContext, useContext, useReducer } from 'react';

const ProductContext = createContext(null);

const productReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
      };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, {
    products: [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 299.99,
        description: 'High-quality wireless headphones with noise cancellation.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        category: 'Electronics',
      },
      {
        id: '2',
        name: 'Smart Watch Pro',
        price: 199.99,
        description: 'Advanced smartwatch with health tracking features.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        category: 'Electronics',
      },
      {
        id: '3',
        name: 'Premium Leather Bag',
        price: 159.99,
        description: 'Handcrafted leather bag with premium finishing.',
        image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800',
        category: 'Accessories',
      },
    ],
  });

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};