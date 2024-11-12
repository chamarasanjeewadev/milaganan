import { Split, FileEdit, Eye } from "lucide-react";

interface HeaderProps {
  isMobilePreviewVisible: boolean;
  setIsMobilePreviewVisible: (value: boolean) => void;
}

export function Header({
  isMobilePreviewVisible,
  setIsMobilePreviewVisible,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* <Split className="h-6 w-6 text-indigo-600" /> */}
          <h1 className="text-xl font-semibold text-gray-800">මි​ල ගන​​න්</h1>
        </div>
        <button
          className="md:hidden flex items-center space-x-1 px-3 py-1 rounded-md bg-indigo-50 text-indigo-600"
          onClick={() => setIsMobilePreviewVisible(!isMobilePreviewVisible)}
        >
          {isMobilePreviewVisible ? (
            <FileEdit className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span>{isMobilePreviewVisible ? "Edit" : "Preview"}</span>
        </button>
      </div>
    </header>
  );
}
