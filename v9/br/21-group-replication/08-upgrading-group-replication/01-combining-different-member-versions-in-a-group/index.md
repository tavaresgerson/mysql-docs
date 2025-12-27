### 20.8.1 Combinando Diferentes Versões de Membros em um Grupo

20.8.1.1 Versões de Membros Durante as Atualizações

20.8.1.2 Versão do Protocolo de Comunicação de Replicação em Grupo

A Replicação em Grupo é versionada de acordo com a versão do MySQL Server com a qual o plugin de Replicação em Grupo foi incluído. Por exemplo, se um membro estiver executando o MySQL 9.5.0, essa é a versão do plugin de Replicação em Grupo. Para verificar a versão do MySQL Server em um membro do grupo, use:

```
SELECT MEMBER_HOST,MEMBER_PORT,MEMBER_VERSION FROM performance_schema.replication_group_members;
+-------------+-------------+----------------+
| member_host | member_port | member_version |
+-------------+-------------+----------------+
| example.com |	   3306     |   9.5.0	     |
+-------------+-------------+----------------+
```

Para obter orientações sobre como entender a versão do MySQL Server e selecionar uma versão, consulte a Seção 2.1.2, “Qual Versão e Distribuição do MySQL Instalar”.

Para compatibilidade e desempenho ótimos, todos os membros de um grupo devem executar a mesma versão do MySQL Server e, portanto, da Replicação em Grupo. No entanto, enquanto estiver no processo de atualização de um grupo online, para maximizar a disponibilidade, você pode precisar ter membros com diferentes versões do MySQL Server executando ao mesmo tempo. Dependendo das alterações feitas entre as versões do MySQL, você pode encontrar incompatibilidades nessa situação. Por exemplo, se uma funcionalidade foi descontinuada entre as versões principais, a combinação das versões em um grupo pode causar falhas em membros que dependem da funcionalidade descontinuada. Por outro lado, escrever para um membro que está executando uma versão mais recente do MySQL enquanto há membros de leitura/escrita no grupo executando uma versão mais antiga do MySQL pode causar problemas em membros que não possuem as funções introduzidas na versão mais recente.

Para evitar tais problemas, a Replicação em Grupo inclui políticas de compatibilidade que permitem combinar membros que executam diferentes versões do MySQL no mesmo grupo de forma segura. Um membro aplica essas políticas para decidir se deve se juntar ao grupo normalmente, em modo de leitura somente ou não se juntar ao grupo, dependendo da escolha que resulta na operação segura do membro que está se juntando e dos membros existentes do grupo. Em um cenário de atualização, cada servidor deve sair do grupo, ser atualizado e se juntar ao grupo com sua nova versão de servidor. Neste ponto, o membro aplica as políticas para sua nova versão de servidor, que pode ter mudado das políticas que ele aplicou quando se juntou originalmente ao grupo.

Como administrador, você pode instruir qualquer servidor a tentar se juntar a qualquer grupo configurando o servidor adequadamente e emitindo uma declaração `START GROUP_REPLICATION`. A decisão de se juntar ou não ao grupo, ou de se juntar ao grupo em modo de leitura somente, é tomada e implementada pelo próprio membro que está se juntando após você tentar adicioná-lo ao grupo. O membro que está se juntando recebe informações sobre as versões do MySQL Server dos membros atuais do grupo, avalia sua própria compatibilidade com esses membros e aplica as políticas usadas em sua própria versão do MySQL Server (*não* as políticas usadas pelos membros existentes) para decidir se é compatível.

As políticas de compatibilidade que um membro que está se juntando aplica ao tentar se juntar a um grupo são as seguintes:

* Um membro se junta a um grupo normalmente se estiver executando a mesma versão do MySQL Server que a versão mais baixa que os membros do grupo existentes estão executando.

* Um membro se junta a um grupo, mas permanece no modo de leitura apenas se estiver executando uma versão superior do MySQL Server do que a versão mínima que os membros existentes do grupo estão executando. Esse comportamento só faz diferença quando o grupo está executando no modo multi-primário, porque em um grupo que está executando no modo single-primário, os membros recém-adicionados, por padrão, ficam no modo de leitura apenas em qualquer caso.

Os membros levam em consideração toda a versão major.minor.release do software ao verificar a compatibilidade.

Em um grupo no modo multi-primário com membros que usam diferentes versões do MySQL Server, a Replicação de Grupo gerencia automaticamente o status de leitura/escrita e de leitura apenas dos membros. Se um membro sair do grupo, os membros que estão executando a versão que agora é a mais baixa são automaticamente configurados para o modo de leitura/escrita. Quando você altera um grupo que estava executando no modo single-primário para executar no modo multi-primário usando `group_replication_switch_to_multi_primary_mode()`, a Replicação de Grupo configura automaticamente cada membro no modo correto. Os membros são automaticamente colocados no modo de leitura apenas se estiverem executando uma versão superior do servidor MySQL do que a versão mais baixa presente no grupo, e os membros que estão executando a versão mais baixa são colocados no modo de leitura/escrita.