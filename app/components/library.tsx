import React from 'react';
import ImageItem from './ImageItem';

interface LibraryProps {
    images: string[];
    onSelectImage?: (imageUrl: string) => void;
    onDeleteImage?: (imageName: string) => void;
	onDownloadImage?: (imageUrl: string) => void;
    className?: string;
}

const Library: React.FC<LibraryProps> = ({ images, onSelectImage, onDeleteImage, onDownloadImage, className }) => {
    return (
        <div className={`library-container h-full overflow-y-auto ${className || ''}`}>
            <div className="grid grid-cols-5 gap-2.5 p-2.5 mb-40">
                {images.map((imageUrl, index) => (
                    <ImageItem 
                        key={imageUrl + index}
                        imageUrl={imageUrl}
                        index={index}
                        onSelectImage={onSelectImage}
                        onDeleteImage={onDeleteImage}
						onDownloadImage={onDownloadImage}
                    />
                ))}
            </div>
        </div>
    );
};

export default Library;