INSERT INTO "User" ("id","name","email","emailVerified","password","image") VALUES
 (1,'gshah2020','gaurang.r.shah@gmail.com',CURRENT_TIMESTAMP,'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','https://avatars.githubusercontent.com/u/1086269?v=4'),
 (14,'john','joe@example.com',CURRENT_TIMESTAMP,'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','/'),
 (15,'alvaro','giles.grant72@ethereal.email',CURRENT_TIMESTAMP,'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',NULL);

INSERT INTO "Account"
    ("id","userId","type", "provider","providerAccountId","refresh_token","access_token") VALUES
    (6,14,'oauth','github','1086269','bb719cdebe0aea553c5784a2515c546335c1194f','bb719cdebe0aea553c5784a2515c546335c1194f');

INSERT INTO "Session"
("id","userId","expires","sessionToken","accessToken") VALUES
 (9,15,CURRENT_TIMESTAMP,'6451d9dc60435e81219562449cfe21e45dbdc8a540161ea3490a896ff2a781d4','8ace199e3466f6c4d2f7431e06be372600ca96c5c544525760e0e545cb73b4ef'),
 (10,15,CURRENT_TIMESTAMP,'fa1081470e22bbfa248dec67429f0c27addc123b19f121459778a8922db77902','76118e46696e18be07087d36730269679f6f5e249e81ac5f0ca46f6d7a103111');

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

