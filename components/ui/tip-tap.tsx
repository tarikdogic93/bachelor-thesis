"use client";

import { useEffect } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  SquareCode,
  TextQuote,
  UnderlineIcon,
} from "lucide-react";
import { useEditor, EditorContent, Editor, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Hint from "@/components/ui/hint";

type TipTapMenubarProps = {
  editor: Editor | null;
  disabled?: boolean;
};

function TipTapMenubar({ editor, disabled }: TipTapMenubarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      <Hint label="Bold" asChild>
        <Button
          type="button"
          variant={editor.isActive("bold") ? "default" : "outline"}
          size="icon"
          disabled={
            disabled || !editor.can().chain().focus().toggleBold().run()
          }
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Italic" asChild>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "default" : "outline"}
          size="icon"
          disabled={
            disabled || !editor.can().chain().focus().toggleItalic().run()
          }
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Underline" asChild>
        <Button
          type="button"
          variant={editor.isActive("underline") ? "default" : "outline"}
          size="icon"
          disabled={
            disabled || !editor.can().chain().focus().toggleUnderline().run()
          }
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Code" asChild>
        <Button
          type="button"
          variant={editor.isActive("code") ? "default" : "outline"}
          size="icon"
          disabled={
            disabled || !editor.can().chain().focus().toggleCode().run()
          }
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Paragraph" asChild>
        <Button
          type="button"
          variant={editor.isActive("paragraph") ? "default" : "outline"}
          size="icon"
          disabled={
            disabled || !editor.can().chain().focus().setParagraph().run()
          }
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Heading 1" asChild>
        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 1 }) ? "default" : "outline"
          }
          size="icon"
          disabled={
            disabled ||
            !editor.can().chain().focus().toggleHeading({ level: 1 })
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Heading 2" asChild>
        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 2 }) ? "default" : "outline"
          }
          size="icon"
          disabled={
            disabled ||
            !editor.can().chain().focus().toggleHeading({ level: 2 })
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Heading 3" asChild>
        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 3 }) ? "default" : "outline"
          }
          size="icon"
          disabled={
            disabled ||
            !editor.can().chain().focus().toggleHeading({ level: 3 })
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Heading 4" asChild>
        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 4 }) ? "default" : "outline"
          }
          size="icon"
          disabled={
            disabled ||
            !editor.can().chain().focus().toggleHeading({ level: 4 })
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          <Heading4 className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Align left" asChild>
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "left" }) ? "default" : "outline"
          }
          size="icon"
          disabled={
            disabled || !editor.can().chain().focus().setTextAlign("left").run()
          }
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Align center" asChild>
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "center" }) ? "default" : "outline"
          }
          size="icon"
          disabled={
            disabled ||
            !editor.can().chain().focus().setTextAlign("center").run()
          }
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Align right" asChild>
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "right" }) ? "default" : "outline"
          }
          size="icon"
          disabled={
            disabled ||
            !editor.can().chain().focus().setTextAlign("right").run()
          }
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Bullet list" asChild>
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          size="icon"
          disabled={
            disabled || !editor.can().chain().focus().toggleBulletList().run()
          }
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Ordered list" asChild>
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          size="icon"
          disabled={
            disabled || !editor.can().chain().focus().toggleOrderedList().run()
          }
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Code block" asChild>
        <Button
          type="button"
          variant={editor.isActive("codeBlock") ? "default" : "outline"}
          size="icon"
          disabled={
            disabled || !editor.can().chain().focus().toggleCodeBlock().run()
          }
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <SquareCode className="h-5 w-5" />
        </Button>
      </Hint>
      <Hint label="Blockquote" asChild>
        <Button
          type="button"
          variant={editor.isActive("blockquote") ? "default" : "outline"}
          size="icon"
          disabled={
            disabled || !editor.can().chain().focus().toggleBlockquote().run()
          }
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <TextQuote className="h-5 w-5" />
        </Button>
      </Hint>
    </div>
  );
}

type TipTapProps = {
  className?: string;
  showMenubar?: boolean;
  editable?: boolean;
  contentJSON?: JSONContent;
  setContentJSON?: (content: JSONContent | undefined) => void;
  disabled?: boolean;
};

export default function TipTap({
  className,
  showMenubar = true,
  editable = true,
  contentJSON,
  setContentJSON,
  disabled,
}: TipTapProps) {
  const editor = useEditor({
    editable,
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Write your content here",
      }),
    ],
    content: contentJSON,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();

      const isTextContentEmpty =
        editor.state.doc.textContent.trim().length === 0;

      if (setContentJSON) {
        if (isTextContentEmpty) {
          setContentJSON(undefined);
        } else {
          setContentJSON(json);
        }
      }
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed && !editable && contentJSON) {
      editor.commands.setContent(contentJSON);
    }
  }, [contentJSON, editable, editor]);

  return (
    <div className="flex flex-col gap-y-3">
      {showMenubar && <TipTapMenubar editor={editor} disabled={disabled} />}
      <ScrollArea classNameViewport="max-h-32">
        <EditorContent
          className={cn("rounded-md border p-3", className)}
          editor={editor}
          disabled={disabled}
        />
      </ScrollArea>
    </div>
  );
}
