import React from 'react';
import Image from 'next/image';

interface LibraryProps {
    images: string[];
    onSelectImage?: (imageUrl: string) => void;
    className?: string;
}

const Library: React.FC<LibraryProps> = ({ images, onSelectImage, className }) => {
    return (
        <div className={`library-container h-full overflow-y-auto ${className || ''}`}>
            <div className="grid grid-cols-5 gap-2.5 p-2.5">
                {images.map((imageUrl, index) => (
                    <div 
                        key={index} 
                        className="image-item cursor-pointer"
                        onClick={() => onSelectImage?.(imageUrl)}
                    >
                        <Image 
                            src={imageUrl} 
                            alt={`Library image ${index}`}
                            width={100}
                            height={100}
                            className="w-full h-auto"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;
