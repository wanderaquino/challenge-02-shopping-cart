import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
    const [products, setProducts] = useState<ProductFormatted[]>([]);
    const {addProduct, cart} = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    const amount = 1;
      if(product.id in sumAmount) {
        let increment = sumAmount[product.id];
        sumAmount[product.id] = ++increment;
        return sumAmount;
    } else {
      sumAmount[product.id] = amount;
      return sumAmount;
    }
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      return await api.get("/products");
    }
    loadProducts().then(response => response.data.map(
      (product : Product) => {
        const priceFormatted = formatPrice(product.price);
        setProducts(prevState => [...prevState, {...product, priceFormatted}])
      }));
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>
      {products.map(product => {
          return (
            <li key={product.id}>
            <img src={product.image} alt={product.title}/>
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>
            <button
              type="button"
              data-testid="add-product-button" onClick={() => handleAddProduct(product.id)}>
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {cartItemsAmount[product.id] || 0}
              </div>
              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
          )
        })}
    </ProductList>
  );
};

export default Home;
