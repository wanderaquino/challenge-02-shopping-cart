import curriedMix from 'polished/lib/color/mix';
import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();
  const testReduce = cart.reduce((acc,curr) => {
    if( acc[`${curr.id}`]) {
      acc[`${curr.id}`] += 1; 
      return acc;
    } else {
      acc[`${curr.id}`] = 1;
      return acc;
    }
  }, {} as any);

  console.log(testReduce);


  const cartFormatted = 
  cart.map((currProduct) => {
    const sumPrice = currProduct.price * currProduct.amount;
    const priceFormated = formatPrice(currProduct.price);
    const sumPriceFormated = formatPrice(sumPrice);
    return Object.assign(currProduct, {...currProduct, sumPriceFormated, priceFormated});
    }, [] as any);


  function handleProductIncrement(product: Product) {

    const incrementedAmount = ++product.amount;
    updateProductAmount({productId: product.id, amount: incrementedAmount})

  
  }

  function handleProductDecrement(product: Product) {
    const decrementedAmount = --product.amount;
    updateProductAmount({productId: product.id, amount: decrementedAmount})
  }

  function handleRemoveProduct(productId: number) {
    // TODO
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatted.map(cart => (
            <tr key={cart.id} data-testid="product">
            <td>
              <img src={cart.image} alt={cart.title} />
            </td>
            <td>
              <strong>{cart.title}</strong>
              <span>{cart.priceFormated}</span>
            </td>
            <td>
              <div>
                <button
                  type="button"
                  data-testid="decrement-product"
                disabled={cart.amount <= 1}
                onClick={() => handleProductDecrement(cart)}
                >
                  <MdRemoveCircleOutline size={20} />
                </button>
                <input
                  type="text"
                  data-testid="product-amount"
                  readOnly
                  value={cart.amount}
                />
                <button
                  type="button"
                  data-testid="increment-product"
                  onClick={() => handleProductIncrement(cart)}
                >
                  <MdAddCircleOutline size={20} />
                </button>
              </div>
            </td>
            <td>
              <strong>{cart.sumPriceFormated}</strong>
            </td>
            <td>
              <button
                type="button"
                data-testid="remove-product"
              // onClick={() => handleRemoveProduct(product.id)}
              >
                <MdDelete size={20} />
              </button>
            </td>
          </tr>

          ))}
          
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>R$ 359,80</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
