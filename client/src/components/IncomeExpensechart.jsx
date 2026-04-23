import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = {
   
 Income: "#1B7F3A",   
Expense: "#B71C1C", 



  "Food & Dining": "#FF6384",
  Groceries: "#36A2EB",
  Transport: "#FFCE56",
  Rent: "#8E44AD",
  Utilities: "#2ECC71",
  Entertainment: "#E67E22",
  Shopping: "#E74C3C",
  Healthcare: "#1ABC9C",
  Education: "#3498DB",
  Travel: "#F1C40F",
  Bills: "#34495E",
  Insurance: "#9B59B6",
  EMI: "#D35400",
  Subscriptions: "#7F8C8D",
  Others: "#95A5A6",
};

export default function IncomeExpenseChart({ data }) {
  return (
    <PieChart width={350} height={300}>
      <Pie data={data} dataKey="value" nameKey="name" outerRadius={120}>
        {data.map((entry, index) => (
      <Cell
      key={`cell-${index}`}
      fill={COLORS[entry.name] || "#8884d8"}
      />
      ))}
     </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  );
}



