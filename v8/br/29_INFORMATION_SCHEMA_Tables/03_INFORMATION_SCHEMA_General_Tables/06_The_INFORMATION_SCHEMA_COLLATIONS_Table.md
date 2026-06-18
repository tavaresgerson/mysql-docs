### 28.3.6 A tabela INFORMATION\_SCHEMA COLLATIONS

A tabela `COLLATIONS` fornece informações sobre as colatações para cada conjunto de caracteres.

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

- `PAD_ATTRIBUTE`

  O atributo de padronização, `NO PAD` ou `PAD SPACE`. Este atributo afeta se espaços finais são significativos em comparações de strings; veja Gerenciamento de Espaços Finais em Comparações.

#### Notas

Informações sobre a collation também estão disponíveis na declaração `SHOW COLLATION`. Veja a Seção 15.7.7.4, “Declaração SHOW COLLATION”. As seguintes declarações são equivalentes:

```
SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLLATIONS
  [WHERE COLLATION_NAME LIKE 'wild']

SHOW COLLATION
  [LIKE 'wild']
```
