// 游戏主逻辑模块
// 包含游戏核心逻辑、对象管理和游戏循环

// 游戏常量 - 精确匹配原版
const FOOD_NUM = 800;
const AI_NUM = 20;
const SEPARATION_NUM = 6;
const SPIKE_NUM = 12;
const SPORE_NUM = 5;
const RAIN_NUM = 128;
const BLACKHOLE_NUM = 8;

const WIN_W = 1024;
const WIN_H = 640;
const MAP_W = WIN_W * 4;
const MAP_H = WIN_H * 4;
const STR_NUM = 20;

// 游戏对象结构体 - 匹配原版
let food = [];
let player = {};
let ai = [];
let separation = [];
let spike = [];
let spore = [];
let blackhole = [];
let rain = [];

// 相机位置 - 匹配原版 g_camreaPos
let g_camreaPos = { x: 0, y: 0 };

// 输入状态
let gameStarted = false;

// 游戏统计
let gameStats = {
    score: 0
};

// 初始化游戏
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // 创建虚拟世界地图画布
    worldCanvas = document.createElement('canvas');
    worldCanvas.width = MAP_W;
    worldCanvas.height = MAP_H;
    worldCtx = worldCanvas.getContext('2d');

    // 初始化UI管理器
    uiManager = new UIManager();

    // 初始化音频系统
    initAudio();

    // 初始化随机种子
    Math.randomSeed = Date.now();

    // 初始化游戏对象
    gameInit();

    // 初始化雨滴
    for (let i = 0; i < RAIN_NUM; i++) {
        initRain(i);
    }

    // 设置输入监听
    setupInput();

    // 显示开始屏幕
    showStartScreen();

    // 开始游戏循环
    gameLoop();
}

// 游戏初始化 - 匹配原版 gameInit()
function gameInit() {
    // 初始化食物
    for (let i = 0; i < FOOD_NUM; i++) {
        food[i] = {
            x: Math.random() * MAP_W,
            y: Math.random() * MAP_H,
            r: Math.random() * 5 + 1,
            flag: true,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        };
    }

    // 初始化玩家
    player = {
        x: Math.random() * MAP_W,
        y: Math.random() * MAP_H,
        r: 20,
        flag: true,
        color: 0x00FF00 // RGB(0, 255, 0)
    };

    // 初始化AI
    for (let i = 0; i < AI_NUM; i++) {
        ai[i] = {
            x: Math.random() * MAP_W,
            y: Math.random() * MAP_H,
            r: Math.random() * 60 + 1,
            flag: true,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        };
    }

    // 初始化分离体 - 匹配原版逻辑
    for (let i = 0; i < SEPARATION_NUM; i++) {
        separation[i] = {
            x: player.x + Math.random() * 40, // 在玩家附近
            y: player.y + Math.random() * 80, // 在玩家附近
            r: Math.random() * (player.r / 2) + 20,
            flag: false, // 初始化为false，不显示
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        };
    }

    // 初始化刺球
    for (let i = 0; i < SPIKE_NUM; i++) {
        spike[i] = {
            x: Math.random() * MAP_W,
            y: Math.random() * MAP_H,
            r: 60,
            flag: true,
            color: 0xFFFFFF // RGB(255, 255, 255)
        };
    }

    // 初始化孢子 - 匹配原版逻辑
    for (let i = 0; i < SPORE_NUM; i++) {
        spore[i] = {
            x: Math.random() * player.x,
            y: Math.random() * player.y,
            r: 10,
            flag: false, // 初始化为false，不显示
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        };
    }

    // 初始化黑洞
    for (let i = 0; i < BLACKHOLE_NUM; i++) {
        blackhole[i] = {
            x: Math.random() * MAP_W,
            y: Math.random() * MAP_H,
            r: 60,
            flag: true,
            color: 0xFF0000 // RGB(255, 0, 0)
        };
    }
}

// 初始化雨滴
function initRain(i) {
    rain[i] = {
        x: i * 15,
        y: Math.random() * WIN_H,
        speed: Math.random() * 3 + 1,
        str: createStr(STR_NUM)
    };
}

// 创建随机字符串
function createStr(len) {
    let str = '';
    for (let i = 0; i < len; i++) {
        const rand = Math.random() * 3 | 0;
        switch (rand) {
            case 0: str += String.fromCharCode(65 + Math.random() * 26 | 0); break;
            case 1: str += String.fromCharCode(97 + Math.random() * 26 | 0); break;
            case 2: str += String.fromCharCode(48 + Math.random() * 10 | 0); break;
        }
    }
    return str;
}

// 游戏主循环 - 精确匹配原版
function gameLoop() {
    if (!gameStarted) {
        showStartScreen();
    } else {
        // 渲染雨滴特效（直接在屏幕上）
        renderRain();

        // 渲染游戏世界
        gameDraw();

        // 更新游戏逻辑 - 按照原版main()函数的调用顺序
        playerMove(1);
        aiMove(0.7);
        separationMove(3);

        // 碰撞检测
        eatFood();
        eatAi();
        eatPlayer();
        eatSeparation();
        eatSpore();

        // 功能调用
        createSeparation(); // 空格键创建分离体
        playerShrink();
        separationShrink();
        createSpore(); // Shift键创建孢子
        sporeReborn();
        combine(); // Ctrl键合并分离体

        // 颜色变化
        playerDiscolour();
        aiDiscolour();

        // 音乐切换
        changeSong();

        // 更新UI
        updateUI();
    }

    // 请求下一帧
    requestAnimationFrame(gameLoop);
}

// 玩家移动 - 精确匹配原版
function playerMove(speed) {
    if (keys['ArrowUp'] || keys['KeyW']) {
        player.y -= speed;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
        player.y += speed;
    }
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.x -= speed;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        player.x += speed;
    }

    // 边界检查
    if (player.x < player.r) player.x = player.r;
    if (player.y < player.r) player.y = player.r;
    if (player.x > MAP_W - player.r) player.x = MAP_W - player.r;
    if (player.y > MAP_H - player.r) player.y = MAP_H - player.r;
}

// 分离体移动
function separationMove(speed) {
    for (let i = 0; i < SEPARATION_NUM; i++) {
        if (keys['ArrowUp'] || keys['KeyW']) {
            separation[i].y -= speed;
        }
        if (keys['ArrowDown'] || keys['KeyS']) {
            separation[i].y += speed;
        }
        if (keys['ArrowLeft'] || keys['KeyA']) {
            separation[i].x -= speed;
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            separation[i].x += speed;
        }
    }
}

// AI移动 - 修复为原版逻辑：AI只在玩家移动时才移动，而且方向错误（远离玩家）
function aiMove(speed) {
    // 只有当玩家正在移动时，AI才移动
    const isPlayerMoving = keys['ArrowUp'] || keys['KeyW'] || keys['ArrowDown'] || keys['KeyS'] ||
                          keys['ArrowLeft'] || keys['KeyA'] || keys['ArrowRight'] || keys['KeyD'];

    if (isPlayerMoving) {
        for (let i = 0; i < AI_NUM; i++) {
            // 原版AI逻辑：AI会远离玩家
            // 添加一些随机性，让AI不总是完美地远离玩家
            const randomFactor = 0.8 + Math.random() * 0.4; // 0.8-1.2的随机因子

            if (player.x < ai[i].x) {
                ai[i].x += speed * randomFactor;  // 玩家在左边，AI向右移动（远离）
            }
            if (player.x > ai[i].x) {
                ai[i].x -= speed * randomFactor;  // 玩家在右边，AI向左移动（远离）
            }
            if (player.y < ai[i].y) {
                ai[i].y += speed * randomFactor;  // 玩家在上边，AI向下移动（远离）
            }
            if (player.y > ai[i].y) {
                ai[i].y -= speed * randomFactor;  // 玩家在下边，AI向上移动（远离）
            }

            // AI边界检查 - 超出边界时重新生成
            if (ai[i].x < 0 || ai[i].y < 0 || ai[i].x > MAP_W || ai[i].y > MAP_H) {
                ai[i].x = Math.random() * MAP_W;
                ai[i].y = Math.random() * MAP_H;
            }
        }
    }
}

// 吃食物逻辑
function eatFood() {
    for (let i = 0; i < FOOD_NUM; i++) {
        if (!food[i].flag) continue;

        // 玩家吃食物
        if (distance(player, food[i]) < player.r && food[i].flag) {
            food[i].flag = false;
            const oldRadius = player.r;
            player.r = Math.min(player.r + food[i].r / 4, 150); // 限制最大半径为150

            // 如果达到最大半径，停止增加分数
            if (player.r > oldRadius) {
                gameStats.score += Math.floor(food[i].r);
            }
        }

        // AI吃食物
        for (let j = 0; j < AI_NUM; j++) {
            if (distance(ai[j], food[i]) < ai[j].r && food[i].flag) {
                food[i].flag = false;
                ai[j].r += food[i].r / 4;
            }
        }

        // 重新生成食物
        if (!food[i].flag) {
            food[i].x = Math.random() * MAP_W;
            food[i].y = Math.random() * MAP_H;
            food[i].r = Math.random() * 5 + 1;
            food[i].flag = true;
            food[i].color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        }
    }
}

// 吃AI逻辑
function eatAi() {
    for (let i = 0; i < AI_NUM; i++) {
        if (!ai[i].flag) continue;

        // 玩家吃AI
        if (distance(player, ai[i]) < player.r && ai[i].flag && player.r > ai[i].r * 1.1) {
            ai[i].flag = false;
            player.r = Math.min(player.r + ai[i].r / 4, 150); // 限制最大半径为150
            gameStats.score += Math.floor(ai[i].r * 2); // AI分数更高
        }

        // 重新生成AI
        if (!ai[i].flag) {
            ai[i].x = Math.random() * MAP_W;
            ai[i].y = Math.random() * MAP_H;
            ai[i].r = Math.random() * 60 + 1;
            ai[i].flag = true;
            ai[i].color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        }
    }
}

// AI吃玩家逻辑
function eatPlayer() {
    for (let i = 0; i < AI_NUM; i++) {
        if (distance(ai[i], player) < ai[i].r && ai[i].flag && player.flag && ai[i].r > player.r * 1.1) {
            // 玩家死亡重生
            player.x = Math.random() * MAP_W;
            player.y = Math.random() * MAP_H;
            player.r = 20;
            player.color = 0x00FF00;
        }
    }

    // 黑洞吃玩家
    for (let i = 0; i < BLACKHOLE_NUM; i++) {
        if (distance(blackhole[i], player) < blackhole[i].r && blackhole[i].flag && player.flag) {
            player.x = Math.random() * MAP_W;
            player.y = Math.random() * MAP_H;
            player.r = 20;
            player.color = 0x00FF00;
        }
    }
}

// 吃分离体逻辑
function eatSeparation() {
    for (let i = 0; i < AI_NUM; i++) {
        for (let j = 0; j < SEPARATION_NUM; j++) {
            if (distance(ai[i], separation[j]) < ai[i].r && ai[i].flag && separation[j].flag && ai[i].r > separation[j].r * 1.1) {
                separation[j].flag = false;
                ai[i].r += separation[j].r / 4;
            }
        }
    }

    for (let i = 0; i < BLACKHOLE_NUM; i++) {
        for (let j = 0; j < SEPARATION_NUM; j++) {
            if (distance(blackhole[i], separation[j]) < blackhole[i].r && blackhole[i].flag && separation[j].flag) {
                separation[j].flag = false;
            }
        }
    }
}

// 吃孢子逻辑
function eatSpore() {
    for (let i = 0; i < SPORE_NUM; i++) {
        if (!spore[i].flag) continue;

        // 玩家吃孢子
        if (distance(player, spore[i]) < player.r) {
            spore[i].flag = false;
            player.r = Math.min(player.r + spore[i].r / 4, 150);
        }

        // 分离体吃孢子
        for (let j = 0; j < SEPARATION_NUM; j++) {
            if (distance(separation[j], spore[i]) < separation[j].r && separation[j].flag && spore[i].flag) {
                spore[i].flag = false;
                separation[j].r += spore[i].r / 10;
            }
        }

        // AI吃孢子
        for (let a = 0; a < AI_NUM; a++) {
            if (distance(ai[a], spore[i]) < ai[a].r && spore[i].flag) {
                spore[i].flag = false;
                ai[a].r = spore[i].r;
            }
        }

        // 黑洞吃孢子
        for (let b = 0; b < BLACKHOLE_NUM; b++) {
            if (distance(blackhole[b], spore[i]) < blackhole[b].r && blackhole[b].flag && spore[i].flag) {
                spore[i].flag = false;
            }
        }
    }
}

// 创建分离体 - 匹配原版 createSeparation()
function createSeparation() {
    if (keys['Space']) {
        for (let i = 0; i < SEPARATION_NUM; i++) {
            separation[i].flag = true;
        }
    }
}

// 创建孢子 - 匹配原版 createSpore()
function createSpore() {
    if (keys['ShiftLeft'] || keys['ShiftRight']) {
        for (let i = 0; i < SPORE_NUM; i++) {
            spore[i].flag = true;
        }
    }
}

// 孢子重生 - 匹配原版 sporeReborn()
function sporeReborn() {
    for (let i = 0; i < SPORE_NUM; i++) {
        if (distance(player, spore[i]) > player.r * 4 && spore[i].flag) {
            spore[i].x = player.x + 40;
            spore[i].y = Math.random() * (player.y + 20);
        }
    }
}

// 合并分离体 - 匹配原版 combine()
function combine() {
    if (keys['ControlLeft'] || keys['ControlRight']) {
        for (let i = 0; i < SEPARATION_NUM; i++) {
            if (distance(player, separation[i]) < player.r && separation[i].flag) {
                separation[i].flag = false;
                player.r = Math.min(player.r + separation[i].r / 4, 150); // 限制最大半径为150
            }

            if (distance(player, separation[i]) > player.r * 4 && separation[i].flag) {
                separation[i].x = player.x + Math.random() * 40;
                separation[i].y = player.y + Math.random() * 60;
            }
        }
    }
}

// 玩家缩小
function playerShrink() {
    if (keys['Space']) {
        player.r = Math.max(20, player.r / 2 + 20);
    }

    if (keys['ShiftLeft'] || keys['ShiftRight']) {
        player.r = Math.max(20, player.r / 2 + 20);
    }

    for (let i = 0; i < SPIKE_NUM; i++) {
        for (let j = 0; j < SEPARATION_NUM; j++) {
            if (distance(player, spike[i]) < player.r && spike[i].flag && !separation[j].flag) {
                spike[i].flag = false;
                player.r = Math.max(20, player.r / 2 + 20);

                separation[j].x = Math.random() * (player.x + 40);
                separation[j].y = Math.random() * (player.y + 80);
                separation[j].r = Math.random() * (player.r / 2) + 20;
                separation[j].flag = true;
                separation[j].color = `hsl(${Math.random() * 360}, 70%, 50%)`;
            }
        }

        if (!spike[i].flag) {
            spike[i].x = Math.random() * MAP_W;
            spike[i].y = Math.random() * MAP_H;
            spike[i].r = 60;
            spike[i].flag = true;
            spike[i].color = 0xFFFFFF;
        }
    }
}

// 分离体缩小
function separationShrink() {
    for (let i = 0; i < SEPARATION_NUM; i++) {
        for (let j = 0; j < SPIKE_NUM; j++) {
            if (distance(separation[i], spike[j]) < separation[i].r && separation[i].flag && spike[j].flag) {
                spike[j].flag = false;
                separation[i].r = Math.max(20, separation[i].r / 2 + 20);
            }

            if (!spike[j].flag) {
                spike[j].x = Math.random() * MAP_W;
                spike[j].y = Math.random() * MAP_H;
                spike[j].r = 60;
                spike[j].flag = true;
                spike[j].color = 0xFFFFFF;
            }
        }
    }
}

// 玩家颜色变化 - 匹配原版 playerDiscolour()
function playerDiscolour() {
    if (player.r > 60) {
        player.color = (Math.random() * 256 | 0) | ((Math.random() * 256 | 0) << 8) | ((Math.random() * 256 | 0) << 16);
    }
}

// AI颜色变化 - 匹配原版 aiDiscolour()
function aiDiscolour() {
    for (let i = 0; i < AI_NUM; i++) {
        if (ai[i].flag && ai[i].r > 60) {
            ai[i].color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        }
    }
}

// 距离计算函数
function distance(b1, b2) {
    const dx = b1.x - b2.x;
    const dy = b1.y - b2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// 启动游戏
document.addEventListener('DOMContentLoaded', init);
