import { Search, ChevronDown } from "lucide-react";

interface Transaction {
  id: string;
  company: string;
  logo: string;
  category: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
  amount: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    company: "Dropbox Business",
    logo: "🗃️",
    category: "Software",
    status: "Paid",
    date: "14/06/25",
    amount: "$30"
  },
  {
    id: "2", 
    company: "Coworking Space",
    logo: "🏢",
    category: "Office",
    status: "Overdue",
    date: "11/06/25",
    amount: "$1500"
  },
  {
    id: "3",
    company: "Shipping Fees",
    logo: "📦",
    category: "Bank Fees",
    status: "Paid",
    date: "11/05/25",
    amount: "$1000"
  },
  {
    id: "4",
    company: "Slack Plan",
    logo: "💬",
    category: "Software",
    status: "Pending",
    date: "08/05/25",
    amount: "$50"
  },
  {
    id: "5",
    company: "Figma Pro",
    logo: "🎨",
    category: "Software", 
    status: "Pending",
    date: "07/05/25",
    amount: "$120"
  },
  {
    id: "6",
    company: "Coworking Space",
    logo: "🏢",
    category: "Staff / salaries",
    status: "Paid",
    date: "07/05/25",
    amount: "$2500"
  },
  {
    id: "7",
    company: "Bonus Payments",
    logo: "💰",
    category: "Staff / salaries",
    status: "Paid", 
    date: "05/05/25",
    amount: "$3000"
  },
  {
    id: "8",
    company: "Google Workspace",
    logo: "🌐",
    category: "Software",
    status: "Paid",
    date: "03/05/25", 
    amount: "$50"
  },
  {
    id: "9",
    company: "VAT Payment",
    logo: "🧾",
    category: "Bank Fees",
    status: "Pending",
    date: "02/05/25",
    amount: "$50"
  }
];

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusStyles()}`}>
      {status}
    </span>
  );
}

export function TransactionsTable() {
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      {/* Filters */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <select className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>Date</option>
          </select>
          
          <select className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>All Status</option>
          </select>
          
          <select className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>All Categories</option>
          </select>
        </div>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-700 text-gray-300 pl-10 pr-4 py-2 rounded-lg border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-400 py-3 text-sm font-medium">Payments</th>
              <th className="text-left text-gray-400 py-3 text-sm font-medium">Category</th>
              <th className="text-left text-gray-400 py-3 text-sm font-medium">Status</th>
              <th className="text-left text-gray-400 py-3 text-sm font-medium">Date</th>
              <th className="text-right text-gray-400 py-3 text-sm font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-lg">
                      {transaction.logo}
                    </div>
                    <span className="text-white text-sm">{transaction.company}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-gray-300 text-sm">{transaction.category}</span>
                </td>
                <td className="py-4">
                  <StatusBadge status={transaction.status} />
                </td>
                <td className="py-4">
                  <span className="text-gray-300 text-sm">{transaction.date}</span>
                </td>
                <td className="py-4 text-right">
                  <span className="text-white text-sm font-medium">{transaction.amount}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}