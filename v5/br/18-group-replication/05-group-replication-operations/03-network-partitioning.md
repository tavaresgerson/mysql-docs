### 17.5.3 Particionamento de Rede (*Network Partitioning*)

O grupo precisa alcançar o **Consensus** sempre que ocorrer uma mudança que precise ser replicada. Isso se aplica a transações regulares, mas também é necessário para mudanças na composição do grupo (**membership**) e para algumas mensagens internas que mantêm a consistência do grupo. O **Consensus** exige que a maioria dos **Members** do grupo concorde com uma determinada decisão. Quando a maioria dos **Members** do grupo é perdida, o grupo é incapaz de progredir e bloqueia, pois não consegue garantir a maioria ou o **Quorum**.

O **Quorum** pode ser perdido quando há múltiplas falhas involuntárias, fazendo com que a maioria dos **Servers** seja removida abruptamente do grupo. Por exemplo, em um grupo de 5 **Servers**, se 3 deles ficarem inativos simultaneamente, a maioria é comprometida e, portanto, nenhum **Quorum** pode ser alcançado. Na verdade, os dois restantes não conseguem determinar se os outros 3 **Servers** falharam ou se uma partição de rede isolou apenas esses 2, e, portanto, o grupo não pode ser reconfigurado automaticamente.

Por outro lado, se os **Servers** saírem do grupo voluntariamente, eles instruem o grupo a se reconfigurar. Na prática, isso significa que um **Server** que está saindo informa aos outros que está se desconectando. Isso significa que outros **Members** podem reconfigurar o grupo adequadamente, a consistência do **membership** é mantida e a maioria é recalculada. Por exemplo, no cenário acima de 5 **Servers** onde 3 saem de uma vez, se os 3 **Servers** que estão saindo avisarem o grupo que estão partindo, um por um, então o **membership** consegue se ajustar de 5 para 2, e ao mesmo tempo, garantir o **Quorum** enquanto isso acontece.

Nota

A perda de **Quorum** é, por si só, um efeito colateral de um planejamento inadequado. Planeje o tamanho do grupo para o número de falhas esperadas (independentemente de serem consecutivas, acontecerem todas de uma vez ou serem esporádicas).

As seções a seguir explicam o que fazer se o sistema se particionar de tal forma que nenhum **Quorum** seja alcançado automaticamente pelos **Servers** no grupo.

Dica

Um **Primary** que foi excluído de um grupo após uma perda de maioria seguida por uma reconfiguração pode conter transações extras que não estão incluídas no novo grupo. Se isso acontecer, a tentativa de adicionar de volta o **Member** excluído ao grupo resulta em um erro com a mensagem *This member has more executed transactions than those present in the group*.

#### Detectando Partições

A tabela do **Performance Schema** [`replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table") apresenta o **status** de cada **Server** na visão atual, a partir da perspectiva deste **Server**. Na maioria das vezes, o sistema não encontra particionamento e, portanto, a tabela mostra informações que são consistentes em todos os **Servers** do grupo. Em outras palavras, o **status** de cada **Server** nesta tabela é acordado por todos na visão atual. No entanto, se houver particionamento de rede e o **Quorum** for perdido, a tabela mostra o **status** `UNREACHABLE` para aqueles **Servers** que não podem ser contatados. Essa informação é exportada pelo detector de falhas local incorporado ao **Group Replication**.

**Figura 17.7 Perda de Quorum**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group, which is a stable group. When three of the servers, S3, S4, and S5, fail, the majority is lost and the group can no longer proceed without intervention.](images/gr-majority-lost.png)

Cinco instâncias de **Server**, S1, S2, S3, S4 e S5, são implantadas como um grupo interconectado, que é um grupo estável. Quando três dos **Servers**, S3, S4 e S5, falham, a maioria é perdida e o grupo não pode mais prosseguir sem intervenção.

Para entender esse tipo de partição de rede, a seção a seguir descreve um cenário onde inicialmente há 5 **Servers** trabalhando juntos corretamente e as mudanças que ocorrem no grupo quando apenas 2 **Servers** estão online. O cenário é ilustrado na figura.

Sendo assim, vamos assumir que existe um grupo com estes 5 **Servers**:

*   **Server** s1 com identificador de **member** `199b2df7-4aaf-11e6-bb16-28b2bd168d07`

*   **Server** s2 com identificador de **member** `199bb88e-4aaf-11e6-babe-28b2bd168d07`

*   **Server** s3 com identificador de **member** `1999b9fb-4aaf-11e6-bb54-28b2bd168d07`

*   **Server** s4 com identificador de **member** `19ab72fc-4aaf-11e6-bb51-28b2bd168d07`

*   **Server** s5 com identificador de **member** `19b33846-4aaf-11e6-ba81-28b2bd168d07`

Inicialmente, o grupo está funcionando bem e os **Servers** estão se comunicando perfeitamente entre si. Você pode verificar isso fazendo **login** no s1 e olhando a tabela do **Performance Schema** [`replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table"). Por exemplo:

```sql
mysql> SELECT MEMBER_ID,MEMBER_STATE, MEMBER_ROLE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+-------------+
| MEMBER_ID                            | MEMBER_STATE |-MEMBER_ROLE |
+--------------------------------------+--------------+-------------+
| 1999b9fb-4aaf-11e6-bb54-28b2bd168d07 | ONLINE       | SECONDARY   |
| 199b2df7-4aaf-11e6-bb16-28b2bd168d07 | ONLINE       | PRIMARY     |
| 199bb88e-4aaf-11e6-babe-28b2bd168d07 | ONLINE       | SECONDARY   |
| 19ab72fc-4aaf-11e6-bb51-28b2bd168d07 | ONLINE       | SECONDARY   |
| 19b33846-4aaf-11e6-ba81-28b2bd168d07 | ONLINE       | SECONDARY   |
+--------------------------------------+--------------+-------------+
```

No entanto, momentos depois, há uma falha catastrófica e os **Servers** s3, s4 e s5 param inesperadamente. Poucos segundos depois, verificar novamente a tabela [`replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table") no s1 mostra que ele ainda está online, mas vários outros **Members** não estão. Na verdade, como visto abaixo, eles estão marcados como `UNREACHABLE`. Além disso, o sistema não pôde se reconfigurar para mudar o **membership**, porque a maioria foi perdida.

```sql
mysql> SELECT MEMBER_ID,MEMBER_STATE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| 1999b9fb-4aaf-11e6-bb54-28b2bd168d07 | UNREACHABLE  |
| 199b2df7-4aaf-11e6-bb16-28b2bd168d07 | ONLINE       |
| 199bb88e-4aaf-11e6-babe-28b2bd168d07 | ONLINE       |
| 19ab72fc-4aaf-11e6-bb51-28b2bd168d07 | UNREACHABLE  |
| 19b33846-4aaf-11e6-ba81-28b2bd168d07 | UNREACHABLE  |
+--------------------------------------+--------------+
```

A tabela mostra que s1 está agora em um grupo que não tem como progredir sem intervenção externa, porque a maioria dos **Servers** está inacessível. Neste caso específico, a lista de **membership** do grupo precisa ser redefinida para permitir que o sistema prossiga, o que é explicado nesta seção. Alternativamente, você também pode optar por parar o **Group Replication** em s1 e s2 (ou parar completamente s1 e s2), descobrir o que aconteceu com s3, s4 e s5 e, em seguida, reiniciar o **Group Replication** (ou os **Servers**).

#### Desbloqueando uma Partição (*Unblocking a Partition*)

O **Group Replication** permite redefinir a lista de **membership** do grupo forçando uma configuração específica. Por exemplo, no caso acima, onde s1 e s2 são os únicos **Servers** online, você pode optar por forçar uma configuração de **membership** consistindo apenas de s1 e s2. Isso requer verificar algumas informações sobre s1 e s2 e, em seguida, usar a variável [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members).

**Figura 17.8 Forçando um Novo Membership**

![Three of the servers in a group, S3, S4, and S5, have failed, so the majority is lost and the group can no longer proceed without intervention. With the intervention described in the following text, S1 and S2 are able to form a stable group by themselves.](images/gr-majority-lost-to-stable-group.png)

Três dos **Servers** em um grupo, S3, S4 e S5, falharam, então a maioria foi perdida e o grupo não pode mais prosseguir sem intervenção. Com a intervenção descrita no texto a seguir, S1 e S2 são capazes de formar um grupo estável sozinhos.

Suponha que você esteja de volta à situação em que s1 e s2 são os únicos **Servers** restantes no grupo. Os **Servers** s3, s4 e s5 saíram do grupo inesperadamente. Para fazer com que os **Servers** s1 e s2 continuem, você deseja forçar uma configuração de **membership** que contenha apenas s1 e s2.

Aviso

Este procedimento usa [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members) e deve ser considerado um recurso de último caso. Ele *deve* ser usado com extremo cuidado e apenas para ignorar a perda de **Quorum**. Se mal utilizado, pode criar um cenário de **Split-Brain** artificial ou bloquear todo o sistema.

Lembre-se de que o sistema está bloqueado e a configuração atual é a seguinte (conforme percebido pelo detector de falhas local no s1):

```sql
mysql> SELECT MEMBER_ID,MEMBER_STATE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| 1999b9fb-4aaf-11e6-bb54-28b2bd168d07 | UNREACHABLE  |
| 199b2df7-4aaf-11e6-bb16-28b2bd168d07 | ONLINE       |
| 199bb88e-4aaf-11e6-babe-28b2bd168d07 | ONLINE       |
| 19ab72fc-4aaf-11e6-bb51-28b2bd168d07 | UNREACHABLE  |
| 19b33846-4aaf-11e6-ba81-28b2bd168d07 | UNREACHABLE  |
+--------------------------------------+--------------+
```

A primeira coisa a fazer é verificar qual é o endereço local (identificador de comunicação de grupo) para s1 e s2. Faça **login** em s1 e s2 e obtenha essa informação da seguinte forma.

```sql
mysql> SELECT @@group_replication_local_address;
```

Depois de saber os endereços de comunicação de grupo de s1 (`127.0.0.1:10000`) e s2 (`127.0.0.1:10001`), você pode usá-los em um dos dois **Servers** para injetar uma nova configuração de **membership**, substituindo assim a existente que perdeu o **Quorum**. Para fazer isso no s1:

```sql
mysql> SET GLOBAL group_replication_force_members="127.0.0.1:10000,127.0.0.1:10001";
```

Isso desbloqueia o grupo ao forçar uma configuração diferente. Verifique [`replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table") tanto em s1 quanto em s2 para verificar o **membership** do grupo após esta mudança. Primeiro no s1.

```sql
mysql> SELECT MEMBER_ID,MEMBER_STATE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| b5ffe505-4ab6-11e6-b04b-28b2bd168d07 | ONLINE       |
| b60907e7-4ab6-11e6-afb7-28b2bd168d07 | ONLINE       |
+--------------------------------------+--------------+
```

E depois no s2.

```sql
mysql> SELECT * FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| b5ffe505-4ab6-11e6-b04b-28b2bd168d07 | ONLINE       |
| b60907e7-4ab6-11e6-afb7-28b2bd168d07 | ONLINE       |
+--------------------------------------+--------------+
```

Ao forçar uma nova configuração de **membership**, certifique-se de que quaisquer **Servers** que serão forçados a sair do grupo estejam realmente parados. No cenário descrito acima, se s3, s4 e s5 não estiverem realmente inacessíveis (**unreachable**), mas estiverem online, eles podem ter formado sua própria partição funcional (eles são 3 de 5, portanto, eles têm a maioria). Nesse caso, forçar uma lista de **membership** de grupo com s1 e s2 poderia criar uma situação de **Split-Brain** artificial. Portanto, é importante, antes de forçar uma nova configuração de **membership**, garantir que os **Servers** a serem excluídos estejam de fato desligados e, se não estiverem, desligá-los antes de prosseguir.

Depois de usar a variável de sistema [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members) para forçar com sucesso um novo **membership** de grupo e desbloquear o grupo, certifique-se de limpar a variável de sistema. [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members) deve estar vazia para que seja possível emitir uma instrução [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement").