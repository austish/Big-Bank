// Donut chart on home page next to total balance
'use client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js"
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  // for each account a, return the account name
  const accountNames = accounts.map((a) => a.name);
  const balances = accounts.map((a) => a.currentBalance)

  const data = {
    datasets: [
      {
        label: 'Test',
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
        }
      }
    }} 
  />
}

export default DoughnutChart