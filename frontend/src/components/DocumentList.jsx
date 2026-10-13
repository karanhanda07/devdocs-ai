// Component that shows saved documents
function DocumentList({ documents, openDocument, downloadDocument, setSelectedDocumentId, }) {
    return (
        <div>


            <h2>Saved Documents</h2>
            {documents.map((document) => (
                <div key={document.id} className="document-item">

                    <p>{document.original_name}</p>

                    <div className="document-actions">
                        <button onClick={() => openDocument(document.id)}>
                            Open
                        </button>

                        <button onClick={() => downloadDocument(document.id)}>
                            Download
                        </button>

                        <button onClick={() => setSelectedDocumentId(document.id)}>
                            Use for AI
                        </button>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default DocumentList;