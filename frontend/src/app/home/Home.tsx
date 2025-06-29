import FileUploader from "@/components/home/FileUploader";

export default function Home() {
  return (
    <div className="h-dvh flex flex-col place-items-center place-content-center">
      <h1 className="my-6">Resume Editor</h1>
      <FileUploader />
    </div>
  );
}
