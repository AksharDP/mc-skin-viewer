"use client";

import ImageUploader from "@/app/components/upload";
import Library from "@/app/components/library";
import React from "react";
import { openDB, IDBPDatabase } from 'idb';

let dbPromise: IDBPDatabase | null = null;


export default function Home() {
	
    const [images, setImages] = React.useState<Array<{id?: number, data: string}>>([]);    
    const [isClient, setIsClient] = React.useState(false);
    
    React.useEffect(() => {
        const initializeDb = async () => {
            try {
                dbPromise = await openDB('skinViewerDB', 1, {
                    upgrade(db) {
                        if (!db.objectStoreNames.contains('images')) {
                            db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
                        }
                    },
                });
                setIsClient(true);
            } catch (error) {
                console.error("Failed to initialize IndexedDB:", error);
            }
        };
        
        initializeDb();
    }, []);
    
    React.useEffect(() => {
        if (isClient && dbPromise) {
            const loadImages = async () => {
                try {
                    if (!dbPromise) {
                        console.error("Database not initialized");
                        return;
                    }
                    
                    const db = await dbPromise;
                    const storedImages = await db.getAll('images');
                    if (storedImages && storedImages.length > 0) {
                        setImages(storedImages);
                    }
                } catch (error) {
                    console.error("Failed to load images from IndexedDB:", error);
                }
            };
            loadImages();
        }
    }, [isClient]);
    
    React.useEffect(() => {
        if (isClient && dbPromise && images.length > 0) {
            const saveImages = async () => {
                try {
                    if (!dbPromise) {
                        console.error("Database not initialized");
                        return;
                    }
                    
                    const db = await dbPromise;
                    const tx = db.transaction('images', 'readwrite');
                    const store = tx.objectStore('images');
                    
                    await store.clear();
                    
                    for (const image of images) {
                        await store.add(image);
                    }
                    
                    await tx.done;
                } catch (error) {
                    console.error("Failed to save images to IndexedDB:", error);
                    alert("Error saving images. Please try again or delete some images.");
                }
            };
            saveImages();
        }
    }, [images, isClient]);

    const handleImageUpload = (base64Image: string) => {
        setImages(prev => [...prev, { data: base64Image }]);
    };

    const handleDeleteImage = (imageToDelete: string) => {
        setImages(prev => prev.filter(image => image.data !== imageToDelete));
    };

    const handleImageClick = (imageUrl: string) => {
        console.log(imageUrl);
    };

    return (
        <main className="flex flex-row items-center justify-center gap-2 h-screen p-4 bg-black">
            <div className="flex flex-col w-[30%] h-full items-center justify-center border-dashed border-2 rounded-l-xl"></div>
            <div className="flex w-[70%] h-full items-center justify-center border-dashed border-2 rounded-r-xl relative">
                <Library
                    images={images.map(img => img.data)}
                    onSelectImage={(imageUrl) => {
                        handleImageClick(imageUrl);
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