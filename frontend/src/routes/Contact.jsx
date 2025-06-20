import React, { useEffect, useState } from 'react';
import { useLoader } from '../context/LoaderContext';
import Email from '../assets/icons/rules/email.svg';
import Call from '../assets/icons/rules/call.svg';
import Visit from '../assets/icons/rules/visit.svg';
import { Button, InputGroup, Form } from '../components';
import {
  validateEmail,
  validateFullName,
  validateSubject,
  validateMessage,
} from '../utils/validations';
import * as api from '../api/api.js';
import { useNotification } from '../context/NotificationContext';
import { useLocation } from 'react-router-dom';

function Contact() {
  const [state, setState] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const errorToDisplay = Object.values(errorMessages)[0]

  const {showNotification} = useNotification();
  const location = useLocation();

  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
    
    if (isSubmitted) {
      const potentialNextState = { ...state, [name]: value };
      const errors = validate(potentialNextState);
      setErrorMessages(errors || {});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true)

    const errors = validate(state);
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      const { data } = await api.contact(state);
      showNotification('Contact form has successfully sent!')
      setErrorMessages({})
    } catch (error) {
      setErrorMessages({ error: error?.message });
    }
  };

  const validate = (formData) => {
    const errors = {};

    const nameError = validateFullName(formData.name);
    const emailError = validateEmail(formData.email);
    const subjectError = validateSubject(formData.subject);
    const messageError = validateMessage(formData.message);

    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;
    if (subjectError) errors.subject = subjectError;
    if (messageError) errors.message = messageError;

    return errors;
  };

  useEffect(() => {
    // Prefill the form fields from navigation state
    if (location.state) {
      setState((prevState) => ({
        ...prevState,
        ...location.state,
      }));
    }
  }, [location.state]);

  return (
    <div className="contact">
      <h1 className="title">Contact Us</h1>
      <div className="content">
        <div className="contactOptions">
          <div>
            <img
              src={Email}
              alt=""
            />
            <h3>Email Us</h3>
            <p>support@melodymatch.com</p>
            <p>business@melodymatch.com</p>
          </div>
          <div>
            <img
              src={Call}
              alt=""
            />
            <h3>Call Us</h3>
            <p>+1 (555) 123-4567</p>
            <p>Mon-Fri, 9am-5pm EST</p>
          </div>
          <div>
            <img
              src={Visit}
              alt=""
            />
            <h3>Visit Us</h3>
            <p>123 Music Avenue</p>
            <p>New York, NY 10001</p>
          </div>
        </div>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <div className="widthDivider">
            <InputGroup
              label="Name"
              name="name"
              error={errorMessages.name}
            >
              <input
                type="text"
                className={`input ${errorMessages.name ? 'error' : ''}`}
                name="name"
                id="name"
                value={state.name || ""}
                placeholder="enter your name"
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup
              label="Email"
              name="email"
              error={errorMessages.email}
            >
              <input
                type="text"
                className={`input ${errorMessages.email ? 'error' : ''}`}
                name="email"
                id="email"
                placeholder="enter your email"
                value={state.email || ""}
                onChange={(e) => handleChange(e)}
              />
            </InputGroup>
          </div>
          <InputGroup
            label="Subject"
            name="subject"
            error={errorMessages.subject}
          >
            <input
              type="text"
              className={`input ${errorMessages.subject ? 'error' : ''}`}
              name="subject"
              id="subject"
              placeholder="enter subject"
              value={state.subject || ""}
              onChange={(e) => handleChange(e)}
            />
          </InputGroup>
          <InputGroup
            label="Message"
            name="message"
            error={errorMessages.message}
          >
            <textarea
              className={`textarea ${errorMessages.message ? 'error' : ''}`}
              name="message"
              id="message"
              placeholder="how can we help you?"
              value={state.message || ""}
              onChange={(e) => handleChange(e)}
            />
          </InputGroup>
          <Button type="submit">Send Message</Button>
          <div className="additionalContainer">
            <span className={`error ${errorToDisplay ? 'visible' : ''} clearable`}>{errorToDisplay || '.'}</span>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Contact;
