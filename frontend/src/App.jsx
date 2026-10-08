import { useEffect, useState } from "react";
import UploadDocument from "./components/UploadDocument";
import DocumentList from "./components/DocumentList";

function App() {
  const [message, setMessage] = useState("");


  // Stores the PDF file selected by the user
  const [file, setFile] = useState(null);

  //stores the list of saved documents
  const [documents, setDocuments] = useState([]);

  //Stores the text extracted from the PDF
  const [pdfText, setPdfText] = useState("");

  useEffect(() => {
    async function getMessage() {

      const response = await fetch("http://localhost:5000");
      const data = await response.json();

      setMessage(data.message);
    }
    getMessage();

  }, []);

  // Runs when the upload PDF button is clicked
  async function handleUpload() {
    //stop if the user has not selected a file
    if (!file) {
      return;
    }
    // FormData is used to send files to the backend
    const formData = new FormData();
    // 'File' must match upload.single('file) in the backend
    formData.append('file', file);
    // send the PDF to our Express /upload route
    const response = await fetch('http://localhost:5000/upload', {
      method: "POST",
      body: formData,
    });

    // Convert backend JSON response into JavaScript
    const data = await response.json();

    //Save extracted PDF text into React state
    setPdfText(data.document.extracted_text);
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


  return (
    <div>
      <h1>DevDocs AI</h1>

      <p>{message}</p>

      <UploadDocument
        setFile={setFile}
        handleUpload={handleUpload}
      />

      {/* Saved documents section */}
      <DocumentList
        documents={documents}
        getDocuments={getDocuments}
        openDocument={openDocument}
        downloadDocument={downloadDocument}
      />

      <h2>Extracted Text</h2>

      <p>{pdfText}</p>
    </div>
  );
}


export default App;