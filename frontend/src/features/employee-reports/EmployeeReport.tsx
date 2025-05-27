type PropertyReport = {
  id: number
  owner: string
  netWorth: string
  propertyType: string
  location: string
  valuation: string
  lastUpdated: string
  employeeId: string
  employeeName: string
}

const reports: PropertyReport[] = [
  {
    id: 1,
    owner: 'Oliver Smith',
    netWorth: '£4.2M',
    propertyType: 'Detached House',
    location: 'Cambridge, England',
    valuation: '£2.5M',
    lastUpdated: '2025-05-20',
    employeeId: 'EMP101',
    employeeName: 'James Clarke',
  },
  {
    id: 2,
    owner: 'Amelia Johnson',
    netWorth: '£6.8M',
    propertyType: 'Office Building',
    location: 'Bristol, England',
    valuation: '£5.1M',
    lastUpdated: '2025-05-18',
    employeeId: 'EMP102',
    employeeName: 'Sophie Turner',
  },
  {
    id: 3,
    owner: 'George Williams',
    netWorth: '£3.1M',
    propertyType: 'Cottage with Garden',
    location: 'Bath, Somerset',
    valuation: '£2.7M',
    lastUpdated: '2025-05-22',
    employeeId: 'EMP103',
    employeeName: 'Henry Green',
  },
]

export function EmployeeReport() {
  return (
    <section className="max-w-4xl mx-auto p-6 bg-[#1c1c1c] rounded-xl border border-[#333] text-white mt-16">
      <h2 className="text-2xl font-bold mb-8 text-[#ff9500]">
        Property Reports By Employees
      </h2>

      <div className="space-y-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="border border-[#333] rounded-xl p-5 bg-[#2a2a2a] shadow-sm hover:bg-[#2e2e2e] transition flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {report.propertyType}
              </h3>
              <p className="text-sm text-gray-300">
                <strong className="text-[#ff9500]">Owner:</strong> {report.owner}
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-[#ff9500]">Location:</strong> {report.location}
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-[#ff9500]">Valuation:</strong> {report.valuation}
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-[#ff9500]">Net Worth:</strong> {report.netWorth}
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-[#ff9500]">Last Updated:</strong> {report.lastUpdated}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-400 italic">
                Submitted by: {report.employeeId}, {report.employeeName}
              </p>
              <button className="text-sm px-4 py-1 bg-[#ff9500] text-black font-semibold rounded hover:bg-[#ffaa33] transition">
                See Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
