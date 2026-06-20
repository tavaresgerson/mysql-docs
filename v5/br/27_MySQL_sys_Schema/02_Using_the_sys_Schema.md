## 26.2 Usando o esquema sys

Você pode tornar o esquema `sys` o esquema padrão, para que as referências a seus objetos não precisem ser qualificadas com o nome do esquema:

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

(A visão `version` mostra o esquema `sys` e as versões do servidor MySQL.)

Para acessar os objetos do esquema `sys` enquanto um esquema diferente é o padrão (ou simplesmente para ser explícito), qualifique as referências de objeto com o nome do esquema:

```sql
mysql> SELECT * FROM sys.version;
+-------------+------------------+
| sys_version | mysql_version    |
+-------------+------------------+
| 1.5.1       | 5.7.24-debug-log |
+-------------+------------------+
```

O esquema `sys` contém muitas visualizações que resumem as tabelas do Gerador de Desempenho de várias maneiras. A maioria dessas visualizações vem em pares, de modo que um membro do par tem o mesmo nome que o outro membro, além do prefixo `x$`. Por exemplo, a visualização `host_summary_by_file_io` resume o I/O de arquivos agrupado por host e exibe latências convertidas de picosegundos para valores mais legíveis (com unidades);

```sql
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+-------+------------+
| host       | ios   | io_latency |
+------------+-------+------------+
| localhost  | 67570 | 5.38 s     |
| background |  3468 | 4.18 s     |
+------------+-------+------------+
```

A visualização `x$host_summary_by_file_io` resume os mesmos dados, mas exibe latências de picosegundo não formatadas:

```sql
mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+-------+---------------+
| host       | ios   | io_latency    |
+------------+-------+---------------+
| localhost  | 67574 | 5380678125144 |
| background |  3474 | 4758696829416 |
+------------+-------+---------------+
```

A visão sem o prefixo `x$` é destinada a fornecer uma saída mais amigável ao usuário e mais fácil de ler para os seres humanos. A visão com o prefixo `x$` que exibe os mesmos valores em forma bruta é destinada a ser usada com outras ferramentas que realizam seu próprio processamento dos dados. Para informações adicionais sobre as diferenças entre as visões sem `x$` e `x$`, consulte a Seção 26.4.3, “Visões do esquema sys”.

Para examinar as definições dos objetos de esquema `sys`, use a declaração apropriada `SHOW` ou a consulta `INFORMATION_SCHEMA`. Por exemplo, para examinar as definições da visão `session` e da função `format_bytes()`", use essas declarações:

```sql
mysql> SHOW CREATE VIEW sys.session;
mysql> SHOW CREATE FUNCTION sys.format_bytes;
```

No entanto, essas declarações exibem as definições em uma forma relativamente não formatada. Para visualizar as definições dos objetos com formatação mais legível, acesse os arquivos individuais `.sql` encontrados sob o `scripts/sys_schema` nas distribuições de fonte MySQL. Antes do MySQL 5.7.28, as fontes são mantidas em uma distribuição separada disponível no site de desenvolvimento do esquema <https://github.com/mysql/mysql-sys> do esquema `sys`.

Nem o **mysqldump** nem o **mysqlpump** excluem o esquema `sys` por padrão. Para gerar um arquivo de exclusão, nomeie explicitamente o esquema `sys` na linha de comando usando qualquer um desses comandos:

```sql
mysqldump --databases --routines sys > sys_dump.sql
mysqlpump sys > sys_dump.sql
```

Para reinstalar o esquema a partir do arquivo de dump, use este comando:

```sql
mysql < sys_dump.sql
```