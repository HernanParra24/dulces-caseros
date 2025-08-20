import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('site_config')
export class SiteConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, default: 'Dulce Twilight' })
  storeName: string;

  @Column({ type: 'varchar', length: 255, default: 'dulcetwilightdc2609@gmail.com' })
  storeEmail: string;

  @Column({ type: 'varchar', length: 50, default: '+54 9 261 123-4567' })
  storePhone: string;

  @Column({ type: 'varchar', length: 255, default: 'Mendoza, Argentina' })
  storeAddress: string;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({ type: 'varchar', length: 100, default: 'America/Argentina/Mendoza' })
  timezone: string;

  @Column({ type: 'text', nullable: true })
  logoUrl: string;

  @Column({ type: 'text', nullable: true })
  heroImageUrl: string;

  @Column({ type: 'boolean', default: false })
  maintenanceMode: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
