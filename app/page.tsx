"use client";

import ImageUploader from "@/app/components/upload";
import Library from "@/app/components/library";
import MinecraftSkinViewer from "@/app/components/skinviewer";
import React from "react";
import { openDB, IDBPDatabase } from 'idb';
import { toast } from "sonner";

let dbPromise: IDBPDatabase | null = null;

export default function Home() {
    const [images, setImages] = React.useState<Array<{id?: number, data: string}>>([]);    
    const [isClient, setIsClient] = React.useState(false);
	const [selectedSkin, setSelectedSkin] = React.useState<string | undefined>(undefined);

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
						toast.error("Error: Refresh page to try again");
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

	const handleImageUpload = async (base64Image: string) => {
		try {
			if (!dbPromise) {
				toast.error("Error: Refresh page to try again");
				console.error("Database not initialized");
				return;
			}
			
			const tx = dbPromise.transaction('images', 'readwrite');
			const store = tx.objectStore('images');

			const id = await store.add({ data: base64Image });
            await tx.done;
            setImages(prev => [...prev, { id: typeof id === 'number' ? id : undefined, data: base64Image }]);
		} catch (error) {
			console.error("Failed to save image to IndexedDB:", error);
		}
	};
	
	const handleDeleteImage = async (imageToDelete: string) => {
		try {
			if (!dbPromise) {
				toast.error("Error: Refresh page to try again");
				console.error("Database not initialized");
				return;
			}
			
			const allImages = await dbPromise.getAll('images');
			const imageToRemove = allImages.find(img => img.data === imageToDelete);
			
			if (imageToRemove?.id) {
				const tx = dbPromise.transaction('images', 'readwrite');
				const store = tx.objectStore('images');
				await store.delete(imageToRemove.id);
				await tx.done;
				
				setImages(prev => prev.filter(image => image.data !== imageToDelete));
			}
		} catch (error) {
			console.error("Failed to delete image from IndexedDB:", error);
		}
	};

    const handleImageClick = (imageUrl: string) => {
		console.log("Selected skin: ", imageUrl);
        setSelectedSkin(imageUrl);
    };

    return (
		<main className="flex flex-col md:flex-row items-center justify-center gap-2 h-screen p-4 bg-black">
			<div className="md:w-[30%] w-full h-[40vh] md:h-full flex flex-col items-center justify-center border-dashed border-2 rounded-md md:rounded-l-xl relative">
				<div className="absolute inset-0 w-full h-full p-4">
					<MinecraftSkinViewer 
						skinUrl={selectedSkin}
						className="rounded-md overflow-hidden"
					/>
				</div>
				{!selectedSkin && (
					<p className="text-white mt-4 relative z-10">Select a skin from the library</p>
				)}
			</div>
			<div className="md:w-[70%] w-full h-[60vh] md:h-full flex items-center justify-center border-dashed border-2 rounded-md md:rounded-r-xl relative">
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