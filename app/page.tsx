'use client';

import ImageUploader from "@/app/components/upload";

export default function Home() {
  return (
    <main className="flex flex-row items-center justify-center gap-2 h-screen p-4 bg-black">
        <div className="flex flex-col grow-3 h-full items-center justify-center border-dashed border-2 rounded-l-xl">
          
          
        </div>
        <div className="flex grow-7 h-full items-center justify-center border-dashed border-2 rounded-r-xl">
          <ImageUploader />
        </div>
    </main>
  );
}
