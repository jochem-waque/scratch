CREATE TABLE `webhooks` (
	`id` integer PRIMARY KEY NOT NULL,
	`guild` text NOT NULL,
	`channel` text NOT NULL,
	`category` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `webhooks_guild_category_unique` ON `webhooks` (`guild`,`category`);