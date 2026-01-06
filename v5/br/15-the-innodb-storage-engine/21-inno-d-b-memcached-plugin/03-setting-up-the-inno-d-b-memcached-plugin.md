### 14.21.3 Configurando o Plugin InnoDB memcached

Esta seção descreve como configurar o plugin `daemon_memcached` em um servidor MySQL. Como o daemon **memcached** está intimamente integrado ao servidor MySQL para evitar o tráfego de rede e minimizar a latência, você realiza esse processo em cada instância MySQL que utiliza essa funcionalidade.

Nota

Antes de configurar o plugin `daemon_memcached`, consulte a Seção 14.21.4, “Considerações de segurança para o plugin InnoDB memcached”, para entender os procedimentos de segurança necessários para prevenir o acesso não autorizado.

#### Pré-requisitos

- O plugin `daemon_memcached` é suportado apenas em plataformas Linux, Solaris e macOS. Outros sistemas operacionais não são suportados.

- Ao construir o MySQL a partir do código-fonte, você deve compilar com `-DWITH_INNODB_MEMCACHED=ON`. Esta opção de compilação gera duas bibliotecas compartilhadas no diretório do plugin MySQL (`plugin_dir`) que são necessárias para executar o plugin `daemon_memcached`:

  - `libmemcached.so`: o plugin do daemon **memcached** para MySQL.

  - `innodb_engine.so`: um plugin da API `InnoDB` para **memcached**.

- O `libevent` deve estar instalado.

  - Se você não construiu o MySQL a partir do código-fonte, a biblioteca `libevent` não está incluída na sua instalação. Use o método de instalação do seu sistema operacional para instalar `libevent` 1.4.12 ou posterior. Por exemplo, dependendo do sistema operacional, você pode usar `apt-get`, `yum` ou `port install`. Por exemplo, no Linux Ubuntu, use:

    ```sql
    sudo apt-get install libevent-dev
    ```

  - Se você instalou o MySQL a partir de uma versão de código-fonte, o `libevent` 1.4.12 está incluído no pacote e está localizado no nível superior do diretório de código-fonte do MySQL. Se você usar a versão incluída do `libevent`, não é necessário realizar nenhuma ação. Se você quiser usar uma versão do sistema local do `libevent`, você deve compilar o MySQL com a opção de compilação `-DWITH_LIBEVENT` definida como `system` ou `yes`.

#### Instalando e configurando o plugin memcached do InnoDB

1. Configure o plugin `daemon_memcached` para que ele possa interagir com as tabelas `InnoDB` executando o script de configuração `innodb_memcached_config.sql`, que está localizado em `MYSQL_HOME/share`. Esse script instala o banco de dados `innodb_memcache` com três tabelas necessárias (`cache_policies`, `config_options` e `containers`). Ele também instala a tabela de exemplo `demo_test` no banco de dados `test`.

   ```sql
   mysql> source MYSQL_HOME/share/innodb_memcached_config.sql
   ```

   Executar o script `innodb_memcached_config.sql` é uma operação única. As tabelas permanecem no lugar se você desinstalar e reinstalar o plugin `daemon_memcached` posteriormente.

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

   Desses quadros, o quadro `innodb_memcache.containers` é o mais importante. As entradas no quadro `containers` fornecem uma correspondência com as colunas das tabelas `InnoDB`. Cada tabela `InnoDB` usada com o plugin `daemon_memcached` requer uma entrada no quadro `containers`.

   O script `innodb_memcached_config.sql` insere uma única entrada na tabela `containers` que fornece uma correspondência para a tabela `demo_test`. Ele também insere uma única linha de dados na tabela `demo_test`. Esses dados permitem que você verifique imediatamente a instalação após a configuração estar concluída.

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

   Para obter mais informações sobre as tabelas `innodb_memcache` e a tabela de exemplo `demo_test`, consulte a Seção 14.21.7, “Interna do Plugin InnoDB memcached”.

2. Ative o plugin `daemon_memcached` executando a instrução `INSTALL PLUGIN`:

   ```sql
   mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
   ```

   Depois que o plugin for instalado, ele será ativado automaticamente toda vez que o servidor MySQL for reiniciado.

#### Verificação da configuração do InnoDB e do memcached

Para verificar a configuração do plugin `daemon_memcached`, use uma sessão **telnet** para emitir comandos **memcached**. Por padrão, o daemon **memcached** escuta na porta 11211.

1. Retorne os dados da tabela `test.demo_test`. A única linha de dados na tabela `demo_test` tem um valor de chave de `AA`.

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

2. Insira dados usando o comando `set`.

   ```sql
   set BB 10 0 16
   GOODBYE, GOODBYE
   STORED
   ```

   onde:

   - `set` é o comando para armazenar um valor

   - `BB` é a chave

   - `10` é uma bandeira para a operação; ignorada pelo **memcached**, mas pode ser usada pelo cliente para indicar qualquer tipo de informação; especifique `0` se não for usado

   - `0` é o tempo de expiração (TTL); especifique `0` se não for usado

   - `16` é o comprimento do bloco de valor fornecido em bytes

   - `GOODBYE, GOODBYE` é o valor que está armazenado

3. Verifique se os dados inseridos estão armazenados no MySQL, conectando-se ao servidor MySQL e consultando a tabela `test.demo_test`.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +----+------------------+------+------+------+
   | c1 | c2               | c3   | c4   | c5   |
   +----+------------------+------+------+------+
   | AA | HELLO, HELLO     |    8 |    0 |    0 |
   | BB | GOODBYE, GOODBYE |   10 |    1 |    0 |
   +----+------------------+------+------+------+
   ```

4. Volte à sessão telnet e recupere os dados que você inseriu anteriormente usando a tecla `BB`.

   ```sql
   get BB
   VALUE BB 10 16
   GOODBYE, GOODBYE
   END
   quit
   ```

Se você desligar o servidor MySQL, que também desliga o servidor **memcached** integrado, as tentativas subsequentes de acessar os dados do **memcached** falharão com um erro de conexão. Normalmente, os dados do **memcached** também desaparecem nesse ponto, e você precisaria da lógica da aplicação para carregar os dados de volta à memória quando o **memcached** for reiniciado. No entanto, o plugin **memcached** do `InnoDB` automatiza esse processo para você.

Quando você reinicia o MySQL, as operações `get` retornam novamente os pares chave-valor que você armazenou na sessão anterior do **memcached**. Quando uma chave é solicitada e o valor associado não está já no cache de memória, o valor é automaticamente pesquisado na tabela MySQL `test.demo_test`.

#### Criando uma nova tabela e mapeamento de coluna

Este exemplo mostra como configurar sua própria tabela `InnoDB` com o plugin `daemon_memcached`.

1. Crie uma tabela `InnoDB`. A tabela deve ter uma coluna chave com um índice único. A coluna chave da tabela `city` é `city_id`, que é definida como chave primária. A tabela também deve incluir colunas para os valores `flags`, `cas` e `expiry`. Pode haver uma ou mais colunas de valor. A tabela `city` tem três colunas de valor (`name`, `state`, `country`).

   Nota

   Não há requisitos especiais em relação aos nomes das colunas, desde que um mapeamento válido seja adicionado à tabela `innodb_memcache.containers`.

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

2. Adicione uma entrada à tabela `innodb_memcache.containers` para que o plugin `daemon_memcached` saiba como acessar a tabela `InnoDB`. A entrada deve satisfazer a definição da tabela `innodb_memcache.containers`. Para uma descrição de cada campo, consulte a Seção 14.21.7, “Interna do Plugin InnoDB memcached”.

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

   A entrada da tabela `innodb_memcache.containers` para a tabela `cidade` é definida da seguinte forma:

   ```sql
   mysql> INSERT INTO `innodb_memcache`.`containers` (
          `name`, `db_schema`, `db_table`, `key_columns`, `value_columns`,
          `flags`, `cas_column`, `expire_time_column`, `unique_idx_name_on_key`)
          VALUES ('default', 'test', 'city', 'city_id', 'name|state|country',
          'flags','cas','expiry','PRIMARY');
   ```

   - `default` é especificado para a coluna `containers.name` para configurar a tabela `city` como a tabela `InnoDB` padrão a ser usada com o plugin `daemon_memcached`.

   - Várias colunas da tabela `InnoDB` (`name`, `state`, `country`) são mapeadas para `containers.value_columns` usando um delimitador `|`.

   - Os campos `flags`, `cas_column` e `expire_time_column` da tabela `innodb_memcache.containers` geralmente não são significativos em aplicações que utilizam o plugin `daemon_memcached`. No entanto, é necessário um campo de tabela `InnoDB` designado para cada um deles. Ao inserir dados, especifique `0` para esses campos se eles não estiverem sendo utilizados.

3. Após atualizar a tabela `innodb_memcache.containers`, reinicie o plugin `daemon_memcache` para aplicar as alterações.

   ```sql
   mysql> UNINSTALL PLUGIN daemon_memcached;

   mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
   ```

4. Usando o telnet, insira dados na tabela `city` usando um comando `set` do **memcached**.

   ```sql
   telnet localhost 11211
   Trying 127.0.0.1...
   Connected to localhost.
   Escape character is '^]'.
   set B 0 0 22
   BANGALORE|BANGALORE|IN
   STORED
   ```

5. Use a consulta da tabela `test.city` no MySQL para verificar se os dados que você inseriu foram armazenados.

   ```sql
   mysql> SELECT * FROM test.city;
   +---------+-----------+-----------+---------+-------+------+--------+
   | city_id | name      | state     | country | flags | cas  | expiry |
   +---------+-----------+-----------+---------+-------+------+--------+
   | B       | BANGALORE | BANGALORE | IN      |     0 |    3 |      0 |
   +---------+-----------+-----------+---------+-------+------+--------+
   ```

6. Use o MySQL para inserir dados adicionais na tabela `test.city`.

   ```sql
   mysql> INSERT INTO city VALUES ('C','CHENNAI','TAMIL NADU','IN', 0, 0 ,0);
   mysql> INSERT INTO city VALUES ('D','DELHI','DELHI','IN', 0, 0, 0);
   mysql> INSERT INTO city VALUES ('H','HYDERABAD','TELANGANA','IN', 0, 0, 0);
   mysql> INSERT INTO city VALUES ('M','MUMBAI','MAHARASHTRA','IN', 0, 0, 0);
   ```

   Nota

   Recomenda-se que você especifique um valor de `0` para os campos `flags`, `cas_column` e `expire_time_column` se eles não forem utilizados.

7. Use o telnet para emitir o comando **memcached** `get` para recuperar os dados que você inseriu usando o MySQL.

   ```sql
   get H
   VALUE H 0 22
   HYDERABAD|TELANGANA|IN
   END
   ```

#### Configurando o Plugin InnoDB memcached

As opções de configuração tradicionais do `memcached` podem ser especificadas em um arquivo de configuração MySQL ou em uma string de inicialização do **mysqld**, codificadas no argumento do parâmetro de configuração `daemon_memcached_option`. As opções de configuração do `memcached` entram em vigor quando o plugin é carregado, o que ocorre toda vez que o servidor MySQL é iniciado.

Por exemplo, para fazer com que o **memcached** ouça na porta 11222 em vez da porta padrão 11211, especifique `-p11222` como um argumento da opção de configuração `daemon_memcached_option`:

```sql
mysqld .... --daemon_memcached_option="-p11222"
```

Outras opções do **memcached** podem ser codificadas na string `daemon_memcached_option`. Por exemplo, você pode especificar opções para reduzir o número máximo de conexões simultâneas, alterar o tamanho máximo de memória para um par chave-valor ou habilitar mensagens de depuração para o log de erros, e assim por diante.

Há também opções de configuração específicas para o plugin `daemon_memcached`. Essas incluem:

- `daemon_memcached_engine_lib_name`: Especifica a biblioteca compartilhada que implementa o plugin **memcached** do **InnoDB**. O ajuste padrão é `innodb_engine.so`.

- `daemon_memcached_engine_lib_path`: O caminho do diretório que contém a biblioteca compartilhada que implementa o plugin **memcached** do **InnoDB**. O padrão é NULL, representando o diretório do plugin.

- `daemon_memcached_r_batch_size`: Define o tamanho do lote de commit para operações de leitura (`get`). Especifica o número de operações de leitura do **memcached** após as quais ocorre um commit. `daemon_memcached_r_batch_size` é definido como 1 por padrão, para que cada solicitação `get` acesse os dados mais recentemente comprometidos na tabela `InnoDB`, seja o dado atualizado através do **memcached** ou pelo SQL. Quando o valor for maior que 1, o contador de operações de leitura é incrementado a cada chamada `get`. Uma chamada `flush_all` redefiniu tanto os contadores de leitura quanto de escrita.

- `daemon_memcached_w_batch_size`: Define o tamanho do lote de commit para operações de escrita (`set`, `replace`, `append`, `prepend`, `incr`, `decr`, e assim por diante). `daemon_memcached_w_batch_size` é definido como 1 por padrão, para que nenhum dado não comprometido seja perdido em caso de uma interrupção, e para que as consultas SQL na tabela subjacente acessem os dados mais recentes. Quando o valor for maior que 1, o contador de operações de escrita é incrementado para cada chamada de `add`, `set`, `incr`, `decr` e `delete`. Uma chamada `flush_all` redefiniu tanto os contadores de leitura quanto de escrita.

Por padrão, você não precisa modificar `daemon_memcached_engine_lib_name` ou `daemon_memcached_engine_lib_path`. Você pode configurar essas opções se, por exemplo, quiser usar um motor de armazenamento diferente para **memcached** (como o motor **memcached** NDB).

Os parâmetros de configuração do plugin `daemon_memcached` podem ser especificados no arquivo de configuração do MySQL ou em uma string de inicialização do **mysqld**. Eles entram em vigor quando você carrega o plugin `daemon_memcached`.

Ao fazer alterações na configuração do plugin `daemon_memcached`, recarregue o plugin para aplicar as alterações. Para isso, execute as seguintes instruções:

```sql
mysql> UNINSTALL PLUGIN daemon_memcached;

mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
```

As configurações, tabelas e dados necessários são preservados quando o plugin é reiniciado.

Para obter informações adicionais sobre como habilitar e desabilitar plugins, consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.
