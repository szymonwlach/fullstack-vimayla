ALTER TABLE "roads" RENAME TO "learning_paths";--> statement-breakpoint
ALTER TABLE "progress" RENAME COLUMN "answered_at" TO "path_id";--> statement-breakpoint
ALTER TABLE "progress" DROP CONSTRAINT "progress_task_id_tasks_id_fk";
--> statement-breakpoint
ALTER TABLE "learning_paths" DROP CONSTRAINT "roads_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "support_prompts" DROP CONSTRAINT "support_prompts_topic_id_topics_id_fk";
--> statement-breakpoint
ALTER TABLE "topics" DROP CONSTRAINT "topics_road_id_roads_id_fk";
--> statement-breakpoint
ALTER TABLE "progress" ALTER COLUMN "task_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "support_prompts" ALTER COLUMN "order" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "order" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "progress" ADD COLUMN "attempts" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "progress" ADD COLUMN "user_answer" jsonb;--> statement-breakpoint
ALTER TABLE "progress" ADD COLUMN "completed_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "learning_paths" ADD COLUMN "form_data" jsonb;--> statement-breakpoint
ALTER TABLE "learning_paths" ADD COLUMN "start_level" text NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_paths" ADD COLUMN "achieve" text NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_paths" ADD COLUMN "learning_time" text NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_paths" ADD COLUMN "preferred_style" text NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_paths" ADD COLUMN "difficulty" text NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_paths" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "learning_paths" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "support_prompts" ADD COLUMN "path_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "support_prompts" ADD COLUMN "answer" text NOT NULL;--> statement-breakpoint
ALTER TABLE "support_prompts" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "task_data" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "points" integer DEFAULT 10;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "path_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "week_number" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "order" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "is_unlocked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "has_free_path" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_path_id_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."learning_paths"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_paths" ADD CONSTRAINT "learning_paths_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_prompts" ADD CONSTRAINT "support_prompts_path_id_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."learning_paths"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_path_id_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."learning_paths"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_prompts" DROP COLUMN "topic_id";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "answer";--> statement-breakpoint
ALTER TABLE "topics" DROP COLUMN "road_id";--> statement-breakpoint
ALTER TABLE "topics" DROP COLUMN "created_by_ai";