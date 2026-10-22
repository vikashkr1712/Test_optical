import { currency, shopProducts } from './shopProducts.js';
import './CartPage.css';

export default function CartPage({ shopping, onContinueShopping, onCheckOrders }) {
  const items = shopping.cart.map(item => ({ ...item, product: shopProducts.find(product => product.id === item.id) }));
  const subtotal = items.reduce((total, item) => total + item.quantity * item.product.price, 0);

  return <section className="cart-page" aria-labelledby="cart-title">
    <div className="cart-page__heading"><h1 id="cart-title">Your cart</h1>{items.length > 0 && <span>{shopping.bagCount} {shopping.bagCount === 1 ? 'item' : 'items'}</span>}</div>
    {items.length === 0 ? <div className="cart-page__empty">
      <h2>Your cart is empty</h2>
      <p>Your next favourite pair is still out there. Let’s find it.</p>
      <div className="cart-page__actions"><button type="button" className="cart-button cart-button--primary" onClick={onContinueShopping}>Continue shopping</button><button type="button" className="cart-button" onClick={onCheckOrders}>Check my orders</button></div>
    </div> : <div className="cart-page__layout">
      <div className="cart-page__items">{items.map(({ product, quantity }) => <article className="cart-item" key={product.id}>
        <img src={`/assets/home/${product.id}-400.webp`} width="400" height="256" alt={`${product.brand} ${product.model}, ${product.colour}`} />
        <div className="cart-item__copy"><p className="cart-item__type">{product.type}</p><h2>{product.brand}</h2><p>{product.model}</p><p className="cart-item__colour">{product.colour}</p>
          <div className="cart-item__controls"><div className="cart-quantity" role="group" aria-label={`Quantity for ${product.brand} ${product.model}`}><button type="button" disabled={quantity === 1} aria-label={`Decrease ${product.model} quantity`} onClick={() => shopping.setQuantity(product.id, quantity - 1)}>−</button><span aria-live="polite">{quantity}</span><button type="button" disabled={quantity >= 10} aria-label={`Increase ${product.model} quantity`} onClick={() => shopping.setQuantity(product.id, quantity + 1)}>+</button></div><button type="button" className="cart-item__remove" aria-label={`Remove ${product.brand} ${product.model}`} onClick={() => shopping.setQuantity(product.id, 0)}>Remove</button></div>
        </div><strong className="cart-item__price">{currency.format(product.price * quantity)}</strong>
      </article>)}<button type="button" className="cart-page__continue" onClick={onContinueShopping}>← Continue shopping</button></div>
      <aside className="cart-summary" aria-labelledby="cart-summary-title"><h2 id="cart-summary-title">Your selection</h2><div className="cart-summary__total"><span>Subtotal</span><strong aria-live="polite">{currency.format(subtotal)}</strong></div><p>Frame prices are indicative. Prescription lenses, delivery and final availability will be confirmed when ordering opens.</p><div className="cart-summary__notice">Online checkout is coming soon. Your cart keeps your picks together until then.</div><button type="button" className="cart-button cart-button--primary" onClick={onContinueShopping}>Continue shopping</button><button type="button" className="cart-button" onClick={onCheckOrders}>Check my orders</button></aside>
    </div>}
    {shopping.storageUnavailable && <p className="cart-page__storage" role="status">Browser storage is unavailable. Your cart will last for this visit.</p>}
  </section>;
}
