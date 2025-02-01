"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useRef } from "react"
import {
  type Node,
  type Edge,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
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
  const historyRef = useRef<WorkflowState[]>([{ nodes: [], edges: [] }])
  const historyIndexRef = useRef(0)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

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

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(connection, eds)
        addToHistory(nodes, newEdges)
        return newEdges
      })
    },
    [nodes, addToHistory],
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
        data: { label: `New ${type}` },
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
        return newNodes
      })
    },
    [addToHistory],
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
      console.log("Undoing to state:", prevState)
      setNodes([...prevState.nodes])
      setEdges([...prevState.edges])
      console.log("New state after undo:", { nodes: prevState.nodes, edges: prevState.edges })
    } else {
      console.log("Cannot undo: at oldest state")
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
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}

