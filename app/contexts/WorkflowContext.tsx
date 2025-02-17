"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import {
  type Node,
  type Edge,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
} from "reactflow"
import type { ReactFlowInstance } from "reactflow"

type WorkflowState = {
  nodes: Node[]
  edges: Edge[]
}

type WorkflowContextType = {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  addNode: (type: string, position?: { x: number; y: number }) => void
  updateNode: (id: string, data: any) => void
  deleteNode: (id: string) => void
  deleteEdge: (id: string) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  exportWorkflow: () => string
  importWorkflow: (jsonString: string) => void
  setReactFlowInstance: React.Dispatch<React.SetStateAction<ReactFlowInstance | null>>
  selectedNode: Node | null
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export const useWorkflow = () => {
  const context = useContext(WorkflowContext)
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider")
  }
  return context
}

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const setSelectedNodeAndResetEditing = useCallback((node: Node | null) => {
    setSelectedNode(node)
    setIsEditing(false)
  }, [])
  const historyRef = useRef<WorkflowState[]>([{ nodes: [], edges: [] }])
  const historyIndexRef = useRef(0)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const addToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1)
    newHistory.push({ nodes: newNodes, edges: newEdges })
    historyRef.current = newHistory
    historyIndexRef.current = newHistory.length - 1
  }, [])

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        const newNodes = applyNodeChanges(changes, nds).map((node) => ({
          ...node,
          position: {
            x: isNaN(node.position.x) ? 0 : Math.round(node.position.x),
            y: isNaN(node.position.y) ? 0 : Math.round(node.position.y),
          },
        }))
        addToHistory(newNodes, edges)
        return newNodes
      })
    },
    [edges, addToHistory],
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => {
        const newEdges = applyEdgeChanges(changes, eds)
        addToHistory(nodes, newEdges)
        return newEdges
      })
    },
    [nodes, addToHistory],
  )

  const isValidConnection = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((node) => node.id === connection.source)
      const targetNode = nodes.find((node) => node.id === connection.target)

      if (!sourceNode || !targetNode) return false

      // Prevent self-connections
      if (sourceNode.id === targetNode.id) return false

      // Prevent connections to 'task' nodes
      if (targetNode.type === "task") return false

      // Allow connections from 'condition' nodes to any other node
      if (sourceNode.type === "condition") return true

      // Allow connections from 'task' and 'notification' nodes to 'condition' nodes
      if ((sourceNode.type === "task" || sourceNode.type === "notification") && targetNode.type === "condition")
        return true

      // Disallow all other connections
      return false
    },
    [nodes],
  )

  const onConnect: OnConnect = useCallback(
    (connection) => {
      if (isValidConnection(connection)) {
        setEdges((eds) => {
          const newEdges = addEdge(connection, eds)
          addToHistory(nodes, newEdges)
          return newEdges
        })
      }
    },
    [isValidConnection, nodes, addToHistory],
  )

  const addNode = useCallback(
    (type: string, position?: { x: number; y: number }) => {
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position: position
          ? {
              x: isNaN(position.x) ? 0 : Math.round(position.x),
              y: isNaN(position.y) ? 0 : Math.round(position.y),
            }
          : { x: 0, y: 0 },
        data: {
          label: `New ${type}`,
          description: `Description for new ${type}`,
          status: "pending",
        },
      }

      if (reactFlowInstance) {
        const flow = reactFlowInstance.toObject()
        const centerX = isNaN(flow.viewport.x)
          ? 0
          : Math.round(flow.viewport.x + flow.viewport.width / 2 / flow.viewport.zoom)
        const centerY = isNaN(flow.viewport.y)
          ? 0
          : Math.round(flow.viewport.y + flow.viewport.height / 2 / flow.viewport.zoom)
        newNode.position = { x: centerX, y: centerY }
      }

      setNodes((nds) => {
        const newNodes = [...nds, newNode]
        addToHistory(newNodes, edges)
        return newNodes
      })
    },
    [edges, addToHistory, reactFlowInstance],
  )

  const updateNode = useCallback(
    (id: string, data: any) => {
      setNodes((nds) => {
        const newNodes = nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...data } } : node))
        addToHistory(newNodes, edges)
        return newNodes
      })
    },
    [edges, addToHistory],
  )

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => {
        const newNodes = nds.filter((node) => node.id !== id)
        setEdges((eds) => {
          const newEdges = eds.filter((edge) => edge.source !== id && edge.target !== id)
          addToHistory(newNodes, newEdges)
          return newEdges
        })
        setSelectedNodeAndResetEditing(null)
        return newNodes
      })
    },
    [addToHistory, setSelectedNodeAndResetEditing],
  )

  const deleteEdge = useCallback(
    (id: string) => {
      setEdges((eds) => {
        const newEdges = eds.filter((edge) => edge.id !== id)
        addToHistory(nodes, newEdges)
        return newEdges
      })
    },
    [nodes, addToHistory],
  )

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1
      const prevState = historyRef.current[historyIndexRef.current]
      setNodes([...prevState.nodes])
      setEdges([...prevState.edges])
    }
  }, [])

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1
      const nextState = historyRef.current[historyIndexRef.current]
      setNodes([...nextState.nodes])
      setEdges([...nextState.edges])
    }
  }, [])

  const exportWorkflow = useCallback(() => {
    return JSON.stringify({ nodes, edges })
  }, [nodes, edges])

  const importWorkflow = useCallback(
    (jsonString: string) => {
      try {
        const { nodes: importedNodes, edges: importedEdges } = JSON.parse(jsonString)
        setNodes(importedNodes)
        setEdges(importedEdges)
        addToHistory(importedNodes, importedEdges)
      } catch (error) {
        console.error("Failed to import workflow:", error)
      }
    },
    [addToHistory],
  )

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.key === "Delete" || event.key === "Backspace")) {
      // Only delete if we're not in an input field
      const activeElement = document.activeElement
      const isInputField = activeElement instanceof HTMLInputElement || 
                          activeElement instanceof HTMLTextAreaElement ||
                          activeElement instanceof HTMLSelectElement
      
      if (!isInputField && selectedNode && !isEditing) {
        deleteNode(selectedNode.id)
      }
    }
  }, [selectedNode, deleteNode, isEditing])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <WorkflowContext.Provider
      value={{
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        updateNode,
        deleteNode,
        deleteEdge,
        undo,
        redo,
        canUndo: historyIndexRef.current > 0,
        canRedo: historyIndexRef.current < historyRef.current.length - 1,
        exportWorkflow,
        importWorkflow,
        setReactFlowInstance,
        selectedNode,
        setSelectedNode: setSelectedNodeAndResetEditing,
        isEditing,
        setIsEditing,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}

