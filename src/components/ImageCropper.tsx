"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import { Check, X } from "lucide-react";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspect?: number;
}

export default function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
  aspect = 1, // Default to square
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteHandler = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-navy/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-cartoon w-full max-w-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b-2 border-navy flex justify-between items-center bg-cream">
          <h3 className="font-fredoka font-600 text-navy text-lg">Crop Image</h3>
          <button onClick={onCancel} className="text-navy hover:text-coral transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="relative w-full h-[400px] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
          />
        </div>

        <div className="p-4 border-t-2 border-navy bg-white">
          <div className="mb-4">
            <label className="block text-sm font-nunito font-600 text-navy mb-2">
              Zoom
            </label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-coral"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="btn-cartoon btn-white px-4 py-2 text-sm"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-cartoon btn-coral px-4 py-2 text-sm flex items-center gap-2"
              disabled={isProcessing}
            >
              <Check size={16} />
              {isProcessing ? "Saving..." : "Save Crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
