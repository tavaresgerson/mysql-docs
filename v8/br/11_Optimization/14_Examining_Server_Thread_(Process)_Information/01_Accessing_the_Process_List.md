### 10.14.1 Acessar a Lista de Processos

A discussão a seguir enumera as fontes de informações sobre processos, os privilégios necessários para visualizar informações sobre processos e descreve o conteúdo das entradas da lista de processos.

- Fontes de informações sobre o processo
- Privilegios necessários para acessar a lista de processos
- Conteúdo das entradas da lista de processos

#### Fontes de informações sobre o processo

As informações sobre o processo estão disponíveis nessas fontes:

- A declaração `SHOW PROCESSLIST`: Seção 15.7.7.29, “Declaração SHOW PROCESSLIST”

- O comando **mysqladmin processlist**: Seção 6.5.2, “mysqladmin — Um programa de administração do servidor MySQL”

- A tabela `INFORMATION_SCHEMA` `PROCESSLIST`: Seção 28.3.23, “A tabela INFORMATION\_SCHEMA PROCESSLIST”

- A tabela do Schema de Desempenho `processlist`: Seção 29.12.21.7, “A tabela processlist”

- As colunas da tabela Schema de Desempenho `threads` com nomes que têm um prefixo de `PROCESSLIST_`: Seção 29.12.21.8, “A Tabela de Threads”

- Os esquemas de vistas `sys` `processlist` e `session`: Seção 30.4.3.22, “O processolist e as vistas x$processlist”, e Seção 30.4.3.33, “A sessão e as vistas x$session”

A tabela `threads` é comparada a `SHOW PROCESSLIST`, `INFORMATION_SCHEMA` `PROCESSLIST` e **mysqladmin processlist** da seguinte forma:

- O acesso à tabela `threads` não requer um mutex e tem um impacto mínimo no desempenho do servidor. As outras fontes têm consequências negativas no desempenho porque requerem um mutex.

  Nota

  A partir do MySQL 8.0.22, uma implementação alternativa para `SHOW PROCESSLIST` está disponível com base na tabela do Schema de Desempenho `processlist`, que, assim como a tabela `threads`, não requer um mutex e possui melhores características de desempenho. Para detalhes, consulte a Seção 29.12.21.7, “A tabela processlist”.

- A tabela `threads` exibe os threads de segundo plano, que as outras fontes não fazem. Ela também fornece informações adicionais para cada thread que as outras fontes não fornecem, como se a thread é de primeiro plano ou de segundo plano, e a localização dentro do servidor associada à thread. Isso significa que a tabela `threads` pode ser usada para monitorar a atividade das threads que as outras fontes não podem.

- Você pode habilitar ou desabilitar o monitoramento de threads do Schema de Desempenho, conforme descrito na Seção 29.12.21.8, “A Tabela de Threads”.

Por essas razões, os DBA que realizam monitoramento de servidores usando uma das outras fontes de informações de thread podem querer monitorar usando a tabela `threads` em vez disso.

A visualização `sys` do esquema `processlist` apresenta informações da tabela do Schema de Desempenho `threads` em um formato mais acessível. A visualização `sys` do esquema `session` apresenta informações sobre sessões de usuário, como a visualização `sys` do esquema `processlist`, mas com os processos de fundo filtrados.

#### Privilegios necessários para acessar a lista de processos

Para a maioria das fontes de informações de processo, se você tiver o privilégio `PROCESS`, poderá ver todos os tópicos, mesmo aqueles pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESS`), os usuários não anônimos têm acesso às informações sobre seus próprios tópicos, mas não a tópicos de outros usuários, e os usuários anônimos não têm acesso às informações dos tópicos.

A tabela do Schema de Desempenho `threads` também fornece informações sobre os threads, mas o acesso à tabela utiliza um modelo de privilégio diferente. Consulte a Seção 29.12.21.8, “A tabela de threads”.

#### Conteúdo das entradas da lista de processos

Cada entrada da lista de processos contém várias informações. A lista a seguir descreve essas informações usando as etiquetas da saída `SHOW PROCESSLIST`. Outras fontes de informações sobre processos usam etiquetas semelhantes.

- `Id` é o identificador de conexão do cliente associado ao thread.

- `User` e `Host` indicam a conta associada ao tópico.

- `db` é o banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

- `Command` e `State` indicam o que a thread está fazendo.

  A maioria dos estados corresponde a operações muito rápidas. Se um fio permanecer em um determinado estado por muitos segundos, pode haver um problema que precisa ser investigado.

  As seções a seguir listam os possíveis valores de `Command` e os valores de `State` agrupados por categoria. O significado de alguns desses valores é evidente. Para outros, uma descrição adicional é fornecida.

  Nota

  As aplicações que examinam as informações da lista de processos devem estar cientes de que os comandos e estados estão sujeitos a alterações.

- `Time` indica quanto tempo o fio está em seu estado atual. A noção do fio sobre a hora atual pode ser alterada em alguns casos: o fio pode alterar a hora com `SET TIMESTAMP = value`. Para um fio de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Veja a Seção 19.2.3, “Fios de Replicação”.

- `Info` indica a instrução que a thread está executando, ou `NULL` se não estiver executando nenhuma instrução. Para `SHOW PROCESSLIST`, esse valor contém apenas os primeiros 100 caracteres da instrução. Para ver instruções completas, use `SHOW FULL PROCESSLIST` (ou consulte uma fonte de informações de processo diferente).
