"use client"
import { WorkflowProvider } from "./contexts/WorkflowContext"
import { ThemeProvider, useTheme } from "./contexts/ThemeContext"
import WorkflowCanvas from "./components/WorkflowCanvas"
import NodeConfigPanel from "./components/NodeConfigPanel"
import WorkflowDataTable from "./components/WorkflowDataTable"
import UndoRedo from "./components/UndoRedo"
import ExportImport from "./components/ExportImport"
import AddNodePanel from "./components/AddNodePanel"
import { Sun, Moon } from "lucide-react"

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white">
      <nav className="border-b border-gray-200 dark:border-gray-800 mb-4 bg-white dark:bg-[#0A0A0A]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <span className="text-xl font-bold">Workflow Automation Builder</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700">
                Dashboard
              </button>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">V</div>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}

export default function Home() {
  return (
    <ThemeProvider>
      <WorkflowProvider>
        <Layout>
          <main className="flex flex-col">
            <div className="flex-grow flex flex-col lg:flex-row px-4 pb-4">
              <div className="w-full lg:w-2/3 space-y-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg relative">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <UndoRedo />
                      <ExportImport />
                    </div>
                    <AddNodePanel />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg" style={{ height: "75vh" }}>
                  <WorkflowCanvas />
                </div>
              </div>
              <div className="w-full lg:w-1/3 lg:pl-4 space-y-4 mt-4 lg:mt-0">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg">
                  <NodeConfigPanel />
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg">
                  <WorkflowDataTable />
                </div>
              </div>
            </div>
          </main>
        </Layout>
      </WorkflowProvider>
    </ThemeProvider>
  )
}