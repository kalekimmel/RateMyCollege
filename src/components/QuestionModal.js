import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const QuestionModal = ({ show, handleClose }) => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [answerContent, setAnswerContent] = useState({});

    useEffect(() => {
        if (show) {
            fetchQuestions();
        }
    }, [show]);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/questions');
            setQuestions(response.data);
        } catch (error) {
            console.error('There was an error fetching the questions!', error);
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/questions', { content: newQuestion });
            setNewQuestion('');
            fetchQuestions();
        } catch (error) {
            console.error('There was an error adding the question!', error);
        }
    };

    const handleAddAnswer = async (questionId) => {
        try {
            await axios.post(`http://localhost:5000/questions/${questionId}/answers`, { content: answerContent[questionId] });
            setAnswerContent({ ...answerContent, [questionId]: '' });
            fetchQuestions();
        } catch (error) {
            console.error('There was an error adding the answer!', error);
        }
    };

    const handleUpvote = async (questionId) => {
        try {
            await axios.post(`http://localhost:5000/questions/${questionId}/upvote`);
            fetchQuestions();
        } catch (error) {
            console.error('There was an error upvoting the question!', error);
        }
    };

    const handleAnswerChange = (e, questionId) => {
        setAnswerContent({ ...answerContent, [questionId]: e.target.value });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Questions and Answers</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mt-4">
                    <h4>Questions</h4>
                    <ul className="list-group mb-3">
                        {questions.sort((a, b) => b.upvotes - a.upvotes).map((question) => (
                            <li key={question._id} className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Question:</strong> {question.content}
                                    </div>
                                    <Button variant="success" onClick={() => handleUpvote(question._id)}>
                                        Upvote ({question.upvotes})
                                    </Button>
                                </div>
                                <div>
                                    <h6>Answers:</h6>
                                    <ul>
                                        {question.answers.map((answer, index) => (
                                            <li key={index}>{answer.content}</li>
                                        ))}
                                    </ul>
                                    <Form onSubmit={(e) => { e.preventDefault(); handleAddAnswer(question._id); }}>
                                        <Form.Group controlId="formNewAnswer">
                                            <Form.Label>New Answer</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={answerContent[question._id] || ''}
                                                onChange={(e) => handleAnswerChange(e, question._id)}
                                                required
                                            />
                                        </Form.Group>
                                        <Button variant="primary" type="submit" className="mt-2">
                                            Add Answer
                                        </Button>
                                    </Form>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Form onSubmit={handleAddQuestion}>
                        <Form.Group controlId="formNewQuestion">
                            <Form.Label>New Question</Form.Label>
                            <Form.Control
                                type="text"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-2">
                            Add Question
                        </Button>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default QuestionModal;