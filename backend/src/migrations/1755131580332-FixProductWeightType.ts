import { MigrationInterface, QueryRunner } from "typeorm";

export class FixProductWeightType1755131580332 implements MigrationInterface {
    name = 'FixProductWeightType1755131580332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "weight" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "weight" integer NOT NULL DEFAULT '0'`);
    }

}
