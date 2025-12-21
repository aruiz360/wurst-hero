type InteractionProps = {
  interaction: Interaction;
  index: number;
};

export default function Interaction({ interaction, index }: InteractionProps) {
  const { level_1: levelOne, level_2: levelTwo } = interaction;

  return (
    <div className="space-y-2 rounded-md border border-foreground/10 bg-foreground/5 p-3">
      <div className="text-sm font-semibold text-foreground/70">
        Step {index + 1} · {interaction.type === "character" ? "Character" : "Context"}
      </div>

      <div>
        <p className="font-medium">{levelOne.action.en}</p>
        {levelOne.possible_reactions?.length > 0 && (
          <ul className="mt-1 list-disc pl-4 text-sm">
            {levelOne.possible_reactions.map((reaction, reactionIdx) => (
              <li key={`lvl1-reaction-${reactionIdx}`}>
                {reaction.text.en}
              </li>
            ))}
          </ul>
        )}
      </div>

      {levelTwo && (
        <div className="rounded bg-background/60 p-2 text-sm">
          <p className="font-medium">{levelTwo.action.en}</p>
          {levelTwo.possible_reactions?.length > 0 && (
            <ul className="mt-1 list-disc pl-4">
              {levelTwo.possible_reactions.map((reaction, reactionIdx) => (
                <li key={`lvl2-reaction-${reactionIdx}`}>
                  {reaction.text.en}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
