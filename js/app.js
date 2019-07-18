class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  submitBudgetForm() {
    const budgetValue = this.budgetInput.value;
    if (budgetValue === "" || +budgetValue < 0) {
      this.budgetFeedback.innerHTML =
        "<p>the value cannot be empty or negative</p>";
      this.budgetFeedback.classList.add("showItem");
      setTimeout(() => {
        this.budgetFeedback.classList.remove("showItem");
      }, 4000);
    } else {
      this.budgetAmount.textContent = budgetValue;
      this.budgetInput.value = "";
      this.showBalance();
    }
  }

  submitExpenseForm() {
    const expense = this.expenseInput.value;
    let amountInput = this.amountInput.value;

    if (expense === "") {
      this.expenseFeedback.innerHTML = "<p>the expense cannot be empty</p>";
      this.expenseFeedback.classList.add("showItem");
      setTimeout(() => {
        this.expenseFeedback.classList.remove("showItem");
      }, 4000);
    } else if (amountInput === "" || amountInput <= 0) {
      this.expenseFeedback.innerHTML =
        "<p>the expense amount cannot be empty or negative</p>";
      this.expenseFeedback.classList.add("showItem");
      setTimeout(() => {
        this.expenseFeedback.classList.remove("showItem");
      }, 4000);
    } else {
      amountInput = parseInt(amountInput);
      this.expenseInput.value = "";
      this.amountInput.value = "";
      this.itemID = this.itemList.length;

      const expenseObj = {
        id: this.itemID,
        title: expense,
        amount: amountInput
      };

      this.itemList.push(expenseObj);
      this.showExpenses(expenseObj);
      this.showBalance();
    }
  }

  showExpenses(expense) {
    const div = document.createElement("div");
    div.classList.add("expense");
    div.innerHTML = `
            <div class="expense-item d-flex justify-content-between align-items-baseline">
                <h6 class="expense-title mb-0 text-uppercase list-item">- ${
                  expense.title
                }</h6>
                    <h5 class="expense-amount mb-0 list-item">${
                      expense.amount
                    }</h5>
                    <div class="expense-icons list-item">
                        <a href="#" class="edit-icon mx-2" data-id="${
                          expense.id
                        }">
                            <i class="fas fa-edit"></i>
                        </a>
                        <a href="#" class="delete-icon" data-id="${expense.id}">
                            <i class="fas fa-trash"></i>
                        </a>
                    </div>
            </div>`;
    this.expenseList.appendChild(div);
  }

  showBalance() {
    const expense = this.totalExpenses();
    const total = this.budgetAmount.innerHTML - expense;
    this.balanceAmount.textContent = total;
    this.expenseAmount.textContent = expense;

    if (total < 0) {
      this.balance.classList.remove("showGreen", "showBlack");
      this.balance.classList.add("showRed");
    } else if (total > 0) {
      this.balance.classList.remove("showRed", "showBlack");
      this.balance.classList.add("showGreen");
    } else if (total === 0) {
      this.balance.classList.remove("showRed", "showGreen");
      this.balance.classList.add("showBlack");
    }
  }

  totalExpenses() {
    return this.itemList.reduce((acc,cur) => {
        return acc += cur.amount;
    },0);
  }

  expenseEdit(element){
    const id = parseInt(element.dataset.id);  
    const choosenExpense = this.itemList.find(exp => {
        return exp.id === id
    })

    this.expenseDelete(element);
    this.showBalance();
    this.expenseInput.value = choosenExpense.title;
    this.amountInput.value = choosenExpense.amount
  }

  expenseDelete(element){
    const id = parseInt(element.dataset.id);
    const tempList = this.itemList.filter(exp => {
        return exp.id !== id;
    })
    
    this.itemList = tempList;
    element.parentElement.parentElement.parentElement.remove();
    this.showBalance();
  }
}

function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  const ui = new UI();
  budgetForm.addEventListener("submit", event => {
    event.preventDefault();
    ui.submitBudgetForm();
  });

  expenseForm.addEventListener("submit", event => {
    event.preventDefault();
    ui.submitExpenseForm();
  });

  expenseList.addEventListener("click", event => {
      if(event.target.parentElement.classList.contains('edit-icon')){
        ui.expenseEdit(event.target.parentElement);
      }else if(event.target.parentElement.classList.contains('delete-icon')){
        ui.expenseDelete(event.target.parentElement);
      }
  })
}

document.addEventListener("DOMContentLoaded", function() {
  eventListeners();
});
