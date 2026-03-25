CREATE TABLE "urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"visits" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "urls_short_code_unique" UNIQUE("short_code")
);
