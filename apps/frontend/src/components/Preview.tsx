import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { QRCodeSVG } from "qrcode.react";
import { Eye, QrCode } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CreateMarkdownRequestDto } from "@repo/types";
import { useNavigate } from "@tanstack/react-router";

interface PreviewProps {
  markdown: { markdown: string; id: string | undefined; font?: string };
  isPreview: boolean;
  logoUrl?: string;
}

export function Preview({
  markdown: { markdown, id, font },
  isPreview,
  logoUrl,
}: PreviewProps) {
  const [showQR, setShowQR] = React.useState(false);
  const navigate = useNavigate();

  console.group("selected fornt........................", font);

  const saveMarkdownMutation = useMutation({
    mutationFn: async () => {
      const requestBody: CreateMarkdownRequestDto = {
        title: "test",
        content: markdown,
        id,
        font: font || 'default',
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
    return `${window.location.origin}/preview/${currentId}`;
  };

  return (
    <div className="block">
      <div className="h-full flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <h2 className="text-sm font-medium text-gray-700">Preview</h2>
          </div>
          {isPreview && (
            <div className="flex items-center space-x-2 ">
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center space-x-1 px-2 py-1 text-sm rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              >
                <QrCode className="h-4 w-4" />
                <span>{showQR ? "Hide QR" : "Show QR"}</span>
              </button>
              <button
                onClick={handleSaveQR}
                className="flex items-center space-x-1 px-2 py-1 text-sm rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              >
                <QrCode className="h-4 w-4" />
                <span>{"Save"}</span>
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-auto rounded-lg border border-gray-200 bg-white">
          {showQR ? (
            <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
              <QRCodeSVG
                value={getPreviewUrl()}
                size={256}
                level="H"
                includeMargin
                imageSettings={logoUrl ? {
                  src: logoUrl,
                  height: 48,
                  width: 48,
                  excavate: true,
                } : undefined}
              />
              <p className="text-sm text-gray-600">
                Scan to view the preview on your mobile device
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
                // components={{
                //   p: ({ node, ...props }) => (
                //     <p
                //       style={{
                //         marginBottom: "0.5em",
                //         fontFamily: font,
                //       }}
                //       {...props}
                //     />
                //   ),
                // }}
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
