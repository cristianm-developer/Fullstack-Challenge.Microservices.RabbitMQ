import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763485494965 implements MigrationInterface {
    name = 'Migration1763485494965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "content" text NOT NULL, "taskId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rel_user_task" ("id" SERIAL NOT NULL, "taskId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e8a7c38f1536bcb92c410f9929e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."task_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT')`);
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "title" character varying(255) NOT NULL, "description" text, "deadline" date, "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'MEDIUM', "status" "public"."task_status_enum" NOT NULL DEFAULT 'TODO', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_log" ("id" SERIAL NOT NULL, "taskId" integer NOT NULL, "userId" integer NOT NULL, "change" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0f80f57bb78387f37ef146434b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rel_user_task" ADD CONSTRAINT "FK_5972bf9cd786288967ceceaf357" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_log" ADD CONSTRAINT "FK_1142dfec452e924b346f060fdaa" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_log" DROP CONSTRAINT "FK_1142dfec452e924b346f060fdaa"`);
        await queryRunner.query(`ALTER TABLE "rel_user_task" DROP CONSTRAINT "FK_5972bf9cd786288967ceceaf357"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95"`);
        await queryRunner.query(`DROP TABLE "task_log"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
        await queryRunner.query(`DROP TABLE "rel_user_task"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
