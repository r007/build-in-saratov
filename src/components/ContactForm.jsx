import React from 'react';
import { Formik, ErrorMessage } from 'formik';
import axios from 'axios';
import styled, { css } from 'styled-components';
import { ifProp } from 'styled-tools';

import Button from './Button';
import FormRequirement from './FormRequirement';
import FormItem from './FormItem';
import Input from './Input';
import Textarea from './Textarea';
import Label from './Label';

const Alert = styled.span`
  display: block;
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;

  ${ifProp(
    'success',
    css`
      color: #155724;
      background-color: #d4edda;
      border-color: #c3e6cb;
    `,
    css`
      color: #721c24;
      background-color: #f8d7da;
      border-color: #f5c6cb;
    `,
  )};
`;

class ContactForm extends React.Component {
  static validateMessage(value) {
    let error;
    if (!value) {
      error = 'Пожалуйста, введите ваше сообщение';
    }

    return error;
  }

  static validateEmail(value) {
    let error;
    if (!value) {
      error = 'Пожалуйста, введите ваш почтовый адрес';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Пожалуйста, введите верный e-mail, чтобы я мог с вами связаться';
    }

    return error;
  }

  constructor(props) {
    super(props);
    this.state = {
      submitSuccess: false,
      formMessage: null,
    };

    // Bind class methods
    this.handleFormSubmitSuccess = this.handleFormSubmitSuccess.bind(this);
    this.handleFormSubmitError = this.handleFormSubmitError.bind(this);
  }

  handleFormSubmitSuccess() {
    this.setState({
      submitSuccess: true,
      formMessage: 'Ваше сообщение было успешно отправлено. Вы получите ответ в течении 24 часов.',
    });
  }

  handleFormSubmitError(error) {
    this.setState({
      submitSuccess: false,
      formMessage: `Невозможно отправить форму. ${error}. Пожалуйста, попробуйте снова.`,
    });
  }

  render() {
    return (
      <Formik
        initialValues={{
          fullName: '',
          email: '',
          message: '',
        }}
        render={({ errors, touched, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            {this.state.formMessage && (
              <Alert success={this.state.submitSuccess}>{this.state.formMessage}</Alert>
            )}
            <FormItem>
              <Label htmlFor="fullName">Как мне к вам обращаться?</Label>
              <Input
                type="text"
                name="fullName"
                id="fullName"
                className={`form-control ${errors.fullName && touched.fullName && 'is-invalid'}`}
                placeholder="Например: Акакий Акакиевич"
              />
              <ErrorMessage name="fullName">
                {msg => <FormRequirement>{msg}</FormRequirement>}
              </ErrorMessage>
            </FormItem>

            <FormItem>
              <Label htmlFor="email">Контактный e-mail (обязательно)</Label>
              <Input
                type="email"
                name="email"
                id="email"
                className={`form-control ${errors.email && touched.email && 'is-invalid'}`}
                placeholder="Например: ceo@supercompany.ru"
                validate={ContactForm.validateEmail}
              />
              <ErrorMessage name="email">
                {msg => <FormRequirement>{msg}</FormRequirement>}
              </ErrorMessage>
            </FormItem>

            <FormItem>
              <Label htmlFor="message">Ваше сообщение (Обязательно)</Label>
              <Textarea
                name="message"
                id="message"
                component="textarea"
                className={`form-control ${errors.message && touched.message && 'is-invalid'}`}
                validate={ContactForm.validateMessage}
                cols={40}
                rows={10}
                placeholder="Краткое описание того, что необходимо сделать"
              />
              <ErrorMessage name="message">
                {msg => <FormRequirement>{msg}</FormRequirement>}
              </ErrorMessage>
            </FormItem>

            <Button type="submit" disabled={isSubmitting}>
              Отправить
            </Button>
          </form>
        )}
        onSubmit={({ fullName, email, message }, actions) => {
          const endPoint = 'https://qveaqjxu0g.execute-api.us-east-1.amazonaws.com/dev';

          axios
            .post(`${endPoint}/contact`, {
              // HACK: Endpoint expects name property
              fullName,
              email,
              message,
            })
            .then(response => {
              if (response.status === 200) {
                this.handleFormSubmitSuccess();
                actions.resetForm();
              } else {
                this.handleFormSubmitError();
              }
            })
            .catch(error => {
              this.handleFormSubmitError(error);
            });
        }}
      />
    );
  }
}

ContactForm.propTypes = {};
ContactForm.defaultProps = {};

export default ContactForm;
