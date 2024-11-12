import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Editor } from "./Editor";
import { Preview } from "./Preview";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet";

const initialMarkdown = `# Welcome to Markdown Editor

## Features
- Live preview
- GitHub Flavored Markdown support
- HTML support
- Responsive design
- QR Code sharing

### Try it out!
1. Edit the markdown on the left
2. See the preview on the right
3. Click "Show QR" to view on mobile

#### Code Example
\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

#### Table Example
| Feature | Status |
|---------|--------|
| Markdown | ✅ |
| Preview | ✅ |
| QR Code | ✅ |

> Scan the QR code to view this content on your mobile device!
`;

interface MarkdownResponse {
  content: string;
  id: string;
  font: string;
  // add other fields that your API returns
}

const fetchMarkdown = async (id: string | null): Promise<MarkdownResponse> => {
  if (!id) throw new Error("No ID provided");
  const response = await axios.get<MarkdownResponse>(
    `${import.meta.env.VITE_API_URL}/markdown/${id}`,
  );
  return response.data;
};

interface AppProps {
  id?: string;
  isPreview?: boolean;
}

export const FONT_OPTIONS = [
  "Open Sans",
  "Roboto",
  "Lato",
  "Montserrat",
  "Source Code Pro",
  "Fira Code",
  "Arial",
  "Times New Roman",
];

function App({ id, isPreview = false }: AppProps) {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const [isMobilePreviewVisible, setIsMobilePreviewVisible] = useState(false);

  const [selectedFont, setSelectedFont] = useState<string>("Open Sans");
  console.log("inside app and id...", id);

  // Use React Query to fetch markdown
  const { isLoading, error, data } = useQuery<MarkdownResponse, Error>({
    queryKey: ["markdown", id],
    queryFn: () => fetchMarkdown(id || null),
    enabled: !!id,
  });

  // Use useEffect to update markdown when data changes
  useEffect(() => {
    if (data) {
      setSelectedFont(data?.font ?? "Open Sans");
      if (!data.content) {
        setMarkdown(initialMarkdown);
        return;
      } else {
        setMarkdown(data.content);
      }
    }
  }, [data]);

  console.log("data", data);

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans&family=Roboto&family=Lato&family=Montserrat&family=Source+Code+Pro&family=Fira+Code&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        <main className="max-w-7xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <p>Loading markdown content...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center">
              <p>Error loading content. Please try again later.</p>
            </div>
          ) : (
            <Preview markdown={{ markdown, id, font: selectedFont }} />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans&family=Roboto&family=Lato&family=Montserrat&family=Source+Code+Pro&family=Fira+Code&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header
        isMobilePreviewVisible={isMobilePreviewVisible}
        setIsMobilePreviewVisible={setIsMobilePreviewVisible}
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
          {isLoading ? (
            <div className="col-span-2 flex items-center justify-center">
              <p>Loading markdown content...</p>
            </div>
          ) : error ? (
            <div className="col-span-2 flex items-center justify-center ">
              <p>Error loading content. Please try again later.</p>
            </div>
          ) : (
            <>
              <Editor
                markdown={{ markdown, id: id ? parseInt(id) : undefined }}
                setMarkdown={setMarkdown}
                isMobilePreviewVisible={isMobilePreviewVisible}
                selectedFont={selectedFont}
                setSelectedFont={setSelectedFont}
              /> 
              <Preview markdown={{ markdown, id, font: selectedFont }} isPreview />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
export default App;

