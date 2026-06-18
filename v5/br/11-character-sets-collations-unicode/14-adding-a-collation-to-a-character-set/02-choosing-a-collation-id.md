### 10.14.2 Escolhendo um ID de Collation

Toda Collation deve ter um ID exclusivo. Para adicionar uma Collation, você deve escolher um valor de ID que não esteja em uso atualmente. O MySQL suporta IDs de Collation de dois bytes. O intervalo de IDs de 1024 a 2047 é reservado para collations definidas pelo usuário.

O ID de Collation que você escolhe aparece nestes contextos:

* A coluna `ID` da tabela `COLLATIONS` do Information Schema.

* A coluna `Id` na saída do `SHOW COLLATION`.

* O membro `charsetnr` da estrutura de dados `MYSQL_FIELD` da C API.

* O membro `number` da estrutura de dados `MY_CHARSET_INFO` retornada pela função `mysql_get_character_set_info()` da C API.

Para determinar o maior ID em uso atualmente, execute a seguinte instrução:

```sql
mysql> SELECT MAX(ID) FROM INFORMATION_SCHEMA.COLLATIONS;
+---------+
| MAX(ID) |
+---------+
|     247 |
+---------+
```

Para exibir uma lista de todos os IDs em uso atualmente, execute esta instrução:

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

Antes de fazer um upgrade, você deve salvar os arquivos de configuração que você alterar. Se você fizer o upgrade no local (in place), o processo substituirá os arquivos modificados.