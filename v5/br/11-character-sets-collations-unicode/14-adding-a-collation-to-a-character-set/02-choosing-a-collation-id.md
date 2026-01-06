### 10.14.2 Escolher um ID de collation

Cada combinação de caracteres deve ter um ID único. Para adicionar uma combinação de caracteres, você deve escolher um valor de ID que não esteja sendo usado atualmente. O MySQL suporta IDs de combinação de caracteres de dois bytes. A faixa de IDs de 1024 a 2047 é reservada para combinações de caracteres definidas pelo usuário.

O ID de agregação que você escolher aparecerá nesses contextos:

- A coluna `ID` da tabela do esquema de informações `COLLATIONS`.

- A coluna `Id` da saída `SHOW COLLATION`.

- O membro `charsetnr` da estrutura de dados `MYSQL_FIELD` da API C.

- O membro `number` da estrutura de dados `MY_CHARSET_INFO`, retornado pela função C `mysql_get_character_set_info()`.

Para determinar o ID mais utilizado atualmente, execute a seguinte declaração:

```sql
mysql> SELECT MAX(ID) FROM INFORMATION_SCHEMA.COLLATIONS;
+---------+
| MAX(ID) |
+---------+
|     247 |
+---------+
```

Para exibir uma lista de todos os IDs atualmente usados, execute esta declaração:

```sql
mysql> SELECT ID FROM INFORMATION_SCHEMA.COLLATIONS ORDER BY ID;
+-----+
| ID  |
+-----+
|   1 |
|   2 |
| ... |
|  52 |
|  53 |
|  57 |
|  58 |
| ... |
|  98 |
|  99 |
| 128 |
| 129 |
| ... |
| 247 |
+-----+
```

Aviso

Antes de fazer a atualização, você deve salvar os arquivos de configuração que você alterou. Se você atualizar no local, o processo substituirá os arquivos modificados.
