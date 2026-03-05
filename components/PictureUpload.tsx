import React, { useRef, useState } from "react";

interface PictureUploadProps {
  onChange: (file: File | null) => void;
}

const PictureUpload: React.FC<PictureUploadProps> = ({ onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="flex flex-col items-center mb-5">
      <input
        type="file"
        name="avatar"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative"
      >
        {preview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Avatar preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-teal-500/50"
            />
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-[10px]">Change</span>
            </div>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/15 hover:border-teal-500/50 flex items-center justify-center transition-colors bg-white/5">
            <svg className="w-7 h-7 text-white/20 group-hover:text-teal-400/60 transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        )}
      </button>
      <span className="text-white/20 text-[10px] mt-2 tracking-wider uppercase">
        Profile photo (optional)
      </span>
    </div>
  );
};

export default PictureUpload;
