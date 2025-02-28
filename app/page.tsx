"use client";

import ImageUploader from "@/app/components/upload";
import Library from "@/app/components/library";
import React from "react";

export default function Home() {
    const [images, setImages] = React.useState<string[]>([]);    
    const [isClient, setIsClient] = React.useState(false);
    
    React.useEffect(() => {
        setIsClient(true);
    }, []);
    
    React.useEffect(() => {
        if (isClient) {
            const storedImages = localStorage.getItem("uploaded-images");
            if (storedImages) {
                setImages(JSON.parse(storedImages));
            }
        }
    }, [isClient]);
    
    React.useEffect(() => {
        if (isClient) {
            localStorage.setItem("uploaded-images", JSON.stringify(images));
        }
    }, [images, isClient]);

    const handleImageUpload = (imageData: string) => {
        setImages(prev => [...prev, imageData]);
    };

    const handleDeleteImage = (imageToDelete: string) => {
        setImages(prev => prev.filter(image => image !== imageToDelete));
    };

    return (
        <main className="flex flex-row items-center justify-center gap-2 h-screen p-4 bg-black">
            <div className="flex flex-col w-[30%] h-full items-center justify-center border-dashed border-2 rounded-l-xl"></div>
            <div className="flex w-[70%] h-full items-center justify-center border-dashed border-2 rounded-r-xl relative">
                <Library
                    images={images}
                    onSelectImage={(imageUrl) => {
                        setImages((prev) => [...prev, imageUrl]);
                    }}
                    onDeleteImage={handleDeleteImage}
                    className="absolute inset-0 w-full h-full"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                    <ImageUploader onUpload={handleImageUpload} />
                </div>
            </div>
        </main>
    );
}