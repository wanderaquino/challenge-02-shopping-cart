import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product } from '../types';
import {cartName} from "../util/names";

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
        const parsedStorage = JSON.parse(storaged);
        return [...parsedStorage];
      } 
      else
      {
        return []
      };
  }
  );

  const addProduct = async (productId: number) => {
    try {
      const localCart = [...cart];
      const productLocalCart = localCart.find(product => product.id === productId);
      const productResponse = await api.get(`/products/${productId}`);
      const stockResponse = await api.get(`/stock/${productId}`);
      const currentAmount = productLocalCart ? productLocalCart.amount : 0;

      if (currentAmount > stockResponse.data.amount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      if(productLocalCart) {  
        productLocalCart.amount += 1;
        setCart(localCart);
        window.localStorage.setItem(cartName, JSON.stringify(localCart));

      } else {
        const newProduct = {...productResponse.data, amount: 1};
        localCart.push(newProduct);
        setCart(localCart);
        window.localStorage.setItem(cartName, JSON.stringify(localCart));
      }
    console.log(cart);

    }
    catch {
      toast.error("Erro na adição do produto");
    }
  }
  const removeProduct = (productId: number) => {
    try {
      //TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const stockResponse = await api.get(`/stock/${productId}`);
      const localCart = [...cart];
      const productLocalCart = localCart.find(product => product.id === productId);
      
      if(amount > stockResponse.data.amount){
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      if(productLocalCart) {
        productLocalCart.amount = amount;
        window.localStorage.setItem(cartName, JSON.stringify(localCart));
        setCart(localCart);
      }

    } catch {
      toast.error("Erro na adição do produto");
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
