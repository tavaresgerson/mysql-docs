## 17.4 Replicação do Grupo de Monitoramento

Você pode usar o Schema de Desempenho do MySQL para monitorar a Replicação de Grupo. Essas tabelas do Schema de Desempenho exibem informações específicas para a Replicação de Grupo:

* `replication_group_member_stats`: Veja a Seção 17.4.3, “A tabela member_stats do grupo de replicação”.

* `replication_group_members`: Veja a Seção 17.4.2, “A tabela members_do_grupo_de_replicação”.

Essas tabelas de replicação do Schema de desempenho também mostram informações relacionadas à Replicação de grupo:

* `replication_connection_status` mostra informações sobre a Replicação em Grupo, como as transações recebidas do grupo e colocadas na fila de aplicador (registro de relevo).

* `replication_applier_status` mostra os estados dos canais e dos threads relacionados à Replicação por Grupo. Esses também podem ser usados para monitorar o que os threads individuais dos trabalhadores estão fazendo.

Os canais de replicação criados pelo plugin de replicação do grupo estão listados aqui:

* `group_replication_recovery`: Usado para mudanças de replicação relacionadas à recuperação distribuída.

* `group_replication_applier`: Usado para as alterações recebidas do grupo, para aplicar transações que vêm diretamente do grupo.

Para obter informações sobre as variáveis do sistema que afetam a Replicação em Grupo, consulte a Seção 17.7.1, “Variáveis do Sistema de Replicação em Grupo”. Consulte a Seção 17.7.2, “Variáveis de Status da Replicação em Grupo”, para obter variáveis de status que fornecem informações sobre a Replicação em Grupo.

Nota

Se você está monitorando uma ou mais instâncias secundárias usando **mysqladmin**, você deve estar ciente de que uma declaração `FLUSH STATUS` executada por este utilitário cria um evento GTID na instância local, o que pode afetar operações futuras do grupo.

### 17.4.1 Estados do servidor de replicação em grupo

Existem vários estados que uma instância de servidor pode estar. Se os servidores estão se comunicando corretamente, todos relatam os mesmos estados para todos os servidores. No entanto, se houver uma partição de rede ou um servidor deixa o grupo, então informações diferentes podem ser relatadas, dependendo de qual servidor é questionado. Se o servidor deixou o grupo, ele não pode relatar informações atualizadas sobre os estados dos outros servidores. Se houver uma partição, de modo que o quórum seja perdido, os servidores não são capazes de se coordenar entre si. Como consequência, eles não podem adivinhar qual é o status dos diferentes servidores. Portanto, em vez de adivinhar seu estado, eles relatam que alguns servidores são inalcançáveis.

**Tabela 17.1 Estado do servidor**

<table><col style="width: 38%"/><col style="width: 50%"/><col style="width: 12%"/><thead><tr> <th><p> Field </p></th> <th><p> Description </p></th> <th><p> Group Synchronized </p></th> </tr></thead><tbody><tr> <th><p> <code>ONLINE</code> </p></th> <td><p>O membro está pronto para funcionar como um membro do grupo totalmente funcional, o que significa que o cliente pode se conectar e começar a executar transações.</p></td> <td><p>Sim</p></td> </tr><tr> <th><p> <code>RECOVERING</code> </p></th> <td><p>O membro está em processo de se tornar um membro ativo do grupo e atualmente está passando pelo processo de recuperação, recebendo informações do estado de um doador.</p></td> <td><p>Não</p></td> </tr><tr> <th><p> <code>OFFLINE</code> </p></th> <td><p>O plugin está carregado, mas o membro não pertence a nenhum grupo.</p></td> <td><p>Não</p></td> </tr><tr> <th><p> <code>ERROR</code> </p></th> <td><p>O estado do membro. Sempre que houver um erro na fase de recuperação ou durante a aplicação de alterações, o servidor entra neste estado.</p></td> <td><p>Não</p></td> </tr><tr> <th><p> <code>UNREACHABLE</code> </p></th> <td><p>Sempre que o detector de falha local suspeitar que um servidor específico não é acessível, por exemplo, porque foi desconectado involuntariamente, ele mostra o estado desse servidor como<code>UNREACHABLE</code>. </p></td> <td><p>Não</p></td> </tr></tbody></table>

Importante

Uma vez que uma instância entre no estado `ERROR`, a opção `super_read_only` é definida como `ON`. Para sair do estado `ERROR`, você deve configurar manualmente a instância com `super_read_only=OFF`.

Observe que a Replicação em Grupo não é *síncrona*, mas eventualmente síncrona. Mais precisamente, as transações são entregues a todos os membros do grupo na mesma ordem, mas sua execução não é sincronizada, o que significa que, após uma transação ser aceita para ser comprometida, cada membro compromete em seu próprio ritmo.

### 17.4.2 A tabela `replicação\_grupo\_membros`

A tabela `performance_schema.replication_group_members` é usada para monitorar o status das diferentes instâncias do servidor que são membros do grupo. As informações na tabela são atualizadas sempre que houver uma mudança de visão, por exemplo, quando a configuração do grupo é alterada dinamicamente quando um novo membro se junta. Nesse ponto, os servidores trocam parte de seus metadados para se sincronizar e continuar a cooperar juntos. As informações são compartilhadas entre todas as instâncias do servidor que são membros do grupo de replicação, para que as informações sobre todos os membros do grupo possam ser consultadas a partir de qualquer membro. Esta tabela pode ser usada para obter uma visão de alto nível do estado de um grupo de replicação, por exemplo, emitindo:

```sql
SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+--------------+-------------+--------------+
| CHANNEL_NAME              | MEMBER_ID	                           | MEMBER_HOST  | MEMBER_PORT | MEMBER_STATE |
+---------------------------+--------------------------------------+--------------+-------------+--------------+
| group_replication_applier | 041f26d8-f3f3-11e8-adff-080027337932 | example1     |      3306   | ONLINE       |
| group_replication_applier | f60a3e10-f3f2-11e8-8258-080027337932 | example2     |      3306   | ONLINE       |
| group_replication_applier | fc890014-f3f2-11e8-a9fd-080027337932 | example3     |      3306   | ONLINE       |
+---------------------------+--------------------------------------+--------------+-------------+--------------+
```

Com base nesse resultado, podemos ver que o grupo consiste em três membros, o número de host e de porta de cada membro que os clientes usam para se conectar ao membro, e o `server_uuid` do membro. A coluna `MEMBER_STATE` mostra uma das Seções 17.4.1, “Estados do servidor de replicação de grupo”, neste caso, mostra que todos os três membros deste grupo são `ONLINE`, e a coluna `MEMBER_ROLE` mostra que há dois segundos e um único primário. Portanto, este grupo deve estar executando no modo single-primary. A coluna `MEMBER_VERSION` pode ser útil quando você está atualizando um grupo e está combinando membros que executam diferentes versões do MySQL. Consulte a Seção 17.4.1, “Estados do servidor de replicação de grupo” para mais informações.

Para mais informações sobre o valor `Member_host` e seu impacto no processo de recuperação distribuída, consulte a Seção 17.2.1.3, “Credenciais do usuário”.

### 17.4.3 A tabela `replicação\_grupo\_membro\_estatísticas`

Cada membro de um grupo de replicação certifica e aplica as transações recebidas pelo grupo. As estatísticas sobre os procedimentos de certificação e aplicação são úteis para entender como a fila de aplicação está crescendo, quantos conflitos foram encontrados, quantas transações foram verificadas, quais transações estão comprometidas em todos os lugares, e assim por diante.

A tabela `performance_schema.replication_group_member_stats` fornece informações em nível de grupo relacionadas ao processo de certificação, e também estatísticas para as transações recebidas e originadas por cada membro individual do grupo de replicação. As informações são compartilhadas entre todas as instâncias do servidor que são membros do grupo de replicação, portanto, as informações sobre todos os membros do grupo podem ser consultadas por qualquer membro. Note que o atualização das estatísticas para membros remotos é controlada pelo período de mensagem especificado na opção `group_replication_flow_control_period`, portanto, essas podem diferir ligeiramente das estatísticas coletadas localmente para o membro onde a consulta é feita. Para usar esta tabela para monitorar um membro de Replicação de Grupo, execute a seguinte declaração:

```sql
mysql> SELECT * FROM performance_schema.replication_group_member_stats\G
```

Essas colunas são importantes para monitorar o desempenho dos membros conectados no grupo. Suponha que um dos membros do grupo sempre reporte um grande número de transações em sua fila em comparação com outros membros. Isso significa que o membro está atrasado e não consegue se manter atualizado com os outros membros do grupo. Com base nessa informação, você pode decidir remover o membro do grupo ou adiar o processamento das transações nos outros membros do grupo, a fim de reduzir o número de transações em fila. Essas informações também podem ajudá-lo a decidir como ajustar o controle de fluxo do plugin de Replicação do Grupo, veja Seção 17.9.7.3, “Controle de Fluxo”.