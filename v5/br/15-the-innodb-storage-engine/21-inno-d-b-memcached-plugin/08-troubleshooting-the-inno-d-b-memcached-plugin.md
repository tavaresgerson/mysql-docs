### 14.21.8 Solução de Problemas do Plugin InnoDB memcached

Esta seção descreve problemas que você pode encontrar ao usar o Plugin `InnoDB` **memcached**.

*   Se você encontrar o seguinte Error no Error Log do MySQL, o servidor pode falhar ao iniciar:

    failed to set rlimit for open files. Try running as root or requesting smaller maxconns value.

    A mensagem de Error é do daemon **memcached**. Uma solução é aumentar o limite do OS para o número de arquivos abertos. Os comandos para verificar e aumentar o limite de arquivos abertos variam por sistema operacional. Este exemplo mostra comandos para Linux e macOS:

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

    A outra solução é reduzir o número de conexões simultâneas permitidas para o daemon **memcached**. Para fazer isso, codifique a opção **memcached** `-c` no parâmetro de configuração `daemon_memcached_option` no arquivo de configuração do MySQL. A opção `-c` tem um valor padrão de 1024.

    ```sql
  [mysqld]
  ...
  loose-daemon_memcached_option='-c 64'
  ```

*   Para solucionar problemas onde o daemon **memcached** não consegue armazenar ou recuperar dados da tabela `InnoDB`, codifique a opção **memcached** `-vvv` no parâmetro de configuração `daemon_memcached_option` no arquivo de configuração do MySQL. Examine o Error Log do MySQL para saída de debug relacionada às operações do **memcached**.

    ```sql
  [mysqld]
  ...
  loose-daemon_memcached_option='-vvv'
  ```

*   Se as colunas especificadas para armazenar Values do **memcached** forem do tipo de dados incorreto, como um tipo numérico em vez de um tipo string, as tentativas de armazenar pares Key-Value falharão sem um código de Error ou mensagem específica.

*   Se o Plugin `daemon_memcached` causar problemas na inicialização do servidor MySQL, você pode desativar temporariamente o Plugin `daemon_memcached` durante a solução de problemas adicionando esta linha sob o grupo `[mysqld]` no arquivo de configuração do MySQL:

    ```sql
  daemon_memcached=OFF
  ```

    Por exemplo, se você executar a instrução `INSTALL PLUGIN` antes de executar o script de configuração `innodb_memcached_config.sql` para configurar o Database e as tabelas necessárias, o servidor pode ser encerrado inesperadamente e falhar ao iniciar. O servidor também pode falhar ao iniciar se você configurar incorretamente uma entrada na tabela `innodb_memcache.containers`.

    Para desinstalar o Plugin **memcached** de uma instância MySQL, execute a seguinte instrução:

    ```sql
  mysql> UNINSTALL PLUGIN daemon_memcached;
  ```

*   Se você executar mais de uma instância do MySQL na mesma máquina com o Plugin `daemon_memcached` ativado em cada instância, use o parâmetro de configuração `daemon_memcached_option` para especificar uma porta **memcached** exclusiva para cada Plugin `daemon_memcached`.

*   Se uma instrução SQL não conseguir encontrar a tabela `InnoDB` ou não encontrar dados na tabela, mas as chamadas de API do **memcached** recuperarem os dados esperados, você pode estar sem uma entrada para a tabela `InnoDB` na tabela `innodb_memcache.containers`, ou pode não ter mudado para a tabela `InnoDB` correta emitindo um request de `get` ou `set` usando a notação `@@table_id`. Este problema também pode ocorrer se você alterar uma entrada existente na tabela `innodb_memcache.containers` sem reiniciar o servidor MySQL posteriormente. O mecanismo de armazenamento de forma livre é flexível o suficiente para que seus requests para armazenar ou recuperar um Value de múltiplas colunas, como `col1|col2|col3`, ainda funcionem, mesmo que o daemon esteja usando a tabela `test.demo_test` que armazena Values em uma única coluna.

*   Ao definir sua própria tabela `InnoDB` para uso com o Plugin `daemon_memcached`, e as colunas na tabela estiverem definidas como `NOT NULL`, certifique-se de que os Values sejam fornecidos para as colunas `NOT NULL` ao inserir um registro para a tabela na tabela `innodb_memcache.containers`. Se a instrução `INSERT` para o registro `innodb_memcache.containers` contiver menos Values delimitados do que o número de colunas mapeadas, as colunas não preenchidas serão definidas como `NULL`. A tentativa de inserir um Value `NULL` em uma coluna `NOT NULL` fará com que o `INSERT` falhe, o que pode se tornar evidente somente após você reinicializar o Plugin `daemon_memcached` para aplicar as alterações na tabela `innodb_memcache.containers`.

*   Se os campos `cas_column` e `expire_time_column` da tabela `innodb_memcached.containers` estiverem definidos como `NULL`, o seguinte Error será retornado ao tentar carregar o Plugin **memcached**:

    ```sql
  InnoDB_Memcached: column 6 in the entry for config table 'containers' in
  database 'innodb_memcache' has an invalid NULL value.
  ```

    O Plugin **memcached** rejeita o uso de `NULL` nas colunas `cas_column` e `expire_time_column`. Defina o Value dessas colunas como `0` quando as colunas não forem utilizadas.

*   À medida que o comprimento da Key e dos Values do **memcached** aumenta, você pode encontrar limites de tamanho e comprimento.

    *   Quando a Key excede 250 bytes, as operações do **memcached** retornam um Error. Este é atualmente um limite fixo dentro do **memcached**.

    *   Limites da tabela `InnoDB` podem ser encontrados se os Values excederem 768 bytes de tamanho, 3072 bytes de tamanho, ou metade do Value de `innodb_page_size`. Esses limites se aplicam principalmente se você pretende criar um Index em uma coluna de Value para executar Queries de geração de relatórios nessa coluna usando SQL. Consulte a Seção 14.23, “InnoDB Limits” para obter detalhes.

    *   O tamanho máximo para a combinação Key-Value é de 1 MB.
*   Se você compartilhar arquivos de configuração entre servidores MySQL de diferentes versões, o uso das opções de configuração mais recentes para o Plugin `daemon_memcached` pode causar Errors de inicialização em versões mais antigas do MySQL. Para evitar problemas de compatibilidade, use o prefixo `loose` com os nomes das opções. Por exemplo, use `loose-daemon_memcached_option='-c 64'` em vez de `daemon_memcached_option='-c 64'`.

*   Não há restrição ou verificação em vigor para validar as configurações de Character Set. O **memcached** armazena e recupera Keys e Values em bytes e, portanto, não é sensível ao Character Set. No entanto, você deve garantir que o client **memcached** e a tabela MySQL usem o mesmo Character Set.

*   As conexões **memcached** são impedidas de acessar tabelas que contêm uma coluna virtual indexada. Acessar uma coluna virtual indexada requer um callback para o servidor, mas uma conexão **memcached** não tem acesso ao código do servidor.