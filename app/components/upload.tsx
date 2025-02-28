"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
	onUpload: (imageData: string) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			processFiles(e.target.files);
		}
	};

	const processFiles = (fileList: FileList) => {
		Array.from(fileList).forEach((file) => {
			if (!file.type.startsWith("image/")) return;

			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					const base64String = e.target.result.toString();
					onUpload(base64String);
				}
			};
			reader.readAsDataURL(file);
		});
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		if (e.dataTransfer.files) {
			processFiles(e.dataTransfer.files);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="min-w-36 max-w-96 flex items-end justify-center h-full w-full">
			<Card
				className={cn(
					"border-2 border-dashed mb-6 bg-black",
					isDragging ? "border-purple-500 bg-muted/20" : "border-white"
				)}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<CardContent className="flex flex-col items-center">
					<div className="flex items-center">
						<UploadCloud className="h-5 w-5 mr-3 text-white" />
						<p className="text-xs text-white">
							Drag and drop skin files or select files
						</p>
					</div>
					<Button
						onClick={triggerFileInput}
						variant="secondary"
						size="sm"
						className="mt-2 bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800"
					>
						<Upload className="mr-1 h-3 w-3" />
						Browse
					</Button>
					<Input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						multiple
						className="hidden"
						onChange={handleFileChange}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
