import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DocumentList from "../components/DocumentList";

function DocumentsPage({
    documents,
    getDocuments,
    openDocument,
    downloadDocument,
    setSelectedDocumentId,
    deleteDocument,
}) {

    //  Lets us move between frontend pages
    const navigate = useNavigate();

    //  Load saved documents when this page opens
    useEffect(() => {
        getDocuments();
    }, [getDocuments]);

    // Select one document for AI and return to the main page
    function useDocumentForAI(id) {
        setSelectedDocumentId(id);
        navigate("/");
    }

    return (
        <main className="documents-page">

            {/* Go back to the main AI page */}
            <Link to="/">← Back to DevDocs AI</Link>

            <h1>All Documents</h1>

            {/* Show all saved documents */}
            <DocumentList
                documents={documents}
                openDocument={openDocument}
                downloadDocument={downloadDocument}
                setSelectedDocumentId={useDocumentForAI}
                deleteDocument={deleteDocument}
            />

        </main>
    );
}

export default DocumentsPage;