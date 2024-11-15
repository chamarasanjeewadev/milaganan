import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CreateMarkdownRequestDto } from "@repo/types";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useToast } from "@/components/ui/use-toast";

interface LogoState {
  url: string | undefined;
  timestamp: number;
}

interface PreviewProps {
  markdown: {
    markdown: string;
    id?: string;
    font: string;
  };
  logoUrl: LogoState;
  preview?: boolean;
}

export function Preview({
  markdown: { markdown, id, font },
  preview,
  logoUrl,
}: PreviewProps) {
  const { t } = useTranslation();
  const [showQR, setShowQR] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const navigate = useNavigate();
  const qrCodeRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  console.log("rendering preview.... logo url", logoUrl);
  React.useEffect(() => {
    if (logoUrl) {
      setImageLoaded(false);
    }
  }, [logoUrl]);

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
    onSuccess: () => {
      toast({
        title: t("success"),
        description: t("qr_code_saved"),
      });
    },
    onError: error => {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("failed_to_save_qr"),
      });
      console.error("Failed to save markdown:", error);
    },
  });

  const handleSaveQR = async () => {
    try {
      const savedData = await saveMarkdownMutation.mutateAsync();
      if (savedData && savedData.id) {
        navigate({ to: `/${savedData.id}` });
      }
    } catch (error) {
      // Error handling is now done in mutation's onError
    }
  };

  // Convert markdown to HTML and create a Blob URL
  const getPreviewUrl = () => {
    const currentId = id;
    return `${window.location.origin}/${currentId}?preview=true`;
  };

  const downloadQRCode = async (format: "png" | "pdf") => {
    if (!qrCodeRef.current) return;

    const canvas = await html2canvas(qrCodeRef.current);

    if (format === "png") {
      const link = document.createElement("a");
      link.download = `qr-code.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calculate dimensions to center the QR code
      const imgWidth = 100;
      const imgHeight = 100;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      pdf.save("qr-code.pdf");
    }
  };

  // Update the image handlers
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="block">
      <div className="h-full flex flex-col">
        <div className="mb-2 flex items-center justify-end">
          {!preview && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center space-x-1 px-2 py-1 text-sm rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              >
                <QrCode className="h-4 w-4" />
                <span>{showQR ? t("hide_qr") : t("show_qr")}</span>
              </button>
              <button
                onClick={handleSaveQR}
                disabled={saveMarkdownMutation.isPending}
                className="flex items-center space-x-1 px-2 py-1 text-sm rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveMarkdownMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <QrCode className="h-4 w-4" />
                )}
                <span>
                  {saveMarkdownMutation.isPending ? t("saving") : t("save")}
                </span>
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-auto rounded-lg border border-gray-200 bg-white">
          {logoUrl?.url && (
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-center">
              <img
                src={logoUrl?.url}
                alt="Logo"
                className={`h-12 w-12 object-contain ${!imageLoaded ? "hidden" : ""}`}
                onLoad={handleImageLoad}
                key={`${logoUrl.url}?t=${logoUrl.timestamp}`}
              />
            </div>
          )}
          {showQR ? (
            <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
              <div ref={qrCodeRef} className="bg-white p-4">
                <QRCodeSVG
                  value={getPreviewUrl()}
                  size={256}
                  level="H"
                  includeMargin
                  {...(logoUrl?.url && {
                    imageSettings: {
                      src: logoUrl.url,
                      height: 48,
                      width: 48,
                      excavate: true,
                    },
                  })}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => downloadQRCode("png")}
                  className="flex items-center space-x-1 px-2 py-1 text-sm rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                >
                  <Download className="h-4 w-4" />
                  <span>{t("download_png")}</span>
                </button>
                <button
                  onClick={() => downloadQRCode("pdf")}
                  className="flex items-center space-x-1 px-2 py-1 text-sm rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                >
                  <Download className="h-4 w-4" />
                  <span>{t("download_pdf")}</span>
                </button>
              </div>
              <p className="text-sm text-gray-600">{t("scan_preview")}</p>
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
