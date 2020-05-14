# Action для соединения YouTrack Issue и Github PR
## Описание бота
Бот срабатывает на экшен хук pull request с типами: opened, closed, reopened.
Сперва бот определяет id youtrack задачи вида ```PROJECT_NAME-TASK_ID``` из названия pull request-а.
Затем выполняет соответствующие действия в зависимости от типа pull request-а и статуса ```merged```:
  - **opened** 
    - добавляет в текущий открытый pull request комментарий с адресом на youtrack задачу 
    - по id youtrack задачи и id ее кастомного поля получает значение этого поля 
    - <details>
           <summary>создает новое значение кастомного поля добавляя в старое ссылку на pull request с checkbox значением false</summary>
           <ul>
            <li>если значение поля пустое, то создает новое значение: - [ ]{pull request link}\n</li>
            <li>если значение поля не пустое, и содержит в себе ссылку на pull request, то пробрасывает ошибку с соответствующим сообщением</li>
            <li>если значение поля не пустое и имеет в конце перенос строки (\n), то создает новое значение: {предыдущее значение поля}- [ ]{pull request link}\n</li>
            <li>если значение поля не пустое и не имеет в конце перенос строки (\n), то создает новое значение: {предыдущее значение поля}\n- [ ]{pull request link}\n</li>
           </ul>
       </details>
    - обновляет в youtrack задаче значение кастомного поля на новое
  - **reopened**
    - по id youtrack задачи и id ее кастомного поля получает значение этого поля 
    - <details>
           <summary>создает новое значение кастомного поля добавляя в старое ссылку на pull request с checkbox значением false</summary>
           <ul>
            <li>если значение поля пустое, то создает новое значение: - [ ]{pull request link}\n</li>
            <li>если значение поля не пустое, и содержит в себе ссылку на pull request, то пробрасывает ошибку с соответствующим сообщением</li>
            <li>если значение поля не пустое и имеет в конце перенос строки (\n), то создает новое значение: {предыдущее значение поля}- [ ]{pull request link}\n</li>
            <li>если значение поля не пустое и не имеет в конце перенос строки (\n), то создает новое значение: {предыдущее значение поля}\n- [ ]{pull request link}\n</li>
           </ul>
       </details>
    - обновляет в youtrack задаче значение кастомного поля на новое
 - **closed** 
    - **merged**
      - по id youtrack задачи и id ее кастомного поля получает значение этого поля 
      - <details>
           <summary>создает новое значение кастомного поля устанавливая в старое галку в чекбоксе ссылки на pull request</summary>
           <ul>
            <li>если значение поля пустое, то добавляет ссылку на pull request с checkbox значением true</li>
            <li>если значение поля не пустое и не содержит в себе ссылку на pull request, то добавляет ссылку на pull request с checkbox значением true </li>
            <li>если значение поля не пустое и содержит в себе ссылку на pull request, то заменяет - [ ]{pull request link} на - [x]{pull request link}</li>
           </ul>
         </details>
      - обновляет в youtrack задаче значение кастомного поля на новое
    - **!merged**
      - по id youtrack задачи и id ее кастомного поля получает значение этого поля  
      - <details>
           <summary>создает новое значение кастомного поля зачеркивая в старом ссылку на pull request</summary>
           <ul>
            <li>если значение поля пустое, то пробрасывает ошибку с соответствующим сообщением</li>
            <li>если значение поля не пустое и не содержит в себе ссылку на pull request, то пробрасывает ошибку с соответствующим сообщением</li>
            <li>если значение поля не пустое и содержит в себе ссылку на pull request, то заменяет - [ ]{pull request link} на ~~{pull request link}~~</li>
           </ul>
         </details>
      - обновляет в youtrack задаче значение кастомного поля на новое
## Применение
1. Добавляем в репо .github/workflows/main.yml

```yaml
name: CI

on:
  pull_request:
    types: [opened, closed, reopened]

jobs:
  build:

    runs-on: ubuntu-latest
    
    steps:
    - uses: smenateam/youtrack-issue-action@releases/v3
      with:
        youtrack_url: базовый url для youtrack
        youtrack_token: ${{ secrets.youtrack_token }}
        repo_token: ${{ secrets.repo_token }}
        youtrack_field_id: youtrack id кастомного поля, в который будет записываться pr
```
2. Добавляем в репо два секрета [Добавление секрета](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables):
    - youtrack_token - [Получение токена](https://www.jetbrains.com/help/youtrack/incloud/Manage-Permanent-Token.html)
    - repo_token - токен GitHub c правами для комментирования PR
    - youtrack_field_id - ?
