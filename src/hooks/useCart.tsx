import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';
const cartName = "@RocketShoes:cart";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  
  const [cart, setCart] = useState<Product[]>(() => {
    const storaged = window.localStorage.getItem(cartName);
      if(storaged) {
        return [{...JSON.parse(storaged)}];
      } else {return []};
  });

  const addProduct = async (productId: number) => {
    try {
      api.get(`/products/${productId}`)
        .then(response => {
          const storagedProducts = window.localStorage.getItem(cartName);
            if(storagedProducts) {
              const parsedtoObjectProducts = JSON.parse(storagedProducts);
              window.localStorage.setItem(cartName, JSON.stringify([...parsedtoObjectProducts, response.data]));
            } else {
              window.localStorage.setItem(cartName, JSON.stringify([response.data]));
            } 
          setCart(prevState => prevState.concat(response.data));
        })
    } catch {
      throw new Error;
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
