#### 7.1.12.1 Interfaces de conexão

Esta seção descreve aspectos de como o servidor MySQL gerencia as conexões dos clientes.

- Interfaces de rede e Threads do Gestor de Conexão
- Gestão de Fios de Conexão do Cliente
- Gestão de volume de conexão

##### Interfaces de rede e Threads do Gestor de Conexão

O servidor é capaz de ouvir conexões de clientes em várias interfaces de rede. Os threads do gerenciador de conexões lidam com solicitações de conexão de clientes nas interfaces de rede que o servidor escuta:

- Em todas as plataformas, um fio de gerenciamento lida com as solicitações de conexão TCP/IP.

- No Unix, o mesmo fio do gerenciador também lida com solicitações de conexão de arquivos de soquete Unix.

- No Windows, um fio de gerenciamento lida com os pedidos de conexão de memória compartilhada e outro lida com os pedidos de conexão de tubos nomeados.

- Em todas as plataformas, uma interface de rede adicional pode ser habilitada para aceitar solicitações de conexão TCP/IP administrativas. Essa interface pode usar o fio do gerenciador que lida com solicitações TCP/IP "ordinárias" ou um fio separado.

O servidor não cria threads para lidar com interfaces que ele não escuta. Por exemplo, um servidor Windows que não tem suporte para conexões de canal nomeado habilitado não cria uma thread para lidar com elas.

Os plugins ou componentes de servidor individual podem implementar sua própria interface de conexão:

- O X Plugin permite que o MySQL Server se comunique com clientes usando o Protocolo X. Veja a Seção 22.5, “X Plugin”.

##### Gestão de Fios de Conexão do Cliente

Os threads do gerenciador de conexões associam cada conexão de cliente a um thread dedicado a ela que lida com a autenticação e o processamento de solicitações para essa conexão. Os threads do gerenciador criam um novo thread quando necessário, mas tentam evitar isso consultando primeiro o cache de threads para ver se ele contém um thread que pode ser usado para a conexão. Quando uma conexão termina, seu thread é devolvido ao cache de threads se o cache não estiver cheio.

Nesse modelo de fio de thread, há tantos fios quanto clientes atualmente conectados, o que tem algumas desvantagens quando a carga de trabalho do servidor precisa escalar para lidar com um grande número de conexões. Por exemplo, a criação e o descarte de threads se tornam caros. Além disso, cada thread requer recursos do servidor e do kernel, como espaço de pilha. Para acomodar um grande número de conexões simultâneas, o tamanho da pilha por thread deve ser mantido pequeno, levando a uma situação em que ela é ou muito pequena ou o servidor consome grandes quantidades de memória. A esgotamento de outros recursos também pode ocorrer, e o overhead de escalonamento pode se tornar significativo.

A Edição Empresarial do MySQL inclui um plugin de pool de threads que oferece um modelo alternativo de gerenciamento de threads, projetado para reduzir o overhead e melhorar o desempenho. Ele implementa um pool de threads que aumenta o desempenho do servidor ao gerenciar eficientemente os threads de execução de instruções para um grande número de conexões de clientes. Veja a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

Para controlar e monitorar como o servidor gerencia os threads que lidam com as conexões dos clientes, várias variáveis de sistema e status são relevantes. (Veja a Seção 7.1.8, “Variáveis de Sistema do Servidor”, e a Seção 7.1.10, “Variáveis de Status do Servidor”.)

- A variável de sistema `thread_cache_size` determina o tamanho do cache de threads. Por padrão, o servidor ajusta o valor automaticamente ao iniciar, mas pode ser definido explicitamente para substituir esse valor padrão. Um valor de 0 desativa o cache, o que faz com que um thread seja criado para cada nova conexão e descartado quando a conexão é encerrada. Para habilitar o cache de threads de conexão inativa `N`, defina `thread_cache_size` para `N` ao iniciar o servidor ou durante o runtime. Um thread de conexão torna-se inativo quando a conexão do cliente com a qual ele estava associado é encerrada.

- Para monitorar o número de threads no cache e quantos threads foram criados porque uma thread não pôde ser retirada do cache, verifique as variáveis de status `Threads_cached` e `Threads_created`.

- Quando a pilha de threads é muito pequena, isso limita a complexidade das instruções SQL que o servidor pode processar, a profundidade de recursividade de procedimentos armazenados e outras ações que consomem memória. Para definir um tamanho de pilha de `N` bytes para cada thread, inicie o servidor com `thread_stack` definido como `N`.

##### Gestão de volume de conexão

Para controlar o número máximo de clientes que o servidor permite se conectar simultaneamente, defina a variável de sistema `max_connections` no início ou durante o funcionamento do servidor. Pode ser necessário aumentar `max_connections` se mais clientes tentarem se conectar simultaneamente do que o servidor está configurado para lidar (consulte a Seção B.3.2.5, “Muitas conexões”). Se o servidor recusar uma conexão porque o limite `max_connections` for atingido, ele incrementa a variável de status `Connection_errors_max_connections`.

O **mysqld** permite, na verdade, `max_connections`

- 1 conexão de cliente. A conexão extra é reservada para uso por contas que possuem o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`). Ao conceder o privilégio aos administradores e não aos usuários normais (que não deveriam precisar dele), um administrador pode se conectar ao servidor e usar `SHOW PROCESSLIST` para diagnosticar problemas, mesmo que o número máximo de clientes não privilegiados esteja conectado. Veja a Seção 15.7.7.29, “Instrução SHOW PROCESSLIST”.

A partir do MySQL 8.0.14, o servidor também permite conexões administrativas em uma interface de rede administrativa, que você pode configurar usando um endereço IP e uma porta dedicados. Veja a Seção 7.1.12.2, “Gerenciamento de Conexão Administrativa”.

O plugin de replicação em grupo interage com o MySQL Server usando sessões internas para realizar operações da API SQL. Em versões para o MySQL 8.0.18, essas sessões contam para o limite de conexões do cliente especificado pela variável de sistema do servidor `max_connections`. Nesses lançamentos, se o servidor atingir o limite `max_connections` quando a replicação em grupo for iniciada ou tentar realizar uma operação, a operação será malsucedida e a replicação em grupo ou o próprio servidor podem parar. A partir do MySQL 8.0.19, as sessões internas da replicação em grupo são tratadas separadamente das conexões do cliente, então elas não contam para o limite `max_connections` e não são recusadas se o servidor atingir esse limite.

O número máximo de conexões de clientes que o MySQL suporta (ou seja, o valor máximo para o qual o `max_connections` pode ser definido) depende de vários fatores:

- A qualidade da biblioteca de fios em uma determinada plataforma.
- A quantidade de RAM disponível.
- A quantidade de RAM é usada para cada conexão.
- A carga de trabalho de cada conexão.
- O tempo de resposta desejado.
- O número de descritores de arquivo disponíveis.

O Linux ou o Solaris devem ser capazes de suportar, rotineiramente, pelo menos 500 a 1000 conexões simultâneas e até 10.000 conexões se você tiver muitos gigabytes de RAM disponíveis e a carga de trabalho de cada uma for baixa ou o tempo de resposta não exigir muito.

Aumentar o valor de `max_connections` aumenta o número de descritores de arquivo que o **mysqld** requer. Se o número de descritores necessários não estiver disponível, o servidor reduz o valor de `max_connections`. Para comentários sobre os limites de descritores de arquivo, consulte a Seção 10.4.3.1, “Como o MySQL Abre e Fecha Tabelas”.

Pode ser necessário aumentar a variável de sistema `open_files_limit`, o que também pode exigir aumentar o limite do sistema operacional sobre quantos descritores de arquivo podem ser usados pelo MySQL. Consulte a documentação do seu sistema operacional para determinar se é possível aumentar o limite e como fazer isso. Veja também a Seção B.3.2.16, “Arquivo Não Encontrado e Erros Semelhantes”.
