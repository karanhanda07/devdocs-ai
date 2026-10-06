import { useEffect, useState } from "react";

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

  return (
    <div>
      <h1>DevDocs AI</h1>
      <p>{message}</p>
      <input
        type="file"
        accept=".pdf"
        onChange={(event) => {
          //get the first selected file
          setFile(event.target.files[0]);
        }} />
      <button onClick={handleUpload}>
        Upload PDF
      </button>
      <button onClick={getDocuments}>
        View Saved Documents
      </button>

      <h2>Saved Documents</h2>
      {documents.map((document) => (
        <p key={document.id}>
          {document.original_name}
        </p>
      ))}
      <h2>Extracted Text</h2>

      <p> {pdfText}</p>
    </div>
  );
}

export default App;