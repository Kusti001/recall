export function Logo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
    >
      <path
        d="M3 12C3 7 7 3 12 3s9 4 9 9-4 9-9 9c-2.5 0-4.7-1-6.4-2.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="text-blue-400"
      />

      <path
        d="M3 12l3.5-2.2M3 12l3.5 2.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-400"
      />
    </svg>
  )
}
