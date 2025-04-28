// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// export default function MonthlyExpenseChart({ transactions }) {
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     // Transform transaction data into monthly aggregates
//     const aggregateByMonth = () => {
//       if (!transactions || transactions.length === 0) {
//         return [];
//       }
      
//       const monthlyTotals = {};
      
//       transactions.forEach(transaction => {
//         const date = new Date(transaction.date);
//         const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
//         const monthName = date.toLocaleString('default', { month: 'short' });
        
//         if (!monthlyTotals[monthYear]) {
//           monthlyTotals[monthYear] = {
//             month: monthName,
//             year: date.getFullYear(),
//             total: 0
//           };
//         }
        
//         monthlyTotals[monthYear].total += Number(transaction.amount);
//       });
      
//       // Convert to array and sort by date
//       return Object.values(monthlyTotals)
//         .sort((a, b) => {
//           if (a.year !== b.year) return a.year - b.year;
//           return a.month.localeCompare(b.month);
//         })
//         .map(item => ({
//           name: `${item.month} ${item.year}`,
//           amount: item.total
//         }));
//     };
    
//     setChartData(aggregateByMonth());
//   }, [transactions]);

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Monthly Expenses</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {chartData.length === 0 ? (
//           <div className="flex justify-center py-8">
//             No data available. Add transactions to see your monthly expenses.
//           </div>
//         ) : (
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart
//               data={chartData}
//               margin={{
//                 top: 5,
//                 right: 30,
//                 left: 20,
//                 bottom: 5,
//               }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip 
//                 formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
//                 labelFormatter={(label) => `Month: ${label}`}
//               />
//               <Bar dataKey="amount" fill="#8884d8" name="Total Expenses" />
//             </BarChart>
//           </ResponsiveContainer>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyTotal {
  month: string;
  year: number;
  total: number;
}

export default function MonthlyExpenseChart({ transactions }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const aggregateByMonth = () => {
      if (!transactions || transactions.length === 0) {
        return [];
      }

      const monthlyTotals: { [key: string]: MonthlyTotal } = {};

      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleString('default', { month: 'short' });

        if (!monthlyTotals[monthYear]) {
          monthlyTotals[monthYear] = {
            month: monthName,
            year: date.getFullYear(),
            total: 0
          };
        }

        monthlyTotals[monthYear].total += Number(transaction.amount);
      });

      return Object.values(monthlyTotals)
        .sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year;
          return a.month.localeCompare(b.month);
        })
        .map(item => ({
          name: `${item.month} ${item.year}`,
          amount: item.total
        }));
    };

    setChartData(aggregateByMonth());
  }, [transactions]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex justify-center py-8">
            No data available. Add transactions to see your monthly expenses.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => {
                  if (typeof value === 'number') {
                    return [`$${value.toFixed(2)}`, 'Amount'];
                  }
                  return [value, 'Amount']; // Handle cases where value might not be a number
                }}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar dataKey="amount" fill="#8884d8" name="Total Expenses" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}