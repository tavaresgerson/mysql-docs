## 17.20 Plugin memcached InnoDB

Importante

O plugin `InnoDB` **memcached** foi removido no MySQL 8.3.0 e foi descontinuado no MySQL 8.0.22.

O plugin `InnoDB` **memcached** (`daemon_memcached`) fornece um daemon **memcached** integrado que armazena e recupera dados automaticamente a partir de tabelas `InnoDB`, transformando o servidor MySQL em um "armazenamento de valores chave" rápido. Em vez de formular consultas em SQL, você pode usar operações simples `get`, `set` e `incr` que evitam o overhead de desempenho associado à análise e construção de uma consulta de otimização. Você também pode acessar as mesmas tabelas `InnoDB` através do SQL para conveniência, consultas complexas, operações em massa e outras vantagens do software de banco de dados tradicional.

Essa interface de "estilo NoSQL" utiliza a API do **memcached** para acelerar as operações de banco de dados, permitindo que o `InnoDB` gerencie o cache de memória usando seu mecanismo de pool de buffers. Os dados modificados por meio de operações do **memcached**, como `add`, `set` e `incr`, são armazenados em disco, nas tabelas do `InnoDB`. A combinação da simplicidade do **memcached** e da confiabilidade e consistência do `InnoDB` oferece aos usuários o melhor de ambos os mundos, conforme explicado na Seção 17.20.1, “Benefícios do Plugin InnoDB memcached”. Para uma visão geral arquitetônica, consulte a Seção 17.20.2, “Arquitetura InnoDB memcached”.

### 17.20.1 Benefícios do Plugin memcached do InnoDB

Esta seção descreve as vantagens do plugin `daemon_memcached`. A combinação das tabelas `InnoDB` e do **memcached** oferece vantagens em relação ao uso de cada uma delas isoladamente.

* O acesso direto ao motor de armazenamento `InnoDB` evita a sobrecarga de análise e planejamento do SQL.

* Executar **memcached** no mesmo espaço de processo do servidor MySQL evita o sobrecarga de rede ao passar solicitações de um lado para o outro.

* Os dados escritos usando o protocolo **memcached** são escritos de forma transparente em uma tabela `InnoDB`, sem passar pela camada SQL do MySQL. Você pode controlar a frequência de escrita para obter um desempenho bruto mais alto ao atualizar dados não críticos.

* Os dados solicitados através do protocolo **memcached** são consultados de forma transparente a partir de uma tabela `InnoDB`, sem passar pela camada SQL do MySQL.

* As solicitações subsequentes pelos mesmos dados são atendidas a partir do pool de buffer `InnoDB`. O pool de buffer lida com o cache de memória. Você pode ajustar o desempenho das operações intensivas em dados usando as opções de configuração `InnoDB`.

* Os dados podem ser não estruturados ou estruturados, dependendo do tipo de aplicação. Você pode criar uma nova tabela para os dados ou usar tabelas existentes.

* `InnoDB` pode lidar com a composição e decomposição de múltiplos valores de coluna em um único valor de item do **memcached**, reduzindo a quantidade de análise e concatenação de strings necessárias em sua aplicação. Por exemplo, você pode armazenar o valor de string `2|4|6|8` no cache **memcached** e ter `InnoDB` dividir o valor com base em um caractere de separador, e então armazenar o resultado em quatro colunas numéricas.

* A transferência entre memória e disco é feita automaticamente, simplificando a lógica da aplicação.

* Os dados são armazenados em um banco de dados MySQL para proteção contra falhas, interrupções e corrupção.

* Você pode acessar a tabela subjacente `InnoDB` por meio do SQL para relatórios, análises, consultas ad hoc, carregamento em massa, cálculos transacionais de múltiplos passos, operações de conjunto, como união e interseção, e outras operações adequadas à expressividade e flexibilidade do SQL.

* Você pode garantir alta disponibilidade usando o plugin `daemon_memcached` em um servidor fonte em combinação com replicação MySQL.

* A integração do **memcached** com o MySQL oferece uma maneira de tornar os dados em memória persistentes, para que você possa usá-los para tipos de dados mais significativos. Você pode usar mais `add`, `incr` e operações de escrita semelhantes em sua aplicação sem se preocupar que os dados possam ser perdidos. Você pode parar e começar o servidor **memcached** sem perder as atualizações feitas nos dados cacheados. Para se proteger contra falhas inesperadas, você pode aproveitar as capacidades de recuperação de falhas, replicação e backup `InnoDB`.

* A forma como o `InnoDB` realiza buscas rápidas de chave primária é uma combinação natural para as consultas de único item do **memcached**. O caminho direto de acesso de nível baixo usado pelo plugin `daemon_memcached` é muito mais eficiente para buscas de chave-valor do que as consultas SQL equivalentes.

* As funcionalidades de serialização do **memcached**, que podem transformar estruturas de dados complexas, arquivos binários ou até mesmo blocos de código em strings armazenáveis, oferecem uma maneira simples de inserir esses objetos em um banco de dados.

* Como você pode acessar os dados subjacentes através do SQL, você pode produzir relatórios, pesquisar ou atualizar em várias chaves e chamar funções como `AVG()` e `MAX()` em dados do **memcached**. Todas essas operações são caras ou complicadas usando o **memcached** por si só.

* Você não precisa carregar manualmente dados no **memcached** no início. À medida que as chaves específicas são solicitadas por uma aplicação, os valores são recuperados automaticamente do banco de dados e armazenados em cache na memória usando o pool de buffers `InnoDB`.

* Como o **memcached** consome relativamente pouca CPU e sua pegada de memória é fácil de controlar, ele pode ser executado confortavelmente ao lado de uma instância do MySQL no mesmo sistema.

* Como a consistência dos dados é aplicada por mecanismos utilizados para tabelas regulares de `InnoDB`, você não precisa se preocupar com dados **memcached** desatualizados ou lógica de fallback para consultar o banco de dados no caso de uma chave ausente.

### 17.20.2 Arquitetura do InnoDB memcached

O plugin `InnoDB` **memcached** implementa o **memcached** como um daemon de plugin de MySQL que acessa o mecanismo de armazenamento `InnoDB` diretamente, ignorando a camada SQL do MySQL.

O diagrama a seguir ilustra como uma aplicação acessa dados através do plugin `daemon_memcached`, em comparação com o SQL.

**Figura 17.4. Servidor MySQL com servidor memcached integrado**

![Shows an application accessing data in the InnoDB storage engine using both SQL and the memcached protocol. Using SQL, the application accesses data through the MySQL Server and Handler API. Using the memcached protocol, the application bypasses the MySQL Server, accessing data through the memcached plugin and InnoDB API. The memcached plugin is comprised of the innodb_memcache interface and optional local cache.](images/innodb_memcached2.png)

Características do plugin `daemon_memcached`:

* **memcached** como um plugin de daemon do **mysqld**. Tanto o **mysqld** quanto o **memcached** funcionam no mesmo espaço de processo, com acesso a dados com latência muito baixa.

* Acesso direto às tabelas `InnoDB`, ignorando o analisador SQL, o otimizador e até mesmo a camada de API do Handler.

* Protocolos padrão do **memcached**, incluindo o protocolo baseado em texto e o protocolo binário. O plugin `daemon_memcached` passa em todos os 55 testes de compatibilidade do comando **memcapable**.

* Suporte para múltiplos colunas. Você pode mapear múltiplas colunas na parte "valor" do armazenamento de chaves e valores, com os valores das colunas delimitados por um caractere de separador especificado pelo usuário.

* Por padrão, o protocolo **memcached** é usado para ler e escrever dados diretamente em `InnoDB`, permitindo que o MySQL gerencie o cache em memória usando o pool de buffers `InnoDB`. As configurações padrão representam uma combinação de alta confiabilidade e o menor número de surpresas para aplicações de banco de dados. Por exemplo, as configurações padrão evitam dados não comprometidos no lado do banco de dados ou dados desatualizados retornados para solicitações **memcached** `get`.

* Os usuários avançados podem configurar o sistema como um servidor tradicional de **memcached**, com todos os dados armazenados apenas no motor de **memcached** (cache de memória), ou usar uma combinação do motor de **memcached** “**memcached**” (cache de memória) e do motor de **memcached** `InnoDB` (`InnoDB` como armazenamento persistente de back-end).

* Controle sobre a frequência com que os dados são passados para frente e para trás entre as operações de `InnoDB` e **memcached** através das opções de configuração `innodb_api_bk_commit_interval`, `daemon_memcached_r_batch_size` e `daemon_memcached_w_batch_size`. As opções de tamanho de lote têm um valor padrão de 1 para máxima confiabilidade.

* A capacidade de especificar opções do **memcached** através do parâmetro de configuração `daemon_memcached_option`. Por exemplo, você pode alterar a porta na qual o **memcached** escuta, reduzir o número máximo de conexões simultâneas, alterar o tamanho máximo de memória para um par chave-valor ou habilitar mensagens de depuração para o log de erro.

* A opção de configuração `innodb_api_trx_level` controla o nível de isolamento de transação em consultas processadas pelo **memcached**. Embora o **memcached** não tenha conceito de transações, você pode usar essa opção para controlar o quão cedo o **memcached** vê as alterações causadas por declarações SQL emitidas na tabela usada pelo plugin **daemon_memcached**. Por padrão, `innodb_api_trx_level` está definido como `READ UNCOMMITTED`.

* A opção `innodb_api_enable_mdl` pode ser usada para bloquear a tabela no nível MySQL, de modo que a tabela mapeada não possa ser eliminada ou alterada por DDL através da interface SQL. Sem o bloqueio, a tabela pode ser eliminada da camada MySQL, mas mantida no armazenamento `InnoDB` até que o **memcached** ou outro usuário deixe de usá-la. “MDL” significa “bloqueio de metadados”.

### 17.20.3 Configurando o Plugin memcached do InnoDB

Esta seção descreve como configurar o plugin `daemon_memcached` em um servidor MySQL. Como o daemon **memcached** é altamente integrado ao servidor MySQL para evitar tráfego de rede e minimizar a latência, você realiza esse processo em cada instância MySQL que utiliza esse recurso.

Nota

Antes de configurar o plugin `daemon_memcached`, consulte a Seção 17.20.5, “Considerações de segurança para o plugin InnoDB memcached”, para entender os procedimentos de segurança necessários para impedir o acesso não autorizado.

#### Pré-requisitos

* O plugin `daemon_memcached` é compatível apenas com as plataformas Linux, Solaris e macOS. Outros sistemas operacionais não são suportados.

* Ao construir o MySQL a partir do código-fonte, você deve construir com `-DWITH_INNODB_MEMCACHED=ON`. Esta opção de compilação gera duas bibliotecas compartilhadas no diretório do plugin MySQL (`plugin_dir`) que são necessárias para executar o plugin `daemon_memcached`:

+ `libmemcached.so`: o plugin do daemon **memcached** para MySQL.

+ `innodb_engine.so`: um plugin da API `InnoDB` para **memcached**.

* `libevent` deve ser instalado.

+ Se você não construiu o MySQL a partir do código-fonte, a biblioteca `libevent` não está incluída em sua instalação. Use o método de instalação para o seu sistema operacional para instalar `libevent` 1.4.12 ou posterior. Por exemplo, dependendo do sistema operacional, você pode usar `apt-get`, `yum` ou `port install`. Por exemplo, no Ubuntu Linux, use:

    ```
    sudo apt-get install libevent-dev
    ```

+ Se você instalou o MySQL a partir de uma versão de código-fonte, `libevent` 1.4.12 está incluído no pacote e está localizado no nível superior do diretório de código-fonte do MySQL. Se você usar a versão incluída do `libevent`, não é necessário realizar nenhuma ação. Se você deseja usar uma versão do sistema local do `libevent`, você deve construir o MySQL com a opção de compilação `-DWITH_LIBEVENT` definida para `system` ou `yes`.

#### Instalando e Configurando o Plugin memcached do InnoDB

1. Configure o plugin `daemon_memcached` para que possa interagir com as tabelas `InnoDB` executando o script de configuração `innodb_memcached_config.sql`, que está localizado em `MYSQL_HOME/share`. Este script instala o banco de dados `innodb_memcache` com três tabelas necessárias (`cache_policies`, `config_options` e `containers`). Ele também instala a tabela de amostra `demo_test` no banco de dados `test`.

   ```
   mysql> source MYSQL_HOME/share/innodb_memcached_config.sql
   ```

Executar o script `innodb_memcached_config.sql` é uma operação única. As tabelas permanecem no lugar se você desinstalar e reinstalar o plugin `daemon_memcached` posteriormente.

   ```
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

Desses quadros, o quadro `innodb_memcache.containers` é o mais importante. As entradas no quadro `containers` fornecem uma mapeo para as colunas do quadro `InnoDB`. Cada quadro `InnoDB` usado com o plugin `daemon_memcached` requer uma entrada no quadro `containers`.

O script `innodb_memcached_config.sql` insere uma única entrada na tabela `containers`, que fornece uma mapeia para a tabela `demo_test`. Ele também insere uma única linha de dados na tabela `demo_test`. Esses dados permitem que você verifique imediatamente a instalação após a configuração ser concluída.

   ```
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

Para mais informações sobre as tabelas `innodb_memcache` e a tabela de amostra `demo_test`, consulte a Seção 17.20.8, “Interiores do Plugin memcached do InnoDB”.

2. Ative o plugin `daemon_memcached` executando a declaração `INSTALL PLUGIN`:

   ```
   mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
   ```

Uma vez que o plugin é instalado, ele é automaticamente ativado toda vez que o servidor MySQL é reiniciado.

#### Verificando a configuração do InnoDB e do memcached

Para verificar a configuração do plugin `daemon_memcached`, use uma sessão **telnet** para emitir comandos do **memcached**. Por padrão, o daemon do **memcached** escuta na porta 11211.

1. Recupere os dados da tabela `test.demo_test`. A única linha de dados na tabela `demo_test` tem um valor chave de `AA`.

   ```
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

   ```
   set BB 10 0 16
   GOODBYE, GOODBYE
   STORED
   ```

onde:

* `set` é o comando para armazenar um valor
   * `BB` é a chave
   * `10` é uma bandeira para a operação; ignorada pelo **memcached**, mas pode ser usada pelo cliente para indicar qualquer tipo de informação; especificar `0` se não for usada

* `0` é o tempo de expiração (TTL); especifique `0` se não for utilizado

* `16` é o comprimento do bloco de valor fornecido em bytes

* `GOODBYE, GOODBYE` é o valor que é armazenado

3. Verifique se os dados inseridos estão armazenados no MySQL, conectando-se ao servidor MySQL e consultando a tabela `test.demo_test`.

   ```
   mysql> SELECT * FROM test.demo_test;
   +----+------------------+------+------+------+
   | c1 | c2               | c3   | c4   | c5   |
   +----+------------------+------+------+------+
   | AA | HELLO, HELLO     |    8 |    0 |    0 |
   | BB | GOODBYE, GOODBYE |   10 |    1 |    0 |
   +----+------------------+------+------+------+
   ```

4. Volte à sessão de telnet e recupere os dados que você inseriu anteriormente usando a tecla `BB`.

   ```
   get BB
   VALUE BB 10 16
   GOODBYE, GOODBYE
   END
   quit
   ```

Se você desligar o servidor MySQL, que também desativa o servidor integrado **memcached**, as tentativas adicionais de acessar os dados do **memcached** falharão com um erro de conexão. Normalmente, os dados do **memcached** também desaparecem neste ponto, e você precisará da lógica da aplicação para carregar os dados de volta à memória quando o **memcached** for reiniciado. No entanto, o plugin **memcached** `InnoDB` automatiza esse processo para você.

Quando você reiniciar o MySQL, as operações `get` retornam novamente os pares chave-valor que você armazenou na sessão anterior do **memcached**. Quando uma chave é solicitada e o valor associado não está já no cache de memória, o valor é automaticamente pesquisado na tabela MySQL `test.demo_test`.

#### Criando uma nova tabela e mapeamento de coluna

Este exemplo mostra como configurar sua própria tabela `InnoDB` com o plugin `daemon_memcached`.

1. Crie uma tabela `InnoDB`. A tabela deve ter uma coluna chave com um índice único. A coluna chave da tabela da cidade é `city_id`, que é definida como chave primária. A tabela também deve incluir colunas para os valores de `flags`, `cas` e `expiry`. Pode haver uma ou mais colunas de valor. A tabela `city` tem três colunas de valor (`name`, `state`, `country`).

Nota

Não há requisitos especiais em relação aos nomes das colunas, desde que uma mapeo válido seja adicionado à tabela `innodb_memcache.containers`.

   ```
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

2. Adicione uma entrada na tabela `innodb_memcache.containers` para que o plugin `daemon_memcached` saiba como acessar a tabela `InnoDB`. A entrada deve satisfazer a definição da tabela `innodb_memcache.containers`. Para uma descrição de cada campo, consulte a Seção 17.20.8, “Interiores do Plugin memcached InnoDB”.

   ```
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

A entrada da tabela `innodb_memcache.containers` para a tabela de cidade é definida como:

   ```
   mysql> INSERT INTO `innodb_memcache`.`containers` (
          `name`, `db_schema`, `db_table`, `key_columns`, `value_columns`,
          `flags`, `cas_column`, `expire_time_column`, `unique_idx_name_on_key`)
          VALUES ('default', 'test', 'city', 'city_id', 'name|state|country',
          'flags','cas','expiry','PRIMARY');
   ```

* `default` é especificado para a coluna `containers.name` para configurar a tabela `city` como a tabela `InnoDB` padrão a ser usada com o plugin `daemon_memcached`.

* Múltiplas colunas da tabela `InnoDB` (`name`, `state`, `country`) são mapeadas para `containers.value_columns` usando um delimitador "|".

* Os campos `flags`, `cas_column` e `expire_time_column` da tabela `innodb_memcache.containers` geralmente não são significativos em aplicações que utilizam o plugin `daemon_memcached`. No entanto, é necessário uma coluna designada da tabela `InnoDB` para cada uma. Ao inserir dados, especifique `0` para essas colunas, se elas não estiverem sendo utilizadas.

3. Após atualizar a tabela `innodb_memcache.containers`, reinicie o plugin `daemon_memcache` para aplicar as alterações.

   ```
   mysql> UNINSTALL PLUGIN daemon_memcached;

   mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
   ```

4. Usando telnet, insira dados na tabela `city` usando um comando de **memcached** `set`.

   ```
   telnet localhost 11211
   Trying 127.0.0.1...
   Connected to localhost.
   Escape character is '^]'.
   set B 0 0 22
   BANGALORE|BANGALORE|IN
   STORED
   ```

5. Usando o MySQL, consulte a tabela `test.city` para verificar se os dados que você inseriu foram armazenados.

   ```
   mysql> SELECT * FROM test.city;
   +---------+-----------+-----------+---------+-------+------+--------+
   | city_id | name      | state     | country | flags | cas  | expiry |
   +---------+-----------+-----------+---------+-------+------+--------+
   | B       | BANGALORE | BANGALORE | IN      |     0 |    3 |      0 |
   +---------+-----------+-----------+---------+-------+------+--------+
   ```

6. Usando o MySQL, insira dados adicionais na tabela `test.city`.

   ```
   mysql> INSERT INTO city VALUES ('C','CHENNAI','TAMIL NADU','IN', 0, 0 ,0);
   mysql> INSERT INTO city VALUES ('D','DELHI','DELHI','IN', 0, 0, 0);
   mysql> INSERT INTO city VALUES ('H','HYDERABAD','TELANGANA','IN', 0, 0, 0);
   mysql> INSERT INTO city VALUES ('M','MUMBAI','MAHARASHTRA','IN', 0, 0, 0);
   ```

Nota

Recomenda-se que você especifique um valor de `0` para os campos `flags`, `cas_column` e `expire_time_column`, se eles não forem utilizados.

7. Usando telnet, emita o comando **memcached** `get` para recuperar dados que você inseriu usando MySQL.

   ```
   get H
   VALUE H 0 22
   HYDERABAD|TELANGANA|IN
   END
   ```

#### Configurando o Plugin memcached do InnoDB

As opções de configuração tradicionais do `memcached` podem ser especificadas em um arquivo de configuração MySQL ou em uma string de inicialização do **mysqld**, codificada no argumento do parâmetro de configuração `daemon_memcached_option`. As opções de configuração do `memcached` entram em vigor quando o plugin é carregado, o que ocorre a cada vez que o servidor MySQL é iniciado.

Por exemplo, para fazer o **memcached** ouvir na porta 11222 em vez da porta padrão 11211, especifique `-p11222` como um argumento da opção de configuração `daemon_memcached_option`:

```
mysqld .... --daemon_memcached_option="-p11222"
```

Outras opções do **memcached** podem ser codificadas na string `daemon_memcached_option`. Por exemplo, você pode especificar opções para reduzir o número máximo de conexões simultâneas, alterar o tamanho máximo de memória para um par chave-valor, ou habilitar mensagens de depuração para o log de erro, e assim por diante.

Existem também opções de configuração específicas para o plugin `daemon_memcached`. Essas incluem:

* `daemon_memcached_engine_lib_name`: Especifica a biblioteca compartilhada que implementa o plugin `InnoDB` **memcached**. O ajuste padrão é `innodb_engine.so`.

* `daemon_memcached_engine_lib_path`: O caminho do diretório que contém a biblioteca compartilhada que implementa o plugin **memcached** `InnoDB`. O padrão é NULL, representando o diretório do plugin.

* `daemon_memcached_r_batch_size`: Define o tamanho do lote de commit para operações de leitura (`get`). Especifica o número de operações de leitura do **memcached** após as quais ocorre um commit. `daemon_memcached_r_batch_size` é definido como 1 por padrão, para que cada solicitação de `get` acesse os dados mais recentemente comprometidos na tabela `InnoDB`, seja o dado atualizado através do **memcached** ou pelo SQL. Quando o valor é maior que 1, o contador de operações de leitura é incrementado a cada chamada de `get`. Uma chamada de `flush_all` redefinirá tanto o contador de leitura quanto o de escrita.

* `daemon_memcached_w_batch_size`: Define o tamanho do lote de commit para operações de escrita (`set`, `replace`, `append`, `prepend`, `incr`, `decr` e assim por diante). `daemon_memcached_w_batch_size` é definido como 1 por padrão, para que nenhum dado não comprometido seja perdido em caso de interrupção, e para que as consultas SQL na tabela subjacente acessem os dados mais recentes. Quando o valor for maior que 1, o contador de operações de escrita é incrementado para cada chamada de `add`, `set`, `incr`, `decr` e `delete`. Uma chamada de `flush_all` redefiniu tanto os contadores de leitura quanto os de escrita.

Por padrão, você não precisa modificar `daemon_memcached_engine_lib_name` ou `daemon_memcached_engine_lib_path`. Você pode configurar essas opções se, por exemplo, você quiser usar um motor de armazenamento diferente para **memcached** (como o motor **memcached** NDB).

Os parâmetros de configuração do plugin `daemon_memcached` podem ser especificados no arquivo de configuração do MySQL ou em uma string de inicialização do **mysqld**. Eles entram em vigor quando você carrega o plugin `daemon_memcached`.

Ao fazer alterações na configuração do plugin `daemon_memcached`, recarregue o plugin para aplicar as alterações. Para fazer isso, emita as seguintes declarações:

```
mysql> UNINSTALL PLUGIN daemon_memcached;

mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
```

As configurações, as tabelas necessárias e os dados são preservados quando o plugin é reiniciado.

Para obter informações adicionais sobre a habilitação e desabilitação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

### 17.20.4 Suporte a múltiplos get e consultas de intervalo do memcached do InnoDB

O plugin `daemon_memcached` suporta várias operações de obtenção (obtenção de múltiplos pares chave-valor em uma única consulta **memcached**) e consultas de intervalo.

#### Operações múltiplas de get

A capacidade de obter vários pares chave-valor em uma única consulta do **memcached** melhora o desempenho de leitura, reduzindo o tráfego de comunicação entre o cliente e o servidor. Para `InnoDB`, isso significa menos transações e operações de tabela aberta.

O exemplo a seguir demonstra o suporte a múltiplos registros. O exemplo utiliza a tabela `test.city`, descrita em Criando uma nova tabela e mapeamento de coluna.

```
mysql> USE test;
mysql> SELECT * FROM test.city;
+---------+-----------+-------------+---------+-------+------+--------+
| city_id | name      | state       | country | flags | cas  | expiry |
+---------+-----------+-------------+---------+-------+------+--------+
| B       | BANGALORE | BANGALORE   | IN      |     0 |    1 |      0 |
| C       | CHENNAI   | TAMIL NADU  | IN      |     0 |    0 |      0 |
| D       | DELHI     | DELHI       | IN      |     0 |    0 |      0 |
| H       | HYDERABAD | TELANGANA   | IN      |     0 |    0 |      0 |
| M       | MUMBAI    | MAHARASHTRA | IN      |     0 |    0 |      0 |
+---------+-----------+-------------+---------+-------+------+--------+
```

Execute um comando `get` para recuperar todos os valores da tabela [[`city`]. Os resultados são retornados em uma sequência de pares chave-valor.

```
telnet 127.0.0.1 11211
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
get B C D H M
VALUE B 0 22
BANGALORE|BANGALORE|IN
VALUE C 0 21
CHENNAI|TAMIL NADU|IN
VALUE D 0 14
DELHI|DELHI|IN
VALUE H 0 22
HYDERABAD|TELANGANA|IN
VALUE M 0 21
MUMBAI|MAHARASHTRA|IN
END
```

Ao recuperar vários valores em um único comando `get`, você pode alternar entre tabelas (usando a notação `@@containers.name`) para recuperar o valor para a primeira chave, mas não pode alternar entre tabelas para chaves subsequentes. Por exemplo, a alternância de tabela neste exemplo é válida:

```
get @@aaa.AA BB
VALUE @@aaa.AA 8 12
HELLO, HELLO
VALUE BB 10 16
GOODBYE, GOODBYE
END
```

Tentar alternar novamente as tabelas no mesmo comando `get` para recuperar um valor de chave de uma tabela diferente não é suportado.

Não há limite para o número de chaves que podem ser recuperadas por uma operação de múltiplo get, mas há um limite de memória de 128 MB para armazenar o resultado.

#### Consultas de intervalo

Para consultas de intervalo, o plugin `daemon_memcached` suporta os seguintes operadores de comparação: `<`, `>`, `<=`, `>=`. Um operador deve ser precedido por um símbolo `@`. Quando uma consulta de intervalo encontra múltiplos pares chave-valor correspondentes, os resultados são retornados em uma sequência de pares chave-valor.

Os exemplos a seguir demonstram o suporte para consulta de intervalo. Os exemplos utilizam a tabela `test.city` descrita em Criando uma nova tabela e mapeamento de coluna.

```
mysql> SELECT * FROM test.city;
+---------+-----------+-------------+---------+-------+------+--------+
| city_id | name      | state       | country | flags | cas  | expiry |
+---------+-----------+-------------+---------+-------+------+--------+
| B       | BANGALORE | BANGALORE   | IN      |     0 |    1 |      0 |
| C       | CHENNAI   | TAMIL NADU  | IN      |     0 |    0 |      0 |
| D       | DELHI     | DELHI       | IN      |     0 |    0 |      0 |
| H       | HYDERABAD | TELANGANA   | IN      |     0 |    0 |      0 |
| M       | MUMBAI    | MAHARASHTRA | IN      |     0 |    0 |      0 |
+---------+-----------+-------------+---------+-------+------+--------+
```

Abra uma sessão de telnet:

```
telnet 127.0.0.1 11211
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
```

Para obter todos os valores maiores que `B`, insira `get @>B`:

```
get @>B
VALUE C 0 21
CHENNAI|TAMIL NADU|IN
VALUE D 0 14
DELHI|DELHI|IN
VALUE H 0 22
HYDERABAD|TELANGANA|IN
VALUE M 0 21
MUMBAI|MAHARASHTRA|IN
END
```

Para obter todos os valores menores que `M`, insira `get @<M`:

```
get @<M
VALUE B 0 22
BANGALORE|BANGALORE|IN
VALUE C 0 21
CHENNAI|TAMIL NADU|IN
VALUE D 0 14
DELHI|DELHI|IN
VALUE H 0 22
HYDERABAD|TELANGANA|IN
END
```

Para obter todos os valores menores ou iguais a `M`, insira `get @<=M`:

```
get @<=M
VALUE B 0 22
BANGALORE|BANGALORE|IN
VALUE C 0 21
CHENNAI|TAMIL NADU|IN
VALUE D 0 14
DELHI|DELHI|IN
VALUE H 0 22
HYDERABAD|TELANGANA|IN
VALUE M 0 21
MUMBAI|MAHARASHTRA|IN
```

Para obter valores maiores que `B`, mas menores que `M`, insira `get @>B@<M`:

```
get @>B@<M
VALUE C 0 21
CHENNAI|TAMIL NADU|IN
VALUE D 0 14
DELHI|DELHI|IN
VALUE H 0 22
HYDERABAD|TELANGANA|IN
END
```

Máximo de dois operadores de comparação podem ser analisados, sendo um operador "menor que" (`@<`) ou "menor que ou igual a" (`@<=`) e o outro operador "maior que" (`@>`) ou "maior que ou igual a" (`@>=`) . Qualquer operador adicional é considerado parte da chave. Por exemplo, se você emitir um comando `get` com três operadores, o terceiro operador (`@>C`) é tratado como parte da chave, e o comando `get` busca valores menores que `M` e maiores que `B@>C`.

```
get @<M@>B@>C
VALUE C 0 21
CHENNAI|TAMIL NADU|IN
VALUE D 0 14
DELHI|DELHI|IN
VALUE H 0 22
HYDERABAD|TELANGANA|IN
```

### 17.20.5 Considerações de segurança para o plugin InnoDB memcached

Cuidado

Consulte esta seção antes de implantar o plugin `daemon_memcached` em um servidor de produção, ou mesmo em um servidor de teste, se a instância do MySQL contiver dados sensíveis.

Como o **memcached** não usa um mecanismo de autenticação por padrão e a autenticação opcional SASL não é tão forte quanto as medidas de segurança tradicionais dos SGBD, mantenha apenas os dados não sensíveis na instância do MySQL que usa o plugin `daemon_memcached` e isole quaisquer servidores que usem essa configuração de possíveis intrusões. Não permita o acesso do **memcached** a esses servidores pela Internet; permita apenas o acesso de dentro de uma intranet com firewall, idealmente de uma sub-rede cuja adesão você possa restringir.

#### Protegendo memcached com senha usando SASL

O suporte SASL fornece a capacidade de proteger seu banco de dados MySQL contra acesso não autenticado por meio de clientes **memcached**. Esta seção explica como habilitar o SASL com o plugin `daemon_memcached`. Os passos são quase idênticos aos realizados para habilitar o SASL em um servidor **memcached** tradicional.

SASL significa “Camada de Segurança e Autenticação Simples”, um padrão para adicionar suporte de autenticação a protocolos baseados em conexão. O **memcached** adicionou suporte SASL na versão 1.4.3.

A autenticação SASL é apenas compatível com o protocolo binário.

Os clientes do **memcached** só conseguem acessar as tabelas `InnoDB` que estão registradas na tabela `innodb_memcache.containers`. Mesmo que um DBA possa colocar restrições de acesso a tais tabelas, o acesso através das aplicações **memcached** não pode ser controlado. Por essa razão, o suporte SASL é fornecido para controlar o acesso às tabelas `InnoDB` associadas ao plugin `daemon_memcached`.

A seção a seguir mostra como construir, habilitar e testar um plugin `daemon_memcached` habilitado para SASL.

#### Construindo e habilitando SASL com o plugin memcached do InnoDB

Por padrão, um plugin `daemon_memcached` habilitado para SASL não está incluído nos pacotes de lançamento do MySQL, uma vez que um plugin `daemon_memcached` habilitado para SASL requer a construção do **memcached** com bibliotecas SASL. Para habilitar o suporte para SASL, faça o download da fonte do MySQL e reconstrua o plugin `daemon_memcached` após baixar as bibliotecas SASL:

1. Instale as bibliotecas de desenvolvimento e utilitárias SASL. Por exemplo, no Ubuntu, use o **apt-get** para obter as bibliotecas:

   ```
   sudo apt-get -f install libsasl2-2 sasl2-bin libsasl2-2 libsasl2-dev libsasl2-modules
   ```

2. Construa as bibliotecas compartilhadas do plugin `daemon_memcached` com capacidade SASL, adicionando `ENABLE_MEMCACHED_SASL=1` às suas opções de **cmake**. O **memcached** também oferece suporte a senha simples em texto claro, o que facilita o teste. Para habilitar o suporte a senha simples em texto claro, especifique a opção **cmake** `ENABLE_MEMCACHED_SASL_PWDB=1`.

Em resumo, adicione as seguintes três opções do **cmake**:

   ```
   cmake ... -DWITH_INNODB_MEMCACHED=1 -DENABLE_MEMCACHED_SASL=1 -DENABLE_MEMCACHED_SASL_PWDB=1
   ```

3. Instale o plugin `daemon_memcached`, conforme descrito na Seção 17.20.3, “Configurando o plugin memcached InnoDB”.

4. Configure um arquivo de nome de usuário e senha. (Este exemplo usa suporte simples a senha em texto claro do **memcached**.)

1. Em um arquivo, crie um usuário com o nome `testname` e defina a senha como `testpasswd`:

      ```
      echo "testname:testpasswd:::::::" >/home/jy/memcached-sasl-db
      ```

2. Configure a variável de ambiente `MEMCACHED_SASL_PWDB` para informar ao `memcached` o nome do usuário e o arquivo de senha:

      ```
      export MEMCACHED_SASL_PWDB=/home/jy/memcached-sasl-db
      ```

3. Informe ao `memcached` que uma senha em texto claro é usada:

      ```
      echo "mech_list: plain" > /home/jy/work2/msasl/clients/memcached.conf
      export SASL_CONF_PATH=/home/jy/work2/msasl/clients
      ```

5. Ative o SASL reiniciando o servidor MySQL com a opção **memcached** `-S` codificada no parâmetro de configuração `daemon_memcached_option`:

   ```
   mysqld ... --daemon_memcached_option="-S"
   ```

6. Para testar a configuração, use um cliente habilitado para SASL, como [SASL-enabled libmemcached][(https://code.launchpad.net/~trond-norbye/libmemcached/sasl)].

   ```
   memcp --servers=localhost:11211 --binary  --username=testname
     --password=password myfile.txt

   memcat --servers=localhost:11211 --binary --username=testname
     --password=password myfile.txt
   ```

Se você especificar um nome de usuário ou senha incorreta, a operação é rejeitada com uma mensagem `memcache error AUTHENTICATION FAILURE`. Nesse caso, examine a senha em texto claro definida no arquivo `memcached-sasl-db` para verificar se as credenciais fornecidas estão corretas.

Existem outros métodos para testar a autenticação SASL com o **memcached**, mas o método descrito acima é o mais direto.

### 17.20.6 Aplicativos de escrita para o plugin memcached do InnoDB

Normalmente, escrever um aplicativo para o plugin `InnoDB` **memcached** envolve algum grau de reescrita ou adaptação de código existente que utiliza MySQL ou a API **memcached**.

* Com o plugin `daemon_memcached`, em vez de muitos servidores tradicionais de **memcached** rodando em máquinas com pouca potência, você tem o mesmo número de servidores de **memcached** que servidores MySQL, rodando em máquinas relativamente potentes com armazenamento de disco e memória substanciais. Você pode reutilizar algum código existente que funciona com a API de **memcached**, mas é provável que seja necessária uma adaptação devido à configuração diferente do servidor.

* Os dados armazenados através do plugin `daemon_memcached` vão para as colunas `VARCHAR`, `TEXT` ou `BLOB`, e devem ser convertidos para realizar operações numéricas. Você pode realizar a conversão no lado do aplicativo ou usando a função `CAST()` em consultas.

* Vindo de um ambiente de banco de dados, você pode estar acostumado com tabelas SQL de uso geral com muitas colunas. As tabelas acessadas pelo código **memcached** provavelmente têm apenas algumas ou até uma única coluna com valores de dados.

* Você pode adaptar partes de sua aplicação que realizam consultas de uma única linha, inserções, atualizações ou exclusões, para melhorar o desempenho em seções críticas do código. Tanto as operações de consulta (leitura) quanto as DML (escrita) podem ser substancialmente mais rápidas quando realizadas através da interface `InnoDB` **memcached**. A melhoria de desempenho para escritas é tipicamente maior do que a melhoria de desempenho para leituras, então você pode focar em adaptar o código que realiza o registro ou registra escolhas interativas em um site.

As seções a seguir exploram esses pontos com mais detalhes.

#### 17.20.6.1 Adaptando um esquema existente do MySQL para o plugin memcached do InnoDB

Considere esses aspectos das aplicações do **memcached** ao adaptar um esquema ou aplicativo existente do MySQL para usar o plugin `daemon_memcached`:

* As chaves do **memcached** não podem conter espaços ou novas linhas, porque esses caracteres são usados como separadores no protocolo ASCII. Se você está usando valores de busca que contêm espaços, transforme-os ou faça uma hash deles em valores sem espaços antes de usá-los como chaves em chamadas para `add()`, `set()`, `get()`, e assim por diante. Embora teoricamente esses caracteres sejam permitidos em chaves em programas que usam o protocolo binário, você deve restringir os caracteres usados em chaves para garantir compatibilidade com uma ampla gama de clientes.

* Se houver uma coluna primária numérica curta em uma tabela `InnoDB`, use-a como a chave de pesquisa única para o **memcached**, convertendo o inteiro em um valor de string. Se o servidor **memcached** for usado para múltiplas aplicações ou com mais de uma tabela `InnoDB`, considere modificar o nome para garantir que seja único. Por exemplo, adicione o nome da tabela ou o nome do banco de dados e o nome da tabela antes do valor numérico.

Nota

O plugin `daemon_memcached` suporta inserções e leituras em tabelas mapeadas `InnoDB` que têm um `INTEGER` definido como chave primária.

* Você não pode usar uma tabela particionada para dados consultados ou armazenados usando **memcached**.

* O protocolo **memcached** passa valores numéricos como strings. Para armazenar valores numéricos na tabela subjacente `InnoDB`, para implementar contadores que possam ser usados em funções SQL, como `SUM()` ou `AVG()`, por exemplo:

+ Use as colunas `VARCHAR` com caracteres suficientes para conter todos os dígitos do número maior esperado (e caracteres adicionais, se apropriado para o sinal negativo, ponto decimal ou ambos).

+ Em qualquer consulta que realize cálculos usando valores de coluna, use a função `CAST()` para converter os valores de string para inteiro ou para outro tipo numérico. Por exemplo:

    ```
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

Qualquer valor alfabético no conjunto de resultados é convertido em 0 pela chamada ao `CAST()`. Ao usar funções como `AVG()`, que dependem do número de linhas no conjunto de resultados, inclua cláusulas `WHERE` para filtrar valores não numéricos.

* Se a coluna `InnoDB` usada como chave pudesse ter valores mais longos que 250 bytes, faça o hash do valor para menos de 250 bytes.

* Para usar uma tabela existente com o plugin `daemon_memcached`, defina uma entrada para ela na tabela `innodb_memcache.containers`. Para tornar essa tabela a padrão para todas as solicitações do **memcached**, especifique um valor de `default` na coluna `name`, em seguida, reinicie o servidor MySQL para que a mudança seja efetiva. Se você usar várias tabelas para diferentes classes de dados do **memcached**, configure várias entradas na tabela `innodb_memcache.containers` com os valores `name` de sua escolha, em seguida, faça uma solicitação do **memcached** na forma de `get @@name` ou `set @@name` dentro do aplicativo para especificar a tabela a ser usada para solicitações subsequentes do **memcached**.

Para um exemplo de uso de uma tabela diferente da tabela predefinida `test.demo_test`, veja o Exemplo 17.13, “Usando sua própria tabela com um aplicativo InnoDB memcached”. Para o layout da tabela necessário, veja a Seção 17.20.8, “Interiores do Plugin InnoDB memcached”.

* Para usar múltiplos valores de coluna da tabela `InnoDB` com pares chave-valor do **memcached**, especifique os nomes das colunas separados por vírgula, ponto e vírgula, espaço ou caracteres de tubo no campo `value_columns` da entrada `innodb_memcache.containers` para a tabela `InnoDB`. Por exemplo, especifique `col1,col2,col3` ou `col1|col2|col3` no campo `value_columns`.

Concatenar os valores da coluna em uma única cadeia de caracteres usando o caractere de barra como separador antes de passar a cadeia de caracteres para as chamadas do **memcached** `add` ou `set`. A cadeia de caracteres é desempacotada automaticamente na coluna correta. Cada chamada `get` retorna uma única cadeia de caracteres contendo os valores da coluna que também é delimitada pelo caractere de barra. Você pode desempacotar os valores usando a sintaxe do idioma de aplicativo apropriado.

**Exemplo 17.13 Usando sua própria tabela com um aplicativo InnoDB memcached**

Este exemplo mostra como usar sua própria tabela com um aplicativo de amostra Python que usa `memcached` para manipulação de dados.

O exemplo assume que o plugin `daemon_memcached` está instalado conforme descrito na Seção 17.20.3, “Configurando o Plugin memcached InnoDB”. Também assume que seu sistema está configurado para executar um script Python que utiliza o módulo `python-memcache`.

1. Crie a tabela `multicol` que armazena informações sobre o país, incluindo população, área e dados do lado do motorista (`'R'` para o lado direito e `'L'` para o lado esquerdo).

   ```
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
           ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
   ```

2. Insira um registro na tabela `innodb_memcache.containers` para que o plugin `daemon_memcached` possa acessar a tabela `multicol`.

   ```
   mysql> INSERT INTO innodb_memcache.containers
          (name,db_schema,db_table,key_columns,value_columns,flags,cas_column,
          expire_time_column,unique_idx_name_on_key)
          VALUES
          ('bbb','test','multicol','country','population,area_sq_km,drive_side',
          'c3','c4','c5','PRIMARY');

   mysql> COMMIT;
   ```

* O registro `innodb_memcache.containers` para a tabela `multicol` especifica um valor `name` de `'bbb'`, que é o identificador da tabela.

Nota

Se uma única tabela `InnoDB` for usada para todas as aplicações do **memcached**, o valor da tabela `name` pode ser definido como `default` para evitar o uso da notação `@@` para alternar entre as tabelas.

* A coluna `db_schema` é definida como `test`, que é o nome do banco de dados onde a tabela `multicol` reside.

* A coluna `db_table` é definida como `multicol`, que é o nome da tabela `InnoDB`.

* `key_columns` é definido na coluna única `country`. A coluna `country` é definida como chave primária na definição da tabela `multicol`.

* Em vez de uma única coluna da tabela `InnoDB` para armazenar um valor de dados composto, os dados são divididos em três colunas da tabela (`population`, `area_sq_km` e `drive_side`). Para acomodar várias colunas de valor, uma lista de colunas separadas por vírgula é especificada no campo `value_columns`. As colunas definidas no campo `value_columns` são as colunas usadas ao armazenar ou recuperar valores.

* Os valores dos campos `flags`, `expire_time` e `cas_column` são baseados nos valores utilizados na tabela de amostra `demo.test`. Esses campos geralmente não são significativos em aplicações que utilizam o plugin `daemon_memcached`, porque o MySQL mantém os dados sincronizados e não há necessidade de se preocupar com dados que expiram ou se tornam obsoletos.

* O campo `unique_idx_name_on_key` é definido como `PRIMARY`, que se refere ao índice primário definido na coluna única `country` na tabela `multicol`.

3. Copie o aplicativo Python de exemplo em um arquivo. Neste exemplo, o script de exemplo é copiado em um arquivo chamado `multicol.py`.

O aplicativo Python de amostra insere dados na tabela `multicol` e recupera dados para todas as chaves, demonstrando como acessar uma tabela `InnoDB` através do plugin `daemon_memcached`.

   ```
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

Notas de aplicação Python de amostra:

* Não é necessária autorização de banco de dados para executar o aplicativo, uma vez que a manipulação de dados é realizada através da interface **memcached**. A única informação necessária é o número da porta no sistema local onde o daemon **memcached** escuta.

* Para garantir que o aplicativo use a tabela `multicol`, a função `switch_table()` é chamada, que realiza um pedido `get` ou `set` fictício usando a notação `@@`. O valor `name` no pedido é `bbb`, que é o identificador da tabela `multicol` definido no campo `innodb_memcache.containers.name`.

Um valor mais descritivo `name` pode ser usado em uma aplicação do mundo real. Este exemplo simplesmente ilustra que um identificador de tabela é especificado em vez do nome da tabela nos pedidos `get @@...`.

* As funções de utilitário usadas para inserir e consultar dados demonstram como transformar uma estrutura de dados Python em valores separados por vírgulas para enviar dados ao MySQL com solicitações `add` ou `set`, e como desempacotar os valores separados por vírgulas retornados pelas solicitações `get`. Esse processamento adicional é necessário apenas ao mapear um único valor de **memcached** para várias colunas de tabela MySQL.

4. Execute o aplicativo Python de amostra.

   ```
   $> python multicol.py
   ```

Se for bem-sucedido, o aplicativo de amostra retorna essa saída:

   ```
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

   ```
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

6. Consulte a tabela `multicol` para visualizar os dados inseridos pelo aplicativo Python de amostra. Os dados estão disponíveis para consultas MySQL, o que demonstra como os mesmos dados podem ser acessados usando SQL ou através de aplicativos (usando o [Conectivo MySQL ou API apropriado][(connectors-apis.html "Chapter 31 Connectors and APIs")]).

   ```
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

Sempre permita tamanho suficiente para conter os dígitos necessários, pontos decimais, caracteres de sinal, zeros anteriores, etc., ao definir a largura para colunas que são tratadas como números. Valores muito longos em uma coluna de texto, como `VARCHAR`, são truncados, removendo alguns caracteres, o que pode produzir valores numéricos sem sentido.

7. Opcionalmente, execute consultas de tipo relatório na tabela `InnoDB` que armazena os dados do **memcached**.

Você pode produzir relatórios por meio de consultas SQL, realizando cálculos e testes em qualquer coluna, não apenas na coluna chave `country`. (Como os exemplos a seguir utilizam dados de apenas alguns países, os números são apenas para fins ilustrativos.) As seguintes consultas retornam a população média dos países onde as pessoas dirigem à direita e o tamanho médio dos países cujos nomes começam com “U”:

   ```
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

Como as colunas `population` e `area_sq_km` armazenam dados de caracteres, e não dados numéricos fortemente tipados, funções como `AVG()` e `SUM()` funcionam convertendo cada valor em um número primeiro. Essa abordagem *não funciona* para operadores como `<` ou `>`, por exemplo, ao comparar valores baseados em caracteres, `9
   > 1000`, o que não é esperado de uma cláusula como `ORDER BY population DESC`. Para o tratamento de tipo mais preciso, realize consultas em visualizações que transformem colunas numéricas nos tipos apropriados. Essa técnica permite que você realize consultas simples de `SELECT *` a partir de aplicativos de banco de dados, garantindo que a conversão, filtragem e ordenação sejam corretas. O exemplo a seguir mostra uma visualização que pode ser consultada para encontrar os três países principais em ordem decrescente de população, com os resultados refletindo os dados mais recentes na tabela `multicol`, e com as figuras de população e área tratadas como números:

   ```
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

#### 17.20.6.2 Adaptando um aplicativo memcached para o plugin memcached do InnoDB

Considere esses aspectos das tabelas MySQL e `InnoDB` ao adaptar aplicações existentes do **memcached** para usar o plugin `daemon_memcached`:

* Se houver valores-chave mais longos do que alguns bytes, pode ser mais eficiente usar uma coluna de auto-incremento numérico como a chave primária da tabela `InnoDB`, e criar um índice secundário único na coluna que contém os valores da chave **memcached**. Isso ocorre porque o `InnoDB` se comporta melhor em inserções em larga escala se os valores da chave primária forem adicionados em ordem ordenada (como é o caso dos valores de auto-incremento). Os valores da chave primária são incluídos em índices secundários, o que ocupa espaço desnecessário se a chave primária for um valor de string longa.

* Se você armazenar várias classes diferentes de informações usando **memcached**, considere configurar uma tabela separada `InnoDB` para cada tipo de dados. Defina identificadores adicionais de tabela na tabela `innodb_memcache.containers` e use a notação `@@table_id.key` para armazenar e recuperar itens de diferentes tabelas. Dividir fisicamente diferentes tipos de informações permite ajustar as características de cada tabela para otimização do uso de espaço, desempenho e confiabilidade. Por exemplo, você pode habilitar a compressão para uma tabela que contém postagens de blog, mas não para uma tabela que contém imagens de miniaturas. Você pode fazer backup de uma tabela com mais frequência do que outra porque ela contém dados críticos. Você pode criar índices secundários adicionais (glossary.html#glos_secondary_index "secondary index") em tabelas que são frequentemente usadas para gerar relatórios usando SQL.

* Preferencialmente, configure um conjunto estável de definições de tabela para uso com o plugin **daemon_memcached** e deixe as tabelas em seu lugar permanentemente. As alterações na tabela `innodb_memcache.containers` entram em vigor na próxima vez que a tabela `innodb_memcache.containers` for consultada. As entradas na tabela de contêineres são processadas no início e são consultadas sempre que um identificador de tabela não reconhecido (conforme definido por `containers.name`) é solicitado usando a notação `@@`. Assim, as novas entradas são visíveis assim que você usa o identificador de tabela associado, mas as alterações nas entradas existentes requerem um reinício do servidor antes que elas entrem em vigor.

* Quando você usa a política de cache padrão `innodb_only`, as chamadas para `add()`, `set()`, `incr()` e assim por diante podem ser bem-sucedidas, mas ainda assim podem gerar mensagens de depuração, como `while expecting 'STORED', got unexpected response 'NOT_STORED`. As mensagens de depuração ocorrem porque novos e valores atualizados são enviados diretamente para a tabela `InnoDB` sem serem salvos na cache de memória, devido à política de cache `innodb_only`.

#### 17.20.6.3 Ajuste do desempenho do plugin InnoDB memcached

Como o uso do `InnoDB` em combinação com o **memcached** envolve a gravação de todos os dados no disco, seja imediatamente ou em algum momento posterior, espera-se que o desempenho bruto seja um pouco mais lento do que o uso do **memcached** por si só. Ao usar o plugin **memcached** `InnoDB`, foque nos objetivos de ajuste para as operações do **memcached** em alcançar um desempenho melhor do que as operações SQL equivalentes.

Os benchmarks sugerem que as consultas e operações de manipulação de dados (inserções, atualizações e exclusões) que utilizam a interface **memcached** são mais rápidas do que as operações SQL tradicionais. As operações de manipulação de dados geralmente apresentam melhorias maiores. Portanto, considere adaptar primeiro as aplicações intensivas em escrita a utilizar a interface **memcached**. Também considere priorizar a adaptação de aplicações intensivas em escrita que utilizam mecanismos rápidos e leves que não possuem confiabilidade.

##### Adaptação de consultas SQL

Os tipos de consultas que são mais adequados para solicitações simples do `GET` são aquelas com uma única cláusula ou um conjunto de condições do `AND` na cláusula do `WHERE`:

```
SQL:
SELECT col FROM tbl WHERE key = 'key_value';

memcached:
get key_value

SQL:
SELECT col FROM tbl WHERE col1 = val1 and col2 = val2 and col3 = val3;

memcached:
# Since you must always know these 3 values to look up the key,
# combine them into a unique string and use that as the key
# for all ADD, SET, and GET operations.
key_value = val1 + ":" + val2 + ":" + val3
get key_value

SQL:
SELECT 'key exists!' FROM tbl
  WHERE EXISTS (SELECT col1 FROM tbl WHERE KEY = 'key_value') LIMIT 1;

memcached:
# Test for existence of key by asking for its value and checking if the call succeeds,
# ignoring the value itself. For existence checking, you typically only store a very
# short value such as "1".
get key_value
```

##### Usando a Memória do Sistema

Para obter o melhor desempenho, implante o plugin `daemon_memcached` em máquinas configuradas como servidores de banco de dados típicos, onde a maioria da RAM do sistema é dedicada ao conjunto de tampão `InnoDB`, através da opção de configuração `innodb_buffer_pool_size`. Para sistemas com conjuntos de tampão de vários gigabytes, considere aumentar o valor de `innodb_buffer_pool_instances` para obter o máximo desempenho quando a maioria das operações envolve dados que já estão cacheados na memória.

##### Reduzindo o I/O redundante

`InnoDB` possui vários ajustes que permitem escolher o equilíbrio entre alta confiabilidade, em caso de falha, e a quantidade de overhead de E/S durante cargas de trabalho de escrita alta. Por exemplo, considere definir os ajustes de `innodb_doublewrite` para `0` e `innodb_flush_log_at_trx_commit` para `2`. Meça o desempenho com diferentes ajustes de `innodb_flush_method`.

Para outras maneiras de reduzir ou ajustar o I/O para operações de tabela, consulte a Seção 10.5.8, “Otimizando o I/O de disco do InnoDB”.

##### Reduzindo o custo operacional das transações

Um valor padrão de 1 para `daemon_memcached_r_batch_size` e `daemon_memcached_w_batch_size` é destinado à máxima confiabilidade dos resultados e à segurança dos dados armazenados ou atualizados.

Dependendo do tipo de aplicativo, você pode aumentar uma ou ambas as configurações para reduzir o overhead das operações de commit frequentes. Em um sistema ocupado, você pode aumentar `daemon_memcached_r_batch_size`, sabendo que as alterações nos dados feitas por meio do SQL podem não se tornar visíveis para o **memcached** imediatamente (ou seja, até que mais `get` operações sejam processadas). Ao processar dados onde cada operação de escrita deve ser armazenada de forma confiável, deixe `daemon_memcached_w_batch_size` definido como `1`. Aumente a configuração ao processar um grande número de atualizações destinadas apenas a análise estatística, onde perder as últimas `N` atualizações em uma saída inesperada é um risco aceitável.

Por exemplo, imagine um sistema que monitora o tráfego que cruza uma ponte movimentada, registrando dados para aproximadamente 100.000 veículos por dia. Se o aplicativo contabilizar diferentes tipos de veículos para analisar padrões de tráfego, alterar `daemon_memcached_w_batch_size` de `1` para `100` reduz o overhead de I/O para operações de commit em 99%. Em caso de uma interrupção, há um máximo de 100 registros perdidos, o que pode ser uma margem de erro aceitável. Se, em vez disso, o aplicativo realizasse a cobrança automática de pedágio para cada carro, você configuraria `daemon_memcached_w_batch_size` para `1` para garantir que cada registro de pedágio seja salvo imediatamente no disco.

Devido à forma como o `InnoDB` organiza os valores de chave do **memcached** no disco, se você tiver um grande número de chaves a criar, pode ser mais rápido ordenar os itens de dados por valor de chave no aplicativo e `add`-os em ordem ordenada, em vez de criar chaves em ordem aleatória.

O comando **memslap**, que faz parte da distribuição regular de **memcached**, mas não está incluído no plugin `daemon_memcached`, pode ser útil para fazer comparações de diferentes configurações. Ele também pode ser usado para gerar pares de chave-valor de amostra para uso em seus próprios benchmarks.

#### 17.20.6.4 Controlar o comportamento transacional do plugin memcached do InnoDB

Ao contrário do **memcached** tradicional, o plugin `daemon_memcached` permite que você controle a durabilidade dos valores de dados produzidos por meio das chamadas aos `add`, `set`, `incr` e assim por diante. Por padrão, os dados escritos através da interface **memcached** são armazenados no disco, e as chamadas ao `get` retornam o valor mais recente do disco. Embora o comportamento padrão não ofereça o melhor desempenho bruto possível, ainda é rápido em comparação com a interface SQL para as tabelas do `InnoDB`.

À medida que você ganha experiência usando o plugin `daemon_memcached`, pode considerar relaxar as configurações de durabilidade para classes de dados não críticas, arriscando perder alguns valores atualizados no caso de uma interrupção, ou retornar dados que estão ligeiramente desatualizados.

##### Frequência de Compromissos

Uma das compensações entre durabilidade e desempenho bruto é a frequência com que novos e alterados dados são comprometidos. Se os dados são críticos, eles devem ser comprometidos imediatamente para que estejam seguros em caso de uma saída ou interrupção inesperada. Se os dados são menos críticos, como contadores que são redefinidos após uma saída inesperada ou dados de registro que você pode permitir perder, você pode preferir um maior desempenho bruto disponível com menos compromissos frequentes.

Quando uma operação de **memcached** insere, atualiza ou exclui dados na tabela subjacente `InnoDB`, a mudança pode ser comprometida na tabela `InnoDB` instantaneamente (se `daemon_memcached_w_batch_size=1`) ou em algum momento posterior (se o valor de `daemon_memcached_w_batch_size` for maior que 1). Em qualquer caso, a mudança não pode ser revertida. Se você aumentar o valor de `daemon_memcached_w_batch_size` para evitar alto custo de I/O durante períodos ocupados, os compromissos podem se tornar infrequentes quando a carga de trabalho diminui. Como uma medida de segurança, um fio de fundo automaticamente compromete as mudanças feitas através da API de **memcached** em intervalos regulares. O intervalo é controlado pela opção de configuração `innodb_api_bk_commit_interval`, que tem um ajuste padrão de `5` segundos.

Quando uma operação de **memcached** insere ou atualiza dados na tabela subjacente `InnoDB`, os dados alterados são imediatamente visíveis para outras solicitações de **memcached**, pois o novo valor permanece no cache de memória, mesmo que ainda não tenha sido comprometido no lado MySQL.

##### Isolamento de Transação

Quando uma operação de **memcached**, como `get` ou `incr`, causa uma consulta ou operação de DML na tabela subjacente `InnoDB`, você pode controlar se a operação verá os dados mais recentes escritos na tabela, apenas os dados que foram comprometidos ou outras variações do nível de isolamento de transação. Use a opção de configuração `innodb_api_trx_level` para controlar essa funcionalidade. Os valores numéricos especificados para essa opção correspondem a níveis de isolamento, como `REPEATABLE READ`. Consulte a descrição da opção `innodb_api_trx_level` para obter informações sobre outras configurações.

Um nível de isolamento rigoroso garante que os dados que você recupera não sejam revertidos ou alterados de repente, o que pode fazer com que consultas subsequentes retornem valores diferentes. No entanto, níveis de isolamento rigorosos exigem maior sobrecarga de bloqueio, o que pode causar espera. Para um aplicativo estilo NoSQL que não utiliza transações de longa duração, você pode, normalmente, usar o nível de isolamento padrão ou mudar para um nível de isolamento menos rigoroso.

##### Desabilitar bloqueios de linha para operações de DML do memcached

A opção `innodb_api_disable_rowlock` pode ser usada para desabilitar bloqueios de linha quando as solicitações do **memcached** através do plugin `daemon_memcached` causam operações de DML. Por padrão, `innodb_api_disable_rowlock` está definido como `OFF`, o que significa que as solicitações do **memcached** causam bloqueios de linha para as operações de `get` e `set`. Quando `innodb_api_disable_rowlock` está definido como `ON`, o **memcached** solicita um bloqueio de tabela em vez de bloqueios de linha.

A opção `innodb_api_disable_rowlock` não é dinâmica. Ela deve ser especificada na linha de comando do **mysqld** no momento do início ou inserida em um arquivo de configuração do MySQL.

Permitir ou não permitir DDL

Por padrão, você pode realizar operações DDL, como `ALTER TABLE`, em tabelas usadas pelo plugin `daemon_memcached`. Para evitar possíveis lentidões quando essas tabelas são usadas em aplicações de alto desempenho, desative as operações DDL nessas tabelas, habilitando `innodb_api_enable_mdl` no início. Esta opção é menos apropriada quando acessa as mesmas tabelas por meio de **memcached** e SQL, porque bloqueia as declarações `CREATE INDEX` nas tabelas, o que poderia ser importante para executar consultas de relatórios.

##### Armazenamento de dados em disco, em memória ou em ambos

A tabela `innodb_memcache.cache_policies` especifica se os dados escritos através da interface **memcached** devem ser armazenados no disco (`innodb_only`, o padrão); apenas na memória, como no **memcached** tradicional (`cache_only`); ou em ambos (`caching`).

Com o ajuste `caching`, se o **memcached** não conseguir encontrar uma chave na memória, ele procura o valor em uma tabela `InnoDB`. Os valores retornados das chamadas `get` sob o ajuste `caching` podem estar desatualizados se os valores forem atualizados no disco na tabela `InnoDB`, mas ainda não expiraram do cache de memória.

A política de cache pode ser definida de forma independente para as operações `get`, `set` (incluindo `incr` e `decr`, `delete` e `flush`).

Por exemplo, você pode permitir que as operações `get` e `set` interajam ou atualizem uma tabela e o cache de memória **memcached** ao mesmo tempo (usando a configuração `caching`, enquanto `delete`, `flush` ou ambas operam apenas na cópia de memória (usando a configuração `cache_only`). Dessa forma, a exclusão ou esvaziamento de um item expira apenas o item do cache, e o valor mais recente é retornado da tabela `InnoDB` na próxima vez que o item for solicitado.

```
mysql> SELECT * FROM innodb_memcache.cache_policies;
+--------------+-------------+-------------+---------------+--------------+
| policy_name  | get_policy  | set_policy  | delete_policy | flush_policy |
+--------------+-------------+-------------+---------------+--------------+
| cache_policy | innodb_only | innodb_only | innodb_only   | innodb_only  |
+--------------+-------------+-------------+---------------+--------------+

mysql> UPDATE innodb_memcache.cache_policies SET set_policy = 'caching'
       WHERE policy_name = 'cache_policy';
```

Os valores de `innodb_memcache.cache_policies` são lidos apenas na inicialização. Após alterar os valores nesta tabela, desinstale e reinstale o plugin `daemon_memcached` para garantir que as alterações tenham efeito.

```
mysql> UNINSTALL PLUGIN daemon_memcached;

mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
```

#### 17.20.6.5 Adaptando declarações DML a operações memcached

Os benchmarks sugerem que o plugin `daemon_memcached` acelera operações DML (inserções, atualizações e exclusões) mais do que acelera consultas. Portanto, considere focar os esforços de desenvolvimento inicial em aplicações intensivas em escrita que são limitadas por I/O, e procure oportunidades para usar o MySQL com o plugin `daemon_memcached` para novas aplicações intensivas em escrita.

As declarações DML de uma única linha são os tipos de declarações mais fáceis de transformar em operações `memcached`. `INSERT` se torna `add`, `UPDATE` se torna `set`, `incr` ou `decr`, e `DELETE` se torna `delete`. Essas operações são garantidas para afetar apenas uma linha quando emitidas através da interface **memcached**, porque o *`key`* é único dentro da tabela.

Nos exemplos SQL a seguir, `t1` se refere à tabela usada para operações de **memcached**, com base na configuração da tabela `innodb_memcache.containers`. `key` se refere à coluna listada em `key_columns`, e `val` se refere à coluna listada em `value_columns`.

```
INSERT INTO t1 (key,val) VALUES (some_key,some_value);
SELECT val FROM t1 WHERE key = some_key;
UPDATE t1 SET val = new_value WHERE key = some_key;
UPDATE t1 SET val = val + x WHERE key = some_key;
DELETE FROM t1 WHERE key = some_key;
```

As seguintes declarações `TRUNCATE TABLE` e `DELETE`, que removem todas as linhas da tabela, correspondem à operação `flush_all`, onde `t1` é configurado como a tabela para operações de **memcached**, como no exemplo anterior.

```
TRUNCATE TABLE t1;
DELETE FROM t1;
```

#### 17.20.6.6 Realizando declarações DML e DDL nas tabelas subjacentes InnoDB

Você pode acessar a tabela subjacente `InnoDB` (que é `test.demo_test` por padrão) por meio de interfaces SQL padrão. No entanto, há algumas restrições:

* Ao consultar uma tabela que também é acessada através da interface **memcached**, lembre-se de que as operações **memcached** podem ser configuradas para serem realizadas periodicamente, em vez de após cada operação de escrita. Esse comportamento é controlado pela opção `daemon_memcached_w_batch_size`. Se essa opção for definida com um valor maior que `1`, use consultas [`READ UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted) para encontrar linhas que foram inseridas recentemente.

  ```
  mysql> SET SESSSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

  mysql> SELECT * FROM demo_test;
  +------+------+------+------+-----------+------+------+------+------+------+------+
  | cx   | cy   | c1   | cz   | c2        | ca   | CB   | c3   | cu   | c4   | C5   |
  +------+------+------+------+-----------+------+------+------+------+------+------+
  | NULL | NULL | a11  | NULL | 123456789 | NULL | NULL |   10 | NULL |    3 | NULL |
  +------+------+------+------+-----------+------+------+------+------+------+------+
  ```

* Ao modificar uma tabela usando SQL que também é acessada através da interface **memcached**, você pode configurar operações **memcached** para iniciar uma nova transação periodicamente, em vez de para cada operação de leitura. Esse comportamento é controlado pela opção `daemon_memcached_r_batch_size`. Se essa opção for definida com um valor maior que `1`, as alterações feitas na tabela usando SQL não serão imediatamente visíveis às operações **memcached**.

* A tabela `InnoDB` é bloqueada de forma IS (intenção compartilhada) ou IX (intenção exclusiva) para todas as operações em uma transação. Se você aumentar `daemon_memcached_r_batch_size` e `daemon_memcached_w_batch_size` substancialmente do seu valor padrão de `1`, a tabela provavelmente será bloqueada entre cada operação, impedindo declarações DDL na tabela.

### 17.20.7 O Plugin e a Replicação do memcached do InnoDB

Como o plugin `daemon_memcached` suporta o log binário do MySQL, o servidor de origem através da interface **memcached** pode ser replicado para backup, equilíbrio de cargas de leitura intensivas e alta disponibilidade. Todos os comandos **memcached** são suportados com registro binário.

Você não precisa configurar o plugin `daemon_memcached` nos servidores replicados. A principal vantagem dessa configuração é o aumento do throughput de escrita na fonte. A velocidade do mecanismo de replicação não é afetada.

As seções a seguir mostram como usar a capacidade de registro binário ao usar o plugin `daemon_memcached` com replicação do MySQL. Assume-se que você tenha completado a configuração descrita na Seção 17.20.3, “Configurando o Plugin InnoDB memcached”.

#### Habilitando o registro binário InnoDB memcached

1. Para usar o plugin `daemon_memcached` com o log binário do MySQL, habilite a opção de configuração `innodb_api_enable_binlog` no servidor de origem. Esta opção só pode ser definida na inicialização do servidor. Você também deve habilitar o log binário do MySQL no servidor de origem usando a opção `--log-bin`. Você pode adicionar essas opções ao arquivo de configuração do MySQL ou na linha de comando do **mysqld**.

   ```
   mysqld ... --log-bin -–innodb_api_enable_binlog=1
   ```

2. Configure o servidor de origem e o servidor de replicação, conforme descrito na Seção 19.1.2, “Configuração da replicação com base na posição do arquivo de registro binário”.

3. Use o **mysqldump** para criar um instantâneo de dados de origem e sincronize o instantâneo com o servidor replica.

   ```
   source $> mysqldump --all-databases --lock-all-tables > dbdump.db
   replica $> mysql < dbdump.db
   ```

4. No servidor de origem, emita `SHOW MASTER STATUS` (show-master-status.html "15.7.7.23 SHOW MASTER STATUS Statement") para obter as coordenadas do log binário de origem.

   ```
   mysql> SHOW MASTER STATUS;
   ```

5. No servidor replica, use uma declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) para configurar um servidor replica usando as coordenadas do log binário de origem.

   ```
   mysql> CHANGE MASTER TO
          MASTER_HOST='localhost',
          MASTER_USER='root',
          MASTER_PASSWORD='',
          MASTER_PORT = 13000,
          MASTER_LOG_FILE='0.000001,
          MASTER_LOG_POS=114;

   Or from MySQL 8.0.23:
   mysql> CHANGE REPLICATION SOURCE TO
          SOURCE_HOST='localhost',
          SOURCE_USER='root',
          SOURCE_PASSWORD='',
          SOURCE_PORT = 13000,
          SOURCE_LOG_FILE='0.000001,
          SOURCE_LOG_POS=114;
   ```

6. Inicie a replica.

   ```
   mysql> START SLAVE;
   Or from MySQL 8.0.22:
   mysql> START REPLICA;
   ```

Se o log de erro imprimir uma saída semelhante à seguinte, a replica está pronta para replicação.

   ```
   2013-09-24T13:04:38.639684Z 49 [Note] Replication I/O thread: connected to
   source 'root@localhost:13000', replication started in log '0.000001'
   at position 114
   ```

#### Testando a configuração de replicação do InnoDB memcached

Este exemplo demonstra como testar a configuração de replicação do **memcached** `InnoDB` usando o **memcached** e o telnet para inserir, atualizar e excluir dados. Um cliente MySQL é usado para verificar os resultados nos servidores fonte e replica.

O exemplo utiliza a tabela `demo_test`, que foi criada pelo script de configuração `innodb_memcached_config.sql` durante a configuração inicial do plugin `daemon_memcached`. A tabela `demo_test` contém um único registro de exemplo.

1. Use o comando `set` para inserir um registro com uma chave de `test1`, um valor de bandeira de `10`, um valor de expiração de `0`, um valor de cas de 1 e um valor de `t1`.

   ```
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   set test1 10 0 1
   t1
   STORED
   ```

2. No servidor de origem, verifique se o registro foi inserido na tabela `demo_test`. Supondo que a tabela `demo_test` não tenha sido modificada anteriormente, deve haver dois registros. O registro de exemplo com uma chave de `AA`, e o registro que você acabou de inserir, com uma chave de `test1`. A coluna `c1` corresponde à chave, a coluna `c2` ao valor, a coluna `c3` ao valor da bandeira, a coluna `c4` ao valor do cas, e a coluna `c5` ao tempo de expiração. O tempo de expiração foi definido como 0, uma vez que não é utilizado.

   ```
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | t1           |   10 |    1 |    0 |
   +-------+--------------+------+------+------+
   ```

3. Verifique para verificar se o mesmo registro foi replicado no servidor replica.

   ```
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | t1           |   10 |    1 |    0 |
   +-------+--------------+------+------+------+
   ```

4. Use o comando `set` para atualizar a chave para um valor de `new`.

   ```
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   set test1 10 0 2
   new
   STORED
   ```

A atualização é replicada para o servidor de replicação (observe que o valor `cas` também é atualizado).

   ```
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | new          |   10 |    2 |    0 |
   +-------+--------------+------+------+------+
   ```

5. Exclua o registro `test1` usando um comando `delete`.

   ```
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   delete test1
   DELETED
   ```

Quando a operação `delete` é replicada para a réplica, o registro `test1` na réplica também é excluído.

   ```
   mysql> SELECT * FROM test.demo_test;
   +----+--------------+------+------+------+
   | c1 | c2           | c3   | c4   | c5   |
   +----+--------------+------+------+------+
   | AA | HELLO, HELLO |    8 |    0 |    0 |
   +----+--------------+------+------+------+
   ```

6. Remova todas as linhas da tabela usando o comando `flush_all`.

   ```
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   flush_all
   OK
   ```

   ```
   mysql> SELECT * FROM test.demo_test;
   Empty set (0.00 sec)
   ```

7. Telenete para o servidor de origem e insira dois novos registros.

   ```
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'
   set test2 10 0 4
   again
   STORED
   set test3 10 0 5
   again1
   STORED
   ```

8. Confirme que os dois registros foram replicados para o servidor de replicação.

   ```
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | test2 | again        |   10 |    4 |    0 |
   | test3 | again1       |   10 |    5 |    0 |
   +-------+--------------+------+------+------+
   ```

9. Remova todas as linhas da tabela usando o comando `flush_all`.

   ```
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   flush_all
   OK
   ```

10. Verifique se a operação `flush_all` foi replicada no servidor de replicação.

    ```
    mysql> SELECT * FROM test.demo_test;
    Empty set (0.00 sec)
    ```

Notas de log binário do InnoDB memcached

Formato de registro binário:

* A maioria das operações do **memcached** é mapeada a declarações DML (análogo a inserir, excluir e atualizar). Como não há uma declaração SQL real sendo processada pelo servidor MySQL, todos os comandos do **memcached** (exceto o `flush_all`) utilizam o registro de Replicação Baseada em Linha (RBR), que é independente de qualquer configuração do servidor `binlog_format`.

* O comando **memcached** `flush_all` é mapeado para o comando `TRUNCATE TABLE` no MySQL 5.7 e versões anteriores. Como os comandos DDL só podem usar registro baseado em declaração, o comando `flush_all` é replicado enviando uma declaração `TRUNCATE TABLE`. No MySQL 8.0 e versões posteriores, `flush_all` é mapeado para `DELETE`, mas ainda é replicado enviando uma declaração `TRUNCATE TABLE`.

Transações:

* O conceito de transações não fazia parte típica dos aplicativos do **memcached**. Por considerações de desempenho, `daemon_memcached_r_batch_size` e `daemon_memcached_w_batch_size` são usados para controlar o tamanho do lote para transações de leitura e escrita. Esses ajustes não afetam a replicação. Cada operação SQL na tabela subjacente `InnoDB` é replicada após o término bem-sucedido.

O valor padrão de `daemon_memcached_w_batch_size` é `1`, o que significa que cada operação de escrita do **memcached** é comprometida imediatamente. Esta configuração padrão incorre em um certo grau de sobrecarga de desempenho para evitar inconsistências nos dados que são visíveis nos servidores fonte e réplica. Os registros replicados estão sempre disponíveis imediatamente no servidor réplica. Se você definir `daemon_memcached_w_batch_size` para um valor maior que `1`, os registros inseridos ou atualizados através do **memcached** não serão imediatamente visíveis no servidor fonte; para visualizar os registros no servidor fonte antes de serem comprometidos, execute [`SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED`(set-transaction.html "15.3.7 SET TRANSACTION Statement")].

### 17.20.8 Interiores do Plugin memcached do InnoDB

#### API InnoDB para o Plugin memcached InnoDB

O motor `InnoDB` **memcached** acessa `InnoDB` através das APIs `InnoDB`, a maioria das quais é diretamente adotada do embutido `InnoDB`. As funções da API `InnoDB` são passadas para o motor `InnoDB` **memcached** como funções de callback. As funções da API `InnoDB` acessam as tabelas `InnoDB` diretamente e são, na maioria, operações DML, com exceção de `TRUNCATE TABLE`.

Os comandos do **memcached** são implementados através da API `InnoDB` **memcached**. O seguinte quadro descreve como os comandos do **memcached** são mapeados para operações DML ou DDL.

**Tabela 17.27 Comandos memcached e operações DML ou DDL associadas**

<table frame="all" summary="memcached commands and associated DML or DDL operations."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>memcached Command</th> <th>Operações DML ou DDL</th> </tr></thead><tbody><tr> <td><code>get</code></td> <td>um comando de leitura/recuperação</td> </tr><tr> <td><code>set</code></td> <td>uma busca seguida por<code>INSERT</code>ou<code>UPDATE</code>(dependendo de se uma chave existe ou não)</td> </tr><tr> <td><code>add</code></td> <td>uma busca seguida por<code>INSERT</code>ou<code>UPDATE</code></td> </tr><tr> <td><code>replace</code></td> <td>uma busca seguida por<code>UPDATE</code></td> </tr><tr> <td><code>append</code></td> <td>uma busca seguida por<code>UPDATE</code>(apresenta os dados ao resultado antes de<code>UPDATE</code>)</td> </tr><tr> <td><code>prepend</code></td> <td>uma busca seguida por<code>UPDATE</code>(prepara os dados para o resultado antes de<code>UPDATE</code>)</td> </tr><tr> <td><code>incr</code></td> <td>uma busca seguida por<code>UPDATE</code></td> </tr><tr> <td><code>decr</code></td> <td>uma busca seguida por<code>UPDATE</code></td> </tr><tr> <td><code>delete</code></td> <td>uma busca seguida por<code>DELETE</code></td> </tr><tr> <td><code>flush_all</code></td> <td><code>TRUNCATE TABLE</code>(DDL)</td> </tr></tbody></table>

#### Tabelas de configuração do plugin InnoDB memcached

Esta seção descreve as tabelas de configuração usadas pelo plugin `daemon_memcached`. As tabelas `cache_policies`, `config_options` e `containers` são criadas pelo script de configuração `innodb_memcached_config.sql` no banco de dados `innodb_memcache`.

```
mysql> USE innodb_memcache;
Database changed
mysql> SHOW TABLES;
+---------------------------+
| Tables_in_innodb_memcache |
+---------------------------+
| cache_policies            |
| config_options            |
| containers                |
+---------------------------+
```

#### Tabela cache_policies

A tabela `cache_policies` define uma política de cache para a instalação `InnoDB` `memcached`. Você pode especificar políticas individuais para as operações `get`, `set`, `delete` e `flush`, dentro de uma única política de cache. O ajuste padrão para todas as operações é `innodb_only`.

* `innodb_only`: Use `InnoDB` como o banco de dados.

* `cache_only`: Use o motor **memcached** como o banco de dados.

* `caching`: Use tanto o `InnoDB` quanto o motor **memcached** como bancos de dados. Nesse caso, se o **memcached** não encontrar uma chave na memória, ele busca o valor em uma tabela `InnoDB`.

* `disable`: Desative o cache.

**Tabela 17.28 políticas de cache Colunas**

<table frame="all" summary="Columns of the cache_policies table."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Column</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>policy_name</code></td> <td>Name of the cache policy. The default cache policy name is <code>cache_policy</code>.</td> </tr><tr> <td><code>get_policy</code></td> <td>The cache policy for get operations. Valid values are <code>innodb_only</code>, <code>cache_only</code>, <code>caching</code>, or <code>disabled</code>. The default setting is <code>innodb_only</code>.</td> </tr><tr> <td><code>set_policy</code></td> <td>The cache policy for set operations. Valid values are <code>innodb_only</code>, <code>cache_only</code>, <code>caching</code>, or <code>disabled</code>. The default setting is <code>innodb_only</code>.</td> </tr><tr> <td><code>delete_policy</code></td> <td>The cache policy for delete operations. Valid values are <code>innodb_only</code>, <code>cache_only</code>, <code>caching</code>, or <code>disabled</code>. The default setting is <code>innodb_only</code>.</td> </tr><tr> <td><code>flush_policy</code></td> <td>The cache policy for flush operations. Valid values are <code>innodb_only</code>, <code>cache_only</code>, <code>caching</code>, or <code>disabled</code>. The default setting is <code>innodb_only</code>.</td> </tr></tbody></table>

#### Tabela config_options

A tabela `config_options` armazena configurações relacionadas ao **memcached** que podem ser alteradas em tempo real usando SQL. As opções de configuração suportadas são `separator` e `table_map_delimiter`.

**Tabela 17.29 opções de configuração de colunas**

<table frame="all" summary="Columns of the config_options table."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Column</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>Name</code></td> <td>Nome da opção de configuração relacionada ao memcached. As seguintes opções de configuração são suportadas pelo<code>config_options</code>tabela:<div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>separator</code>: Usado para separar valores de uma longa cadeia em valores separados quando há vários<code>value_columns</code>definida. Por padrão, o<code>separator</code>é um<code>|</code>característica. Por exemplo, se você definir<code>col1, col2</code>como colunas de valor, e você define<code>|</code>Como separador, você pode emitir o seguinte comando do memcached para inserir valores no<code>col1</code>e<code>col2</code>, respectivamente:</p><pre class="programlisting copytoclipboard language-terminal"><code class="language-terminal">set keyx 10 0 19 valuecolx|valuecoly</code></pre><p> <code>valuecol1x</code>são armazenados em<code>col1</code>e<code>valuecoly</code>são armazenados em<code>col2</code>. </p></li><li class="listitem"><p> <code>table_map_delimiter</code>: O caractere que separa o nome do esquema e o nome da tabela quando você usa o<code>@@</code>A notação em um nome de chave para acessar uma chave em uma tabela específica. Por exemplo,<code>@@t1.some_key</code>e<code>@@t2.some_key</code>têm o mesmo valor chave, mas são armazenados em tabelas diferentes.</p></li></ul> </div> </td> </tr><tr> <td><code>Value</code></td> <td>O valor atribuído à opção de configuração relacionada ao memcached.</td> </tr></tbody></table>

#### Contenedores de tabela

A tabela `containers` é a mais importante das três tabelas de configuração. Cada tabela `InnoDB` que é usada para armazenar valores do **memcached** deve ter uma entrada na tabela `containers`. A entrada fornece uma mapeo entre as colunas da tabela `InnoDB` e as colunas das tabelas de contêiner, o que é necessário para que o `memcached` trabalhe com as tabelas `InnoDB`.

A tabela `containers` contém uma entrada padrão para a tabela `test.demo_test`, que é criada pelo script de configuração `innodb_memcached_config.sql`. Para usar o plugin `daemon_memcached` com sua própria tabela `InnoDB`, você deve criar uma entrada na tabela `containers`.

**Tabela 17.30 Contenedores Colunas**

<table frame="all" summary="Columns of the containers table."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Column</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>name</code></td> <td>O nome dado ao recipiente. Se um<code>InnoDB</code>A tabela não é solicitada pelo nome usando<code>@@</code>notação, a<code>daemon_memcached</code>o plugin utiliza<code>InnoDB</code>mesa com uma<code>containers.name</code>valor de<code>default</code>Se não houver tal entrada, a primeira entrada no<code>containers</code>tabela, ordenada alfabeticamente por<code>name</code>(ascendente), determina o padrão<code>InnoDB</code> table.</td> </tr><tr> <td><code>db_schema</code></td> <td>O nome do banco de dados onde o<code>InnoDB</code>A tabela reside. Este é um valor obrigatório.</td> </tr><tr> <td><code>db_table</code></td> <td>O nome do<code>InnoDB</code>uma tabela que armazena valores do Memcached. Este é um valor obrigatório.</td> </tr><tr> <td><code>key_columns</code></td> <td>A coluna no<code>InnoDB</code>uma tabela que contém valores de chave de busca para operações do memcached. Este é um valor obrigatório.</td> </tr><tr> <td><code>value_columns</code></td> <td>O<code>InnoDB</code>colunas de tabela (uma ou mais) que armazenam<code>memcached</code>dados. Várias colunas podem ser especificadas usando o caractere de separador especificado no<code>innodb_memcached.config_options</code>tabela. Por padrão, o separador é um caractere de tubo (“|”). Para especificar várias colunas, separe-as com o caractere de separador definido. Por exemplo:<code>col1|col2|col3</code>. Este é um valor obrigatório.</td> </tr><tr> <td><code>flags</code></td> <td>O<code>InnoDB</code>colunas de tabela que são usadas como flags (um valor numérico definido pelo usuário que é armazenado e recuperado juntamente com o valor principal) para memcached. Um valor de bandeira pode ser usado como especificador de coluna para algumas operações (como<code>incr</code>,<code>prepend</code>) se um valor do memcached for mapeado para múltiplas colunas, de modo que uma operação seja realizada em uma coluna especificada. Por exemplo, se você tiver mapeado um<code>value_columns</code>para três<code>InnoDB</code>se você deseja apenas realizar a operação de incremento em uma coluna, use a tabela e apenas a coluna que deseja, e o comando:<code>flags</code>coluna para especificar a coluna. Se você não usar a<code>flags</code>coluna, defina um valor de<code>0</code>para indicar que não foi utilizada.</td> </tr><tr> <td><code>cas_column</code></td> <td>O<code>InnoDB</code>Uma coluna de tabela que armazena valores de comparação e troca (CAS). A<code>cas_column</code>O valor está relacionado à forma como o memcached encripta os pedidos para diferentes servidores e armazena dados na memória. Como o<code>InnoDB</code>O plugin memcached é integrado de forma estreita com um único daemon memcached, e o mecanismo de cache de memória é gerenciado pelo MySQL e pelo<a class="link" href="glossary.html#glos_buffer_pool" title="buffer pool">Banco de buffers de InnoDB</a>, essa coluna raramente é necessária. Se você não usar essa coluna, defina um valor de<code>0</code>para indicar que não foi utilizada.</td> </tr><tr> <td><code>expire_time_column</code></td> <td>O<code>InnoDB</code>coluna de tabela que armazena valores de expiração. A<code>expire_time_column</code>O valor está relacionado à forma como o memcached encripta os pedidos para diferentes servidores e armazena dados na memória. Como o<code>InnoDB</code>O plugin memcached é integrado de forma estreita com um único daemon memcached, e o mecanismo de cache de memória é gerenciado pelo MySQL e pelo<a class="link" href="glossary.html#glos_buffer_pool" title="buffer pool">Banco de buffers de InnoDB</a>, essa coluna raramente é necessária. Se você não usar essa coluna, defina um valor de<code>0</code>para indicar que a coluna não está sendo usada. O tempo máximo de expiração é definido como<code>INT_MAX32</code>ou 2147483647 segundos (aproximadamente 68 anos).</td> </tr><tr> <td><code>unique_idx_name_on_key</code></td> <td>O nome do índice na coluna chave. Deve ser um índice único. Pode ser<a class="link" href="glossary.html#glos_primary_key" title="primary key">chave primária</a>ou um<a class="link" href="glossary.html#glos_secondary_index" title="secondary index">índice secundário</a>. Preferencialmente, use a chave primária do<code>InnoDB</code>A tabela. Utilizar a chave primária evita uma pesquisa que é realizada ao utilizar um índice secundário. Não é possível criar um índice coberto para pesquisas no memcached;<code>InnoDB</code>retorna um erro se você tentar definir um índice secundário composto sobre as colunas chave e valor.</td> </tr></tbody></table>

##### Contenedores Tabela Restrições de coluna

* Você deve fornecer um valor para `db_schema`, `db_name`, `key_columns`, `value_columns` e `unique_idx_name_on_key`. Especifique `0` para `flags`, `cas_column` e `expire_time_column` se eles não forem utilizados. Não fazer isso pode fazer com que sua configuração falhe.

* `key_columns`: O limite máximo para uma chave de **memcached** é de 250 caracteres, que é aplicado pelo **memcached**. A chave mapeada deve ser um tipo não nulo `CHAR` ou `VARCHAR`.

* `value_columns`: Deve ser mapeado para uma coluna `CHAR`, `VARCHAR` ou `BLOB`. Não há restrição de comprimento e o valor pode ser NULL.

* `cas_column`: O valor `cas` é um inteiro de 64 bits. Ele deve ser mapeado para um `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") de pelo menos 8 bytes. Se você não usar essa coluna, defina um valor de `0` para indicar que ela não é usada.

* `expiration_time_column`: Deve ser mapeado para um `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") de pelo menos 4 bytes. O tempo de expiração é definido como um inteiro de 32 bits para tempo Unix (o número de segundos desde 1º de janeiro de 1970, como um valor de 32 bits), ou o número de segundos a partir do momento atual. Para este último, o número de segundos não pode exceder 60\*60\*24\*30 (o número de segundos em 30 dias). Se o número enviado por um cliente for maior, o servidor o considera um valor real de tempo Unix, em vez de um deslocamento do tempo atual. Se você não usar esta coluna, defina um valor de `0` para indicar que ela não é usada.

* `flags`: Deve ser mapeado para um `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") de pelo menos 32 bits e pode ser NULL. Se você não usar esta coluna, defina um valor de `0` para indicar que ela não é usada.

Uma pré-verificação é realizada no momento da carga do plugin para impor as restrições de coluna. Se forem encontrados desalinhamentos, o plugin não é carregado.

##### Mapeamento de Coluna de Valor Múltiplo

* Durante a inicialização do plugin, quando o **memcached** `InnoDB` é configurado com informações definidas na tabela `containers`, cada coluna mapeada definida em `containers.value_columns` é verificada contra a tabela mapeada `InnoDB`. Se houver várias colunas da tabela `InnoDB` mapeadas, há uma verificação para garantir que cada coluna exista e seja do tipo correto.

* No momento da execução, para operações de inserção de `memcached`, se houver mais valores delimitados do que o número de colunas mapeadas, apenas os valores mapeados são tomados. Por exemplo, se houver seis colunas mapeadas e sete valores delimitados forem fornecidos, apenas os primeiros seis valores delimitados são tomados. O sétimo valor delimitado é ignorado.

* Se houver menos valores delimitados do que colunas mapeadas, as colunas não preenchidas serão definidas como NULL. Se uma coluna não preenchida não puder ser definida como NULL, as operações de inserção falharão.

* Se uma tabela tiver mais colunas do que valores mapeados, as colunas extras não afetam os resultados.

#### A tabela de exemplo demo_test

O script de configuração `innodb_memcached_config.sql` cria uma tabela `demo_test` no banco de dados `test`, que pode ser usada para verificar a instalação do plugin **memcached** `InnoDB` imediatamente após a configuração.

O script de configuração `innodb_memcached_config.sql` também cria uma entrada para a tabela `demo_test` na tabela `innodb_memcache.containers`.

```
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

### 17.20.9 Solucionando problemas do plugin InnoDB memcached

Esta seção descreve os problemas que você pode encontrar ao usar o plugin `InnoDB` **memcached**.

* Se você encontrar o seguinte erro no log de erro do MySQL, o servidor pode não iniciar:

não conseguiu definir o rlimit para arquivos abertos. Tente executar como root ou solicitar um valor menor para maxconns.

A mensagem de erro é do **memcached** daemon. Uma solução é aumentar o limite do sistema operacional para o número de arquivos abertos. Os comandos para verificar e aumentar o limite de arquivos abertos variam de acordo com o sistema operacional. Este exemplo mostra comandos para Linux e macOS:

  ```
  # Linux
  $> ulimit -n
  1024
  $> ulimit -n 4096
  $> ulimit -n
  4096

  # macOS
  $> ulimit -n
  256
  $> ulimit -n 4096
  $> ulimit -n
  4096
  ```

A outra solução é reduzir o número de conexões concorrentes permitidas para o daemon **memcached**. Para fazer isso, codifique a opção `-c` **memcached** no parâmetro de configuração `daemon_memcached_option` no arquivo de configuração do MySQL. A opção `-c` tem um valor padrão de 1024.

  ```
  [mysqld]
  ...
  loose-daemon_memcached_option='-c 64'
  ```

* Para solucionar problemas em que o daemon **memcached** não consegue armazenar ou recuperar dados da tabela `InnoDB`, codifique a opção **memcached** `-vvv` no parâmetro de configuração `daemon_memcached_option` no arquivo de configuração do MySQL. Examine o log de erro do MySQL para obter saída de depuração relacionada às operações do **memcached**.

  ```
  [mysqld]
  ...
  loose-daemon_memcached_option='-vvv'
  ```

* Se as colunas especificadas para armazenar valores de **memcached** tiverem o tipo de dados errado, como um tipo numérico em vez de um tipo de string, as tentativas de armazenar pares chave-valor falham sem nenhum código de erro ou mensagem específica.

* Se o plugin `daemon_memcached` causar problemas de inicialização do servidor MySQL, você pode desativar temporariamente o plugin `daemon_memcached` enquanto resolve o problema, adicionando esta linha sob o grupo `[mysqld]` no arquivo de configuração do MySQL:

  ```
  daemon_memcached=OFF
  ```

Por exemplo, se você executar a declaração `INSTALL PLUGIN`(install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") antes de executar o script de configuração `innodb_memcached_config.sql` para configurar o banco de dados e as tabelas necessárias, o servidor pode sair inesperadamente e não iniciar. O servidor também pode não iniciar se você configurar incorretamente uma entrada na tabela `innodb_memcache.containers`.

Para desinstalar o plugin **memcached** para uma instância do MySQL, execute a seguinte declaração:

  ```
  mysql> UNINSTALL PLUGIN daemon_memcached;
  ```

* Se você executar mais de uma instância do MySQL na mesma máquina com o plugin `daemon_memcached` habilitado em cada instância, use o parâmetro de configuração `daemon_memcached_option` para especificar uma porta de **memcached** exclusiva para cada plugin `daemon_memcached`.

* Se uma declaração SQL não conseguir encontrar a tabela `InnoDB` ou não encontrar dados na tabela, mas as chamadas à API do **memcached** recuperam os dados esperados, você pode estar faltando uma entrada para a tabela `InnoDB` na tabela `innodb_memcache.containers`, ou pode não ter mudado para a tabela correta `InnoDB` ao emitir um pedido `get` ou `set` usando a notação `@@table_id`. Esse problema também pode ocorrer se você alterar uma entrada existente na tabela `innodb_memcache.containers` sem reiniciar o servidor MySQL depois disso. O mecanismo de armazenamento livre de formato é flexível o suficiente, de modo que suas solicitações para armazenar ou recuperar um valor de várias colunas, como `col1|col2|col3`, ainda podem funcionar, mesmo se o daemon estiver usando a tabela `test.demo_test` que armazena valores em uma única coluna.

* Ao definir sua própria tabela `InnoDB` para uso com o plugin `daemon_memcached`, e as colunas da tabela são definidas como `NOT NULL`, certifique-se de que valores sejam fornecidos para as colunas `NOT NULL` ao inserir um registro para a tabela na tabela `innodb_memcache.containers`. Se a declaração `INSERT` para o registro `innodb_memcache.containers` contiver menos valores delimitados do que as colunas mapeadas, as colunas não preenchidas são definidas como `NULL`. Tentar inserir um valor `NULL` em uma coluna `NOT NULL` causa o `INSERT` a falhar, o que pode se tornar evidente apenas após você reinicializar o plugin `daemon_memcached` para aplicar as alterações na tabela `innodb_memcache.containers`.

* Se os campos `cas_column` e `expire_time_column` da tabela `innodb_memcached.containers` forem definidos como `NULL`, o seguinte erro será retornado ao tentar carregar o plugin **memcached**:

  ```
  InnoDB_Memcached: column 6 in the entry for config table 'containers' in
  database 'innodb_memcache' has an invalid NULL value.
  ```

O plugin **memcached** rejeita o uso de `NULL` nas colunas `cas_column` e `expire_time_column`. Defina o valor dessas colunas para `0` quando as colunas não estiverem sendo usadas.

* À medida que o comprimento da chave e dos valores do **memcached** aumenta, você pode encontrar limites de tamanho e comprimento.

+ Quando a chave excede 250 bytes, as operações do **memcached** retornam um erro. Esse é atualmente um limite fixo dentro do **memcached**.

+ Podem ser encontrados limites na tabela `InnoDB` se os valores excederem 768 bytes de tamanho, 3072 bytes de tamanho ou metade do valor `innodb_page_size`. Esses limites se aplicam principalmente se você pretende criar um índice em uma coluna de valor para executar consultas geradoras de relatórios nessa coluna usando SQL. Consulte a Seção 17.22, “Limites do InnoDB”, para detalhes.

+ O tamanho máximo para a combinação chave-valor é de 1 MB.
* Se você compartilhar arquivos de configuração entre servidores MySQL de diferentes versões, usando as opções de configuração mais recentes para o plugin `daemon_memcached`, pode causar erros de inicialização em versões mais antigas do MySQL. Para evitar problemas de compatibilidade, use o prefixo `loose` com nomes de opções. Por exemplo, use `loose-daemon_memcached_option='-c 64'` em vez de `daemon_memcached_option='-c 64'`.

* Não há restrições ou verificações para validar as configurações do conjunto de caracteres. **memcached** armazena e recupera chaves e valores em bytes e, portanto, não é sensível ao conjunto de caracteres. No entanto, você deve garantir que o cliente **memcached** e a tabela do MySQL utilizem o mesmo conjunto de caracteres.

* As conexões do **memcached** são bloqueadas de acessar tabelas que contêm uma coluna virtual indexada. Aceder a uma coluna virtual indexada requer um callback ao servidor, mas uma conexão do **memcached** não tem acesso ao código do servidor.