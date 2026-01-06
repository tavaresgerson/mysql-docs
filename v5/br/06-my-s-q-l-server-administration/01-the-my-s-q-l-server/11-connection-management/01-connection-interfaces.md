#### 5.1.11.1 Interfaces de conexão

Esta seção descreve aspectos de como o servidor MySQL gerencia as conexões dos clientes.

- Interface de rede e Threads do Gestor de Conexão
- Gestão de Fios de Conexão do Cliente
- Gerenciamento de volume de conexão Gerenciamento de interfaces de conexão

##### Interfaces de rede e Threads do Gestor de Conexão

O servidor é capaz de ouvir conexões de clientes em várias interfaces de rede. Os threads do gerenciador de conexões lidam com solicitações de conexão de clientes nas interfaces de rede que o servidor escuta:

- Em todas as plataformas, um fio de gerenciamento lida com as solicitações de conexão TCP/IP.

- No Unix, o mesmo fio do gerenciador também lida com solicitações de conexão de arquivos de soquete Unix.

- No Windows, um fio de gerenciamento lida com os pedidos de conexão de memória compartilhada e outro lida com os pedidos de conexão de tubos nomeados.

O servidor não cria threads para lidar com interfaces que ele não escuta. Por exemplo, um servidor Windows que não tem suporte para conexões de canal nomeado habilitado não cria uma thread para lidar com elas.

Os plugins ou componentes de servidor individual podem implementar sua própria interface de conexão:

- O X Plugin permite que o MySQL Server se comunique com clientes usando o Protocolo X. Veja Seção 19.4, “X Plugin”.

##### Gestão de Fios de Conexão do Cliente

Os threads do gerenciador de conexões associam cada conexão de cliente a um thread dedicado a ela que lida com a autenticação e o processamento de solicitações para essa conexão. Os threads do gerenciador criam um novo thread quando necessário, mas tentam evitar isso consultando primeiro o cache de threads para ver se ele contém um thread que pode ser usado para a conexão. Quando uma conexão termina, seu thread é devolvido ao cache de threads se o cache não estiver cheio.

Nesse modelo de fio de thread, há tantos fios quanto clientes atualmente conectados, o que tem algumas desvantagens quando a carga de trabalho do servidor precisa escalar para lidar com um grande número de conexões. Por exemplo, a criação e o descarte de threads se tornam caros. Além disso, cada thread requer recursos do servidor e do kernel, como espaço de pilha. Para acomodar um grande número de conexões simultâneas, o tamanho da pilha por thread deve ser mantido pequeno, levando a uma situação em que ela é ou muito pequena ou o servidor consome grandes quantidades de memória. A esgotamento de outros recursos também pode ocorrer, e o overhead de escalonamento pode se tornar significativo.

A Edição Empresarial do MySQL inclui um plugin de pool de threads que oferece um modelo alternativo de gerenciamento de threads, projetado para reduzir o overhead e melhorar o desempenho. Ele implementa um pool de threads que aumenta o desempenho do servidor ao gerenciar eficientemente os threads de execução de instruções para um grande número de conexões de clientes. Veja Seção 5.5.3, “MySQL Enterprise Thread Pool”.

Para controlar e monitorar como o servidor gerencia os threads que lidam com as conexões dos clientes, várias variáveis de sistema e status são relevantes. (Veja Seção 5.1.7, “Variáveis de Sistema do Servidor” e Seção 5.1.9, “Variáveis de Status do Servidor”).

- A variável de sistema `thread_cache_size` determina o tamanho do cache de threads. Por padrão, o servidor ajusta o valor automaticamente ao iniciar, mas pode ser definido explicitamente para substituir esse valor padrão. Um valor de 0 desativa o cache, o que faz com que um thread seja criado para cada nova conexão e descartado quando a conexão é encerrada. Para permitir que *`N`* threads de conexão inativa sejam cacheados, defina `thread_cache_size` para *`N`* ao iniciar o servidor ou durante o runtime. Um thread de conexão torna-se inativo quando a conexão do cliente com a qual ele estava associado é encerrada.

- Para monitorar o número de threads no cache e quantos threads foram criados porque uma thread não pôde ser retirada do cache, verifique as variáveis de status `Threads_cached` e `Threads_created`.

- Quando a pilha de threads é muito pequena, isso limita a complexidade das instruções SQL que o servidor pode processar, a profundidade de recursividade de procedimentos armazenados e outras ações que consomem memória. Para definir um tamanho de pilha de *`N`* bytes para cada thread, inicie o servidor com `thread_stack` definido como *`N`*.

##### Gestão de volume de conexão

Para controlar o número máximo de clientes que o servidor permite se conectar simultaneamente, defina a variável de sistema `max_connections` no início ou durante o funcionamento do servidor. Pode ser necessário aumentar `max_connections` se mais clientes tentarem se conectar simultaneamente do que o servidor está configurado para lidar (consulte Seção B.3.2.5, “Muitas conexões”).

**mysqld** permite, na verdade, `max_connections`

- 1 conexão de cliente. A conexão extra é reservada para uso por contas que possuem o privilégio `SUPER`. Ao conceder o privilégio aos administradores e não aos usuários normais (que não deveriam precisar dele), um administrador que também possui o privilégio `PROCESS` pode se conectar ao servidor e usar `SHOW PROCESSLIST` para diagnosticar problemas, mesmo que o número máximo de clientes não privilegiados esteja conectado. Veja Seção 13.7.5.29, “Instrução SHOW PROCESSLIST”.

Se o servidor recusar uma conexão porque o limite de `max_connections` for atingido, ele incrementa a variável de status `Connection_errors_max_connections`.

O número máximo de conexões que o MySQL suporta (ou seja, o valor máximo que `max_connections` pode ser definido) depende de vários fatores:

- A qualidade da biblioteca de fios em uma determinada plataforma.
- A quantidade de RAM disponível.
- A quantidade de RAM é usada para cada conexão.
- A carga de trabalho de cada conexão.
- O tempo de resposta desejado.
- O número de descritores de arquivo disponíveis.

O Linux ou o Solaris devem ser capazes de suportar, rotineiramente, pelo menos 500 a 1000 conexões simultâneas e até 10.000 conexões se você tiver muitos gigabytes de RAM disponíveis e a carga de trabalho de cada uma for baixa ou o tempo de resposta não exigir muito.

Aumentar o valor de `max_connections` aumenta o número de descritores de arquivo que o **mysqld** requer. Se o número necessário de descritores não estiver disponível, o servidor reduz o valor de `max_connections`. Para comentários sobre os limites de descritores de arquivo, consulte Seção 8.4.3.1, “Como o MySQL Abre e Fecha Tabelas”.

Pode ser necessário aumentar a variável de sistema `open_files_limit`, o que também pode exigir aumentar o limite do sistema operacional sobre quantos descritores de arquivo podem ser usados pelo MySQL. Consulte a documentação do seu sistema operacional para determinar se é possível aumentar o limite e como fazer isso. Veja também Seção B.3.2.16, “Arquivo Não Encontrado e Erros Semelhantes”.
