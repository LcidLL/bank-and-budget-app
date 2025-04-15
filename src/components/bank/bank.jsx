import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../bank/bank.css'

function Bank() {
    const [users, setUsers] = useState([
        { id: 1, name: 'Lcid Lumenario', email: 'lcid@gmail.com', balance: 5000 },
        { id: 2, name: 'Kaile Borbon', email: 'kaile@gmail.com', balance: 5000 }
    ]);
    const [messages, setMessages] = useState({ error: '', success: '' });
    const [newUser, setNewUser] = useState({ name: '', email: '', initialBalance: 0 });
    const [transaction, setTransaction] = useState({ type: 'deposit', amount: '', fromUser: '', toUser: '' });
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', balance: 0 });
    const handleChange = (setter, obj, field, value) => setter({ ...obj, [field]: value });
    const navigate = useNavigate();
  
    // CREATES NEW USER ============================================================================================================//
    const createUser = (event) => {

      event.preventDefault();
      const userInfo = {
        id: users.length + 1,
        name: newUser.name,
        email: newUser.email,
        balance: Math.max(parseFloat(newUser.initialBalance) || 0, 0)

      };
  
      setUsers([...users, userInfo]);
      setNewUser({ name: '', email: '', initialBalance: 0 });
      notify('User created successfully!');
    };

    const notify = (message, Error) => {

        setMessages({ ...messages, [Error ? 'error' : 'success']: message });

        };
    
    // EDITS EXISTING ACCOUNT DETAILS===============================================================================================//
    const startEdit = (user) => {
      setEditingUser(user.id);
      setEditForm({
        name: user.name,
        email: user.email,
        balance: user.balance
      });
    };
    
    const cancelEdit = () => {
      setEditingUser(null);
      setEditForm({ name: '', email: '', balance: 0 });
    };
    
    const saveEdit = (id) => {
      const updatedUsers = users.map(user => {
        if (user.id === id) {
          return {
            ...user,
            name: editForm.name,
            email: editForm.email,
            balance: parseFloat(editForm.balance) || 0
          };
        }
      return user;
      });
      setUsers(updatedUsers);
      setEditingUser();
      setEditForm({ name: '', email: '', balance: 0 });
      notify('Account updated successfully!');
    };

    // HANDLES ALL TRANSACTION TYPES ===============================================================================================//
    const processTransaction = (event) => {

      event.preventDefault();
      const amount = parseFloat(transaction.amount);
      const updatedUsers = [...users];
      const fromUserIndex = users.findIndex(user => user.email === transaction.fromUser);
      
      if (fromUserIndex === -1) return notify('User does not exist', true);
      
      if (transaction.type === 'deposit') {

        updatedUsers[fromUserIndex].balance += amount;
        notify(`Successfully deposited PHP ${amount} to ${users[fromUserIndex].name}'s account!`);

      } else if (transaction.type === 'withdraw') {

        if (updatedUsers[fromUserIndex].balance < amount) return notify('Insufficient funds', true);
        updatedUsers[fromUserIndex].balance -= amount;
        notify(`Successfully withdrew PHP ${amount} from ${users[fromUserIndex].name}'s account!`);

      } else { // TRANSFERS FUNDS TO ANOTHER ACCOUNT ===============================================================================//

        const toUserIndex = users.findIndex(user => user.email === transaction.toUser);
        
        if (toUserIndex === -1) return notify('Receiver does not exist', true);
        if (fromUserIndex === toUserIndex) return notify('Cannot transfer to the same account', true);
        if (updatedUsers[fromUserIndex].balance < amount) return notify('Insufficient funds for transfer', true);
        
        updatedUsers[fromUserIndex].balance -= amount;
        updatedUsers[toUserIndex].balance += amount;
        notify(`Successfully transferred PHP ${amount} from ${users[fromUserIndex].name} to ${users[toUserIndex].name}!`);

      }
      
      setUsers(updatedUsers);
      setTransaction({ type: 'deposit', amount: '', fromUser: '', toUser: '' });
    };

    // FORM FIELDS for "Create New Account" ==========================================================================================//
    const userFields = [

      { id: 'name', label: 'Full Name:', type: 'text' },
      { id: 'email', label: 'Email Address:', type: 'email' },
      { id: 'initialBalance', label: 'Initial Balance (PHP):', type: 'number', min: "0", required: false }

    ];
  
    return (

      <div className="app-container">
        <header>
          <h1>BANKING APP</h1>
          <button className="btn-budget" onClick={() => navigate('/budget')}>Budget App</button>
        </header>
        
  
        {messages.error && <div className="error-message">{messages.error}</div>}
        {messages.success && <div className="success-message">{messages.success}</div>}
  
        <div className="dashboard-layout">
          {/* ACCOUNT DETAILS TABLE */}
          <div className="dashboard-panel users-panel">
            <h2>Account Details</h2>
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {editingUser === user.id ? (
                      <input type="text" value={editForm.name}onChange={(e) => handleChange(setEditForm, editForm, 'name', e.target.value)}className="edit-input"/>) : (user.name)}
                  </td>
                  <td>
                    {editingUser === user.id ? (
                      <input type="email" value={editForm.email}onChange={(e) => handleChange(setEditForm, editForm, 'email', e.target.value)}className="edit-input"/>) : (user.email)}
                  </td>
                  <td>
                    {editingUser === user.id ? (
                      <input type="number" value={editForm.balance}onChange={(e) => handleChange(setEditForm, editForm, 'balance', e.target.value)}className="edit-input" min="0" step="0.01"/>) : (`PHP ${user.balance}`)}
                  </td>
                  <td>
                    {editingUser === user.id ? (
                      <div className="edit-actions">
                        <button className="btn-edit btn-save" onClick={() => saveEdit(user.id)}>Save</button>
                        <button className="btn-edit btn-cancel" onClick={cancelEdit}>Cancel</button>
                      </div>) : (
                      <button className="btn-edit" onClick={() => startEdit(user)}>Edit</button>
                      )}
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* FORMS PANEL */}
          <div className="dashboard-panel forms-panel">
            {/* CREATE NEW ACCOUNT FORM */}
            <div className="form-container">
              <h2>Create New Account</h2>
              <form onSubmit={createUser}>
                {userFields.map(field => (
                  <div className="form-group" key={field.id}>
                    <label htmlFor={field.id}>{field.label}</label>
                    <input 
                      type={field.type} 
                      id={field.id}
                      value={newUser[field.id]}
                      onChange={(event) => handleChange(setNewUser, newUser, field.id, event.target.value)}
                      required={field.required !== false}
                      min={field.min}
                    />
                  </div>
                ))}
                <button type="submit" className="btn-submit">Create Account</button>
              </form>
            </div>
  
            {/* ACCOUNT TRANSACTIONS FORM */}
            <div className="form-container">
              <h2>Account Transactions</h2>
              <form onSubmit={processTransaction}>
                <div className="form-group">
                  <label htmlFor="transactionType">Transaction Type:</label>
                  <select 
                    id="transactionType"
                    value={transaction.type}
                    onChange={(event) => handleChange(setTransaction, transaction, 'type', event.target.value)}
                  >
                    <option value="deposit">Deposit</option>
                    <option value="withdraw">Withdraw</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
  
                <div className="form-group">
                  <label htmlFor="amount">Amount (PHP):</label>
                  <input 
                    type="number" id="amount" value={transaction.amount}
                    onChange={(event) => handleChange(setTransaction, transaction, 'amount', event.target.value)}
                    min="0.01" step="0.01" required
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="fromUser">
                    {transaction.type === 'deposit' ? 'To Account:' : 'From Account:'}
                  </label>
                  <select 
                    id="fromUser" value={transaction.fromUser}
                    onChange={(event) => handleChange(setTransaction, transaction, 'fromUser', event.target.value)}
                    required
                  >
                    <option value="">Select Account</option>
                    {users.map(user => (
                      <option key={user.id} value={user.email}>
                        {user.name} ({user.email}) - PHP {user.balance}
                      </option>
                    ))}
                  </select>
                </div>
  
                {transaction.type === 'transfer' && (
                  <div className="form-group">
                    <label htmlFor="toUser">To Account:</label>
                    <select 
                      id="toUser" value={transaction.toUser}
                      onChange={(event) => handleChange(setTransaction, transaction, 'toUser', event.target.value)}
                      required
                    >
                      <option value="">Select Account</option>
                      {users.map(user => (
                        <option key={user.id} value={user.email}>
                          {user.name} ({user.email}) - PHP {user.balance}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button type="submit" className="btn-submit">
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Funds
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Bank;