import { useState } from "react";
import { Share2, Mail, Copy } from "lucide-react";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useTranslation } from "react-i18next";

interface ShareCardProps {
  url: string;
}

export const ShareCard = ({ url }: ShareCardProps) => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: t('success'),
        description: t('share.copy_success'),
        variant: "default",
      });
    } catch (err) {
      toast({
        title: t('error'),
        description: t('share.copy_error'),
        variant: "destructive",
      });
    }
  };

  const handleEmailShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/share/email`, {
        email,
        url,
      });
      toast({
        title: t('success'),
        description: t('share.email_success'),
        variant: "default",
      });
      setEmail("");
    } catch (err) {
      toast({
        title: t('error'),
        description: t('share.email_error'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Share2 className="w-5 h-5" />
        {t('share.title')}
      </h3>
      
      <div className="mb-4">
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-gray-200 rounded"
            title="Copy URL"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="border-t pt-4 hidden">
        <form onSubmit={handleEmailShare} className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Mail className="w-4 h-4" />
            {t('share.email_section')}
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('share.email_placeholder')}
              className="flex-1 px-3 py-2 border rounded text-sm"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              {t('share.send')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 