type InteractionReaction = {
  text: LocalizedText;
  explanation: LocalizedText;
};

type InteractionLevel = {
  action: LocalizedText;
  possible_reactions: InteractionReaction[];
};

type Interaction = {
  type: "context" | "character";
  character: string | null;
  level_1: InteractionLevel;
  level_2?: InteractionLevel;
};
