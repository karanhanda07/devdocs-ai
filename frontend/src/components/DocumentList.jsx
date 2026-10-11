// Component that shows saved documents
function DocumentList({ documents, getDocuments, openDocument, downloadDocument }) {
    return (
        <div>


            <button onClick={getDocuments}>
                View Saved Documents
            </button>
            <h2>Saved Documents</h2>
            {documents.map((document) => (
                <div key={document.id}>

                    <p>{document.original_name}</p>

                    <button onClick={() => openDocument(document.id)}>Open</button>
                    <button onClick={() => downloadDocument(document.id)}>Download</button>
                </div>
            ))}

        </div>
    );
}

export default DocumentList;