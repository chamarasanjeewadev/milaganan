import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Editor } from "./Editor";
import { Preview } from "./Preview";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
  id?: string | number;
}

function App({ id }: AppProps) {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const [isMobilePreviewVisible, setIsMobilePreviewVisible] = useState(false);
  console.log("inside app and id...", id);

  // Use React Query to fetch markdown
  const { isLoading, error, data } = useQuery<MarkdownResponse, Error>({
    queryKey: ["markdown", id],
    queryFn: () => fetchMarkdown(id),
    enabled: !!id,
  });

  // Use useEffect to update markdown when data changes
  useEffect(() => {
    if (data) {
      if (!data.content) {
        setMarkdown(initialMarkdown);
        return;
      } else {
        setMarkdown(data.content);
      }
    }
  }, [data]);

  console.log("data", data);

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="col-span-2 flex items-center justify-center text-red-500">
              <p>Error loading content. Please try again later.</p>
            </div>
          ) : (
            <>
              <Editor
                markdown={{markdown, id}}
                setMarkdown={setMarkdown}
                isMobilePreviewVisible={isMobilePreviewVisible}
              />
              <Preview
                markdown={{ markdown, id }}
                isMobilePreviewVisible={isMobilePreviewVisible}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
