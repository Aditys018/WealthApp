import { useCompanyEmployeesListQuery } from '@/api'
import { useAuth } from '@/context'

const EmployeeTable = () => {
  // Sample data - replace with your actual array
  const { user } = useAuth()
  // @ts-ignore
  const companyId = user?.company?.companyId ?? ''
  const { data } = useCompanyEmployeesListQuery(companyId)
  const employees = [
    {
      company: {
        permissions: {
          canInviteEmployees: false,
          canManagePermissions: false,
          canViewStatistics: false,
          canRevokeAccess: false,
          canManageCompanyPreferences: false,
        },
        invitationDate: '2025-05-25T17:20:07.882Z',
      },
      _id: '68335147a838560b570ecb0e',
      firstName: 'yaten',
      lastName: 'sharma',
      email: 'yatendra948@gmail.com',
      role: 'EMPLOYEE',
    },
    {
      company: {
        permissions: {
          canInviteEmployees: true,
          canManagePermissions: true,
          canViewStatistics: true,
          canRevokeAccess: true,
          canManageCompanyPreferences: true,
        },
        invitationDate: '2025-05-20T10:15:30.000Z',
      },
      _id: '68335147a838560b570ecb0f',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      role: 'ADMIN',
    },
    {
      company: {
        permissions: {
          canInviteEmployees: true,
          canManagePermissions: false,
          canViewStatistics: true,
          canRevokeAccess: false,
          canManageCompanyPreferences: false,
        },
        invitationDate: '2025-05-22T14:30:45.123Z',
      },
      _id: '68335147a838560b570ecb10',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      role: 'MANAGER',
    },
  ]

  // @ts-ignore
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'EMPLOYEE':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  // @ts-ignore
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6 text-accent">
        <h2 className="text-2xl font-bold">Employee Directory</h2>
        <p className="mt-1">Manage your team members and their roles</p>
      </div>

      <div className="border border-accent rounded-lg overflow-hidden bg-gray-300 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary border-b">
              <th className="text-left py-3 px-4 font-semibold text-accent">
                First Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-accent">
                Email
              </th>
              <th className="text-left py-3 px-4 font-semibold text-accent">
                Role
              </th>
              <th className="text-left py-3 px-4 font-semibold text-accent">
                Invitation Date
              </th>
              <th className="text-left py-3 px-4 font-semibold text-accent">
                Permissions
              </th>
            </tr>
          </thead>
          <tbody className="bg-secondary">
            {data.data.map((employee: any) => (
              <tr key={employee._id} className="border-b transition-colors">
                <td className="py-3 px-4 font-medium text-accent">
                  {employee.firstName ?? '-'}
                </td>
                <td className="py-3 px-4 text-gray-300">{employee.email}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(employee.role)}`}
                  >
                    {employee.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-300">
                  {formatDate(employee.company.invitationDate)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(employee.company.permissions)
                      .filter(([_, value]) => value === true)
                      .map(([permission, _]) => (
                        <span
                          key={permission}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                        >
                          {permission
                            .replace(/^can/, '')
                            .replace(/([A-Z])/g, ' $1')
                            .trim()}
                        </span>
                      ))}
                    {Object.values(employee.company.permissions).every(
                      (v) => !v,
                    ) && (
                      <span className="text-xs text-gray-400 italic">
                        No permissions
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {employees.length} employee{employees.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}

export { EmployeeTable }
