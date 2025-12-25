// 输入系统模块
// 负责键盘输入的处理和管理

// 输入系统全局变量
let keys = {};

// 设置输入监听
function setupInput() {
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        if (!gameStarted) {
            gameStarted = true;
            // 开始播放背景音乐
            playMusic('ball');
        }
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });
}
