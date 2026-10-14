const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import { useState, useCallback } from "react";
import { Routes, Route, Link } from "react-router-dom";
import DocumentsPage from "./pages/DocumentsPage";
import "./App.css";
import UploadDocument from "./components/UploadDocument";
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

  // Tracks whether a PDF is currently being uploaded and processed
  const [isUploading, setIsUploading] = useState(false);
  // Shows upload success/error feedback
  const [uploadMessage, setUploadMessage] = useState("");

  async function handleUpload() {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      // Clear the selected file after successful upload
      setFile(null);

      // Show confirmation
      setUploadMessage("PDF uploaded successfully.");
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setUploadMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);
      setUploadMessage("Could not upload PDF.");
    } finally {
      setIsUploading(false);
    }
  }
  // Loads all saved documents from the backend
  const getDocuments = useCallback(async () => {
    const response = await fetch(`${API_URL}/documents`);

    const data = await response.json();

    setDocuments(data);
  }, []);

  // Open one saved pdf using a temporary secure URL
  async function openDocument(id) {
    const newTab = window.open("", "_blank");
    // Ask backend to create a temporary URL for this document
    const response = await fetch(
      `${API_URL}/documents/${id}/url`
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
      `${API_URL}/documents/${id}/download`
    );
    // convert backend response into JS
    const data = await response.json();
    // send browser to the secure download URL
    window.location.href = data.url;
  }
  // NEW: Delete one saved document
  async function deleteDocument(id) {
    // Ask the user to confirm before deleting



    const response = await fetch(
      `${API_URL}/documents/${id}`,
      {
        method: "DELETE",
      }
    );

    // Convert backend response into JavaScript
    const data = await response.json();

    // If delete failed, stop here
    if (!response.ok) {
      console.error(data.message);
      return;
    }

    // Reload the documents list after deletion
    await getDocuments();
  }
  //  Send the user's question to the backend
  async function askQuestion() {

    //  Show loading message while we wait
    setIsLoading(true);
    // Clear the old answer while a new question is being processed
    setAnswer("");

    const response = await fetch(`${API_URL}/search`, {
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
    setQuestion("");
    //  Answer arrived, so stop loading
    setIsLoading(false);
  }

  // Find the document currently selected for AI questions
  const selectedDocument = documents.find(
    (document) => document.id === selectedDocumentId
  );
  return (
    <Routes>


      <Route
        path="/documents"
        element={
          <DocumentsPage
            documents={documents}
            getDocuments={getDocuments}
            openDocument={openDocument}
            downloadDocument={downloadDocument}
            setSelectedDocumentId={setSelectedDocumentId}
            deleteDocument={deleteDocument}
          />
        }
      />

      {/* Main DevDocs AI page */}
      <Route
        path="/"
        element={
          <div className="app">

            {/* Top navigation */}
            <header className="topbar">
              <h1>DevDocs AI</h1>

              <div className="topbar-actions">

                <Link to="/documents">
                  Documents
                </Link>
              </div>
            </header>

            {/* Main AI area */}
            <main className="hero">
              <p className="eyebrow">AI DOCUMENT ASSISTANT</p>

              <h2>Ask your documents anything.</h2>

              <p className="hero-subtitle">
                Upload PDFs, search their content, and get answers grounded in your documents.
              </p>

              {/* Question box */}
              <div className="ask-box">
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask a question about your documents..."
                  rows="3"
                />

                <div className="ask-footer">

                  {/* Shows which document AI will search */}
                  <div className="source-info">
                    <span className="source-label">Source</span>

                    <span className="source-name">
                      {selectedDocument
                        ? selectedDocument.original_name
                        : "All documents"}
                    </span>

                    {/* Reset back to all documents */}
                    {selectedDocument && (
                      <button
                        className="source-clear"
                        onClick={() => setSelectedDocumentId(null)}
                        title="Use all documents"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Sends question to backend */}
                  <button
                    onClick={askQuestion}
                    disabled={!question.trim() || isLoading}
                  >
                    {isLoading ? "Thinking..." : "Ask"}
                  </button>

                </div>
              </div>

              {/* AI answer */}
              {answer && (
                <div className="answer-box">
                  <h3>Answer</h3>
                  <p>{answer}</p>
                </div>
              )}
            </main>

            {/* Upload area */}
            <section className="upload-panel">
              <UploadDocument
                file={file}
                setFile={setFile}
                handleUpload={handleUpload}
                isUploading={isUploading}
                uploadMessage={uploadMessage}
              />
            </section>

          </div>
        }
      />

    </Routes>
  );
}

export default App;