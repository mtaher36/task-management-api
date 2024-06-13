/*
  Warnings:

  - You are about to drop the column `is_read` on the `tbl_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `notification_type` on the `tbl_notifications` table. All the data in the column will be lost.
  - You are about to alter the column `due_date` on the `tbl_subtasks` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `tbl_subtasks` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `tbl_task_projects` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `tbl_task_sections` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `due_date` on the `tbl_tasks` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `tbl_tasks` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `tbl_users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `otpExpiresAt` on the `tbl_users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `resetTokenExpires` on the `tbl_users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `verificationTokenExpires` on the `tbl_users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `tbl_notifications` DROP COLUMN `is_read`,
    DROP COLUMN `notification_type`;

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
ALTER TABLE `tbl_users` MODIFY `updatedAt` TIMESTAMP NOT NULL,
    MODIFY `otpExpiresAt` DATETIME NULL,
    MODIFY `resetTokenExpires` DATETIME NULL,
    MODIFY `verificationTokenExpires` DATETIME NULL;
