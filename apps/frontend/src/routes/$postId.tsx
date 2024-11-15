import { createFileRoute } from "@tanstack/react-router";
import App from "../components/App";

export const Route = createFileRoute("/$postId")({
  component: PostComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      preview: search.preview as boolean | undefined,
    }
  },
});

function PostComponent() {
  const { postId } = Route.useParams();
  const { preview } = Route.useSearch();

  console.log("Route Params:", Route.useParams());
  console.log("PostID:", postId, typeof postId);

  return <App id={postId} preview={!!preview} />;
}
