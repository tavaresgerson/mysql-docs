### 7.1.15 Suporte de fuso horário do servidor MySQL

Esta seção descreve as configurações de fuso horário mantidas pelo MySQL, como carregar as tabelas do sistema necessárias para o suporte de hora nomeada, como manter-se atualizado com mudanças de fuso horário e como habilitar o suporte de segundos-salto.

Os deslocamentos de fuso horário também são suportados para os valores de data e hora inseridos; ver Seção 13.2.2, "Os tipos DATE, DATETIME e TIMESTAMP", para mais informações.

Para obter informações sobre as definições de fusos horários nas configurações de replicação, ver secção 19.5.1.14, "Replicação e funções do sistema" e secção 19.5.1.33, "Replicação e fusos horários".

- Variaveis do fuso horário
- Preenchendo as tabelas de fusos horários
- Manter-se atualizado com as mudanças de fuso horário
- Fuso horário salto segundo suporte

#### Variaveis do fuso horário

O MySQL Server mantém várias configurações de fuso horário:

- O fuso horário do sistema do servidor. Quando o servidor é iniciado, ele tenta determinar o fuso horário da máquina hospedeira e o usa para definir a variável do sistema `system_time_zone`.

  Para especificar explicitamente o fuso horário do sistema para o MySQL Server na inicialização, defina a variável de ambiente `TZ` antes de iniciar `mysqld`. Se você iniciar o servidor usando `mysqld_safe`, sua opção `--timezone` fornece outra maneira de definir o fuso horário do sistema. Os valores permitidos para `TZ` e `--timezone` são dependentes do sistema. Consulte a documentação do sistema operacional para ver quais valores são aceitáveis.
- O fuso horário atual do servidor. A variável global do sistema `time_zone` indica o fuso horário em que o servidor está atualmente operando. O valor inicial `time_zone` é `'SYSTEM'`, o que indica que o fuso horário do servidor é o mesmo que o fuso horário do sistema.

  ::: info Note

  Se definido como `SYSTEM`, cada chamada de função MySQL que requer um cálculo de fuso horário faz uma chamada de biblioteca do sistema para determinar o fuso horário atual do sistema. Esta chamada pode ser protegida por um mutex global, resultando em contenção.

  :::

  O valor inicial do fuso horário do servidor global pode ser especificado explicitamente no início com a opção `--default-time-zone` na linha de comando, ou você pode usar a seguinte linha em um arquivo de opções:

  ```
  default-time-zone='timezone'
  ```

  Se você tem o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio depreciado `SUPER`), você pode definir o valor do fuso horário do servidor global no tempo de execução com esta instrução:

  ```
  SET GLOBAL time_zone = timezone;
  ```
- Cada cliente que se conecta tem sua própria configuração de fuso horário de sessão, dada pela variável de sessão `time_zone`. Inicialmente, a variável de sessão toma seu valor da variável global `time_zone`, mas o cliente pode alterar seu próprio fuso horário com esta instrução:

  ```
  SET time_zone = timezone;
  ```

A configuração do fuso horário da sessão afeta a exibição e o armazenamento de valores horários que são sensíveis ao fuso horário. Isso inclui os valores exibidos por funções como `NOW()` ou `CURTIME()`, e os valores armazenados e recuperados de colunas `TIMESTAMP`. Os valores para colunas `TIMESTAMP` são convertidos do fuso horário da sessão para UTC para armazenamento, e de UTC para o fuso horário da sessão para recuperação.

A configuração do fuso horário da sessão não afeta os valores exibidos por funções como `UTC_TIMESTAMP()` ou valores nas colunas `DATE`, `TIME`, ou `DATETIME` . Nem os valores nesses tipos de dados são armazenados no UTC; o fuso horário se aplica a eles apenas ao converter de valores `TIMESTAMP`. Se você quiser aritmética específica para valores `DATE`, `TIME`, ou `DATETIME`, converta-os para UTC, execute a aritmética e converta de volta.

Os valores globais e de zona horária da sessão atuais podem ser recuperados da seguinte forma:

```
SELECT @@GLOBAL.time_zone, @@SESSION.time_zone;
```

`timezone` Os valores podem ser dados em vários formatos, nenhum dos quais é sensível a maiúsculas e minúsculas:

- Como o valor `'SYSTEM'`, indicando que o fuso horário do servidor é o mesmo que o fuso horário do sistema.
- Como uma string indicando um deslocamento do UTC da forma `[H]H:MM`, prefixado com um `+` ou `-`, como `'+10:00'`, `'-6:00'`, ou `'+05:30'`.

  Este valor deve estar no intervalo de `'-13:59'` a `'+14:00'`, inclusive.
- Como um fuso horário nomeado, como `'Europe/Helsinki'`, `'US/Eastern'`, `'MET'`, ou `'UTC'`.

  ::: info Note

  Os fusos horários nomeados só podem ser usados se as tabelas de informações de fusos horários no banco de dados `mysql` tiverem sido criadas e preenchidas. Caso contrário, o uso de um fusos horário nomeado resulta em um erro:

  ```
  mysql> SET time_zone = 'UTC';
  ERROR 1298 (HY000): Unknown or incorrect time zone: 'UTC'
  ```

  :::

#### Preenchendo as tabelas de fusos horários

Existem várias tabelas no esquema do sistema PH para armazenar informações de fuso horário (ver Seção 7.3, "O esquema do sistema mysql"). O procedimento de instalação do MySQL cria as tabelas de fuso horário, mas não as carrega. Para fazê-lo manualmente, use as seguintes instruções.

::: info Note

O carregamento das informações do fuso horário não é necessariamente uma operação de uma só vez, porque as informações mudam ocasionalmente. Quando tais mudanças ocorrem, os aplicativos que usam as regras antigas ficam desatualizados e você pode achar necessário recarregar as tabelas do fuso horário para manter as informações usadas pelo seu servidor MySQL atualizadas. Veja Manter-se atualizado com mudanças de fuso horário.

:::

Se o seu sistema tem seu próprio banco de dados zoneinfo (o conjunto de arquivos que descrevem os fusos horários), use o programa **mysql\_tzinfo\_to\_sql** para carregar as tabelas de fusos horários. Exemplos de tais sistemas são Linux, macOS, FreeBSD e Solaris. Um local provável para esses arquivos é o diretório `/usr/share/zoneinfo`. Se o seu sistema não tem nenhum banco de dados zoneinfo, você pode usar um pacote baixável, como descrito mais adiante nesta seção.

Para carregar as tabelas de fuso horário a partir da linha de comando, passe o nome do caminho do diretório zoneinfo para **mysql\_tzinfo\_to\_sql** e envie a saída para o programa `mysql`. Por exemplo:

```
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p mysql
```

O comando `mysql` mostrado aqui assume que você se conecta ao servidor usando uma conta como `root` que tem privilégios para modificar tabelas no `mysql` esquema do sistema. Ajuste os parâmetros de conexão conforme necessário.

**mysql\_tzinfo\_to\_sql** lê os arquivos de fuso horário do seu sistema e gera instruções SQL a partir deles. `mysql` processa essas instruções para carregar as tabelas de fuso horário.

\*\* mysql\_tzinfo\_to\_sql \*\* também pode ser usado para carregar um único arquivo de fuso horário ou gerar informações de segundo salto:

- Para carregar um único arquivo de fuso horário `tz_file` que corresponde a um nome de fuso horário `tz_name`, invoque **mysql\_tzinfo\_to\_sql** assim:

  ```
  mysql_tzinfo_to_sql tz_file tz_name | mysql -u root -p mysql
  ```

  Com esta abordagem, você deve executar um comando separado para carregar o arquivo de fuso horário para cada zona nomeada que o servidor precisa saber.
- Se o seu fuso horário deve ter em conta segundos intercalares, inicialize a informação de segundos intercalares assim, onde `tz_file` é o nome do seu arquivo de fuso horário:

  ```
  mysql_tzinfo_to_sql --leap tz_file | mysql -u root -p mysql
  ```

Depois de executar **mysql\_tzinfo\_to\_sql**, reinicie o servidor para que ele não continue a usar qualquer dados de fuso horário armazenados em cache.

Se o seu sistema não tem banco de dados zoneinfo (por exemplo, Windows), você pode usar um pacote contendo instruções SQL que está disponível para download no MySQL Developer Zone:

```
https://dev.mysql.com/downloads/timezones.html
```

Advertência

Não use um pacote de fuso horário para download se o seu sistema tiver um banco de dados zoneinfo. Utilize o utilitário **mysql\_tzinfo\_to\_sql** em vez disso. Caso contrário, você pode causar uma diferença no tratamento de data e hora entre o MySQL e outros aplicativos no seu sistema.

Para usar um pacote de fuso horário de declaração SQL que você baixou, descompacte-o e carregue o conteúdo do arquivo descompactado nas tabelas de fuso horário:

```
mysql -u root -p mysql < file_name
```

Então reinicie o servidor.

Advertência

Não use um pacote de fuso horário para download que contenha tabelas `MyISAM`. Isso é destinado a versões mais antigas do MySQL. O MySQL agora usa `InnoDB` para as tabelas de fuso horário. Tentar substituí-las por `MyISAM` causa problemas.

#### Manter-se atualizado com as mudanças de fuso horário

Quando as regras do fuso horário mudam, os aplicativos que usam as regras antigas ficam desatualizados. Para se manter atualizado, é necessário garantir que seu sistema use informações atuais do fuso horário. Para o MySQL, existem vários fatores a serem considerados para se manter atualizado:

- O tempo do sistema operacional afeta o valor que o servidor MySQL usa para tempos se seu fuso horário estiver definido como `SYSTEM`. Certifique-se de que seu sistema operacional esteja usando as informações mais recentes do fuso horário. Para a maioria dos sistemas operacionais, a atualização ou service pack mais recente prepara seu sistema para as mudanças de hora. Verifique o site do fornecedor do sistema operacional para uma atualização que aborde as mudanças de hora.
- Se você substituir o arquivo de fuso horário `/etc/localtime` do sistema por uma versão que use regras diferentes das em vigor no `mysqld` inicialização, reinicie `mysqld` para que ele use as regras atualizadas. Caso contrário, `mysqld` pode não notar quando o sistema muda sua hora.
- Se você usar fusos horários nomeados com o MySQL, verifique se as tabelas de fusos horários no banco de dados `mysql` estão atualizadas:

  - Se o seu sistema tiver a sua própria base de dados zoneinfo, recarregue as tabelas de fuso horário do MySQL sempre que a base de dados zoneinfo for atualizada.
  - Para sistemas que não têm seu próprio banco de dados zoneinfo, verifique a Zona de Desenvolvedor do MySQL para atualizações. Quando uma nova atualização estiver disponível, baixe-a e use-a para substituir o conteúdo de suas tabelas de fuso horário atuais.

  Para obter instruções para ambos os métodos, consulte População das tabelas de fuso horário. `mysqld` armazenar informações de fuso horário que ele procura, então depois de atualizar as tabelas de fuso horário, reinicie `mysqld` para se certificar de que ele não continua a servir dados de fuso horário desatualizado.

Se você não tem certeza se os fusos horários nomeados estão disponíveis, para uso como configuração de fusos horários do servidor ou por clientes que definem seus próprios fusos horários, verifique se suas tabelas de fusos horários estão vazias. A seguinte consulta determina se a tabela que contém nomes de fusos horários tem quaisquer linhas:

```
mysql> SELECT COUNT(*) FROM mysql.time_zone_name;
+----------+
| COUNT(*) |
+----------+
|        0 |
+----------+
```

Uma contagem maior que zero indica que a tabela não está vazia e que seu conteúdo está disponível para ser usado para o suporte de fuso horário nomeado. Neste caso, certifique-se de recarregar suas tabelas de fuso horário para que os aplicativos que usam fuso horário nomeado possam obter resultados de consulta corretos.

Para verificar se sua instalação do MySQL está atualizada corretamente para uma mudança nas regras de horário de verão, use um teste como o seguinte. O exemplo usa valores apropriados para a mudança de 1 hora do horário de verão de 2007, que ocorre nos Estados Unidos em 11 de março às 2 da manhã.

O teste utiliza a seguinte consulta:

```
SELECT
  CONVERT_TZ('2007-03-11 2:00:00','US/Eastern','US/Central') AS time1,
  CONVERT_TZ('2007-03-11 3:00:00','US/Eastern','US/Central') AS time2;
```

Os dois valores de tempo indicam as horas em que ocorre a mudança de horário de verão, e o uso de fusos horários nomeados requer que as tabelas de fusos horários sejam usadas. O resultado desejado é que ambas as consultas retornem o mesmo resultado (o tempo de entrada, convertido para o valor equivalente no fuso horário "US / Central").

Antes de atualizar as tabelas de fuso horário, você vê um resultado incorreto como este:

```
+---------------------+---------------------+
| time1               | time2               |
+---------------------+---------------------+
| 2007-03-11 01:00:00 | 2007-03-11 02:00:00 |
+---------------------+---------------------+
```

Depois de atualizar as tabelas, deverá ver o resultado correto:

```
+---------------------+---------------------+
| time1               | time2               |
+---------------------+---------------------+
| 2007-03-11 01:00:00 | 2007-03-11 01:00:00 |
+---------------------+---------------------+
```

#### Fuso horário salto segundo suporte

Isso significa que uma função como `NOW()` pode retornar o mesmo valor por dois ou três segundos consecutivos durante o segundo salto.

Se for necessário pesquisar valores de `TIMESTAMP` um segundo antes do segundo intervalo, resultados anômalos podem ser obtidos se você usar uma comparação com valores de `'YYYY-MM-DD hh:mm:ss'`. O exemplo a seguir demonstra isso. Ele muda o fuso horário da sessão para UTC para que não haja diferença entre os valores internos de `TIMESTAMP` (que estão em UTC) e os valores exibidos (que têm correção de fuso horário aplicada).

```
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

Para contornar isso, você pode usar uma comparação baseada no valor UTC realmente armazenado na coluna, que tem a correção de segundo salto aplicada:

```
mysql> -- selecting using UNIX_TIMESTAMP value return leap value
mysql> SELECT * FROM t1 WHERE UNIX_TIMESTAMP(ts) = 1230768000;
+------+---------------------+
| a    | ts                  |
+------+---------------------+
|    2 | 2008-12-31 23:59:59 |
+------+---------------------+
1 row in set (0.00 sec)
```
