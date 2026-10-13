

// Component for choosing and uploading a PDF
function UploadDocument({ file, setFile, handleUpload, isUploading, }) {
    return (
        <div>
            {/* Choose a PDF from the computer */}
            <input
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
        </div>
    );
}

// Export so App.jsx can use this component
export default UploadDocument;