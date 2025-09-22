'use client';

import React, { useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PluggableList } from 'unified';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { htmlToMarkdown } from '@/utils/markdown';

const sanitizedSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'table',
    'thead',
    'tbody',
    'tr',
    'td',
    'th',
    'code',
    'pre',
    'ul',
    'ol',
    'li',
  ],
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), ['className', /^language-([\w-]+)$/]],
    span: [...(defaultSchema.attributes?.span ?? []), ['className', /^token[\s\w-]*$/]],
    pre: [...(defaultSchema.attributes?.pre ?? []), ['className', /^language-([\w-]+)$/]],
    th: [...(defaultSchema.attributes?.th ?? []), ['align']],
    td: [...(defaultSchema.attributes?.td ?? []), ['align']],
  },
};

const MARKDOWN_REHYPE_PLUGINS: PluggableList = [rehypeRaw, [rehypeSanitize, sanitizedSchema]];

const BASE_CONTAINER_CLASS =
  'text-gray-800 dark:text-gray-100 leading-relaxed';

const MARKDOWN_COMPONENTS: Components = {
  h1: (props) => (
    <h1
      className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  h2: (props) => (
    <h2 className="mt-10 text-2xl font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  h4: (props) => (
    <h4 className="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  p: (props) => <p className="leading-7 text-gray-700 dark:text-gray-200" {...props} />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  ul: (props) => (
    <ul className="ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-200" {...props} />
  ),
  ol: (props) => (
    <ol className="ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-200" {...props} />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  a: (props) => (
    <a
      className="font-medium text-indigo-600 underline decoration-indigo-500/50 hover:text-indigo-700"
      {...props}
    />
  ),
  code: ({ className, children, ...rest }) => (
    <code
      className={`inline rounded bg-gray-100 px-1.5 py-[2px] text-[0.95em] font-mono text-gray-800 dark:bg-gray-700 dark:text-gray-100 ${className ?? ''}`}
      {...rest}
    >
      {children}
    </code>
  ),
  pre: ({ className, children, ...rest }) => (
    <pre
      className={`my-6 overflow-x-auto rounded-lg bg-gray-100 px-4 py-3 text-sm font-mono text-gray-900 shadow-inner dark:bg-gray-800 dark:text-gray-100 ${className ?? ''}`}
      {...rest}
    >
      {children}
    </pre>
  ),
  table: (props) => (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto border-collapse overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700" {...props} />
    </div>
  ),
  thead: (props) => (
    <thead className="bg-gray-100 text-left dark:bg-gray-800" {...props} />
  ),
  th: (props) => (
    <th className="border border-gray-200 px-3 py-2 text-sm font-semibold dark:border-gray-700" {...props} />
  ),
  td: (props) => (
    <td className="border border-gray-200 px-3 py-2 text-sm align-top dark:border-gray-700" {...props} />
  ),
  hr: (props) => <hr className="my-6 border-gray-200 dark:border-gray-700" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-4 border-indigo-400 bg-indigo-50 px-4 py-3 text-sm italic text-gray-700 dark:border-indigo-500 dark:bg-indigo-900/30 dark:text-gray-200" {...props} />
  ),
};

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const normalized = useMemo(() => {
    const trimmed = content?.trim() ?? '';

    if (!trimmed) {
      return '';
    }

    const looksLikeHtml = /<[^>]+>/.test(trimmed);

    if (looksLikeHtml) {
      return htmlToMarkdown(trimmed);
    }

    return trimmed;
  }, [content]);

  const combinedClassName = useMemo(
    () => [BASE_CONTAINER_CLASS, className].filter(Boolean).join(' '),
    [className],
  );

  return (
    <div className={combinedClassName}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={MARKDOWN_REHYPE_PLUGINS}
        components={MARKDOWN_COMPONENTS}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
}

