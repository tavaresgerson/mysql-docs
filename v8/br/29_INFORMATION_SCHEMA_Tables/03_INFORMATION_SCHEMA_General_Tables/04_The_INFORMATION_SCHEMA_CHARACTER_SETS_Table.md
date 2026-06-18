### 28.3.4 A tabela INFORMATION\_SCHEMA CHARACTER\_SETS

A tabela `CHARACTER_SETS` fornece informações sobre os conjuntos de caracteres disponíveis.

A tabela `CHARACTER_SETS` tem essas colunas:

- `CHARACTER_SET_NAME`

  O nome do conjunto de caracteres.

- `DEFAULT_COLLATE_NAME`

  A collation padrão para o conjunto de caracteres.

- `DESCRIPTION`

  Uma descrição do conjunto de caracteres.

- `MAXLEN`

  O número máximo de bytes necessários para armazenar um caractere.

#### Notas

As informações sobre o conjunto de caracteres também estão disponíveis na declaração `SHOW CHARACTER SET`. Veja a Seção 15.7.7.3, “Declaração SHOW CHARACTER SET”. As seguintes declarações são equivalentes:

```
SELECT * FROM INFORMATION_SCHEMA.CHARACTER_SETS
  [WHERE CHARACTER_SET_NAME LIKE 'wild']

SHOW CHARACTER SET
  [LIKE 'wild']
```
