# Action для соединения YouTrack Issue и Github PR
## Описание бота
Бот срабатывает на экшен хук pull request с типами: opened, closed, reopened.
1. сперва бот определяет id youtrack задачи вида ```PROJECT_NAME-TASK_ID``` из названия pull request-а.
2. Затем по этому id получает информацию о youtrack задаче
3. В найденой youtrack задаче, в ее списке используемых полей получает значения поля, которое имеет название "Pull Requests"
4. Затем выполняет соответствующие действия в зависимости от типа pull request-а и статуса ```merged```:
  - **opened** 
    - добавляет в текущий открытый pull request комментарий с адресом на youtrack задачу 
    - <details>
           <summary>создает новое значение для Pull Requests поля, добавляя в его старое значение ссылку на pull request с checkbox значением false</summary>
           <ul>
            <li>если значение поля пустое, то создает новое значение: - [ ]{pull request link}\n</li>
            <li>если значение поля не пустое, и содержит в себе ссылку на pull request, то пробрасывает ошибку с соответствующим сообщением</li>
            <li>если значение поля не пустое и имеет в конце перенос строки (\n), то создает новое значение: {предыдущее значение поля}- [ ]{pull request link}\n</li>
            <li>если значение поля не пустое и не имеет в конце перенос строки (\n), то создает новое значение: {предыдущее значение поля}\n- [ ]{pull request link}\n</li>
           </ul>
       </details>
    - обновляет в youtrack задаче значение кастомного поля на новое
  - **reopened**
    - <details>
           <summary>создает новое значение для Pull Requests поля, заменяя в его старом значении зачеркнутую ссылку с pull request-ом на pull request с checkbox значением false</summary>
           <ul>
            <li>если значение поля пустое, то создает новое значение: - [ ]{pull request link}\n</li>
            <li>если значение поля не пустое и не содержит в себе ссылку на pull request, то создает новое значение: {предыдущее значение поля}- [ ]{pull request link}\n</li>
            <li>если значение поля не пустое, и содержит в себе ссылку на pull request, то заменяет ~~{pull request link}~~ на - [ ]                {pull request link}</li>
           </ul>
       </details>
 - **closed** 
    - **merged**
      - <details>
           <summary>создает новое значение для Pull Requests поля, устанавливая в старое значение галку в чекбокс ссылки на pull request</summary>
           <ul>
            <li>если значение поля пустое, то создает новое значение: - [x]{pull request link}\n</li>
            <li>если значение поля не пустое и не содержит в себе ссылку на pull request, то создает новое значение: {предыдущее значение поля}- [x]{pull request link}\n</li>
            <li>если значение поля не пустое и содержит в себе ссылку на pull request, то заменяет - [ ]{pull request link} на - [x]{pull request link}</li>
           </ul>
         </details>
    - **!merged**
      - <details>
           <summary>создает новое значение для Pull Requests поля, зачеркивая в старом значении ссылку на pull request</summary>
           <ul>
            <li>если значение поля пустое, то пробрасывает ошибку с соответствующим сообщением</li>
            <li>если значение поля не пустое и не содержит в себе ссылку на pull request, то пробрасывает ошибку с соответствующим сообщением</li>
            <li>если значение поля не пустое и содержит в себе ссылку на pull request, то заменяет - [ ]{pull request link} на ~~{pull request link}~~</li>
           </ul>
         </details>

5. обновляет в youtrack задаче значение кастомного поля на новое
## Применение
1. Добавляем в репо .github/workflows/main.yml

```yaml
name: CI

on:
  pull_request:
    types: [opened, closed, reopened, edited]

jobs:
  build:

    runs-on: ubuntu-latest
    
    steps:
    - uses: smenateam/youtrack-issue-action@releases/v3
      with:
        youtrack_url: базовый url для youtrack
        youtrack_token: ${{ secrets.youtrack_token }}
        repo_token: ${{ secrets.repo_token }}
```
2. Добавляем в репо два секрета [Добавление секрета](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables):
    - youtrack_token - [Получение токена](https://www.jetbrains.com/help/youtrack/incloud/Manage-Permanent-Token.html)
    - repo_token - токен GitHub c правами для комментирования PR
3. Для youtrack проекта нужно добавить кастомное поле с именем "Pull Requests", в которое будет логироваться статус pull request-а, так же это поле должно быть строкового типа. Ссылка на документацию(https://www.jetbrains.com/help/youtrack/standalone/Custom-Fields.html)
