### 14.21.2 Arquitetura do memcached do InnoDB

O plugin `InnoDB **memcached**` implementa o **memcached** como um daemon de plugin do MySQL que acessa diretamente o mecanismo de armazenamento `InnoDB`, ignorando a camada de SQL do MySQL.

O diagrama a seguir ilustra como uma aplicação acessa dados através do plugin `daemon_memcached`, em comparação com o SQL.

**Figura 14.4: Servidor MySQL com servidor memcached integrado**

![Mostra uma aplicação acessando dados no mecanismo de armazenamento InnoDB usando tanto o SQL quanto o protocolo memcached. Usando o SQL, a aplicação acessa os dados através da API do MySQL Server e Handler. Usando o protocolo memcached, a aplicação contorna o MySQL Server, acessando os dados através do plugin memcached e da API InnoDB. O plugin memcached é composto pela interface innodb\_memcache e cache local opcional.](images/innodb_memcached2.png)

Características do plugin `daemon_memcached`:

- **memcached** como um plugin daemon do **mysqld**. Tanto o **mysqld** quanto o **memcached** funcionam no mesmo espaço de processo, com acesso a dados com latência muito baixa.

- Acesso direto às tabelas do `InnoDB`, ignorando o analisador de SQL, o otimizador e até mesmo a camada de API do Handler.

- Protocolos padrão do **memcached**, incluindo o protocolo baseado em texto e o protocolo binário. O plugin `daemon_memcached` passa em todos os 55 testes de compatibilidade do comando **memcapable**.

- Suporte a múltiplas colunas. Você pode mapear múltiplas colunas na parte “valor” do armazenamento de chaves e valores, com os valores das colunas delimitados por um caractere de separador especificado pelo usuário.

- Por padrão, o protocolo **memcached** é usado para ler e escrever dados diretamente no `InnoDB`, permitindo que o MySQL gerencie o cache em memória usando o pool de buffers do `InnoDB`. As configurações padrão representam uma combinação de alta confiabilidade e o menor número de surpresas para aplicações de banco de dados. Por exemplo, as configurações padrão evitam dados não confirmados no lado do banco de dados ou dados desatualizados retornados para solicitações de **memcached** `get`.

- Usuários avançados podem configurar o sistema como um servidor tradicional de **memcached**, com todos os dados armazenados apenas no motor **memcached** (cache de memória), ou usar uma combinação do motor **memcached** (cache de memória) e do motor **memcached** `InnoDB` (`InnoDB` como armazenamento persistente de back-end).

- O controle sobre a frequência com que os dados são trocados entre as operações do `InnoDB` e do \*\*memcached`através das opções de configuração`innodb\_api\_bk\_commit\_interval`, `daemon\_memcached\_r\_batch\_size`e`daemon\_memcached\_w\_batch\_size\`. As opções de tamanho de lote têm um valor padrão de 1 para máxima confiabilidade.

- A capacidade de especificar opções do **memcached** através do parâmetro de configuração `daemon_memcached_option`. Por exemplo, você pode alterar a porta em que o **memcached** escuta, reduzir o número máximo de conexões simultâneas, alterar o tamanho máximo de memória para um par chave-valor ou habilitar mensagens de depuração para o log de erros.

- A opção de configuração `innodb_api_trx_level` controla o nível de isolamento de transações em consultas processadas pelo **memcached**. Embora o **memcached** não tenha um conceito de transações, você pode usar essa opção para controlar o quão rapidamente o **memcached** vê as alterações causadas por instruções SQL emitidas na tabela usada pelo plugin **daemon\_memcached**. Por padrão, `innodb_api_trx_level` está definido como `READ UNCOMMITTED`.

- A opção `innodb_api_enable_mdl` pode ser usada para bloquear a tabela no nível do MySQL, de modo que a tabela mapeada não possa ser excluída ou alterada por DDL através da interface SQL. Sem o bloqueio, a tabela pode ser excluída da camada MySQL, mas mantida no armazenamento do `InnoDB` até que o **memcached** ou outro usuário pare de usá-la. “MDL” significa “bloqueio de metadados”.
