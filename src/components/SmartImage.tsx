import React, { useState, useRef } from 'react';
import { Camera, RotateCcw, Image as ImageIcon } from 'lucide-react';

interface SmartImageProps {
  src: string;
  customKey: string;
  customImages: Record<string, string>;
  onUploadCustomImage?: (key: string, dataUrl: string) => void;
  onResetCustomImage?: (key: string) => void;
  alt: string;
  className?: string;
  containerClassName?: string;
  allowUpload?: boolean;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  customKey,
  customImages,
  onUploadCustomImage,
  onResetCustomImage,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full h-full overflow-hidden bg-[#F6F6F6]',
  allowUpload = true,
}) => {
  const [loadError, setLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeSrc = customImages[customKey] || src;
  const isCustom = Boolean(customImages[customKey]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadCustomImage) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLoadError(false);
        onUploadCustomImage(customKey, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`group/img ${containerClassName}`}>
      {!loadError ? (
        <img
          src={activeSrc}
          alt={alt}
          onError={() => setLoadError(true)}
          className={className}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-400 p-4 text-center">
          <ImageIcon className="w-8 h-8 mb-1.5 text-zinc-400" />
          <p className="text-[11px] font-medium text-zinc-600 line-clamp-1">{alt}</p>
          <p className="text-[10px] text-zinc-400">Click upload to set photo</p>
        </div>
      )}

      {allowUpload && onUploadCustomImage && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 opacity-0 group-hover/img:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              title="Upload reference photo for this item"
              className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-xs px-2 py-1 text-[10px] font-semibold text-zinc-800 shadow-md hover:bg-white hover:text-[#FF5722] cursor-pointer"
            >
              <Camera className="w-3 h-3 text-[#FF5722]" />
              <span>{isCustom ? 'Change' : 'Swap'}</span>
            </button>
            {isCustom && onResetCustomImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onResetCustomImage(customKey);
                }}
                title="Reset to default photo"
                className="p-1 rounded-full bg-white/90 backdrop-blur-xs text-zinc-600 shadow-md hover:bg-white cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
