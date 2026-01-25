### 14.21.2 Arquitetura memcached do InnoDB

O plugin **memcached** do `InnoDB` implementa o **memcached** como um daemon de plugin do MySQL que acessa o storage engine `InnoDB` diretamente, contornando a camada SQL do MySQL.

O diagrama a seguir ilustra como um aplicativo acessa dados através do plugin `daemon_memcached`, em comparação com o SQL.

**Figura 14.4 Servidor MySQL com Servidor memcached Integrado**

![Mostra um aplicativo acessando dados no storage engine InnoDB usando tanto SQL quanto o protocolo memcached. Usando SQL, o aplicativo acessa dados através do MySQL Server e do Handler API. Usando o protocolo memcached, o aplicativo contorna o MySQL Server, acessando dados através do plugin memcached e do InnoDB API. O plugin memcached é composto pela interface innodb_memcache e por um cache local opcional.](images/innodb_memcached2.png)

Funcionalidades do plugin `daemon_memcached`:

* O **memcached** como um daemon plugin do **mysqld**. Tanto o **mysqld** quanto o **memcached** são executados no mesmo espaço de processo, com acesso a dados de latência muito baixa.

* Acesso direto a tabelas `InnoDB`, contornando o SQL parser, o optimizer e até mesmo a camada do Handler API.

* Protocolos **memcached** padrão, incluindo o protocolo baseado em texto e o protocolo binário. O plugin `daemon_memcached` passa em todos os 55 testes de compatibilidade do comando **memcapable**.

* Suporte a múltiplas colunas. Você pode mapear múltiplas colunas na parte de "value" (valor) do key-value store, com os valores das colunas delimitados por um caractere separador especificado pelo usuário.

* Por padrão, o protocolo **memcached** é usado para ler e escrever dados diretamente no `InnoDB`, permitindo que o MySQL gerencie o caching em memória usando o `InnoDB` buffer pool. As configurações padrão representam uma combinação de alta confiabilidade e menos surpresas para aplicativos de Database. Por exemplo, as configurações padrão evitam dados não commitados (uncommitted) no lado do Database ou dados obsoletos (stale data) retornados para as requisições `get` do **memcached**.

* Usuários avançados podem configurar o sistema como um servidor **memcached** tradicional, com todos os dados em cache apenas no engine **memcached** (memory caching), ou usar uma combinação do "engine **memcached**" (memory caching) e do engine **memcached** do `InnoDB` (`InnoDB` como armazenamento persistente de back-end).

* Controle sobre a frequência com que os dados são transmitidos entre as operações do `InnoDB` e do **memcached** por meio das opções de configuração `innodb_api_bk_commit_interval`, `daemon_memcached_r_batch_size` e `daemon_memcached_w_batch_size`. As opções de tamanho de Batch (lote) são padronizadas para o valor 1 para máxima confiabilidade.

* A capacidade de especificar opções do **memcached** através do parâmetro de configuração `daemon_memcached_option`. Por exemplo, você pode alterar a port em que o **memcached** escuta, reduzir o número máximo de conexões simultâneas, alterar o tamanho máximo de memória para um par key-value, ou habilitar mensagens de debugging para o error log.

* A opção de configuração `innodb_api_trx_level` controla o transaction isolation level em Queries processadas pelo **memcached**. Embora o **memcached** não tenha um conceito de Transactions, você pode usar esta opção para controlar a rapidez com que o **memcached** enxerga as alterações causadas pelas instruções SQL emitidas na tabela usada pelo plugin **daemon_memcached**. Por padrão, `innodb_api_trx_level` é configurado como `READ UNCOMMITTED`.

* A opção `innodb_api_enable_mdl` pode ser usada para aplicar Lock na tabela no nível do MySQL, de modo que a tabela mapeada não possa ser eliminada (dropped) ou alterada por DDL através da interface SQL. Sem o Lock, a tabela pode ser eliminada da camada MySQL, mas mantida no storage do `InnoDB` até que o **memcached** ou algum outro usuário pare de usá-la. "MDL" significa "metadata locking".