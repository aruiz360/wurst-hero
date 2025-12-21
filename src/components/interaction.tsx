import { renderLocalizedText } from "@/utils/localizedText";
import InteractionResponse from "@/components/interaction-response";

type InteractionProps = {
  interaction: Interaction;
  index: number;
};

function renderLevel(level: InteractionLevel, keyPrefix: string) {
  return (
    <div className="space-y-2">
      <div>
        <div className="text-sm font-semibold text-foreground/70">Action</div>
        {renderLocalizedText(level.action)}
      </div>

      {level.possible_reactions?.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-foreground/70">
            Possible reactions
          </div>
          <ul className="mt-1 space-y-2 pl-0">
            {level.possible_reactions.map((reaction, reactionIdx) => (
              <li
                key={`${keyPrefix}-reaction-${reactionIdx}`}
                className="rounded bg-background/60 p-2"
              >
                <div className="text-sm font-medium">
                  {renderLocalizedText(reaction.text)}
                </div>
                <div className="mt-1 text-xs text-foreground/70">
                  {renderLocalizedText(reaction.explanation)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Interaction({ interaction, index }: InteractionProps) {
  const { level_1: levelOne, level_2: levelTwo } = interaction;

  return (
    <div className="space-y-3 rounded-md border border-foreground/10 bg-foreground/5 p-3">
      <div className="text-sm font-semibold text-foreground/70">
        Step {index + 1} · {interaction.type}
        {interaction.character ? ` (${interaction.character})` : ""}
      </div>

      <div className="rounded bg-background/40 p-2">
        <div className="text-sm font-bold">Level 1</div>
        {renderLevel(levelOne, `lvl1-${index}`)}
      </div>

      {levelTwo && (
        <div className="rounded bg-background/30 p-2">
          <div className="text-sm font-bold">Level 2</div>
          {renderLevel(levelTwo, `lvl2-${index}`)}
        </div>
      )}

      <InteractionResponse levelOne={levelOne} levelTwo={levelTwo} />
    </div>
  );
}
