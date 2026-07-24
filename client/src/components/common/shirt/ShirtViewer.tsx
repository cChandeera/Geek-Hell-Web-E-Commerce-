import React, { Component, ErrorInfo, ReactNode, Suspense } from 'react';
import { ShirtCanvas } from './ShirtCanvas';
import { Loader } from '../Loader';

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('R3F Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/** Fallback shown while the Canvas + GLB are loading via Suspense */
const CanvasLoadingFallback: React.FC<{ themeColor: 'marvel' | 'dc' | 'default' }> = ({ themeColor }) => (
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 select-none">
    <Loader variant="pulse-ring" size="md" themeColor={themeColor} />
    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-text-secondary/60">
      Loading 3D Model…
    </span>
  </div>
);

export interface ShirtViewerProps {
  className?: string;
  fallbackColorTheme?: 'marvel' | 'dc' | 'default';
}

export const ShirtViewer: React.FC<ShirtViewerProps> = ({
  className,
  fallbackColorTheme = 'default',
}) => {
  return (
    <div className={`w-full h-full relative flex items-center justify-center ${className || ''}`}>
      <CanvasErrorBoundary
        fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 rounded-3xl border border-surface-border text-center p-6 select-none">
            <span className="text-danger font-bold text-xs uppercase tracking-widest mb-1.5">
              Load Failed
            </span>
            <span className="text-text-secondary text-xs max-w-[200px]">
              Unable to load 3D graphics. Please refresh or try again.
            </span>
          </div>
        }
      >
        {/* React Suspense wraps the entire Canvas so the loader shows INSTEAD of the canvas until ready */}
        <Suspense fallback={<CanvasLoadingFallback themeColor={fallbackColorTheme} />}>
          <div className="w-full h-full relative z-10">
            <ShirtCanvas />
          </div>
        </Suspense>
      </CanvasErrorBoundary>
    </div>
  );
};
export default ShirtViewer;
