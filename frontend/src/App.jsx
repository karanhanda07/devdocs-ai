import { useState } from "react";
import UploadDocument from "./components/UploadDocument";
import DocumentList from "./components/DocumentList";
import "./App.css";

function App() {


  // Stores the PDF file selected by the user
  const [file, setFile] = useState(null);

  //stores the list of saved documents
  const [documents, setDocuments] = useState([]);

  //  Stores the user's question
  const [question, setQuestion] = useState("");

  // Stores the AI answer
  const [answer, setAnswer] = useState("");
  //  Tracks whether DevDocs AI is currently finding an answer
  const [isLoading, setIsLoading] = useState(false);
  // Stores which PDF the user wants to ask questions about
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  // Controls whether the saved documents section is visible
  const [showDocuments, setShowDocuments] = useState(false);
  // Tracks whether a PDF is currently being uploaded and processed
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
    } finally {
      // Always stop loading, even if upload fails
      setIsUploading(false);
    }
  }

  async function getDocuments() {
    const response = await fetch("http://localhost:5000/documents");

    // Convert JSON response into JavaScript
    const data = await response.json();
    // Save documents into React state
    setDocuments(data);
  }

  // Open one saved pdf using a temporary secure URL
  async function openDocument(id) {
    const newTab = window.open("", "_blank");
    // Ask backend to create a temporary URL for this document
    const response = await fetch(
      `http://localhost:5000/documents/${id}/url`
    );
    //convert backend JSON response into JS
    const data = await response.json();
    //send the already-open tab to the PDF URL
    newTab.location.href = data.url;
  }

  // download one saved PDF
  async function downloadDocument(id) {
    // Ask backend for a temporary download URL
    const response = await fetch(
      `http://localhost:5000/documents/${id}/download`
    );
    // convert backend response into JS
    const data = await response.json();
    // send browser to the secure download URL
    window.location.href = data.url;
  }
  //  Send the user's question to the backend
  async function askQuestion() {

    //  Show loading message while we wait
    setIsLoading(true);
    // Clear the old answer while a new question is being processed
    setAnswer("");

    const response = await fetch("http://localhost:5000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        documentId: selectedDocumentId,
      }),
    });

    const data = await response.json();

    setAnswer(data.answer);

    //  Answer arrived, so stop loading
    setIsLoading(false);
  }
  // Show or hide saved documents
  async function toggleDocuments() {
    // Load documents when opening the section
    if (!showDocuments) {
      await getDocuments();
    }

    setShowDocuments(!showDocuments);
  }

  // Find the document currently selected for AI questions
  const selectedDocument = documents.find(
    (document) => document.id === selectedDocumentId
  );
  return (
    <div>
      <h1>DevDocs AI</h1>

      <section className="card">
        <h2>Upload Document</h2>

        <UploadDocument
          file={file}
          setFile={setFile}
          handleUpload={handleUpload}
          isUploading={isUploading}
        />
      </section>

      {/* Show or hide saved documents */}
      <button onClick={toggleDocuments}>
        {showDocuments ? "Hide Saved Documents" : "View Saved Documents"}
      </button>

      {/* Only show the list when this section is open */}
      {showDocuments && (
        <DocumentList
          documents={documents}
          openDocument={openDocument}
          downloadDocument={downloadDocument}
          setSelectedDocumentId={setSelectedDocumentId}
        />
      )}
      {/* Ask a question about the uploaded documents */}
      {/* Ask AI section */}
      <div>
        <h2>Ask DevDocs AI</h2>

        {/* Show which document is being searched */}
        <p>
          Using: {selectedDocument
            ? selectedDocument.original_name
            : "All documents"}
        </p>

        {/* Let user return to searching all documents */}
        {selectedDocument && (
          <button onClick={() => setSelectedDocumentId(null)}>
            Use All Documents
          </button>
        )}

        {/* Question box */}
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a question about your documents..."
          rows="4"
        />

        {/* Disable Ask when question is empty or AI is already working */}
        <button
          onClick={askQuestion}
          disabled={!question.trim() || isLoading}
        >
          {isLoading ? "Thinking..." : "Ask"}
        </button>

        {/* Only show loading while waiting */}
        {isLoading && (
          <p>Searching your documents and preparing an answer...</p>
        )}

        {/* Only show answer when one exists */}
        {answer && (
          <div>
            <h3>Answer</h3>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}


export default App;