"use client";

import ImageUploader from "@/app/components/upload";
import Library from "@/app/components/library";
import React from "react";

export default function Home() {
    const [images, setImages] = React.useState<string[]>(() => {
        if (typeof window !== "undefined") {
            const storedImages = localStorage.getItem("uploaded-images");
            return storedImages ? JSON.parse(storedImages) : [];
        }
        return [];
    });

    React.useEffect(() => {
        localStorage.setItem("uploaded-images", JSON.stringify(images));
    }, [images]);

    const handleImageUpload = (imageData: string) => {
        setImages(prev => [...prev, imageData]);
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
                    className="inset-0 w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <ImageUploader onUpload={handleImageUpload} />
                </div>
            </div>
        </main>
    );
}