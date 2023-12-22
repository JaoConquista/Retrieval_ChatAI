import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class User1703161396036 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users_admin",
        columns: [
            {
                name: "is_admin",
                type: "string",
                isPrimary: true
            }
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users_admin");
  }
}
