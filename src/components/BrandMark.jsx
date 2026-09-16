export function BrandMark({ size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="14" fill="#1c1410" stroke="#e7c48a" strokeWidth="1.6" />
      <path
        d="M12 34V16.5c0-1.2.9-2.1 2.1-2.1h.4c.7 0 1.3.3 1.7.9L24 26.2 31.8 15.3c.4-.6 1-.9 1.7-.9h.4c1.2 0 2.1.9 2.1 2.1V34"
        stroke="#e7c48a"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
