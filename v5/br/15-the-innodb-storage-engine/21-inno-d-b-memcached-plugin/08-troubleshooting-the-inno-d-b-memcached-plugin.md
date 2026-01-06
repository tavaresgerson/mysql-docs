### 14.21.8 Solução de problemas do plugin InnoDB memcached

Esta seção descreve os problemas que você pode encontrar ao usar o plugin **memcached** do InnoDB.

- Se você encontrar o seguinte erro no log de erro do MySQL, o servidor pode não conseguir ser iniciado:

  não conseguiu definir o limite de arquivos abertos. Tente executar como root ou solicitar um valor menor para maxconns.

  A mensagem de erro é do daemon **memcached**. Uma solução é aumentar o limite do sistema operacional para o número de arquivos abertos. Os comandos para verificar e aumentar o limite de arquivos abertos variam de acordo com o sistema operacional. Este exemplo mostra comandos para Linux e macOS:

  ```sql
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

  A outra solução é reduzir o número de conexões simultâneas permitidas para o daemon **memcached**. Para fazer isso, codifique a opção `-c **memcached**` no parâmetro de configuração `daemon_memcached_option` no arquivo de configuração do MySQL. A opção `-c` tem um valor padrão de 1024.

  ```sql
  [mysqld]
  ...
  loose-daemon_memcached_option='-c 64'
  ```

- Para solucionar problemas em que o daemon do **memcached** não consegue armazenar ou recuperar dados da tabela do **InnoDB**, codifique a opção **memcached** `-vvv` no parâmetro de configuração `daemon_memcached_option` no arquivo de configuração do MySQL. Examine o log de erro do MySQL para obter saída de depuração relacionada às operações do **memcached**.

  ```sql
  [mysqld]
  ...
  loose-daemon_memcached_option='-vvv'
  ```

- Se as colunas especificadas para armazenar valores do **memcached** tiverem o tipo de dado errado, como um tipo numérico em vez de um tipo de string, as tentativas de armazenar pares chave-valor falham sem nenhum código de erro ou mensagem específica.

- Se o plugin `daemon_memcached` causar problemas na inicialização do servidor MySQL, você pode desativar temporariamente o plugin `daemon_memcached` durante a solução de problemas, adicionando esta linha sob o grupo `[mysqld]` no arquivo de configuração do MySQL:

  ```sql
  daemon_memcached=OFF
  ```

  Por exemplo, se você executar a instrução `INSTALL PLUGIN` antes de executar o script de configuração `innodb_memcached_config.sql` para configurar o banco de dados e as tabelas necessárias, o servidor pode encerrar inesperadamente e não iniciar. O servidor também pode não iniciar se você configurar incorretamente uma entrada na tabela `innodb_memcache.containers`.

  Para desinstalar o plugin **memcached** para uma instância do MySQL, execute a seguinte instrução:

  ```sql
  mysql> UNINSTALL PLUGIN daemon_memcached;
  ```

- Se você estiver executando mais de uma instância do MySQL na mesma máquina com o plugin `daemon_memcached` habilitado em cada instância, use o parâmetro de configuração `daemon_memcached_option` para especificar uma porta **memcached** única para cada plugin `daemon_memcached`.

- Se uma instrução SQL não conseguir encontrar a tabela `InnoDB` ou não encontrar dados na tabela, mas as chamadas à API do **memcached** recuperarem os dados esperados, você pode estar faltando uma entrada para a tabela `InnoDB` na tabela `innodb_memcache.containers`, ou pode não ter mudado para a tabela `InnoDB` correta ao emitir uma solicitação de `get` ou `set` usando a notação `@@table_id`. Esse problema também pode ocorrer se você alterar uma entrada existente na tabela `innodb_memcache.containers` sem reiniciar o servidor MySQL depois disso. O mecanismo de armazenamento livre de formato é flexível o suficiente para que suas solicitações de armazenamento ou recuperação de um valor de várias colunas, como `col1|col2|col3`, ainda funcionem, mesmo que o daemon esteja usando a tabela `test.demo_test`, que armazena valores em uma única coluna.

- Ao definir sua própria tabela `InnoDB` para uso com o plugin `daemon_memcached`, e as colunas da tabela forem definidas como `NOT NULL`, certifique-se de que valores sejam fornecidos para as colunas `NOT NULL` ao inserir um registro para a tabela na tabela `innodb_memcache.containers`. Se a instrução `INSERT` para o registro `innodb_memcache.containers` contiver menos valores delimitados do que as colunas mapeadas, as colunas não preenchidas serão definidas como `NULL`. Tentar inserir um valor `NULL` em uma coluna `NOT NULL` faz com que a `INSERT` falhe, o que só pode se tornar evidente após você reinicializar o plugin `daemon_memcached` para aplicar as alterações na tabela `innodb_memcache.containers`.

- Se os campos `cas_column` e `expire_time_column` da tabela `innodb_memcached.containers` forem definidos como `NULL`, o seguinte erro será retornado ao tentar carregar o plugin **memcached**:

  ```sql
  InnoDB_Memcached: column 6 in the entry for config table 'containers' in
  database 'innodb_memcache' has an invalid NULL value.
  ```

  O plugin **memcached** rejeita o uso de `NULL` nas colunas `cas_column` e `expire_time_column`. Defina o valor dessas colunas para `0` quando as colunas estiverem desativadas.

- À medida que o comprimento da chave e dos valores do **memcached** aumentam, você pode encontrar limites de tamanho e comprimento.

  - Quando a chave excede 250 bytes, as operações do **memcached** retornam um erro. Esse é atualmente um limite fixo dentro do **memcached**.

  - Os limites da tabela `InnoDB` podem ser encontrados se os valores ultrapassarem 768 bytes de tamanho, 3072 bytes de tamanho ou metade do valor de `innodb_page_size`. Esses limites se aplicam principalmente se você pretende criar um índice em uma coluna de valor para executar consultas geradoras de relatórios nessa coluna usando o SQL. Consulte a Seção 14.23, “Limites do InnoDB”, para obter detalhes.

  - O tamanho máximo para a combinação chave-valor é de 1 MB.

- Se você compartilhar arquivos de configuração entre servidores MySQL de diferentes versões, usar as opções de configuração mais recentes para o plugin `daemon_memcached` pode causar erros de inicialização em versões mais antigas do MySQL. Para evitar problemas de compatibilidade, use o prefixo `loose` com os nomes das opções. Por exemplo, use `loose-daemon_memcached_option='-c 64'` em vez de `daemon_memcached_option='-c 64'`.

- Não há restrições ou verificações para validar as configurações do conjunto de caracteres. O **memcached** armazena e recupera chaves e valores em bytes e, portanto, não é sensível ao conjunto de caracteres. No entanto, você deve garantir que o cliente **memcached** e a tabela do MySQL usem o mesmo conjunto de caracteres.

- As conexões do **memcached** são bloqueadas de acessar tabelas que contêm uma coluna virtual indexada. Para acessar uma coluna virtual indexada, é necessário um callback para o servidor, mas uma conexão do **memcached** não tem acesso ao código do servidor.
