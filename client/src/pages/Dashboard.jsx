import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";
import IncomeExpenseChart from "../components/IncomeExpensechart";


function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [editId, setEditId] = useState(null);
  





  const navigate = useNavigate();

  const expenseCategories = [
  "Food & Dining",
  "Groceries",
  "Transport",
  "Rent",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Education",
  "Travel",
  "Bills",
  "Insurance",
  "EMI",
  "Subscriptions",
  "Others"
];

 const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investments",
  "Rental Income",
  "Interest",
  "Bonus",
  "Other"
];
   
   const categories =
  type === "income" ? incomeCategories : expenseCategories;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

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

 const handleAddExpense = async (e) => {
  e.preventDefault();
 console.log("Add button clicked");
  const selectedCategory = category === "Others" ? customCategory : category;

  try {
    if (editId) {
      await API.put(`/expenses/${editId}`, {
        amount,
        category: selectedCategory,
        type,
        date: date ? date : new Date().toISOString().split("T")[0],
      });
      setEditId(null);
    } else {
      await API.post("/expenses", {
        amount,
        category: selectedCategory,
        type,
        date: date ? date : new Date().toISOString().split("T")[0],
      });
    }

    setAmount("");
    setCategory("");
    setCustomCategory(""); // reset the custom input
    setType("expense");
    setDate("");

    fetchExpenses();
  } catch (error) {
    console.log(error);
  }
};
  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (expense) => {
    setAmount(expense.amount);
    setCategory(expense.category);
    setType(expense.type);
    setDate(expense.date?.split("T")[0]);
    setEditId(expense.id);
  };

  const totalIncome = expenses
    .filter((item) => item.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = expenses
    .filter((item) => item.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = totalIncome - totalExpense;

  const chartData = [
  { name: "Income", value: totalIncome },
  { name: "Expense", value: totalExpense },
];
  

  const categoryData = Object.values(
  expenses
    .filter((item) => item.type === "expense")
    .reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = {
          name: curr.category,
          value: 0,
        };
      }
      acc[curr.category].value += Number(curr.amount);
      return acc;
    }, {})
);

 const filteredExpenses = expenses
  .filter((item) =>
    filterDate
      ? item.date?.split("T")[0] === filterDate
      : true
  );
  return (
    
  <div className="container">

    <div className="top-bar">
  <h2>Financial Overview</h2>

  <div className="nav-buttons">
    <button
      className="reports-btn"
      onClick={() => navigate("/reports")}
    >
      Reports
    </button>


   
    <button onClick={() => navigate("/profile")}>
       Profile
     </button>
    <button
      className="logout-btn"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
</div>

     <div className="summary">

  {/* LEFT SIDE - CHARTS */}
  <div className="charts-section">

    <h3>Income vs Expenses</h3>
    <IncomeExpenseChart data={chartData} type="incomeExpense" />

    <h3>Expenses by Category</h3>
    <IncomeExpenseChart data={categoryData} type="expense" />

  </div>

  {/* RIGHT SIDE - CARDS */}
  <div className="cards-section">

    <div className="card income">
      <h3>Income</h3>
      <p>₹{totalIncome}</p>
    </div>

    <div className="card expense">
      <h3>Expense</h3>
      <p>₹{totalExpense}</p>
    </div>

    <div className="card balance">
      <h3>Balance</h3>
      <p>₹{balance}</p>
    </div>

  </div>

</div>
       

      <h3 style={{ marginTop: "30px" }}>Add Transaction</h3>

      
        <form onSubmit={handleAddExpense}>
  <select
    value={type}
    onChange={(e) => {
      setType(e.target.value);
      setCategory("");
      setCustomCategory("");
    }}
  >
    <option value="expense">Expense</option>
    <option value="income">Income</option>
  </select>

  <select
    value={category}
    onChange={(e) => {
      setCategory(e.target.value);
      if (e.target.value !== "Others") setCustomCategory("");
    }}
    required
  >
    <option value="">Select Category</option>
    {categories.map((cat, index) => (
      <option key={index} value={cat}>
        {cat}
      </option>
    ))}
  </select>

  {category === "Others" && (
    <input
      type="text"
      placeholder="Enter category"
      value={customCategory}
      onChange={(e) => setCustomCategory(e.target.value)}
      required
    />
  )}

  <input
    type="number"
    placeholder="Amount"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
  />

  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
  />

  <button type="submit">
    {editId ? "Update" : "Add"}
  </button>
</form>
       

      

      <h3 style={{ marginTop: "30px" }}>Filter by Date</h3>

      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />

      <h3 style={{ marginTop: "30px" }}>Your Transactions</h3>

      {filteredExpenses.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredExpenses.map((expense) => (
            <li
              key={expense.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              {/* LEFT SIDE */}
              <span style={{ color: expense.type === "income" ? "green" : "red" }}>
                {expense.category} - ₹{Number(expense.amount).toFixed(2)} ({expense.type})
              </span>

              {/* RIGHT SIDE */}
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                <span> ({expense.date?.split("T")[0].split("-").reverse().join("-")})</span>

                <button onClick={() => handleEdit(expense)}>
                  Edit
                </button>

                <button className="delete-btn" onClick={() => handleDelete(expense.id)}>
                   Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;