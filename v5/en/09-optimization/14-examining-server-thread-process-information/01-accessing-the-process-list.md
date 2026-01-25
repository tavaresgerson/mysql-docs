### 8.14.1 Acessando a Process List

A discussão a seguir enumera as fontes de informações de processo, os privilégios necessários para ver as informações de processo e descreve o conteúdo das entradas da Process List.

* Fontes de Informação de Processo
* Privilégios Necessários para Acessar a Process List
* Conteúdo das Entradas da Process List

#### Fontes de Informação de Processo

As informações de processo estão disponíveis a partir destas fontes:

* A instrução `SHOW PROCESSLIST`: Seção 13.7.5.29, “SHOW PROCESSLIST Statement”

* O comando **mysqladmin processlist**: Seção 4.5.2, “mysqladmin — A MySQL Server Administration Program”

* A tabela `INFORMATION_SCHEMA` `PROCESSLIST`: Seção 24.3.18, “The INFORMATION_SCHEMA PROCESSLIST Table”

* A tabela `processlist` do Performance Schema: Seção 25.12.16.3, “The processlist Table”

* As colunas da tabela `threads` do Performance Schema com nomes prefixados por `PROCESSLIST_`: Seção 25.12.16.4, “The threads Table”

* As views `processlist` e `session` do schema `sys`: Seção 26.4.3.22, “The processlist and x$processlist Views”, e Seção 26.4.3.33, “The session and x$session Views”

A tabela `threads` se compara a `SHOW PROCESSLIST`, `INFORMATION_SCHEMA` `PROCESSLIST` e **mysqladmin processlist** da seguinte forma:

* O acesso à tabela `threads` não requer um `mutex` e tem impacto mínimo no desempenho do `server`. As outras fontes têm consequências negativas de desempenho porque requerem um `mutex`.

  Note

  A partir do MySQL 5.7.39, uma implementação alternativa para `SHOW PROCESSLIST` está disponível baseada na tabela `processlist` do Performance Schema, que, assim como a tabela `threads`, não requer um `mutex` e possui melhores características de desempenho. Para detalhes, consulte a Seção 25.12.16.3, “The processlist Table”.

* A tabela `threads` exibe `background threads` (threads de segundo plano), o que as outras fontes não fazem. Ela também fornece informações adicionais para cada `thread` que as outras fontes não oferecem, como se a `thread` é de primeiro plano ou de segundo plano, e a localização dentro do `server` associada à `thread`. Isso significa que a tabela `threads` pode ser usada para monitorar a atividade de `thread` que as outras fontes não conseguem.

* Você pode habilitar ou desabilitar o monitoramento de `thread` do Performance Schema, conforme descrito na Seção 25.12.16.4, “The threads Table”.

Por estas razões, os DBAs que realizam monitoramento de `server` usando uma das outras fontes de informação de `thread` podem preferir monitorar usando a tabela `threads`.

A view `processlist` do schema `sys` apresenta informações da tabela `threads` do Performance Schema em um formato mais acessível. A view `session` do schema `sys` apresenta informações sobre sessões de usuário, assim como a view `processlist` do schema `sys`, mas com os processos de segundo plano filtrados.

#### Privilégios Necessários para Acessar a Process List

Para a maioria das fontes de informação de processo, se você tiver o privilégio `PROCESS`, você pode ver todos os `threads`, mesmo aqueles pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESS`), usuários não anônimos têm acesso a informações sobre seus próprios `threads`, mas não sobre `threads` de outros usuários, e usuários anônimos não têm acesso a informações de `thread`.

A tabela `threads` do Performance Schema também fornece informações de `thread`, mas o acesso à tabela utiliza um modelo de privilégio diferente. Consulte a Seção 25.12.16.4, “The threads Table”.

#### Conteúdo das Entradas da Process List

Cada entrada da Process List contém várias informações. A lista a seguir as descreve usando os rótulos da saída de `SHOW PROCESSLIST`. Outras fontes de informação de processo usam rótulos semelhantes.

* `Id` é o identificador de conexão para o cliente associado ao `thread`.

* `User` e `Host` indicam a conta associada ao `thread`.

* `db` é o `Database` padrão para o `thread`, ou `NULL` se nenhum tiver sido selecionado.

* `Command` e `State` indicam o que o `thread` está fazendo.

  A maioria dos `states` corresponde a operações muito rápidas. Se um `thread` permanecer em um determinado `state` por muitos segundos, pode haver um problema que precisa ser investigado.

  As seções a seguir listam os possíveis valores de `Command` e os valores de `State` agrupados por categoria. O significado de alguns desses valores é autoexplicativo. Para outros, uma descrição adicional é fornecida.

  Note

  Aplicações que examinam informações da Process List devem estar cientes de que os comandos e `states` estão sujeitos a alterações.

* `Time` indica há quanto tempo o `thread` está no seu `state` atual. A noção de tempo atual do `thread` pode ser alterada em alguns casos: O `thread` pode alterar o tempo com `SET TIMESTAMP = value`. Para um `replica SQL thread`, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da réplica. Consulte a Seção 16.2.3, “Replication Threads”.

* `Info` indica a instrução que o `thread` está executando, ou `NULL` se não estiver executando nenhuma instrução. Para `SHOW PROCESSLIST`, este valor contém apenas os primeiros 100 caracteres da instrução. Para ver instruções completas, use `SHOW FULL PROCESSLIST` (ou consulte uma fonte diferente de informação de processo).