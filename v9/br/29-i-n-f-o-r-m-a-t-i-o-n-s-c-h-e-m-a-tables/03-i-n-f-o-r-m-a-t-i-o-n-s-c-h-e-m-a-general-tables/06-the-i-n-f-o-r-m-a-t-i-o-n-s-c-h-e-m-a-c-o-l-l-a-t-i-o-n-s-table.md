### 28.3.6 A Tabela INFORMATION_SCHEMA COLLATIONS

A tabela `COLLATIONS` fornece informações sobre as colligações para cada conjunto de caracteres.

A tabela `COLLATIONS` tem as seguintes colunas:

* `COLLATION_NAME`

  O nome da colligação.

* `CHARACTER_SET_NAME`

  O nome do conjunto de caracteres com o qual a colligação está associada.

* `ID`

  O ID da colligação.

* `IS_DEFAULT`

  Se a colligação é a padrão para seu conjunto de caracteres.

* `IS_COMPILED`

  Se o conjunto de caracteres está compilado no servidor.

* `SORTLEN`

  Isso está relacionado à quantidade de memória necessária para ordenar strings expressas no conjunto de caracteres.

* `PAD_ATTRIBUTE`

  O atributo de padronização da colligação, que pode ser `NO PAD` ou `PAD SPACE`. Esse atributo afeta se espaços finais são significativos em comparações de strings; veja Gerenciamento de Espaços Finais em Comparativos.

#### Notas

As informações sobre colligações também estão disponíveis a partir da instrução `SHOW COLLATION`. Veja a Seção 15.7.7.5, “Instrução SHOW COLLATION”. As seguintes instruções são equivalentes:

```
SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLLATIONS
  [WHERE COLLATION_NAME LIKE 'wild']

SHOW COLLATION
  [LIKE 'wild']
```