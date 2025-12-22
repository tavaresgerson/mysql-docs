#### Interfaces de ligação

Esta seção descreve aspectos de como o servidor MySQL gerencia conexões de cliente.

- Interfaces de rede e threads de gerenciamento de conexão
- Gerenciamento do thread de conexão do cliente
- Gerenciamento de volume de conexão

##### Interfaces de rede e threads de gerenciamento de conexão

O servidor é capaz de ouvir as conexões do cliente em várias interfaces de rede.

- Em todas as plataformas, um thread de gerenciamento lida com solicitações de conexão TCP / IP.
- No Unix, o mesmo thread de gerenciamento também lida com solicitações de conexão de arquivos de soquete do Unix.
- No Windows, um thread de gerenciamento lida com solicitações de conexão de memória compartilhada e outro lida com solicitações de conexão de tubo nomeado.
- Em todas as plataformas, uma interface de rede adicional pode ser habilitada para aceitar solicitações de conexão TCP/IP administrativas.

O servidor não cria threads para lidar com interfaces que ele não escuta. Por exemplo, um servidor Windows que não tem suporte para conexões de name-pipe habilitadas não cria um thread para lidar com elas.

Os plugins ou componentes de servidor individuais podem implementar sua própria interface de conexão:

- O Plugin X permite que o MySQL Server se comunique com clientes usando o protocolo X. Veja Seção 22.5,  Plugin X.

##### Gerenciamento do thread de conexão do cliente

Os threads de gerenciamento de conexão associam cada conexão do cliente a um thread dedicado a ele que lida com a autenticação e o processamento de solicitações para essa conexão. Os threads de gerenciamento criam um novo thread quando necessário, mas tentam evitar fazê-lo consultando o cache do thread primeiro para ver se ele contém um thread que pode ser usado para a conexão. Quando uma conexão termina, seu thread é devolvido ao cache do thread se o cache não estiver cheio.

Neste modelo de thread de conexão, há tantos threads quanto clientes conectados, o que tem algumas desvantagens quando a carga de trabalho do servidor deve ser escalada para lidar com um grande número de conexões. Por exemplo, a criação e eliminação de threads se torna cara. Além disso, cada thread requer recursos do servidor e do kernel, como espaço de pilha. Para acomodar um grande número de conexões simultâneas, o tamanho da pilha por thread deve ser mantido pequeno, levando a uma situação em que é muito pequeno ou o servidor consome grandes quantidades de memória. O esgotamento de outros recursos também pode ocorrer e o overhead de agendamento pode se tornar significativo.

O MySQL Enterprise Edition inclui um plugin de pool de threads que fornece um modelo alternativo de manuseio de threads projetado para reduzir a sobrecarga e melhorar o desempenho.

Para controlar e monitorar como o servidor gerencia threads que lidam com conexões de clientes, várias variáveis de sistema e status são relevantes (ver Seção 7.1.8, "Variáveis do Sistema do Servidor" e Seção 7.1.10, "Variáveis de Status do Servidor").

- A variável do sistema `thread_cache_size` determina o tamanho do cache de thread. Por padrão, o servidor auto-dimensiona o valor no início, mas ele pode ser definido explicitamente para substituir esse padrão. Um valor de 0 desativa o cache, o que faz com que um thread seja configurado para cada nova conexão e eliminado quando a conexão termina. Para permitir que `N` threads de conexão inativos sejam armazenados em cache, configure `thread_cache_size` para `N` no início do servidor ou no tempo de execução. Um thread de conexão torna-se inativo quando a conexão do cliente com o qual ele foi associado termina.
- Para monitorar o número de tópicos no cache e quantos tópicos foram criados porque um tópico não pôde ser retirado do cache, verifique as variáveis de status `Threads_cached` e `Threads_created`.
- Quando a pilha de threads é muito pequena, isso limita a complexidade das instruções SQL que o servidor pode lidar, a profundidade de recursão de procedimentos armazenados e outras ações que consomem memória.

##### Gerenciamento de volume de conexão

Para controlar o número máximo de clientes que o servidor permite se conectar simultaneamente, defina a variável de sistema `max_connections` no início do servidor ou no tempo de execução. Pode ser necessário aumentar `max_connections` se mais clientes tentarem se conectar simultaneamente, então o servidor está configurado para lidar (ver Seção B.3.2.5, Muitas conexões). Se o servidor recusar uma conexão porque o limite de `max_connections` é atingido, ele aumenta a variável de status `Connection_errors_max_connections`.

`mysqld` realmente permite `max_connections`

- 1 conexões de cliente. A conexão extra é reservada para uso por contas que têm o privilégio `CONNECTION_ADMIN` (ou o privilégio depreciado `SUPER`). Ao conceder o privilégio aos administradores e não aos usuários normais (que não devem precisar dele), um administrador pode se conectar ao servidor e usar `SHOW PROCESSLIST` para diagnosticar problemas, mesmo que o número máximo de clientes não privilegiados esteja conectado. Veja Seção 15.7.7.31, SHOW PROCESSLIST Statement.

O servidor também permite conexões administrativas em uma interface de rede administrativa, que pode ser configurada usando um endereço IP e uma porta dedicados.

O plugin de replicação de grupo interage com o MySQL Server usando sessões internas para executar operações de API SQL. As sessões internas da replicação de grupo são tratadas separadamente das conexões do cliente, de modo que não contam para o limite `max_connections` e não são recusadas se o servidor atingir esse limite.

O número máximo de conexões de cliente suportadas pelo MySQL (ou seja, o valor máximo para o qual `max_connections` pode ser definido) depende de vários fatores:

- A qualidade da biblioteca de threads em uma determinada plataforma.
- A quantidade de memória RAM disponível.
- A quantidade de RAM é usada para cada conexão.
- A carga de trabalho de cada conexão.
- O tempo de resposta desejado.
- O número de descritores de ficheiros disponíveis.

O Linux ou o Solaris devem ser capazes de suportar pelo menos 500 a 1000 conexões simultâneas de rotina e até 10.000 conexões se você tiver muitos gigabytes de RAM disponíveis e a carga de trabalho de cada um for baixa ou o objetivo de tempo de resposta não exigente.

Aumentando o valor de `max_connections` aumenta o número de descritores de arquivos que `mysqld` requer. Se o número necessário de descritores não estiver disponível, o servidor reduz o valor de `max_connections`.

Aumentar a variável do sistema `open_files_limit` pode ser necessário, o que também pode exigir aumentar o limite do sistema operacional sobre quantos descritores de arquivo podem ser usados pelo MySQL. Consulte a documentação do sistema operacional para determinar se é possível aumentar o limite e como fazê-lo. Veja também a Seção B.3.2.16, "Arquivo não encontrado e erros semelhantes".
