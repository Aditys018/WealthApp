import { useCompanyEmployeesListQuery } from '@/api'
import { useAuth } from '@/context'
import { Navbar } from '@/global-components/navbar/navbar'

const EmployeeTable = () => {
  const { user } = useAuth()
  const companyId = user?.company?.companyId ?? ''
  const { data, isLoading, isError } = useCompanyEmployeesListQuery(companyId)

  const sampleData = [
    {
      _id: '1',
      firstName: 'Alice',
      email: 'alice@example.com',
      role: 'ADMIN',
      company: {
        invitationDate: '2023-01-01',
        permissions: {
          canManageEmployees: true,
          canCreateTasks: false,
          canDeleteCompany: true,
        },
      },
    },
    {
      _id: '2',
      firstName: 'Bob',
      email: 'bob@example.com',
      role: 'EMPLOYEE',
      company: {
        invitationDate: '2023-03-15',
        permissions: {
          canManageEmployees: false,
          canCreateTasks: true,
          canDeleteCompany: false,
        },
      },
    },
  ]

  const employees = data?.data ?? sampleData

  const getRoleStyles = (role: string) => {
    switch (role) {
      case 'ADMIN':
      case 'MANAGER':
        return 'bg-slate-700/40 text-slate-200 border-slate-500'
      case 'EMPLOYEE':
        return 'bg-gray-700/40 text-gray-300 border-gray-500'
      default:
        return 'bg-zinc-700/40 text-zinc-300 border-zinc-500'
    }
  }

  const getPermissionStyles = (permissionKey: string) => {
    const styles: Record<string, string> = {
      canManageEmployees: 'bg-neutral-800 text-neutral-300 border-neutral-600',
      canCreateTasks: 'bg-gray-800 text-gray-300 border-gray-600',
      canDeleteCompany: 'bg-zinc-800 text-zinc-300 border-zinc-600',
    }
    return styles[permissionKey] || 'bg-stone-800 text-stone-300 border-stone-600'
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  if (isLoading) {
    return <div className="text-center py-10 text-accent">Loading employees...</div>
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Failed to load employee data.</div>
  }

  return (
    <>
      <Navbar />

      <section className="w-full max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8 text-accent">
          <h2 className="text-3xl font-bold">Employee List</h2>
          <p className="text-gray-400 mt-1">Manage team members and their access permissions.</p>
        </div>

        <div className="rounded-xl shadow-lg overflow-hidden bg-[#1f1f1f] border border-[#2e2e2e]">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#2b2b2b] text-[#ff9500]">
                <th className="py-4 px-5 text-left text-sm uppercase tracking-wide">First Name</th>
                <th className="py-4 px-5 text-left text-sm uppercase tracking-wide">Email</th>
                <th className="py-4 px-5 text-left text-sm uppercase tracking-wide">Role</th>
                <th className="py-4 px-5 text-left text-sm uppercase tracking-wide">Invitation Date</th>
                <th className="py-4 px-5 text-left text-sm uppercase tracking-wide">Permissions</th>
              </tr>
            </thead>
            <tbody className="text-gray-200 divide-y divide-[#333]">
              {employees.map((employee) => (
                <tr key={employee._id} className="hover:bg-[#2a2a2a] transition">
                  <td className="py-4 px-5 font-medium">{employee.firstName}</td>
                  <td className="py-4 px-5 text-gray-400">{employee.email}</td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleStyles(
                        employee.role
                      )}`}
                    >
                      {employee.role}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-gray-400">
                    {formatDate(employee.company.invitationDate)}
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(employee.company.permissions)
                        .filter(([_, value]) => value)
                        .map(([permission]) => (
                          <span
                            key={permission}
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getPermissionStyles(
                              permission
                            )}`}
                          >
                            {permission
                              .replace(/^can/, '')
                              .replace(/([A-Z])/g, ' $1')
                              .trim()}
                          </span>
                        ))}
                      {Object.values(employee.company.permissions).every((v) => !v) && (
                        <span className="text-xs text-gray-400 italic">No permissions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing {employees.length} employee{employees.length !== 1 ? 's' : ''}
        </div>
      </section>
    </>
  )
}

export { EmployeeTable }

