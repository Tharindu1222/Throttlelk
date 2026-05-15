import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CATALOG_SEED } from './catalog.seed';
import { Product } from './product.entity';

@Injectable()
export class ProductSeedService implements OnModuleInit {
  private readonly logger = new Logger(ProductSeedService.name);

  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.products.count();
    if (count > 0) {
      return;
    }
    await this.products.save(
      CATALOG_SEED.map((row) => this.products.create(row)),
    );
    this.logger.log(`Seeded ${CATALOG_SEED.length} products`);
  }
}
