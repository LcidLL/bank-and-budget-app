import './Budget.css';
import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddBudgetModal from '../components/budget/AddBudgetModal'
import AddExpenseModal from '../components/budget/AddExpenseModal';
import BudgetCard from '../components/budget/BudgetCard';
import TotalBudgetCard from '../components/budget/TotalBudgetCard';
import UncategorizedBudgetCard from '../components/budget/UncategorizedBudgetCard';
import ViewExpensesModal from '../components/budget/ViewExpensesModal';
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from '../context/BudgetsContext';

function BudgetPage() {
  const [showAddBudgetModal, setShowBudgetModal] = useState(false);
  const [showAddExpenseModal, setShowExpenseModal] = useState(false);
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState();
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState();
  const { budgets, getBudgetExpenses } = useBudgets(); 
  const navigate = useNavigate();

  function openAddExpenseModal(budgetId) {
    setShowExpenseModal(true);
    setAddExpenseModalBudgetId(budgetId);
    /* console.log('I am Clicked') */
  }

  return ( 
    <>
      <Container className="my-2">
        <Stack direction="horizontal" gap="2" className="mb-4">
          <h1 className="me-auto">Budget App</h1>
          <Button variant="primary" onClick={() => setShowBudgetModal(true)}>Add Budget</Button>
          <Button variant="outline-primary" onClick={openAddExpenseModal}>Add Expense</Button>
          <Button variant="success" onClick={() => navigate('/')}>Bank App</Button>
        </Stack>
        <div className="btnContainer">
          {budgets.map(budget => {
              const amount = getBudgetExpenses(budget.id).reduce(
                (total, expense) => total + expense.amount, 0
              )
              return (
              <BudgetCard 
              key={budget.id} 
              name={budget.name} 
              amount={amount} 
              max={budget.max}
              gray 
              onAddExpenseClick={() => openAddExpenseModal(budget.id)}
              onViewExpensesClick={() => setViewExpensesModalBudgetId(budget.id)}
              />
            )})}
          <UncategorizedBudgetCard onAddExpenseClick={openAddExpenseModal} onViewExpensesClick={() => setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)}/>
          <TotalBudgetCard />
        </div>
      </Container>
      <AddBudgetModal show={showAddBudgetModal} handleClose={() => setShowBudgetModal(false)} />
      <AddExpenseModal show={showAddExpenseModal} defaultBudgetId={addExpenseModalBudgetId} handleClose={() => setShowExpenseModal(false) } />
      <ViewExpensesModal budgetId={viewExpensesModalBudgetId} handleClose={() => setViewExpensesModalBudgetId() } />
    </>
  )
}

export default BudgetPage;
