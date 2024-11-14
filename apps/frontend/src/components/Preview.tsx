import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { QRCodeSVG } from "qrcode.react";
import { QrCode } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CreateMarkdownRequestDto } from "@repo/types";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from 'react-i18next';

interface PreviewProps {
  markdown: { markdown: string; id: string | undefined; font?: string };
  isPreview?: boolean;
  logoUrl?: string;
}

export function Preview({
  markdown: { markdown, id, font },
  isPreview,
  logoUrl,
}: PreviewProps) {
  const { t } = useTranslation();
  const [showQR, setShowQR] = React.useState(false);
  const navigate = useNavigate();

  const saveMarkdownMutation = useMutation({
    mutationFn: async () => {
      const requestBody: CreateMarkdownRequestDto = {
        title: "test",
        content: markdown,
        id,
        font: font || "default",
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/markdown`,
        requestBody,
      );
      return response.data;
    },
  });

  const handleSaveQR = async () => {
    try {
      console.log("Saving markdown...");
      const savedData = await saveMarkdownMutation.mutateAsync();
      if (savedData && savedData.id) {
        navigate({ to: `/${savedData.id}` });
      }
    } catch (error) {
      console.error("Failed to save markdown:", error);
    }
  };

  // Convert markdown to HTML and create a Blob URL
  const getPreviewUrl = () => {
    const currentId = id;
    return `${window.location.origin}/${currentId}?isPreview=true`;
  };

  return (
    <div className="block">
      <div className="h-full flex flex-col">
        <div className="mb-2 flex items-center justify-end">
          {isPreview && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center space-x-1 px-2 py-1 text-sm rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              >
                <QrCode className="h-4 w-4" />
                <span>{showQR ? t('hide_qr') : t('show_qr')}</span>
              </button>
              <button
                onClick={handleSaveQR}
                className="flex items-center space-x-1 px-2 py-1 text-sm rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              >
                <QrCode className="h-4 w-4" />
                <span>{t('save')}</span>
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-auto rounded-lg border border-gray-200 bg-white">
          {logoUrl && (
            <div className="p-4 border-b border-gray-200 bg-gray-50f flex justify-center">
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="h-12 w-12 object-contain"
              />
            </div>
          )}
          {showQR ? (
            <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
              <QRCodeSVG
                value={getPreviewUrl()}
                size={256}
                level="H"
                includeMargin
                {...(logoUrl && {
                  imageSettings: {
                    src: logoUrl,
                    height: 48,
                    width: 48,
                    excavate: true,
                  }
                })}
              />
              <p className="text-sm text-gray-600">
                {t('scan_preview')}
              </p>
            </div>
          ) : (
            <div
              className="p-8 prose prose-indigo max-w-none"
              style={{
                fontFamily: font,
                lineHeight: "1",
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
