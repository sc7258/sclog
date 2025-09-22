import TurndownService from 'turndown';
import { marked } from 'marked';

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  hr: '---',
});

turndown.keep(['u']);

turndown.addRule('fencedCodeBlock', {
  filter: (node: HTMLElement) => {
    if (node.nodeName !== 'PRE') {
      return false;
    }

    const firstChild = node.firstChild as HTMLElement | null;
    return Boolean(firstChild && firstChild.nodeName === 'CODE');
  },
  replacement: (_: string, node: HTMLElement) => {
    const pre = node as HTMLElement;
    const codeElement = pre.firstChild as HTMLElement | null;

    if (!codeElement) {
      return '';
    }

    const rawText = codeElement.textContent ?? '';
    const languageMatch = codeElement.className.match(/language-([\w-]+)/i);
    const language = languageMatch ? languageMatch[1].toLowerCase() : '';

    if (language === 'markdown') {
      return `${rawText.trim()}\n`;
    }

    const fence = '```';
    const trimmed = rawText.replace(/\s+$/, '');
    return `${fence}${language ? language : ''}\n${trimmed}\n${fence}`;
  },
});

turndown.addRule('inlineCode', {
  filter: (node: HTMLElement) => {
    if (node.nodeName !== 'CODE') {
      return false;
    }

    const parent = node.parentNode as HTMLElement | null;
    if (!parent || parent.nodeName === 'PRE') {
      return false;
    }

    return true;
  },
  replacement: (content: string) => {
    const backtickCount = Math.max(1, ...Array.from(content.matchAll(/`+/g)).map((match) => match[0].length), 1);
    const ticks = '`'.repeat(backtickCount + 1);
    return `${ticks}${content}${ticks}`;
  },
});

turndown.addRule('softBreaks', {
  filter: (node: HTMLElement) => node.nodeName === 'BR',
  replacement: () => '  \n',
});

const isProbablyHtml = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  if (!trimmed.startsWith('<')) {
    return false;
  }

  return /<\/?[a-z][^>]*>/i.test(trimmed);
};

export const htmlToMarkdown = (html: string): string => {
  if (!html) {
    return '';
  }

  if (!isProbablyHtml(html)) {
    return html.trim();
  }

  return turndown.turndown(html).trim();
};

export const markdownToHtml = (markdown: string): string => {
  const parsed = marked.parse(markdown ?? '');
  return typeof parsed === 'string' ? parsed : '';
};

export const normalizeStoredContent = (content: string): { html: string; markdown: string } => {
  const trimmed = content?.trim() ?? '';

  if (!trimmed) {
    return { html: '', markdown: '' };
  }

  if (isProbablyHtml(trimmed)) {
    const markdown = htmlToMarkdown(trimmed);
    return { html: markdownToHtml(markdown), markdown };
  }

  return { html: markdownToHtml(trimmed), markdown: trimmed };
};

