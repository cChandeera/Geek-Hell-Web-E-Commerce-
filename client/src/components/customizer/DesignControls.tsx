import React from 'react';
import { Eye, EyeOff, ArrowUp, ArrowDown, Copy, Trash, Plus } from 'lucide-react';
import { useCustomizerStore } from '../../store/customizerStore';
import { cn } from '../../utils/cn';

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
  const currentView = useCustomizerStore((s) => s.currentView);
  const frontDesign = useCustomizerStore((s) => s.frontDesign);
  const backDesign = useCustomizerStore((s) => s.backDesign);
  const activeDesign = currentView === 'front' ? frontDesign : backDesign;

  // Active layer properties
  const designScale = useCustomizerStore((s) => s.designScale);
  const designRotation = useCustomizerStore((s) => s.designRotation);
  const designPositionX = useCustomizerStore((s) => s.designPositionX);
  const designPositionY = useCustomizerStore((s) => s.designPositionY);
  const designFlipX = useCustomizerStore((s) => s.designFlipX);
  const designFlipY = useCustomizerStore((s) => s.designFlipY);
  const designOpacity = useCustomizerStore((s) => s.designOpacity);

  // Setters
  const setDesignScale = useCustomizerStore((s) => s.setDesignScale);
  const setDesignRotation = useCustomizerStore((s) => s.setDesignRotation);
  const setDesignPosition = useCustomizerStore((s) => s.setDesignPosition);
  const setDesignFlipX = useCustomizerStore((s) => s.setDesignFlipX);
  const setDesignFlipY = useCustomizerStore((s) => s.setDesignFlipY);
  const setDesignOpacity = useCustomizerStore((s) => s.setDesignOpacity);
  const resetDesign = useCustomizerStore((s) => s.resetDesign);

  // Layer Management Actions
  const addLayer = useCustomizerStore((s) => s.addLayer);
  const deleteLayer = useCustomizerStore((s) => s.deleteLayer);
  const duplicateLayer = useCustomizerStore((s) => s.duplicateLayer);
  const toggleLayerVisibility = useCustomizerStore((s) => s.toggleLayerVisibility);
  const moveLayerUp = useCustomizerStore((s) => s.moveLayerUp);
  const moveLayerDown = useCustomizerStore((s) => s.moveLayerDown);
  const selectLayer = useCustomizerStore((s) => s.selectLayer);

  const handleAddNewLayer = () => {
    // Default to the first ironman preset logo
    addLayer('/designs/m-ironman-1.png');
  };

  const hasActiveLayer = activeDesign.activeLayerId !== null;

  return (
    <div className="flex flex-col gap-5">
      {/* Design Layers Panel */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-text-muted">
            Design Layers ({activeDesign.layers.length})
          </span>
          <button
            onClick={handleAddNewLayer}
            className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-primary hover:text-white px-2 py-1 border border-primary/20 bg-primary/5 hover:bg-primary/20 rounded-lg transition-all duration-300 cursor-pointer select-none"
          >
            <Plus className="w-2.5 h-2.5" />
            Add Layer
          </button>
        </div>

        <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto border border-white/5 rounded-xl p-2 bg-white/[0.01]">
          {activeDesign.layers.length === 0 ? (
            <div className="text-center py-5 text-[10px] text-text-muted select-none">
              No design layers yet. Select a design below.
            </div>
          ) : (
            activeDesign.layers.map((layer, idx) => {
              const isSelected = activeDesign.activeLayerId === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => selectLayer(layer.id)}
                  className={cn(
                    'flex items-center justify-between p-2 rounded-lg border text-[10px] cursor-pointer transition-all duration-300 select-none',
                    isSelected
                      ? 'border-primary/40 bg-primary/10 text-white shadow-[0_0_8px_rgba(229,9,20,0.1)]'
                      : 'border-white/5 bg-white/[0.01] text-text-secondary hover:bg-white/[0.02] hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <img
                      src={layer.url}
                      className="w-5 h-5 object-contain rounded bg-black/40 border border-white/5 flex-shrink-0"
                      alt="layer-thumbnail"
                    />
                    <span className="font-semibold truncate">{layer.name}</span>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Hide/Show */}
                    <button
                      onClick={() => toggleLayerVisibility(layer.id)}
                      className={cn(
                        'p-1 rounded hover:bg-white/5 transition-colors duration-200 cursor-pointer',
                        layer.visible ? 'text-text-muted hover:text-white' : 'text-danger'
                      )}
                      title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                    >
                      {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>

                    {/* Move Up (Bring Forward) */}
                    <button
                      onClick={() => moveLayerUp(layer.id)}
                      disabled={idx === activeDesign.layers.length - 1}
                      className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-white disabled:opacity-20 disabled:hover:text-text-muted disabled:hover:bg-transparent transition-colors duration-200 cursor-pointer"
                      title="Bring Forward"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>

                    {/* Move Down (Send Backward) */}
                    <button
                      onClick={() => moveLayerDown(layer.id)}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-white disabled:opacity-20 disabled:hover:text-text-muted disabled:hover:bg-transparent transition-colors duration-200 cursor-pointer"
                      title="Send Backward"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => duplicateLayer(layer.id)}
                      className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-white transition-colors duration-200 cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteLayer(layer.id)}
                      className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-danger transition-colors duration-200 cursor-pointer"
                      title="Delete"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Design Adjustments Slider Panel (only visible if active layer selected) */}
      {hasActiveLayer && (
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-text-muted border-t border-white/5 pt-4">
            Layer Adjustments
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
            min={-180}
            max={180}
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

          <SliderRow
            label="Opacity"
            value={designOpacity}
            min={0.0}
            max={1.0}
            step={0.01}
            displayValue={`${Math.round(designOpacity * 100)}%`}
            onChange={setDesignOpacity}
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setDesignFlipX(!designFlipX)}
              className={cn(
                'flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-300 cursor-pointer select-none text-center',
                designFlipX
                  ? 'border-primary bg-primary/10 text-primary shadow-[0_0_8px_rgba(229,9,20,0.15)]'
                  : 'border-white/5 bg-white/[0.02] text-text-secondary hover:text-white hover:border-white/10'
              )}
            >
              Flip H
            </button>
            <button
              onClick={() => setDesignFlipY(!designFlipY)}
              className={cn(
                'flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-300 cursor-pointer select-none text-center',
                designFlipY
                  ? 'border-primary bg-primary/10 text-primary shadow-[0_0_8px_rgba(229,9,20,0.15)]'
                  : 'border-white/5 bg-white/[0.02] text-text-secondary hover:text-white hover:border-white/10'
              )}
            >
              Flip V
            </button>
            <button
              onClick={resetDesign}
              className="flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/5 bg-white/[0.02] text-text-muted hover:text-white hover:border-white/10 transition-all duration-300 cursor-pointer select-none text-center"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
