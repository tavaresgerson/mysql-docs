### 12.14.2 Escolher um ID de Colagem

Cada colagem deve ter um ID único. Para adicionar uma colagem, você deve escolher um valor de ID que não esteja sendo usado atualmente. O MySQL suporta IDs de colagem de dois bytes. A faixa de IDs de 1024 a 2047 está reservada para colagens definidas pelo usuário.

O ID de colagem que você escolher aparecerá nesses contextos:

* A coluna `ID` da tabela `COLLATIONS` do Schema de Informações.

* A coluna `Id` da saída `SHOW COLLATION`.

* O membro `charsetnr` da estrutura de dados C API `MYSQL_FIELD`.

* O membro `number` da estrutura de dados `MY_CHARSET_INFO` retornada pela função C API `mysql_get_character_set_info()`.

Para determinar o ID mais usado atualmente, execute a seguinte declaração:

```
mysql> SELECT MAX(ID) FROM INFORMATION_SCHEMA.COLLATIONS;
+---------+
| MAX(ID) |
+---------+
|     247 |
+---------+
```

Para exibir uma lista de todos os IDs atualmente usados, execute esta declaração:

```
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

Antes de fazer a atualização, você deve salvar os arquivos de configuração que você alterou. Se você fizer a atualização in loco, o processo substituirá os arquivos modificados.