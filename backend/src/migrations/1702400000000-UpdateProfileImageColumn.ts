import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProfileImageColumn1702400000000 implements MigrationInterface {
    name = 'UpdateProfileImageColumn1702400000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profileImage" TYPE text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profileImage" TYPE character varying(255)`);
    }
}
