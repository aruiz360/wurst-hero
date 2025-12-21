import node001 from "@/data/nodes/node_001_start.json";
import node002 from "@/data/nodes/node_002_bus.json";
import node003 from "@/data/nodes/node_003_bakery.json";

const nodeIndex = new Map<number, MapNode>([
  [node001.id, node001 as MapNode],
  [node002.id, node002 as MapNode],
  [node003.id, node003 as MapNode]
]);

export function getNodeById(nodeId: number) {
  return nodeIndex.get(nodeId);
}
