"use client"

import React, { useState, useCallback } from "react"
import { useTable } from "react-table"
import { useWorkflow } from "../contexts/WorkflowContext"

const WorkflowDataTable: React.FC = () => {
  const { nodes, updateNode, deleteNode } = useWorkflow()
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleBlur = useCallback(
    (id: string, value: string) => {
      updateNode(id, { label: value })
      setEditingId(null)
    },
    [updateNode],
  )

  const columns = React.useMemo(
    () => [
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Name",
        accessor: "data.label",
        Cell: ({ row, value }: { row: any; value: string }) =>
          editingId === row.original.id ? (
            <input
              value={value}
              onChange={(e) => updateNode(row.original.id, { label: e.target.value })}
              onBlur={(e) => handleBlur(row.original.id, e.target.value)}
              autoFocus
              className="w-full p-1 border rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            />
          ) : (
            <div onClick={() => setEditingId(row.original.id)} className="cursor-pointer p-1">
              {value}
            </div>
          ),
      },
      {
        Header: "Status",
        accessor: "data.status",
        Cell: ({ row }: { row: any }) => (
          <select
            value={row.original.data.status || "pending"}
            onChange={(e) => updateNode(row.original.id, { status: e.target.value })}
            className="w-full p-1 border rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }: { row: any }) => (
          <button
            onClick={() => deleteNode(row.original.id)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        ),
      },
    ],
    [updateNode, deleteNode, editingId, handleBlur],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: nodes })

  return (
    <div>
      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  key={column.id}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  style={{ width: column.Header === "Type" ? "20%" : column.Header === "Actions" ? "15%" : "32.5%" }}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"
        >
          {rows.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id} className="px-3 py-2 whitespace-nowrap text-sm">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default WorkflowDataTable