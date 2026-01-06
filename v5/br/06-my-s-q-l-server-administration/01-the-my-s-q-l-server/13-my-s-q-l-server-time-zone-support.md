### 5.1.13 Suporte de Fuso Horário do MySQL Server

Esta seção descreve as configurações do fuso horário mantidas pelo MySQL, como carregar as tabelas do sistema necessárias para o suporte de horários nomeados, como se manter atualizado com as mudanças de fuso horário e como habilitar o suporte ao segundo intercalar.

Para obter informações sobre as configurações de fuso horário em configurações de replicação, consulte Seção 16.4.1.15, “Replicação e Funções do Sistema” e Seção 16.4.1.31, “Replicação e Fusos Horários”.

- Variáveis de Fuso Horário
- Populando as tabelas de fuso horário
- Manter-se Atualizado com Alterações nos Fusos Horários
- Suporte para segundo intercalar de fuso horário (time-zone-support.html#time-zone-leap-seconds)

#### Variáveis de Fuso Horário

O MySQL Server mantém várias configurações de fuso horário:

- O fuso horário do sistema do servidor. Quando o servidor é iniciado, ele tenta determinar o fuso horário da máquina hospedeira e usa-o para definir a variável de sistema `system_time_zone`. O valor não muda depois disso.

  Para especificar explicitamente o fuso horário do sistema para o MySQL Server ao iniciar, defina a variável de ambiente `TZ` antes de iniciar o **mysqld**. Se você iniciar o servidor usando **mysqld\_safe**, sua opção `--timezone` (mysqld-safe.html#option\_mysqld\_safe\_timezone) oferece outra maneira de definir o fuso horário do sistema. Os valores permitidos para `TZ` e `--timezone` (mysqld-safe.html#option\_mysqld\_safe\_timezone) dependem do sistema operacional. Consulte a documentação do seu sistema operacional para ver quais valores são aceitáveis.

- O fuso horário atual do servidor. A variável de sistema global `time_zone` indica o fuso horário em que o servidor está operando atualmente. O valor inicial da variável `time_zone` é `'SYSTEM'`, o que indica que o fuso horário do servidor é o mesmo do fuso horário do sistema.

  Nota

  Se configurado como `SYSTEM`, cada chamada de função do MySQL que requer um cálculo de fuso horário faz uma chamada à biblioteca do sistema para determinar o fuso horário do sistema atual. Essa chamada pode ser protegida por um mutex global, resultando em concorrência.

  O valor inicial do fuso horário do servidor global pode ser especificado explicitamente na inicialização com a opção `--default-time-zone` na linha de comando, ou você pode usar a seguinte linha em um arquivo de opções:

  ```sql
  default-time-zone='timezone'
  ```

  Se você tiver o privilégio `SUPER`, você pode definir o valor do fuso horário do servidor global em tempo de execução com esta declaração:

  ```sql
  SET GLOBAL time_zone = timezone;
  ```

- Fusos horários por sessão. Cada cliente que se conecta tem seu próprio ajuste de fuso horário de sessão, definido pela variável de sessão `time_zone`. Inicialmente, a variável de sessão toma seu valor da variável global `time_zone`, mas o cliente pode alterar seu próprio fuso horário com esta declaração:

  ```sql
  SET time_zone = timezone;
  ```

A configuração do fuso horário da sessão afeta a exibição e o armazenamento de valores de hora que são sensíveis ao fuso horário. Isso inclui os valores exibidos por funções como `NOW()` ou `CURTIME()`, e valores armazenados e recuperados das colunas `TIMESTAMP`. Os valores das colunas `TIMESTAMP` são convertidos do fuso horário da sessão para UTC para armazenamento e de UTC para o fuso horário da sessão para recuperação.

A configuração do fuso horário da sessão não afeta os valores exibidos por funções como `UTC_TIMESTAMP()` ou valores nas colunas `DATE`, `TIME` ou `DATETIME`. Além disso, os valores desses tipos de dados não são armazenados no UTC; o fuso horário se aplica a eles apenas durante a conversão de valores de `TIMESTAMP`. Se você deseja aritmética específica para o local para valores de `DATE`, `TIME` ou `DATETIME`, converta-os para UTC, realize a aritmética e, em seguida, converta de volta.

Os valores atuais dos fusos horários globais e de sessão podem ser recuperados da seguinte forma:

```sql
SELECT @@GLOBAL.time_zone, @@SESSION.time_zone;
```

Os valores de *`timezone`* podem ser fornecidos em vários formatos, nenhum dos quais é case-sensitive:

- Como o valor `'SYSTEM'`, indicando que o fuso horário do servidor é o mesmo do fuso horário do sistema.

- Como uma string que indica um deslocamento em relação ao UTC na forma `[H]H:MM`, precedida por um `+` ou `-`, como `'+10:00'`, `'-6:00'` ou `'+05:30'`. Um zero inicial pode ser opcionalmente usado para valores de horas menores que 10; o MySQL preenchendo um zero inicial ao armazenar e recuperar o valor nesses casos. O MySQL converte `'-00:00'` ou `'-0:00'` em `'+00:00'`.

  O deslocamento do fuso horário deve estar na faixa de `'-12:59'` a `'+13:00'`, inclusive.

- Como um fuso horário nomeado, como `'Europe/Helsinki'`, `'US/Eastern'`, `'MET'` ou `'UTC'`.

  Nota

  As zonas horárias nomeadas só podem ser usadas se as tabelas de informações de fuso horário no banco de dados `mysql` tiverem sido criadas e preenchidas. Caso contrário, o uso de uma zona horária nomeada resultará em um erro:

  ```sql
  mysql> SET time_zone = 'UTC';
  ERROR 1298 (HY000): Unknown or incorrect time zone: 'UTC'
  ```

#### Populando as tabelas de fuso horário

Existem várias tabelas no banco de dados do sistema `mysql` para armazenar informações de fuso horário (consulte Seção 5.3, “O Banco de Dados do Sistema mysql”). O procedimento de instalação do MySQL cria as tabelas de fuso horário, mas não as carrega. Para fazer isso manualmente, use as instruções a seguir.

Nota

Carregar as informações do fuso horário não é necessariamente uma operação única, pois as informações podem mudar ocasionalmente. Quando essas mudanças ocorrem, os aplicativos que usam as regras antigas ficam desatualizados e você pode achar necessário recarregar as tabelas de fuso horário para manter as informações usadas pelo seu servidor MySQL atualizadas. Veja Manter-se Atualizado com Mudanças no Fuso Horário.

Se o seu sistema tiver seu próprio banco de dados de zoneinfo (o conjunto de arquivos que descrevem os fusos horários), use o programa **mysql\_tzinfo\_to\_sql** para carregar as tabelas de fuso horário. Exemplos de sistemas desse tipo são Linux, macOS, FreeBSD e Solaris. Um local provável para esses arquivos é o diretório `/usr/share/zoneinfo`. Se o seu sistema não tiver um banco de dados de zoneinfo, você pode usar um pacote para download, conforme descrito mais adiante nesta seção.

Para carregar as tabelas de fuso horário a partir da linha de comando, passe o nome do caminho do diretório zoneinfo para **mysql\_tzinfo\_to\_sql** e envie a saída para o programa **mysql**. Por exemplo:

```sql
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p mysql
```

O comando **mysql** mostrado aqui assume que você se conecta ao servidor usando uma conta como `root` que tenha privilégios para modificar tabelas no banco de dados do sistema `mysql`. Ajuste os parâmetros de conexão conforme necessário.

**mysql\_tzinfo\_to\_sql** lê os arquivos de fuso horário do seu sistema e gera declarações SQL a partir deles. **mysql** processa essas declarações para carregar as tabelas de fuso horário.

**mysql\_tzinfo\_to\_sql** também pode ser usado para carregar um único arquivo de fuso horário ou gerar informações sobre segundos intercalares:

- Para carregar um único arquivo de fuso horário *`tz_file`* que corresponde a um nome de fuso horário *`tz_name`*, invocando **mysql\_tzinfo\_to\_sql** da seguinte forma:

  ```sql
  mysql_tzinfo_to_sql tz_file tz_name | mysql -u root -p mysql
  ```

  Com essa abordagem, você deve executar um comando separado para carregar o arquivo de fuso horário para cada zona nomeada que o servidor precisa saber.

- Se o seu fuso horário precisar considerar segundos intercalares, inicie as informações sobre segundos intercalares da seguinte forma, onde *`tz_file`* é o nome do arquivo do fuso horário:

  ```sql
  mysql_tzinfo_to_sql --leap tz_file | mysql -u root -p mysql
  ```

Após executar **mysql\_tzinfo\_to\_sql**, reinicie o servidor para que ele não continue a usar quaisquer dados de fuso horário armazenados em cache anteriormente.

Se o seu sistema não tiver um banco de dados zoneinfo (por exemplo, Windows), você pode usar um pacote contendo instruções SQL que está disponível para download na MySQL Developer Zone:

```sql
https://dev.mysql.com/downloads/timezones.html
```

Aviso

Não use um pacote de fuso horário para download se o seu sistema tiver um banco de dados zoneinfo. Em vez disso, use o utilitário **mysql\_tzinfo\_to\_sql**. Caso contrário, você pode causar uma diferença no tratamento de datas e horas entre o MySQL e outras aplicações no seu sistema.

Para usar um pacote de fuso horário de declaração SQL que você baixou, descompacte-o e, em seguida, carregue o conteúdo do arquivo descompactado nas tabelas de fuso horário:

```sql
mysql -u root -p mysql < file_name
```

Em seguida, reinicie o servidor.

Aviso

*Não* use um pacote de fuso horário para download que contenha tabelas `MyISAM`. Esse pacote é destinado a versões mais antigas do MySQL. O MySQL 5.7 e versões posteriores usam `InnoDB` para as tabelas de fuso horário. Tentar substituí-las por tabelas `MyISAM` causa problemas.

#### Manter-se atualizado com as mudanças nos fusos horários

Quando as regras do fuso horário mudam, os aplicativos que usam as regras antigas ficam desatualizados. Para se manter atualizado, é necessário garantir que o sistema esteja usando as informações corretas do fuso horário. Para o MySQL, há vários fatores a serem considerados para se manter atualizado:

- O horário do sistema operacional afeta o valor que o servidor MySQL usa para os horários se sua zona horária estiver definida como `SYSTEM`. Certifique-se de que seu sistema operacional esteja usando as informações mais recentes sobre a zona horária. Para a maioria dos sistemas operacionais, a atualização mais recente ou o serviço pack preparam seu sistema para as mudanças de horário. Verifique o site do fornecedor do seu sistema operacional para uma atualização que trate das mudanças de horário.

- Se você substituir o arquivo de fuso horário `/etc/localtime` do sistema por uma versão que use regras diferentes das que estão em vigor no início do **mysqld**, reinicie o **mysqld** para que ele use as regras atualizadas. Caso contrário, o **mysqld** pode não perceber quando o sistema altera a hora.

- Se você usa fusos horários nomeados com o MySQL, certifique-se de que as tabelas de fuso horário no banco de dados `mysql` estejam atualizadas:

  - Se o seu sistema tiver seu próprio banco de dados zoneinfo, recarregue as tabelas de fuso horário do MySQL sempre que o banco de dados zoneinfo for atualizado.

  - Para sistemas que não possuem seu próprio banco de dados de zoneinfo, verifique a MySQL Developer Zone para obter atualizações. Quando uma nova atualização estiver disponível, baixe-a e use-a para substituir o conteúdo das suas tabelas de fuso horário atuais.

  Para instruções para ambos os métodos, consulte Populando as tabelas de fuso horário. O **mysqld** armazena as informações de fuso horário que consulta, portanto, após atualizar as tabelas de fuso horário, reinicie o **mysqld** para garantir que ele não continue a fornecer dados de fuso horário desatualizados.

Se você não tiver certeza se os fusos horários nomeados estão disponíveis, para serem usados como configuração do fuso horário do servidor ou por clientes que definem seu próprio fuso horário, verifique se suas tabelas de fuso horário estão vazias. A consulta a seguir determina se a tabela que contém os nomes dos fusos horários tem alguma linha:

```sql
mysql> SELECT COUNT(*) FROM mysql.time_zone_name;
+----------+
| COUNT(*) |
+----------+
|        0 |
+----------+
```

Um número de zero indica que a tabela está vazia. Nesse caso, nenhuma aplicação está atualmente usando fusos horários nomeados, e você não precisa atualizar as tabelas (a menos que queira habilitar o suporte a fusos horários nomeados). Um número maior que zero indica que a tabela não está vazia e que seu conteúdo está disponível para ser usado para o suporte a fusos horários nomeados. Nesse caso, certifique-se de recarregar suas tabelas de fusos horários para que as aplicações que usam fusos horários nomeados obtenham resultados de consulta corretos.

Para verificar se sua instalação do MySQL está atualizada corretamente para uma mudança nas regras do horário de verão, use um teste como o seguinte. O exemplo usa valores apropriados para a mudança de 1 hora do horário de verão de 2007 que ocorre nos Estados Unidos em 11 de março, às 2h.

O teste utiliza esta consulta:

```sql
SELECT
  CONVERT_TZ('2007-03-11 2:00:00','US/Eastern','US/Central') AS time1,
  CONVERT_TZ('2007-03-11 3:00:00','US/Eastern','US/Central') AS time2;
```

Os dois valores de tempo indicam os momentos em que a mudança da hora de verão ocorre, e o uso de fusos horários nomeados exige que as tabelas de fuso horário sejam usadas. O resultado desejado é que ambas as consultas retornem o mesmo resultado (o horário de entrada, convertido para o valor equivalente no fuso horário 'US/Central').

Antes de atualizar as tabelas de fuso horário, você verá um resultado incorreto como este:

```sql
+---------------------+---------------------+
| time1               | time2               |
+---------------------+---------------------+
| 2007-03-11 01:00:00 | 2007-03-11 02:00:00 |
+---------------------+---------------------+
```

Depois de atualizar as tabelas, você deve ver o resultado correto:

```sql
+---------------------+---------------------+
| time1               | time2               |
+---------------------+---------------------+
| 2007-03-11 01:00:00 | 2007-03-11 01:00:00 |
+---------------------+---------------------+
```

#### Suporte para o segundo intercalar do fuso horário

Os valores do segundo intercalar são retornados com uma parte de hora que termina com `:59:59`. Isso significa que uma função como `NOW()` pode retornar o mesmo valor para dois ou três segundos consecutivos durante o segundo intercalar. Resta claro que valores temporais literais que têm uma parte de hora que termina com `:59:60` ou `:59:61` são considerados inválidos.

Se for necessário procurar por valores de `TIMESTAMP` um segundo antes do segundo intercalar, resultados anormais podem ser obtidos se você usar uma comparação com valores de `'YYYY-MM-DD hh:mm:ss'`. O exemplo a seguir demonstra isso. Ele altera o fuso horário da sessão para UTC, de modo que não haja diferença entre os valores internos de `TIMESTAMP` (que estão em UTC) e os valores exibidos (que têm a correção de fuso horário aplicada).

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

Para contornar isso, você pode usar uma comparação com base no valor UTC realmente armazenado na coluna, que tem a correção do segundo intercalar aplicada:

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
