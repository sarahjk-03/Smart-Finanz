import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [incomeInput, setIncomeInput] = useState("");

  const navigate = useNavigate();

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

    try {
      if (editId) {
        await API.put(`/expenses/${editId}`, {
          amount,
          category,
          type,
          date: date ? date : new Date().toISOString().split("T")[0],
        });
        setEditId(null);
      } else {
        await API.post("/expenses", {
           amount,
           category,
           type,
           date: date ? date : new Date().toISOString().split("T")[0],
        });
      }

      setAmount("");
      setCategory("");
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

  const existingIncome = expenses.find(
  (item) => item.type === "income"
);

  const filteredExpenses = expenses
  .filter((item) => item.type === "expense")   
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
       
       <h3 style={{ marginTop: "30px" }}>Add Income</h3>

<input
  type="number"
  placeholder="Enter Income Amount"
  value={incomeInput}
  onChange={(e) => setIncomeInput(e.target.value)}
/>

<button
  onClick={async () => {
    if (!incomeInput) return;

    try {
      // Find existing income for this user
      const existingIncome = expenses.find(
        (item) => item.type === "income"
      );

      if (existingIncome) {
        // UPDATE existing income
        await API.put(`/expenses/${existingIncome.id}`, {
          amount: incomeInput,
          category: "Income",
          type: "income",
          date: existingIncome.date,
        });
      } else {
        // CREATE new income
        await API.post("/expenses", {
          amount: incomeInput,
          category: "Income",
          type: "income",
          date: new Date().toISOString().split("T")[0],
        });
      }

      setIncomeInput("");
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  }}
>
  Save Income
</button>

      <h3 style={{ marginTop: "30px" }}>Add Transaction</h3>

      <form onSubmit={handleAddExpense}>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

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

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

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
              <div>
                {expense.category} - ₹
                {Number(expense.amount).toFixed(2)} ({expense.type})
              </div>

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
