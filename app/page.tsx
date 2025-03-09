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
	const [notificationClosed, setNotificationClosed] = React.useState(true);

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

	const handleDownloadImage = (imageUrl: string) => {
		const byteString = atob(imageUrl.split(',')[1]);
		const mimeString = imageUrl.split(',')[0].split(':')[1].split(';')[0];
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		const blob = new Blob([ab], { type: mimeString });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "skin.png";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(link.href);
	};

	const getCookie = (name: string): string | null => {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		if (match) return match[2];
		return null;
	};

	const setCookie = (name: string, value: string, days: number = 365): void => {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
	};
	
	React.useEffect(() => {
		if (typeof document !== 'undefined') {
			const notificationShown = getCookie('notificationShown');
			if (!notificationShown) {
				setNotificationClosed(false);
			}
		}
	}, []);

	return (
		<main className="flex flex-col md:flex-row items-center justify-center gap-2 h-screen p-4 bg-black">
			{!notificationClosed && (
				<div className="fixed top-0 left-0 w-full bg-blue-600 text-white py-2 px-4 text-center z-50 shadow-md">
					All images are stored locally in your browser. They will be deleted if you clear your browser data.
					<button 
						className="ml-4 px-2 py-0.5 bg-blue-700 rounded hover:bg-blue-800 hover:cursor-pointer"
						onClick={() => {
							setNotificationClosed(true);
							setCookie('notificationShown', 'true');
						}}
					>
						✕
					</button>
				</div>
			)}
			
			<div className="md:w-[30%] w-full h-[40vh] md:h-full flex flex-col items-center justify-center border-1 border-white rounded-md md:rounded-l-xl relative">
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
			<div className="md:w-[70%] w-full h-[60vh] md:h-full flex items-center justify-center border-1 border-white rounded-md md:rounded-r-xl relative">
				<Library
					images={images.map(img => img.data)}
					onSelectImage={(imageUrl) => {
						handleImageClick(imageUrl);
					}}
					onDeleteImage={handleDeleteImage}
					onDownloadImage={handleDownloadImage}
					className="absolute inset-0 w-full h-full"
				/>
				<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
					<ImageUploader onUpload={handleImageUpload} />
				</div>
			</div>
		</main>
	);
}