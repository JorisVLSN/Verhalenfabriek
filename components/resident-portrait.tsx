import Image from "next/image";

interface ResidentPortraitProps {
  name: string;
  emoji: string;
  imageSrc?: string;
  className?: string;
}

export function ResidentPortrait({
  name,
  emoji,
  imageSrc,
  className = "",
}: ResidentPortraitProps) {
  if (imageSrc) {
    return (
      <span className={`${className} resident-portrait-with-image`}>
        <Image
          src={imageSrc}
          alt={`Portret van ${name}`}
          width={256}
          height={256}
          className="resident-portrait-image"
        />
      </span>
    );
  }

  return (
    <span className={className} aria-hidden="true">
      {emoji}
    </span>
  );
}
