import React, { useState, useId } from "react";

interface ExpandableSectionProps {
  id?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  buttonLabel?: {
    expanded: string;
    collapsed: string;
  };
  className?: string;
  ariaLabel?: string;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  id,
  children,
  defaultExpanded = false,
  buttonLabel = {
    expanded: "Masquer",
    collapsed: "Voir plus",
  },
  className = "",
  ariaLabel,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const generatedId = useId();
  const sectionId = id || `expandable-${generatedId}`;

  return (
    <div className={className}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isExpanded}
        aria-controls={sectionId}
        aria-label={ariaLabel}
      >
        <span>{isExpanded ? buttonLabel.expanded : buttonLabel.collapsed}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div id={sectionId} className="mt-4" role="region">
          {children}
        </div>
      )}
    </div>
  );
};

