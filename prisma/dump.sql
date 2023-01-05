CREATE TABLE public."Task" (
    "id" text   NOT NULL,
    "name" text   NOT NULL,
    "description" text  NULL,
    "statusId" text   NOT NULL,
    "boardId" text   NOT NULL,
    "userId" text   NOT NULL,
    "estimatedTime" int   NULL,
    "elapsedTime" int   NULL,
    CONSTRAINT "pk_Task" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE public."Status" (
    "id" text   NOT NULL,
    "name" text   NOT NULL,
    "isDefault" boolean   NOT NULL,
    CONSTRAINT "pk_Status" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE public."StatusTask" (
    "id" text   NOT NULL,
    "statusId" text   NOT NULL,
    "boardId" text   NOT NULL,
    CONSTRAINT "pk_StatusTask" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE public."Board" (
    "id" text   NOT NULL,
    "name" text   NOT NULL,
    "description" text NULL,
    "userId" text   NOT NULL,
    "backgroundUrl" text NULL,
    CONSTRAINT "pk_Board" PRIMARY KEY (
        "id"
     )
);

-- Table documentation comment 2
CREATE TABLE public."User" (
    "id" text   NOT NULL,
    "name" text   NOT NULL,
    "email" text   NULL,
    "avatarUrl" text NULL,
    CONSTRAINT "pk_User" PRIMARY KEY (
        "id"
     )
);

ALTER TABLE public."Task" ADD CONSTRAINT "fk_Task_statusId" FOREIGN KEY("statusId")
REFERENCES "StatusTask" ("id");

ALTER TABLE public."Task" ADD CONSTRAINT "fk_Task_boardId" FOREIGN KEY("boardId")
REFERENCES "Board" ("id");

ALTER TABLE public."Task" ADD CONSTRAINT "fk_Task_userId" FOREIGN KEY("userId")
REFERENCES "User" ("id");

ALTER TABLE public."StatusTask" ADD CONSTRAINT "fk_StatusTask_statusId" FOREIGN KEY("statusId")
REFERENCES "Status" ("id");

ALTER TABLE public."StatusTask" ADD CONSTRAINT "fk_StatusTask_boardId" FOREIGN KEY("boardId")
REFERENCES "Board" ("id");

ALTER TABLE public."Board" ADD CONSTRAINT "fk_Board_userId" FOREIGN KEY("userId")
REFERENCES "User" ("id");

CREATE INDEX "idx_Task_name"
ON "Task" ("name");


INSERT INTO public."User"(
	id, name, email, "avatarUrl")
	VALUES ('1', 'Jeremy Auvray', 'jeremy@gmail.com', 'https://www.gravatar.com/avatar/test?d=identicon');

INSERT INTO public."Board"(
	id, name, description, "userId", "backgroundUrl")
	VALUES ('1', 'Board 1', 'This is a description', '1', 'https://images.unsplash.com/photo-1672026231903-cc8a1d49e5a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80');

INSERT INTO public."Status"(
	id, name, "isDefault")
	VALUES ('1', 'To Do', true);

INSERT INTO public."Status"(
	id, name, "isDefault")
	VALUES ('2', 'In Progress', true);

INSERT INTO public."Status"(
	id, name, "isDefault")
	VALUES ('3', 'Done', true);


INSERT INTO public."StatusTask"(
	id, "statusId", "boardId")
	VALUES ('1', '1', '1');

INSERT INTO public."StatusTask"(
	id, "statusId", "boardId")
	VALUES ('2', '2', '1');

INSERT INTO public."StatusTask"(
	id, "statusId", "boardId")
	VALUES ('3', '3', '1');

INSERT INTO public."Task"(
	id, name, description, "statusId", "boardId", "userId", "estimatedTime", "elapsedTime")
	VALUES ('1', 'Task1', 'A Task Description', '1', '1', '1', null, null);


