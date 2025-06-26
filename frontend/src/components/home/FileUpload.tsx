import { FileUpIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

export default function FileUpload() {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0]; // Get the first file

    if (file) {
      const fileType = file.type;

      if (
        fileType === "application/pdf" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Proceed
      } else {
        // Display error message
        alert("Unsupported file type! Please upload a PDF or DOCX file.");
        event.target.value = ""; // Clear the file input
      }
    }
  }

  return (
    <Card className="w-full max-w-sm md:max-w-md">
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
        <CardDescription>
          Upload your existing resume to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="border-2 border-dashed rounded-xl pt-3 pb-1 px-1 flex flex-col place-items-center">
        <span className="bg-muted p-3 rounded-full">
          <FileUpIcon />
        </span>
        <h6 className="text-muted-foreground mt-3 mb-1">
          Drag and drop or click to browse files
        </h6>
        <small className="mb-6">Supported formats: PDF or DOCX</small>
        <Input type="file" accept=".pdf, .docx" onChange={handleFileChange} />
      </CardContent>
    </Card>
  );
}
