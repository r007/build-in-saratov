---
layout: post
title: Пишем приложение «обзор ресторанов» на AWS AppSync
author: Сергей Монин
date: 2019-09-15T03:06:37+00:00
image: graphql-aws.jpg
draft: false
tags: 
  - Уроки
---

Язык [GraphQL](https://graphql.org/) с каждым годом становится всё популярнее. Но есть одно "но" – язык запросов это лишь половина функционала. Технология GraphQL состоит из двух частей, клиентской и серверной части. А значит, чтобы использовать её, нужно не только выучить GraphQL на клиенте, но и лучшие практики, а также серверную разработку и всё, что с ней связано.

В какой-то момент вы столкнетесь с необходимостью масштабирования, сложной системой авторизации, хакерскими атаками. Всё это требует глубоких знаний в серверной разработке.

К счастью, сегодня есть большое количество сервис-провайдеров, предоставляющих готовые серверные решения. Разработчику остается лишь реализовать функционал на клиенте, не беспокоясь о серверной части.

Такие сервисы как [AWS AppSync](https://aws.amazon.com/appsync/) (база данных), [Firebase](https://firebase.google.com/) (API), [Cloudinary](https://cloudinary.com/) (медиа), [Algolia](https://www.algolia.com/) (поиск), [Auth0](https://auth0.com/) (авторизация) позволяют разгрузить сложную инфраструктуру стороннему поставщику, а вместо этого заняться непосредственно реализацией функционала для конечного пользователя.

В этом уроке мы разберем, как получить преимущество от использования AWS AppSync, управляемого GraphQL сервиса. Построим full-stack приложение, не написав ни единой строчки back-end кода.

Хотя мы будем работать с фреймворком React, концепция API вызовов не зависит от фреймворка и будет работать так же в Angular, Vue, React Native, Ionic или любом другом JavaScript фреймворке или приложении.

Мы напишем приложение «обзор ресторанов». В этом приложении, мы сможем создавать ресторан или кафе, просмотривать рестораны, писать на них обзоры и ставить оценку.

<iframe width="560" height="315" src="https://www.youtube.com/embed/aJTdOjhkXSU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- **Демо**: https://master.d25h9bbwhn8626.amplifyapp.com/
- **Исходный код**: https://github.com/r007/appsync-restaurant-reviews

Инструменты и фреймворки, которые мы будем использовать – Gatsby, AWS Amplify, Grommet и AWS AppSync.

AWS Amplify – это фреймворк, который позволяет создавать и подключаться к облачным сервисам, такими как сервис авторизации, GraphQL API и Lambda функциям. AWS AppSync – это управляемый GraphQL сервис.

Мы будем использовать Amplify, чтобы подключиться к AppSync API. Затем напишем клиентскую часть на React, взаимодействующую с API.

## Подготовка

Первым делом, создадим новый проект с помощью [Gatsby](https://www.gatsbyjs.org) и перейдем в новую директорию:

```shell script
gatsby new restaurant-reviews
cd restaurant-reviews
```

Далее, установим зависимости, которые будем использовать в проекте. [AWS Amplify](https://aws-amplify.github.io/) будем использовать для подключения к API и [Grommet](https://github.com/grommet/grommet) в качестве UI-фреймворка, таким образом нам не придется с нуля создавать компоненты.

```shell script
npm install --save aws-amplify styled-components grommet grommet-icons react-rating
```

Далее, установим и настроим Amplify CLI:

```shell script
npm install -g @aws-amplify/cli
amplify configure
```

**Amplify configure** проведет через все шаги, необходимые для создания AWS сервиса в вашем аккаунте. Для ознакомления с данным процессом, посмотрите [это видео](https://www.youtube.com/watch?v=fWbM5DLh25U).

После того как мы создали приложение и Amplify готов к работе, можно инициализировать пустой проект Amplify.

```shell script
amplify init
``` 

**Amplify init** проведет через все шаги и создаст новый проект Amplify. Он спросит у вас желаемое имя проекта, имя окружения и текстовый редактор на выбор. CLI автоматически определит ваше окружение React и подскажет, какие значения лучше выбрать.  

## Создание GraphQL API

Как только мы инициализировали пустой проект Amplify, самое время добавить GraphQL API. Чтобы добавить новый сервис, набираем команду **amplify add** в консоле.

```shell script
amplify add api
```

Эта команда поможет нам настроить API, отвечаем на все вопросы:

```shell script
? Please select from one of the below mentioned services GraphQL
? Provide API name: restaurantReviews
? Choose an authorization type for the API API key
? Do you have an annotated GraphQL schema? No
? Do you want a guided schema creation? Yes
? What best describes your project: Single object with fields (e.g., “Todo” with ID, name, description)
? Do you want to edit the schema now? Yes
```

CLI откроет базовую schema в текстовом редакторе. Это будет модель для нашего GraphQL API.

Вставьте следующую schema в файл **amplify/backend/api/restaurantReviews/schema.graphql** и сохраните его.

```graphql
type Restaurant @model {
  id: ID!
  city: String!
  name: String!
  numRatings: Int
  photo: String!
  reviews: [Review] @connection(name: "RestaurantReview")
}

type Review @model {
  rating: Int!
  text: String!
  createdAt: String
  restaurant: Restaurant! @connection(name: "RestaurantReview")
}
```

В этой схеме мы создаем два главных типа: **Restaurant** и **Review**. Обратите внимание на директивы **@model** и **@connection**.

Эти директивы – часть инструмента [GraphQL Transform](https://aws-amplify.github.io/docs/cli/graphql) встроенного в Amplify CLI. GraphQL Transform обработает схему вместе с директивами и превратит в полнофункциональное API.

Если бы мы делали собственную GraphQL API, нам бы пришлось все делать вручную:
1. Объявить schema.
2. Определить операции со schema (запросы, мутации и подписки).
3. Создать источник данных.
4. Написать резолверы, которые свяжут источники данных и операции schema.

С помощью директивы **@model**, инструмент GraphQL Transform автоматически сгенерирует операции schema, резолверы и источники данных. Всё, что нужно сделать - это объявить базовую схему (шаг 1). Директива **@connection** позволяет смоделировать отношения между моделями и сгенерировать подходящие резолверы.

В нашей схеме мы используем **@connection** чтобы обозначить связь между Restaurant и Reviews. Это создаст уникальные идентификаторы для отзывов и ресторанов в сгенерированной schema.

Теперь, после того как мы создали базовую схему, самое время опубликовать её и создать API.

```shell script
amplify push
```

```shell script
? Do you want to generate code for your newly created GraphQL API Yes
? Choose the code generation language target javascript
? Enter the file name pattern of graphql queries, mutations and subscriptions src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested] 2
```

Обычно нам бы пришлось с нуля писать все GraphQL запросы, мутации и подписки. Вместо этого, CLI проинспектирует созданную нами схему, сгенерирует код и сохранит локально для будущего использования.

После завершения, back-end готов и мы можем подключиться к нему из нашего React приложения.

Если хотите взглянуть на AppSync API из консоли AWS, зайдите в https://console.aws.amazon.com/appsync и нажмите на ваш API. На панели управления можно увидеть схему, источники данных и резолверы. Вы можете выполнять запросы и мутации используя встроенный редактор GraphQL.

## Создание React клиента

После того как API создано, можно запрашивать и передавать данные. Мы будем использовать 3 операции для взаимодействия с API:

1. Создание нового ресторана.
2. Получение списка ресторанов и отзывов.
3. Создание отзыва для ресторана.

Перед тем как начать создавать приложение, давайте взглянем на то, как эти операции выглядят и работают.

### Взаимодействие с AppSync GraphQL API

Для работы с GraphQL API доступно множество клиентов.

Для взаимодействия с AppSync GraphQL API можно использовать любой GraphQL клиент, включая встроенный в Gatsby. Но есть два из них, которые уже настроены для удобной работы. Среди них Amplify (его мы и будем использовать) и [AWS AppSync JS SDK](https://github.com/awslabs/aws-mobile-appsync-sdk-js) (чем-то похож на Apollo). 

Клиент Amplify интуитивно понятен, так как похож на fetch и базируется на promise. Он не поддерживает offline режим. В то время как AppSync SDK гораздо сложнее, но зато из коробки поддерживает режим offline.

Пример **запроса** к AppSync API с помощью Amplify: 

```jsx
import { API, graphqlOperation } from 'aws-amplify'
import * as queries from './graphql/queries'

const data = await API.graphql(graphqlOperation(queries.listRestaurants))
``` 

Запросы в AppSync данные не меняют. Пример – "получить список ресторанов" или "получить список отзывов". **Мутации** же, напротив, данные изменяют. Например, "создать ресторан" или "удалить отзыв". Поэтому в отличии от запросов, в мутациях требуется указывать второй аргумент.

```jsx
import { API, graphqlOperation } from 'aws-amplify'
import * as mutations from './graphql/mutations'

const restaurant = { name: "SOHO", city: "Saratov" }
const data = await API.graphql(graphqlOperation(
  mutations.createRestaurant,
  { input: restaurant }
))
```  

Мы используем метод **graphql** из категории API для вызова операции и оборачиваем это в **graphqlOperation**, который парсит строки GraphQL в стандартный GraphQL AST.

Мы будем использовать категорию API для всех GraphQL операций в этом приложении.

### Настройка приложения React и Amplify

Первое, что мы должны сделать в нашем приложении – это настроить учетные данные Amplify. Когда мы опубликовали API, CLI создал новый файл под названием **aws-exports.js** в директории **src**.

Этот файл создается и обновляется самим CLI по мере того, как мы создаем, обновляем или удаляем сервисы. Этот файл мы будем использовать чтобы настроить React приложение и дать реакту знать о сервисах.

Чтобы настроить приложение, откройте файл [gatsby-browser.js](https://github.com/r007/appsync-restaurant-reviews/blob/master/gatsby-browser.js) и добавьте следующий код:

```jsx
import React from 'react';
import Amplify from 'aws-amplify';
import { ThemeProvider } from 'styled-components';
import { NavContextProvider } from './src/context/NavContext';

// Import API key so that we could use AppSync
import config from './src/aws-exports';

Amplify.configure(config);

const theme = {};

export const wrapRootElement = ({ element }) => (
  <NavContextProvider>
    <ThemeProvider theme={theme}>{element}</ThemeProvider>
  </NavContextProvider>
);
```

**NavContextProvider** - вспомогательный компонент, нужен для того, чтобы управлять состоянием боковой панели, в нужный момент показывать или прятать её. Также с его помощью мы можем показывать или скрывать уведомления.

```jsx
import React, { useReducer } from 'react';

const NavContext = React.createContext({
  toastrIsOpen: false,
  createRestaurantIsOpen: false
});

const reducer = (state, action) => {
  switch (action.type) {
    case 'open':
      return { ...state, [action.nav]: true };
    case 'close':
      return { ...state, [action.nav]: false };
    default:
      return { ...state, [action.nav]: !state[action.nav] };
  }
};

export const NavContextProvider = ({ children }) => {
  const [{ toastrIsOpen, createRestaurantIsOpen }, dispatch] = useReducer(reducer, {
    toastrIsOpen: false,
    createRestaurantIsOpen: false
  });

  const toggleNavState = (nav, type) => {
    dispatch({ nav, type });
  };

  return (
    <NavContext.Provider
      value={{
        toastrIsOpen,
        createRestaurantIsOpen,
        toggleNavState
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export default NavContext;
```

Далее, мы создадим все необходимые файлы. Структура проекта будет такая:

- **src**
    1. ***layouts***
        - layout.js
    2. ***components***
        - Restaurants.js
        - Toastr.js
        - CreateRestaurant.js
        - CreateReviewForm.js
        - seo.js
    3. ***context***
        - NavContext.js
    4. ***pages***
        - index.js
        - restaurant.js

## Создание компонентов

Перейдем к созданию шаблона приложения, он будет служить скелетом нашего приложения. Чтобы не копировать элементы сайта со страницы на страницу, я вынесу боковую и навигационную панель в отдельный файл. Откроем **src/layouts/layout.js** и добавим следующий код.

```jsx
import React, { useContext } from 'react';
import { Link as GatsbyLink } from 'gatsby';
import styled from 'styled-components';
import { Box, Button, Heading, Grommet, Collapsible } from 'grommet';
import { Add } from 'grommet-icons';
import { grommet } from 'grommet/themes';

import NavContext from '../context/NavContext';
import CreateRestaurant from '../components/CreateRestaurant';
import Toastr from '../components/Toastr';

const Link = styled(GatsbyLink)`
  text-decoration: none;
`;

const Layout = ({ children }) => {
  const { createRestaurantIsOpen, toggleNavState } = useContext(NavContext);

  const onClose = () => {
    toggleNavState('createRestaurantIsOpen');
  };

  return (
    <Grommet full theme={grommet}>
      <Box
        as="header"
        direction="row"
        align="center"
        pad={{ vertical: 'small', horizontal: 'medium' }}
        justify="between"
        background="neutral-3"
        elevation="large"
        style={{ zIndex: '1000' }}
      >
        <Link to="/">
          <Heading level={3} margin="none" color="white">
            <strong>Обзор ресторанов</strong>
          </Heading>
        </Link>
        <Button onClick={onClose} icon={<Add color="white" />} />
      </Box>
      <Box pad="medium" flex direction="row">
        {children}
        <Collapsible direction="horizontal" open={createRestaurantIsOpen}>
          <CreateRestaurant />
        </Collapsible>
      </Box>
      <Toastr />
    </Grommet>
  );
};

export default Layout;
```

После того, как мы создали шаблон **layout**, два компонента пока ещё отсутствуют. Это боковая форма добавления ресторана и уведомление. В форме добавления я бы мог использовать **Formik** для проверки полей и вывода ошибок на экран. Но для простоты ограничимся проверкой события ```onChange``` и последующим сохранением значения в state.

Давайте же откроем файл **src/components/CreateRestaurant.js** и создадим компонент.  

```jsx
import React, { useContext, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Box, Button, Heading, FormField, TextInput, Layer } from 'grommet';
import { Close } from 'grommet-icons';
import * as mutations from '../graphql/mutations';
import NavContext from '../context/NavContext';

const CreateRestaurant = () => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [photo, setPhoto] = useState('');

  // Is sidebar open? Control the nav state
  const { createRestaurantIsOpen, toggleNavState } = useContext(NavContext);

  const createRestaurantHandler = async restaurant => {
    try {
      await API.graphql(graphqlOperation(mutations.createRestaurant, { input: restaurant }));
    } catch (err) {
      console.log('error creating restaurant: ', err);
    }
  };

  const toggleNav = () => {
    toggleNavState('createRestaurantIsOpen');
  };

  /**
   * Clear all the fields
   */
  const resetForm = () => {
    setName('');
    setCity('');
    setPhoto('');
  };

  const handleSubmit = event => {
    event.preventDefault();

    try {
      createRestaurantHandler({ name, city, photo });
      resetForm();
      toggleNav();
      toggleNavState('toastrIsOpen', 'open');
    } catch (err) {
      console.log('error submitting form: ', err);
    }
  };

  return (
    createRestaurantIsOpen && (
      <Layer position="right" full="vertical" modal onClickOutside={toggleNav} onEsc={toggleNav}>
        <Box
          as="form"
          fill="vertical"
          overflow="auto"
          width="medium"
          pad="medium"
          onSubmit={handleSubmit}
        >
          <Box flex={false} direction="row" justify="between">
            <Heading level={3} margin="none">
              Добавить ресторан
            </Heading>
            <Button icon={<Close />} onClick={toggleNav} />
          </Box>
          <Box flex="grow" overflow="auto" pad={{ vertical: 'medium' }}>
            <FormField label="Название кафе/ресторана">
              <TextInput
                name="name"
                onChange={value => setName(value.target.value)}
                value={name}
                required
              />
            </FormField>
            <FormField label="Город">
              <TextInput
                name="city"
                onChange={value => setCity(value.target.value)}
                value={city}
                required
              />
            </FormField>
            <FormField label="Фотография">
              <TextInput
                name="photo"
                onChange={value => setPhoto(value.target.value)}
                value={photo}
                required
              />
            </FormField>
          </Box>
          <Box flex={false} as="footer" align="start">
            <Button type="submit" label="Отправить" primary />
          </Box>
        </Box>
      </Layer>
    )
  );
};

export default CreateRestaurant;
``` 

Как мы видим, внутри блока ```try {...} catch(err) {}```, если добавление завершается успешно, тогда вызывается функция **toggleNavState('toastrIsOpen', 'open');** которая покажет уведомление об успешном добавлении ресторана. 

Далее, добавляем уведомление. Открываем файл **src/components/Toastr.js**:

```jsx
import React, { useContext } from 'react';
import { Layer, Box, Button, Text } from 'grommet';
import { FormClose, StatusGood } from 'grommet-icons';
import NavContext from '../context/NavContext';

const Toastr = () => {
  const { toastrIsOpen, toggleNavState } = useContext(NavContext);

  const closeHandler = () => {
    toggleNavState('toastrIsOpen', 'close');
  };

  return (
    toastrIsOpen && (
      <Layer
        position="bottom"
        modal={false}
        margin={{ vertical: 'medium', horizontal: 'small' }}
        onEsc={closeHandler}
        responsive={false}
        plain
      >
        <Box
          align="center"
          direction="row"
          gap="small"
          justify="between"
          round="medium"
          elevation="medium"
          pad={{ vertical: 'xsmall', horizontal: 'small' }}
          background="status-ok"
        >
          <Box align="center" direction="row" gap="xsmall">
            <StatusGood />
            <Text>Новый ресторан был успешно добавлен</Text>
          </Box>
          <Button icon={<FormClose />} onClick={closeHandler} plain />
        </Box>
      </Layer>
    )
  );
};

export default Toastr;
```

Всё. Скелет нашего приложения готов, осталось лишь добавить главную страницу и страницу ресторана.

**Gatsby** достаточно умен, чтобы на лету по имени файла создать нужный роутинг. Раньше это приходилось делать вручную, используя react-router. Откроем файл **src/pages/index.js**.

```jsx
import React from 'react';

import Layout from '../layouts/layout';
import SEO from '../components/seo';
import Restaurants from '../components/Restaurants';

const HomePage = () => (
  <Layout>
    <SEO title="Главная страница" />
    <Restaurants />
  </Layout>
);

export default HomePage;
```

Компонент SEO уже есть по умолчанию в шаблоне Gatsby. Благодаря ему, мы можем легко менять название страницы и добавлять meta-теги.

Компонент Restaurant же получает данные при первой загрузке, записывает в их в некое начальное состояние **restaurants** и затем отображает в цикле. Одиночный вызов обеспечивается функцией ```useEffect({...}, [])```, что практически является эквивалентом **componentDidMount**.

Откроем файл **src/components/Restaurants.js** для редактирования и добавим следующий код:

```jsx
import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { Box, Grid, Image, Heading, Paragraph, ResponsiveContext } from 'grommet';

import * as queries from '../graphql/queries';

const GatsbyLink = styled(Link)`
  color: #00739d;
  text-decoration: none;
`;

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  // Fetch the data once the component is loaded
  useEffect(() => {
    async function fetchRestaurantsAPI() {
      try {
        const rdata = await API.graphql(graphqlOperation(queries.listRestaurants));
        const {
          data: {
            listRestaurants: { items }
          }
        } = rdata;
        console.log('items: ', items);
        setRestaurants(items);
      } catch (err) {
        console.log('error: ', err);
      }
    }

    fetchRestaurantsAPI();
  }, []);

  // Display the message if no restaurants are available
  let output = (
    <Box flex align="center" justify="center">
      Создайте ваш первый ресторан, нажав +
    </Box>
  );

  if (restaurants.length !== Number(0)) {
    output = restaurants.map((r, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <Box gap="medium" key={i}>
        <Box height="small" border>
          <Image src={r.photo} fit="cover" />
        </Box>

        <div>
          <GatsbyLink to={`/restaurant/${r.id}`} state={{ restaurant: r }}>
            <Heading level={3} margin="none">
              {r.name}
            </Heading>
          </GatsbyLink>
          <Paragraph>{r.city}</Paragraph>
        </div>
      </Box>
    ));
  }

  return (
    <ResponsiveContext.Consumer>
      {size => (
        <Grid
          columns={{
            count: size === 'small' ? 2 : 3,
            size: 'auto'
          }}
          gap="small"
          style={{ maxWidth: '1280px', margin: '25px auto' }}
        >
          {output}
        </Grid>
      )}
    </ResponsiveContext.Consumer>
  );
};

export default Restaurants;
```

Всё! Главная страница готова.

После нажатия по ссылке должен происходить переход на страницу ресторана **/restaurant/идентификатор** с отображением ресторана и всех отзывов. Но как же сообщить Gatsby, какой обработчик использовать? Ведь страницы создаются динамически! Мы можем просто поручить обработку любых страниц начинающихся с /restaurant самой странице restaurant.js.

Для этого изменим функцию ```onCreatePage``` в файле **gatsby-node.js**.

```jsx
// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/restaurant/)) {
    page.matchPath = '/restaurant/*';

    // Update the page.
    createPage(page);
  }
};
```  

После этих манипуляций, мы получили полностью рабочую страницу restaurant. Осталось только передать ID ресторана. Но как? Я использовал ```location.state```, что конечно же не совсем правильно. Так как предполагается, что пользователь попадает на эту страницу с главной. А это не дружелюблю к поисковикам, если человек сразу зайдет на страницу ресторана, **state** будет пустым.

Лучше было вычленять ID из самого URL'а, это несколько надежнее. Добавим код в файл **src/pages/restaurant.js**.

```jsx
import React, { useEffect, useState } from 'react';
import { Box, Heading, Grid, Image, Paragraph } from 'grommet';
import Rating from 'react-rating';
import { API, graphqlOperation } from 'aws-amplify';

import { Star } from 'grommet-icons';
import * as queries from '../graphql/queries';
import Layout from '../layouts/layout';
import SEO from '../components/seo';
import CreateReviewForm from '../components/CreateReviewForm';

const RestaurantPage = ({ location }) => {
  const [restaurant, setRestaurant] = useState({});
  const [reviews, setReviews] = useState([]);

  // Fetch the data once the component is loaded
  useEffect(() => {
    async function fetchRestaurantAPI(r) {
      try {
        const rdata = await API.graphql(graphqlOperation(queries.getRestaurant, { id: r.id }));
        const {
          data: { getRestaurant }
        } = rdata;
        setRestaurant(getRestaurant);
        setReviews(getRestaurant.reviews.items);
      } catch (err) {
        console.log('error: ', err);
      }
    }

    if (location.state.restaurant) {
      fetchRestaurantAPI(location.state.restaurant);
    }
  }, []);

  const reviewsList = reviews.map((r, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <Box key={i} background="light-2" pad="medium" round="small">
      <Rating
        fullSymbol={<Star color="#ffc95e" />}
        emptySymbol={<Star color="#cccccc" />}
        initialRating={r.rating}
        readonly
      />
      <Paragraph fill>{r.text}</Paragraph>
    </Box>
  ));

  return (
    <Layout>
      <SEO title="Страница ресторана" />
      <Box style={{ maxWidth: '1280px', margin: '25px auto' }}>
        {restaurant.name && (
          <>
            <Heading level={1} margin="none">
              {restaurant.name}
            </Heading>
            <Paragraph>{restaurant.city}</Paragraph>
            <Box height="medium" border>
              <Image src={restaurant.photo} fit="cover" />
            </Box>
          </>
        )}

        {reviewsList.length !== Number(0) && (
          <Grid gap="small">
            <Heading level={2}>Отзывы ({reviewsList.length}):</Heading>
            {reviewsList}
          </Grid>
        )}

        {restaurant.id && <CreateReviewForm setReviews={setReviews} id={restaurant.id} />}
      </Box>
    </Layout>
  );
};

export default RestaurantPage;
```

Осталось лишь добавить форму отзывов. Здесь всё похоже на предыдущую форму, но особенность в том, что я передаю из родительского компонента **setReviews** как props. Таким образом, после отправки отзыв сразу же появляется в UI.

Другая особенность – при вызове мутации **createReview** требуется указывать идентификатор ресторана, к которому принадлежит этот отзыв. В итоге, переменная собирается вручную таким вот образом:

```jsx
const input = { reviewRestaurantId: id, text, rating };
```

Последний компонент, открываем файл **src/components/CreateReviewForm.js** и добавляем код.

```jsx
import React, { useState } from 'react';
import { Box, Button, FormField, Heading, TextArea } from 'grommet';
import Rating from 'react-rating';
import { Edit, Star } from 'grommet-icons';
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../graphql/mutations';

const CreateReviewForm = ({ setReviews, id }) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);

  const createReview = async input => {
    try {
      console.log(input);
      await API.graphql(graphqlOperation(mutations.createReview, { input }));
    } catch (err) {
      console.log('error creating review: ', err);
    }
  };

  /**
   * Clear all the fields
   */
  const resetForm = () => {
    setText('');
    setRating(0);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (text === '' || rating === Number(0)) return;

    try {
      const input = { reviewRestaurantId: id, text, rating };
      createReview(input);
      // Update the UI
      setReviews(oldReviews => [...oldReviews, input]);
      resetForm();
    } catch (err) {
      console.log('error submitting form: ', err);
    }
  };

  return (
    <Box pad={{ vertical: 'medium' }} as="form" onSubmit={handleSubmit}>
      <Heading level={3}>Добавить отзыв</Heading>
      <Box>
        <Rating
          id="rating"
          fullSymbol={<Star color="#ffc95e" />}
          emptySymbol={<Star color="#cccccc" />}
          onChange={value => setRating(value)}
          initialRating={rating}
        />
        <FormField label="Текст отзыва">
          <TextArea
            name="text"
            onChange={value => setText(value.target.value)}
            value={text}
            required
          />
        </FormField>
      </Box>
      <Box flex={false} as="footer">
        <Button primary type="submit" icon={<Edit />} label="Отправить отзыв" />
      </Box>
    </Box>
  );
};

export default CreateReviewForm;
```

## Запуск приложения

Ура! Приложение написано, можно его запускать. Сделать это можно двумя способами – либо набрав

```shell script
gatsby develop
```

И тогда откроется страница [http://localhost:8000](http://localhost:8000), либо можно предварительно скомпилировав приложение в статические файлы, а затем запустить.

```shell script
gatsby build
gatsby start
```

Первый вариант используется при разработке, а второй когда публикуете свой сайт.

## Заключение

Я ещё о многом не написал, есть масса вариантов как можно улучшить приложение. Можно добавить авторизацию, чтобы только авторизованные пользователи могли добавлять отзывы. Подробнее можно почитать в [официальной документации](https://docs.aws.amazon.com/en_pv/appsync/latest/devguide/security.html).

Можно интегрировать приложение с AWS S3, чтобы была возможность загружать фотографии на хостинг. Можно улучшить интерфейс, высчитывать общий рейтинг и многое-многое другое.

Об этом поговорим в моих будущих статьях.
