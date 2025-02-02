"use client"

import type React from "react"
import { useCallback, useRef, useEffect } from "react"
import ReactFlow, { Background, Controls, MiniMap, type NodeTypes, type Node, type Edge } from "reactflow"
import "reactflow/dist/style.css"
import { useWorkflow } from "../contexts/WorkflowContext"
import TaskNode from "./nodes/TaskNode"
import ConditionNode from "./nodes/ConditionNode"
import NotificationNode from "./nodes/NotificationNode"

const nodeTypes: NodeTypes = {
  task: TaskNode,
  condition: ConditionNode,
  notification: NotificationNode,
}

const WorkflowCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode,
    deleteEdge,
    setReactFlowInstance,
    setSelectedNode,
    selectedNode,
    isEditing,
  } = useWorkflow()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (!isEditing) {
        deleteNode(node.id)
      }
    },
    [deleteNode, isEditing],
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Delete") && !isEditing) {
        if (selectedNode) {
          deleteNode(selectedNode.id)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedNode, deleteNode, isEditing])

  return (
    <div ref={reactFlowWrapper} style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={safeNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node)}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onPaneClick={() => setSelectedNode(null)}
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