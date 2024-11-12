import { createLazyFileRoute } from "@tanstack/react-router";
import App from "../components/App";
import { generateUniqueEightDigitNumber } from "../utils";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
 const id= generateUniqueEightDigitNumber();
  return (
    <div className="p-2">
      <App id={id} />
    </div>
  );
}
