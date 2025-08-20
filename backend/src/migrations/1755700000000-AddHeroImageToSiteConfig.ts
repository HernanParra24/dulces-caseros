import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHeroImageToSiteConfig1755700000000 implements MigrationInterface {
  name = 'AddHeroImageToSiteConfig1755700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "site_config" 
      ADD COLUMN "heroImageUrl" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "site_config" 
      DROP COLUMN "heroImageUrl"
    `);
  }
}
