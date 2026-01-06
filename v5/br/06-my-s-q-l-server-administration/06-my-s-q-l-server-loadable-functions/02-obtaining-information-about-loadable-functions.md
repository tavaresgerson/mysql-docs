### 5.6.2 Obter informações sobre funções carregáveis

A tabela `mysql.func` do sistema mostra quais funções carregáveis foram registradas usando `CREATE FUNCTION`:

```sql
SELECT * FROM mysql.func;
```

A tabela `func` tem essas colunas:

- `nome`

  O nome da função, conforme mencionado nas declarações SQL.

- `ret`

  O tipo de valor de retorno da função. Os valores permitidos são 0 (`STRING`), 1 (`REAL`), 2 (`INTEGER`), 3 (`ROW`) ou 4 (`DECIMAL`).

- `dl`

  O nome do arquivo da biblioteca de funções que contém o código executável da função. O arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`.

- `tipo`

  O tipo de função, seja `function` (escalar) ou `aggregate`.
