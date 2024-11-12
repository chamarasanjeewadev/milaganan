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
  markdown: { markdown: string; id: string | undefined };
  isMobilePreviewVisible: boolean;
}

export function Preview({
  markdown: { markdown, id },
  isMobilePreviewVisible,
}: PreviewProps) {
  const [showQR, setShowQR] = React.useState(false);
  const navigate = useNavigate();

  const saveMarkdownMutation = useMutation({
    mutationFn: async () => {
      const requestBody: CreateMarkdownRequestDto = {
        title: "test",
        content: markdown,
        id,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/markdown`,
        requestBody,
        // {
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   withCredentials: false,
        // }
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

  // Create SVG logo for QR code
  const logoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 3h5v5"></path>
      <path d="M8 3H3v5"></path>
      <path d="M21 16v5h-5"></path>
      <path d="M3 16v5h5"></path>
      <line x1="21" x2="3" y1="12" y2="12"></line>
    </svg>
  `;

  const logoUrl = `data:image/svg+xml;base64,${btoa(logoSvg)}`;

  // Convert markdown to HTML and create a Blob URL
  const getPreviewUrl = () => {
    const currentId = id;
    return `${import.meta.env.VITE_API_URL}/bill/preview/${currentId}`;
  };

  return (
    <div className={`${!isMobilePreviewVisible ? "hidden" : ""} md:block`}>
      <div className="h-full flex flex-col">
        <img
          src="http://milaganan-bucket.s3-website-us-east-1.amazonaws.com/76384239/prof.jpeg"
          alt="Profile"
        />
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <h2 className="text-sm font-medium text-gray-700">Preview</h2>
          </div>
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
        </div>
        <div className="flex-1 overflow-auto rounded-lg border border-gray-200 bg-white">
          {showQR ? (
            <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
              <QRCodeSVG
                value={getPreviewUrl()}
                size={256}
                level="H"
                includeMargin
                imageSettings={{
                  src: logoUrl,
                  height: 24,
                  width: 24,
                  excavate: true,
                }}
              />
              <p className="text-sm text-gray-600">
                Scan to view the preview on your mobile device
              </p>
            </div>
          ) : (
            <div className="p-8 prose prose-indigo max-w-none">
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
