import { useNavigate } from '@tanstack/react-router'
import { MdBarChart, MdGroup, MdPerson, MdSettings } from 'react-icons/md'
import { toast } from 'sonner'

export const AdminDashboard = () => {
  const navigate = useNavigate()

  const handleInviteEmployee = () => {
    navigate({ to: '/employeeinvitation' })
  }

  const dashboardItems = [
    {
      title: 'Invite Employee',
      description: 'Send E-Mail invitations to new employees',
      action: handleInviteEmployee,
      icon: <MdGroup className="w-15 h-15 text-[#ff9500]" />,
    },
    {
      title: 'Manage Employees',
      description: 'View and manage employee accounts',
      action: () => toast.info('Coming soon'),
      icon: <MdPerson className="w-15 h-15 text-[#ff9500]" />,
    },
    {
      title: 'Company Settings',
      description: 'Update company information and preferences',
      action: () => toast.info('Coming soon'),
      icon: <MdSettings className="w-15 h-15 text-[#ff9500]" />,
    },
    {
      title: 'Reports',
      description: 'View company analytics and reports given by employees',
      action: () => toast.info('Coming soon'),
      icon: <MdBarChart className="w-15 h-15 text-[#ff9500]" />,
    },
  ]

  return (
    <div className="min-h-screen bg-[#1d1d1d] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#ff9500] mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="bg-[#2c2c2c] p-6 rounded-lg shadow-lg hover:bg-[#3c3c3c] transition-colors duration-200 text-left"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-12 bg-[#2c2c2c] rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-[#ff9500] mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#1d1d1d] rounded-lg">
              <div>
                <p className="text-white font-medium">New employee invitation sent</p>
                <p className="text-gray-400 text-sm">2 hours ago</p>
              </div>
              <span className="text-[#ff9500]">→</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#1d1d1d] rounded-lg">
              <div>
                <p className="text-white font-medium">Company settings updated</p>
                <p className="text-gray-400 text-sm">1 day ago</p>
              </div>
              <span className="text-[#ff9500]">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}