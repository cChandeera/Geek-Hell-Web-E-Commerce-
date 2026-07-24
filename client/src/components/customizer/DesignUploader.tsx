import React, { useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useCustomizerStore } from '../../store/customizerStore';

export const DesignUploader: React.FC = () => {
  const uploadedDesign = useCustomizerStore((s) => s.uploadedDesign);
  const setDesign = useCustomizerStore((s) => s.setDesign);
  const removeDesign = useCustomizerStore((s) => s.removeDesign);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setDesign(result);
        }
      };
      reader.readAsDataURL(file);
    },
    [setDesign]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-text-muted">
        Custom Design
      </span>

      {!uploadedDesign ? (
        /* Drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/[0.03] transition-all duration-300 select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
            <Upload className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors duration-300" />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-text-secondary">
              Drop your design here
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              PNG, JPG, SVG — Max 5MB
            </p>
          </div>
        </div>
      ) : (
        /* Preview */
        <div className="relative rounded-xl border border-white/10 overflow-hidden bg-white/[0.02]">
          <img
            src={uploadedDesign}
            alt="Uploaded design"
            className="w-full h-32 object-contain p-3"
          />
          <button
            onClick={removeDesign}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-danger/80 hover:bg-danger flex items-center justify-center text-white cursor-pointer transition-colors duration-200"
            title="Remove design"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="px-3 py-2 border-t border-white/5 flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-[10px] text-text-secondary font-medium truncate">
              Design uploaded
            </span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};
