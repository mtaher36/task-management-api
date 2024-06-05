/*
  Warnings:

  - You are about to alter the column `due_date` on the `tbl_subtasks` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `tbl_subtasks` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `tbl_task_projects` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `tbl_task_sections` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `due_date` on the `tbl_tasks` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `tbl_tasks` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `tbl_users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `tbl_subtasks` MODIFY `due_date` DATETIME NULL,
    MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `tbl_task_projects` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `tbl_task_sections` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `tbl_tasks` MODIFY `due_date` DATETIME NULL,
    MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `tbl_users` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `otp` VARCHAR(6) NULL,
    ADD COLUMN `otpExpiresAt` DATETIME NULL,
    MODIFY `updatedAt` TIMESTAMP NOT NULL;
