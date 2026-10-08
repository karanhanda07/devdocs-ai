

// Component for choosing and uploading a PDF
function UploadDocument({ setFile, handleUpload }) {
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

            {/* Upload the selected PDF */}
            <button onClick={handleUpload}>
                Upload PDF
            </button>
        </div>
    );
}

// Export so App.jsx can use this component
export default UploadDocument;