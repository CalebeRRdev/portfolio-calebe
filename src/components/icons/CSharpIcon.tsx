// File: src/components/icons/CSharpIcon.tsx
import type { IconBaseProps } from "react-icons";

/** C#'s hexagon mark with the "C" cut out — a glyph, so the label isn't repeated inside it */
export function CSharpIcon({ size = "1em", ...props }: IconBaseProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M12 1.6 21 6.8v10.4L12 22.4 3 17.2V6.8L12 1.6Zm3.68 6.72A5.2 5.2 0 1 0 15.68 15.68L14.05 14.05A2.9 2.9 0 1 1 14.05 9.95Z"
      />
    </svg>
  );
}
