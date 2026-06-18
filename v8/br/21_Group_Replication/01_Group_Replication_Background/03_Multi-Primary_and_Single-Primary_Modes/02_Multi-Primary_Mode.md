#### 20.1.3.2 Modo Multi-Primario

No modo multi-primário (`group_replication_single_primary_mode=OFF`) nenhum membro tem um papel especial. Qualquer membro que seja compatível com os outros membros do grupo é configurado no modo de leitura/escrita ao se juntar ao grupo e pode processar transações de escrita, mesmo que sejam emitidas simultaneamente.

Se um membro parar de aceitar transações de escrita, por exemplo, em caso de uma saída inesperada do servidor, os clientes conectados a ele podem ser redirecionados ou substituídos por qualquer outro membro que esteja no modo de leitura/escrita. A Replicação em Grupo não gerencia o failover do lado do cliente, então você precisa organizar isso usando uma estrutura de middleware, como o MySQL Router 8.0, um proxy, um conector ou o próprio aplicativo. A Figura 20.5, “Failover do Cliente”, mostra como os clientes podem se reconectar a um membro do grupo alternativo se um membro sair do grupo.

**Figura 20.5 Failover do cliente**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group. All of the servers are primaries. Write clients are communicating with servers S1 and S2, and a read client is communicating with server S4. Server S1 then fails, breaking communication with its write client. This client reconnects to server S3.](images/multi-primary.png)

A replicação em grupo é um sistema de consistência eventual. Isso significa que, assim que o tráfego de entrada desacelera ou para, todos os membros do grupo têm o mesmo conteúdo de dados. Enquanto o tráfego está fluindo, as transações podem ser externalizadas em alguns membros antes dos outros, especialmente se alguns membros tiverem um throughput de escrita menor do que outros, criando a possibilidade de leituras desatualizadas. No modo multi-primário, os membros mais lentos também podem acumular um backlog excessivo de transações para certificar e aplicar, aumentando o risco de conflitos e falha na certificação. Para limitar esses problemas, você pode ativar e ajustar o mecanismo de controle de fluxo da replicação em grupo para minimizar a diferença entre os membros rápidos e lentos. Para mais informações sobre controle de fluxo, consulte a Seção 20.7.2, “Controle de Fluxo”.

No MySQL 8.0.14 e versões posteriores, se você deseja garantir a consistência de transações para todas as transações do grupo, pode fazer isso usando a variável de sistema `group_replication_consistency`. Você pode escolher um ajuste que se adeque ao volume de trabalho do seu grupo e às suas prioridades para leituras e escritas de dados, levando em consideração o impacto no desempenho da sincronização necessária para aumentar a consistência. Você também pode definir a variável de sistema para sessões individuais para proteger transações particularmente sensíveis à concorrência. Para mais informações sobre consistência de transações, consulte a Seção 20.5.3, “Garantindo Consistência de Transações”.

##### 20.1.3.2.1 Verificação de Transações

Quando um grupo é implantado no modo multi-primário, as transações são verificadas para garantir que sejam compatíveis com o modo. As seguintes verificações de consistência rigorosas são realizadas quando a Replicação de Grupo é implantada no modo multi-primário:

- Se uma transação for executada com o nível de isolamento SERIALIZABLE, seu commit falhará ao se sincronizar com o grupo.

- Se uma transação for executada contra uma tabela que possui chaves estrangeiras com restrições em cascata, seu commit falhará ao se sincronizar com o grupo.

Os controles são controlados pela variável de sistema `group_replication_enforce_update_everywhere_checks`. No modo multi-primário, a variável de sistema deve ser normalmente definida como `ON`, mas os controles podem ser desativados opcionalmente definindo a variável de sistema como `OFF`. Ao ser implantado no modo single-primário, a variável de sistema deve ser definida como `OFF`.

##### 20.1.3.2.2 Declarações de Definição de Dados

Em uma topologia de replicação em grupo no modo multi-primário, é necessário ter cuidado ao executar declarações de definição de dados, também comumente conhecidas como linguagem de definição de dados (DDL).

O MySQL 8.0 introduz suporte para instruções de Linguagem de Definição de Dados (DDL) atômicas, onde a instrução completa de DDL é comprometida ou revertida como uma única transação atômica. As instruções de DDL, sejam elas atômicas ou não, encerram implicitamente qualquer transação ativa na sessão atual, como se você tivesse executado um `COMMIT` antes de executar a instrução. Isso significa que as instruções de DDL não podem ser executadas dentro de outra transação, dentro de instruções de controle de transação como `START TRANSACTION ... COMMIT`, ou combinadas com outras instruções dentro da mesma transação.

A replicação em grupo é baseada em um paradigma de replicação otimista, onde as declarações são executadas otimisticamente e desfeitas posteriormente, se necessário. Cada servidor executa sem garantir o acordo do grupo primeiro. Portanto, é necessário ter mais cuidado ao replicar declarações DDL no modo multi-primário. Se você fizer alterações no esquema (usando DDL) e alterações nos dados que um objeto contém (usando DML) para o mesmo objeto, as alterações precisam ser tratadas pelo mesmo servidor enquanto a operação de esquema ainda não estiver concluída e replicada em todos os lugares. Não fazer isso pode resultar em inconsistência de dados quando as operações são interrompidas ou apenas parcialmente concluídas. Se o grupo for implantado no modo single-primário, esse problema não ocorre, porque todas as alterações são realizadas pelo mesmo servidor, o primário.

Para obter mais informações sobre o suporte de DDL atômico no MySQL 8.0 e as mudanças resultantes no comportamento da replicação de determinadas instruções, consulte a Seção 15.1.1, “Suporte ao DDL de Definição de Dados Atômico”.

##### 20.1.3.2.3 Versão de compatibilidade

Para a compatibilidade e o desempenho ótimos, todos os membros de um grupo devem rodar a mesma versão do MySQL Server e, portanto, da Replicação de Grupo. No modo multi-primário, isso é mais significativo porque todos os membros normalmente se juntam ao grupo no modo de leitura/escrita. Se um grupo inclui membros que estão executando mais de uma versão do MySQL Server, há o potencial de alguns membros serem incompatíveis com outros, porque eles suportam funções que outros não suportam ou carecem de funções que outros têm. Para evitar isso, quando um novo membro se junta (incluindo um ex-membro que foi atualizado e reiniciado), o membro realiza verificações de compatibilidade com o resto do grupo.

Um resultado dessas verificações de compatibilidade é particularmente importante no modo multi-primário. Se um membro que está se juntando estiver executando uma versão do MySQL Server mais alta do que a versão mais baixa que os membros do grupo existentes estão executando, ele se junta ao grupo, mas permanece no modo apenas de leitura. (Em um grupo que está executando no modo single-primário, novos membros têm acesso padrão apenas de leitura em qualquer caso.) Membros que estão executando o MySQL 8.0.17 ou versões posteriores levam em consideração a versão do patch do lançamento ao verificar sua compatibilidade. Membros que estão executando o MySQL 8.0.16 ou versões anteriores, ou o MySQL 5.7, levam em consideração apenas a versão principal.

Em um grupo que está em modo multi-primário com membros que usam diferentes versões do MySQL Server, a Replicação de Grupo gerencia automaticamente seu status de leitura/escrita e apenas leitura. Se um membro sair do grupo, os membros que estão executando a versão que agora é a mais baixa são automaticamente configurados para o modo de leitura/escrita. Quando você altera um grupo que estava executando em modo único primário para executar em modo multi-primário, usando a função `group_replication_switch_to_multi_primary_mode()`, a Replicação de Grupo configura automaticamente os membros no modo correto. Os membros são automaticamente colocados no modo apenas leitura se estiverem executando uma versão do servidor MySQL mais alta do que a versão mais baixa presente no grupo, e os membros que estão executando a versão mais baixa são colocados no modo leitura/escrita.

Para obter informações completas sobre a compatibilidade das versões em um grupo e como isso influencia o comportamento de um grupo durante um processo de atualização, consulte a Seção 20.8.1, “Combinando Diferentes Versões de Membros em um Grupo”.
