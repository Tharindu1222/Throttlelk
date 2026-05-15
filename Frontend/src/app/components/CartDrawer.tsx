import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';

export default function CartDrawer() {
  const { state, dispatch } = useCart();

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateQuantity = (id: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id, quantity: newQuantity },
      });
    } else {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    }
  };

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#2C2C2C] z-[101] overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2
                  className="text-3xl text-[#F0EDE8] tracking-wider"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Your Cart
                </h2>
                <motion.button
                  onClick={() => dispatch({ type: 'CLOSE_CART' })}
                  className="text-[#F0EDE8] hover:text-[#C0392B]"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {state.items.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ShoppingBag className="w-16 h-16 text-[#F0EDE8]/20 mb-4" />
                  <p
                    className="text-[#F0EDE8]/60 text-center"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Your cart is empty.
                    <br />
                    Time to gear up.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="space-y-6 mb-8">
                    {state.items.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.selectedColor}`}
                        className="flex gap-4 bg-[#0A0A0A] p-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        layout
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-32 object-cover"
                        />

                        <div className="flex-1">
                          <h3
                            className="text-[#F0EDE8] mb-2 tracking-wide"
                            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                          >
                            {item.name}
                          </h3>

                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-4 h-4 rounded-full border border-[#F0EDE8]"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                            <span
                              className="text-[#F0EDE8]/60 text-sm"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              {item.category}
                            </span>
                          </div>

                          <p
                            className="text-[#C0392B] mb-4"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            LKR {item.price.toLocaleString()}
                          </p>

                          <div className="flex items-center gap-3">
                            <motion.button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity, -1)
                              }
                              className="w-8 h-8 bg-[#2C2C2C]/40 backdrop-blur-md flex items-center justify-center hover:bg-[#C0392B]/30 transition-colors border border-[#F0EDE8]/10"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus className="w-4 h-4 text-[#F0EDE8]" />
                            </motion.button>

                            <span
                              className="text-[#F0EDE8] w-8 text-center"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              {item.quantity}
                            </span>

                            <motion.button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity, 1)
                              }
                              className="w-8 h-8 bg-[#2C2C2C]/40 backdrop-blur-md flex items-center justify-center hover:bg-[#C0392B]/30 transition-colors border border-[#F0EDE8]/10"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="w-4 h-4 text-[#F0EDE8]" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="border-t border-[#0A0A0A] pt-6">
                    <div className="flex justify-between mb-6">
                      <span
                        className="text-[#F0EDE8] text-xl tracking-wide"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        Subtotal
                      </span>
                      <span
                        className="text-[#C0392B] text-xl"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        LKR {subtotal.toLocaleString()}
                      </span>
                    </div>

                    <motion.button
                      className="w-full bg-[#C0392B]/20 text-[#F0EDE8] py-4 tracking-wider border-2 border-[#C0392B]/50 backdrop-blur-md hover:bg-[#C0392B]/40 hover:border-[#C0392B] transition-all shadow-[0_8px_32px_0_rgba(192,57,43,0.2)] rounded-full"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Checkout
                    </motion.button>

                    <p
                      className="text-[#F0EDE8]/40 text-sm text-center mt-4"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Shipping calculated at checkout
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
