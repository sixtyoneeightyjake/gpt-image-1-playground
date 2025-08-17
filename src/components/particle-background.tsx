'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    life: number;
    maxLife: number;
    color: string;
}

interface ParticleBackgroundProps {
    particleCount?: number;
    className?: string;
}

export function ParticleBackground({ particleCount = 50, className }: ParticleBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const particlesRef = useRef<Particle[]>([]);

    const colors = [
        'rgba(255, 215, 0, 0.8)',   // gold
        'rgba(255, 165, 0, 0.8)',   // orange
        'rgba(255, 69, 0, 0.8)',    // red-orange
        'rgba(255, 140, 0, 0.8)',   // dark orange
        'rgba(255, 99, 71, 0.8)',   // tomato
        'rgba(255, 127, 80, 0.8)',  // coral
    ];

    const createParticle = (canvas: HTMLCanvasElement): Particle => {
        const maxLife = Math.random() * 300 + 200;
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            life: maxLife,
            maxLife,
            color: colors[Math.floor(Math.random() * colors.length)],
        };
    };

    const updateParticle = (particle: Particle, canvas: HTMLCanvasElement) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life--;

        // Fade out as life decreases
        particle.opacity = (particle.life / particle.maxLife) * 0.8;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Reset particle when life ends
        if (particle.life <= 0) {
            const newParticle = createParticle(canvas);
            Object.assign(particle, newParticle);
        }
    };

    const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        
        // Create a glowing effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 2;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add sparkle effect for some particles
        if (Math.random() < 0.1) {
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x - particle.size * 2, particle.y);
            ctx.lineTo(particle.x + particle.size * 2, particle.y);
            ctx.moveTo(particle.x, particle.y - particle.size * 2);
            ctx.lineTo(particle.x, particle.y + particle.size * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    };

    const animate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas with slight trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particlesRef.current.forEach(particle => {
            updateParticle(particle, canvas);
            drawParticle(ctx, particle);
        });

        animationRef.current = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        resizeCanvas();

        // Initialize particles
        particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas));

        // Start animation
        animate();

        // Handle resize
        const handleResize = () => {
            resizeCanvas();
            // Recreate particles for new canvas size
            particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas));
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [particleCount]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-0 ${className}`}
            style={{ mixBlendMode: 'screen' }}
        />
    );
}