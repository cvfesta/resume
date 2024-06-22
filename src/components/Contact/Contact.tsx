import React from 'react';
import useBootstrapValidation from '../../utils/bs-validations';
import './style.css';

const ContactModal: React.FC = () => {
    useBootstrapValidation(); // Apply the validation logic

    return (
        <div className="modal fade" id="contactModal" data-bs-backdrop="static" tabIndex={-1} aria-labelledby="contactModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-5">
                    <div className="modal-header">
                        <i className="fa-regular fa-envelope fs-4 me-2"></i>
                        <h5 className="modal-title me-2" id="contactModalLabel">Contact</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form name="contact" className="contact needs-validation" method="POST" action="https://formspree.io/f/mpzgazbz" data-netlify="true" noValidate>
                        <div className="modal-body">
                            <p className="visually-hidden">
                                <label>
                                    Don’t fill this out if you’re human: <input name="bot-field" />
                                </label>
                            </p>
                            <div className="form-floating mb-3">
                                <input type="text" name="firstName" className="form-control" required spellCheck="true"
                                       id="firstName" placeholder="First Name" autoComplete="given-name" />
                                <label htmlFor="firstName">First Name</label>
                                <div className="invalid-feedback">
                                    Please enter your first name.
                                </div>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" name="lastName" className="form-control" required spellCheck="true"
                                       id="lastName" placeholder="Last Name" autoComplete="family-name" />
                                <label htmlFor="lastName">Last Name</label>
                                <div className="invalid-feedback">
                                    Please enter your last name.
                                </div>
                            </div>
                            <div className="form-floating mb-4">
                                <input type="email" name="email" className="form-control" required spellCheck="true"
                                       id="email" placeholder="name@example.com" autoComplete="email" />
                                <label htmlFor="email">Email address</label>
                                <div className="invalid-feedback">
                                    Please enter your email.
                                </div>
                            </div>
                            <div className="form-floating">
                                <textarea name="message" className="form-control contactTextarea"
                                          placeholder="Leave a comment here" id="message" required></textarea>
                                <label htmlFor="message">How can I help you?</label>
                                <div className="invalid-feedback">
                                    Please enter a message.
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-dark" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" className="btn btn-outline-dark contact-button">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
