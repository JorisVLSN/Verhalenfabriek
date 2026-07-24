export function ProfessorPluisPortrait() {
  return (
    <div className="pluis-portrait" aria-hidden="true">
      <div className="pluis-window">
        <div className="pluis-moon" />
        <span className="pluis-window-star star-a">✦</span>
        <span className="pluis-window-star star-b">·</span>
      </div>

      <div className="pluis-books books-left">
        <i /><i /><i />
      </div>
      <div className="pluis-books books-right">
        <i /><i /><i /><i />
      </div>

      <div className="pluis-cat">
        <span className="pluis-ear ear-left" />
        <span className="pluis-ear ear-right" />
        <span className="pluis-head" />
        <span className="pluis-muzzle" />
        <span className="pluis-nose" />
        <span className="pluis-eye eye-left" />
        <span className="pluis-eye eye-right" />
        <span className="pluis-glasses glasses-left" />
        <span className="pluis-glasses glasses-right" />
        <span className="pluis-glasses-bridge" />
        <span className="pluis-body" />
        <span className="pluis-tail" />
        <span className="pluis-paw paw-left" />
        <span className="pluis-paw paw-right" />
      </div>

      <div className="pluis-book">
        <span className="pluis-page page-left" />
        <span className="pluis-page page-right" />
        <span className="pluis-book-spine" />
        <span className="pluis-page-sparkle">✦</span>
      </div>

      <div className="pluis-cup">☕</div>
      <div className="pluis-cushion" />
    </div>
  );
}

export function ProfessorPluisAvatar({
  size = "medium",
}: {
  size?: "small" | "medium" | "large";
}) {
  return (
    <span
      className={`pluis-avatar pluis-avatar-${size}`}
      role="img"
      aria-label="Professor Pluis"
    >
      <span className="pluis-avatar-ear avatar-ear-left" aria-hidden="true" />
      <span className="pluis-avatar-ear avatar-ear-right" aria-hidden="true" />
      <span className="pluis-avatar-face" aria-hidden="true">
        <span className="pluis-avatar-eye avatar-eye-left" />
        <span className="pluis-avatar-eye avatar-eye-right" />
        <span className="pluis-avatar-glasses avatar-glasses-left" />
        <span className="pluis-avatar-glasses avatar-glasses-right" />
        <span className="pluis-avatar-bridge" />
        <span className="pluis-avatar-nose" />
        <span className="pluis-avatar-smile" />
      </span>
    </span>
  );
}
