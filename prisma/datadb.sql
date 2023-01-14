INSERT INTO "User" ("id","name","email","emailVerified","password","image") VALUES
 (1,'gshah2020','gaurang.r.shah@gmail.com',CURRENT_TIMESTAMP,'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','https://avatars.githubusercontent.com/u/1086269?v=4'),
 (14,'john','joe@example.com',CURRENT_TIMESTAMP,'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','/'),
 (15,'alvaro','giles.grant72@ethereal.email',CURRENT_TIMESTAMP,'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',NULL);

INSERT INTO "Board"(
	id, name, description, "userId", "backgroundUrl")
	VALUES ('1', 'Board 1', 'This is a description', '1', 'https://images.unsplash.com/photo-1672026231903-cc8a1d49e5a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80');

INSERT INTO "Status"(
	id, name, "isDefault")
	VALUES ('1', 'To Do', true);

INSERT INTO "Status"(
	id, name, "isDefault")
	VALUES ('2', 'In Progress', true);

INSERT INTO "Status"(
	id, name, "isDefault")
	VALUES ('3', 'Done', true);

INSERT INTO "StatusTask"(
	id, "statusId", "boardId")
	VALUES ('1', '1', '1');

INSERT INTO "StatusTask"(
	id, "statusId", "boardId")
	VALUES ('2', '2', '1');

INSERT INTO "StatusTask"(
	id, "statusId", "boardId")
	VALUES ('3', '3', '1');

INSERT INTO "Task"(
	id, name, description, "statusId", "boardId", "userId", "estimatedTime", "elapsedTime")
	VALUES ('1', 'Task1', 'A Task Description', '1', '1', '1', null, null);
