### 7.1.15 Suporte ao Fuso Horário do MySQL Server

Esta seção descreve as configurações do fuso horário mantidas pelo MySQL, como carregar as tabelas do sistema necessárias para o suporte a nomes de horários, como manter-se atualizado com as mudanças de fuso horário e como habilitar o suporte a segundos intercalares.

Os desvios de fuso horário também são suportados para valores de datetime inseridos; consulte a Seção 13.2.2, “Os Tipos DATE, DATETIME e TIMESTAMP”, para obter mais informações.

Para informações sobre as configurações de fuso horário em configurações de replicação, consulte a Seção 19.5.1.14, “Replicação e Funções do Sistema” e a Seção 19.5.1.34, “Replicação e Fusos Horários”.

* Variáveis de Fuso Horário
* Preenchimento das Tabelas de Fuso Horário
* Manter-se Atualizado com Mudanças de Fuso Horário
* Suporte a Segundos Intercalares de Fuso Horário

#### Variáveis de Fuso Horário

O MySQL Server mantém várias configurações de fuso horário:

* O fuso horário do sistema do servidor. Quando o servidor é iniciado, ele tenta determinar o fuso horário da máquina hospedeira e usa-o para definir a variável de sistema `system_time_zone`.

  Para especificar explicitamente o fuso horário do sistema do MySQL Server no início, defina a variável de ambiente `TZ` antes de iniciar o **mysqld**. Se você iniciar o servidor usando **mysqld_safe**, sua opção `--timezone` fornece outra maneira de definir o fuso horário do sistema. Os valores permitidos para `TZ` e `--timezone` dependem do sistema operacional. Consulte a documentação do seu sistema operacional para ver quais valores são aceitáveis.

* O fuso horário do horário atual do servidor. A variável de sistema global `time_zone` indica o fuso horário em que o servidor está operando atualmente. O valor inicial de `time_zone` é `'SYSTEM'`, o que indica que o fuso horário do servidor é o mesmo do fuso horário do sistema.

  Nota

Se configurado como `SYSTEM`, cada chamada de função MySQL que requer um cálculo de fuso horário faz uma chamada à biblioteca do sistema para determinar o fuso horário do sistema atual. Essa chamada pode ser protegida por um mutex global, resultando em disputa.

O valor inicial do fuso horário do servidor global pode ser especificado explicitamente na inicialização com a opção `--default-time-zone` na linha de comando, ou você pode usar a seguinte linha em um arquivo de opções:

```
  default-time-zone='timezone'
  ```

Se você tiver o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`), você pode definir o valor do fuso horário do servidor global em tempo de execução com essa declaração:

```
  SET GLOBAL time_zone = timezone;
  ```

* Fusos horários por sessão. Cada cliente que se conecta tem seu próprio ajuste de fuso horário de sessão, dado pela variável `time_zone` da sessão. Inicialmente, a variável de sessão toma seu valor da variável global `time_zone`, mas o cliente pode alterar seu próprio fuso horário com essa declaração:

```
  SET time_zone = timezone;
  ```

O ajuste do fuso horário de sessão afeta a exibição e o armazenamento de valores de tempo que são sensíveis ao fuso horário. Isso inclui os valores exibidos por funções como `NOW()` ou `CURTIME()`, e valores armazenados em e recuperados de colunas `TIMESTAMP`. Os valores das colunas `TIMESTAMP` são convertidos do fuso horário de sessão para UTC para armazenamento e de UTC para o fuso horário de sessão para recuperação.

O ajuste do fuso horário de sessão não afeta valores exibidos por funções como `UTC_TIMESTAMP()` ou valores em colunas `DATE`, `TIME` ou `DATETIME`. Além disso, os valores desses tipos de dados não são armazenados em UTC; o fuso horário se aplica para eles apenas ao converter valores de `TIMESTAMP`. Se você deseja aritmética específica para o local para valores de `DATE`, `TIME` ou `DATETIME`, converta-os para UTC, realize a aritmética e, em seguida, converta de volta.

Os valores atuais do fuso horário global e de sessão podem ser recuperados da seguinte forma:

```
SELECT @@GLOBAL.time_zone, @@SESSION.time_zone;
```

Os valores de `*``timezone`* podem ser fornecidos em vários formatos, nenhum dos quais é case-sensitive:

* Como o valor `'SYSTEM'`, indicando que o fuso horário do servidor é o mesmo do fuso horário do sistema.

* Como uma string indicando um deslocamento em relação ao UTC na forma `[H]H:MM`, precedida por um `+` ou `-`, como `'+10:00'`, `'-6:00'` ou `'+05:30'`. Um zero inicial pode ser opcionalmente usado para valores de horas menores que 10; o MySQL preenchendo um zero inicial ao armazenar e recuperar o valor nesses casos. O MySQL converte `'-00:00'` ou `'-0:00'` para `'+00:00'`.

Este valor deve estar no intervalo `'-13:59'` a `'+14:00'`, inclusive.

* Como um fuso horário nomeado, como `'Europe/Helsinki'`, `'US/Eastern'`, `'MET'` ou `'UTC'`.

  Nota

  Fusos horários nomeados podem ser usados apenas se as tabelas de informações de fuso horário no banco de dados `mysql` tiverem sido criadas e preenchidas. Caso contrário, o uso de um fuso horário nomeado resulta em um erro:

  ```
  mysql> SET time_zone = 'UTC';
  ERROR 1298 (HY000): Unknown or incorrect time zone: 'UTC'
  ```

#### Preenchimento das Tabelas de Fuso Horário

Existem várias tabelas no esquema do sistema `mysql` para armazenar informações de fuso horário (veja a Seção 7.3, “O esquema do sistema mysql”). O procedimento de instalação do MySQL cria as tabelas de fuso horário, mas não as carrega. Para fazer isso manualmente, use as instruções a seguir.

Nota

Carregar as informações de fuso horário não é necessariamente uma operação única, pois as informações mudam ocasionalmente. Quando tais mudanças ocorrerem, as aplicações que usam as regras antigas ficam desatualizadas e você pode achar necessário recarregar as tabelas de fuso horário para manter as informações usadas pelo seu servidor MySQL atualizadas. Veja Como Manter-se Atualizado com Mudanças de Fuso Horário.

Se o seu sistema tiver seu próprio banco de dados de zoneinfo (o conjunto de arquivos que descrevem os fusos horários), use o programa **mysql_tzinfo_to_sql** para carregar as tabelas de fuso horário. Exemplos de sistemas que possuem esse tipo de banco de dados são Linux, macOS, FreeBSD e Solaris. Um local provável para esses arquivos é o diretório `/usr/share/zoneinfo`. Se o seu sistema não tiver um banco de dados de zoneinfo, você pode usar um pacote para download, conforme descrito mais adiante nesta seção.

Para carregar as tabelas de fuso horário a partir da linha de comando, passe o nome do caminho do diretório de zoneinfo para o **mysql_tzinfo_to_sql** e envie a saída para o programa **mysql**. Por exemplo:

```
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p mysql
```

O comando **mysql** mostrado aqui assume que você se conecta ao servidor usando uma conta como `root` que tenha privilégios para modificar tabelas no esquema do sistema **mysql**. Ajuste os parâmetros de conexão conforme necessário.

O **mysql_tzinfo_to_sql** lê os arquivos de fuso horário do seu sistema e gera declarações SQL a partir deles. O **mysql** processa essas declarações para carregar as tabelas de fuso horário.

O **mysql_tzinfo_to_sql** também pode ser usado para carregar um único arquivo de fuso horário ou gerar informações sobre segundos intercalares:

* Para carregar um único arquivo de fuso horário *`tz_file`* que corresponde a um nome de fuso horário *`tz_name`*, invocando o **mysql_tzinfo_to_sql** da seguinte forma:

  ```
  mysql_tzinfo_to_sql tz_file tz_name | mysql -u root -p mysql
  ```

  Com essa abordagem, você deve executar um comando separado para carregar o arquivo de fuso horário para cada zona nomeada que o servidor precisa saber.

* Se o seu fuso horário precisar considerar segundos intercalares, inicie as informações sobre segundos intercalares da seguinte forma, onde *`tz_file`* é o nome do seu arquivo de fuso horário:

  ```
  mysql_tzinfo_to_sql --leap tz_file | mysql -u root -p mysql
  ```

Após executar o **mysql_tzinfo_to_sql**, reinicie o servidor para que ele não continue a usar quaisquer dados de fuso horário cacheados anteriormente.

Se o seu sistema não tiver um banco de dados zoneinfo (por exemplo, no Windows), você pode usar um pacote que contém instruções SQL disponíveis para download na MySQL Developer Zone:

```
https://dev.mysql.com/downloads/timezones.html
```

Aviso

* **Não** use um pacote de fuso horário para download se o seu sistema tiver um banco de dados zoneinfo. Use o utilitário **mysql_tzinfo_to_sql**. Caso contrário, você pode causar uma diferença no tratamento de datas e horas entre o MySQL e outras aplicações no seu sistema.

Para usar um pacote de fuso horário com instruções SQL que você baixou, descompacte-o e, em seguida, carregue o conteúdo do arquivo descompactado nas tabelas de fuso horário:

```
mysql -u root -p mysql < file_name
```

Em seguida, reinicie o servidor.

Aviso

* **Não** use um pacote de fuso horário para download que contenha tabelas `MyISAM`. Isso é destinado a versões mais antigas do MySQL. O MySQL agora usa `InnoDB` para as tabelas de fuso horário. Tentar substituí-las por tabelas `MyISAM` causa problemas.

#### Manter-se Atualizado com Mudanças de Fuso Horário

Quando as regras de fuso horário mudam, as aplicações que usam as regras antigas ficam desatualizadas. Para se manter atualizado, é necessário garantir que o seu sistema use informações de fuso horário atualizadas. Para o MySQL, há vários fatores a considerar para se manter atualizado:

* O tempo do sistema operacional afeta o valor que o servidor MySQL usa para os horários se o seu fuso horário estiver definido como `SYSTEM`. Certifique-se de que o seu sistema operacional esteja usando as informações de fuso horário mais recentes. Para a maioria dos sistemas operacionais, a atualização ou o service pack mais recente prepara o sistema para as mudanças de horário. Verifique o site do fornecedor do seu sistema operacional para uma atualização que trate as mudanças de horário.

* Se você substituir o arquivo de fuso horário `/etc/localtime` do sistema por uma versão que use regras diferentes das que estão em vigor no **mysqld** ao iniciar, reinicie o **mysqld** para que ele use as regras atualizadas. Caso contrário, o **mysqld** pode não notar quando o sistema altera o horário.

* Se você usar fusos horários nomeados com o MySQL, certifique-se de que as tabelas de fuso horário no banco de dados `mysql` estejam atualizadas:

  + Se o seu sistema tiver seu próprio banco de dados zoneinfo, recarregue as tabelas de fuso horário do MySQL sempre que o banco de dados zoneinfo for atualizado.

  + Para sistemas que não têm seu próprio banco de dados zoneinfo, verifique o MySQL Developer Zone para atualizações. Quando uma nova atualização estiver disponível, baixe-a e use-a para substituir o conteúdo das suas tabelas de fuso horário atuais.

Para instruções para ambos os métodos, consulte Populando as Tabelas de Fuso Horário. O **mysqld** armazena informações de fuso horário que consulta, então, após atualizar as tabelas de fuso horário, reinicie o **mysqld** para garantir que ele não continue a fornecer dados de fuso horário desatualizados.

Se você não tiver certeza se os fusos horários nomeados estão disponíveis para uso como configuração de fuso horário do servidor ou por clientes que definem seu próprio fuso horário, verifique se suas tabelas de fuso horário estão vazias. A seguinte consulta determina se a tabela que contém os nomes de fuso horário tem alguma linha:

```
mysql> SELECT COUNT(*) FROM mysql.time_zone_name;
+----------+
| COUNT(*) |
+----------+
|        0 |
+----------+
```

Uma contagem de zero indica que a tabela está vazia. Nesse caso, nenhuma aplicação está atualmente usando fusos horários nomeados, e você não precisa atualizar as tabelas (a menos que queira habilitar o suporte a fusos horários nomeados). Uma contagem maior que zero indica que a tabela não está vazia e que seu conteúdo está disponível para ser usado para o suporte a fusos horários nomeados. Nesse caso, certifique-se de recarregar suas tabelas de fuso horário para que as aplicações que usam fusos horários nomeados possam obter resultados de consulta corretos.

Para verificar se sua instalação do MySQL está atualizada corretamente para uma mudança nas regras do horário de verão, use um teste como o seguinte. O exemplo usa valores apropriados para a mudança de 1 hora do horário de verão de 2007 que ocorre nos Estados Unidos em 11 de março, às 2h.

O teste usa esta consulta:

```
SELECT
  CONVERT_TZ('2007-03-11 2:00:00','US/Eastern','US/Central') AS time1,
  CONVERT_TZ('2007-03-11 3:00:00','US/Eastern','US/Central') AS time2;
```

Os dois valores de hora indicam os momentos em que a mudança do horário de verão ocorre, e o uso de fusos horários nomeados exige que as tabelas de fuso horário sejam usadas. O resultado desejado é que ambas as consultas retornem o mesmo resultado (a hora de entrada, convertida para o valor equivalente no fuso horário 'US/Central').

Antes de atualizar as tabelas de fuso horário, você verá um resultado incorreto como este:

```
+---------------------+---------------------+
| time1               | time2               |
+---------------------+---------------------+
| 2007-03-11 01:00:00 | 2007-03-11 02:00:00 |
+---------------------+---------------------+
```

Após atualizar as tabelas, você deve ver o resultado correto:

```
+---------------------+---------------------+
| time1               | time2               |
+---------------------+---------------------+
| 2007-03-11 01:00:00 | 2007-03-11 01:00:00 |
+---------------------+---------------------+
```

#### Suporte a Segundo Levantado do Fuso Horário

Os valores de segundo levantado são retornados com uma parte de hora que termina com `:59:59`. Isso significa que uma função como `NOW()` pode retornar o mesmo valor por dois ou três segundos consecutivos durante o segundo levantado. Resta claro que valores literais de tempo com uma parte de hora que termina com `:59:60` ou `:59:61` são considerados inválidos.

Se for necessário procurar por valores `TIMESTAMP` um segundo antes do segundo levantado, resultados anormais podem ser obtidos se você usar uma comparação com valores `'YYYY-MM-DD hh:mm:ss'` . O exemplo seguinte demonstra isso. Ele muda o fuso horário da sessão para UTC para que não haja diferença entre os valores internos `TIMESTAMP` (que estão em UTC) e os valores exibidos (que têm a correção de fuso horário aplicada).

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

Para contornar isso, você pode usar uma comparação baseada no valor UTC realmente armazenado na coluna, que tem a correção de segundo levantado aplicada:

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