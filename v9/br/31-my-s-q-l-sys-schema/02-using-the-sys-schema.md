## 30.2 Usando o esquema sys

Você pode tornar o esquema `sys` o esquema padrão, para que as referências a seus objetos não precisem ser qualificadas com o nome do esquema:

```
mysql> USE sys;
Database changed
mysql> SELECT * FROM version;
+-------------+---------------+
| sys_version | mysql_version |
+-------------+---------------+
| 2.1.1       | 8.4.0-tr      |
+-------------+---------------+
```

(A visualização `version` mostra o esquema `sys` e as versões do servidor MySQL.)

Para acessar os objetos do esquema `sys` enquanto um esquema diferente é o padrão (ou simplesmente para ser explícito), qualifique as referências aos objetos com o nome do esquema:

```
mysql> SELECT * FROM sys.version;
+-------------+---------------+
| sys_version | mysql_version |
+-------------+---------------+
| 2.1.1       | 8.4.0-tr      |
+-------------+---------------+
```

O esquema `sys` contém muitas visualizações que resumem as tabelas do Gerenciador de Desempenho de várias maneiras. A maioria dessas visualizações vem em pares, de modo que um membro do par tem o mesmo nome que o outro membro, mais um prefixo `x$`. Por exemplo, a visualização `host_summary_by_file_io` resume o I/O de arquivos agrupado por host e exibe latências convertidas de picosegundos para valores mais legíveis (com unidades);

```
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+-------+------------+
| host       | ios   | io_latency |
+------------+-------+------------+
| localhost  | 67570 | 5.38 s     |
| background |  3468 | 4.18 s     |
+------------+-------+------------+
```

A visualização `x$host_summary_by_file_io` resume os mesmos dados, mas exibe latências de picosegundo não formatadas:

```
mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+-------+---------------+
| host       | ios   | io_latency    |
+------------+-------+---------------+
| localhost  | 67574 | 5380678125144 |
| background |  3474 | 4758696829416 |
+------------+-------+---------------+
```

A visualização sem o prefixo `x$` é destinada a fornecer uma saída mais amigável ao usuário e mais fácil de ler para os humanos. A visualização com o prefixo `x$` que exibe os mesmos valores na forma bruta é destinada mais para uso com outras ferramentas que realizam seu próprio processamento nos dados. Para obter informações adicionais sobre as diferenças entre as visualizações sem `x$` e com `x$`, consulte a Seção 30.4.3, “Visualizações do Esquema sys”.

Para examinar as definições dos objetos do esquema `sys`, use a declaração apropriada `SHOW` ou a consulta `INFORMATION_SCHEMA`. Por exemplo, para examinar as definições da visualização `session` e da função `format_bytes()`, use essas declarações:

```
mysql> SHOW CREATE VIEW sys.session;
mysql> SHOW CREATE FUNCTION sys.format_bytes;
```

No entanto, essas declarações exibem as definições de forma relativamente não formatada. Para visualizar as definições dos objetos com uma formatação mais legível, acesse os arquivos `.sql` individuais encontrados no diretório `scripts/sys_schema` nas distribuições de código-fonte do MySQL.

O **mysqldump** não exclui o esquema `sys` por padrão. Para gerar um arquivo de dump, nomeie explicitamente o esquema `sys` na linha de comando usando um dos seguintes comandos:

```
mysqldump --databases --routines sys > sys_dump.sql
```

Para reinstalar o esquema a partir do arquivo de dump, use este comando:

```
mysql < sys_dump.sql
```