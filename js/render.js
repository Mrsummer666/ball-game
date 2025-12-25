// 渲染系统模块
// 负责游戏画面的绘制和显示

// 渲染系统全局变量
let canvas, ctx;
let worldCanvas, worldCtx;

// 显示开始屏幕
function showStartScreen() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, WIN_W, WIN_H);

    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 32px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.fillText('球球大作战 Plus', WIN_W / 2, WIN_H / 2 - 50);

    ctx.font = '16px Microsoft YaHei';
    ctx.fillText('按任意键开始游戏', WIN_W / 2, WIN_H / 2 + 20);

    ctx.font = '12px Microsoft YaHei';
    ctx.fillText('方向键/WASD: 移动 | 空格: 分离体 | Shift: 孢子 | Ctrl: 合并', WIN_W / 2, WIN_H / 2 + 60);
}

// 渲染雨滴 - 直接在屏幕画布上绘制
function renderRain() {
    ctx.font = '14px monospace';
    for (let i = 0; i < RAIN_NUM; i++) {
        for (let k = 0; k < STR_NUM; k++) {
            const alpha = (20 - k) / 20;
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.fillText(rain[i].str[k], rain[i].x, rain[i].y - k * 15);
        }
    }

    // 更新雨滴位置
    for (let i = 0; i < RAIN_NUM; i++) {
        rain[i].y += rain[i].speed;
        if (rain[i].y - STR_NUM * 15 > WIN_H) {
            rain[i].y = 0;
            rain[i].speed = Math.random() * 3 + 1;
        }
        // 随机改变字符
        if (Math.random() < 0.1) {
            rain[i].str = rain[i].str.substr(0, Math.random() * STR_NUM | 0) +
                           createChr() +
                           rain[i].str.substr((Math.random() * STR_NUM | 0) + 1);
        }
    }
}

// 创建单个字符
function createChr() {
    const rand = Math.random() * 3 | 0;
    switch (rand) {
        case 0: return String.fromCharCode(65 + Math.random() * 26 | 0);
        case 1: return String.fromCharCode(97 + Math.random() * 26 | 0);
        case 2: return String.fromCharCode(48 + Math.random() * 10 | 0);
    }
    return ' ';
}

// 游戏绘制 - 精确匹配原版 gameDraw() 逻辑
function gameDraw() {
    // 切换到世界地图画布 - 相当于 SetWorkingImage(&map)
    const currentCtx = worldCtx;

    // 清空世界地图 - 相当于 cleardevice()
    currentCtx.fillStyle = '#000000';
    currentCtx.fillRect(0, 0, MAP_W, MAP_H);

    // 绘制食物 - 根据玩家大小优化渲染
    const maxFoodToRender = player.r > 100 ? Math.min(FOOD_NUM, 400) : FOOD_NUM;
    for (let i = 0; i < maxFoodToRender; i++) {
        if (food[i].flag) {
            currentCtx.fillStyle = food[i].color;
            currentCtx.beginPath();
            currentCtx.arc(food[i].x, food[i].y, food[i].r, 0, Math.PI * 2);
            currentCtx.fill();
        }
    }

    // 绘制玩家
    currentCtx.fillStyle = `rgb(${(player.color >> 16) & 0xFF}, ${(player.color >> 8) & 0xFF}, ${player.color & 0xFF})`;
    currentCtx.beginPath();
    currentCtx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
    currentCtx.fill();

    // 绘制玩家名称
    currentCtx.fillStyle = '#ffffff';
    currentCtx.font = '16px Microsoft YaHei';
    currentCtx.textAlign = 'center';
    currentCtx.fillText('玩家', player.x, player.y + player.r + 20);

    // 绘制AI - 根据玩家大小优化渲染
    const maxAIToRender = player.r > 100 ? Math.min(AI_NUM, 10) : AI_NUM;
    for (let i = 0; i < maxAIToRender; i++) {
        if (ai[i].flag) {
            currentCtx.fillStyle = ai[i].color;
            currentCtx.beginPath();
            currentCtx.arc(ai[i].x, ai[i].y, ai[i].r, 0, Math.PI * 2);
            currentCtx.fill();

            // 绘制AI名称
            currentCtx.fillStyle = '#ffffff';
            currentCtx.font = '14px Microsoft YaHei';
            currentCtx.fillText('AI', ai[i].x - 20, ai[i].y + 10);
        }
    }

    // 绘制分离体
    for (let i = 0; i < SEPARATION_NUM; i++) {
        if (separation[i].flag) {
            currentCtx.fillStyle = separation[i].color;
            currentCtx.beginPath();
            currentCtx.arc(separation[i].x, separation[i].y, separation[i].r, 0, Math.PI * 2);
            currentCtx.fill();

            // 绘制分离体名称
            currentCtx.fillStyle = '#ffffff';
            currentCtx.font = '12px Microsoft YaHei';
            currentCtx.fillText('分离体', separation[i].x - 40, separation[i].y + 10);
        }
    }

    // 绘制孢子
    for (let i = 0; i < SPORE_NUM; i++) {
        if (spore[i].flag) {
            currentCtx.fillStyle = spore[i].color;
            currentCtx.beginPath();
            currentCtx.arc(spore[i].x, spore[i].y, spore[i].r, 0, Math.PI * 2);
            currentCtx.fill();

            // 绘制孢子名称
            currentCtx.fillStyle = '#ffffff';
            currentCtx.font = '10px Microsoft YaHei';
            currentCtx.fillText('孢子', spore[i].x - 30, spore[i].y + 8);
        }
    }

    // 绘制刺球
    for (let i = 0; i < SPIKE_NUM; i++) {
        if (spike[i].flag) {
            currentCtx.fillStyle = `rgb(${(spike[i].color >> 16) & 0xFF}, ${(spike[i].color >> 8) & 0xFF}, ${spike[i].color & 0xFF})`;
            currentCtx.beginPath();
            currentCtx.arc(spike[i].x, spike[i].y, spike[i].r, 0, Math.PI * 2);
            currentCtx.fill();

            // 绘制刺球名称
            currentCtx.fillStyle = '#000000';
            currentCtx.font = '12px Microsoft YaHei';
            currentCtx.fillText('刺球', spike[i].x - 40, spike[i].y + 5);
        }
    }

    // 绘制黑洞
    for (let i = 0; i < BLACKHOLE_NUM; i++) {
        if (blackhole[i].flag) {
            currentCtx.fillStyle = `rgb(${(blackhole[i].color >> 16) & 0xFF}, ${(blackhole[i].color >> 8) & 0xFF}, ${blackhole[i].color & 0xFF})`;
            currentCtx.beginPath();
            currentCtx.arc(blackhole[i].x, blackhole[i].y, blackhole[i].r, 0, Math.PI * 2);
            currentCtx.fill();

            // 绘制黑洞名称
            currentCtx.fillStyle = '#ffffff';
            currentCtx.font = '12px Microsoft YaHei';
            currentCtx.fillText('黑洞', blackhole[i].x - 40, blackhole[i].y + 5);
        }
    }

    // 更新相机位置 - 精确匹配原版逻辑
    g_camreaPos.x = player.x - WIN_W / 2;
    g_camreaPos.y = player.y - WIN_H / 2;

    // 相机边界检查
    if (g_camreaPos.x < 0) g_camreaPos.x = 0;
    if (g_camreaPos.y < 0) g_camreaPos.y = 0;
    if (g_camreaPos.x > MAP_W - WIN_W) g_camreaPos.x = MAP_W - WIN_W;
    if (g_camreaPos.y > MAP_H - WIN_H) g_camreaPos.y = MAP_H - WIN_H;

    // 从世界地图复制到屏幕 - 相当于 putimage(0, 0, WIN_W, WIN_H, &map, g_camreaPos.x, g_camreaPos.y)
    ctx.drawImage(worldCanvas,
                 g_camreaPos.x, g_camreaPos.y, WIN_W, WIN_H,  // 源区域
                 0, 0, WIN_W, WIN_H);                        // 目标区域
}
