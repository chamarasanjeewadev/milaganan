import { createFileRoute } from "@tanstack/react-router";
import App from "../components/App";

export const Route = createFileRoute("/$postId")({
  component: PostComponent,
});

function PostComponent() {
  const { postId } = Route.useParams();
  console.log("Route Params:", Route.useParams());
  console.log("PostID:", postId, typeof postId);
  return <App id={postId} />;
}