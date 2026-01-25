### 17.5.2 Otimizando a Recovery

Sempre que um novo *member* se junta a um grupo de *replication*, ele se conecta a um *donor* adequado e busca os dados que perdeu até o momento em que é declarado *online*. Este componente crítico no Group Replication é tolerante a falhas (*fault tolerant*) e configurável. A seção a seguir explica como a *recovery* funciona e como otimizar suas configurações.

#### Seleção do Donor

Um *donor* aleatório é selecionado entre os *members online* existentes no grupo. Dessa forma, há uma boa chance de que o mesmo servidor não seja selecionado mais de uma vez quando múltiplos *members* entram no grupo.

Se a conexão com o *donor* selecionado falhar, uma nova conexão é automaticamente tentada com um novo *donor* candidato. Assim que o limite de *retry* de conexão for atingido, o procedimento de *recovery* é encerrado com um erro.

Note

Um *donor* é escolhido aleatoriamente na lista de *members online* na *view* atual.

#### Switchover Automático de Donor Aprimorado

O outro ponto principal de preocupação na *recovery* como um todo é garantir que ela lide com falhas. Assim, o Group Replication fornece mecanismos robustos de detecção de erro. Em versões anteriores do Group Replication, ao tentar se conectar a um *donor*, a *recovery* só conseguia detectar erros de conexão devido a problemas de autenticação ou algum outro problema. A reação a esses cenários problemáticos era fazer o *switch over* para um novo *donor*, e uma nova tentativa de conexão era feita com um *member* diferente.

Esse comportamento foi estendido para cobrir também outros cenários de falha:

* *Cenários de dados purgados* - Se o *donor* selecionado contiver dados purgados (*purged data*) que são necessários para o processo de *recovery*, ocorre um erro. A *recovery* detecta esse erro e um novo *donor* é selecionado.

* *Dados duplicados* - Se um servidor que está entrando no grupo já contém dados que conflitam com os dados provenientes do *donor* selecionado durante a *recovery*, ocorre um erro. Isso pode ser causado por algumas *transactions* errantes presentes no servidor que está entrando no grupo.

  Pode-se argumentar que a *recovery* deveria falhar em vez de fazer o *switch over* para outro *donor*, mas em grupos heterogêneos há chance de que outros *members* compartilhem as *transactions* conflitantes e outros não. Por esse motivo, após o erro, a *recovery* seleciona outro *donor* do grupo.

* *Outros erros* - Se qualquer uma das *threads* de *recovery* falhar (as *threads receiver* ou *applier* falharem), ocorre um erro e a *recovery* faz o *switch over* para um novo *donor*.

Note

Em caso de falhas persistentes ou mesmo falhas transitórias, a *recovery* automaticamente tenta novamente (*retry*) a conexão com o mesmo *donor* ou com um novo.

#### Retries de Conexão do Donor

A transferência de dados da *recovery* depende do *binary log* e da estrutura de *replication* existente do MySQL. Portanto, é possível que alguns erros transitórios causem erros nas *threads receiver* ou *applier*. Nesses casos, o processo de *switch over* do *donor* possui funcionalidade de *retry*, semelhante à encontrada na *replication* regular.

#### Número de Tentativas

O número de tentativas que um servidor que está entrando no grupo faz ao tentar se conectar a um *donor* do *pool* de *donors* é 10. Isso é configurado por meio da variável de *plugin* [`group_replication_recovery_retry_count`](group-replication-system-variables.html#sysvar_group_replication_recovery_retry_count). O comando a seguir define o número máximo de tentativas de conexão a um *donor* para 10.

```sql
mysql> SET GLOBAL group_replication_recovery_retry_count= 10;
```

Note que isso representa o número global de tentativas que o servidor que está entrando no grupo faz ao se conectar a cada um dos *donors* adequados.

#### Rotinas de Sleep

A variável de *plugin* [`group_replication_recovery_reconnect_interval`](group-replication-system-variables.html#sysvar_group_replication_recovery_reconnect_interval) define quanto tempo o processo de *recovery* deve entrar em *sleep* entre as tentativas de conexão com o *donor*. Esta variável tem seu valor *default* definido como 60 segundos e você pode alterar este valor dinamicamente. O comando a seguir define o intervalo de *retry* de conexão do *donor* de *recovery* para 120 segundos.

```sql
mysql> SET GLOBAL group_replication_recovery_reconnect_interval= 120;
```

Note, no entanto, que a *recovery* não entra em *sleep* após cada tentativa de conexão com o *donor*. Como o servidor que está entrando no grupo está se conectando a servidores diferentes e não ao mesmo repetidamente, ele pode presumir que o problema que afeta o servidor A não afeta o servidor B. Sendo assim, a *recovery* é suspensa somente quando passou por todos os *donors* possíveis. Assim que o servidor que está entrando no grupo tentar se conectar a todos os *donors* adequados no grupo e nenhum restar, o processo de *recovery* entra em *sleep* pelo número de segundos configurado pela variável [`group_replication_recovery_reconnect_interval`](group-replication-system-variables.html#sysvar_group_replication_recovery_reconnect_interval).