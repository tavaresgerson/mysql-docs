### 5.1.13 Suporte a Time Zone do MySQL Server

Esta seção descreve as configurações de Time Zone mantidas pelo MySQL, como carregar as system tables necessárias para o suporte a nomes de fusos horários, como manter-se atualizado com as mudanças de Time Zone e como habilitar o suporte a *leap-second* (segundo bissexto).

Para informações sobre as configurações de Time Zone em configurações de Replication, consulte [Section 16.4.1.15, “Replication and System Functions”](replication-features-functions.html "16.4.1.15 Replication and System Functions") e [Section 16.4.1.31, “Replication and Time Zones”](replication-features-timezone.html "16.4.1.31 Replication and Time Zones").

* [Variáveis de Time Zone](time-zone-support.html#time-zone-variables "Time Zone Variables")
* [Preenchendo as Time Zone Tables](time-zone-support.html#time-zone-installation "Populating the Time Zone Tables")
* [Mantendo-se Atualizado com as Mudanças de Time Zone](time-zone-support.html#time-zone-upgrades "Staying Current with Time Zone Changes")
* [Suporte a Leap Second de Time Zone](time-zone-support.html#time-zone-leap-seconds "Time Zone Leap Second Support")

#### Variáveis de Time Zone

O MySQL Server mantém diversas configurações de Time Zone:

* O Time Zone de sistema do server. Quando o server inicia, ele tenta determinar o Time Zone da máquina host e o utiliza para definir a system variable [`system_time_zone`](server-system-variables.html#sysvar_system_time_zone). O valor não muda depois disso.

  Para especificar explicitamente o Time Zone de sistema para o MySQL Server na inicialização (startup), defina a environment variable `TZ` antes de iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Se você iniciar o server usando o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"), sua opção [`--timezone`](mysqld-safe.html#option_mysqld_safe_timezone) fornece outra maneira de definir o Time Zone de sistema. Os valores permitidos para `TZ` e [`--timezone`](mysqld-safe.html#option_mysqld_safe_timezone) dependem do sistema. Consulte a documentação do seu sistema operacional para ver quais valores são aceitáveis.

* O Time Zone atual do server. A system variable global [`time_zone`](server-system-variables.html#sysvar_time_zone) indica o Time Zone no qual o server está operando atualmente. O valor inicial de [`time_zone`](server-system-variables.html#sysvar_time_zone) é `'SYSTEM'`, o que indica que o Time Zone do server é o mesmo que o Time Zone do sistema.

  Note

  Se definido como `SYSTEM`, toda chamada de função MySQL que exige um cálculo de Time Zone faz uma chamada de system library para determinar o Time Zone de sistema atual. Essa chamada pode ser protegida por um mutex global, resultando em contenção.

  O valor inicial do Time Zone global do server pode ser especificado explicitamente na inicialização com a opção [`--default-time-zone`](server-options.html#option_mysqld_default-time-zone) na linha de comando, ou você pode usar a seguinte linha em um option file:

  ```sql
  default-time-zone='timezone'
  ```

  Se você tiver o privilégio [`SUPER`](privileges-provided.html#priv_super), você pode definir o valor do Time Zone global do server em tempo de execução (runtime) com esta instrução:

  ```sql
  SET GLOBAL time_zone = timezone;
  ```

* Time Zones por Session. Cada client que se conecta tem sua própria configuração de Time Zone de Session, dada pela variável [`time_zone`](server-system-variables.html#sysvar_time_zone) de Session. Inicialmente, a variável de Session recebe seu valor da variável global [`time_zone`](server-system-variables.html#sysvar_time_zone), mas o client pode alterar seu próprio Time Zone com esta instrução:

  ```sql
  SET time_zone = timezone;
  ```

A configuração de Time Zone da Session afeta a exibição e o armazenamento de valores de tempo que são sensíveis a fusos. Isso inclui os valores exibidos por funções como [`NOW()`](date-and-time-functions.html#function_now) ou [`CURTIME()`](date-and-time-functions.html#function_curtime), e valores armazenados e recuperados de colunas [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"). Os valores para colunas [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") são convertidos do Time Zone da Session para UTC para armazenamento e de UTC para o Time Zone da Session para recuperação.

A configuração de Time Zone da Session não afeta os valores exibidos por funções como [`UTC_TIMESTAMP()`](date-and-time-functions.html#function_utc-timestamp) ou valores em colunas [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), [`TIME`](time.html "11.2.3 The TIME Type"), ou [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"). Nem os valores nesses tipos de dados são armazenados em UTC; o Time Zone se aplica a eles apenas ao converter de valores [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"). Se você deseja aritmética específica de localidade para valores [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), [`TIME`](time.html "11.2.3 The TIME Type"), ou [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), converta-os para UTC, execute a aritmética e, em seguida, converta de volta.

Os valores atuais de Time Zone global e de Session podem ser recuperados desta forma:

```sql
SELECT @@GLOBAL.time_zone, @@SESSION.time_zone;
```

Os valores de *`timezone`* podem ser fornecidos em vários formatos, nenhum dos quais é case-sensitive (sensível a maiúsculas/minúsculas):

* Como o valor `'SYSTEM'`, indicando que o Time Zone do server é o mesmo que o Time Zone do sistema.

* Como uma string indicando um offset (deslocamento) de UTC no formato `[H]H:MM`, prefixado com `+` ou `-`, como `'+10:00'`, `'-6:00'`, ou `'+05:30'`. Um zero à esquerda pode ser usado opcionalmente para valores de horas menores que 10; o MySQL adiciona um zero à esquerda ao armazenar e recuperar o valor nesses casos. O MySQL converte `'-00:00'` ou `'-0:00'` para `'+00:00'`.

  Um offset de Time Zone deve estar no range de `'-12:59'` a `'+13:00'`, inclusive.

* Como um Time Zone nomeado, como `'Europe/Helsinki'`, `'US/Eastern'`, `'MET'`, ou `'UTC'`.

  Note

  Time Zones nomeados só podem ser usados se as tabelas de informação de Time Zone no `mysql` Database tiverem sido criadas e preenchidas (populated). Caso contrário, o uso de um Time Zone nomeado resulta em um erro:

  ```sql
  mysql> SET time_zone = 'UTC';
  ERROR 1298 (HY000): Unknown or incorrect time zone: 'UTC'
  ```

#### Preenchendo as Time Zone Tables

Várias tabelas no `mysql` system database existem para armazenar informações de Time Zone (consulte [Section 5.3, “The mysql System Database”](system-schema.html "5.3 The mysql System Database")). O procedimento de instalação do MySQL cria as Time Zone tables, mas não as carrega (load). Para fazer isso manualmente, use as seguintes instruções.

Note

Carregar as informações de Time Zone não é necessariamente uma operação única, pois as informações mudam ocasionalmente. Quando tais mudanças ocorrem, os applications que usam as regras antigas ficam desatualizados, e você pode achar necessário recarregar as Time Zone tables para manter atualizadas as informações usadas pelo seu MySQL Server. Consulte [Staying Current with Time Zone Changes](time-zone-support.html#time-zone-upgrades "Staying Current with Time Zone Changes").

Se o seu sistema tiver seu próprio zoneinfo database (o conjunto de arquivos que descrevem os Time Zones), use o programa [**mysql_tzinfo_to_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables") para carregar as Time Zone tables. Exemplos de tais sistemas são Linux, macOS, FreeBSD e Solaris. Um local provável para esses arquivos é o diretório `/usr/share/zoneinfo`. Se o seu sistema não tiver um zoneinfo database, você pode usar um pacote para download, conforme descrito mais adiante nesta seção.

Para carregar as Time Zone tables a partir da linha de comando, passe o path name do diretório zoneinfo para [**mysql_tzinfo_to_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables") e envie o output para o programa [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"). Por exemplo:

```sql
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p mysql
```

O comando [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") mostrado aqui assume que você se conecta ao server usando uma conta como `root` que possui privilégios para modificar tabelas no `mysql` system database. Ajuste os connection parameters conforme necessário.

[**mysql_tzinfo_to_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables") lê os arquivos de Time Zone do seu sistema e gera SQL statements a partir deles. O [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") processa essas statements para carregar as Time Zone tables.

[**mysql_tzinfo_to_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables") também pode ser usado para carregar um único arquivo de Time Zone ou gerar informações de *leap second*:

* Para carregar um único arquivo de Time Zone *`tz_file`* que corresponda a um nome de Time Zone *`tz_name`*, invoque [**mysql_tzinfo_to_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables") desta forma:

  ```sql
  mysql_tzinfo_to_sql tz_file tz_name | mysql -u root -p mysql
  ```

  Com essa abordagem, você deve executar um comando separado para carregar o arquivo de Time Zone para cada zona nomeada que o server precisa conhecer.

* Se o seu Time Zone deve contabilizar *leap seconds*, inicialize as informações de *leap second* desta forma, onde *`tz_file`* é o nome do seu arquivo de Time Zone:

  ```sql
  mysql_tzinfo_to_sql --leap tz_file | mysql -u root -p mysql
  ```

Após executar [**mysql_tzinfo_to_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables"), reinicie o server para que ele não continue a usar quaisquer dados de Time Zone previamente armazenados em cache.

Se o seu sistema não tiver um zoneinfo database (por exemplo, Windows), você pode usar um pacote contendo SQL statements que está disponível para download na MySQL Developer Zone:

```sql
https://dev.mysql.com/downloads/timezones.html
```

Warning

*Não* use um pacote de Time Zone para download se o seu sistema tiver um zoneinfo database. Em vez disso, use a utility [**mysql_tzinfo_to_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables"). Caso contrário, você pode causar uma diferença no tratamento de datetime entre o MySQL e outros applications no seu sistema.

Para usar um pacote de Time Zone de SQL-statement que você baixou, descompacte-o e carregue o conteúdo do arquivo descompactado nas Time Zone tables:

```sql
mysql -u root -p mysql < file_name
```

Em seguida, reinicie o server.

Warning

*Não* use um pacote de Time Zone para download que contenha tabelas `MyISAM`. Isso é destinado a versões mais antigas do MySQL. O MySQL 5.7 e superior usa `InnoDB` para as Time Zone tables. Tentar substituí-las por tabelas `MyISAM` causa problemas.

#### Mantendo-se Atualizado com as Mudanças de Time Zone

Quando as regras de Time Zone mudam, os applications que usam as regras antigas ficam desatualizados. Para manter-se atualizado, é necessário garantir que as informações atuais de Time Zone sejam usadas pelo seu sistema. Para o MySQL, há múltiplos fatores a considerar para manter-se atualizado:

* O horário do sistema operacional afeta o valor que o MySQL Server usa para horários se seu Time Zone estiver definido como `SYSTEM`. Certifique-se de que seu sistema operacional esteja usando as informações de Time Zone mais recentes. Para a maioria dos sistemas operacionais, a atualização ou service pack mais recente prepara seu sistema para as mudanças de horário. Verifique o website do fornecedor do seu sistema operacional para uma atualização que aborde as mudanças de horário.

* Se você substituir o arquivo de Time Zone `/etc/localtime` do sistema por uma versão que usa regras diferentes daquelas em vigor na inicialização do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), reinicie o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") para que ele use as regras atualizadas. Caso contrário, o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") pode não perceber quando o sistema muda seu horário.

* Se você usa Time Zones nomeados com o MySQL, certifique-se de que as Time Zone tables no `mysql` database estejam up to date (atualizadas):

  + Se o seu sistema tiver seu próprio zoneinfo database, recarregue as Time Zone tables do MySQL sempre que o zoneinfo database for atualizado.

  + Para sistemas que não possuem seu próprio zoneinfo database, verifique a MySQL Developer Zone em busca de atualizações. Quando uma nova atualização estiver disponível, baixe-a e use-a para substituir o conteúdo das suas Time Zone tables atuais.

  Para instruções sobre ambos os métodos, consulte [Populating the Time Zone Tables](time-zone-support.html#time-zone-installation "Populating the Time Zone Tables"). O [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") armazena em cache (caches) informações de Time Zone que ele consulta, portanto, após atualizar as Time Zone tables, reinicie o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") para garantir que ele não continue a servir dados de Time Zone desatualizados.

Se você não tiver certeza se os Time Zones nomeados estão disponíveis, seja para uso como configuração de Time Zone do server ou por clients que definem seu próprio Time Zone, verifique se suas Time Zone tables estão vazias. A seguinte Query determina se a tabela que contém nomes de Time Zone possui alguma linha:

```sql
mysql> SELECT COUNT(*) FROM mysql.time_zone_name;
+----------+
| COUNT(*) |
+----------+
|        0 |
+----------+
```

Uma contagem de zero indica que a tabela está vazia. Neste caso, nenhum application está usando Time Zones nomeados atualmente e você não precisa atualizar as tabelas (a menos que queira habilitar o suporte a Time Zone nomeado). Uma contagem maior que zero indica que a tabela não está vazia e que seu conteúdo está disponível para ser usado para suporte a Time Zone nomeado. Neste caso, certifique-se de recarregar suas Time Zone tables para que os applications que usam Time Zones nomeados obtenham resultados de Query corretos.

Para verificar se sua instalação MySQL está atualizada corretamente para uma mudança nas regras do Horário de Verão (Daylight Saving Time - DST), use um teste como o seguinte. O exemplo usa valores apropriados para a mudança de 1 hora do DST de 2007 que ocorreu nos Estados Unidos em 11 de Março, às 2 da manhã.

O teste usa esta Query:

```sql
SELECT
  CONVERT_TZ('2007-03-11 2:00:00','US/Eastern','US/Central') AS time1,
  CONVERT_TZ('2007-03-11 3:00:00','US/Eastern','US/Central') AS time2;
```

Os dois valores de tempo indicam os horários em que ocorre a mudança de DST, e o uso de Time Zones nomeados requer que as Time Zone tables sejam usadas. O resultado desejado é que ambas as Queries retornem o mesmo resultado (o tempo de input, convertido para o valor equivalente no Time Zone 'US/Central').

Antes de atualizar as Time Zone tables, você verá um resultado incorreto como este:

```sql
+---------------------+---------------------+
| time1               | time2               |
+---------------------+---------------------+
| 2007-03-11 01:00:00 | 2007-03-11 02:00:00 |
+---------------------+---------------------+
```

Após atualizar as tabelas, você deve ver o resultado correto:

```sql
+---------------------+---------------------+
| time1               | time2               |
+---------------------+---------------------+
| 2007-03-11 01:00:00 | 2007-03-11 01:00:00 |
+---------------------+---------------------+
```

#### Suporte a Leap Second de Time Zone

Os valores de *leap second* são retornados com uma parte de tempo que termina em `:59:59`. Isso significa que uma função como [`NOW()`](date-and-time-functions.html#function_now) pode retornar o mesmo valor por dois ou três segundos consecutivos durante o *leap second*. Permanece verdadeiro que os valores temporais literais com uma parte de tempo que termina em `:59:60` ou `:59:61` são considerados inválidos.

Se for necessário buscar valores [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") um segundo antes do *leap second*, resultados anômalos podem ser obtidos se você usar uma comparação com valores `'YYYY-MM-DD hh:mm:ss'`. O exemplo a seguir demonstra isso. Ele altera o Time Zone da Session para UTC para que não haja diferença entre os valores internos [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") (que estão em UTC) e os valores exibidos (que têm correção de Time Zone aplicada).

```sql
mysql> CREATE TABLE t1 (
         a INT,
         ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         PRIMARY KEY (ts)
       );
Query OK, 0 rows affected (0.01 sec)

mysql> -- change to UTC
mysql> SET time_zone = '+00:00';
Query OK, 0 rows affected (0.00 sec)

mysql> -- Simulate NOW() = '2008-12-31 23:59:59'
mysql> SET timestamp = 1230767999;
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t1 (a) VALUES (1);
Query OK, 1 row affected (0.00 sec)

mysql> -- Simulate NOW() = '2008-12-31 23:59:60'
mysql> SET timestamp = 1230768000;
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t1 (a) VALUES (2);
Query OK, 1 row affected (0.00 sec)

mysql> -- values differ internally but display the same
mysql> SELECT a, ts, UNIX_TIMESTAMP(ts) FROM t1;
+------+---------------------+--------------------+
| a    | ts                  | UNIX_TIMESTAMP(ts) |
+------+---------------------+--------------------+
|    1 | 2008-12-31 23:59:59 |         1230767999 |
|    2 | 2008-12-31 23:59:59 |         1230768000 |
+------+---------------------+--------------------+
2 rows in set (0.00 sec)

mysql> -- only the non-leap value matches
mysql> SELECT * FROM t1 WHERE ts = '2008-12-31 23:59:59';
+------+---------------------+
| a    | ts                  |
+------+---------------------+
|    1 | 2008-12-31 23:59:59 |
+------+---------------------+
1 row in set (0.00 sec)

mysql> -- the leap value with seconds=60 is invalid
mysql> SELECT * FROM t1 WHERE ts = '2008-12-31 23:59:60';
Empty set, 2 warnings (0.00 sec)
```

Para contornar isso, você pode usar uma comparação baseada no valor UTC realmente armazenado na coluna, que tem a correção de *leap second* aplicada:

```sql
mysql> -- selecting using UNIX_TIMESTAMP value return leap value
mysql> SELECT * FROM t1 WHERE UNIX_TIMESTAMP(ts) = 1230768000;
+------+---------------------+
| a    | ts                  |
+------+---------------------+
|    2 | 2008-12-31 23:59:59 |
+------+---------------------+
1 row in set (0.00 sec)
```
