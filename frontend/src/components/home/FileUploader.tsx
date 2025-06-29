import {
  AlertCircleIcon,
  FileUpIcon,
  CheckCircle2Icon,
  XIcon,
  FileTextIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export default function FileUploader() {
  const [error, setError] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  // Function to handle Edit button click
  function handleEditClick() {
    if (!uploadedFile) {
      setError("Please upload a file first before proceeding to edit.");
      return;
    }
    // Navigate to edit page (this would be handled by your routing system)
    window.location.href = "/edit-resume";
  }

  // This function handles file uploads that were uploaded using input
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; // Get the first file

    if (file) {
      const fileType = file.type;
      const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

      // Check file size first
      if (file.size > maxSizeInBytes) {
        event.target.value = ""; // Clear the file input
        setError(
          "File size exceeds 10 MB limit. Please upload a smaller file.",
        );
        return;
      }

      // Check file type
      if (
        fileType === "application/pdf" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Proceed with mock parsing
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type,
        });
        setError(null);
      } else {
        event.target.value = ""; // Clear the file input
        setError("Unsupported file type! Please upload a PDF or DOCX file.");
      }
    }
  }

  // The following functions handles file uploads that were dragged and dropped

  // This function is triggered when a file is being dragged over a valid drop target
  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault(); // Highlight the drop zone
    setHighlight(true);
  }

  // This function is triggered when the file leaves the valid drop target
  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault(); // Remove highlight
    setHighlight(false);
  }

  // This function is triggered when the dragged file is dropped on the target
  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault(); // Prevent the file opening in the tab
    setHighlight(false);

    const files = event.dataTransfer.files;
    const file = files[0]; // Get the first file

    if (!file) {
      return;
    }

    const fileType = file.type;
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

    // Check file size first
    if (file.size > maxSizeInBytes) {
      setError("File size exceeds 10 MB limit. Please upload a smaller file.");
      return;
    }

    // Check file type
    if (
      fileType === "application/pdf" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Proceed with mock parsing
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
      });
      setError(null);
    } else {
      setError("Unsupported file type! Please upload a PDF or DOCX file.");
    }
  }

  // Function to handle file removal
  function handleRemoveFile() {
    setUploadedFile(null);
    setError(null);
    // Reset file input - find the input in the current component
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  // Function to format file size
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)).toString() +
      " " +
      sizes[i]
    );
  }

  return (
    <Card className="w-full max-w-sm md:max-w-md">
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
        <CardDescription>
          Upload your existing resume to get started
        </CardDescription>
      </CardHeader>

      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadedFile && (
        <Alert>
          <CheckCircle2Icon className="h-4 w-4" />
          <AlertDescription>File uploaded successfully!</AlertDescription>
        </Alert>
      )}

      {uploadedFile ? (
        <CardContent className="flex items-center justify-between rounded-md border bg-muted p-4">
          <div className="flex items-center space-x-3">
            <FileTextIcon className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(uploadedFile.size)} •{" "}
                {uploadedFile.type.includes("pdf") ? "PDF" : "DOCX"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            className="h-8 w-8 p-0"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </CardContent>
      ) : (
        <CardContent
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col place-items-center rounded-md border-2 border-dashed bg-muted px-1 pt-6 pb-1 transition-colors",
            highlight && "border-primary bg-neutral-200",
          )}
        >
          <span>
            <FileUpIcon />
          </span>
          <p className="mt-3 mb-1 text-muted-foreground">
            Drag and drop or click to browse files
          </p>
          <small className="mb-6">Supported formats: PDF or DOCX</small>
          <Input
            type="file"
            accept=".pdf, .docx"
            onChange={handleFileChange}
            className="cursor-pointer bg-white"
          />
        </CardContent>
      )}

      <Button className="w-full" onClick={handleEditClick}>
        Edit
      </Button>
    </Card>
  );
}
