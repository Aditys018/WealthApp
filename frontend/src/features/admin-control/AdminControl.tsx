import { useCompanyEmployeesListQuery, useRevokeAccessMutation } from '@/api'
import { useAuth } from '@/context'
import React from 'react'
import { toast } from 'sonner'

export const AdminControl: React.FC = () => {
  const { user } = useAuth()
  // @ts-ignore
  const companyId = user?.company?.companyId ?? ''
  const { data, isPending: isEmployeeListPending } =
    useCompanyEmployeesListQuery(companyId)

  const { mutate, isPending } = useRevokeAccessMutation()

  const revokeAccess = (id: string) => {
    mutate(
      { companyId: companyId, employeeId: id },
      {
        onSuccess: (data) => {
          // @ts-ignore
          toast.success(data.data.message || 'Access revoked successfully')
        },
        onError: (error) => {
          console.error('Failed to revoke access:', error)
          toast.error(error.message || 'Failed to revoke access')
        },
      },
    )
  }

  if (isEmployeeListPending) {
    return (
      <section className="max-w-4xl mx-auto p-6 bg-[#1c1c1c] rounded-xl border border-[#333] text-white mt-16">
        <h2 className="text-2xl font-bold mb-12 text-[#ff9500]">
          Loading Employee List...
        </h2>
      </section>
    )
  }

  if (!data || data.length === 0) {
    return (
      <section className="max-w-4xl mx-auto p-6 bg-[#1c1c1c] rounded-xl border border-[#333] text-white mt-16">
        <h2 className="text-2xl font-bold mb-12 text-[#ff9500]">
          No Employees Found
        </h2>
        <p className="text-gray-400">
          It seems there are no employees in your company yet.
        </p>
      </section>
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
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((emp: any) => (
            <tr
              key={emp.id}
              className="border-t border-[#333] hover:bg-[#292929]"
            >
              <td className="px-4 py-3">{emp.name}</td>
              <td className="px-4 py-3 text-gray-400">{emp.email}</td>

              <td className="px-4 py-3">
                {emp._id !== user?._id ? (
                  <button
                    onClick={() => revokeAccess(emp._id)}
                    className="px-3 py-1 rounded text-sm font-medium border border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    {isPending ? 'Revoking...' : 'Revoke Access'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="x-3 p-1 rounded text-sm font-medium border border-gray-600 text-gray-500 cursor-not-allowed bg-[#2e2e2e]"
                  >
                    Not Allowed
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
