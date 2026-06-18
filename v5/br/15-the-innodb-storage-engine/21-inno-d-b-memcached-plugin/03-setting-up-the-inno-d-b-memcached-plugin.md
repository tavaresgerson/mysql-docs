### 14.21.3 Configurando o Plugin InnoDB memcached

Esta seção descreve como configurar o plugin `daemon_memcached` em um servidor MySQL. Visto que o daemon **memcached** é estritamente integrado ao servidor MySQL para evitar tráfego de rede e minimizar a *latency*, você realiza este processo em cada instância MySQL que utiliza este recurso.

Nota

Antes de configurar o plugin `daemon_memcached`, consulte a Seção 14.21.4, “Considerações de Segurança para o Plugin InnoDB memcached” para entender os procedimentos de segurança necessários para prevenir acesso não autorizado.

#### Pré-requisitos

* O plugin `daemon_memcached` é suportado apenas nas plataformas Linux, Solaris e macOS. Outros sistemas operacionais não são suportados.

* Ao construir (build) o MySQL a partir do código fonte, você deve construir (build) com `-DWITH_INNODB_MEMCACHED=ON`. Esta opção de build gera duas shared libraries no diretório de plugin do MySQL (`plugin_dir`) que são necessárias para executar o plugin `daemon_memcached`:

  + `libmemcached.so`: o plugin do daemon **memcached** para o MySQL.

  + `innodb_engine.so`: um plugin da API `InnoDB` para o **memcached**.

* O `libevent` deve estar instalado.

  + Se você não construiu (build) o MySQL a partir do código fonte, a library `libevent` não está incluída em sua instalação. Use o método de instalação do seu sistema operacional para instalar o `libevent` 1.4.12 ou posterior. Por exemplo, dependendo do sistema operacional, você pode usar `apt-get`, `yum` ou `port install`. Por exemplo, no Ubuntu Linux, use:

    ```sql
    sudo apt-get install libevent-dev
    ```

  + Se você instalou o MySQL a partir de um release de código fonte, o `libevent` 1.4.12 é empacotado (bundled) com o pacote e está localizado no nível superior do diretório de código fonte do MySQL. Se você usar a versão empacotada do `libevent`, nenhuma ação é necessária. Se você quiser usar uma versão do `libevent` do sistema local, você deve construir (build) o MySQL com a opção de build `-DWITH_LIBEVENT` definida como `system` ou `yes`.

#### Instalando e Configurando o Plugin InnoDB memcached

1. Configure o plugin `daemon_memcached` para que ele possa interagir com as tables `InnoDB`, executando o script de configuração `innodb_memcached_config.sql`, que está localizado em `MYSQL_HOME/share`. Este script instala o database `innodb_memcache` com três tables necessárias (`cache_policies`, `config_options` e `containers`). Ele também instala a table de exemplo `demo_test` no database `test`.

   ```sql
   mysql> source MYSQL_HOME/share/innodb_memcached_config.sql
   ```

   Executar o script `innodb_memcached_config.sql` é uma operação única. As tables permanecem no local caso você desinstale e reinstale o plugin `daemon_memcached` posteriormente.

   ```sql
   mysql> USE innodb_memcache;
   mysql> SHOW TABLES;
   +---------------------------+
   | Tables_in_innodb_memcache |
   +---------------------------+
   | cache_policies            |
   | config_options            |
   | containers                |
   +---------------------------+

   mysql> USE test;
   mysql> SHOW TABLES;
   +----------------+
   | Tables_in_test |
   +----------------+
   | demo_test      |
   +----------------+
   ```

   Destas tables, a table `innodb_memcache.containers` é a mais importante. As entradas na table `containers` fornecem um mapeamento para as colunas das tables `InnoDB`. Cada table `InnoDB` usada com o plugin `daemon_memcached` requer uma entrada na table `containers`.

   O script `innodb_memcached_config.sql` insere uma única entrada na table `containers` que fornece um mapeamento para a table `demo_test`. Ele também insere uma única linha de dados na table `demo_test`. Esses dados permitem que você verifique imediatamente a instalação após a conclusão do setup.

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

   mysql> SELECT * FROM test.demo_test;
   +----+------------------+------+------+------+
   | c1 | c2               | c3   | c4   | c5   |
   +----+------------------+------+------+------+
   | AA | HELLO, HELLO     |    8 |    0 |    0 |
   +----+------------------+------+------+------+
   ```

   Para obter mais informações sobre as tables `innodb_memcache` e a table de exemplo `demo_test`, consulte a Seção 14.21.7, “Detalhes Internos do Plugin InnoDB memcached”.

2. Ative o plugin `daemon_memcached` executando a instrução `INSTALL PLUGIN`:

   ```sql
   mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
   ```

   Uma vez que o plugin é instalado, ele é ativado automaticamente toda vez que o servidor MySQL é reiniciado.

#### Verificando o Setup do InnoDB e memcached

Para verificar o setup do plugin `daemon_memcached`, use uma sessão **telnet** para emitir comandos **memcached**. Por padrão, o daemon **memcached** escuta na porta 11211.

1. Recupere dados da table `test.demo_test`. A única linha de dados na table `demo_test` possui um valor de key de `AA`.

   ```sql
   telnet localhost 11211
   Trying 127.0.0.1...
   Connected to localhost.
   Escape character is '^]'.
   get AA
   VALUE AA 8 12
   HELLO, HELLO
   END
   ```

2. Insira dados usando um comando `set`.

   ```sql
   set BB 10 0 16
   GOODBYE, GOODBYE
   STORED
   ```

   onde:

   * `set` é o comando para armazenar um valor
   * `BB` é a key
   * `10` é um flag para a operação; ignorado pelo **memcached**, mas pode ser usado pelo client para indicar qualquer tipo de informação; especifique `0` se não for usado

   * `0` é o tempo de expiração (TTL); especifique `0` se não for usado

   * `16` é o comprimento do bloco de valor fornecido em bytes

   * `GOODBYE, GOODBYE` é o valor que é armazenado

3. Verifique se os dados inseridos estão armazenados no MySQL, conectando-se ao servidor MySQL e executando um Query na table `test.demo_test`.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +----+------------------+------+------+------+
   | c1 | c2               | c3   | c4   | c5   |
   +----+------------------+------+------+------+
   | AA | HELLO, HELLO     |    8 |    0 |    0 |
   | BB | GOODBYE, GOODBYE |   10 |    1 |    0 |
   +----+------------------+------+------+------+
   ```

4. Retorne à sessão telnet e recupere os dados que você inseriu anteriormente usando a key `BB`.

   ```sql
   get BB
   VALUE BB 10 16
   GOODBYE, GOODBYE
   END
   quit
   ```

Se você desligar o servidor MySQL, o que também desliga o servidor **memcached** integrado, outras tentativas de acessar os dados **memcached** falharão com um erro de conexão. Normalmente, os dados **memcached** também desaparecem neste ponto, e você precisaria de lógica de aplicação para carregar os dados de volta na memória quando o **memcached** fosse reiniciado. No entanto, o plugin **memcached** do `InnoDB` automatiza esse processo para você.

Quando você reinicia o MySQL, as operações `get` retornam novamente os pares key-value que você armazenou na sessão **memcached** anterior. Quando uma key é solicitada e o valor associado ainda não está no cache de memória, o valor é consultado automaticamente na table `test.demo_test` do MySQL.

#### Criando uma Nova Table e Mapeamento de Colunas

Este exemplo mostra como configurar sua própria table `InnoDB` com o plugin `daemon_memcached`.

1. Crie uma table `InnoDB`. A table deve ter uma coluna de key com um Index unique. A coluna de key da table `city` é `city_id`, que é definida como a Primary Key. A table também deve incluir colunas para os valores `flags`, `cas` e `expiry`. Pode haver uma ou mais colunas de valor. A table `city` tem três colunas de valor (`name`, `state`, `country`).

   Nota

   Não há requisitos especiais em relação aos nomes das colunas, contanto que um mapeamento válido seja adicionado à table `innodb_memcache.containers`.

   ```sql
   mysql> CREATE TABLE city (
          city_id VARCHAR(32),
          name VARCHAR(1024),
          state VARCHAR(1024),
          country VARCHAR(1024),
          flags INT,
          cas BIGINT UNSIGNED,
          expiry INT,
          primary key(city_id)
          ) ENGINE=InnoDB;
   ```

2. Adicione uma entrada à table `innodb_memcache.containers` para que o plugin `daemon_memcached` saiba como acessar a table `InnoDB`. A entrada deve satisfazer a definição da table `innodb_memcache.containers`. Para uma descrição de cada campo, consulte a Seção 14.21.7, “Detalhes Internos do Plugin InnoDB memcached”.

   ```sql
   mysql> DESCRIBE innodb_memcache.containers;
   +------------------------+--------------+------+-----+---------+-------+
   | Field                  | Type         | Null | Key | Default | Extra |
   +------------------------+--------------+------+-----+---------+-------+
   | name                   | varchar(50)  | NO   | PRI | NULL    |       |
   | db_schema              | varchar(250) | NO   |     | NULL    |       |
   | db_table               | varchar(250) | NO   |     | NULL    |       |
   | key_columns            | varchar(250) | NO   |     | NULL    |       |
   | value_columns          | varchar(250) | YES  |     | NULL    |       |
   | flags                  | varchar(250) | NO   |     | 0       |       |
   | cas_column             | varchar(250) | YES  |     | NULL    |       |
   | expire_time_column     | varchar(250) | YES  |     | NULL    |       |
   | unique_idx_name_on_key | varchar(250) | NO   |     | NULL    |       |
   +------------------------+--------------+------+-----+---------+-------+
   ```

   A entrada da table `innodb_memcache.containers` para a table `city` é definida como:

   ```sql
   mysql> INSERT INTO `innodb_memcache`.`containers` (
          `name`, `db_schema`, `db_table`, `key_columns`, `value_columns`,
          `flags`, `cas_column`, `expire_time_column`, `unique_idx_name_on_key`)
          VALUES ('default', 'test', 'city', 'city_id', 'name|state|country',
          'flags','cas','expiry','PRIMARY');
   ```

   * `default` é especificado para a coluna `containers.name` para configurar a table `city` como a table `InnoDB` padrão a ser usada com o plugin `daemon_memcached`.

   * Múltiplas colunas da table `InnoDB` (`name`, `state`, `country`) são mapeadas para `containers.value_columns` usando um delimitador "|".

   * Os campos `flags`, `cas_column` e `expire_time_column` da table `innodb_memcache.containers` geralmente não são significativos em aplicações que usam o plugin `daemon_memcached`. No entanto, é necessária uma coluna de table `InnoDB` designada para cada um. Ao inserir dados, especifique `0` para estas colunas se elas não forem usadas.

3. Após atualizar a table `innodb_memcache.containers`, reinicie o plugin `daemon_memcache` para aplicar as alterações.

   ```sql
   mysql> UNINSTALL PLUGIN daemon_memcached;

   mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
   ```

4. Usando telnet, insira dados na table `city` usando um comando `set` do **memcached**.

   ```sql
   telnet localhost 11211
   Trying 127.0.0.1...
   Connected to localhost.
   Escape character is '^]'.
   set B 0 0 22
   BANGALORE|BANGALORE|IN
   STORED
   ```

5. Usando MySQL, execute um Query na table `test.city` para verificar se os dados que você inseriu foram armazenados.

   ```sql
   mysql> SELECT * FROM test.city;
   +---------+-----------+-----------+---------+-------+------+--------+
   | city_id | name      | state     | country | flags | cas  | expiry |
   +---------+-----------+-----------+---------+-------+------+--------+
   | B       | BANGALORE | BANGALORE | IN      |     0 |    3 |      0 |
   +---------+-----------+-----------+---------+-------+------+--------+
   ```

6. Usando MySQL, insira dados adicionais na table `test.city`.

   ```sql
   mysql> INSERT INTO city VALUES ('C','CHENNAI','TAMIL NADU','IN', 0, 0 ,0);
   mysql> INSERT INTO city VALUES ('D','DELHI','DELHI','IN', 0, 0, 0);
   mysql> INSERT INTO city VALUES ('H','HYDERABAD','TELANGANA','IN', 0, 0, 0);
   mysql> INSERT INTO city VALUES ('M','MUMBAI','MAHARASHTRA','IN', 0, 0, 0);
   ```

   Nota

   É recomendado que você especifique um valor de `0` para os campos `flags`, `cas_column` e `expire_time_column` se eles não forem usados.

7. Usando telnet, emita um comando `get` do **memcached** para recuperar os dados que você inseriu usando MySQL.

   ```sql
   get H
   VALUE H 0 22
   HYDERABAD|TELANGANA|IN
   END
   ```

#### Configurando o Plugin InnoDB memcached

Opções de configuração tradicionais do `memcached` podem ser especificadas em um arquivo de configuração MySQL ou em uma string de startup do **mysqld**, codificadas no argumento do parâmetro de configuração `daemon_memcached_option`. As opções de configuração do `memcached` entram em vigor quando o plugin é carregado, o que ocorre toda vez que o servidor MySQL é iniciado.

Por exemplo, para fazer o **memcached** escutar na porta 11222 em vez da porta padrão 11211, especifique `-p11222` como um argumento da opção de configuração `daemon_memcached_option`:

```sql
mysqld .... --daemon_memcached_option="-p11222"
```

Outras opções do **memcached** podem ser codificadas na string `daemon_memcached_option`. Por exemplo, você pode especificar opções para reduzir o número máximo de conexões simultâneas, alterar o tamanho máximo de memória para um par key-value, ou habilitar mensagens de debugging para o error log, e assim por diante.

Existem também opções de configuração específicas para o plugin `daemon_memcached`. Estas incluem:

* `daemon_memcached_engine_lib_name`: Especifica a shared library que implementa o plugin **memcached** do `InnoDB`. A configuração padrão é `innodb_engine.so`.

* `daemon_memcached_engine_lib_path`: O path do diretório contendo a shared library que implementa o plugin **memcached** do `InnoDB`. O padrão é NULL, representando o diretório do plugin.

* `daemon_memcached_r_batch_size`: Define o tamanho do batch commit para operações de read (`get`). Ele especifica o número de operações de read do **memcached** após o qual um commit ocorre. `daemon_memcached_r_batch_size` é definido como 1 por padrão para que cada requisição `get` acesse os dados mais recentemente committed na table `InnoDB`, independentemente de os dados terem sido atualizados via **memcached** ou por SQL. Quando o valor é maior que 1, o contador para operações de read é incrementado a cada chamada `get`. Uma chamada `flush_all` reseta ambos os contadores de read e write.

* `daemon_memcached_w_batch_size`: Define o tamanho do batch commit para operações de write (`set`, `replace`, `append`, `prepend`, `incr`, `decr`, e assim por diante). `daemon_memcached_w_batch_size` é definido como 1 por padrão para que nenhum dado uncommitted seja perdido em caso de falha, e para que os Queries SQL na table subjacente acessem os dados mais recentes. Quando o valor é maior que 1, o contador para operações de write é incrementado para cada chamada `add`, `set`, `incr`, `decr` e `delete`. Uma chamada `flush_all` reseta ambos os contadores de read e write.

Por padrão, você não precisa modificar `daemon_memcached_engine_lib_name` ou `daemon_memcached_engine_lib_path`. Você pode configurar essas opções se, por exemplo, quiser usar um storage engine diferente para o **memcached** (como o engine NDB **memcached**).

Os parâmetros de configuração do plugin `daemon_memcached` podem ser especificados no arquivo de configuração do MySQL ou em uma string de startup do **mysqld**. Eles entram em vigor quando você carrega o plugin `daemon_memcached`.

Ao fazer alterações na configuração do plugin `daemon_memcached`, recarregue o plugin para aplicar as mudanças. Para fazer isso, emita as seguintes instruções:

```sql
mysql> UNINSTALL PLUGIN daemon_memcached;

mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
```

As configurações, tables necessárias e dados são preservados quando o plugin é reiniciado.

Para obter informações adicionais sobre como habilitar e desabilitar plugins, consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.
