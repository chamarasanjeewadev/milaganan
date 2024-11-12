import React, { useRef, useEffect } from "react";
import {
  FileEdit,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Image,
  Quote,
  Heading1,
  Heading2,
  Table,
} from "lucide-react";
import { FONT_OPTIONS } from "./App";

interface EditorProps {
  markdown: { markdown: string; id: number; font?: string };
  setMarkdown: (value: string) => void;
  isMobilePreviewVisible: boolean;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  setLogoUrl: (url: string) => void;
}

interface ToolbarButton {
  icon: React.ElementType;
  label: string;
  action: (
    text: string,
  ) =>
    | Promise<{ text: string; selectionStart: number; selectionEnd: number }>
    | { text: string; selectionStart: number; selectionEnd: number };
}

export function Editor({
  markdown: { markdown, id, font },
  setMarkdown,
  isMobilePreviewVisible,
  selectedFont,
  setSelectedFont,
  setLogoUrl,
}: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  console.log("updated markdown", markdown);
  const toolbarButtons: ToolbarButton[] = [
    {
      icon: Bold,
      label: "Bold",
      action: text => ({
        text: `**${text}**`,
        selectionStart: 2,
        selectionEnd: 2 + text.length,
      }),
    },
    {
      icon: Italic,
      label: "Italic",
      action: text => ({
        text: `*${text}*`,
        selectionStart: 1,
        selectionEnd: 1 + text.length,
      }),
    },
    {
      icon: Link,
      label: "Link",
      action: text => ({
        text: `[${text}](url)`,
        selectionStart: text ? text.length + 3 : 1,
        selectionEnd: text ? text.length + 6 : 4,
      }),
    },
    {
      icon: Image,
      label: "Image",
      action: async text => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
          return {
            text: markdown,
            selectionStart: textareaRef.current?.selectionStart || 0,
            selectionEnd: textareaRef.current?.selectionEnd || 0,
          };
        }
        return {
          text: `![${text}](url)`,
          selectionStart: text ? text.length + 4 : 2,
          selectionEnd: text ? text.length + 7 : 5,
        };
      },
    },
    {
      icon: Heading1,
      label: "Heading 1",
      action: text => ({
        text: `# ${text}`,
        selectionStart: 2,
        selectionEnd: 2 + text.length,
      }),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: text => ({
        text: `## ${text}`,
        selectionStart: 3,
        selectionEnd: 3 + text.length,
      }),
    },
    {
      icon: List,
      label: "Bullet List",
      action: text => ({
        text: `- ${text}`,
        selectionStart: 2,
        selectionEnd: 2 + text.length,
      }),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: text => ({
        text: `1. ${text}`,
        selectionStart: 3,
        selectionEnd: 3 + text.length,
      }),
    },
    {
      icon: Quote,
      label: "Quote",
      action: text => ({
        text: `> ${text}`,
        selectionStart: 2,
        selectionEnd: 2 + text.length,
      }),
    },
    {
      icon: Table,
      label: "Table",
      action: () => ({
        text: `| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |`,
        selectionStart: 2,
        selectionEnd: 9,
      }),
    },
  ];

  const handleToolbarAction = async (button: ToolbarButton) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    const result = await button.action(selectedText);

    // const newText =
    //   markdown.substring(0, start) + result.text + markdown.substring(end);
    // setMarkdown(newText);

    // setTimeout(() => {
    //   textarea.focus();
    //   textarea.setSelectionRange(
    //     start + result.selectionStart,
    //     start + result.selectionEnd,
    //   );
    // }, 0);
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("postId", id.toString());

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      return { url: data.url, path: data.path ?? `${id}/${file.name}` };
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const result = await handleFileUpload(file);
    if (!result) return;
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const imageMarkdown = `![${selectedText}](${result.url})`;
    const newText =
      markdown.substring(0, start) + imageMarkdown + markdown.substring(end);
    setMarkdown(newText);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("postId", id.toString());

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/logo`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setLogoUrl(data.url);
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
  };

  useEffect(() => {
    if (font) {
      setSelectedFont(font);
    }
  }, [font, setSelectedFont]);

  return (
    <div className={`${isMobilePreviewVisible ? "hidden" : ""} md:block`}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileInputChange}
      />
      <div className="h-full flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileEdit className="h-4 w-4 text-gray-500" />
            <h2 className="text-sm font-medium text-gray-700">Editor</h2>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedFont}
              onChange={e => setSelectedFont(e.target.value)}
              className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {FONT_OPTIONS.map(font => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mb-2 flex flex-wrap gap-1 p-2 bg-white rounded-lg border border-gray-200">
          {toolbarButtons.map(button => (
            <button
              key={button.label}
              onClick={() => handleToolbarAction(button)}
              className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title={button.label}
            >
              <button.icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="flex-1 w-full p-4 rounded-lg border border-gray-200 bg-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={markdown}
          onChange={e => setMarkdown(e.target.value)}
          placeholder="Enter your markdown here..."
          style={{ fontFamily: selectedFont }}
        />
      </div>
    </div>
  );
}
