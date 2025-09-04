export const CategoriesIconSimple: React.FC<React.SVGAttributes<{}>> = (
  props
) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Folder Shape */}
      <path
        d="M3 4H10L12 6H21C21.55 6 22 6.45 22 7V19C22 19.55 21.55 20 21 20H3C2.45 20 2 19.55 2 19V5C2 4.45 2.45 4 3 4Z"
        fill="currentColor"
      />

      {/* Grid representing categories */}
      <path
        d="M8 10H10V12H8V10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 10H16V12H14V10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 14H10V16H8V14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 14H16V16H14V14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
