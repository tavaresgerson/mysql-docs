## 26.2 Usando o Schema sys

Você pode definir o schema `sys` como o schema padrão, de modo que as referências aos seus objetos não precisem ser qualificadas com o nome do schema:

```sql
mysql> USE sys;
Database changed
mysql> SELECT * FROM version;
+-------------+------------------+
| sys_version | mysql_version    |
+-------------+------------------+
| 1.5.1       | 5.7.24-debug-log |
+-------------+------------------+
```

(A view `version` exibe as versões do schema `sys` e do servidor MySQL.)

Para acessar objetos do schema `sys` enquanto um schema diferente é o padrão (ou simplesmente para ser explícito), qualifique as referências de objetos com o nome do schema:

```sql
mysql> SELECT * FROM sys.version;
+-------------+------------------+
| sys_version | mysql_version    |
+-------------+------------------+
| 1.5.1       | 5.7.24-debug-log |
+-------------+------------------+
```

O schema `sys` contém muitas views que resumem as tabelas do Performance Schema de várias maneiras. A maioria dessas views vem em pares, onde um membro do par tem o mesmo nome que o outro membro, mais um prefixo `x$`. Por exemplo, a view `host_summary_by_file_io` resume o File I/O (I/O de arquivo) agrupado por host e exibe latências convertidas de picosegundos para valores mais legíveis (com unidades);

```sql
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+-------+------------+
| host       | ios   | io_latency |
+------------+-------+------------+
| localhost  | 67570 | 5.38 s     |
| background |  3468 | 4.18 s     |
+------------+-------+------------+
```

A view `x$host_summary_by_file_io` resume os mesmos dados, mas exibe latências não formatadas em picosegundos:

```sql
mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+-------+---------------+
| host       | ios   | io_latency    |
+------------+-------+---------------+
| localhost  | 67574 | 5380678125144 |
| background |  3474 | 4758696829416 |
+------------+-------+---------------+
```

A view sem o prefixo `x$` se destina a fornecer uma saída que é mais amigável ao usuário e mais fácil de ler para humanos. A view com o prefixo `x$`, que exibe os mesmos valores em formato bruto (raw form), destina-se mais ao uso com outras ferramentas que realizam seu próprio processamento nos dados. Para informações adicionais sobre as diferenças entre views non-`x$` e `x$`, consulte a Seção 26.4.3, “Views do Schema sys”.

Para examinar as definições de objeto do schema `sys`, use a instrução `SHOW` apropriada ou uma Query no `INFORMATION_SCHEMA`. Por exemplo, para examinar as definições da view `session` e da Function `format_bytes()`, utilize estas instruções:

```sql
mysql> SHOW CREATE VIEW sys.session;
mysql> SHOW CREATE FUNCTION sys.format_bytes;
```

No entanto, essas instruções exibem as definições em um formato relativamente não formatado. Para visualizar as definições de objeto com formatação mais legível, acesse os arquivos `.sql` individuais encontrados em `scripts/sys_schema` nas distribuições de código-fonte (source distributions) do MySQL. Antes do MySQL 5.7.28, os códigos-fonte eram mantidos em uma distribuição separada, disponível no site de desenvolvimento do schema `sys` em <https://github.com/mysql/mysql-sys>.

Nem o **mysqldump** nem o **mysqlpump** realizam o dump (despejo) do schema `sys` por padrão. Para gerar um dump file, nomeie o schema `sys` explicitamente na linha de comando usando qualquer um destes comandos:

```sql
mysqldump --databases --routines sys > sys_dump.sql
mysqlpump sys > sys_dump.sql
```

Para reinstalar o schema a partir do dump file, use este comando:

```sql
mysql < sys_dump.sql
```
