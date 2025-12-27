#### 20.5.3.2 Configurando Garantías de Consistência de Transações

Embora a seção Pontos de Sincronização de Transações explique que, conceitualmente, existem dois pontos de sincronização a partir dos quais você pode escolher: antes de leitura ou antes de escrita, esses termos foram uma simplificação e os termos usados na Replicação em Grupo são: *antes* e *depois* da execução da transação. O nível de consistência pode ter efeitos diferentes em transações de leitura apenas e de leitura/escrita processadas pelo grupo, conforme demonstrado nesta seção.

* Como Escolher um Nível de Consistência
* Impactos dos Níveis de Consistência
* Impacto da Consistência na Eleição Primária
* Consultas Permitidas Sob as Regras de Consistência

A lista a seguir mostra os possíveis níveis de consistência que você pode configurar na Replicação em Grupo usando a variável `group_replication_consistency`, em ordem crescente de garantia de consistência de transações:

* `EVENTUAL`

  Nem as transações de leitura apenas nem as transações de leitura/escrita esperam que as transações anteriores sejam aplicadas antes de serem executadas. Esse foi o comportamento da Replicação em Grupo antes de a variável `group_replication_consistency` ser adicionada. Uma transação de leitura/escrita não espera que outros membros apliquem uma transação. Isso significa que uma transação poderia ser externalizada em um membro antes dos outros. Isso também significa que, em caso de uma falha primária, o novo primário pode aceitar novas transações de leitura apenas e de leitura/escrita antes que todas as transações do primário anterior sejam aplicadas. Transações de leitura apenas podem resultar em valores desatualizados, transações de leitura/escrita podem resultar em um rollback devido a conflitos.

* `BEFORE_ON_PRIMARY_FAILOVER`

Novas transações de leitura ou de leitura/escrita com um primário recém-eleito que está aplicando um atraso do primário antigo não são aplicadas até que qualquer atraso seja aplicado. Isso garante que, quando ocorre um failover de primário, intencionalmente ou não, os clientes sempre vejam o valor mais recente no primário. Isso garante consistência, mas significa que os clientes devem ser capazes de lidar com o atraso no caso de um atraso estar sendo aplicado. Geralmente, esse atraso deve ser mínimo, mas isso depende do tamanho do atraso.

* `ANTES`

  Uma transação de leitura/escrita aguarda que todas as transações anteriores sejam concluídas antes de ser aplicada. Uma transação de leitura apenas aguarda que todas as transações anteriores sejam concluídas antes de ser executada. Isso garante que essa transação leia o valor mais recente, apenas afetando a latência da transação. Isso reduz o overhead de sincronização em cada transação de leitura/escrita, garantindo que a sincronização seja usada apenas em transações de leitura apenas. Esse nível de consistência também inclui as garantias de consistência fornecidas por `ANTES_EM_FALLOVER_DE_PRIMÁRIO`.

* `DEPOIS`

Uma transação de leitura/escrita aguarda até que suas alterações sejam aplicadas em todos os outros membros. Esse valor não tem efeito em transações apenas de leitura. Esse modo garante que, quando uma transação é confirmada no membro local, qualquer transação subsequente lê o valor escrito ou um valor mais recente em qualquer membro do grupo. Use esse modo com um grupo que seja utilizado principalmente para operações de leitura apenas para garantir que as transações de leitura/escrita aplicadas sejam aplicadas em todos os lugares quando forem confirmadas. Isso pode ser usado pelo seu aplicativo para garantir que as leituras subsequentes obtenham os dados mais recentes, que incluem as escritas mais recentes. Isso reduz o overhead de sincronização em cada transação apenas de leitura, garantindo que a sincronização seja usada apenas em transações de leitura/escrita. Esse nível de consistência também inclui as garantias de consistência fornecidas por `BEFORE_ON_PRIMARY_FAILOVER`.

* `BEFORE_AND_AFTER`

  Uma transação de leitura/escrita aguarda 1) que todas as transações anteriores sejam concluídas antes de serem aplicadas e 2) até que suas alterações sejam aplicadas em outros membros. Uma transação apenas de leitura aguarda que todas as transações anteriores sejam concluídas antes da execução. Esse nível de consistência também inclui as garantias de consistência fornecidas por `BEFORE_ON_PRIMARY_FAILOVER`.

Os níveis de consistência `BEFORE` e `BEFORE_AND_AFTER` podem ser usados em transações de leitura apenas e de leitura/escrita. O nível de consistência `AFTER` não tem impacto em transações apenas de leitura, porque elas não geram alterações.

##### Como Escolher um Nível de Consistência

Os diferentes níveis de consistência oferecem flexibilidade tanto para os DBA, que podem usá-los para configurar sua infraestrutura; quanto para os desenvolvedores, que podem usar o nível de garantia de consistência que melhor atenda às necessidades de sua aplicação. Os seguintes cenários mostram como escolher um nível de garantia de consistência com base na forma como você usa seu grupo:

* *Cenário 1*: Você deseja equilibrar leituras sem se preocupar com leituras desatualizadas, e as operações de escrita do grupo são consideravelmente menores do que as operações de leitura do grupo. Neste caso, você deve escolher `AFTER`.

* *Cenário 2*: Para um conjunto de dados que aplica muitas escritas, você deseja realizar leituras ocasionais sem preocupações com a leitura de dados desatualizados. Neste caso, você deve escolher `BEFORE`.

* *Cenário 3*: Você deseja que transações específicas leiam apenas dados atualizados do grupo, para que, sempre que dados sensíveis, como credenciais para um arquivo, forem atualizados, as leituras sempre usem o valor mais recente. Neste caso, você deve escolher `BEFORE`.

* *Cenário 4*: Para um grupo que tem dados predominantemente de leitura, você deseja que as transações de leitura/escrita sejam aplicadas em todos os lugares uma vez que sejam confirmadas, para que as leituras subsequentes sejam feitas em dados que incluam suas últimas escritas e você não incorra no custo de sincronização para cada transação de leitura-somente, mas apenas para as transações de leitura/escrita. Neste caso, você deve escolher `AFTER`.

* *Cenário 5*: Para um grupo que trabalha predominantemente com dados de leitura-somente, você deseja que as transações de leitura/escrita leiam dados atualizados do grupo e sejam aplicadas em todos os lugares uma vez que sejam confirmadas, para que as leituras subsequentes sejam realizadas em dados que incluam a última escrita e você não incorra no custo de sincronização para cada transação de leitura-somente, mas apenas para as transações de leitura/escrita. Neste caso, você deve escolher `BEFORE_AND_AFTER`.

Você pode escolher o escopo para o qual o nível de consistência é aplicado definindo `group_replication_consistency` com escopo de sessão ou global. Isso é importante porque os níveis de consistência podem ter um impacto negativo no desempenho do grupo quando aplicados globalmente.

Para aplicar o nível de consistência para a sessão atual, use o escopo de sessão, da seguinte forma:

```
> SET @@SESSION.group_replication_consistency= 'BEFORE';
```

Para aplicar o nível de consistência para todas as sessões, use o escopo global, como mostrado aqui:

```
> SET @@GLOBAL.group_replication_consistency= 'BEFORE';
```

A possibilidade de definir o nível de consistência em sessões específicas permite que você aproveite cenários como os listados aqui:

* *Cenário 6*: Um sistema específico lida com várias instruções que não requerem um alto nível de consistência, mas uma instrução específica requer um alto nível de consistência: gerenciar permissões de acesso a documentos; Nesse cenário, o sistema altera as permissões de acesso e deseja ter certeza de que todos os clientes veem a permissão correta. Você só precisa de `SET @@SESSION.group_replication_consistency= ‘AFTER’`, para essas instruções e deixar as outras instruções para serem executadas com `EVENTUAL` definido no escopo global.

* *Cenário 7*: No mesmo sistema descrito no Cenário 6, um comando que realiza análises precisa ser executado diariamente, usando os dados mais atualizados. Para isso, você só precisa executar a instrução SQL `SET @@SESSION.group_replication_consistency= ‘BEFORE’` antes de executar o comando.

Em resumo, você não precisa executar todas as transações com o mesmo nível de consistência específico, especialmente se apenas algumas transações realmente a requerem.

Você deve estar ciente de que todas as transações de leitura/escrita são sempre ordenadas na Replicação por Grupo, então, mesmo quando você define o nível de consistência para `AFTER` para a sessão atual, essa transação aguarda até que suas alterações sejam aplicadas em todos os membros, o que significa esperar por essa transação e por todas as transações anteriores que possam estar nas filas dos secundários. Em outras palavras, o nível de consistência `AFTER` aguarda por tudo até e incluindo essa transação.

##### Impactos dos Níveis de Consistência

Outra maneira de classificar os níveis de consistência é em termos de impacto no grupo, ou seja, as repercussões que os níveis de consistência têm nos outros membros.

O nível de consistência `BEFORE`, além de ser ordenado no fluxo de transações, só impacta no membro local. Ou seja, ele não requer coordenação com os outros membros e não tem repercussões em suas transações. Em outras palavras, `BEFORE` só impacta nas transações nas quais é usado.

Os níveis de consistência `AFTER` e `BEFORE_AND_AFTER` têm efeitos colaterais em transações concorrentes executadas em outros membros. Esses níveis de consistência fazem com que as transações dos outros membros esperem se transações com o nível de consistência `EVENTUAL` começarem enquanto uma transação com `AFTER` ou `BEFORE_AND_AFTER` está sendo executada. Os outros membros esperam até que a transação `AFTER` seja comprometida naquele membro, mesmo que as transações do outro membro tenham o nível de consistência `EVENTUAL`. Em outras palavras, `AFTER` e `BEFORE_AND_AFTER` impactam *todos* os membros do grupo `ONLINE`.

Para ilustrar isso mais, imagine um grupo com 3 membros, M1, M2 e M3. No membro M1, um cliente emite:

```
> SET @@SESSION.group_replication_consistency= AFTER;
> BEGIN;
> INSERT INTO t1 VALUES (1);
> COMMIT;
```

Então, enquanto a transação acima está sendo aplicada, no membro M2, um cliente emite:

```
> SET SESSION group_replication_consistency= EVENTUAL;
```

Nessa situação, mesmo que o nível de consistência da segunda transação seja `EVENTUAL`, porque ela começa a ser executada enquanto a primeira transação já está na fase de commit no M2, a segunda transação tem que esperar que a primeira transação termine o commit e só então pode ser executada.

Você só pode usar os níveis de consistência `ANTES`, `DEPOIS` e `ANTES_E_DEPOIS` em membros `ONLINE`, tentando usá-los em membros em outros estados causa um erro de sessão.

Transações cujo nível de consistência não é `EVENTUAL` mantêm a execução até que um tempo limite, configurado pelo valor `wait_timeout`, seja alcançado, que tem como padrão 8 horas. Se o tempo limite for alcançado, um erro `ER_GR_HOLD_WAIT_TIMEOUT` é lançado.

##### Impacto da Consistência na Eleição Primária

Esta seção descreve como o nível de consistência de um grupo impacta em um grupo de eleição primária única que elegeu um novo primário. Tal grupo detecta automaticamente falhas e ajusta a visão dos membros que estão ativos, ou seja, a configuração da associação. Além disso, se um grupo é implantado no modo de eleição primária única, sempre que a associação do grupo muda, é realizada uma verificação para detectar se ainda há um membro primário no grupo. Se não houver, um novo é selecionado da lista de membros secundários. Tipicamente, isso é conhecido como promoção secundária.

Dada a capacidade do sistema de detectar falhas e se reconectar automaticamente, o usuário também pode esperar que, uma vez que a promoção ocorra, o novo primário esteja no estado exato, em termos de dados, daquele do antigo. Em outras palavras, o usuário pode esperar que não haja um atraso de transações replicadas a serem aplicadas no novo primário assim que ele puder lê-lo e escrevê-lo nele. Em termos práticos, o usuário pode esperar que, uma vez que sua aplicação seja feita a fail-over para o novo primário, não haja chance, mesmo temporariamente, de ler dados antigos ou escrever em registros de dados antigos.

Quando o controle de fluxo é ativado e ajustado corretamente em um grupo, há apenas uma pequena chance de ler dados desatualizados de um primário recém-eleito imediatamente após a promoção, pois não deve haver um atraso, ou se houver, ele deve ser pequeno. Além disso, você pode ter camadas de proxy ou middleware que governam os acessos da aplicação ao primário após uma promoção e aplicam os critérios de consistência nesse nível. Você pode especificar o comportamento do novo primário após sua promoção usando a variável `group_replication_consistency`, que controla se um primário recém-eleito bloqueia leituras e escritas até que o atraso seja totalmente aplicado. Se a variável `group_replication_consistency` foi definida como `BEFORE_ON_PRIMARY_FAILOVER` em um primário recém-eleito que tem um atraso a ser aplicado, e transações são emitidas contra o novo primário enquanto ele ainda está aplicando o atraso, as transações recebidas são bloqueadas até que o atraso seja totalmente aplicado. Isso previne as seguintes anomalias:

* Não há leituras desatualizadas para transações de leitura apenas e de leitura/escrita. Isso previne que leituras desatualizadas sejam externalizadas para a aplicação pelo novo primário.

* Nenhuma rollback falso para transações de leitura/escrita, devido a conflitos de escrita/escrita com transações de leitura/escrita replicadas ainda no backlog aguardando aplicação.

* Nenhuma assimetria de leitura em transações de leitura/escrita, como esta:

  ```
  > BEGIN;
  > SELECT x FROM t1; -- x=1 because x=2 is in the backlog;
  > INSERT x INTO t2;
  > COMMIT;
  ```

  Esta consulta não deve causar um conflito, mas escreve valores desatualizados.

Para resumir, quando `group_replication_consistency` é definido como `BEFORE_ON_PRIMARY_FAILOVER`, você está escolhendo priorizar a consistência em detrimento da disponibilidade, porque leituras e escritas são mantidas sempre que um novo primário é eleito. Esse é o compromisso que você deve considerar ao configurar seu grupo. Também deve ser lembrado que, se o controle de fluxo estiver funcionando corretamente, o backlog deve ser mínimo. Note que os níveis de consistência mais altos `BEFORE`, `AFTER` e `BEFORE_AND_AFTER` também incluem as garantias de consistência fornecidas por `BEFORE_ON_PRIMARY_FAILOVER`.

Para garantir que o grupo forneça o mesmo nível de consistência, independentemente de qual membro seja promovido ao primário, todos os membros do grupo devem ter `BEFORE_ON_PRIMARY_FAILOVER` (ou um nível de consistência mais alto) persistido em sua configuração. Por exemplo, em cada membro:

```
> SET PERSIST group_replication_consistency='BEFORE_ON_PRIMARY_FAILOVER';
```

Isso garante que os membros se comportem da mesma maneira e que a configuração seja persistida após o reinício do membro.

Uma transação não pode ficar em espera para sempre, e se o tempo de espera exceder `wait_timeout`, ela retorna um erro ER\_GR\_HOLD\_WAIT\_TIMEOUT.

##### Consultas Permitidas Sob Regras de Consistência


Embora todas as escritas sejam bloqueadas ao usar o nível de consistência `BEFORE_ON_PRIMARY_FAILOVER`, nem todas as leituras são bloqueadas para garantir que você ainda possa inspecionar o servidor enquanto ele está aplicando o backlog após uma promoção ter ocorrido. Isso é útil para depuração, monitoramento, observabilidade e solução de problemas. Algumas consultas que não modificam dados são permitidas, como as seguintes:

* Declarações `SHOW`: Elas são restritas às que não dependem de dados, apenas de status e configuração.

As declarações `SHOW` permitidas são `SHOW VARIABLES`, `SHOW PROCESSLIST`, `SHOW STATUS`, `SHOW ENGINE INNODB LOGS`, `SHOW ENGINE INNODB STATUS`, `SHOW ENGINE INNODB MUTEX`, `SHOW BINARY LOG STATUS`, `SHOW ENGINE INNODB REPLICA`, `SHOW CHARACTER SET`, `SHOW COLLATION`, `SHOW BINARY LOGS`, `SHOW OPEN TABLES`, `SHOW REPLICAS`, `SHOW BINLOG EVENTS`, `SHOW WARNINGS`, `SHOW ERRORS`, `SHOW ENGINES`, `SHOW PRIVILEGES`, `SHOW PROCEDURE STATUS`, `SHOW FUNCTION STATUS`, `SHOW PLUGINS`, `SHOW EVENTS`, `SHOW PROFILE`, `SHOW PROFILES` e `SHOW RELAYLOG EVENTS`.

* Declarações `SET`
* Declarações `DO` que não usam tabelas ou funções carregáveis

* Declarações `EMPTY`
* Declarações `USE`
* Usar declarações `SELECT` contra os bancos de dados `performance_schema` e `sys`

* Usar declarações `SELECT` contra a tabela `PROCESSLIST` do banco de dados `infoschema`

* Declarações `SELECT` que não usam tabelas ou funções carregáveis

* Declarações `STOP GROUP_REPLICATION`

* Declarações `SHUTDOWN`
* Declarações `RESET PERSIST`