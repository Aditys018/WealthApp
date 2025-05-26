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

  const toggleAccess = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, hasAccess: !emp.hasAccess } : emp
      )
    )
  }

  return (
    <section className="max-w-4xl mx-auto p-6 bg-[#1c1c1c] rounded-xl border border-[#333] text-white mt-16">
      <h2 className="text-2xl font-bold mb-4 text-[#ff9500] mb-12">
        Manage Employee Access & Permissions
      </h2>

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-[#2e2e2e] text-left text-sm text-[#ff9500]">
            <th className="px-4 py-2">NAME</th>
            <th className="px-4 py-2">EMAIL</th>
            <th className="px-4 py-2">ACCESS</th>
            <th className="px-4 py-2">ACTION</th>
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
                <button
                  onClick={() => toggleAccess(emp.id)}
                  className={`px-3 py-1 rounded text-sm font-medium border ${
                    emp.hasAccess
                      ? 'border-red-500 text-red-400 hover:bg-red-500/10'
                      : 'border-green-500 text-green-400 hover:bg-green-500/10'
                  }`}
                >
                  {emp.hasAccess ? 'Revoke Access' : 'Grant Access'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}


