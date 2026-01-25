### 10.14.2 Escolhendo um ID de Collation

Cada collation deve ter um ID exclusivo. Para adicionar uma collation, você deve escolher um valor de ID que não esteja sendo usado atualmente. O MySQL suporta IDs de collation de dois bytes. O intervalo de IDs de 1024 a 2047 é reservado para collations definidas pelo usuário.

O ID de collation que você escolher aparece nestes contextos:

* A coluna `ID` da tabela `COLLATIONS` do Information Schema.

* A coluna `Id` da saída de `SHOW COLLATION`.

* O membro `charsetnr` da estrutura de dados `MYSQL_FIELD` da C API.

* O membro `number` da estrutura de dados `MY_CHARSET_INFO` retornada pela função C API `mysql_get_character_set_info()`.

Para determinar o maior ID atualmente em uso, execute a seguinte instrução:

```sql
mysql> SELECT MAX(ID) FROM INFORMATION_SCHEMA.COLLATIONS;
+---------+
| MAX(ID) |
+---------+
|     247 |
+---------+
```

Para exibir uma lista de todos os IDs atualmente em uso, execute esta instrução:

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

Antes de fazer o upgrade, você deve salvar os arquivos de configuração que alterar. Se você fizer o upgrade no local (in place), o processo substituirá os arquivos modificados.