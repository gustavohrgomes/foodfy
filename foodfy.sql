DROP TABLE IF EXISTS "recipes";
DROP TABLE IF EXISTS "chefs";
DROP TABLE IF EXISTS "files";
DROP TABLE IF EXISTS "recipe_files";

CREATE TABLE "recipes" (
  id SERIAL PRIMARY KEY,
  chef_id INT,
  user_id INT,
  title TEXT,
  ingredients TEXT[],
  preparation TEXT[],
  information TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE "chefs" (
  id SERIAL PRIMARY KEY NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" int ,
  "file_id" int
);

CREATE TABLE "users" (
	"id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "reset_token" TEXT,
  "reset_token_expires" TEXT,
  "is_admin" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT(NOW()),
  "updated_at" TIMESTAMP DEFAULT(NOW())
);

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id")
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id")

ALTER TABLE "chefs" DROP COLUMN "avatar_url";
ALTER TABLE "chefs" ADD COLUMN "file_id" INTEGER REFERENCES "files" ("id");

/* TRIGGERS & PROCEDURES */
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

/* Connect Pg Simple */
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

/* SQL CASCADE ON DELETE */
ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_recipe_id_fkey,
ADD CONSTRAINT recipe_files_recipe_id_fkey
FOREIGN KEY (recipe_id) 
REFERENCES recipes (id)
ON DELETE CASCADE

ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_file_id_fkey,
ADD CONSTRAINT recipe_files_file_id_fkey
FOREIGN KEY (file_id) 
REFERENCES files(id)
ON DELETE CASCADE

ALTER TABLE "chefs"
DROP CONSTRAINT chefs_file_id_fkey,
ADD CONSTRAINT chefs_file_id_fkey
FOREIGN KEY (file_id) 
REFERENCES files(id)
ON DELETE CASCADE