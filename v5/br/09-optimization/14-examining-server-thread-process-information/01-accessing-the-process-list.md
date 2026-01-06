### 8.14.1 Acessar a Lista de Processos

A discussão a seguir enumera as fontes de informações sobre processos, os privilégios necessários para visualizar informações sobre processos e descreve o conteúdo das entradas da lista de processos.

- Fontes de informações sobre o processo
- Privilegios necessários para acessar a lista de processos
- Conteúdo das entradas da lista de processos

#### Fontes de informações sobre o processo

As informações sobre o processo estão disponíveis nessas fontes:

- A declaração `SHOW PROCESSLIST`: Seção 13.7.5.29, “Declaração SHOW PROCESSLIST”

- O comando **mysqladmin processlist**: Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”

- A tabela `INFORMATION_SCHEMA` `PROCESSLIST`: Seção 24.3.18, “A tabela `INFORMATION_SCHEMA` PROCESSLIST”

- A tabela do esquema de desempenho `processlist`: Seção 25.12.16.3, “A tabela processlist”

- As colunas da tabela `threads` do Schema de Desempenho com nomes que têm um prefixo de `PROCESSLIST_`: Seção 25.12.16.4, “A tabela threads”

- As vistas `sys` `processlist` e `session`: Seção 26.4.3.22, “As vistas `processlist` e `x$processlist`”, e Seção 26.4.3.33, “As vistas `session` e `x$session`

A tabela `threads` é semelhante a `SHOW PROCESSLIST`, `INFORMATION_SCHEMA` `PROCESSLIST` e **mysqladmin processlist** da seguinte forma:

- O acesso à tabela `threads` não requer um mutex e tem um impacto mínimo no desempenho do servidor. As outras fontes têm consequências negativas no desempenho porque requerem um mutex.

  Nota

  A partir do MySQL 5.7.39, uma implementação alternativa para `SHOW PROCESSLIST` está disponível com base na tabela `processlist` do Gerenciamento de Desempenho, que, assim como a tabela `threads`, não requer um mutex e possui melhores características de desempenho. Para obter detalhes, consulte a Seção 25.12.16.3, “A tabela processlist”.

- A tabela `threads` exibe threads de fundo, que as outras fontes não fazem. Ela também fornece informações adicionais para cada thread que as outras fontes não fornecem, como se a thread é de primeiro plano ou de segundo plano, e a localização dentro do servidor associada à thread. Isso significa que a tabela `threads` pode ser usada para monitorar a atividade das threads que as outras fontes não podem.

- Você pode habilitar ou desabilitar o monitoramento de threads do Schema de Desempenho, conforme descrito na Seção 25.12.16.4, “A Tabela de Threads”.

Por essas razões, os DBA que realizam monitoramento de servidores usando uma das outras fontes de informações de threads podem querer monitorar usando a tabela `threads` em vez disso.

A visualização `sys` `processlist` do esquema apresenta informações da tabela `threads` do Schema de Desempenho de forma mais acessível. A visualização `sys` `session` do esquema apresenta informações sobre sessões de usuário, como a visualização `sys` `processlist` do esquema, mas com os processos em segundo plano filtrados.

#### Privilegios necessários para acessar a lista de processos

Para a maioria das fontes de informações de processo, se você tiver o privilégio `PROCESSO`, poderá ver todas as threads, mesmo aquelas pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESSO`), os usuários não anônimos têm acesso às informações sobre suas próprias threads, mas não sobre as threads de outros usuários, e os usuários anônimos não têm acesso às informações das threads.

A tabela do Schema de Desempenho `threads` também fornece informações sobre os threads, mas o acesso à tabela utiliza um modelo de privilégio diferente. Consulte a Seção 25.12.16.4, “A tabela threads”.

#### Conteúdo das entradas da lista de processos

Cada entrada da lista de processos contém várias informações. A lista a seguir descreve essas informações usando as etiquetas da saída `SHOW PROCESSLIST`. Outras fontes de informações sobre processos usam etiquetas semelhantes.

- `Id` é o identificador de conexão do cliente associado à thread.

- `Usuário` e `Host` indicam a conta associada à thread.

- `db` é o banco de dados padrão para o thread, ou `NULL` se nenhum tiver sido selecionado.

- `Command` e `State` indicam o que a thread está fazendo.

  A maioria dos estados corresponde a operações muito rápidas. Se um fio permanecer em um determinado estado por muitos segundos, pode haver um problema que precisa ser investigado.

  As seções a seguir listam os possíveis valores de `Command` e os valores de `State` agrupados por categoria. O significado de alguns desses valores é evidente. Para outros, uma descrição adicional é fornecida.

  Nota

  As aplicações que examinam as informações da lista de processos devem estar cientes de que os comandos e estados estão sujeitos a alterações.

- `Tempo` indica quanto tempo o fio esteve em seu estado atual. A noção do tempo atual do fio pode ser alterada em alguns casos: o fio pode alterar o tempo com `SET TIMESTAMP = valor`. Para um fio de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Veja a Seção 16.2.3, “Fios de Replicação”.

- `Info` indica a instrução que a thread está executando, ou `NULL` se não estiver executando nenhuma instrução. Para `SHOW PROCESSLIST`, esse valor contém apenas os primeiros 100 caracteres da instrução. Para ver instruções completas, use `SHOW FULL PROCESSLIST` (ou consulte uma fonte de informações de processo diferente).
