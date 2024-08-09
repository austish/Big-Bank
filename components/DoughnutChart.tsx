// Donut chart on home page next to total balance
'use client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js"
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  // for each account a, return the account name
  const accountNames = accounts.map((a) => a.name);
  const balances = accounts.map((a) => a.currentBalance)
  const total = accounts.reduce((total, account) => total + account.currentBalance, 0);

  // Create a formatter for percentages
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2
  });

  const data = {
    datasets: [
      {
        data: balances,
        backgroundColor: ['#0747b6', '#2265d8', '#2f91fa']
      }
    ],
    labels: accountNames
  }
  return <Doughnut 
    data={data}
    options={{
      cutout: '50%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const percentage = context.raw as number / total
              return formatter.format(percentage);
            }
          },
          displayColors: false,
        }
      }
    }} 
  />
}

export default DoughnutChart