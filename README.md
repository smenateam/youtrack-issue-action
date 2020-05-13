# Action для соединения YouTrack Issue и Github PR
## Начало использования
1. Добавляем в репо .github/workflows/main.yml

```yaml
name: CI

on:
  pull_request:
    types: [opened]

jobs:
  build:

    runs-on: ubuntu-latest
    
    steps:
    - uses: smenateam/youtrack-issue-action@releases/v2
      with:
        youtrack_url: базовый url для youtrack https://youtrack.harda.ru
        youtrack_token: ${{ secrets.youtrack_token }}
        repo_token: ${{ secrets.repo_token }}
```
2. Добавляем в репо два секрета [Добавление секрета](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables):
    - youtrack_token - [Получение токена](https://www.jetbrains.com/help/youtrack/incloud/Manage-Permanent-Token.html)
    - repo_token - токен GitHub c правами для комментирования PR
