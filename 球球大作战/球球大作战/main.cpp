#include <stdio.h>
#include <easyx.h>
#include <mmsystem.h>
#pragma comment(lib,"winmm.lib")
#include <math.h>
#define FOOD_NUM 800
#define AI_NUM 25
#define SEPARATION_NUM 8
#define SPIKE_NUM 15
#define WIN_W 1024
#define WIN_H 640
#define MAP_W (WIN_W*4)
#define MAP_H (WIN_H*4)
#define SPORE_NUM 5
struct Ball {
	int x;
	int y;
	COLORREF color;
	int r;
	bool flag;
};
struct Ball food[FOOD_NUM];
struct Ball player;
struct Ball ai[AI_NUM];
struct Ball separation[SEPARATION_NUM];
struct Ball spike[SPIKE_NUM];
struct Ball spore[SPORE_NUM];
IMAGE map(MAP_W, MAP_H);
POINT g_camreaPos;
void gameInit() {
	mciSendString("open ball.mp3", 0, 0, 0);
	mciSendString("play ball.mp3 repeat", 0, 0, 0);
	for (int i = 0; i < FOOD_NUM; i++) {
		food[i].x = rand() % MAP_W;
		food[i].y = rand() % MAP_H;
		food[i].r = rand() % 5 + 1;
		food[i].flag = true;
		food[i].color = RGB(rand() % 256, rand() % 256, rand() % 256);
	}
	player.x = rand() % MAP_W;
	player.y = rand() % MAP_H;
	player.flag = true;
	player.r = 20;
	player.color = GREEN;
	for (int i = 0; i < AI_NUM; i++) {
		ai[i].x = rand() % MAP_W;
		ai[i].y = rand() % MAP_H;
		ai[i].r = rand()%60+1;
		ai[i].flag = true;
		ai[i].color = RGB(rand() % 256, rand() % 256, rand() % 256);
	}
	for (int i = 0; i < SEPARATION_NUM; i++) {
		separation[i].x = rand()% (player.x+40); 
		separation[i].y = rand() % (player.y + 80);
		separation[i].r = rand() % (player.r / 2) + 20;
		separation[i].flag = false;
		separation[i].color= RGB(rand() % 256, rand() % 256, rand() % 256);
	}
	for (int i = 0; i < SPIKE_NUM; i++) {
		spike[i].x = rand() % MAP_W;
		spike[i].y = rand() % MAP_H;
		spike[i].r = 60;
		spike[i].flag = true;
		spike[i].color = WHITE;
	}
	for (int i = 0; i < SPORE_NUM; i++) {
		
			spore[i].x = rand()%player.x;
			spore[i].y = rand()%player.y;
			spore[i].r = 10;
			spore[i].flag = false;
			spore[i].color = RGB(rand() % 256, rand() % 256, rand() % 256);
	
	}

	}

 void gameDraw() {
	SetWorkingImage(&map);
	cleardevice();
	for (int i = 0; i < FOOD_NUM; i++) {
		if (food[i].flag==true) {
			setfillcolor(food[i].color);
			solidcircle(food[i].x, food[i].y, food[i].r);
		}
	}
	setfillcolor(player.color);
	solidcircle(player.x, player.y, player.r);
	for (int i = 0; i < AI_NUM; i++) {
		if (ai[i].flag == true) {
			setfillcolor(ai[i].color);
			solidcircle(ai[i].x, ai[i].y, ai[i].r);
			outtextxy(ai[i].x - 20, ai[i].y + 10, "鸽鸽");
		}
	}
	for (int i = 0; i < SEPARATION_NUM; i++) {
		if (separation[i].flag == true) {
			setfillcolor(separation[i].color);
			solidcircle(separation[i].x, separation[i].y, separation[i].r);
			outtextxy(separation[i].x - 40, separation[i].y + 10, "有种你吃我");
		}
	}
	for (int i = 0; i < SPIKE_NUM; i++) {
		if (spike[i].flag == true) {
			setfillcolor(spike[i].color);
			solidcircle(spike[i].x, spike[i].y, spike[i].r);
			outtextxy(spike[i].x - 40, spike[i].y + 5, "百因必有果");
		}
		
	}
	for (int i = 0; i < SPORE_NUM; i++) {
		if (spore[i].flag == true) {
			setfillcolor(spore[i].color);
			solidcircle(spore[i].x, spore[i].y, spore[i].r);
			outtextxy(spore[i].x - 30, spore[i].y + 10, "奥力给");
		}
	}
	setbkmode(TRANSPARENT);
	settextstyle(20, 0, "黑体");
	outtextxy(player.x -40, player.y + 10, "有种你吃我");
	settextcolor(RED);
	SetWorkingImage();
	putimage(0, 0,WIN_W,WIN_H, &map,g_camreaPos.x,g_camreaPos.y);
	{
		g_camreaPos.x = player.x - WIN_W / 2;
		g_camreaPos.y = player.y - WIN_H / 2;
		if (g_camreaPos.x < 0) g_camreaPos.x = 0;
		if (g_camreaPos.y < 0) g_camreaPos.y = 0;
		if (g_camreaPos.x > MAP_W - WIN_W) g_camreaPos.x = MAP_W - WIN_W;
		if (g_camreaPos.y > MAP_H - WIN_H) g_camreaPos.y = MAP_H - WIN_H;
	}
}

 void createSeparation() {
	 for (int i = 0; i < SEPARATION_NUM; i++) {
		 if (GetAsyncKeyState(VK_SPACE)) {
			 separation[i].flag = true;
		 }
}
 }
 void createSpore() {
	 for (int i = 0; i < SPORE_NUM; i++) {
		 if (GetAsyncKeyState(VK_SHIFT)) {
			 spore[i].flag = true;
		 }
	 }
 }
 
void playerMove(int speed) {
	
	if (GetAsyncKeyState(VK_UP) ){
		player.y -= speed;

	}
	if (GetAsyncKeyState(VK_DOWN)) {
		player.y += speed;

	}
	if (GetAsyncKeyState(VK_LEFT)) {
		player.x -= speed;

	}
	if (GetAsyncKeyState(VK_RIGHT)) {
		player.x += speed;

	}
}
void separationMove(int speed) {
	for (int i = 0; i < SEPARATION_NUM; i++) {
		if (GetAsyncKeyState(VK_UP)) {
			separation[i].y -= speed;

		}
		if (GetAsyncKeyState(VK_DOWN)) {
			separation[i].y += speed;

		}
		if (GetAsyncKeyState(VK_LEFT)) {
			separation[i].x -= speed;

		}
		if (GetAsyncKeyState(VK_RIGHT)) {
			separation[i].x += speed;

		}
	}
}


double distance(struct Ball b1, struct Ball b2) {
	return sqrt((b1.x - b2.x) * (b1.x - b2.x) + (b1.y - b2.y) * (b1.y - b2.y));
	
}
void sporeReborn() {
	for (int i = 0; i < SPORE_NUM; i++) {
		if (distance(player, spore[i]) >player.r * 4 && spore[i].flag == true) {
			spore[i].x =  player.x+40;
			spore[i].y = rand() % (player.y+20);
		}
	}
}
void playerShrink() {
	if (GetAsyncKeyState(VK_SPACE)) {
		player.r = player.r / 2 + 20;
	}
	if (GetAsyncKeyState(VK_SHIFT)) {
		player.r = player.r / 2 + 20;
	}
	for (int i = 0; i < SPIKE_NUM; i++) {
		for (int j = 0; j < SEPARATION_NUM; j++) {
			if (distance(player, spike[i]) < player.r && spike[i].flag == true) {
				spike[i].flag = false;
				player.r = player.r / 2 + 20;
				separation[j].flag = true;
			}
			if (!spike[i].flag) {
				spike[i].x = rand() % MAP_W;
				spike[i].y = rand() % MAP_H;
				spike[i].r = 60;
				spike[i].flag = true;
				spike[i].color = WHITE;
			}
		}
	}
}
void separationShrink() {
	for (int i = 0; i < SEPARATION_NUM; i++) {
		for (int j = 0; j < SPIKE_NUM; j++) {
			if (distance(separation[i], spike[j]) < separation[i].r && separation[i].flag == true && spike[j].flag == true) {
				spike[j].flag = false;
				separation[i].r = separation[i].r / 2 + 20;
			}
			if (!spike[j].flag) {
				spike[j].x = rand() % MAP_W;
				spike[j].y = rand() % MAP_H;
				spike[j].r = 60;
				spike[j].flag = true;
				spike[j].color = WHITE;
			}
		}
	}
}
void eatFood() {
	for (int i = 0; i < FOOD_NUM ; i++) {
		if (distance(player, food[i] )<player.r && food[i].flag==true) {
			food[i].flag = false;
			player.r += food[i].r/4;
		}
		for (int j = 0; j < AI_NUM; j++) {
			if (distance(ai[j], food[i]) < ai[j].r && food[i].flag == true) {
				food[i].flag = false;
				ai[j].r += food[i].r / 4;
			}
		}
		for (int a = 0; a < SEPARATION_NUM; a++) {
			if (distance(separation[a], food[i]) < separation[a].r && food[i].flag == true && separation[a].flag == true) {
				food[i].flag = false;
				separation[a].r += food[i].r / 4;
			}
		}
		if (!food[i].flag) {
			
				food[i].x = rand() % MAP_W;
				food[i].y = rand() % MAP_H;
				food[i].r = rand() % 5 + 1;
				food[i].flag = true;
				food[i].color = RGB(rand() % 256, rand() % 256, rand() % 256);
			
			
		}
	}
}
void eatAi() {
	for (int i = 0; i < AI_NUM; i++) {
		if (distance(player, ai[i]) < player.r && ai[i].flag == true) {
			ai[i].flag = false;
			player.r += ai[i].r / 4;
		}
		for (int a = 0; a < SEPARATION_NUM; a++) {
			if (distance(separation[a], ai[i]) < separation[a].r && ai[i].flag == true && separation[a].flag == true) {
				ai[i].flag = false;
				separation[a].r += ai[i].r / 4;
			}
		}
		if (!ai[i].flag) {
			ai[i].x = rand() % MAP_W;
			ai[i].y = rand() % MAP_H;
			ai[i].r = rand() % 60 + 1;
			ai[i].flag = true;
			ai[i].color = RGB(rand() % 256, rand() % 256, rand() % 256);
		}
	}
	
}
void eatPlayer() {
	for (int i = 0; i < AI_NUM; i++) {
		if (distance(ai[i], player) < ai[i].r && ai[i].flag == true && player.flag == true) {
			player.flag = false;
			ai[i].r = player.r / 4;
		}
		if (!player.flag) {
			player.x = rand() % MAP_W;
			player.y = rand() % MAP_H;
			player.flag = true;
			player.r = 20;
			player.color = GREEN;
		}
	}
}
void eatSeparation() {
	for (int i = 0; i < AI_NUM; i++) {
		for (int j = 0; j < SEPARATION_NUM; j++) {
			if (distance(ai[i], separation[j]) < ai[i].r && ai[i].flag == true && separation[j].flag == true) {
				separation[j].flag = false;
				ai[i].r = separation[j].r / 4;
			}
		}
	}
}
void eatSpore() {
	for (int i = 0; i < SPORE_NUM; i++) {
		if (distance(player, spore[i]) < player.r && spore[i].flag == true) {
			spore[i].flag = false;
			player.r += spore[i].r / 4;
		}
		for (int j = 0; j < SEPARATION_NUM; j++) {
			if (distance(separation[j], spore[i]) < separation[j].r && separation[j].flag == true && spore[i].flag == true) {
				spore[i].flag = false;
				separation[j].r += spore[i].r / 10;
			}
		}
		for (int a = 0; a<AI_NUM; a++) {
			if (distance(ai[a], spore[i]) < ai[a].r && spore[i].flag == true) {
				spore[i].flag = false;
				ai[a].r = spore[i].r ;
			}
		}
	}
}

void aiMove(int speed) {
	if (GetAsyncKeyState(VK_UP)) {
		player.y -= speed;

	}
	if (GetAsyncKeyState(VK_DOWN)) {
		player.y += speed;

	}
	if (GetAsyncKeyState(VK_LEFT)) {
		player.x -= speed;

	}
	if (GetAsyncKeyState(VK_RIGHT)) {
		player.x += speed;

	}
	for (int i = 0; i < AI_NUM; i++) {
		if (player.x < ai[i].x) {
			ai[i].x += speed;
		}
		if (player.x > ai[i].x) {
			ai[i].x -= speed;
		}
		if (player.y < ai[i].y) {
			ai[i].y += speed;
		}
		if (player.y > ai[i].y) {
			ai[i].y -= speed;
		}
		if (ai[i].x < 0) ai[i].x = rand() % MAP_W;
		if (ai[i].y < 0) ai[i].y = rand() % MAP_H;
		if (ai[i].x > MAP_W - WIN_W) ai[i].x = rand() % MAP_W;
		if (ai[i].y > MAP_H - WIN_H) ai[i].y = rand() % MAP_H;
	}
}
int main() {
	initgraph(1024, 640);
	setbkcolor(WHITE);
	cleardevice();
	gameInit();
	while (1) {
		BeginBatchDraw();
		gameDraw();
		EndBatchDraw();
		playerMove(1);
		aiMove(1);
		separationMove(3);
		Sleep(5);
		eatFood();
		eatAi();
		eatPlayer();
		eatSeparation();
		eatSpore();
		createSeparation();
		playerShrink();
		separationShrink();
		createSpore();
		sporeReborn();
	}
	while (1);
	return 0;
}