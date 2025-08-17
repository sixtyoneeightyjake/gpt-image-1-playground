'use client';

import { Sparkles, Zap } from 'lucide-react';
import * as React from 'react';
import Image from 'next/image';

export function AnimatedHeader() {
    const [sparklePositions, setSparklePositions] = React.useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

    React.useEffect(() => {
        // Generate random sparkle positions
        const sparkles = Array.from({ length: 6 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 2
        }));
        setSparklePositions(sparkles);
    }, []);

    return (
        <div className="relative mb-8 text-center">
            {/* Background glow effect */}
            <div className="absolute inset-0 -z-10 animate-pulse">
                <div className="mx-auto h-20 w-80 rounded-full bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-red-500/20 blur-xl" />
            </div>
            
            {/* Floating sparkles */}
            <div className="absolute inset-0 overflow-hidden">
                {sparklePositions.map((sparkle: { id: number; x: number; y: number; delay: number }) => (
                    <div
                        key={sparkle.id}
                        className="absolute animate-bounce"
                        style={{
                            left: `${sparkle.x}%`,
                            top: `${sparkle.y}%`,
                            animationDelay: `${sparkle.delay}s`,
                            animationDuration: '3s'
                        }}
                    >
                        <Sparkles className="h-4 w-4 text-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
                    </div>
                ))}
            </div>

            {/* Mascot and Main logo */}
            <div className="relative z-10 flex flex-col items-center gap-4">
                {/* Mojo Mascot */}
                <div className="relative">
                    <div className="absolute inset-0 bg-black rounded-full blur-sm opacity-50" />
                    <div className="relative bg-black rounded-full p-4 border border-orange-500/30 shadow-2xl">
                        <Image 
                            src="/imagemojo.png" 
                            alt="Mojo Mascot" 
                            width={80} 
                            height={80} 
                            className="rounded-full animate-float"
                        />
                    </div>
                </div>
                
                <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-red-400 bg-clip-text text-transparent animate-pulse">
                    <span className="inline-flex items-center gap-2">
                        <Zap className="h-12 w-12 text-yellow-400 animate-bounce" style={{ animationDuration: '2s' }} />
                        Image Mojo
                        <Sparkles className="h-10 w-10 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                    </span>
                </h1>
                <p className="mt-2 text-lg text-white/70 animate-fade-in">
                    Grab a box of crayons and come draw pictures with Mojo! 
                </p>
            </div>

            {/* Animated underline */}
            <div className="mx-auto mt-4 h-1 w-0 bg-gradient-to-r from-orange-400 via-amber-400 to-red-400 animate-expand-width" />
        </div>
    );
}