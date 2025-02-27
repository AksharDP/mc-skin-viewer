"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
// import Image from "next/image";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  file: File;
}

export default function ImageUploader() {
  // const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = [];

    Array.from(fileList).forEach((file) => {
      // Only process image files
      if (!file.type.startsWith("image/")) return;

      const id = crypto.randomUUID();
      const url = URL.createObjectURL(file);

      newFiles.push({
        id,
        name: file.name,
        url,
        file,
      });
    });

    // setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Here you can add additional processing logic for the images
    // For example, sending them to an API or analyzing them
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

  // const removeFile = (id: string) => {
  //     setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
  // };

  return (
    <div className="min-w-36 max-w-96 flex items-end justify-center h-full w-full">
      <Card
        className={cn(
          "border-2 border-dashed transition-colors mb-6",
          isDragging
            ? "border-primary bg-muted/20"
            : "border-muted-foreground/25"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center">
          <div className="flex items-center">
            <UploadCloud className="h-5 w-5 text-muted-foreground mr-3" />
            <p className="text-xs text-muted-foreground">
              Drag and drop skin files or select files
            </p>
          </div>
          <Button
            onClick={triggerFileInput}
            variant="secondary"
            size="sm"
            className="bg-purple"
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
