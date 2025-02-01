"use client"

import type React from "react"
import { useEffect, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import type { Node } from "reactflow"
import { useWorkflow } from "../contexts/WorkflowContext"

type NodeConfigPanelProps = {
  node: Node
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ node }) => {
  const { updateNode } = useWorkflow()
  const { control, handleSubmit, reset } = useForm({
    defaultValues: node.data,
  })

  useEffect(() => {
    reset(node.data)
  }, [node.id, reset])

  const onSubmit = useCallback(
    (data: any) => {
      updateNode(node.id, data)
    },
    [node.id, updateNode],
  )

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Configure {node.type} Node</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Node Name</label>
          <Controller
            name="label"
            control={control}
            rules={{ required: "Node name is required" }}
            render={({ field }) => (
              <input
                {...field}
                onBlur={() => handleSubmit(onSubmit)()}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            )}
          />
        </div>
        {node.type === "task" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assignee</label>
              <Controller
                name="assignee"
                control={control}
                rules={{ required: "Assignee is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </>
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <Controller
                name="dueDate"
                control={control}
                rules={{ required: "Due date is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      type="date"
                      {...field}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </>
                )}
              />
            </div>
          </>
        )}
        {node.type === "condition" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Condition</label>
            <Controller
              name="condition"
              control={control}
              rules={{ required: "Condition is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    {...field}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {error && <span className="text-red-500 text-sm">{error.message}</span>}
                </>
              )}
            />
          </div>
        )}
        {node.type === "notification" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <Controller
              name="message"
              control={control}
              rules={{ required: "Message is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <textarea
                    {...field}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {error && <span className="text-red-500 text-sm">{error.message}</span>}
                </>
              )}
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Update Node
        </button>
      </form>
    </div>
  )
}

export default NodeConfigPanel

