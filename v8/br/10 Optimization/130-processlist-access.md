### 10.14.1 Acessando a Lista de Processos

A discussão a seguir enumera as fontes de informações sobre processos, os privilégios necessários para ver as informações sobre processos e descreve o conteúdo das entradas da lista de processos.

*  Fontes de Informações sobre Processos
*  Privilégios Requeridos para Acessar a Lista de Processos
*  Conteúdo das Entradas da Lista de Processos

#### Fontes de Informações sobre Processos

As informações sobre processos estão disponíveis nessas fontes:

* A declaração  `SHOW PROCESSLIST`: Seção 15.7.7.31, “Declaração SHOW PROCESSLIST”
* O comando  `mysqladmin processlist`: Seção 6.5.2, “mysqladmin — Um Programa de Administração do Servidor MySQL”
* A tabela `PROCESSLIST` do esquema `INFORMATION_SCHEMA`: Seção 28.3.23, “A Tabela `INFORMATION_SCHEMA` PROCESSLIST”
* A tabela `processlist` do Schema Performance Schema: Seção 29.12.22.7, “A tabela processlist”
* As colunas da tabela `threads` do Schema Performance Schema com nomes que têm um prefixo de `PROCESSLIST_`: Seção 29.12.22.8, “A tabela threads”
* As visualizações `processlist` e `x$processlist` do esquema `sys`: Seção 30.4.3.22, “As visualizações processlist e x$processlist”, e Seção 30.4.3.33, “As visualizações session e x$session”

A tabela `threads` é comparada a `SHOW PROCESSLIST`, `INFORMATION_SCHEMA` `PROCESSLIST` e `mysqladmin processlist` da seguinte forma:

* O acesso à tabela `threads` não requer um mutex e tem um impacto mínimo no desempenho do servidor. As outras fontes têm consequências negativas de desempenho porque requerem um mutex.

  ::: info Nota

  Uma implementação alternativa para `SHOW PROCESSLIST` está disponível com base na tabela `processlist` do Schema Performance Schema, que, como a tabela `threads`, não requer um mutex e tem melhores características de desempenho. Para detalhes, consulte a Seção 29.12.22.7, “A tabela processlist”.

:::
* A tabela `threads` exibe threads de segundo plano, que as outras fontes não fazem. Ela também fornece informações adicionais para cada thread que as outras fontes não fornecem, como se a thread é de primeiro ou de segundo plano, e a localização dentro do servidor associada à thread. Isso significa que a tabela `threads` pode ser usada para monitorar a atividade das threads que as outras fontes não podem.
* Você pode habilitar ou desabilitar o monitoramento de threads do Schema de Desempenho, conforme descrito na Seção 29.12.22.8, “A tabela threads”.

Por essas razões, os DBAs que realizam monitoramento de servidor usando uma das outras fontes de informações sobre threads podem desejar monitorar usando a tabela `threads`.

A visão `processlist` do esquema `sys` do Performance Schema apresenta informações da tabela `threads` do Performance Schema em um formato mais acessível. A visão `session` do esquema `sys` apresenta informações sobre sessões de usuário, como a visão `processlist` do esquema `sys`, mas com processos de segundo plano filtrados.

#### Privilegios Requeridos para Acessar a Lista de Processos

Para a maioria das fontes de informações sobre processos, se você tiver o privilégio `PROCESS`, poderá ver todas as threads, mesmo aquelas pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESS`), usuários não anônimos têm acesso às informações sobre suas próprias threads, mas não sobre threads de outros usuários, e usuários anônimos não têm acesso às informações sobre threads.

A tabela `threads` do Schema de Desempenho também fornece informações sobre threads, mas o acesso à tabela usa um modelo de privilégio diferente. Veja a Seção 29.12.22.8, “A tabela threads”.

#### Conteúdo das Entradas da Lista de Processos

Cada entrada da lista de processos contém várias informações. A lista a seguir descreve-as usando as etiquetas da saída `SHOW PROCESSLIST`. Outras fontes de informações sobre processos usam etiquetas semelhantes.

* `Id` é o identificador de conexão do cliente associado à thread.
* `User` e `Host` indicam a conta associada à thread.
* `db` é o banco de dados padrão para a thread, ou `NULL` se nenhum tiver sido selecionado.
* `Command` e `State` indicam o que a thread está fazendo.

A maioria dos estados corresponde a operações muito rápidas. Se uma thread permanecer em um estado específico por muitos segundos, pode haver um problema que precisa ser investigado.

As seções a seguir listam os possíveis valores de `Command` e `State`, agrupados por categoria. O significado de alguns desses valores é evidente. Para outros, é fornecida uma descrição adicional.

::: info Nota

As aplicações que examinam informações da lista de processos devem estar cientes de que os comandos e estados estão sujeitos a alterações.


:::