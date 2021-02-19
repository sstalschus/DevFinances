const Modal = {
  toggle() {
    document.querySelector(".modal-overlay").classList.toggle("active")
  }
}

const Themes = {
  themeDay: {},
  themeNight: {
    "--dark-blue": "#363f5f;",
    "--green": "#49aa26;",
    "--light-green": "#3dd705;",
    "--red": "#e92929;",
    "--bodyDay": "#f0f2f5;",
    "--bodyNight": "#1f2223;",
    "--white": "#fff;",
    "--cardNight": "#181a1b;",
    "--textNight": "#969cb3;"
  },
  toggleTheme() {
    document.html.style
  }
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transaction")) || []
  },

  set(transactions) {
    localStorage.setItem(
      "dev.finances:transaction",
      JSON.stringify(transactions)
    )
  }
}

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    let income = 0

    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount
      }
    })
    return income
  },

  expenses() {
    let expense = 0

    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount
      }
    })
    return expense
  },

  total() {
    return Transaction.incomes() + Transaction.expenses()
  }
}

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTrannsaction(transaction, index) {
    const tr = document.createElement("tr")
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrecy(transaction.amount)
    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação" />
      </td>
    `
    return html
  },

  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrecy(
      Transaction.incomes()
    )
    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrecy(
      Transaction.expenses()
    )
    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrecy(
      Transaction.total()
    )
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ""
  }
}

const Utils = {
  formatAmount(value) {
    value = Number(value) * 100

    return value
  },

  formatDate(date) {
    const splittedDate = date.split("-")

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrecy(value) {
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

    return signal + value
  }
}

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  validateFields() {
    const { description, amount, date } = Form.getValues()

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      // Com o trim fazemos uma limpeza dos espaços vazios da String
      throw new Error("Por favor preecha todos os campos")
    }
  },

  saveTransaction(transaction) {
    Transaction.add(transaction)
  },

  clearFields() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },

  submit(event) {
    event.preventDefault()

    try {
      Form.validateFields()
      const transaction = Form.formatValues()
      Form.saveTransaction(transaction)
      Form.clearFields()
      Modal.toggle()
    } catch (error) {
      alert(error.message)
    }
  }
}
//2:40

const App = {
  init() {
    Transaction.all.forEach(DOM.addTrannsaction)

    DOM.updateBalance()

    Storage.set(Transaction.all)
  },

  reload() {
    DOM.clearTransactions()
    App.init()
  }
}

App.init()
