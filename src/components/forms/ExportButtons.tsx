import React, { useState } from "react";
import { Button } from "../shared/ui/Button";
import type { ScoredExercise, SportProfile } from "../../types/index.js";
import {
  downloadProgramAsJSON,
  downloadProgramAsText,
  copyShareLinkToClipboard,
} from "../../utils/exportProgram";
import { APP_CONFIG } from "../../config/constants";

interface ExportButtonsProps {
  suggestions: ScoredExercise[];
  profile: SportProfile | null;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ suggestions, profile }) => {
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = async () => {
    const success = await copyShareLinkToClipboard(suggestions, profile);
    if (success) {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), APP_CONFIG.SHARE_LINK_COPIED_TIMEOUT);
    } else {
      alert("Impossible de copier le lien. Veuillez réessayer.");
    }
  };

  const downloadJsonIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  const downloadTextIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  const shareIcon = shareCopied ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <Button
        variant="success"
        onClick={() => downloadProgramAsJSON(suggestions, profile)}
        icon={downloadJsonIcon}
        aria-label="Télécharger le programme en JSON"
      >
        Télécharger JSON
      </Button>
      <Button
        variant="primary"
        onClick={() => downloadProgramAsText(suggestions, profile)}
        icon={downloadTextIcon}
        aria-label="Télécharger le programme en texte"
      >
        Télécharger TXT
      </Button>
      <Button
        variant={shareCopied ? "success" : "secondary"}
        onClick={handleShare}
        icon={shareIcon}
        aria-label="Partager le programme"
      >
        {shareCopied ? "Lien copié !" : "Partager"}
      </Button>
    </div>
  );
};

