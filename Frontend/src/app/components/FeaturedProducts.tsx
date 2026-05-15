import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import { products as staticProducts } from './products';
import { Product } from './CartContext';
import { API_BASE } from '../../lib/api';
import { mergeProductListItem } from '../../lib/productDisplayDefaults';

const categories = ['All', 'Zip-up', 'Non Zip', 'Limited Edition'];

export default function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [catalog, setCatalog] = useState<Product[] | null>(null);
  const [catalogNote, setCatalogNote] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE.replace(/\/$/, '')}/products`);
        if (!res.ok) {
          throw new Error('bad status');
        }
        const raw = (await res.json()) as Parameters<typeof mergeProductListItem>[0][];
        if (!cancelled) {
          setCatalog(raw.map((row) => mergeProductListItem(row)));
          setCatalogNote(null);
        }
      } catch {
        if (!cancelled) {
          setCatalog(staticProducts);
          setCatalogNote(
            'Showing offline catalog — start the API to load live products.',
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const products = catalog ?? staticProducts;

  const filteredProducts = useMemo(() => {
    return activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <section id="shop" className="bg-[#0A0A0A] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-6xl text-[#F0EDE8] mb-4 tracking-wider text-center"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Featured Collection
        </motion.h2>

        {catalogNote && (
          <p
            className="text-center text-sm text-amber-200/90 mb-6 max-w-xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {catalogNote}
          </p>
        )}

        <motion.div
          className="h-1 bg-[#C0392B] mb-12 mx-auto"
          initial={{ width: 0 }}
          whileInView={{ width: '120px' }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.3 }}
        >
          {categories.map((category, i) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 border-2 tracking-wider transition-all backdrop-blur-md rounded-full ${
                activeCategory === category
                  ? 'bg-[#C0392B]/30 border-[#C0392B] text-[#F0EDE8] shadow-[0_8px_32px_0_rgba(192,57,43,0.3)]'
                  : 'bg-[#2C2C2C]/20 border-[#2C2C2C]/50 text-[#F0EDE8] hover:border-[#C0392B] hover:bg-[#C0392B]/10'
              }`}
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
          ))}
        </motion.div>

        <ProductDetail
          product={selectedProduct}
          isOpen={isDetailOpen}
          onClose={handleCloseDetails}
        />
      </div>
    </section>
  );
}