import { describe, expect, it } from 'vitest';
import { Window } from 'happy-dom';
import { htmlToMarkdown, markdownToHtml } from './markdown';

const windowInstance = new Window();

// @ts-expect-error assigning testing window shim
global.window = windowInstance as unknown as typeof global.window;
// @ts-expect-error assigning testing document shim
global.document = windowInstance.document as unknown as typeof global.document;
// @ts-expect-error assigning testing Node shim
global.Node = windowInstance.Node as unknown as typeof global.Node;

const legacyHtml = `<pre><code class="language-markdown"># 제목\n\n내용 단락\n</code></pre><p></p>`;

describe('markdown utilities', () => {
  it('converts markdown to html and back without losing formatting', () => {
    const markdown = '# Heading\n\n- item one\n- item two';

    const html = markdownToHtml(markdown);
    const roundTrip = htmlToMarkdown(html);

    expect(markdownToHtml(roundTrip)).toBe(html);
  });

  it('strips legacy language-markdown wrapper into clean markdown', () => {
    const converted = htmlToMarkdown(legacyHtml);

    expect(converted).toContain('# 제목');
    expect(converted).toContain('내용 단락');
    expect(markdownToHtml(converted)).not.toContain('language-markdown');
  });

  it('preserves fenced code blocks when round-tripping', () => {
    const markdown = '```ts\nconst value = 1;\n```';

    const html = markdownToHtml(markdown);
    const converted = htmlToMarkdown(html);

    expect(converted).toBe(markdown);
  });
});
