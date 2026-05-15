import { useState } from 'react';
import { motion } from 'motion/react';
import { Product, useCart } from './CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const { dispatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...product, selectedColor },
    });
    dispatch({ type: 'OPEN_CART' });
  };

  return (
    <motion.div
      className="group relative bg-[#2C2C2C] overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-100px', amount: 0.2 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      onClick={() => onViewDetails(product)}
    >
      <div className="relative overflow-hidden aspect-[3/4]">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.div
          className="absolute inset-0 border-2 border-transparent"
          whileHover={{ borderColor: '#C0392B' }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-60" />
      </div>

      <div className="p-6">
        <h3
          className="text-2xl text-[#F0EDE8] mb-2 tracking-wide"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {product.name}
        </h3>

        <p
          className="text-[#F0EDE8] mb-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          LKR {product.price.toLocaleString()}
        </p>

        <div className="flex gap-2 mb-4">
          {product.colors.map((color) => (
            <motion.button
              key={color}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(color);
              }}
              className="w-8 h-8 rounded-full border-2 transition-all"
              style={{
                backgroundColor: color,
                borderColor: selectedColor === color ? '#C0392B' : 'transparent',
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <motion.button
          onClick={handleAddToCart}
          className="w-full bg-[#C0392B]/20 text-[#F0EDE8] py-3 tracking-wider border-2 border-[#C0392B]/50 backdrop-blur-md hover:bg-[#C0392B]/40 hover:border-[#C0392B] transition-all shadow-[0_8px_32px_0_rgba(192,57,43,0.2)] rounded-full"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98, y: 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          Add to Cart
        </motion.button>
      </div>

      <motion.div
        className="absolute top-4 right-4 bg-[#C0392B] text-[#F0EDE8] px-3 py-1 text-xs tracking-wider"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ delay: 0.2 }}
      >
        {product.category}
      </motion.div>
    </motion.div>
  );
}
