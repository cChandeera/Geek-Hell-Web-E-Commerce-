import React, { Component, ErrorInfo, ReactNode } from 'react';
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
        {/* Loader shown during glb model network buffer loading */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none bg-transparent">
          <Loader variant="pulse-ring" size="md" themeColor={fallbackColorTheme} />
        </div>
        
        {/* 3D Canvas element overlay */}
        <div className="w-full h-full relative z-10">
          <ShirtCanvas />
        </div>
      </CanvasErrorBoundary>
    </div>
  );
};
export default ShirtViewer;
