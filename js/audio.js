// 音频系统模块
// 负责音乐的生成、播放和管理

// 音频系统全局变量
let audioContext;
let currentMusic = null;
let currentMusicType = null; // 跟踪当前播放的音乐类型
let isMusicPlaying = false;

// 初始化音频系统
function initAudio() {
    // 音频系统将在需要时动态创建
    console.log('音频系统初始化完成');
}

// 创建程序化音乐缓冲区
function createProceduralMusicBuffer(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const sampleRate = audioContext.sampleRate;
        const duration = 4; // 4秒循环
        const numSamples = sampleRate * duration;
        const buffer = audioContext.createBuffer(2, numSamples, sampleRate);

        // 根据类型生成不同的旋律
        let notes, rhythms, baseFreq;

        if (type === 'ball') {
            // 背景音乐 - 舒缓的旋律
            baseFreq = 220; // A3
            notes = [0, 2, 4, 5, 7, 9, 11, 12]; // C大调音阶
            rhythms = [0.25, 0.25, 0.25, 0.25, 0.5, 0.25, 0.25, 0.5]; // 节奏模式
        } else if (type === 'evolve') {
            // 进化音乐 - 激昂的旋律
            baseFreq = 330; // E4
            notes = [4, 7, 9, 11, 12, 14, 16, 11]; // E小调音阶，更加激昂
            rhythms = [0.125, 0.125, 0.25, 0.125, 0.125, 0.25, 0.5, 0.5]; // 更复杂的节奏
        }

        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const channelData = buffer.getChannelData(channel);

            let timeOffset = 0;
            let noteIndex = 0;

            while (timeOffset < duration) {
                const currentNote = notes[noteIndex % notes.length];
                const currentRhythm = rhythms[noteIndex % rhythms.length];
                const frequency = baseFreq * Math.pow(2, currentNote / 12); // 12平均律

                // 生成这个音符的样本
                const startSample = Math.floor(timeOffset * sampleRate);
                const endSample = Math.floor((timeOffset + currentRhythm) * sampleRate);

                for (let i = startSample; i < Math.min(endSample, numSamples); i++) {
                    const t = (i - startSample) / sampleRate;
                    const attack = Math.min(t * 10, 1); // 渐强
                    const decay = Math.max(0, 1 - (t - currentRhythm * 0.8) * 5); // 渐弱

                    // 生成多个谐波的合成音
                    let sample = 0;
                    for (let harmonic = 1; harmonic <= 3; harmonic++) {
                        const harmonicAmp = 1 / harmonic;
                        sample += Math.sin(t * frequency * harmonic * 2 * Math.PI) * harmonicAmp;
                    }

                    // 应用包络
                    sample *= attack * decay * 0.1;

                    // 添加到缓冲区
                    if (channelData[i] !== undefined) {
                        channelData[i] += sample;
                    }
                }

                timeOffset += currentRhythm;
                noteIndex++;
            }
        }

        return buffer;
    } catch (error) {
        console.warn('创建程序化音乐失败:', error);
        return null;
    }
}

// 创建程序化音乐源
function createProceduralMusic(type) {
    const buffer = createProceduralMusicBuffer(type);
    if (!buffer) return null;

    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // 创建音频源
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(audioContext.destination);

        return source;
    } catch (error) {
        console.warn('创建音频源失败:', error);
        return null;
    }
}

// 播放音乐
function playMusic(type) {
    const indicator = document.getElementById('musicIndicator');

    // 停止当前音乐
    if (currentMusic) {
        try {
            currentMusic.stop();
        } catch (e) {
            // 忽略停止错误
        }
        currentMusic = null;
    }

    // 如果已经是同一类型的音乐，不需要重新播放
    if (currentMusicType === type) {
        return;
    }

    // 创建新的音频源
    let buffer;
    if (type === 'ball') {
        buffer = createProceduralMusicBuffer('ball');
        indicator.textContent = '🎵 背景音乐';
        indicator.className = 'music-indicator playing';
        currentMusicType = 'ball';
    } else if (type === 'evolve') {
        buffer = createProceduralMusicBuffer('evolve');
        indicator.textContent = '🎵 进化音乐';
        indicator.className = 'music-indicator playing';
        currentMusicType = 'evolve';
    }

    // 播放音乐
    if (buffer) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            currentMusic = audioContext.createBufferSource();
            currentMusic.buffer = buffer;
            currentMusic.loop = true;
            currentMusic.connect(audioContext.destination);
            currentMusic.start();
        } catch (error) {
            console.warn('播放音乐失败:', error);
            indicator.textContent = '🎵 播放失败';
            currentMusicType = null;
        }
    }

    isMusicPlaying = true;
}

// 音乐切换 - 匹配原版 changeSong()
function changeSong() {
    if (player.r > 80 && currentMusicType !== 'evolve') {
        console.log(`切换到进化音乐，当前半径: ${player.r}`);
        playMusic('evolve');
    }
}
