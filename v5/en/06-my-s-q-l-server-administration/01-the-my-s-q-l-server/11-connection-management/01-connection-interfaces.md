#### 5.1.11.1 Interfaces de Conexão

Esta seção descreve aspectos de como o servidor MySQL gerencia as conexões de clientes.

* [Interfaces de Rede e Threads do Gerenciador de Conexões](connection-interfaces.html#connection-interfaces-interfaces "Network Interfaces and Connection Manager Threads")
* [Gerenciamento de Threads de Conexão de Cliente](connection-interfaces.html#connection-interfaces-thread-management "Client Connection Thread Management")
* [Gerenciamento de Volume de Conexões](connection-interfaces.html#connection-interfaces-volume-management "Connection Volume Management")

##### Interfaces de Rede e Threads do Gerenciador de Conexões

O servidor é capaz de ouvir conexões de clientes em múltiplas interfaces de rede. Os *threads* do *Connection Manager* (Gerenciador de Conexões) lidam com as requisições de conexão de clientes nas interfaces de rede que o servidor está ouvindo:

* Em todas as plataformas, um *manager thread* lida com as requisições de conexão TCP/IP.

* No Unix, o mesmo *manager thread* também lida com as requisições de conexão de *socket* de arquivo Unix.

* No Windows, um *manager thread* lida com requisições de conexão de memória compartilhada, e outro lida com requisições de conexão de *named-pipe*.

O servidor não cria *threads* para lidar com interfaces que ele não está ouvindo. Por exemplo, um servidor Windows que não tem suporte habilitado para conexões *named-pipe* não cria um *thread* para lidar com elas.

*Plugins* ou componentes individuais do servidor podem implementar sua própria interface de conexão:

* O X Plugin permite que o MySQL Server se comunique com clientes usando o X Protocol. Consulte [Seção 19.4, “X Plugin”](x-plugin.html "19.4 X Plugin").

##### Gerenciamento de Threads de Conexão de Cliente

Os *threads* do *Connection Manager* associam cada conexão de cliente a um *thread* dedicado a ela, que lida com a autenticação e o processamento de requisições para essa conexão. Os *manager threads* criam um novo *thread* quando necessário, mas tentam evitar isso consultando primeiro o *thread cache* para verificar se ele contém um *thread* que pode ser usado para a conexão. Quando uma conexão é encerrada, seu *thread* é retornado ao *thread cache* se o *cache* não estiver cheio.

Neste modelo de *connection thread*, há tantos *threads* quanto clientes atualmente conectados, o que apresenta algumas desvantagens quando a carga de trabalho do servidor precisa ser escalada para lidar com um grande número de conexões. Por exemplo, a criação e o descarte de *threads* tornam-se operações custosas. Além disso, cada *thread* requer recursos do servidor e do *kernel*, como espaço de *stack*. Para acomodar um grande número de conexões simultâneas, o tamanho do *stack* por *thread* deve ser mantido pequeno, levando a uma situação onde ele é pequeno demais ou o servidor consome grandes quantidades de memória. A exaustão de outros recursos também pode ocorrer, e a sobrecarga de agendamento (*scheduling overhead*) pode se tornar significativa.

O MySQL Enterprise Edition inclui um *thread pool plugin* que fornece um modelo alternativo de manipulação de *threads*, projetado para reduzir a sobrecarga e melhorar a performance. Ele implementa um *thread pool* que aumenta a performance do servidor gerenciando eficientemente os *threads* de execução de comandos (*statement execution threads*) para um grande número de conexões de clientes. Consulte [Seção 5.5.3, “MySQL Enterprise Thread Pool”](thread-pool.html "5.5.3 MySQL Enterprise Thread Pool").

Para controlar e monitorar como o servidor gerencia os *threads* que lidam com conexões de clientes, várias variáveis de sistema e de status são relevantes. (Consulte [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables") e [Seção 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables").)

* A variável de sistema [`thread_cache_size`](server-system-variables.html#sysvar_thread_cache_size) determina o tamanho do *thread cache*. Por padrão, o servidor dimensiona automaticamente o valor na inicialização, mas ele pode ser definido explicitamente para anular esse padrão. Um valor de 0 desabilita o *caching*, o que faz com que um *thread* seja configurado para cada nova conexão e descartado quando a conexão termina. Para permitir que *`N`* *threads* de conexão inativos sejam armazenados em *cache*, defina [`thread_cache_size`](server-system-variables.html#sysvar_thread_cache_size) para *`N`* na inicialização do servidor ou em tempo de execução (*runtime*). Um *connection thread* torna-se inativo quando a conexão de cliente à qual estava associado é encerrada.

* Para monitorar o número de *threads* no *cache* e quantos *threads* foram criados porque um *thread* não pôde ser retirado do *cache*, verifique as variáveis de status [`Threads_cached`](server-status-variables.html#statvar_Threads_cached) e [`Threads_created`](server-status-variables.html#statvar_Threads_created).

* Quando o *thread stack* é muito pequeno, isso limita a complexidade dos comandos SQL que o servidor pode manipular, a profundidade de recursão de *stored procedures* e outras ações que consomem memória. Para definir um tamanho de *stack* de *`N`* *bytes* para cada *thread*, inicie o servidor com [`thread_stack`](server-system-variables.html#sysvar_thread_stack) definido como *`N`*.

##### Gerenciamento de Volume de Conexões

Para controlar o número máximo de clientes que o servidor permite conectar simultaneamente, defina a variável de sistema [`max_connections`](server-system-variables.html#sysvar_max_connections) na inicialização do servidor ou em tempo de execução (*runtime*). Pode ser necessário aumentar [`max_connections`](server-system-variables.html#sysvar_max_connections) se mais clientes tentarem conectar simultaneamente do que o servidor está configurado para lidar (consulte [Seção B.3.2.5, “Too many connections”](too-many-connections.html "B.3.2.5 Too many connections")).

O [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") na verdade permite [`max_connections`](server-system-variables.html#sysvar_max_connections) + 1 conexões de cliente. A conexão extra é reservada para uso por contas que possuem o privilégio [`SUPER`](privileges-provided.html#priv_super). Ao conceder o privilégio a administradores e não a usuários normais (que não deveriam precisar dele), um administrador que também tem o privilégio [`PROCESS`](privileges-provided.html#priv_process) pode se conectar ao servidor e usar [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") para diagnosticar problemas, mesmo que o número máximo de clientes não privilegiados esteja conectado. Consulte [Seção 13.7.5.29, “SHOW PROCESSLIST Statement”](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").

Se o servidor recusar uma conexão porque o limite de [`max_connections`](server-system-variables.html#sysvar_max_connections) foi atingido, ele incrementa a variável de status [`Connection_errors_max_connections`](server-status-variables.html#statvar_Connection_errors_max_connections).

O número máximo de conexões que o MySQL suporta (ou seja, o valor máximo para o qual [`max_connections`](server-system-variables.html#sysvar_max_connections) pode ser definido) depende de vários fatores:

* A qualidade da *thread library* em uma determinada plataforma.
* A quantidade de RAM disponível.
* A quantidade de RAM usada para cada conexão.
* A carga de trabalho (*workload*) de cada conexão.
* O tempo de resposta desejado.
* O número de *file descriptors* disponíveis.

Linux ou Solaris devem ser capazes de suportar rotineiramente pelo menos 500 a 1000 conexões simultâneas e até 10.000 conexões se você tiver muitos gigabytes de RAM disponíveis e a carga de trabalho de cada uma for baixa ou o tempo de resposta alvo não for exigente.

Aumentar o valor de [`max_connections`](server-system-variables.html#sysvar_max_connections) aumenta o número de *file descriptors* que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") requer. Se o número necessário de *descriptors* não estiver disponível, o servidor reduz o valor de [`max_connections`](server-system-variables.html#sysvar_max_connections). Para comentários sobre limites de *file descriptor*, consulte [Seção 8.4.3.1, “How MySQL Opens and Closes Tables”](table-cache.html "8.4.3.1 How MySQL Opens and Closes Tables").

Pode ser necessário aumentar a variável de sistema [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit), o que também pode exigir o aumento do limite do sistema operacional sobre quantos *file descriptors* podem ser usados pelo MySQL. Consulte a documentação do seu sistema operacional para determinar se é possível aumentar o limite e como fazê-lo. Consulte também [Seção B.3.2.16, “File Not Found and Similar Errors”](not-enough-file-handles.html "B.3.2.16 File Not Found and Similar Errors").