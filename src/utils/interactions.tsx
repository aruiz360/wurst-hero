import Interaction from "@/components/interaction";

export function renderInteractions(interactions?: Interaction[]) {
  if (!interactions?.length) {
    return <span>None</span>;
  }

  return (
    <ul className="mt-2 list-disc pl-5">
      {interactions.map((interaction, index) => (
        <li key={`${interaction.type}-${index}`}>
          <Interaction interaction={interaction} index={index} />
        </li>
      ))}
    </ul>
  );
}
