// ============================================================================
// AdaptiveWeb — Dynamic Rich Features Module (Tier: HIGH ONLY)
// ============================================================================
// This module is conditionally loaded via dynamic import() ONLY when the
// calculated adaptive mode is HIGH. In MEDIUM and LOW tiers, this file is
// never requested or evaluated, conserving bandwidth and CPU execution cycles.
// ============================================================================

let activeCanvas = null;
let animFrameId = null;
let tiltListeners = [];
let audioCtx = null;

/**
 * Interactive 3D Card Tilt with Specular Lighting & Spring Physics
 */
export function init3DTilt(selector = ".product") {
    destroy3DTilt();
    const cards = document.querySelectorAll(selector);

    cards.forEach(card => {
        let isHovered = false;

        const onMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale(1.02)`;
        };

        const onMouseEnter = () => {
            isHovered = true;
            card.style.transition = "transform 0.1s ease-out, box-shadow 0.3s ease";
        };

        const onMouseLeave = () => {
            isHovered = false;
            card.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease";
            card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
        };

        card.addEventListener("mouseenter", onMouseEnter);
        card.addEventListener("mousemove", onMouseMove);
        card.addEventListener("mouseleave", onMouseLeave);

        tiltListeners.push({ element: card, onMouseEnter, onMouseMove, onMouseLeave });
    });
}

export function destroy3DTilt() {
    tiltListeners.forEach(({ element, onMouseEnter, onMouseMove, onMouseLeave }) => {
        element.removeEventListener("mouseenter", onMouseEnter);
        element.removeEventListener("mousemove", onMouseMove);
        element.removeEventListener("mouseleave", onMouseLeave);
        element.style.transform = "";
        element.style.transition = "";
    });
    tiltListeners = [];
}

/**
 * Interactive Hero Ambient Particle / Glow Canvas
 */
export function initHeroCanvas(containerId = "heroCanvasContainer") {
    destroyHeroCanvas();
    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.id = "adaptiveRichCanvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "1";
    canvas.style.opacity = "0.75";

    container.style.position = "relative";
    container.appendChild(canvas);
    activeCanvas = canvas;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    const onResize = () => {
        if (!activeCanvas) return;
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    // Particle pool
    const particles = Array.from({ length: 28 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.5 + 1.2,
        color: Math.random() > 0.4 ? "rgba(34, 211, 238," : "rgba(168, 85, 247,",
        alpha: Math.random() * 0.5 + 0.2
    }));

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const render = () => {
        if (!activeCanvas) return;

        if (isVisible) {
            ctx.clearRect(0, 0, width, height);

            // Connect nearby particles with subtle lines
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.x += p1.vx;
                p1.y += p1.vy;

                if (p1.x < 0 || p1.x > width) p1.vx *= -1;
                if (p1.y < 0 || p1.y > height) p1.vy *= -1;

                ctx.beginPath();
                ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
                ctx.fillStyle = `${p1.color}${p1.alpha})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 90) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(34, 211, 238, ${0.18 * (1 - dist / 90)})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
        }

        animFrameId = requestAnimationFrame(render);
    };

    render();
}

export function destroyHeroCanvas() {
    if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
    if (activeCanvas) {
        activeCanvas.remove();
        activeCanvas = null;
    }
}

/**
 * Subtle Synthesized Audio / Tactile Feedback (Web Audio API)
 */
export function playChime(type = "cart") {
    try {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (!audioCtx || audioCtx.state === "suspended") {
            audioCtx?.resume();
        }
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        if (type === "cart") {
            osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
            gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.23);
        } else if (type === "checkout") {
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.25); // C6
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.36);
        }
    } catch (e) {
        // Safe silent fail
    }
}

/**
 * Lifecycle Coordinator for High Tier
 */
export function initRichFeatures() {
    console.log("%c[AdaptiveWeb Dynamic JS] HIGH Mode activated — dynamically loaded rich-features.js", "color: #10b981; font-weight: bold;");
    init3DTilt();
    initHeroCanvas("heroVisualContainer");
}

export function destroyRichFeatures() {
    destroy3DTilt();
    destroyHeroCanvas();
}
