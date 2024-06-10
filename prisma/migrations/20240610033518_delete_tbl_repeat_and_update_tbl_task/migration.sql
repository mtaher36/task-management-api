/*
  Warnings:

  - You are about to alter the column `due_date` on the `tbl_subtasks` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `status` on the `tbl_subtasks` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(5))`.
  - You are about to alter the column `updatedAt` on the `tbl_subtasks` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `tbl_task_projects` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `tbl_task_sections` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `due_date` on the `tbl_tasks` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `status` on the `tbl_tasks` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(5))` to `Enum(EnumId(5))`.
  - You are about to alter the column `updatedAt` on the `tbl_tasks` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `tbl_users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `otpExpiresAt` on the `tbl_users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `resetTokenExpires` on the `tbl_users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `tbl_task_repeats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tbl_task_repeats` DROP FOREIGN KEY `tbl_task_repeats_task_id_fkey`;

-- AlterTable
ALTER TABLE `tbl_subtasks` MODIFY `due_date` DATETIME NULL,
    MODIFY `status` ENUM('InProgress', 'Completed') NOT NULL DEFAULT 'InProgress',
    MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `tbl_task_projects` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `tbl_task_sections` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `tbl_tasks` MODIFY `due_date` DATETIME NULL,
    MODIFY `status` ENUM('InProgress', 'Completed') NOT NULL DEFAULT 'InProgress',
    MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `tbl_users` MODIFY `updatedAt` TIMESTAMP NOT NULL,
    MODIFY `otpExpiresAt` DATETIME NULL,
    MODIFY `resetTokenExpires` DATETIME NULL;

-- DropTable
DROP TABLE `tbl_task_repeats`;
