import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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

const ContactForm = () => {
  const { register, handleSubmit, reset, formState } = useForm({
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
    },
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const { isSubmitting, isValid, errors } = formState;

  const handleFormSubmitError = (error) => {
    setFormSuccess(false);
    setFormMessage(`Невозможно отправить форму. ${error}. Пожалуйста, попробуйте снова.`);
  };

  const onSubmit = ({ fullName, email, message }) => {
    if (isValid) {
      const endPoint = 'https://qveaqjxu0g.execute-api.us-east-1.amazonaws.com';

      axios
        .post(`${endPoint}/dev`, {
          // HACK: Endpoint expects name property
          fullName,
          email,
          message,
        })
        .then((response) => {
          if (response.status === 200) {
            setFormSuccess(true);
            setFormMessage(
              'Ваше сообщение было успешно отправлено. Вы получите ответ в течении 24 часов.',
            );
            reset();
          } else {
            handleFormSubmitError();
          }
        })
        .catch((error) => {
          handleFormSubmitError(error);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {formMessage && <Alert success={formSuccess}>{formMessage}</Alert>}

      <FormItem>
        <Label htmlFor="fullName">Как мне к вам обращаться?</Label>
        <Input
          type="text"
          name="fullName"
          id="fullName"
          aria-required="true"
          aria-invalid={errors.fullName ? 'true' : 'false'}
          placeholder="Например: Акакий Акакиевич"
          {...register('fullName', { required: true })}
        />
        {errors.fullName && <FormRequirement>Пожалуйста, введите ваше имя</FormRequirement>}
      </FormItem>

      <FormItem>
        <Label htmlFor="email">Контактный e-mail (обязательно)</Label>
        <Input
          type="email"
          name="email"
          id="email"
          className="form-control"
          aria-required="true"
          aria-invalid={errors.email ? 'true' : 'false'}
          placeholder="Например: ceo@supercompany.ru"
          {...register('email', {
            required: true,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
          })}
        />
        {errors.email && (
          <FormRequirement>
            Пожалуйста, введите верный e-mail, чтобы я мог с вами связаться
          </FormRequirement>
        )}
      </FormItem>

      <FormItem>
        <Label htmlFor="message">Ваше сообщение (Обязательно)</Label>
        <Textarea
          name="message"
          id="message"
          component="textarea"
          className="form-control"
          cols={40}
          rows={10}
          aria-required="true"
          aria-invalid={errors.message ? 'true' : 'false'}
          placeholder="Краткое описание того, что необходимо сделать"
          {...register('message', { required: true })}
        />
        {errors.message && <FormRequirement>Пожалуйста, введите ваше сообщение</FormRequirement>}
      </FormItem>

      <Button type="submit" disabled={isSubmitting}>
        Отправить
      </Button>
    </form>
  );
};

ContactForm.propTypes = {};
ContactForm.defaultProps = {};

export default ContactForm;
