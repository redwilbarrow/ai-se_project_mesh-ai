import "./Intro.css";
import titleIcon from "../../assets/images/intro__title-icon.png";
import secureDocumentsImage from "../../assets/images/secureDocumentsImage.png";
import organizeDocumentsImage from "../../assets/images/organizeDocumentsImage.png";
import knowledgeBaseImage from "../../assets/images/knowledgeBaseImage.png";
import IntroCard from "../../components/IntroCard/IntroCard";
import { Link } from "react-router-dom";

const introCards = [
  {
    id: "secure-documents",
    imageSrc: secureDocumentsImage,
    text: "Bring all your documents into one secure AI workspace",
  },
  {
    id: "organize-documents",
    imageSrc: organizeDocumentsImage,
    text: "Organize and manage the documents that power your AI",
  },
  {
    id: "knowledge-base",
    imageSrc: knowledgeBaseImage,
    text: "Your knowledge base, accessible through a simple chat interface",
  },
];

export default function Intro() {
  return (
    <div className="intro">
      <div className="intro__hero">
        <h1 className="intro__title">
          Welcome to{" "}
          <span className="intro__title-group">
            Mesh AI
            <img
              src={titleIcon}
              alt=""
              aria-hidden="true"
              className="intro__title-icon"
            />
          </span>
        </h1>

        <section className="intro__features" aria-label="Mesh AI features">
          {introCards.map((card) => (
            <IntroCard
              key={card.id}
              imageSrc={card.imageSrc}
              text={card.text}
            />
          ))}
        </section>
      </div>

      <section className="intro__start">
        <p className="intro__start-text">
          {"Start by creating your Organisation's Knowledge Base"}
        </p>
        <Link
          to="/knowledge"
          className="intro__start-btn"
          aria-label="Start by creating your Organisation's Knowledge Base"
        >
          Start
        </Link>
      </section>
    </div>
  );
}
