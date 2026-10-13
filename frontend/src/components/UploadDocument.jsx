
import { useEffect, useRef } from "react";
// Component for choosing and uploading a PDF
function UploadDocument({ file, setFile, handleUpload, isUploading, uploadMessage, }) {
    // Gives us direct access to the real file input
    const fileInputRef = useRef(null);

    // Clear the visible filename after a successful upload
    useEffect(() => {
        if (!file && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [file]);
    return (
        <div>
            {/* Choose a PDF from the computer */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(event) => {
                    setFile(event.target.files[0]);
                }}
            />
            <button
                onClick={handleUpload}
                disabled={!file || isUploading}
            >
                {isUploading ? "Uploading..." : "Upload PDF"}
            </button>

            {isUploading && (
                <p>Uploading and processing document...</p>
            )}

            {uploadMessage && (
                <p className="upload-message">
                    {uploadMessage}
                </p>
            )}
        </div>
    );
}

// Export so App.jsx can use this component
export default UploadDocument;