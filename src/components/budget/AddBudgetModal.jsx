import { Button, Form, Modal } from "react-bootstrap";
import { useRef } from "react";
import { useBudgets } from "../../assets/context/BudgetsContext";


export default function AddBudgetModal({ show, handleClose }) {
    const nameRef = useRef();
    const maxRef = useRef();
    const { addBudget } = useBudgets();

    function handleSubmit(e) {
        e.preventDefault();
        console.log(nameRef)
        console.log(maxRef)
        addBudget(
        {
            name: nameRef.current.value,
            max: parseFloat(maxRef.current.value)
        })
        handleClose();
    }

    return (
    <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>New Budget</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control ref={nameRef} type="text" required/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="max">
                    <Form.Label>Maximum Amount</Form.Label>
                    <Form.Control 
                        ref={maxRef} 
                        type="number" 
                        required 
                        min={0} 
                        step={1} 
                    />
                </Form.Group>
            <div className="d-flex justify-content-end">
                <Button variant="primary" type="submit">Add</Button>
            </div>
            </Modal.Body>
        </Form>
    </Modal>    
)}