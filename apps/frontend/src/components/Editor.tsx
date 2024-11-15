import React, { useRef } from "react";
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
  Upload,
} from "lucide-react";
import { FONT_OPTIONS } from "./App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface EditorProps {
  markdown: { 
    markdown: string; 
    id?: number | undefined; 
    font?: string 
  };
  setMarkdown: (value: string) => void;
  isMobilePreviewVisible: boolean;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  setLogoUrl: (logo: { url: string | undefined; timestamp: number }) => void;
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
  markdown: { markdown, id },
  setMarkdown,
  isMobilePreviewVisible,
  selectedFont,
  setSelectedFont,
  setLogoUrl,
}: EditorProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
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
      action: async () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
        return {
          text: "",
          selectionStart: 0,
          selectionEnd: 0,
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

    const newText =
      markdown.substring(0, start) + result.text + markdown.substring(end);
    setMarkdown(newText);

    // setTimeout(() => {
    //   textarea.focus();
    //   textarea.setSelectionRange(
    //     start + result.selectionStart,
    //     start + result.selectionEnd,
    //   );
    // }, 0);
  };

  const handleFileUpload = async (file: File) => {
    if (!id) {
        console.error("No post ID available");
        return null;
    }

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
    if (!file || !id) return;

    if (file.type !== "image/jpeg") {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("jpg_only_error"),
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("postId", id.toString());

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/upload/logo`,
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json(); 
      
      setLogoUrl({
        url: data.path,
        timestamp: Date.now()
      });

      queryClient.invalidateQueries({ queryKey: ["logo", id] });

      toast({
        title: t("success"),
        description: t("logo_upload_success"),
      });
      
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("logo_upload_error"),
      });
    }
  };

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
            <h2 className="text-sm font-medium text-gray-700"></h2>
            <a
              href="https://www.markdownguide.org/basic-syntax/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 hover:text-indigo-800 ml-2"
            >
              {t("learn_markdown")}
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedFont} onValueChange={setSelectedFont}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("select_font")} />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map(font => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="file"
              accept="image/jpeg"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("logo-upload")?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {t("upload_logo")}
            </Button>
          </div>
        </div>
        <div className="mb-2 flex flex-wrap gap-1 p-2 bg-white rounded-lg border border-gray-200">
          {toolbarButtons.map(button => (
            <Button
              key={button.label}
              variant="ghost"
              size="sm"
              onClick={() => handleToolbarAction(button)}
              className="p-1.5"
              title={button.label}
            >
              <button.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="flex-1 w-full p-4 rounded-lg border border-gray-200 bg-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={markdown}
          onChange={e => setMarkdown(e.target.value)}
          placeholder={t("enter_markdown")}
          style={{ fontFamily: selectedFont }}
        />
      </div>
    </div>
  );
}
