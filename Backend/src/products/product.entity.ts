import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int', unsigned: true })
  price: number;

  @Column({ type: 'varchar', length: 128 })
  category: string;

  @Column({ type: 'json' })
  colors: string[];

  @Column({ type: 'text' })
  image: string;
}
