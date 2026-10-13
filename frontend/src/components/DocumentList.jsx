import { useState } from "react";

// Component that shows all saved documents
function DocumentList({
    documents,
    openDocument,
    downloadDocument,
    deleteDocument,
    setSelectedDocumentId,
}) {

    // Stores the document waiting for delete confirmation
    const [documentToDelete, setDocumentToDelete] = useState(null);

    if (documents.length === 0) {
        return <p className="documents-empty">No documents uploaded yet.</p>;
    }

    return (
        <>
            <div className="document-list">

                {/* Column headings */}
                <div className="document-header">
                    <span>Filename</span>
                    <span>Uploaded</span>
                    <span>Actions</span>
                </div>

                {documents.map((document) => (
                    <div key={document.id} className="document-item">

                        {/* Filename */}
                        <p className="document-name">
                            {document.original_name}
                        </p>

                        {/* Upload date */}
                        <span className="document-date">
                            {new Date(document.created_at).toLocaleDateString("en-CA", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>

                        {/* Actions */}
                        <div className="document-actions">

                            <button onClick={() => openDocument(document.id)}>
                                Open
                            </button>

                            <button onClick={() => downloadDocument(document.id)}>
                                Download
                            </button>

                            <button
                                className="use-ai-button"
                                onClick={() => setSelectedDocumentId(document.id)}
                            >
                                Use for AI
                            </button>

                            <details className="more-menu">
                                <summary
                                    className="more-button"
                                    title="More actions"
                                >
                                    ⋯
                                </summary>

                                <div className="more-menu-content">
                                    <button
                                        className="delete-document-button"
                                        onClick={() => setDocumentToDelete(document)}
                                    >
                                        Delete document
                                    </button>
                                </div>
                            </details>

                        </div>
                    </div>
                ))}

            </div>

            {/* Custom delete confirmation */}
            {documentToDelete && (
                <div className="delete-modal-overlay">

                    <div className="delete-modal">

                        <h2>Delete document?</h2>

                        <p>
                            This will permanently delete{" "}
                            <strong>{documentToDelete.original_name}</strong>.
                        </p>

                        <div className="delete-modal-actions">

                            <button
                                onClick={() => setDocumentToDelete(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-delete-button"
                                onClick={async () => {
                                    await deleteDocument(documentToDelete.id);
                                    setDocumentToDelete(null);
                                }}
                            >
                                Delete
                            </button>

                        </div>
                    </div>

                </div>
            )}
        </>
    );
}

export default DocumentList;