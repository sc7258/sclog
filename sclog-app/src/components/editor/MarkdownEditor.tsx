'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';


import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
);

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  height?: number;
};

export default function MarkdownEditor({ value, onChange, height = 400 }: MarkdownEditorProps) {
  const editorProps = useMemo(
    () => ({
      height,
      preview: 'edit' as const,
    }),
    [height],
  );

  return (
    <div data-color-mode="light" className="rounded-md border border-gray-300 shadow-sm">
      <MDEditor
        {...editorProps}
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? '')}
      />
    </div>
  );
}
