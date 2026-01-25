### 5.6.2 Obtendo Informações Sobre Funções Carregáveis

A tabela de sistema `mysql.func` mostra quais funções carregáveis foram registradas usando o comando [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement"):

```sql
SELECT * FROM mysql.func;
```

A tabela `func` possui estas colunas:

* `name`

  O nome da FUNCTION conforme referenciado nos comandos SQL.

* `ret`

  O tipo do valor de retorno da FUNCTION. Os valores permitidos são 0 (`STRING`), 1 (`REAL`), 2 (`INTEGER`), 3 (`ROW`) ou 4 (`DECIMAL`).

* `dl`

  O nome do arquivo da biblioteca da FUNCTION contendo o código executável da FUNCTION. O arquivo está localizado no diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir).

* `type`

  O tipo da FUNCTION, sendo `function` (escalar) ou `aggregate`.