"use client"

import type React from "react"
import { useCallback, useRef } from "react"
import ReactFlow, { Background, Controls, MiniMap, type NodeTypes, type Node, type Edge } from "reactflow"
import "reactflow/dist/style.css"
import { useWorkflow } from "../contexts/WorkflowContext"
import TaskNode from "./nodes/TaskNode"
import ConditionNode from "./nodes/ConditionNode"
import NotificationNode from "./nodes/NotificationNode"

type WorkflowCanvasProps = {
  onNodeSelect: (node: Node | null) => void
}

const nodeTypes: NodeTypes = {
  task: TaskNode,
  condition: ConditionNode,
  notification: NotificationNode,
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ onNodeSelect }) => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, deleteNode, deleteEdge, setReactFlowInstance } =
    useWorkflow()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      deleteNode(node.id)
    },
    [deleteNode],
  )

  const onEdgeDoubleClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      deleteEdge(edge.id)
    },
    [deleteEdge],
  )

  const safeNodes = nodes.map((node) => ({
    ...node,
    position: {
      x: isNaN(node.position.x) ? 0 : Math.round(node.position.x),
      y: isNaN(node.position.y) ? 0 : Math.round(node.position.y),
    },
  }))

  return (
    <div ref={reactFlowWrapper} style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={safeNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => onNodeSelect(node)}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}

export default WorkflowCanvas

