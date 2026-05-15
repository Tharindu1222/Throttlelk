import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus } from 'lucide-react';
import { Product, useCart } from './CartContext';

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetail({ product, isOpen, onClose }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();

  useEffect(() => {
    if (!product) return;
    const firstColor = product.colors[0] ?? '';
    setSelectedColor(firstColor);
    const firstSize = product.sizes[0] ?? 'M';
    setSelectedSize(firstSize);
    setQuantity(1);
  }, [product?.id]);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: 'ADD_ITEM',
        payload: { ...product, selectedColor },
      });
    }
    dispatch({ type: 'OPEN_CART' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:max-w-5xl md:h-[90vh] bg-[#2C2C2C] z-[201] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="sticky top-0 bg-[#2C2C2C] z-10 p-6 border-b border-[#0A0A0A] flex justify-between items-center">
              <h2
                className="text-3xl text-[#F0EDE8] tracking-wider"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Product Details
              </h2>
              <motion.button
                onClick={onClose}
                className="text-[#F0EDE8] hover:text-[#C0392B]"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image Section */}
                <motion.div
                  className="relative aspect-[3/4] bg-[#0A0A0A] overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute top-4 right-4 bg-[#C0392B] text-[#F0EDE8] px-4 py-2 tracking-wider">
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {product.category}
                    </span>
                  </div>
                </motion.div>

                {/* Details Section */}
                <motion.div
                  className="flex flex-col"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1
                    className="text-5xl text-[#F0EDE8] mb-4 tracking-wide"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {product.name}
                  </h1>

                  <motion.div
                    className="h-1 bg-[#C0392B] mb-6"
                    initial={{ width: 0 }}
                    animate={{ width: '80px' }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />

                  <p
                    className="text-4xl text-[#C0392B] mb-6"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    LKR {product.price.toLocaleString()}
                  </p>

                  <p
                    className="text-[#F0EDE8]/80 mb-8 leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {product.description}
                  </p>

                  {/* Color Selection */}
                  <div className="mb-6">
                    <h3
                      className="text-xl text-[#F0EDE8] mb-3 tracking-wide"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      Select Color
                    </h3>
                    <div className="flex gap-3 flex-wrap">
                      {product.colors.map((color) => (
                        <motion.button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className="relative w-12 h-12 rounded-full border-2 transition-all"
                          style={{
                            backgroundColor: color,
                            borderColor: selectedColor === color ? '#C0392B' : '#F0EDE8',
                            boxShadow: selectedColor === color ? '0 0 0 3px rgba(192, 57, 43, 0.3)' : 'none'
                          }}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {selectedColor === color && (
                            <motion.div
                              className="absolute inset-0 rounded-full border-2 border-[#C0392B]"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1.3 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-6">
                    <h3
                      className="text-xl text-[#F0EDE8] mb-3 tracking-wide"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      Select Size
                    </h3>
                    <div className="flex gap-3 flex-wrap">
                      {product.sizes.map((size) => (
                        <motion.button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-14 h-14 border-2 tracking-wider transition-all backdrop-blur-md rounded-xl ${
                            selectedSize === size
                              ? 'bg-[#C0392B]/30 border-[#C0392B] text-[#F0EDE8] shadow-[0_8px_32px_0_rgba(192,57,43,0.3)]'
                              : 'bg-[#0A0A0A]/20 border-[#F0EDE8]/30 text-[#F0EDE8] hover:border-[#C0392B] hover:bg-[#C0392B]/10'
                          }`}
                          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mb-8">
                    <h3
                      className="text-xl text-[#F0EDE8] mb-3 tracking-wide"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      Quantity
                    </h3>
                    <div className="flex items-center gap-4">
                      <motion.button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 bg-[#0A0A0A]/40 backdrop-blur-md flex items-center justify-center hover:bg-[#C0392B]/30 transition-colors border border-[#F0EDE8]/20"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="w-5 h-5 text-[#F0EDE8]" />
                      </motion.button>

                      <span
                        className="text-2xl text-[#F0EDE8] w-16 text-center"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {quantity}
                      </span>

                      <motion.button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 bg-[#0A0A0A]/40 backdrop-blur-md flex items-center justify-center hover:bg-[#C0392B]/30 transition-colors border border-[#F0EDE8]/20"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="w-5 h-5 text-[#F0EDE8]" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Product Specs */}
                  <div className="mb-8 p-4 bg-[#0A0A0A] border border-[#F0EDE8]/10">
                    <h3
                      className="text-xl text-[#F0EDE8] mb-3 tracking-wide"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      Specifications
                    </h3>
                    <ul
                      className="space-y-2 text-[#F0EDE8]/70"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {product.specifications.map((line, i) => (
                        <li key={`${product.id}-spec-${i}`}>• {line}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    onClick={handleAddToCart}
                    className="w-full bg-[#C0392B]/20 text-[#F0EDE8] py-5 tracking-wider border-2 border-[#C0392B]/50 backdrop-blur-md hover:bg-[#C0392B]/40 hover:border-[#C0392B] transition-all mt-auto shadow-[0_8px_32px_0_rgba(192,57,43,0.2)] rounded-full"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.25rem' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98, y: 2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    Add to Cart — LKR {(product.price * quantity).toLocaleString()}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
