import { makeStyles } from '@griffel/react';
import { data, Form, useNavigation } from 'react-router';
import { Alert } from '~/components/Alert';
import { Banner } from '~/components/Banner';
import { Button } from '~/components/Button';
import { Section } from '~/components/Section';
import { TextField } from '~/components/TextField';
import { sendContactMessage } from '~/mail.server';
import { pageMeta } from '~/seo';
import type { Route } from './+types/contact';

const LIMITS = { name: 100, email: 254, message: 5000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/v;

/**
 * A field people never see and bots reliably fill in.
 *
 * Hidden from sight, from the tab order and from assistive technology, so the
 * only thing that ever puts a value in it is a script filling every input.
 */
const TRAP_FIELD = 'website';

const useStyles = makeStyles({
  trap: { position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' },
});

type Field = 'name' | 'email' | 'message';

type Result =
  | { ok: true }
  | {
      ok: false;
      errors: Partial<Record<Field, string>>;
      values: Record<Field, string>;
      /** Set when the form was valid but could not be delivered. */
      failure?: string;
    };

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Обратная связь',
    description: 'Напишите мне: расскажите о задаче, и я отвечу в течение 24 часов.',
    path: '/contact/',
  });

export const action = async ({ request }: Route.ActionArgs) => {
  const form = await request.formData();
  const read = (field: string): string => {
    const value = form.get(field);
    return typeof value === 'string' ? value.trim() : '';
  };

  const values = { name: read('name'), email: read('email'), message: read('message') };

  // Answer a bot exactly as a person would be answered, so it learns nothing.
  if (read(TRAP_FIELD) !== '') return { ok: true } satisfies Result;

  const errors: Partial<Record<Field, string>> = {};
  if (values.name === '' || values.name.length > LIMITS.name) {
    errors.name = 'Пожалуйста, введите ваше имя';
  }
  if (!EMAIL.test(values.email) || values.email.length > LIMITS.email) {
    errors.email = 'Пожалуйста, введите верный e-mail, чтобы я мог с вами связаться';
  }
  if (values.message === '' || values.message.length > LIMITS.message) {
    errors.message = 'Пожалуйста, введите ваше сообщение';
  }

  if (Object.keys(errors).length > 0) {
    return data<Result>({ ok: false, errors, values }, { status: 400 });
  }

  try {
    await sendContactMessage(values);
  } catch (error) {
    console.error('[contact] delivery failed', error);
    return data<Result>(
      {
        ok: false,
        errors,
        values,
        failure: 'Невозможно отправить форму. Пожалуйста, попробуйте снова чуть позже.',
      },
      { status: 502 },
    );
  }

  return { ok: true } satisfies Result;
};

export default function Contact({ actionData }: Route.ComponentProps) {
  const styles = useStyles();
  const navigation = useNavigation();
  const sending = navigation.state === 'submitting';

  const sent = actionData?.ok === true;
  const errors = actionData?.ok === false ? actionData.errors : {};
  const values = actionData?.ok === false ? actionData.values : undefined;
  const failure = actionData?.ok === false ? actionData.failure : undefined;

  return (
    <>
      <Banner title="Обратная связь" />
      <Section grow label="Форма обратной связи">
        {sent ? (
          <Alert tone="success">
            Ваше сообщение было успешно отправлено. Вы получите ответ в течение 24 часов.
          </Alert>
        ) : null}
        {failure ? <Alert tone="danger">{failure}</Alert> : null}

        {/*
          A plain POST: it submits and validates on the server with or without
          scripts. `noValidate` hands validation to the server so the messages
          are ours, in Russian, and identical in both cases. Remounting after a
          successful send is what empties the fields.
        */}
        <Form method="post" noValidate key={sent ? 'sent' : 'draft'}>
          <TextField
            label="Как мне к вам обращаться?"
            name="name"
            required
            autoComplete="name"
            maxLength={LIMITS.name}
            placeholder="Например: Акакий Акакиевич"
            defaultValue={values?.name}
            error={errors.name}
          />
          <TextField
            label="Контактный e-mail (обязательно)"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={LIMITS.email}
            placeholder="Например: ceo@supercompany.ru"
            defaultValue={values?.email}
            error={errors.email}
          />
          <TextField
            label="Ваше сообщение (обязательно)"
            name="message"
            rows={8}
            required
            maxLength={LIMITS.message}
            placeholder="Краткое описание того, что необходимо сделать"
            defaultValue={values?.message}
            error={errors.message}
          />

          <div className={styles.trap} aria-hidden="true">
            <label>
              Не заполняйте это поле
              <input type="text" name={TRAP_FIELD} tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <Button type="submit" disabled={sending}>
            {sending ? 'Отправляется…' : 'Отправить'}
          </Button>
        </Form>
      </Section>
    </>
  );
}
