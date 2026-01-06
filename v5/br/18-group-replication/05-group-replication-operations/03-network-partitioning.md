### 17.5.3 Partição de rede

O grupo precisa alcançar o consenso sempre que uma mudança que precisa ser replicada ocorrer. Esse é o caso de transações regulares, mas também é necessário para mudanças de membros do grupo e algumas mensagens internas que mantêm o grupo consistente. O consenso exige que a maioria dos membros do grupo concorde com uma decisão dada. Quando a maioria dos membros do grupo é perdida, o grupo não consegue progredir e fica bloqueado porque não consegue garantir a maioria ou o quórum.

O quórum pode ser perdido quando há múltiplas falhas involuntárias, fazendo com que a maioria dos servidores seja removida abruptamente do grupo. Por exemplo, em um grupo de 5 servidores, se 3 deles ficarem silenciosos de uma vez, a maioria é comprometida e, portanto, não é possível alcançar o quórum. Na verdade, os dois restantes não conseguem dizer se os outros 3 servidores falharam ou se uma partição de rede os isolou sozinhos e, portanto, o grupo não pode ser reconfigurado automaticamente.

Por outro lado, se os servidores saem do grupo voluntariamente, eles instruem o grupo a se reconectar. Na prática, isso significa que um servidor que está saindo informa aos outros que está indo embora. Isso significa que outros membros podem reconectar o grupo corretamente, a consistência da associação é mantida e a maioria é recalculada. Por exemplo, no cenário acima de 5 servidores, onde 3 saem de uma vez, se os 3 servidores que estão saindo avisam o grupo que estão indo embora, um por um, então a associação é capaz de se ajustar de 5 para 2, e ao mesmo tempo, garantir o quórum enquanto isso acontece.

Nota

A perda de quórum é, por si só, um efeito colateral do mau planejamento. Planeje o tamanho do grupo para o número de falhas esperadas (independentemente de serem consecutivas, ocorrerem todas de uma vez ou sejam esporádicas).

As seções a seguir explicam o que fazer se o sistema for particionado de tal forma que nenhum quórum seja alcançado automaticamente pelos servidores do grupo.

Dica

Um membro primário que foi excluído de um grupo após uma perda por maioria seguida por uma reconfiguração pode conter transações extras que não estão incluídas no novo grupo. Se isso acontecer, a tentativa de adicionar o membro excluído de volta ao grupo resultará em um erro com a mensagem "Este membro tem mais transações executadas do que as presentes no grupo".

#### Detecção de Partições

A tabela do esquema de desempenho `replication_group_members` apresenta o status de cada servidor na visualização atual sob a perspectiva deste servidor. Na maioria das vezes, o sistema não enfrenta partições, e, portanto, a tabela mostra informações consistentes em todos os servidores do grupo. Em outras palavras, o status de cada servidor nesta tabela é acordado por todos na visualização atual. No entanto, se houver partição de rede e o quórum for perdido, a tabela mostrará o status `UNREACHABLE` (IRRECONHECÍVEL) para esses servidores que não puderem ser contatados. Esta informação é exportada pelo detector de falhas local integrado à Replicação em Grupo.

**Figura 17.7 Perda de Quórum**

![Cinco instâncias de servidor, S1, S2, S3, S4 e S5, são implantadas como um grupo interconectado, que é um grupo estável. Quando três dos servidores, S3, S4 e S5, falham, a maioria é perdida e o grupo não pode mais prosseguir sem intervenção.](images/gr-maioria-perdida.png)

Para entender esse tipo de partição de rede, a seção a seguir descreve um cenário em que inicialmente há 5 servidores trabalhando corretamente juntos, e as mudanças que então ocorrem no grupo, uma vez que apenas 2 servidores estão online. O cenário é representado na figura.

Assim, vamos assumir que há um grupo com esses 5 servidores nele:

- Servidor s1 com o identificador do membro `199b2df7-4aaf-11e6-bb16-28b2bd168d07`

- Servidor s2 com identificador de membro `199bb88e-4aaf-11e6-babe-28b2bd168d07`

- Servidor s3 com identificador de membro `1999b9fb-4aaf-11e6-bb54-28b2bd168d07`

- Servidor s4 com identificador de membro `19ab72fc-4aaf-11e6-bb51-28b2bd168d07`

- Servidor s5 com identificador de membro `19b33846-4aaf-11e6-ba81-28b2bd168d07`

Inicialmente, o grupo está funcionando bem e os servidores estão se comunicando felizes uns com os outros. Você pode verificar isso ao fazer login no s1 e olhar para sua tabela de esquema de desempenho `replication_group_members`. Por exemplo:

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

No entanto, momentos depois, ocorre uma falha catastrófica e os servidores s3, s4 e s5 param inesperadamente. Alguns segundos depois, ao olhar novamente na tabela `replication_group_members` no s1, vemos que ela ainda está online, mas vários outros membros não estão. Na verdade, como visto abaixo, eles estão marcados como `UNREACHABLE`. Além disso, o sistema não conseguiu se reconectar para alterar a associação, porque a maioria foi perdida.

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

A tabela mostra que o s1 agora está em um grupo que não tem meios de progredir sem intervenção externa, porque a maioria dos servidores não é acessível. Neste caso específico, a lista de membros do grupo precisa ser redefinida para permitir que o sistema prossiga, o que é explicado nesta seção. Alternativamente, você também pode optar por parar a Replicação em Grupo nos s1 e s2 (ou parar completamente os s1 e s2), descobrir o que aconteceu com os s3, s4 e s5 e, em seguida, reiniciar a Replicação em Grupo (ou os servidores).

#### Desbloqueando uma partição

A replicação em grupo permite que você redefina a lista de membros do grupo ao impor uma configuração específica. Por exemplo, no caso acima, onde s1 e s2 são os únicos servidores online, você pode optar por impor uma configuração de membros que inclua apenas s1 e s2. Isso requer a verificação de algumas informações sobre s1 e s2 e, em seguida, o uso da variável `group_replication_force_members`.

**Figura 17.8 Forçando uma nova adesão**

![Três dos servidores de um grupo, S3, S4 e S5, falharam, então a maioria está perdida e o grupo não pode prosseguir sem intervenção. Com a intervenção descrita no texto a seguir, S1 e S2 conseguem formar um grupo estável por conta própria.](images/gr-maioria-perdida-para-grupo-estável.png)

Suponha que você esteja de volta à situação em que s1 e s2 são os únicos servidores restantes no grupo. Os servidores s3, s4 e s5 saíram do grupo inesperadamente. Para fazer com que os servidores s1 e s2 continuem, você deseja forçar uma configuração de associação que contenha apenas s1 e s2.

Aviso

Este procedimento utiliza `group_replication_force_members` e deve ser considerado um remédio de último recurso. Deve ser usado com extremo cuidado e apenas para superar a perda de quórum. Se usado de forma incorreta, pode criar um cenário de cérebro artificialmente dividido ou bloquear o sistema como um todo.

Lembre-se de que o sistema está bloqueado e a configuração atual é a seguinte (conforme percebido pelo detector de falhas local em s1):

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

A primeira coisa a fazer é verificar qual é o endereço local (identificador de comunicação de grupo) para s1 e s2. Faça login em s1 e s2 e obtenha essas informações da seguinte forma.

```sql
mysql> SELECT @@group_replication_local_address;
```

Depois de conhecer os endereços de comunicação em grupo de s1 (`127.0.0.1:10000`) e s2 (`127.0.0.1:10001`), você pode usar esses endereços em um dos dois servidores para injetar uma nova configuração de membro, substituindo assim a existente que perdeu o quórum. Para fazer isso em s1:

```sql
mysql> SET GLOBAL group_replication_force_members="127.0.0.1:10000,127.0.0.1:10001";
```

Isso desbloqueia o grupo ao forçar uma configuração diferente. Verifique `replication_group_members` em ambos os s1 e s2 para verificar a associação ao grupo após essa alteração. Primeiro no s1.

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

Ao forçar uma nova configuração de membro, certifique-se de que todos os servidores que serão forçados a sair do grupo estejam realmente desligados. No cenário descrito acima, se s3, s4 e s5 não estiverem realmente indisponíveis, mas sim online, eles podem ter formado sua própria partição funcional (eles são 3 de 5, portanto, têm a maioria). Nesse caso, forçar uma lista de membros do grupo com s1 e s2 pode criar uma situação de cérebro partido artificial. Portanto, é importante, antes de forçar uma nova configuração de membro, garantir que os servidores a serem excluídos estejam realmente desligados e, se não estiverem, desligue-os antes de prosseguir.

Depois de usar a variável de sistema `group_replication_force_members` para forçar com sucesso uma nova adesão ao grupo e desbloquear o grupo, certifique-se de limpar a variável de sistema. A variável de sistema `group_replication_force_members` deve estar vazia para emitir uma declaração de `START GROUP_REPLICATION`.
