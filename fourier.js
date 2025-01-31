class FourierVisualizer {
    constructor() {
        this.timeCanvas = document.getElementById('timeCanvas');
        this.freqCanvas = document.getElementById('freqCanvas');
        this.timeCtx = this.timeCanvas.getContext('2d');
        this.freqCtx = this.freqCanvas.getContext('2d');
        
        this.currentWave = 'sine';
        this.time = 0;
        this.harmonics = [];
        this.targetHarmonics = [];
        this.transitionProgress = 1;
        
        // 修改初始状态
        this.animationState = {
            currentAmplitude: 50,
            targetAmplitude: 50,
            currentSpeed: 50,
            targetSpeed: 50,
            currentHarmonics: 10,
            targetHarmonics: 10
        };
        
        this.waveTransition = {
            active: false,
            progress: 0,
            fromHarmonics: [],
            toHarmonics: [],
            duration: 800  // 缩短过渡时间
        };
        
        // 添加视觉效果状态
        this.visualEffects = {
            gridOpacity: 0.05,
            waveGlow: 0,
            frequencyBars: {
                height: 1,
                opacity: 1
            }
        };
        
        this.setupCanvases();
        this.setupControls();
        this.setupEventListeners();
        this.calculateHarmonics(true);
        this.animate();
        
        // 处理窗口大小变化
        window.addEventListener('resize', () => this.setupCanvases());
    }
    
    setupCanvases() {
        const setCanvasSize = (canvas) => {
            const rect = canvas.parentElement.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
        };
        
        setCanvasSize(this.timeCanvas);
        setCanvasSize(this.freqCanvas);
    }
    
    setupControls() {
        // 获取控制元素
        this.harmonicCount = document.getElementById('harmonicCount');
        this.speed = document.getElementById('speed');
        this.amplitude = document.getElementById('amplitude');
        
        // 移除波形选择按钮的事件监听，现在在 setupEventListeners 中处理
    }
    
    setupEventListeners() {
        // 波形切换按钮事件
        document.querySelectorAll('.wave-button').forEach(button => {
            button.addEventListener('click', () => {
                if (this.currentWave !== button.dataset.wave) {
                    document.querySelectorAll('.wave-button').forEach(b => 
                        b.classList.remove('active'));
                    button.classList.add('active');
                    this.startWaveTransition(button.dataset.wave);
                }
            });
        });

        // 控制器事件
        const updateValueDisplay = (input, displayId) => {
            const display = document.getElementById(displayId);
            const value = input.value;
            display.textContent = value;
            display.style.transform = 'scale(1.2)';
            setTimeout(() => display.style.transform = 'scale(1)', 200);
        };

        // 更新控制器显示和状态
        const controls = {
            harmonicCount: {
                update: () => this.calculateHarmonics()
            },
            speed: {
                update: (value) => this.animationState.targetSpeed = parseInt(value)
            },
            amplitude: {
                update: (value) => {
                    this.animationState.targetAmplitude = parseInt(value);
                    this.calculateHarmonics();
                }
            }
        };

        Object.entries(controls).forEach(([id, handler]) => {
            const input = document.getElementById(id);
            const displayId = id + 'Value';
            input.addEventListener('input', () => {
                updateValueDisplay(input, displayId);
                handler.update(input.value);
            });
        });
    }
    
    calculateHarmonics(isInitial = false) {
        const count = parseInt(this.harmonicCount.value);
        const amplitude = isInitial ? 
            parseInt(this.amplitude.value) : 
            this.animationState.currentAmplitude;
        
        this.targetHarmonics = [];
        
        switch(this.currentWave) {
            case 'sine':
                this.targetHarmonics.push({
                    amplitude: amplitude,
                    frequency: 1,
                    phase: 0
                });
                break;
                
            case 'square':
                // 修改方波的谐波计算
                for(let n = 1; n <= count; n += 2) {
                    const amp = (4 * amplitude / (n * Math.PI));
                    this.targetHarmonics.push({
                        amplitude: amp,
                        frequency: n,
                        phase: 0
                    });
                }
                break;
                
            case 'sawtooth':
                // 修改锯齿波的谐波计算
                for(let n = 1; n <= count; n++) {
                    const amp = (2 * amplitude / (n * Math.PI));
                    this.targetHarmonics.push({
                        amplitude: amp,
                        frequency: n,
                        phase: -Math.PI / 2
                    });
                }
                break;
                
            case 'custom':
                // 修改自定义波形
                for(let n = 1; n <= count; n++) {
                    const amp = amplitude / Math.sqrt(n);
                    const phase = (n % 3) * (2 * Math.PI / 3);
                    this.targetHarmonics.push({
                        amplitude: amp,
                        frequency: n,
                        phase: phase
                    });
                }
                break;
        }
        
        // 确保初始化时正确设置
        if (isInitial) {
            this.harmonics = JSON.parse(JSON.stringify(this.targetHarmonics));
        }
    }
    
    startWaveTransition(newWave) {
        // 保存当前谐波状态
        this.waveTransition.fromHarmonics = [...this.harmonics];
        this.waveTransition.active = true;
        this.waveTransition.progress = 0;
        
        // 计算新波形的谐波
        this.currentWave = newWave;
        this.calculateHarmonics();
        this.waveTransition.toHarmonics = [...this.targetHarmonics];
        
        // 重置视觉效果
        this.visualEffects.waveGlow = 1;
        this.visualEffects.gridOpacity = 0.1;
        this.visualEffects.frequencyBars.opacity = 0.5;
        
        // 开始过渡动画
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.waveTransition.duration, 1);
            
            this.waveTransition.progress = this.easeInOutCubic(progress);
            this.visualEffects.waveGlow = 1 - progress;
            this.visualEffects.gridOpacity = 0.05 + (0.05 * (1 - progress));
            this.visualEffects.frequencyBars.opacity = 0.5 + (0.5 * progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.waveTransition.active = false;
                this.harmonics = [...this.targetHarmonics];
                this.visualEffects.frequencyBars.opacity = 1;
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    updateHarmonics() {
        const lerp = (start, end, t) => start + (end - start) * t;
        
        // 更新状态值
        this.animationState.currentAmplitude = lerp(
            this.animationState.currentAmplitude,
            this.animationState.targetAmplitude,
            0.1
        );
        
        this.animationState.currentSpeed = lerp(
            this.animationState.currentSpeed,
            this.animationState.targetSpeed,
            0.1
        );
        
        if (this.waveTransition.active) {
            // 波形切换时的更新
            const progress = this.waveTransition.progress;
            const fromH = this.waveTransition.fromHarmonics;
            const toH = this.waveTransition.toHarmonics;
            
            // 创建新的谐波数组
            this.harmonics = [];
            const maxLength = Math.max(fromH.length, toH.length);
            
            for (let i = 0; i < maxLength; i++) {
                const from = fromH[i] || { amplitude: 0, frequency: (toH[i] || {}).frequency || 1, phase: 0 };
                const to = toH[i] || { amplitude: 0, frequency: from.frequency, phase: 0 };
                
                this.harmonics.push({
                    amplitude: lerp(from.amplitude, to.amplitude, progress),
                    frequency: from.frequency, // 频率保持不变
                    phase: this.lerpAngle(from.phase, to.phase, progress)
                });
            }
        } else {
            // 正常状态更新
            this.calculateHarmonics();
            
            this.harmonics = this.harmonics.map((h, i) => {
                const target = this.targetHarmonics[i] || { amplitude: 0, frequency: h.frequency, phase: h.phase };
                return {
                    amplitude: lerp(h.amplitude, target.amplitude, 0.1),
                    frequency: h.frequency,
                    phase: this.lerpAngle(h.phase, target.phase, 0.1)
                };
            });
        }
    }
    
    lerpAngle(a, b, t) {
        const diff = b - a;
        const adjusted = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
        return a + adjusted * t;
    }
    
    drawTimeDomain() {
        const ctx = this.timeCtx;
        const width = this.timeCanvas.width / (window.devicePixelRatio || 1);
        const height = this.timeCanvas.height / (window.devicePixelRatio || 1);
        
        ctx.clearRect(0, 0, width, height);
        
        // 绘制动态网格
        this.drawDynamicGrid(ctx, width, height);
        
        // 绘制波形
        ctx.beginPath();
        ctx.strokeStyle = '#FF4081';
        ctx.lineWidth = 2;
        
        // 添加波形发光效果
        if (this.visualEffects.waveGlow > 0) {
            ctx.shadowColor = '#FF4081';
            ctx.shadowBlur = 15 * this.visualEffects.waveGlow;
        }
        
        const points = [];
        for(let x = 0; x < width; x++) {
            let y = 0;
            const t = (x / width) * Math.PI * 2 + this.time;
            
            this.harmonics.forEach(h => {
                y += h.amplitude * Math.sin(h.frequency * t + h.phase);
            });
            
            points.push({x, y: height/2 - y});
        }
        
        // 使用贝塞尔曲线平滑波形
        ctx.moveTo(points[0].x, points[0].y);
        for(let i = 0; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // 添加渐变填充
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, `rgba(255, 64, 129, ${0.2 + this.visualEffects.waveGlow * 0.2})`);
        gradient.addColorStop(1, 'rgba(255, 64, 129, 0)');
        ctx.fillStyle = gradient;
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();
    }
    
    drawGrid(ctx, width, height) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;
        
        const gridSize = 50;
        
        for(let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        for(let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }
    
    drawDynamicGrid(ctx, width, height) {
        const gridSize = 50;
        const offset = (this.time * this.animationState.currentSpeed) % gridSize;
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
        ctx.lineWidth = 1;
        
        // 绘制移动的网格
        for(let x = -offset; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
    }
    
    drawFrequencyDomain() {
        const ctx = this.freqCtx;
        const width = this.freqCanvas.width / (window.devicePixelRatio || 1);
        const height = this.freqCanvas.height / (window.devicePixelRatio || 1);
        
        ctx.clearRect(0, 0, width, height);
        
        // 绘制网格和坐标轴
        this.drawGrid(ctx, width, height);
        this.drawAxis(ctx, width, height);
        
        // 修改频谱绘制
        const maxFreq = Math.max(...this.harmonics.map(h => h.frequency));
        const maxAmp = Math.max(...this.harmonics.map(h => h.amplitude));
        const scale = (height * 0.4) / (maxAmp || 1); // 防止除以0
        const barWidth = Math.min(30, (width - 100) / this.harmonics.length);
        
        this.harmonics.forEach((h, index) => {
            const x = 50 + (h.frequency / maxFreq) * (width - 100);
            const barHeight = Math.abs(h.amplitude) * scale;
            
            // 添加频谱动画效果
            const bounce = Math.sin(this.time * 3 + index * 0.5) * 0.05 + 0.95;
            const finalHeight = barHeight * bounce;
            
            // 绘制频谱柱状图
            const gradient = ctx.createLinearGradient(
                0, 
                height/2 - finalHeight,
                0, 
                height/2 + finalHeight
            );
            
            gradient.addColorStop(0, 'rgba(33, 150, 243, 0.8)');
            gradient.addColorStop(1, 'rgba(33, 150, 243, 0.4)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(
                x - barWidth/2,
                height/2 - finalHeight,
                barWidth,
                finalHeight * 2
            );
            
            // 频率标签
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.font = '12px Noto Sans SC';
            ctx.fillText(
                `${h.frequency}Hz`,
                x,
                height/2 + finalHeight + 20
            );
        });
    }
    
    drawAxis(ctx, width, height) {
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        
        // X轴
        ctx.beginPath();
        ctx.moveTo(0, height/2);
        ctx.lineTo(width, height/2);
        ctx.stroke();
        
        // Y轴
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height);
        ctx.stroke();
    }
    
    animate() {
        this.updateHarmonics();
        this.drawTimeDomain();
        this.drawFrequencyDomain();
        
        const speed = this.animationState.currentSpeed / 1000;
        this.time += speed;
        
        requestAnimationFrame(() => this.animate());
    }
}

// 启动可视化
window.addEventListener('load', () => {
    new FourierVisualizer();
}); 