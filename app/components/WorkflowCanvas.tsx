"use client"

import type React from "react"
import { useCallback, useRef } from "react"
import ReactFlow, { Background, Controls, MiniMap, type NodeTypes, type Node, type Edge } from "reactflow"
import "reactflow/dist/style.css"
import { useWorkflow } from "../contexts/WorkflowContext"
import { useTheme } from "../contexts/ThemeContext"
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
  const { theme } = useTheme()

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
        onNodeClick={(_, node) => setSelectedNode(node)}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onPaneClick={() => setSelectedNode(null)}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        fitView
        className={`bg-gray-100 dark:bg-[#0A0A0A] ${theme === "dark" ? "dark" : ""}`}
        defaultEdgeOptions={{
          style: { stroke: theme === "dark" ? "#4F46E5" : "#3730A3" },
          type: "smoothstep",
        }}
      >
        <Controls className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" />
        <MiniMap
          className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          nodeColor={theme === "dark" ? "#4F46E5" : "#3730A3"}
          maskColor={theme === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(240, 240, 240, 0.7)"}
        />
        <Background
          color={theme === "dark" ? "#1F2937" : "#E5E7EB"}
          gap={16}
          size={1}
          className="bg-gray-100 dark:bg-[#0A0A0A]"
        />
      </ReactFlow>
    </div>
  )
}

export default WorkflowCanvas