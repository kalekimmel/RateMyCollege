import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';

const AnswerList = ({ questionId, answers, fetchQuestions }) => {
    const [newAnswer, setNewAnswer] = useState('');

    const handleAddAnswer = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/questions/${questionId}/answers`, { answer: newAnswer });
            setNewAnswer('');
            fetchQuestions();
        } catch (error) {
            console.error('There was an error adding the answer!', error);
        }
    };

    return (
        <div className="mt-4">
            <h5>Answers</h5>
            <ul className="list-group mb-3">
                {answers.map((answer, index) => (
                    <li key={index} className="list-group-item">
                        {answer}
                    </li>
                ))}
            </ul>
            <Form onSubmit={handleAddAnswer}>
                <Form.Group controlId="formNewAnswer">
                    <Form.Label>New Answer</Form.Label>
                    <Form.Control
                        type="text"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">
                    Add Answer
                </Button>
            </Form>
        </div>
    );
};

export default AnswerList;