"use client"
import { WorkflowProvider } from "./contexts/WorkflowContext"
import WorkflowCanvas from "./components/WorkflowCanvas"
import NodeConfigPanel from "./components/NodeConfigPanel"
import WorkflowDataTable from "./components/WorkflowDataTable"
import UndoRedo from "./components/UndoRedo"
import ExportImport from "./components/ExportImport"
import AddNodePanel from "./components/AddNodePanel"

export default function Home() {
  // const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  // const handleNodeSelect = (node: Node | null) => {
  //   setSelectedNode(node ? { ...node } : null)
  // }

  return (
    <WorkflowProvider>
      <main className="flex flex-col min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Workflow Automation Builder</h1>
          </div>
        </header>
        <div className="flex-grow flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 p-4">
            <div className="bg-white shadow rounded-lg p-4 mb-4">
              <div className="flex flex-wrap justify-between items-center mb-4">
                <UndoRedo />
                <ExportImport />
              </div>
              <AddNodePanel />
            </div>
            <div className="bg-white shadow rounded-lg p-4" style={{ height: "calc(100vh - 300px)" }}>
              <WorkflowCanvas />
            </div>
          </div>
          <div className="w-full lg:w-1/3 p-4">
            <div className="bg-white shadow rounded-lg p-4 mb-4">
              <NodeConfigPanel />
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <WorkflowDataTable />
            </div>
          </div>
        </div>
      </main>
    </WorkflowProvider>
  )
}