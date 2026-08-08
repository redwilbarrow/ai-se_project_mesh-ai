import "./IntroCard.css";

type IntroCardProps = {
  imageSrc: string;
  text: string;
};

export default function IntroCard({ imageSrc, text }: IntroCardProps) {
  return (
    <article className="intro-card">
      <img
        className="intro-card__image"
        src={imageSrc}
        alt=""
        aria-hidden="true"
      />
      <p className="intro-card__text">{text}</p>
    </article>
  );
}
