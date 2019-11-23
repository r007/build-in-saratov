---
layout: post
title: useContext() – крайне полезный React хук
author: Сергей Монин
date: 2019-09-20T22:03:04+00:00
image: logo-og.png
draft: false
tags: 
  - React
---

Если вы ещё не слышали, React хуки открывают совершенно новый способ написания компонентов. Конечно, это серьезное изменение, но вместе с тем люди задают вопрос "действительно ли нам так нужны хуки?"

В этой статье я постараюсь ответить на более простой вопрос: есть ли ситуации в которых хуки *очевидно лучше?* Мой ответ *да* и я думаю вы согласитесь с тем, что хуки улучшают читабельность, когда я покажу пример использования ```useContext```.

## Context 😕

С самого создания React'а, одной из наименее приятных вещей была передача данных через множество уровней по дереву компонентов. Вначале, это можно было сделать только вручную, передавая props через каждый уровень от родителя к дочернему компоненту (так называемый *prop drilling*). Очевидно, это было громоздко и команда React'а подарила нам экспериментальный Context API для работы, до того как выпустили официальную версию Context API. Но дело в том, что даже официальная версия имеет свои тонкости.

После получения данных от Context'а, обычно вы захотите использовать эти данные внутри функции-рендера, как в примере ниже:

```jsx
import React from 'react'

const CurrentRoute = React.createContext({ path: '/dashboard' })

export default function App() {
  return (
    <CurrentRoute.Consumer>
      {currentRoute => 
        currentRoute.path === '/dashboard' &&
        "Добро пожаловать в админку!"
      }
    </CurrentRoute.Consumer>
  )
}
```

В этом примере мы передаем только одну переменную. И честно говоря, код выглядит нормально. Легко понять логику, но представьте на секунду, что вы хотите передать *три* объекта Context'а:

```jsx
import React from 'react'

const CurrentRoute = React.createContext({ path: '/dashboard' })
const CurrentUser = React.createContext({ name: "Сергей" })
const IsStatic = React.createContext(false)

export default function App() {
  return (
    <CurrentRoute.Consumer>
      {currentRoute =>
        <CurrentUser.Consumer>
          {currentUser =>
            <IsStatic.Consumer>
              {isStatic =>
                !isStatic &&
                currentRoute.path === '/dashboard' &&
                (currentUser
                  ? `Добро пожаловать, ${currentUser.name}!`
                  : 'Добро пожаловать!'
                )
              }
            </IsStatic.Consumer>
          }
        </CurrentUser.Consumer>
      }
    </CurrentRoute.Consumer>
  )
}
```  

Хотя второй пример *работает*, он начинает выглядеть громоздко. Как видите, начинает формироваться пирамида из колбэков – чем больше контекстов вы используете, тем хуже становится. Если только вы не используете хук ```useContext```.

## useContext() 😆

Начиная с React 16.8, вы можете использовать ```useContext()```: новый, простой способ использовать данные от нескольких контекстов. Вот как можно упростить вышеприведенный пример:

```jsx
import React, { useContext } from 'react'

const CurrentRoute = React.createContext({ path: '/dashboard' })
const CurrentUser = React.createContext(undefined)
const IsStatic = React.createContext(false)

export default function App() {
  let currentRoute = useContext(CurrentRoute)
  let currentUser = useContext(CurrentUser)
  let isStatic = useContext(IsStatic)

  return (
    !isStatic &&
    currentRoute.path === '/dashboard' &&
    (currentUser
      ? `Добро пожаловать, ${currentUser.name}!`
      : 'Добро пожаловать!'
    )
  )
}
```

Гораздо лучше, не правда ли? Теперь посмотрите на вышеприведенные примеры и представьте, что Context API приходилось использовать годами до появления хуков. Представили? Здорово! Теперь ответьте на вопрос:

**Какой способ более читабелен?**

По-моему, очевидно второй. В 2019-м году, хуки привнесли множество изменений в код. Насколько они будут востребованы? Время покажет. А пока мы можем лишь c уверенностью сказать: *для контекста лучше использовать хуки*. 

Тем временем, если хотите больше узнать о хуках, советую почитать следующие ресурсы:

- [Официальная документация](https://ru.reactjs.org/docs/hooks-intro.html) по хукам. Очень информативная статья, советую всем взглянуть.   
