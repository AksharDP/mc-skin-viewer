import React, { memo, useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";

interface ImageItemProps {
    imageUrl: string;
    index: number;
    onSelectImage?: (imageUrl: string) => void;
    onDeleteImage?: (imageName: string) => void;
}

const ImageItem = memo(({ imageUrl, index, onSelectImage, onDeleteImage }: ImageItemProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    
    return (
        <div 
            className="w-fit rounded-md overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div 
                className="bg-gray-800 cursor-pointer border border-gray-700 border-b-0"
                onClick={() => onSelectImage?.(imageUrl)}
            >
                <div className="relative w-[128px] h-[128px] flex items-center justify-center p-2">
                    <Image 
                        src={imageUrl} 
                        alt={`Image ${index}`}
                        quality={100}
                        fill
                        className={`object-contain transition-all duration-300 p-2 ${
                            isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        } ${isHovering ? 'brightness-110' : 'brightness-100'}`}
                        onLoadingComplete={() => setIsLoading(false)}
                        priority={index < 5}
                        loading={index < 10 ? "eager" : "lazy"}
                    />
                            
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex justify-center py-2 bg-gray-800 border-gray-600 border-t-2">
                <Button 
                    className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs px-4 py-1
                        transition-all duration-200 hover:shadow-md hover:shadow-purple-900/30 hover: cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteImage?.(imageUrl);
                    }}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
});

ImageItem.displayName = 'ImageItem';

export default ImageItem;