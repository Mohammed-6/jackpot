import React, { useState } from "react";

type fileType = {
  handleReturn: (files: string[]) => void;
};

const FileUploader: React.FC<fileType> = ({ handleReturn }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadResult, setUploadResult] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    //     handleUpload();
    //   };

    //   const handleUpload = async () => {
    if (!e.target.files || e.target.files.length === 0) return;

    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUploadResult(data.ids);
        handleReturn(data.ids);
      } else {
        console.error(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Error uploading files", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 border rounded shadow">
      {/* <h2 className="text-lg font-semibold mb-2">Upload Files</h2> */}
      <input
        type="file"
        multiple
        accept=".png,.jpg,.jpeg,.pdf"
        onChange={handleFileChange}
        className="text-sm text-stone-500
   file:mr-5 file:py-1 file:px-3 file:border-[1px]
   file:text-xs file:font-medium
   file:bg-stone-50 file:text-stone-700
   hover:file:cursor-pointer hover:file:bg-blue-50
   hover:file:text-blue-700"
      />
      {/* <button
        onClick={handleUpload}
        disabled={loading || !files}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button> */}

      {/* {uploadResult.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium">Uploaded File IDs:</h3>
          <ul className="list-disc pl-6 text-sm">
            {uploadResult.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default FileUploader;
