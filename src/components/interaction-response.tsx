import { useState } from "react";
import { renderLocalizedText } from "@/utils/localizedText";

type InteractionResponseProps = {
  levelOne: InteractionLevel;
  levelTwo?: InteractionLevel;
};

function normalize(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

function similarity(a: string, b: string) {
  const aNorm = normalize(a);
  const bNorm = normalize(b);
  const maxLen = Math.max(aNorm.length, bNorm.length);
  if (maxLen === 0) return 0;
  const minLen = Math.min(aNorm.length, bNorm.length);
  let matches = 0;
  for (let i = 0; i < minLen; i++) {
    if (aNorm[i] === bNorm[i]) matches += 1;
  }
  return matches / maxLen;
}

function collectResponses(level?: InteractionLevel) {
  return level?.possible_reactions?.map((reaction) => reaction.text.en) ?? [];
}

export default function InteractionResponse({
  levelOne,
  levelTwo,
}: InteractionResponseProps) {
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const handleValidate = () => {
    if (!answer.trim()) {
      setFeedback("Please enter a response.");
      setScore(null);
      return;
    }

    const levelOneResponses = collectResponses(levelOne);
    const levelTwoResponses = collectResponses(levelTwo);

    let bestLevelOne = 0;
    for (const resp of levelOneResponses) {
      bestLevelOne = Math.max(bestLevelOne, similarity(answer, resp));
    }

    let bestLevelTwo = 0;
    for (const resp of levelTwoResponses) {
      bestLevelTwo = Math.max(bestLevelTwo, similarity(answer, resp));
    }

    if (bestLevelTwo >= 0.8) {
      setScore(100);
      setFeedback("Great! Very close to level 2.");
    } else if (bestLevelOne >= 0.5) {
      setScore(50);
      setFeedback("Good! Close to level 1.");
    } else {
      setScore(0);
      setFeedback("Needs work. Try aligning more closely with the expected responses.");
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground/80">
        Your response
      </label>
      <input
        type="text"
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        className="w-full rounded border border-foreground/20 bg-background p-2 text-sm"
        placeholder="Type your reply..."
      />
      <button
        type="button"
        onClick={handleValidate}
        className="rounded bg-foreground px-3 py-2 text-sm font-semibold text-background"
      >
        Check answer
      </button>
      {score !== null && (
        <div className="text-sm">
          Score: {score} — {feedback}
        </div>
      )}
    </div>
  );
}
