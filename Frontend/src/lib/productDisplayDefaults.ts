import type { Product } from '../app/components/CartContext';

/** Storefront defaults when a product omits rich fields (matches legacy ProductDetail copy). */
export const DEFAULT_PRODUCT_DESCRIPTION =
  'Premium quality streetwear hoodie crafted from heavyweight cotton blend. ' +
  'Features oversized fit, reinforced stitching, and a bold design that makes a statement. ' +
  'Perfect for those who refuse to blend in.';

export const DEFAULT_PRODUCT_SPECIFICATIONS: readonly string[] = [
  'Material: 80% Cotton, 20% Polyester',
  'Weight: 400 GSM heavyweight fabric',
  'Fit: Oversized streetwear fit',
  'Origin: Made in Sri Lanka',
  'Care: Machine wash cold, hang dry',
];

export const DEFAULT_PRODUCT_SIZES: readonly string[] = [
  'S',
  'M',
  'L',
  'XL',
  'XXL',
];

export const PRODUCT_LIST_DEFAULTS = {
  description: DEFAULT_PRODUCT_DESCRIPTION,
  specifications: [...DEFAULT_PRODUCT_SPECIFICATIONS],
  sizes: [...DEFAULT_PRODUCT_SIZES],
} as const;

/** Ensures API / legacy payloads include description, specs, and sizes for the storefront. */
export function mergeProductListItem(
  p: Pick<Product, 'id' | 'name' | 'price' | 'category' | 'colors' | 'image'> &
    Partial<Pick<Product, 'description' | 'specifications' | 'sizes'>>,
): Product {
  const desc = p.description?.trim() ?? '';
  return {
    ...PRODUCT_LIST_DEFAULTS,
    ...p,
    description:
      desc.length > 0 ? desc : PRODUCT_LIST_DEFAULTS.description,
    specifications:
      (p.specifications?.length ?? 0) > 0
        ? [...p.specifications!]
        : [...PRODUCT_LIST_DEFAULTS.specifications],
    sizes:
      (p.sizes?.length ?? 0) > 0
        ? [...p.sizes!]
        : [...PRODUCT_LIST_DEFAULTS.sizes],
  };
}
