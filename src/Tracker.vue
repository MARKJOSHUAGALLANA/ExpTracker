<template>
    <div class="flex justify-center items-center min-h-screen bg-blue-100">
      <div class="container mx-auto p-8 bg-white rounded-lg shadow-lg border border-black-300 bg-blue">
        <h1 class="text-5xl text-center text-gray-800 mb-10">Expense Track Project</h1>
        <div class="flex">
                <div class="flex-1 mr-8 max-w-lg bg-yellow">
                    <input type="text" v-model="newExpense.item" placeholder="Item" class="input-field">
                    <select v-model="newExpense.category" class="input-field">
                        <option value="" disabled selected>Select Category</option>
                        <option value="food">Food</option>
                        <option value="clothes">Clothes</option>
                        <option value="transportation">Transportation</option>
                    </select>
                    <input type="text" v-model="amountInput" placeholder="Amount" class="input-field">
                    <button @click="addOrUpdateExpense" class="btn-primary">ADD
                    </button>

                </div>
          <div class="flex-1 relative"> 
            <div class="expenses-table-container border border-gray-300">
              <table class="w-full">
                <thead>
                  <tr>
                    <th class="border border-gray-300 px-4 py-2">Date & Time</th>
                    <th class="border border-gray-300 px-4 py-2">Item</th>
                    <th class="border border-gray-300 px-4 py-2">Category</th>
                    <th class="border border-gray-300 px-4 py-2">Amount</th>
                    <th class="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(expense, index) in expenses" :key="index">
                    <td class="border border-gray-300 px-4 py-2">{{ expense.dateTime }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ expense.item }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ expense.category }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ expense.amount }}</td>
                    <td class="border border-gray-300 px-4 py-2">
                      <button @click="editExpense(index)" class="btn-secondary">Edit
                      </button>
                      <button @click="confirmDelete(expense.id)" class="btn-danger">Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="total-expenses border-t border-gray-300">Total Expenses: {{ totalExpenses }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style>
  /* Input field style */
  .input-field {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    width: 100%;
  }

  /* Primary button style */
  .btn-primary {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  /* Secondary button style */
  .btn-secondary {
    padding: 0.5rem 1rem;
    background-color: #6c757d;
    color: #fff;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  /* Danger button style */
  .btn-danger {
    padding: 0.5rem 1rem;
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  /* Expenses table style */
  .expenses-table-container {
    overflow-x: auto;
  }

  .expenses-table-container table {
    border-collapse: collapse;
    width: 100%;
  }

  .expenses-table-container th,
  .expenses-table-container td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  .expenses-table-container th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  /* Total expenses style */
  .total-expenses {
    padding: 0.5rem;
    background-color: #f8f9fa;
    border-top: 1px solid #ddd;
    text-align: center;
  }
</style>

  
  
<script setup>
import { ref, computed } from 'vue';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import db from './firebase/config'; 

const expenses = ref([]);
const newExpense = ref({
    item: '',
    category: '',
    amount: 0,
});
const amountInput = ref('');
const editingIndex = ref(null);


const fetchExpenses = async () => {
    const q = query(collection(db, 'expenses'), orderBy('dateTime', 'desc'));


    const unsubscribe = onSnapshot(q, (snapshot) => {
        expenses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
};


import { onMounted } from 'vue';
onMounted(fetchExpenses);


const addOrUpdateExpense = async () => {
    if (!newExpense.value.item || !newExpense.value.category || !amountInput.value) {
        alert('Please fill up all the fields.');
        return;
    }

    if (isNaN(parseFloat(amountInput.value))) {
        alert('Please enter a valid number for the amount.');
        return;
    }

    if (editingIndex.value === null) {
        await addExpense();
    } else {
        await updateExpense();
    }
};


const addExpense = async () => {
    const dateTime = new Date().toLocaleString();
    const expense = { ...newExpense.value, amount: parseFloat(amountInput.value), dateTime };

    try {
        const docRef = await addDoc(collection(db, 'expenses'), expense);
        console.log('Expense added with ID: ', docRef.id);
    } catch (error) {
        console.error('Error adding expense: ', error);
    }

    newExpense.value = {
        item: '',
        category: '',
        amount: 0,
    };
    amountInput.value = '';
};


const updateExpense = async () => {
    const expenseId = expenses.value[editingIndex.value].id;
    const expense = { ...newExpense.value, amount: parseFloat(amountInput.value) };

    try {
        await updateDoc(doc(db, 'expenses', expenseId), expense);
        console.log('Expense updated with ID: ', expenseId);
    } catch (error) {
        console.error('Error updating expense: ', error);
    }

    newExpense.value = {
        item: '',
        category: '',
        amount: 0,
    };
    amountInput.value = '';
    editingIndex.value = null;
};


const deleteExpense = async (id) => {
    try {
        await deleteDoc(doc(db, 'expenses', id));
        console.log('Expense deleted with ID: ', id);
    } catch (error) {
        console.error('Error deleting expense: ', error);
    }
};


const confirmDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
        deleteExpense(id);
    }
};


const editExpense = (index) => {
    const expense = expenses.value[index];
    newExpense.value = {
        item: expense.item,
        category: expense.category,
        amount: expense.amount,
    };
    amountInput.value = expense.amount;
    editingIndex.value = index;
};

const totalExpenses = computed(() => {
    return expenses.value.reduce((total, expense) => total + parseFloat(expense.amount), 0);
});
</script>
