
const budgetInput = document.getElementById("budget");
const setBudgetBtn = document.getElementById("setBudgetBtn");

const totalBudget = document.getElementById("totalBudget");
const totalExpenses = document.getElementById("totalExpenses");
const remainingBalance = document.getElementById("remainingBalance");

const expenseForm = document.getElementById("expenseForm");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");

const expenseList = document.getElementById("expenseList");

let budget = Number(localStorage.getItem("budget")) || 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveData() {
    localStorage.setItem("budget", budget);
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function formatMoney(amount) {
    return "₹" + amount.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}

function updateSummary() {
    const total = expenses.reduce((sum, expense) => {
        return sum + expense.amount;
    }, 0);

    const remaining = budget - total;

    totalBudget.textContent = formatMoney(budget);
    totalExpenses.textContent = formatMoney(total);
    remainingBalance.textContent = formatMoney(remaining);

    remainingBalance.classList.toggle("negative", remaining < 0);
}

function displayExpenses() {
    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        expenseList.innerHTML =
            '<p class="empty-message">No expenses added yet.</p>';
        updateSummary();
        return;
    }

    expenses.forEach((expense) => {
        const item = document.createElement("div");
        item.className = "expense-item";

        const info = document.createElement("div");
        info.className = "expense-info";

        const name = document.createElement("h3");
        name.textContent = expense.name;

        const category = document.createElement("span");
        category.textContent = expense.category;

        info.append(name, category);

        const right = document.createElement("div");
        right.className = "expense-right";

        const amount = document.createElement("span");
        amount.className = "expense-amount";
        amount.textContent = formatMoney(expense.amount);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            expenses = expenses.filter((e) => e.id !== expense.id);
            saveData();
            displayExpenses();
        });

        right.append(amount, deleteButton);
        item.append(info, right);

        expenseList.appendChild(item);
    });

    updateSummary();
}

setBudgetBtn.addEventListener("click", () => {
    const value = Number(budgetInput.value);

    if (budgetInput.value.trim() === "" || !Number.isFinite(value) || value < 0) {
        alert("Please enter a valid budget.");
        return;
    }

    budget = value;
    saveData();
    updateSummary();
    budgetInput.value = "";
});

expenseForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const category = expenseCategory.value;

    if (!name || !Number.isFinite(amount) || amount <= 0 || !category) {
        alert("Please enter valid expense details.");
        return;
    }

    const expense = {
        id: Date.now() + Math.random(),
        name: name,
        amount: amount,
        category: category
    };

    expenses.push(expense);

    saveData();
    displayExpenses();

    expenseForm.reset();
});

displayExpenses();
