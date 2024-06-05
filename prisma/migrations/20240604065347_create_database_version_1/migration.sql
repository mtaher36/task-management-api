-- CreateTable
CREATE TABLE `tbl_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `tbl_roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `profileImage` VARCHAR(100) NULL,
    `role_id` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP NOT NULL,

    UNIQUE INDEX `tbl_users_username_key`(`username`),
    UNIQUE INDEX `tbl_users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NOT NULL,
    `section_id` INTEGER NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `due_date` DATETIME NULL,
    `priority` ENUM('Low', 'Medium', 'High') NOT NULL,
    `status` ENUM('Pending', 'InProgress', 'Completed') NOT NULL DEFAULT 'Pending',
    `is_recurring` BOOLEAN NOT NULL DEFAULT false,
    `recurrence_interval` ENUM('Daily', 'Weekly', 'Monthly', 'Yearly') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_task_projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `owner_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_task_sections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_task_assignments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `task_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `assigned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `task_id` INTEGER NOT NULL,
    `notification_type` ENUM('InApp', 'Email') NOT NULL,
    `message` TEXT NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_task_comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `task_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `comment` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_subtasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `task_id` INTEGER NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `due_date` DATETIME NULL,
    `priority` ENUM('Low', 'Medium', 'High') NOT NULL,
    `status` ENUM('Pending', 'InProgress', 'Completed') NOT NULL DEFAULT 'Pending',
    `is_recurring` BOOLEAN NOT NULL DEFAULT false,
    `recurrence_interval` ENUM('Daily', 'Weekly', 'Monthly', 'Yearly') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `task_id` INTEGER NOT NULL,
    `file_url` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_task_repeats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `task_id` INTEGER NOT NULL,
    `repeat_date` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_task_project_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `role` ENUM('Owner', 'Member') NOT NULL,
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_users` ADD CONSTRAINT `tbl_users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `tbl_roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_tasks` ADD CONSTRAINT `tbl_tasks_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `tbl_task_projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_tasks` ADD CONSTRAINT `tbl_tasks_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `tbl_task_sections`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_task_projects` ADD CONSTRAINT `tbl_task_projects_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `tbl_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_task_sections` ADD CONSTRAINT `tbl_task_sections_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `tbl_task_projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_task_assignments` ADD CONSTRAINT `tbl_task_assignments_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `tbl_tasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_task_assignments` ADD CONSTRAINT `tbl_task_assignments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_notifications` ADD CONSTRAINT `tbl_notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_notifications` ADD CONSTRAINT `tbl_notifications_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `tbl_tasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_task_comments` ADD CONSTRAINT `tbl_task_comments_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `tbl_tasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_task_comments` ADD CONSTRAINT `tbl_task_comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_subtasks` ADD CONSTRAINT `tbl_subtasks_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `tbl_tasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_files` ADD CONSTRAINT `tbl_files_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `tbl_tasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_task_repeats` ADD CONSTRAINT `tbl_task_repeats_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `tbl_tasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_task_project_members` ADD CONSTRAINT `tbl_task_project_members_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `tbl_task_projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_task_project_members` ADD CONSTRAINT `tbl_task_project_members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
