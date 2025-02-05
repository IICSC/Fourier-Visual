// 如果需要更复杂的动画，可以在这里添加JavaScript代码
// 例如，使用GSAP或Anime.js库来实现更复杂的动画效果 

gsap.registerPlugin(ScrollTrigger);

// 初始化GSAP动画
gsap.to('.circle', {
    x: 'random(-300, 300)',
    y: 'random(-300, 300)',
    duration: 'random(3, 6)',
    repeat: -1,
    yoyo: true,
    ease: 'none'
});

gsap.to('.square', {
    x: 'random(-300, 300)',
    y: 'random(-300, 300)',
    rotation: 360,
    duration: 'random(4, 8)',
    repeat: -1,
    yoyo: true,
    ease: 'none'
});

gsap.to('.triangle', {
    x: 'random(-300, 300)',
    y: 'random(-300, 300)',
    rotation: -360,
    duration: 'random(5, 10)',
    repeat: -1,
    yoyo: true,
    ease: 'none'
});

// 滚动动画
const cards = document.querySelectorAll('.card');
cards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.2
    });
});

// 浮动动画
gsap.to('.floating-element', {
    y: -30,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});

// 旋转动画
gsap.to('.rotating-element', {
    rotation: 360,
    duration: 3,
    repeat: -1,
    ease: "none"
});

// 缩放动画
gsap.to('.scaling-element', {
    scale: 1.5,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});

// 背景形状动画
gsap.to('.background-shapes .circle', {
    x: 'random(-200, 200)',
    y: 'random(-200, 200)',
    duration: 'random(3, 6)',
    repeat: -1,
    yoyo: true,
    ease: "none"
});

gsap.to('.background-shapes .square', {
    x: 'random(-200, 200)',
    y: 'random(-200, 200)',
    rotation: 360,
    duration: 'random(4, 7)',
    repeat: -1,
    yoyo: true,
    ease: "none"
});

// 滚动触发动画
gsap.from('.demo-item', {
    scrollTrigger: {
        trigger: '.demo-section',
        start: 'top center+=100',
        toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    duration: 1.2,
    stagger: {
        amount: 0.8,
        from: "start"
    },
    ease: "power3.out"
});

// 鼠标移动视差效果
document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) * 0.05;
    const moveY = (clientY - window.innerHeight / 2) * 0.05;
    
    gsap.to('.background-shapes', {
        x: moveX,
        y: moveY,
        duration: 1
    });
});

// 使用 will-change 提示浏览器优化渲染
const animatedElements = document.querySelectorAll('.floating-element, .rotating-element, .scaling-element');
animatedElements.forEach(el => {
    el.style.willChange = 'transform';
});

// 添加主题切换功能
const themes = {
    dark: {
        background: 'linear-gradient(135deg, #1a1a1a, #4a4a4a)',
        text: '#ffffff'
    },
    light: {
        background: 'linear-gradient(135deg, #f0f0f0, #ffffff)',
        text: '#1a1a1a'
    }
};

function toggleTheme() {
    const currentTheme = document.body.classList.contains('light') ? 'dark' : 'light';
    document.body.classList.toggle('light');
    updateThemeColors(themes[currentTheme]);
}

// 修改卡片动画效果
const hoverCards = document.querySelectorAll('.hover-card');

hoverCards.forEach(card => {
    let isFlipped = false;
    
    // 添加进入动画
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    });

    // 处理卡片翻转
    card.addEventListener('click', () => {
        isFlipped = !isFlipped;
        if (isFlipped) {
            gsap.to(card, {
                rotateY: 180,
                duration: 0.6,
                ease: 'power2.inOut'
            });
        } else {
            gsap.to(card, {
                rotateY: 0,
                duration: 0.6,
                ease: 'power2.inOut'
            });
        }
    });

    // 添加悬停效果
    card.addEventListener('mouseenter', () => {
        if (!isFlipped) {
            gsap.to(card, {
                y: -10,
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(card.querySelector('.card-front'), {
                boxShadow: '0 10px 20px rgba(0, 255, 136, 0.2)',
                duration: 0.3
            });
        }
    });

    card.addEventListener('mouseleave', () => {
        if (!isFlipped) {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(card.querySelector('.card-front'), {
                boxShadow: 'none',
                duration: 0.3
            });
        }
    });

    // 添加轻微的视差效果
    card.addEventListener('mousemove', (e) => {
        if (!isFlipped) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width - 0.5) * 10; // 减小旋转角度
            const yPercent = (y / rect.height - 0.5) * 10;
            
            gsap.to(card, {
                rotationY: xPercent,
                rotationX: -yPercent,
                duration: 0.2,
                ease: 'power2.out'
            });
        }
    });

    card.addEventListener('mouseleave', () => {
        if (!isFlipped) {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        }
    });
});

// 添加加载动画
gsap.from('.interactive-container', {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
        trigger: '.interactive-section',
        start: 'top center+=100',
        toggleActions: 'play none none reverse'
    }
});

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = 0.3;  // 降低速度使动画更平滑
        this.dx = Math.random() * 2 - 1;
        this.dy = Math.random() * 2 - 1;
        this.size = Math.random() * 2 + 1;  // 稍微调小粒子尺寸
        this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.6)`;  // 添加随机蓝色调
    }

    update() {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;

        if (this.x < 0 || this.x > this.canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.dy *= -1;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 创建粒子
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(canvas));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    animate();

    // 处理窗口大小变化
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 添加新的粒子效果初始化函数
function initParticleSection() {
    const canvas = document.querySelector('.particle-container canvas');
    const ctx = canvas.getContext('2d');
    const particles = [];
    const maxDistance = 150; // 粒子之间连线的最大距离
    
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    
    resizeCanvas();
    
    // 增加粒子数量
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(canvas));
    }

    // 绘制粒子之间的连线
    function drawLines(particles) {
        particles.forEach((particle1, i) => {
            particles.slice(i + 1).forEach(particle2 => {
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particle1.x, particle1.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 添加渐变背景
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 30, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 30, 60, 0.5)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 先绘制连线
        drawLines(particles);
        
        // 再绘制粒子
        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        // 添加鼠标交互
        if (mousePosition.x !== undefined) {
            particles.forEach(particle => {
                const dx = particle.x - mousePosition.x;
                const dy = particle.y - mousePosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(mousePosition.x, mousePosition.y);
                    ctx.lineTo(particle.x, particle.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        }

        requestAnimationFrame(animate);
    }

    // 添加鼠标交互
    const mousePosition = {};
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mousePosition.x = e.clientX - rect.left;
        mousePosition.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mousePosition.x = undefined;
        mousePosition.y = undefined;
    });

    animate();

    // 处理窗口大小变化
    window.addEventListener('resize', resizeCanvas);
}

// 修改页面加载事件
window.addEventListener('load', () => {
    initParticles(); // 背景粒子效果
    initParticleSection(); // 粒子部分的效果
});

// 页面滚动动画
gsap.from('.hero-title', {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top center',
        toggleActions: 'play none none reverse'
    }
});

gsap.from('.hero-subtitle', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.3,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top center',
        toggleActions: 'play none none reverse'
    }
});

// 添加滚动时的视差效果
gsap.to('.background-shapes', {
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
    },
    y: -100
});

// 导航栏滚动效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
    }
});

// 添加加载进度条
const loadingScreen = document.createElement('div');
loadingScreen.className = 'loading-screen';
document.body.appendChild(loadingScreen);

window.addEventListener('load', () => {
    gsap.to('.loading-screen', {
        opacity: 0,
        duration: 0.5,
        onComplete: () => loadingScreen.remove()
    });
});

// 添加错误处理
window.addEventListener('error', (e) => {
    console.error('动画加载错误:', e);
    // 可以添加错误提示UI
}); 