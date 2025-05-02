import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";

export default function ShoppingCart() {
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart,
    getCartTotal,
    getCartItemCount,
    loading
  } = useCart();

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden z-50" 
      aria-labelledby="slide-over-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Background overlay */}
        <div 
          onClick={closeCart} 
          className="absolute inset-0 bg-neutral-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true">
        </div>

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md">
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-neutral-900" id="slide-over-title">Carrinho de Compras</h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      onClick={closeCart}
                      type="button"
                      className="-m-2 p-2 text-neutral-400 hover:text-neutral-500">
                      <span className="sr-only">Fechar</span>
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-neutral-200">
                      {cartItems.length === 0 ? (
                        <li className="py-6 flex">
                          <div className="flex-1 flex flex-col justify-center items-center">
                            <ShoppingBag className="text-neutral-300 h-12 w-12 mb-2" />
                            <p className="text-neutral-500">Seu carrinho está vazio</p>
                            <Button 
                              variant="link" 
                              onClick={closeCart} 
                              className="mt-4 text-primary-600 hover:text-primary-500"
                            >
                              Continuar comprando
                            </Button>
                          </div>
                        </li>
                      ) : (
                        cartItems.map((item) => (
                          <li key={item.id} className="py-6 flex">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name} 
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-neutral-900">
                                  <h3>{item.product.name}</h3>
                                  <p className="ml-4">{formatPrice(Number(item.price) * item.quantity)}</p>
                                </div>
                                <p className="mt-1 text-sm text-neutral-500">{item.product.category}</p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center">
                                  <button 
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                                    disabled={loading}
                                    className="text-neutral-600 hover:bg-neutral-100 p-1 rounded disabled:opacity-50">
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="mx-2 text-neutral-500">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                    disabled={loading || item.quantity >= item.product.stock}
                                    className="text-neutral-600 hover:bg-neutral-100 p-1 rounded disabled:opacity-50">
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="flex">
                                  <button 
                                    onClick={() => removeFromCart(item.id)} 
                                    disabled={loading}
                                    type="button" 
                                    className="font-medium text-primary-600 hover:text-primary-500 disabled:opacity-50">
                                    Remover
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-neutral-900">
                  <p>Subtotal</p>
                  <p>{formatPrice(getCartTotal())}</p>
                </div>
                <p className="mt-0.5 text-sm text-neutral-500">Frete e impostos calculados na finalização da compra.</p>
                <div className="mt-6">
                  <Link href="/checkout">
                    <Button
                      onClick={closeCart}
                      className="w-full"
                      disabled={cartItems.length === 0 || loading}
                    >
                      Finalizar Compra
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-neutral-500">
                  <p>
                    ou 
                    <Button
                      onClick={closeCart}
                      variant="link"
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      Continuar Comprando
                      <span aria-hidden="true"> &rarr;</span>
                    </Button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
