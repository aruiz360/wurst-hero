export function renderPaths(paths?: MapPath[]) {
  if (!paths?.length) {
    return <span>None</span>;
  }

  return (
    <ul className="mt-2 list-disc pl-5">
      {paths.map((path, index) => (
        <li key={`${path.from}-${path.to}-${index}`}>
          From {path.from} to {path.to}
        </li>
      ))}
    </ul>
  );
}

export function getNextNodes(currentNode: number, paths?: MapPath[]) {
  if (!paths?.length) {
    return [];
  }

  const nextNodes = new Set<number>();
  for (const path of paths) {
    if (path.from === currentNode) {
      nextNodes.add(path.to);
    }
  }

  return Array.from(nextNodes);
}

export function renderNextNodes(
  currentNode: number,
  paths: MapPath[] | undefined,
  onSelect: (nodeId: number) => void
) {
  const nextNodes = getNextNodes(currentNode, paths);

  if (!nextNodes.length) {
    return (
      <span>
        You are at the end of the path. <br />
        <a
          className="underline"
          href={`/node/1`}
          onClick={(event) => {
            event.preventDefault();
            onSelect(1);
          }}
        >
          Return to Node 1!
        </a>
      </span>
    );
  }

  return (
    <ul className="mt-2 list-disc pl-5">
      {nextNodes.map((nodeId) => (
        <li key={nodeId}>
          <a
            className="underline"
            href={`/node/${nodeId}`}
            onClick={(event) => {
              event.preventDefault();
              onSelect(nodeId);
            }}
          >
            Node {nodeId}
          </a>
        </li>
      ))}
    </ul>
  );
}
