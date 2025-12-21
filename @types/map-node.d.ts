type MapNode = {
  id: number;
  type: "START" | "SITUATION";
  title: LocalizedText;
  description: LocalizedText;
  interactions: Interaction[];
  render: {
    position: { x: number; y: number };
  };
};
