'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/Web-Builder/Components/ui/card';
import { Input } from '@/Web-Builder/Components/ui/input';
import { Label } from '@/Web-Builder/Components/ui/label';
import { Textarea } from '@/Web-Builder/Components/ui/textarea';
import { Button } from '@/Web-Builder/Components/ui/button';
import { useEffect, useState, useTransition } from 'react';
import { X, LoaderCircle, WrapText, Brush, Ruler, Palette, Type, AlignLeft, AlignCenter, AlignRight, Sparkles } from 'lucide-react';
export function EditorPanel({ element, onClose, onUpdate }) {
  const [isPending, startTransition] = useTransition();
  const [textContent, setTextContent] = useState('');
  const [classNames, setClassNames] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [padding, setPadding] = useState('');
  const [margin, setMargin] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [borderRadius, setBorderRadius] = useState('');
  const [opacity, setOpacity] = useState('100');
  const [fontSize, setFontSize] = useState('');
  const [fontWeight, setFontWeight] = useState('');
  const [lineHeight, setLineHeight] = useState('');
  const [letterSpacing, setLetterSpacing] = useState('');
  useEffect(() => {
    if (element) {
      setTextContent(element.textContent);
      setClassNames(element.classNames);
    }
  }, [element]);
  if (!element) return null;
  const sendMutation = (mutation) => {
    if (!mutation || !element.path) return;
    startTransition(() => {
      onUpdate(element.path, mutation);
    });
  };
  const handleStyleMutation = (property, value) => {
    if (!value.trim()) return;
    sendMutation({ type: 'style', property, value });
  };
  const isUpdating = isPending;
  return (
    <div className="absolute top-0 left-0 z-10 h-full w-[340px] bg-zinc-950 p-4 transition-transform transform-gpu animate-in slide-in-from-left-full duration-300 border-r border-zinc-800">
      <Card className="h-full shadow-xl flex flex-col bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-base font-headline">Edit Element</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 p-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="tag-name" className="text-xs text-zinc-400">Tag</Label>
            <Input id="tag-name" value={`<${element.tagName.toLowerCase()}>`} disabled className="font-mono text-sm bg-zinc-950/50 border-zinc-800 text-zinc-300" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="text-content" className="text-zinc-300">Text Content</Label>
            <Textarea
              id="text-content"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={3}
              disabled={isUpdating}
              className="bg-zinc-950/50 border-zinc-800 focus-visible:ring-zinc-700 text-zinc-200 resize-none"
            />
            <Button size="sm" onClick={() => sendMutation({ type: 'text', value: textContent })} disabled={isUpdating || !textContent.trim()} className="w-full">
              {isUpdating ? <LoaderCircle className="animate-spin" /> : <WrapText />}
              Update Text
            </Button>
          </div>
          <div className="space-y-3">
            <Label htmlFor="class-names" className="text-zinc-300">Tailwind Classes</Label>
            <Textarea
              id="class-names"
              value={classNames}
              onChange={(e) => setClassNames(e.target.value)}
              rows={4}
              disabled={isUpdating}
              className="font-mono text-xs bg-zinc-950/50 border-zinc-800 focus-visible:ring-zinc-700 text-zinc-200 resize-none"
            />
            <Button size="sm" onClick={() => sendMutation({ type: 'classes', value: classNames })} disabled={isUpdating || !classNames.trim()} className="w-full">
              {isUpdating ? <LoaderCircle className="animate-spin" /> : <Brush />}
              Update Classes
            </Button>
          </div>
          <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/30 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <Ruler className="h-4 w-4" /> Layout
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-400">Width</Label>
                <Input value={width} onChange={(e) => setWidth(e.target.value)} placeholder="e.g. 320px / w-full" disabled={isUpdating} className="bg-zinc-950/50 border-zinc-800 text-zinc-200 h-8 text-xs" />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Height</Label>
                <Input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="auto" disabled={isUpdating} className="bg-zinc-950/50 border-zinc-800 text-zinc-200 h-8 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-400">Padding</Label>
                <Input value={padding} onChange={(e) => setPadding(e.target.value)} placeholder="e.g. px-6 py-3" disabled={isUpdating} className="bg-zinc-950/50 border-zinc-800 text-zinc-200 h-8 text-xs" />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Margin</Label>
                <Input value={margin} onChange={(e) => setMargin(e.target.value)} placeholder="e.g. mt-8" disabled={isUpdating} className="bg-zinc-950/50 border-zinc-800 text-zinc-200 h-8 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" disabled={!width.trim() || isUpdating} onClick={() => handleStyleMutation('width', width)} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Apply width</Button>
              <Button variant="secondary" size="sm" disabled={!height.trim() || isUpdating} onClick={() => handleStyleMutation('height', height)} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Apply height</Button>
              <Button variant="secondary" size="sm" disabled={!padding.trim() || isUpdating} onClick={() => handleStyleMutation('padding', padding)} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Apply padding</Button>
              <Button variant="secondary" size="sm" disabled={!margin.trim() || isUpdating} onClick={() => handleStyleMutation('margin', margin)} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Apply margin</Button>
            </div>
          </div>
          <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/30 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <Palette className="h-4 w-4" /> Appearance
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-400">Background</Label>
                <div className="flex gap-2">
                  <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} disabled={isUpdating} className="h-8 w-8 p-0 border-zinc-800 bg-transparent cursor-pointer" />
                  <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 text-xs bg-zinc-950/50 border-zinc-800 text-zinc-200" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Text</Label>
                <div className="flex gap-2">
                  <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} disabled={isUpdating} className="h-8 w-8 p-0 border-zinc-800 bg-transparent cursor-pointer" />
                  <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 text-xs bg-zinc-950/50 border-zinc-800 text-zinc-200" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-400">Border radius</Label>
                <Input value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} placeholder="e.g. 12px" disabled={isUpdating} className="bg-zinc-950/50 border-zinc-800 text-zinc-200 h-8 text-xs" />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Opacity %</Label>
                <Input type="number" min={0} max={100} value={opacity} onChange={(e) => setOpacity(e.target.value)} disabled={isUpdating} className="bg-zinc-950/50 border-zinc-800 text-zinc-200 h-8 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" disabled={isUpdating} onClick={() => handleStyleMutation('backgroundColor', bgColor)} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Background</Button>
              <Button variant="secondary" size="sm" disabled={isUpdating} onClick={() => handleStyleMutation('color', textColor)} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Text color</Button>
              <Button variant="secondary" size="sm" disabled={!borderRadius.trim() || isUpdating} onClick={() => handleStyleMutation('borderRadius', borderRadius)} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Corner radius</Button>
              <Button variant="secondary" size="sm" disabled={!opacity || isUpdating} onClick={() => handleStyleMutation('opacity', opacity)} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Opacity</Button>
            </div>
          </div>
          <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/30 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <Type className="h-4 w-4" /> Typography
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-400">Font size</Label>
                <Input value={fontSize} onChange={(e) => setFontSize(e.target.value)} placeholder="e.g. 18px" disabled={isUpdating} className="bg-zinc-950/50 border-zinc-800 text-zinc-200 h-8 text-xs" />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Font weight</Label>
                <Input value={fontWeight} onChange={(e) => setFontWeight(e.target.value)} placeholder="e.g. 600" disabled={isUpdating} className="bg-zinc-950/50 border-zinc-800 text-zinc-200 h-8 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-400">Line height</Label>
                <Input value={lineHeight} onChange={(e) => setLineHeight(e.target.value)} placeholder="e.g. 1.5" disabled={isUpdating} className="bg-zinc-950/50 border-zinc-800 text-zinc-200 h-8 text-xs" />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Letter spacing</Label>
                <Input value={letterSpacing} onChange={(e) => setLetterSpacing(e.target.value)} placeholder="e.g. 0.02em" disabled={isUpdating} className="bg-zinc-950/50 border-zinc-800 text-zinc-200 h-8 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" disabled={!fontSize.trim() || isUpdating} onClick={() => handleStyleMutation('fontSize', fontSize)} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Apply font size</Button>
              <Button variant="secondary" size="sm" disabled={!fontWeight.trim() || isUpdating} onClick={() => handleStyleMutation('fontWeight', fontWeight)} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Apply weight</Button>
              <Button variant="secondary" size="sm" disabled={!lineHeight.trim() || isUpdating} onClick={() => handleStyleMutation('lineHeight', lineHeight)} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Line height</Button>
              <Button variant="secondary" size="sm" disabled={!letterSpacing.trim() || isUpdating} onClick={() => handleStyleMutation('letterSpacing', letterSpacing)} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Letter spacing</Button>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
              <span>Alignment</span>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="icon" disabled={isUpdating} onClick={() => sendMutation({ type: 'align', value: 'left' })} className="hover:bg-zinc-800 hover:text-white"> <AlignLeft className="h-4 w-4" /> </Button>
                <Button type="button" variant="ghost" size="icon" disabled={isUpdating} onClick={() => sendMutation({ type: 'align', value: 'center' })} className="hover:bg-zinc-800 hover:text-white"> <AlignCenter className="h-4 w-4" /> </Button>
                <Button type="button" variant="ghost" size="icon" disabled={isUpdating} onClick={() => sendMutation({ type: 'align', value: 'right' })} className="hover:bg-zinc-800 hover:text-white"> <AlignRight className="h-4 w-4" /> </Button>
              </div>
            </div>
          </div>
          <div className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-950/30 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <Sparkles className="h-4 w-4" /> Quick styling
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" disabled={isUpdating} onClick={() => sendMutation({ type: 'preset', value: 'gradient' })} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Gradient bg</Button>
              <Button variant="secondary" size="sm" disabled={isUpdating} onClick={() => sendMutation({ type: 'preset', value: 'shadow' })} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Drop shadow</Button>
              <Button variant="secondary" size="sm" disabled={isUpdating} onClick={() => sendMutation({ type: 'preset', value: 'border' })} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Border</Button>
              <Button variant="secondary" size="sm" disabled={isUpdating} onClick={() => sendMutation({ type: 'preset', value: 'glass' })} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Glass effect</Button>
              <Button variant="secondary" size="sm" disabled={isUpdating} onClick={() => sendMutation({ type: 'preset', value: 'pill' })} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Pill shape</Button>
              <Button variant="secondary" size="sm" disabled={isUpdating} onClick={() => sendMutation({ type: 'preset', value: 'hover' })} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 h-7 text-xs">Hover animate</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}