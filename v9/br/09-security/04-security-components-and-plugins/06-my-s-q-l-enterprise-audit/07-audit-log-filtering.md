#### 8.4.6.7 Filtragem do Log de Auditoria

Nota

Para que a filtragem do log de auditoria funcione conforme descrito aqui, o plugin de log de auditoria *e as tabelas e funções de auditoria que o acompanham* devem estar instalados. Se o plugin for instalado sem as tabelas e funções de auditoria que o acompanham necessárias para a filtragem baseada em regras, o plugin opera no modo de filtragem legada, descrito na Seção 8.4.6.10, “Filtragem de Log de Auditoria no Modo Legado”. O modo legado (desatualizado) é o comportamento de filtragem como era antes do MySQL 5.7.13; ou seja, antes da introdução da filtragem baseada em regras.

* Propriedades da Filtragem do Log de Auditoria
* Restrições sobre as Funções de Filtragem do Log de Auditoria
* Uso das Funções de Filtragem do Log de Auditoria

##### Propriedades da Filtragem do Log de Auditoria

O plugin de log de auditoria tem a capacidade de controlar o registro de eventos auditados filtrando-os:

* Eventos auditados podem ser filtrados usando essas características:

  + Conta de usuário
  + Classe do evento de auditoria
  + Subclasse do evento de auditoria
  + Campos do evento de auditoria, como aqueles que indicam o status da operação ou a instrução SQL executada

* A filtragem de auditoria é baseada em regras:

  + Uma definição de filtro cria um conjunto de regras de auditoria. As definições podem ser configuradas para incluir ou excluir eventos para registro com base nas características descritas acima.

  + As regras de filtro têm a capacidade de bloquear (interromper) a execução de eventos qualificadores, além das capacidades existentes para o registro de eventos.

  + Podem ser definidas múltiplas filtros, e qualquer filtro dado pode ser atribuído a qualquer número de contas de usuário.

  + É possível definir um filtro padrão para uso com qualquer conta de usuário que não tenha um filtro atribuído explicitamente.

A filtragem do log de auditoria é usada para implementar serviços de componentes. Para obter as estatísticas de consulta opcionais disponíveis nessa versão, você as configura como um filtro usando o componente de serviço, que implementa os serviços que escrevem as estatísticas no log de auditoria. Para obter instruções sobre como configurar esse filtro, consulte Adicionar estatísticas de consulta para detecção de outliers.

Para informações sobre a escrita de regras de filtragem, consulte a Seção 8.4.6.8, “Escrever definições de filtros de log de auditoria”.

* Os filtros de log de auditoria podem ser definidos e modificados usando uma interface SQL com base em chamadas de função. Por padrão, as definições de filtros de log de auditoria são armazenadas no banco de dados do sistema `mysql`, e você pode exibir filtros de auditoria consultando a tabela `mysql.audit_log_filter`. É possível usar um banco de dados diferente para esse propósito, caso em que você deve consultar a tabela `database_name.audit_log_filter` em vez disso. Consulte a Seção 8.4.6.2, “Instalar ou desinstalar o MySQL Enterprise Audit”, para obter mais informações.

* Dentro de uma sessão específica, o valor da variável de sistema `audit_log_filter_id` de leitura somente permite que um filtro seja atribuído à sessão.

Nota

Por padrão, a filtragem de log de auditoria baseada em regras não registra eventos audíveis para nenhum usuário. Para registrar todos os eventos audíveis para todos os usuários, use as seguintes instruções, que criam um filtro simples para habilitar a logon e atribuí-lo à conta padrão:

```
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('%', 'log_all');
```

O filtro atribuído a `%` é usado para conexões de qualquer conta que não tenha um filtro atribuído explicitamente (o que inicialmente é verdadeiro para todas as contas).

Como mencionado anteriormente, a interface SQL para controle de filtragem de auditoria é baseada em funções. A lista a seguir resume brevemente essas funções:

* `audit_log_filter_set_filter()`: Defina um filtro.

* `audit_log_filter_remove_filter()`: Remova um filtro.

* `audit_log_filter_set_user()`: Começar a filtrar uma conta de usuário.

* `audit_log_filter_remove_user()`: Parar de filtrar uma conta de usuário.

* `audit_log_filter_flush()`: Limpar as alterações manuais nas tabelas de filtro para afetar o filtro em andamento.

Para exemplos de uso e detalhes completos sobre as funções de filtragem de logs de auditoria, consulte Usar Funções de Filtragem de Logs de Auditoria e Funções de Logs de Auditoria.

##### Restrições das Funções de Filtragem de Logs de Auditoria

As funções de filtragem de logs de auditoria estão sujeitas a essas restrições:

* Para usar qualquer função de filtragem, o plugin `audit_log` deve estar habilitado ou ocorrerá um erro. Além disso, as tabelas de auditoria devem existir ou ocorrerá um erro. Para instalar o plugin `audit_log` e suas funções e tabelas associadas, consulte a Seção 8.4.6.2, “Instalando ou Desinstalando MySQL Enterprise Audit”.

* Para usar qualquer função de filtragem, um usuário deve possuir o privilégio `SUPER` de `AUDIT_ADMIN` ou ocorrerá um erro. Para conceder um desses privilégios a uma conta de usuário, use esta declaração:

  ```
  GRANT privilege ON *.* TO user;
  ```

  Alternativamente, se você preferir evitar conceder o privilégio `AUDIT_ADMIN` ou `SUPER` enquanto ainda permite que os usuários acessem funções de filtragem específicas, programas armazenados "wrapper" podem ser definidos. Essa técnica é descrita no contexto das funções de chaveiro em Usar Funções de Chaveiro de Uso Geral; ela pode ser adaptada para uso com funções de filtragem.

* O plugin `audit_log` opera no modo legado se estiver instalado, mas as tabelas e funções de auditoria associadas não forem criadas. O plugin escreve essas mensagens no log de erro ao inicializar o servidor:

  ```
  [Warning] Plugin audit_log reported: 'Failed to open the audit log filter tables.'
  [Warning] Plugin audit_log reported: 'Audit Log plugin supports a filtering,
  which has not been installed yet. Audit Log plugin will run in the legacy
  mode, which will be disabled in the next release.'
  ```

  No modo legado, que está desatualizado, a filtragem pode ser feita com base apenas na conta ou status da conta de evento. Para detalhes, consulte a Seção 8.4.6.10, “Filtragem de Log de Auditoria no Modo Legado”.

* Teoricamente, um usuário com permissões suficientes pode, por engano, criar um item de "abort" no filtro do log de auditoria que impeça a si mesmo e outros administradores de acessar o sistema. O privilégio `AUDIT_ABORT_EXEMPT` está disponível para permitir que as consultas de uma conta de usuário sejam sempre executadas, mesmo que um item de "abort" as bloqueie. Portanto, as contas com esse privilégio podem ser usadas para recuperar o acesso a um sistema após uma má configuração do log de auditoria. A consulta ainda é registrada no log de auditoria, mas, em vez de ser rejeitada, é permitida devido ao privilégio.

As contas criadas com o privilégio `SYSTEM_USER` têm o privilégio `AUDIT_ABORT_EXEMPT` atribuído automaticamente quando são criadas. O privilégio `AUDIT_ABORT_EXEMPT` também é atribuído às contas existentes com o privilégio `SYSTEM_USER` quando você executa um procedimento de atualização, se nenhuma conta existente tiver esse privilégio atribuído.

##### Usando Funções de Filtro de Log de Auditoria

Antes de usar as funções de log de auditoria, instale-as de acordo com as instruções fornecidas na Seção 8.4.6.2, “Instalando ou Desinstalando o MySQL Enterprise Audit”. O privilégio `AUDIT_ADMIN` ou `SUPER` é necessário para usar qualquer uma dessas funções.

As funções de filtro de log de auditoria permitem o controle de filtragem fornecendo uma interface para criar, modificar e remover definições de filtro e atribuir filtros a contas de usuário.

As definições de filtro são valores `JSON`. Para informações sobre o uso de dados `JSON` no MySQL, consulte a Seção 13.5, “O Tipo de Dados JSON”. Esta seção mostra algumas definições de filtro simples. Para mais informações sobre definições de filtro, consulte a Seção 8.4.6.8, “Escrevendo Definições de Filtros de Log de Auditoria”.

Quando uma conexão chega, o plugin do log de auditoria determina qual filtro usar para a nova sessão, procurando o nome da conta do usuário nas atribuições de filtro atuais:

* Se um filtro for atribuído ao usuário, o log de auditoria usa esse filtro.

* Caso contrário, se não houver uma atribuição de filtro específica para o usuário, mas houver um filtro atribuído à conta padrão (`%`), o log de auditoria usa o filtro padrão.

* Caso contrário, o log de auditoria não seleciona eventos de auditoria da sessão para processamento.

Se uma operação de mudança de usuário ocorrer durante uma sessão (veja mysql\_change\_user()), a atribuição de filtro para a sessão é atualizada usando as mesmas regras, mas para o novo usuário.

Por padrão, nenhuma conta tem um filtro atribuído, então nenhum processamento de eventos audíveis ocorre para nenhuma conta.

Suponha que você queira alterar a configuração para registrar apenas a atividade relacionada à conexão (por exemplo, para ver eventos de conectar, mudar de usuário e desconectar, mas não as instruções SQL que os usuários executam enquanto estão conectados). Para isso, defina um filtro (mostrado aqui com o nome `log_conn_events`) que permita o registro apenas de eventos na classe `connection`, e atribua esse filtro à conta padrão, representado pelo nome da conta `%`:

```
SET @f = '{ "filter": { "class": { "name": "connection" } } }';
SELECT audit_log_filter_set_filter('log_conn_events', @f);
SELECT audit_log_filter_set_user('%', 'log_conn_events');
```

Agora, o log de auditoria usa esse filtro de conta padrão para conexões de qualquer conta que não tenha um filtro definido explicitamente.

Para atribuir um filtro explicitamente a uma conta de usuário ou contas específicas, defina o filtro e, em seguida, atribua-o às contas relevantes:

```
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('user1@localhost', 'log_all');
SELECT audit_log_filter_set_user('user2@localhost', 'log_all');
```

Agora, o registro completo está habilitado para `user1@localhost` e `user2@localhost`. As conexões de outras contas continuam sendo filtradas usando o filtro de conta padrão.

Para desassociar uma conta de usuário de seu filtro atual, desatribua o filtro ou atribua um filtro diferente:

* Para desassociar o filtro da conta de usuário:

  ```
  SELECT audit_log_filter_remove_user('user1@localhost');
  ```

  O filtro de sessões atuais para a conta permanece inalterado. Conexões subsequentes da conta são filtradas usando o filtro padrão da conta, se houver, e não são registradas caso contrário.

* Para associar um filtro diferente à conta de usuário:

  ```
  SELECT audit_log_filter_set_filter('log_nothing', '{ "filter": { "log": false } }');
  SELECT audit_log_filter_set_user('user1@localhost', 'log_nothing');
  ```

  O filtro de sessões atuais para a conta permanece inalterado. Conexões subsequentes da conta são filtradas usando o novo filtro. Para o filtro mostrado aqui, isso significa que não há registro para novas conexões de `user1@localhost`.

Para a filtragem do log de auditoria, as comparações de nome de usuário e nome de host são sensíveis ao maiúsculas e minúsculas. Isso difere das comparações para verificação de privilégios, para as quais as comparações de nome de host não são sensíveis ao maiúsculas e minúsculas.

Para remover um filtro, faça o seguinte:

```
SELECT audit_log_filter_remove_filter('log_nothing');
```

Remover um filtro também o desassocia de quaisquer usuários a quem ele é atribuído, incluindo quaisquer sessões atuais para esses usuários.

As funções de filtragem descritas acima afetam a filtragem de auditoria imediatamente e atualizam as tabelas do log de auditoria no banco de dados do sistema `mysql` que armazenam filtros e contas de usuário (veja Tabelas de Log de Auditoria). Também é possível modificar as tabelas de log de auditoria diretamente usando instruções como `INSERT`, `UPDATE` e `DELETE`, mas tais alterações não afetam a filtragem imediatamente. Para descartar suas alterações e torná-las operacionais, chame `audit_log_filter_flush()`:

```
SELECT audit_log_filter_flush();
```

Aviso

`audit_log_filter_flush()` deve ser usado apenas após modificar as tabelas de auditoria diretamente, para forçar a recarga de todos os filtros. Caso contrário, essa função deve ser evitada. É, na verdade, uma versão simplificada de descarregar e recarregar o plugin `audit_log` com `UNINSTALL PLUGIN` mais `INSTALL PLUGIN`.

`audit_log_filter_flush()` afeta todas as sessões atuais e as desliga de seus filtros anteriores. As sessões atuais não são mais registradas, a menos que elas desconectem e se reconectem ou executem uma operação de mudança de usuário.

Para determinar se um filtro está atribuído à sessão atual, verifique o valor da sessão da variável de sistema `audit_log_filter_id` de leitura somente. Se o valor for 0, nenhum filtro está atribuído. Um valor diferente de 0 indica o ID mantido internamente do filtro atribuído:

```
mysql> SELECT @@audit_log_filter_id;
+-----------------------+
| @@audit_log_filter_id |
+-----------------------+
|                     2 |
+-----------------------+
```