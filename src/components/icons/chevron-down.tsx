export const ChevronDown: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 9l7 7 7-7"
      />
    </svg>
  );
};
