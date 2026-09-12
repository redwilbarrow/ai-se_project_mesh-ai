import "./KnowledgeBase.css";
import { useState, useEffect } from "react";
import type { KnowledgeDoc } from "../../types";
import { deleteDocument, getDocuments, uploadDocument } from "../../utils/api";
import UploadArea from "../../components/UploadArea/UploadArea";
import deleteIcon from "../../assets/images/delete-icon.svg";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDeleteDocument = async (documentId: string) => {
    setError(null);

    try {
      await deleteDocument(documentId);
      setDocuments((prevDocuments) =>
        prevDocuments.filter((document) => document._id !== documentId),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete document.",
      );
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const res = await uploadDocument(file);

      if (res.data) {
        setDocuments((prevDocuments) => [res.data!, ...prevDocuments]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload document.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDocuments();
        setDocuments(res.data || []);
      } catch {
        setError("Failed to load documents.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="knowledge-base">
      <h1 className="knowledge-base__title">Manage Your Knowledge Base</h1>
      <section className="knowledge-base__content">
        <p className="knowledge-base__description">Upload documents (PDF)</p>
        <UploadArea onFileSelect={handleFileSelect} isUploading={isUploading} />
        {isLoading && <p className="knowledge-base__status">Loading...</p>}
        {!isLoading && error && (
          <p className="knowledge-base__status knowledge-base__status_error">
            {error}
          </p>
        )}
        {!isLoading && !error && documents.length === 0 && (
          <p className="knowledge-base__status">No documents yet.</p>
        )}
        {!isLoading && !error && documents.length > 0 && (
          <ul className="knowledge-base__documents-list">
            {documents.map((document) => (
              <li key={document._id} className="knowledge-base__document-item">
                <span>{document.fileName}</span>
                <button
                  type="button"
                  className="knowledge-base__delete-document-btn"
                  aria-label={`Delete ${document.fileName}`}
                  onClick={() => handleDeleteDocument(document._id)}
                >
                  <img
                    src={deleteIcon}
                    alt=""
                    className="knowledge-base__delete-icon"
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
        <button type="button" className="knowledge-base__save-btn">
          Save
        </button>
      </section>
    </div>
  );
}
