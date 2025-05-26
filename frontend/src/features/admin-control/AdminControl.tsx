import React, { useState } from 'react'

type Employee = {
  id: string
  name: string
  email: string
  hasAccess: boolean
}

const initialEmployees: Employee[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', hasAccess: true },
  { id: '2', name: 'Bob', email: 'bob@example.com', hasAccess: false },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', hasAccess: true },
]

export const AdminControl: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)

  const revokeAccess = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, hasAccess: false } : emp
      )
    )
  }

  return (
    <section className="max-w-4xl mx-auto p-6 bg-[#1c1c1c] rounded-xl border border-[#333] text-white mt-16">
      <h2 className="text-2xl font-bold mb-12 text-[#ff9500]">
        Manage Employee Access & Permissions
      </h2>

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-[#2e2e2e] text-left text-sm text-[#ff9500]">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Access</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-t border-[#333] hover:bg-[#292929]">
              <td className="px-4 py-3">{emp.name}</td>
              <td className="px-4 py-3 text-gray-400">{emp.email}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    emp.hasAccess
                      ? 'bg-green-700/40 text-green-300'
                      : 'bg-red-700/40 text-red-300'
                  }`}
                >
                  {emp.hasAccess ? 'Granted' : 'Revoked'}
                </span>
              </td>
              <td className="px-4 py-3">
                {emp.hasAccess ? (
                  <button
                    onClick={() => revokeAccess(emp.id)}
                    className="px-3 py-1 rounded text-sm font-medium border border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    Revoke Access
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-3 py-1 rounded text-sm font-medium border border-gray-600 text-gray-500 cursor-not-allowed bg-[#2e2e2e]"
                  >
                    Revoked
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
