import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DEFAULT_PRODUCT_DESCRIPTION,
  DEFAULT_PRODUCT_SPECIFICATIONS,
  DEFAULT_PRODUCT_SIZES,
} from './product-defaults';
import { Product } from './product.entity';

export type ProductUpsertFields = Pick<
  Product,
  | 'name'
  | 'price'
  | 'category'
  | 'colors'
  | 'image'
  | 'description'
  | 'specifications'
  | 'sizes'
>;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  private normalize(p: Product): Product {
    return {
      ...p,
      description:
        typeof p.description === 'string' && p.description.trim().length > 0
          ? p.description
          : DEFAULT_PRODUCT_DESCRIPTION,
      specifications:
        Array.isArray(p.specifications) && p.specifications.length > 0
          ? p.specifications
          : [...DEFAULT_PRODUCT_SPECIFICATIONS],
      sizes:
        Array.isArray(p.sizes) && p.sizes.length > 0
          ? p.sizes
          : [...DEFAULT_PRODUCT_SIZES],
    };
  }

  findAll(): Promise<Product[]> {
    return this.products
      .find({ order: { id: 'ASC' } })
      .then((rows) => rows.map((r) => this.normalize(r)));
  }

  async findOne(id: string): Promise<Product | null> {
    const row = await this.products.findOne({ where: { id } });
    return row ? this.normalize(row) : null;
  }

  create(data: Partial<ProductUpsertFields>): Promise<Product> {
    const id = randomUUID();
    const description = (data.description ?? '').trim();
    const specifications =
      (data.specifications?.length ?? 0) > 0
        ? data.specifications!
        : [...DEFAULT_PRODUCT_SPECIFICATIONS];
    const sizes =
      (data.sizes?.length ?? 0) > 0 ? data.sizes! : [...DEFAULT_PRODUCT_SIZES];

    const row = this.products.create({
      id,
      name: data.name!,
      price: data.price!,
      category: data.category!,
      colors: data.colors!,
      image: data.image!,
      description:
        description.length > 0 ? description : DEFAULT_PRODUCT_DESCRIPTION,
      specifications,
      sizes,
    });
    return this.products.save(row).then((saved) => this.normalize(saved));
  }

  async update(
    id: string,
    patch: Partial<ProductUpsertFields>,
  ): Promise<Product | null> {
    const existing = await this.products.findOne({ where: { id } });
    if (!existing) {
      return null;
    }
    Object.assign(existing, patch);
    if (patch.description !== undefined) {
      const d = (patch.description ?? '').trim();
      existing.description =
        d.length > 0 ? d : DEFAULT_PRODUCT_DESCRIPTION;
    }
    if (patch.specifications !== undefined) {
      const specs = patch.specifications ?? [];
      existing.specifications =
        specs.length > 0 ? specs : [...DEFAULT_PRODUCT_SPECIFICATIONS];
    }
    if (patch.sizes !== undefined) {
      const sz = patch.sizes ?? [];
      existing.sizes =
        sz.length > 0 ? sz : [...DEFAULT_PRODUCT_SIZES];
    }
    const saved = await this.products.save(existing);
    return this.normalize(saved);
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.products.delete({ id });
    return (res.affected ?? 0) > 0;
  }
}
