import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Editor } from "./Editor";
import { Preview } from "./Preview";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet";

const initialMarkdown = `# සාදරයෙන් පිළිගනිමු 
## එළවළු මිල ලැයිස්තුව

## විශේෂාංග
- 🥦 තත්කාලීන මිල ගණන්
- 🌱 තත්ත්ව සහතික
- 🍲 පාරිභෝගික සැලසුම්
- 📱 ජංගම බෙදාගැනීම්
- 📷 QR කේත බෙදාගැනීම

### අපගේ විවිධ එළවළු මිල ලැයිස්තුව බලන්න!
1. වම් පැත්තේ විස්තර සංස්කරණය කරන්න
2. එළවළු තත්වයන් සහ මිල ගණන් බලන්න
3. QR කේතය පෙන්වන්න ඔබේ ජංගම දුරකථනයෙන් පරික්ෂා කරන්න

#### මිල ලැයිස්තුව - එළවළු
| එළවළු             | මිල (රු) | තත්වය |
|--------------------|----------|--------|
| 🍅 තක්කාලි          | 150.00   | ✅    |
| 🥔 අල                | 120.00   | ✅    |
| 🥕 කැරට්            | 80.00    | ✅    |
| 🥒 පිපිඤ්ඤා          | 60.00    | ✅    |
| 🍆 වම්බටු           | 90.00    | ✅    |
| 🌶️ මිරිස්            | 200.00   | ✅    |
| 🥬 කොස්             | 75.00    | ✅    |
| 🌽 බඩ ඉරිඟු        | 50.00    | ✅    |

> 📲 ජංගම උපකරණයේ මෙම මිල ලැයිස්තුව නැරඹීමට QR කේතය පාරික්‍ෂා කරන්න!
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
  "Noto Sans Sinhala",
  "Open Sans",
  "Roboto",
  "Lato",
  "Montserrat",
  "Source Code Pro",
  "Fira Code",
  "Arial",
  "Times New Roman",
];

interface LogoState {
  url: string | undefined;
  timestamp: number;
}

function App({ id, isPreview = false }: AppProps) {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const [selectedFont, setSelectedFont] = useState<string>("Open Sans");
  const [logoUrl, setLogoUrl] = useState<LogoState>({
    url: id ? `${id}/logo.jpg` : undefined,
    timestamp: Date.now(),
  });

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
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;700&family=Roboto:wght@400;500;700&family=Lato:wght@400;700&family=Montserrat:wght@400;500;700&family=Source+Code+Pro:wght@400;700&family=Fira+Code:wght@400;700&display=swap"
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
            <Preview
              markdown={{ markdown, id, font: selectedFont }}
              logoUrl={logoUrl.url}
              isPreview
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;700&family=Roboto:wght@400;500;700&family=Lato:wght@400;700&family=Montserrat:wght@400;500;700&family=Source+Code+Pro:wght@400;700&family=Fira+Code:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header />
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
                isMobilePreviewVisible={false}
                selectedFont={selectedFont}
                setSelectedFont={setSelectedFont}
                setLogoUrl={setLogoUrl}
              />
              <Preview
                markdown={{ markdown, id, font: selectedFont }}
                logoUrl={logoUrl}
                isPreview
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
export default App;
