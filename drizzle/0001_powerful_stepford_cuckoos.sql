ALTER TABLE `webhooks` ADD `webhook_id` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `webhooks_webhook_id_unique` ON `webhooks` (`webhook_id`);--> statement-breakpoint
ALTER TABLE `webhooks` DROP COLUMN `channel`;