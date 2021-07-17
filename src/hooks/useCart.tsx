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
      const productResponse = await api.get(`/products/${productId}`)
      .catch(error => {
        if(error.response.status >= 400 || error.response.status <= 500 ) {
          toast("Ocorreu um erro ao consultar seu produto");
        } else {
          toast("Ocorreu um erro, tente novamente mais tarde!");
        }
      })
      .then((response:any) => {
          return response.data;
      });

      await api.get(`/stock/${productId}`)
        .catch(error => {
          if(error.response.status >= 400 || error.response.status <= 500) {
            toast("Ocorreu um erro ao consultar seu produto");
          } else {
            toast("Ocorreu um erro, tente novamente mais tarde!");
          }
        })
        .then((stockResponse:any) => {
          if(stockResponse.data.amount > 0){
            const localStorage = window.localStorage.getItem(cartName);
            if (localStorage) {
              const parsedStorage = JSON.parse(localStorage);
              window.localStorage.setItem(cartName, JSON.stringify([...parsedStorage, productResponse]));
            } else {
              window.localStorage.setItem(cartName, JSON.stringify([{...productResponse}]));
            }   
            setCart(prevState => [...prevState, productResponse]);
          } else {
            toast("Quantidade solicitada fora de estoque");
          }})
    } catch {
        throw new Error;
      }
    }

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
