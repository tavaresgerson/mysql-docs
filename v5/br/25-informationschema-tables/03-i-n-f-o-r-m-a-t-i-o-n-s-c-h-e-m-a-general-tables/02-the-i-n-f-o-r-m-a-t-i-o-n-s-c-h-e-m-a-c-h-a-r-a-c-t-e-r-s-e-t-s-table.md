### 24.3.2 A tabela INFORMATION\_SCHEMA CHARACTER\_SETS

A tabela `[CARACTERES_SETS]` (information-schema-character-sets-table.html) fornece informações sobre os conjuntos de caracteres disponíveis.

A tabela [`CHARACTER_SETS`](https://pt.wikipedia.org/wiki/Tabela_de_caracteres_do_esquema_de_informa%C3%A7%C3%A3o) tem essas colunas:

- `CHARACTER_SET_NAME`

  O nome do conjunto de caracteres.

- `DEFAULT_COLLATE_NAME`

  A collation padrão para o conjunto de caracteres.

- `DESCRIÇÃO`

  Uma descrição do conjunto de caracteres.

- `MAXLEN`

  O número máximo de bytes necessários para armazenar um caractere.

#### Notas

As informações sobre o conjunto de caracteres também estão disponíveis na declaração `SHOW CHARACTER SET`. Veja Seção 13.7.5.3, “Declaração SHOW CHARACTER SET”. As seguintes declarações são equivalentes:

```sql
SELECT * FROM INFORMATION_SCHEMA.CHARACTER_SETS
  [WHERE CHARACTER_SET_NAME LIKE 'wild']

SHOW CHARACTER SET
  [LIKE 'wild']
```
