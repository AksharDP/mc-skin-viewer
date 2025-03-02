"use client";

import React, { useEffect, useRef, useState } from 'react';
import { SkinViewer } from 'skinview3d';

interface SkinViewerProps {
    skinUrl?: string;
    className?: string;
}

const MinecraftSkinViewer: React.FC<SkinViewerProps> = ({ 
    skinUrl,
    className = ""
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [viewer, setViewer] = useState<SkinViewer | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    
    useEffect(() => {
        if (!containerRef.current) return;
        
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const width = Math.floor(rect.width);
                const height = Math.floor(rect.height);
                
                if (width !== dimensions.width || height !== dimensions.height) {
                    setDimensions({ width, height });
                }
            }
        };
        
        updateDimensions();
        
        const resizeObserver = new ResizeObserver(updateDimensions);
        resizeObserver.observe(containerRef.current);
        
        return () => {
            resizeObserver.disconnect();
        };
    }, []);
    
    useEffect(() => {
        if (!containerRef.current || dimensions.width === 0 || dimensions.height === 0) return;
        
        if (viewer) {
            viewer.dispose();
        }
        
        if (containerRef.current.firstChild) {
            containerRef.current.innerHTML = '';
        }
        
        const skinViewer = new SkinViewer({
            width: dimensions.width,
            height: dimensions.height,
            canvas: document.createElement("canvas")
        });
        
        containerRef.current.appendChild(skinViewer.canvas);
        
        skinViewer.controls.enableRotate = true;
        skinViewer.controls.enableZoom = true;
        skinViewer.controls.enablePan = false;
        
        skinViewer.background = 0x404040;
        
        // skinViewer.animation = skinViewer.animations.walking;
        
        setViewer(skinViewer);
        
        return () => {
            skinViewer.dispose();
        };
    }, [dimensions.width, dimensions.height]);
    
    useEffect(() => {
        if (viewer && skinUrl) {
            viewer.loadSkin(skinUrl).catch(error => {
                console.error("Error loading skin:", error);
            });
        }
    }, [skinUrl, viewer]);
    
    return (
        <div 
            ref={containerRef} 
            className={`w-full h-full ${className}`} 
        />
    );
};

export default MinecraftSkinViewer;