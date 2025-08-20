import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpcomingProductsTable1755700000001 implements MigrationInterface {
  name = 'AddUpcomingProductsTable1755700000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "upcoming_products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "description" text,
        "imageUrl" character varying(500),
        "category" character varying(100),
        "isActive" boolean NOT NULL DEFAULT true,
        "estimatedReleaseMonth" integer,
        "estimatedReleaseYear" integer,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_upcoming_products" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "upcoming_products"`);
  }
}
