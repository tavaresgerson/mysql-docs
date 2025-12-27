#### 7.1.12.1 Interfaces de Conexão

Esta seção descreve aspectos de como o servidor MySQL gerencia as conexões dos clientes.

* Interfaces de rede e threads do Gestor de Conexão
* Gerenciamento de threads de conexão do cliente
* Gerenciamento do volume de conexão

##### Interfaces de rede e threads do Gestor de Conexão

O servidor é capaz de ouvir conexões de clientes em múltiplas interfaces de rede. Os threads do Gestor de Conexão lidam com as solicitações de conexão do cliente nas interfaces de rede que o servidor escuta:

* Em todas as plataformas, um thread do Gestor lida com solicitações de conexão TCP/IP.

* Em Unix, o mesmo thread do Gestor também lida com solicitações de conexão de arquivos de socket Unix.

* Em Windows, um thread do Gestor lida com solicitações de conexão de memória compartilhada, e outro lida com solicitações de conexão de tubos nomeados.

* Em todas as plataformas, uma interface de rede adicional pode ser habilitada para aceitar solicitações de conexão TCP/IP administrativas. Essa interface pode usar o thread do Gestor que lida com solicitações TCP/IP "ordinárias", ou um thread separado.

O servidor não cria threads para lidar com interfaces que ele não escuta. Por exemplo, um servidor Windows que não tem suporte para conexões de tubos nomeados habilitado não cria um thread para lidar com elas.

Plugins ou componentes individuais do servidor podem implementar sua própria interface de conexão:

* O X Plugin permite que o MySQL Server se comunique com clientes usando o Protocolo X. Veja a Seção 22.5, “X Plugin”.

##### Gerenciamento de threads de conexão do cliente

Os threads do gerenciador de conexões associam cada conexão de cliente a um thread dedicado a ela que lida com a autenticação e o processamento de solicitações para essa conexão. Os threads do gerenciador criam um novo thread quando necessário, mas tentam evitar isso consultando primeiro o cache de threads para ver se ele contém um thread que pode ser usado para a conexão. Quando uma conexão termina, seu thread é devolvido ao cache de threads se o cache não estiver cheio.

Neste modelo de thread de conexão, há tantos threads quanto clientes atualmente conectados, o que tem algumas desvantagens quando a carga de trabalho do servidor deve escalar para lidar com um grande número de conexões. Por exemplo, a criação e o descarte de threads se tornam caros. Além disso, cada thread requer recursos do servidor e do kernel, como espaço de pilha. Para acomodar um grande número de conexões simultâneas, o tamanho da pilha por thread deve ser mantido pequeno, levando a uma situação em que é ou muito pequeno ou o servidor consome grandes quantidades de memória. A esgotamento de outros recursos também pode ocorrer, e o overhead de escalonamento pode se tornar significativo.

A Edição Empresarial do MySQL inclui um plugin de pool de threads que fornece um modelo alternativo de manipulação de threads projetado para reduzir o overhead e melhorar o desempenho. Ele implementa um pool de threads que aumenta o desempenho do servidor gerenciando eficientemente os threads de execução de instruções para um grande número de conexões de clientes. Veja a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

Para controlar e monitorar como o servidor gerencia os threads que lidam com conexões de clientes, várias variáveis de sistema e status são relevantes. (Veja a Seção 7.1.8, “Variáveis de Sistema do Servidor” e a Seção 7.1.10, “Variáveis de Status do Servidor”.)

* A variável de sistema `thread_cache_size` determina o tamanho do cache de threads. Por padrão, o servidor ajusta o valor automaticamente ao iniciar, mas pode ser definido explicitamente para substituir esse valor padrão. Um valor de 0 desativa o cache, o que faz com que um thread seja criado para cada nova conexão e descartado quando a conexão é encerrada. Para habilitar o cache de *N* threads de conexão inativa, defina `thread_cache_size` para *N* ao iniciar o servidor ou em tempo de execução. Um thread de conexão torna-se inativo quando a conexão do cliente com a qual ele estava associado é encerrada.

* Para monitorar o número de threads no cache e quantos threads foram criados porque um thread não pôde ser retirado do cache, verifique as variáveis de status `Threads_cached` e `Threads_created`.

* Quando a pilha de threads é muito pequena, isso limita a complexidade das instruções SQL que o servidor pode manipular, a profundidade de recursão de procedimentos armazenados e outras ações que consomem memória. Para definir um tamanho de pilha de *N* bytes para cada thread, inicie o servidor com `thread_stack` definido para *N*.

##### Gerenciamento do Volume de Conexões

Para controlar o número máximo de clientes que o servidor permite se conectar simultaneamente, defina a variável de sistema `max_connections` ao iniciar o servidor ou em tempo de execução. Pode ser necessário aumentar `max_connections` se mais clientes tentarem se conectar simultaneamente do que o servidor está configurado para lidar (consulte a Seção B.3.2.5, “Muitas conexões”). Se o servidor recusar uma conexão porque o limite de `max_connections` é atingido, ele incrementa a variável de status `Connection_errors_max_connections`.

O **mysqld** na verdade permite `max_connections`

+ 1 conexão de cliente. A conexão extra é reservada para uso por contas que possuem o privilégio `CONNECTION_ADMIN` (ou o desatualizado privilégio `SUPER`). Ao conceder o privilégio aos administradores e não aos usuários normais (que não deveriam precisar dele), um administrador pode se conectar ao servidor e usar `SHOW PROCESSLIST` para diagnosticar problemas, mesmo que o número máximo de clientes não privilegiados estejam conectados. Veja a Seção 15.7.7.32, “Instrução SHOW PROCESSLIST”.

O servidor também permite conexões administrativas em uma interface de rede administrativa, que você pode configurar usando um endereço IP e porta dedicados. Veja a Seção 7.1.12.2, “Gestão de Conexão Administrativa”.

O plugin de Replicação em Grupo interage com o MySQL Server usando sessões internas para realizar operações da API SQL. As sessões internas da Replicação em Grupo são gerenciadas separadamente das conexões de cliente, então elas não contam para o limite `max_connections` (conexões máximas) e não são recusadas se o servidor tiver atingido esse limite.

O número máximo de conexões de cliente que o MySQL suporta (ou seja, o valor máximo para o qual `max_connections` pode ser definido) depende de vários fatores:

* A qualidade da biblioteca de threads em uma determinada plataforma.
* A quantidade de RAM disponível.
* A quantidade de RAM usada para cada conexão.
* A carga de trabalho de cada conexão.
* O tempo de resposta desejado.
* O número de descritores de arquivo disponíveis.

O Linux ou Solaris devem ser capazes de suportar pelo menos 500 a 1000 conexões simultâneas rotineiramente e até 10.000 conexões se você tiver muitos gigabytes de RAM disponíveis e a carga de trabalho de cada uma for baixa ou o tempo de resposta alvo não for exigente.

Aumentar o valor de `max_connections` aumenta o número de descritores de arquivo que o **mysqld** requer. Se o número necessário de descritores não estiver disponível, o servidor reduz o valor de `max_connections`. Para comentários sobre os limites de descritores de arquivo, consulte a Seção 10.4.3.1, “Como o MySQL Abre e Fecha Tabelas”.

É possível que seja necessário aumentar a variável de sistema `open_files_limit`, o que também pode exigir aumentar o limite do sistema operacional sobre quantos descritores de arquivo podem ser usados pelo MySQL. Consulte a documentação do seu sistema operacional para determinar se é possível aumentar o limite e como fazer isso. Veja também a Seção B.3.2.16, “Ficheiro Não Encontrado e Erros Similares”.