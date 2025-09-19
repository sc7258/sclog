'use client';

import { useEffect, useMemo } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  Code as CodeIcon,
  Heading1,
  Heading2,
  Heading3,
  List as BulletListIcon,
  ListOrdered,
  IndentIncrease,
  IndentDecrease,
  Quote,
  Minus,
  CodeSquare,
  Link as LinkIcon,
  Link2Off,
  Undo2,
  Redo2,
} from 'lucide-react';

interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
}

const BUTTON_BASE_CLASS =
  'flex items-center justify-center rounded-md border p-2 text-gray-600 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300 dark:text-gray-300';

const ACTIVE_CLASS = 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200';
const INACTIVE_CLASS = 'border-gray-200 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:hover:border-gray-600';

const ICON_CLASS = 'h-4 w-4';

const Tiptap = ({ content, onChange }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          class: 'text-indigo-600 underline decoration-indigo-400 hover:text-indigo-700',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert w-full min-h-[320px] whitespace-pre-wrap break-words focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentContent = editor.getHTML();
    if (content !== currentContent) {
      editor.commands.setContent(content || '', false);
    }
  }, [content, editor]);

  const applyLink = () => {
    if (!editor) {
      return;
    }
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('링크 URL을 입력하세요', previousUrl ?? 'https://');
    if (url === null) {
      return;
    }
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const buttonClass = (isActive: boolean, disabled = false) =>
    [BUTTON_BASE_CLASS, isActive && !disabled ? ACTIVE_CLASS : INACTIVE_CLASS]
      .filter(Boolean)
      .join(' ');

  const headingItems = useMemo(
    () => [
      { level: 1, icon: Heading1, label: 'H1 제목' },
      { level: 2, icon: Heading2, label: 'H2 제목' },
      { level: 3, icon: Heading3, label: 'H3 제목' },
    ],
    []
  );

  if (!editor) {
    return (
      <div className="w-full rounded-md border border-gray-300 bg-white px-4 py-6 text-sm text-gray-400 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        에디터를 불러오는 중입니다...
      </div>
    );
  }

  const canUndo = editor.can().chain().focus().undo().run();
  const canRedo = editor.can().chain().focus().redo().run();
  const canSinkList = editor.can().chain().focus().sinkListItem('listItem').run();
  const canLiftList = editor.can().chain().focus().liftListItem('listItem').run();

  const renderHeadingButtons = () =>
    headingItems.map(({ level, icon: IconComponent, label }) => (
      <button
        key={level}
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
        className={buttonClass(editor.isActive('heading', { level }))}
        aria-label={label}
        title={label}
      >
        <IconComponent className={ICON_CLASS} />
        <span className="sr-only">{label}</span>
      </button>
    ));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive('bold'))}
          aria-label="굵게"
          title="굵게"
        >
          <BoldIcon className={ICON_CLASS} />
          <span className="sr-only">굵게</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive('italic'))}
          aria-label="기울임"
          title="기울임"
        >
          <ItalicIcon className={ICON_CLASS} />
          <span className="sr-only">기울임</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={buttonClass(editor.isActive('underline'))}
          aria-label="밑줄"
          title="밑줄"
        >
          <UnderlineIcon className={ICON_CLASS} />
          <span className="sr-only">밑줄</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={buttonClass(editor.isActive('strike'))}
          aria-label="취소선"
          title="취소선"
        >
          <StrikethroughIcon className={ICON_CLASS} />
          <span className="sr-only">취소선</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={buttonClass(editor.isActive('code'))}
          aria-label="인라인 코드"
          title="인라인 코드"
        >
          <CodeIcon className={ICON_CLASS} />
          <span className="sr-only">인라인 코드</span>
        </button>

        <span className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />

        {renderHeadingButtons()}

        <span className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive('bulletList'))}
          aria-label="불릿 리스트"
          title="불릿 리스트"
        >
          <BulletListIcon className={ICON_CLASS} />
          <span className="sr-only">불릿 리스트</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive('orderedList'))}
          aria-label="번호 리스트"
          title="번호 리스트"
        >
          <ListOrdered className={ICON_CLASS} />
          <span className="sr-only">번호 리스트</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
          className={buttonClass(false, !canSinkList)}
          disabled={!canSinkList}
          aria-label="들여쓰기"
          title="들여쓰기"
        >
          <IndentIncrease className={ICON_CLASS} />
          <span className="sr-only">들여쓰기</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().liftListItem('listItem').run()}
          className={buttonClass(false, !canLiftList)}
          disabled={!canLiftList}
          aria-label="내어쓰기"
          title="내어쓰기"
        >
          <IndentDecrease className={ICON_CLASS} />
          <span className="sr-only">내어쓰기</span>
        </button>

        <span className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={buttonClass(editor.isActive('blockquote'))}
          aria-label="인용문"
          title="인용문"
        >
          <Quote className={ICON_CLASS} />
          <span className="sr-only">인용문</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={buttonClass(false)}
          aria-label="구분선"
          title="구분선"
        >
          <Minus className={ICON_CLASS} />
          <span className="sr-only">구분선</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={buttonClass(editor.isActive('codeBlock'))}
          aria-label="코드 블록"
          title="코드 블록"
        >
          <CodeSquare className={ICON_CLASS} />
          <span className="sr-only">코드 블록</span>
        </button>

        <span className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />

        <button
          type="button"
          onClick={applyLink}
          className={buttonClass(editor.isActive('link'))}
          aria-label="링크 설정"
          title="링크 설정"
        >
          <LinkIcon className={ICON_CLASS} />
          <span className="sr-only">링크 설정</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          className={buttonClass(false, !editor.isActive('link'))}
          disabled={!editor.isActive('link')}
          aria-label="링크 해제"
          title="링크 해제"
        >
          <Link2Off className={ICON_CLASS} />
          <span className="sr-only">링크 해제</span>
        </button>

        <span className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={buttonClass(false, !canUndo)}
          disabled={!canUndo}
          aria-label="되돌리기"
          title="되돌리기"
        >
          <Undo2 className={ICON_CLASS} />
          <span className="sr-only">되돌리기</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className={buttonClass(false, !canRedo)}
          disabled={!canRedo}
          aria-label="다시하기"
          title="다시하기"
        >
          <Redo2 className={ICON_CLASS} />
          <span className="sr-only">다시하기</span>
        </button>
      </div>

      <div className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Tiptap;
