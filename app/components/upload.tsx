"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

interface ImageUploaderProps {
    onUpload: (base64Image: string) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateImageDimensions = (file: File): Promise<ValidationResult> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const errors: string[] = [];
                
                const isSquare = img.width === img.height;
                if (!isSquare) {
                    errors.push(`Wrong aspect ratio: ${file.name} (${img.width}x${img.height})`);
                }
                
                const isSkin = img.width === 64 && img.height === 64;
                if (!isSkin) {
                    errors.push(`Wrong image size: ${file.name} (${img.width}x${img.height}, should be 64x64)`);
                }

                resolve({
                    isValid: isSquare && isSkin,
                    errors
                });
                
                URL.revokeObjectURL(img.src);
            };
            
            img.onerror = () => {
                resolve({
                    isValid: false,
                    errors: [`Failed to load image: ${file.name}`]
                });
                URL.revokeObjectURL(img.src);
            };
            
            img.src = URL.createObjectURL(file);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            await processFiles(e.target.files);
            e.target.value = '';
        }
    };

    const processFiles = async (fileList: FileList) => {
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            if (!file.type.startsWith("image/")) {
                toast.error(`Not an image file: ${file.name}`);
                continue;
            }
            
            const validation = await validateImageDimensions(file);
            
            if (!validation.isValid) {
                validation.errors.forEach(error => {
                    toast.error(error);
                });
                continue;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    onUpload(e.target.result.toString());
                    toast.success(`${file.name} uploaded successfully`);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files) {
            await processFiles(e.dataTransfer.files);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="min-w-36 max-w-96 flex items-end justify-center h-full w-full">
            <Card
                className={cn(
                    "border-2 border-dashed bg-black",
                    isDragging ? "border-purple-500 bg-muted/20" : "border-white"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <CardContent className="flex flex-col items-center p-4">
                    <div className="flex items-center">
                        <UploadCloud className="h-5 w-5 mr-3 text-white" />
                        <p className="text-xs text-white">
                            Drag and drop Minecraft skin files (64x64)
                        </p>
                    </div>
                    <Button
                        onClick={triggerFileInput}
                        variant="secondary"
                        size="sm"
                        className="mt-2 bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800
                            cursor-pointer"
                    >
                        <Upload className="mr-1 h-3 w-3" />
                        Browse
                    </Button>
                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </CardContent>
            </Card>
        </div>
    );
}