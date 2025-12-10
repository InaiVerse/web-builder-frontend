'use client';

import { useState } from 'react';
import { Button } from '@/Web-Builder/Components/ui/button';
import { Switch } from '@/Web-Builder/Components/ui/switch';
import { downloadProject } from '@/Web-Builder/lib/zip';
import { Download, Sparkles, Code2, Share2, Rocket, RotateCw, Undo2, Redo2, Smartphone, Tablet, Monitor } from 'lucide-react';
import { useToast } from '@/Web-Builder/hooks/use-toast';
import { cn } from '@/Web-Builder/lib/utils';

export function Header({
  htmlContent,
  cssContent,
  jsContent,
  activeView = 'preview',
  onSelectView,
  onUndo,
  onRedo,
  onRefresh,
  canUndo,
  canRedo,
  viewMode = 'desktop',
  onSelectViewMode
}) {
  const { toast } = useToast();
  const isPreviewActive = activeView === 'preview';


  const handleDownload = async () => {
    try {
      // Validate inputs before proceeding
      if (!htmlContent || !cssContent || !jsContent) {
        throw new Error('Missing required content for download');
      }

      await downloadProject(htmlContent, cssContent, jsContent);
      toast({
        title: 'Project Zipped!',
        description: 'Your project has been downloaded.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown download error';
      console.error("Failed to download project:", errorMessage, error);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: errorMessage || 'There was an error creating the zip file.',
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#16161d]/95 px-4 py-3 shadow-sm backdrop-blur-lg md:px-6">
      <div className="flex w-full items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onSelectView?.('preview')}
            className={cn(
              'flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wide transition',
              isPreviewActive
                ? 'border-white/10 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md hover:opacity-90'
                : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
            )}
          >
            <Sparkles className="h-4 w-4" />
            Design
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onSelectView?.('code')}
            className={cn(
              'flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wide transition',
              !isPreviewActive
                ? 'border-white/10 bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-md hover:opacity-90'
                : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
            )}
          >
            <Code2 className="h-4 w-4" />
            Code
          </Button>
        </div>

        <div className="flex items-center gap-1 ml-4 rounded-lg border border-white/10 bg-white/5 p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSelectViewMode?.('mobile')}
            className={cn(
              "h-7 w-7 rounded-md transition-all",
              viewMode === 'mobile' ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200"
            )}
            title="Mobile View"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSelectViewMode?.('tablet')}
            className={cn(
              "h-7 w-7 rounded-md transition-all",
              viewMode === 'tablet' ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200"
            )}
            title="Tablet View"
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSelectViewMode?.('desktop')}
            className={cn(
              "h-7 w-7 rounded-md transition-all",
              viewMode === 'desktop' ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200"
            )}
            title="Desktop View"
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 justify-center">
          <h1 className="rounded-full bg-white/5 px-6 py-2 text-sm font-semibold text-white shadow-inner">
            Web-Builder
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 mr-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo"
              className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 disabled:opacity-50"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo"
              className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 disabled:opacity-50"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              title="Refresh Preview"
              className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            onClick={handleDownload}
            variant="ghost"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-xs font-medium uppercase tracking-wide text-slate-200 hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            Download Zip
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-xs font-medium uppercase tracking-wide text-slate-200 hover:bg-white/10"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex items-center gap-2 rounded-full border border-purple-400/20 bg-gradient-to-r from-purple-500 via-indigo-500 to-fuchsia-500 px-5 text-xs font-semibold uppercase tracking-wide text-white shadow-md hover:opacity-90"
          >
            <Rocket className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
    </header>
  );
}
