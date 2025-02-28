import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button"

interface LibraryProps {
	images: string[];
	onSelectImage?: (imageUrl: string) => void;
	onDeleteImage?: (imageName: string) => void;
	className?: string;
}

const Library: React.FC<LibraryProps> = ({ images, onSelectImage, onDeleteImage, className }) => {
	return (
		<div className={`library-container h-full overflow-y-auto ${className || ''}`}>
			<div className="grid grid-cols-5 gap-2.5 p-2.5 mb-40">
				{images.map((imageUrl, index) => (
					<div key={index} className="image-item">
						<div className="cursor-pointer"	onClick={() => onSelectImage?.(imageUrl)}>
							<Image 
								src={imageUrl} 
								alt={`Library image ${index}`}
								width={100}
								height={100}
								className="w-full h-auto"
							/>
						</div>
						<div className="flex justify-center mt-1">
							<Button className='bg-purple-600 hover:bg-purple-700 active:bg-purple-800
								cursor-pointer' 
								onClick={(e) => {
									e.stopPropagation();
									onDeleteImage?.(imageUrl);
								}}>
								Delete
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Library;
