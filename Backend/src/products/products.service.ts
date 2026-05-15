import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

export type ProductUpsertFields = Pick<
  Product,
  'name' | 'price' | 'category' | 'colors' | 'image'
>;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.products.find({ order: { id: 'ASC' } });
  }

  findOne(id: string): Promise<Product | null> {
    return this.products.findOne({ where: { id } });
  }

  create(data: ProductUpsertFields): Promise<Product> {
    const id = randomUUID();
    return this.products.save(this.products.create({ id, ...data }));
  }

  async update(
    id: string,
    patch: Partial<ProductUpsertFields>,
  ): Promise<Product | null> {
    const existing = await this.findOne(id);
    if (!existing) {
      return null;
    }
    Object.assign(existing, patch);
    return this.products.save(existing);
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.products.delete({ id });
    return (res.affected ?? 0) > 0;
  }
}
