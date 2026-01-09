### 24.3.3 A tabela INFORMATION_SCHEMA COLLATIONS

A tabela `COLLATIONS` fornece informações sobre as colligações para cada conjunto de caracteres.

A tabela `COLLATIONS` tem essas colunas:

- `COLLATION_NAME`

  O nome da agregação.

- `CHARACTER_SET_NAME`

  O nome do conjunto de caracteres com o qual a ordenação está associada.

- `ID`

  O ID de agregação.

- `IS_DEFAULT`

  Se a ordenação é a opção padrão para o conjunto de caracteres.

- `IS_COMPILED`

  Se o conjunto de caracteres é compilado no servidor.

- `SORTLEN`

  Isso está relacionado à quantidade de memória necessária para ordenar cadeias de caracteres expressas no conjunto de caracteres.

#### Notas

Informações sobre a collation também estão disponíveis na instrução `SHOW COLLATION`. Veja Seção 13.7.5.4, “Instrução SHOW COLLATION”. As seguintes instruções são equivalentes:

```sql
SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLLATIONS
  [WHERE COLLATION_NAME LIKE 'wild']

SHOW COLLATION
  [LIKE 'wild']
```
