import React from 'react';
import { useCustomizerStore } from '../../store/customizerStore';

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (val: number) => void;
}

const SliderRow: React.FC<SliderRowProps> = ({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
        {label}
      </span>
      <span className="text-[10px] font-bold text-text-muted tabular-nums">
        {displayValue}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(229,9,20,0.4)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:hover:scale-125
        [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(229,9,20,0.4)] [&::-moz-range-thumb]:cursor-pointer"
    />
  </div>
);

export const DesignControls: React.FC = () => {
  const uploadedDesign = useCustomizerStore((s) => s.uploadedDesign);
  const designScale = useCustomizerStore((s) => s.designScale);
  const designRotation = useCustomizerStore((s) => s.designRotation);
  const designPositionX = useCustomizerStore((s) => s.designPositionX);
  const designPositionY = useCustomizerStore((s) => s.designPositionY);
  const setDesignScale = useCustomizerStore((s) => s.setDesignScale);
  const setDesignRotation = useCustomizerStore((s) => s.setDesignRotation);
  const setDesignPosition = useCustomizerStore((s) => s.setDesignPosition);

  // Only show controls if a design is uploaded
  if (!uploadedDesign) return null;

  return (
    <div className="flex flex-col gap-4">
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-text-muted">
        Design Adjustments
      </span>

      <SliderRow
        label="Scale"
        value={designScale}
        min={0.05}
        max={0.5}
        step={0.005}
        displayValue={`${Math.round(designScale * 100)}%`}
        onChange={setDesignScale}
      />

      <SliderRow
        label="Rotation"
        value={designRotation}
        min={0}
        max={360}
        step={1}
        displayValue={`${Math.round(designRotation)}°`}
        onChange={setDesignRotation}
      />

      <SliderRow
        label="Position X"
        value={designPositionX}
        min={-0.2}
        max={0.2}
        step={0.005}
        displayValue={designPositionX.toFixed(3)}
        onChange={(val) => setDesignPosition(val, designPositionY)}
      />

      <SliderRow
        label="Position Y"
        value={designPositionY}
        min={-0.2}
        max={0.2}
        step={0.005}
        displayValue={designPositionY.toFixed(3)}
        onChange={(val) => setDesignPosition(designPositionX, val)}
      />
    </div>
  );
};
