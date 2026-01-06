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

(A visualização `version` mostra o esquema `sys` e as versões do servidor MySQL.)

Para acessar os objetos do esquema `sys` enquanto um esquema diferente é o padrão (ou simplesmente para ser explícito), qualifique as referências de objetos com o nome do esquema:

```sql
mysql> SELECT * FROM sys.version;
+-------------+------------------+
| sys_version | mysql_version    |
+-------------+------------------+
| 1.5.1       | 5.7.24-debug-log |
+-------------+------------------+
```

O esquema `sys` contém muitas visualizações que resumem as tabelas do Gerenciamento de Desempenho de várias maneiras. A maioria dessas visualizações vem em pares, de modo que um membro do par tem o mesmo nome do outro membro, além do prefixo `x$`. Por exemplo, a visualização `host_summary_by_file_io` resume o I/O de arquivos agrupado por host e exibe as latências convertidas de picosegundos para valores mais legíveis (com unidades);

```sql
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+-------+------------+
| host       | ios   | io_latency |
+------------+-------+------------+
| localhost  | 67570 | 5.38 s     |
| background |  3468 | 4.18 s     |
+------------+-------+------------+
```

A visualização `x$host_summary_by_file_io` resume os mesmos dados, mas exibe latências picosegundos não formatadas:

```sql
mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+-------+---------------+
| host       | ios   | io_latency    |
+------------+-------+---------------+
| localhost  | 67574 | 5380678125144 |
| background |  3474 | 4758696829416 |
+------------+-------+---------------+
```

A visualização sem o prefixo `x$` visa fornecer uma saída mais amigável ao usuário e mais fácil de ler para os seres humanos. A visualização com o prefixo `x$` que exibe os mesmos valores na forma bruta é mais adequada para uso com outras ferramentas que realizam seu próprio processamento dos dados. Para obter informações adicionais sobre as diferenças entre as visualizações sem `x$` e com `x$`, consulte a Seção 26.4.3, “Visualizações do esquema sys”.

Para examinar as definições dos objetos de esquema `sys`, use a declaração apropriada `SHOW` ou a consulta `INFORMATION_SCHEMA`. Por exemplo, para examinar as definições da visualização `session` e da função `format_bytes()`, use essas declarações:

```sql
mysql> SHOW CREATE VIEW sys.session;
mysql> SHOW CREATE FUNCTION sys.format_bytes;
```

No entanto, essas declarações exibem as definições de forma relativamente não formatada. Para visualizar as definições de objetos com um formato mais legível, acesse os arquivos individuais `.sql` encontrados sob o diretório `scripts/sys_schema` nas distribuições de código-fonte do MySQL. Antes do MySQL 5.7.28, as fontes são mantidas em uma distribuição separada disponível no site de desenvolvimento do esquema `sys` em <https://github.com/mysql/mysql-sys>.

Nem o **mysqldump** nem o **mysqlpump** fazem o dump do esquema `sys` por padrão. Para gerar um arquivo de dump, nomeie explicitamente o esquema `sys` na linha de comando usando um desses comandos:

```sql
mysqldump --databases --routines sys > sys_dump.sql
mysqlpump sys > sys_dump.sql
```

Para reinstalar o esquema a partir do arquivo de dump, use este comando:

```sql
mysql < sys_dump.sql
```
