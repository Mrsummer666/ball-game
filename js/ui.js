// UI管理系统模块
// 负责界面显示和用户交互

// UI管理器类
class UIManager {
    constructor() {
        this.elements = {
            playerRadius: document.getElementById('playerRadius'),
            playerScore: document.getElementById('playerScore'),
            fps: document.getElementById('fps')
        };
    }

    updatePlayerStats(radius, score) {
        if (this.elements.playerRadius) {
            this.elements.playerRadius.textContent = Math.round(radius);
        }

        if (this.elements.playerScore) {
            this.elements.playerScore.textContent = score.toLocaleString();
        }
    }

    updateFPS(fps) {
        if (this.elements.fps) {
            this.elements.fps.textContent = fps;
        }
    }
}

// UI管理器实例
let uiManager;

// UI更新函数
function updateUI() {
    // 更新玩家半径
    uiManager.updatePlayerStats(player.r, gameStats.score);

    // 更新FPS（简单的估算）
    uiManager.updateFPS(Math.round(1000 / 16)); // 假设60FPS

    // 调试信息（可选）
    if (player.r > 70) {
        console.log(`当前半径: ${player.r}, 音乐类型: ${currentMusicType}`);
    }
}
