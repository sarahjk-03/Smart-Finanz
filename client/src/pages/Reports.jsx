import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function Reports() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalIncome = expenses
    .filter((item) => item.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = expenses
    .filter((item) => item.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = totalIncome - totalExpense;

  const expenseByCategory = expenses
  .filter((item) => item.type === "expense")
  .reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = 0;
    }
    acc[curr.category] += Number(curr.amount);
    return acc;
  }, {});

const chartData = Object.entries(expenseByCategory).map(
  ([category, amount]) => ({
    category,
    amount,
  })
);
 return (
  <div className="container">
    <h2>Reports</h2>

    <div className="summary">
      <div className="card income">
        <h3>Total Income</h3>
        <p>₹{totalIncome}</p>
      </div>

      <div className="card expense">
        <h3>Total Expense</h3>
        <p>₹{totalExpense}</p>
      </div>

      <div className="card balance">
        <h3>Balance</h3>
        <p>₹{balance}</p>
      </div>
    </div>

    {/* ADD THIS BELOW SUMMARY */}

    <h3 style={{ marginTop: "40px" }}>
      Expense by Category
    </h3>

    {chartData.length === 0 ? (
      <p>No expense data available</p>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
);

}

export default Reports;