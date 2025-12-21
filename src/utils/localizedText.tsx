export function renderLocalizedText(text?: LocalizedText) {
  if (!text) {
    return <span>Unknown</span>;
  }

  const entries = Object.entries(text) as Array<[string, string]>;

  return (
    <ul className="mt-1 list-disc pl-5">
      {entries.map(([language, value]) => (
        <li key={language}>
          {value} ({language.toUpperCase()})
        </li>
      ))}
    </ul>
  );
}
