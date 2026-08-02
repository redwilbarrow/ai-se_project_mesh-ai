import "./KnowledgeBase.css";
import { useState, useEffect } from "react";
import type { KnowledgeDoc } from "../../utils/api";
import { getDocuments } from "../../utils/api";
import UploadArea from "../../components/UploadArea/UploadArea";
import deleteIcon from "../../assets/images/delete-icon.svg";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const newDoc: KnowledgeDoc = {
      _id: Date.now().toString(),
      title: file.name,
      fileName: file.name,
      userId: "local",
      createdAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]); // Used the functional update instead of `[newDoc, ...documents]` to ensure latest state is used.
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
        <UploadArea onFileSelect={handleFileSelect} />
        {isLoading && <p className="knowledge-base__status">Loading...</p>}
        {!isLoading && error && (
          <p className="knowledge-base__status knowledge-base__status_error">
            Failed to load documents.
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
