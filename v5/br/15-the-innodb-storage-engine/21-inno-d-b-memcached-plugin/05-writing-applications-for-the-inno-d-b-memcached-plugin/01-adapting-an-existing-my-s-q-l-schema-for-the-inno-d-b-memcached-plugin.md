#### 14.21.5.1 Adaptando um Schema Existente do MySQL para o Plugin memcached do InnoDB

Considere esses aspectos das aplicações do **memcached** ao adaptar um esquema ou aplicativo existente do MySQL para usar o plugin `daemon_memcached`:

- As chaves do **memcached** não podem conter espaços ou novas linhas, pois esses caracteres são usados como separadores no protocolo ASCII. Se você estiver usando valores de busca que contêm espaços, transforme-os ou use hash para valores sem espaços antes de usá-los como chaves em chamadas para `add()`, `set()`, `get()` e assim por diante. Embora, teoricamente, esses caracteres sejam permitidos em chaves em programas que usam o protocolo binário, você deve restringir os caracteres usados em chaves para garantir compatibilidade com uma ampla gama de clientes.

- Se houver uma coluna primária numérica curta em uma tabela `InnoDB`, use-a como a chave de busca única para o **memcached**, convertendo o inteiro em um valor de string. Se o servidor **memcached** for usado para múltiplas aplicações ou com mais de uma tabela `InnoDB`, considere modificar o nome para garantir que seja único. Por exemplo, adicione o nome da tabela ou o nome do banco de dados e o nome da tabela antes do valor numérico.

  Nota

  O plugin `daemon_memcached` suporta inserções e leituras em tabelas mapeadas `InnoDB` que têm um `INTEGER` definido como chave primária.

- Você não pode usar uma tabela particionada para dados consultados ou armazenados usando **memcached**.

- O protocolo **memcached** passa valores numéricos como strings. Para armazenar valores numéricos na tabela subjacente `InnoDB`, para implementar contadores que podem ser usados em funções SQL, como `SUM()` ou `AVG()`, por exemplo:

  - Use colunas `VARCHAR` com caracteres suficientes para armazenar todos os dígitos do número maior esperado (e caracteres adicionais, se apropriado para o sinal negativo, ponto decimal ou ambos).

  - Em qualquer consulta que realize operações aritméticas usando valores de coluna, use a função `CAST()` para converter os valores de string para inteiro ou para outro tipo numérico. Por exemplo:

    ```sql
    # Alphabetic entries are returned as zero.

    SELECT CAST(c2 as unsigned integer) FROM demo_test;

    # Since there could be numeric values of 0, can't disqualify them.
    # Test the string values to find the ones that are integers, and average only those.

    SELECT AVG(cast(c2 as unsigned integer)) FROM demo_test
      WHERE c2 BETWEEN '0' and '9999999999';

    # Views let you hide the complexity of queries. The results are already converted;
    # no need to repeat conversion functions and WHERE clauses each time.

    CREATE VIEW numbers AS SELECT c1 KEY, CAST(c2 AS UNSIGNED INTEGER) val
      FROM demo_test WHERE c2 BETWEEN '0' and '9999999999';
    SELECT SUM(val) FROM numbers;
    ```

    Nota

    Quaisquer valores alfabeticas no conjunto de resultados são convertidos em 0 pela chamada ao `CAST()`. Ao usar funções como `AVG()`, que dependem do número de linhas no conjunto de resultados, inclua cláusulas `WHERE` para filtrar valores não numéricos.

- Se a coluna `InnoDB` usada como chave pudesse ter valores maiores que 250 bytes, faça o hashing do valor para menos de 250 bytes.

- Para usar uma tabela existente com o plugin `daemon_memcached`, defina uma entrada para ela na tabela `innodb_memcache.containers`. Para tornar essa tabela a padrão para todas as solicitações do **memcached**, especifique um valor de `default` na coluna `name`, e, em seguida, reinicie o servidor MySQL para que a mudança entre em vigor. Se você usar várias tabelas para diferentes classes de dados do **memcached**, configure várias entradas na tabela `innodb_memcache.containers` com valores de `name` de sua escolha, e, em seguida, faça uma solicitação do **memcached** na forma de `get @@name` ou `set @@name` dentro do aplicativo para especificar a tabela a ser usada para solicitações subsequentes do **memcached**.

  Para um exemplo de uso de uma tabela diferente da tabela predefinida `test.demo_test`, consulte o Exemplo 14.13, “Usando sua própria tabela com um aplicativo InnoDB memcached”. Para o layout da tabela necessário, consulte a Seção 14.21.7, “Interna do Plugin InnoDB memcached”.

- Para usar múltiplos valores de coluna da tabela `InnoDB` com pares de chaves `memcached`, especifique os nomes das colunas separados por vírgula, ponto e vírgula, espaço ou caracteres de barramento no campo `value_columns` da entrada `innodb_memcache.containers` para a tabela `InnoDB`. Por exemplo, especifique `col1,col2,col3` ou `col1|col2|col3` no campo `value_columns`.

  Concatenar os valores da coluna em uma única string usando o caractere de barramento como separador antes de passar a string para as chamadas **memcached** `add` ou `set`. A string é despacota automaticamente na coluna correta. Cada chamada `get` retorna uma única string contendo os valores da coluna, também delimitada pelo caractere de barramento. Você pode despacotá-los usando a sintaxe da linguagem de aplicativo apropriada.

**Exemplo 14.13: Usando sua própria tabela com um aplicativo InnoDB memcached**

Este exemplo mostra como usar sua própria tabela com um aplicativo Python de amostra que usa o `memcached` para manipulação de dados.

O exemplo assume que o plugin `daemon_memcached` está instalado conforme descrito na Seção 14.21.3, “Configurando o Plugin InnoDB memcached”. Também assume que o sistema está configurado para executar um script Python que utiliza o módulo `python-memcache`.

1. Crie a tabela `multicol`, que armazena informações sobre o país, incluindo população, área e dados do lado do motorista (`'R'` para direita e `'L'` para esquerda).

   ```sql
   mysql> USE test;

   mysql> CREATE TABLE `multicol` (
           `country` varchar(128) NOT NULL DEFAULT '',
           `population` varchar(10) DEFAULT NULL,
           `area_sq_km` varchar(9) DEFAULT NULL,
           `drive_side` varchar(1) DEFAULT NULL,
           `c3` int(11) DEFAULT NULL,
           `c4` bigint(20) unsigned DEFAULT NULL,
           `c5` int(11) DEFAULT NULL,
           PRIMARY KEY (`country`)
           ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
   ```

2. Insira um registro na tabela `innodb_memcache.containers` para que o plugin `daemon_memcached` possa acessar a tabela `multicol`.

   ```sql
   mysql> INSERT INTO innodb_memcache.containers
          (name,db_schema,db_table,key_columns,value_columns,flags,cas_column,
          expire_time_column,unique_idx_name_on_key)
          VALUES
          ('bbb','test','multicol','country','population,area_sq_km,drive_side',
          'c3','c4','c5','PRIMARY');

   mysql> COMMIT;
   ```

   - O registro `innodb_memcache.containers` para a tabela `multicol` especifica um valor `name` de `'bbb'`, que é o identificador da tabela.

     Nota

     Se uma única tabela `InnoDB` for usada para todas as aplicações do **memcached**, o valor `name` pode ser definido como `default` para evitar o uso da notação `@@` para alternar entre as tabelas.

   - A coluna `db_schema` está definida como `test`, que é o nome do banco de dados onde a tabela `multicol` reside.

   - A coluna `db_table` está definida como `multicol`, que é o nome da tabela `InnoDB`.

   - `key_columns` está definido como a coluna `country` única. A coluna `country` é definida como a chave primária na definição da tabela `multicol`.

   - Em vez de uma única coluna da tabela `InnoDB` para armazenar um valor de dados composto, os dados são divididos entre três colunas da tabela (`população`, `área_km²` e `lado_da_estrada`). Para acomodar múltiplas colunas de valor, uma lista separada por vírgula de colunas é especificada no campo `colunas_de_valor`. As colunas definidas no campo `colunas_de_valor` são as colunas usadas ao armazenar ou recuperar valores.

   - Os valores dos campos `flags`, `expire_time` e `cas_column` são baseados nos valores usados na tabela `demo.test`. Esses campos geralmente não são significativos em aplicações que usam o plugin `daemon_memcached`, porque o MySQL mantém os dados sincronizados e não há necessidade de se preocupar com dados que expiram ou ficam desatualizados.

   - O campo `unique_idx_name_on_key` está definido como `PRIMARY`, o que se refere ao índice primário definido na coluna `unique` `country` na tabela `multicol`.

3. Copie o aplicativo de exemplo em Python em um arquivo. Neste exemplo, o script de exemplo é copiado para um arquivo chamado `multicol.py`.

   O aplicativo Python de amostra insere dados na tabela `multicol` e recupera dados para todas as chaves, demonstrando como acessar uma tabela `InnoDB` através do plugin `daemon_memcached`.

   ```sql
   import sys, os
   import memcache

   def connect_to_memcached():
     memc = memcache.Client(['127.0.0.1:11211'], debug=0);
     print "Connected to memcached."
     return memc

   def banner(message):
     print
     print "=" * len(message)
     print message
     print "=" * len(message)

   country_data = [
   ("Canada","34820000","9984670","R"),
   ("USA","314242000","9826675","R"),
   ("Ireland","6399152","84421","L"),
   ("UK","62262000","243610","L"),
   ("Mexico","113910608","1972550","R"),
   ("Denmark","5543453","43094","R"),
   ("Norway","5002942","385252","R"),
   ("UAE","8264070","83600","R"),
   ("India","1210193422","3287263","L"),
   ("China","1347350000","9640821","R"),
   ]

   def switch_table(memc,table):
     key = "@@" + table
     print "Switching default table to '" + table + "' by issuing GET for '" + key + "'."
     result = memc.get(key)

   def insert_country_data(memc):
     banner("Inserting initial data via memcached interface")
     for item in country_data:
       country = item[0]
       population = item[1]
       area = item[2]
       drive_side = item[3]

       key = country
       value = "|".join([population,area,drive_side])
       print "Key = " + key
       print "Value = " + value

       if memc.add(key,value):
         print "Added new key, value pair."
       else:
         print "Updating value for existing key."
         memc.set(key,value)

   def query_country_data(memc):
     banner("Retrieving data for all keys (country names)")
     for item in country_data:
       key = item[0]
       result = memc.get(key)
       print "Here is the result retrieved from the database for key " + key + ":"
       print result
       (m_population, m_area, m_drive_side) = result.split("|")
       print "Unpacked population value: " + m_population
       print "Unpacked area value      : " + m_area
       print "Unpacked drive side value: " + m_drive_side

   if __name__ == '__main__':

     memc = connect_to_memcached()
     switch_table(memc,"bbb")
     insert_country_data(memc)
     query_country_data(memc)

     sys.exit(0)
   ```

   Notas de aplicação em Python:

   - Não é necessária autorização de banco de dados para executar o aplicativo, uma vez que a manipulação de dados é realizada através da interface **memcached**. A única informação necessária é o número da porta no sistema local onde o daemon **memcached** está ouvindo.

   - Para garantir que o aplicativo use a tabela `multicol`, a função `switch_table()` é chamada, que realiza um pedido `get` ou `set` fictício usando a notação `@@`. O valor `name` no pedido é `bbb`, que é o identificador da tabela `multicol` definido no campo `innodb_memcache.containers.name`.

     Um valor de `nome` mais descritivo pode ser usado em uma aplicação real. Este exemplo ilustra simplesmente que um identificador de tabela é especificado em vez do nome da tabela nos pedidos `get @@...`.

   - As funções de utilitário usadas para inserir e consultar dados demonstram como transformar uma estrutura de dados Python em valores separados por vírgula para enviar dados para o MySQL com solicitações `add` ou `set`, e como desempacotar os valores separados por vírgula retornados pelas solicitações `get`. Esse processamento adicional é necessário apenas ao mapear um único valor **memcached** para múltiplas colunas de tabelas MySQL.

4. Execute o aplicativo Python de amostra.

   ```sql
   $> python multicol.py
   ```

   Se for bem-sucedido, o aplicativo de amostra retorna esta saída:

   ```sql
   Connected to memcached.
   Switching default table to 'bbb' by issuing GET for '@@bbb'.

   ==============================================
   Inserting initial data via memcached interface
   ==============================================
   Key = Canada
   Value = 34820000|9984670|R
   Added new key, value pair.
   Key = USA
   Value = 314242000|9826675|R
   Added new key, value pair.
   Key = Ireland
   Value = 6399152|84421|L
   Added new key, value pair.
   Key = UK
   Value = 62262000|243610|L
   Added new key, value pair.
   Key = Mexico
   Value = 113910608|1972550|R
   Added new key, value pair.
   Key = Denmark
   Value = 5543453|43094|R
   Added new key, value pair.
   Key = Norway
   Value = 5002942|385252|R
   Added new key, value pair.
   Key = UAE
   Value = 8264070|83600|R
   Added new key, value pair.
   Key = India
   Value = 1210193422|3287263|L
   Added new key, value pair.
   Key = China
   Value = 1347350000|9640821|R
   Added new key, value pair.

   ============================================
   Retrieving data for all keys (country names)
   ============================================
   Here is the result retrieved from the database for key Canada:
   34820000|9984670|R
   Unpacked population value: 34820000
   Unpacked area value      : 9984670
   Unpacked drive side value: R
   Here is the result retrieved from the database for key USA:
   314242000|9826675|R
   Unpacked population value: 314242000
   Unpacked area value      : 9826675
   Unpacked drive side value: R
   Here is the result retrieved from the database for key Ireland:
   6399152|84421|L
   Unpacked population value: 6399152
   Unpacked area value      : 84421
   Unpacked drive side value: L
   Here is the result retrieved from the database for key UK:
   62262000|243610|L
   Unpacked population value: 62262000
   Unpacked area value      : 243610
   Unpacked drive side value: L
   Here is the result retrieved from the database for key Mexico:
   113910608|1972550|R
   Unpacked population value: 113910608
   Unpacked area value      : 1972550
   Unpacked drive side value: R
   Here is the result retrieved from the database for key Denmark:
   5543453|43094|R
   Unpacked population value: 5543453
   Unpacked area value      : 43094
   Unpacked drive side value: R
   Here is the result retrieved from the database for key Norway:
   5002942|385252|R
   Unpacked population value: 5002942
   Unpacked area value      : 385252
   Unpacked drive side value: R
   Here is the result retrieved from the database for key UAE:
   8264070|83600|R
   Unpacked population value: 8264070
   Unpacked area value      : 83600
   Unpacked drive side value: R
   Here is the result retrieved from the database for key India:
   1210193422|3287263|L
   Unpacked population value: 1210193422
   Unpacked area value      : 3287263
   Unpacked drive side value: L
   Here is the result retrieved from the database for key China:
   1347350000|9640821|R
   Unpacked population value: 1347350000
   Unpacked area value      : 9640821
   Unpacked drive side value: R
   ```

5. Consulte a tabela `innodb_memcache.containers` para visualizar o registro que você inseriu anteriormente para a tabela `multicol`. O primeiro registro é a entrada de amostra para a tabela `demo_test` que é criada durante a configuração inicial do plugin `daemon_memcached`. O segundo registro é a entrada que você inseriu para a tabela `multicol`.

   ```sql
   mysql> SELECT * FROM innodb_memcache.containers\G
   *************************** 1. row ***************************
                     name: aaa
                db_schema: test
                 db_table: demo_test
              key_columns: c1
            value_columns: c2
                    flags: c3
               cas_column: c4
       expire_time_column: c5
   unique_idx_name_on_key: PRIMARY
   *************************** 2. row ***************************
                     name: bbb
                db_schema: test
                 db_table: multicol
              key_columns: country
            value_columns: population,area_sq_km,drive_side
                    flags: c3
               cas_column: c4
       expire_time_column: c5
   unique_idx_name_on_key: PRIMARY
   ```

6. Faça uma consulta à tabela `multicol` para visualizar os dados inseridos pelo aplicativo Python de amostra. Os dados estão disponíveis para consultas MySQL, o que demonstra como os mesmos dados podem ser acessados usando SQL ou através de aplicativos (usando o conector ou API MySQL apropriados).

   ```sql
   mysql> SELECT * FROM test.multicol;
   +---------+------------+------------+------------+------+------+------+
   | country | population | area_sq_km | drive_side | c3   | c4   | c5   |
   +---------+------------+------------+------------+------+------+------+
   | Canada  | 34820000   | 9984670    | R          |    0 |   11 |    0 |
   | China   | 1347350000 | 9640821    | R          |    0 |   20 |    0 |
   | Denmark | 5543453    | 43094      | R          |    0 |   16 |    0 |
   | India   | 1210193422 | 3287263    | L          |    0 |   19 |    0 |
   | Ireland | 6399152    | 84421      | L          |    0 |   13 |    0 |
   | Mexico  | 113910608  | 1972550    | R          |    0 |   15 |    0 |
   | Norway  | 5002942    | 385252     | R          |    0 |   17 |    0 |
   | UAE     | 8264070    | 83600      | R          |    0 |   18 |    0 |
   | UK      | 62262000   | 243610     | L          |    0 |   14 |    0 |
   | USA     | 314242000  | 9826675    | R          |    0 |   12 |    0 |
   +---------+------------+------------+------------+------+------+------+
   ```

   Nota

   Sempre permita um tamanho suficiente para conter os dígitos necessários, pontos decimais, caracteres de sinal, zeros iniciais, etc., ao definir a largura das colunas que são tratadas como números. Valores muito longos em uma coluna de string, como um `VARCHAR`, são truncados removendo alguns caracteres, o que pode produzir valores numéricos sem sentido.

7. Opcionalmente, execute consultas de tipo relatório na tabela `InnoDB` que armazena os dados do **memcached**.

   Você pode gerar relatórios por meio de consultas SQL, realizando cálculos e testes em qualquer coluna, não apenas na coluna chave `country`. (Como os exemplos a seguir usam dados de apenas alguns países, os números são apenas para fins ilustrativos.) As seguintes consultas retornam a população média dos países onde as pessoas dirigem à direita e o tamanho médio dos países cujos nomes começam com “U”:

   ```sql
   mysql> SELECT AVG(population) FROM multicol WHERE drive_side = 'R';
   +-------------------+
   | avg(population)   |
   +-------------------+
   | 261304724.7142857 |
   +-------------------+

   mysql> SELECT SUM(area_sq_km) FROM multicol WHERE country LIKE 'U%';
   +-----------------+
   | sum(area_sq_km) |
   +-----------------+
   |        10153885 |
   +-----------------+
   ```

   Como as colunas `population` e `area_sq_km` armazenam dados de caracteres em vez de dados numéricos fortemente tipados, funções como `AVG()` e `SUM()` funcionam convertendo cada valor para um número primeiro. Essa abordagem *não funciona* para operadores como `<` ou `>`, por exemplo, ao comparar valores baseados em caracteres, `9 > 1000`, o que não é esperado de uma cláusula como `ORDER BY population DESC`. Para o tratamento de tipos mais preciso, realize consultas em vistas que convertam colunas numéricas para os tipos apropriados. Essa técnica permite que você execute consultas simples de `SELECT *` a partir de aplicativos de banco de dados, garantindo que a conversão, filtragem e ordenação sejam corretas. O exemplo a seguir mostra uma vista que pode ser consultada para encontrar os três países mais populosos em ordem decrescente de população, com os resultados refletindo os dados mais recentes na tabela `multicol`, e com as figuras de população e área tratadas como números:

   ```sql
   mysql> CREATE VIEW populous_countries AS
          SELECT
          country,
          cast(population as unsigned integer) population,
          cast(area_sq_km as unsigned integer) area_sq_km,
          drive_side FROM multicol
          ORDER BY CAST(population as unsigned integer) DESC
          LIMIT 3;

   mysql> SELECT * FROM populous_countries;
   +---------+------------+------------+------------+
   | country | population | area_sq_km | drive_side |
   +---------+------------+------------+------------+
   | China   | 1347350000 |    9640821 | R          |
   | India   | 1210193422 |    3287263 | L          |
   | USA     |  314242000 |    9826675 | R          |
   +---------+------------+------------+------------+

   mysql> DESC populous_countries;
   +------------+---------------------+------+-----+---------+-------+
   | Field      | Type                | Null | Key | Default | Extra |
   +------------+---------------------+------+-----+---------+-------+
   | country    | varchar(128)        | NO   |     |         |       |
   | population | bigint(10) unsigned | YES  |     | NULL    |       |
   | area_sq_km | int(9) unsigned     | YES  |     | NULL    |       |
   | drive_side | varchar(1)          | YES  |     | NULL    |       |
   +------------+---------------------+------+-----+---------+-------+
   ```
