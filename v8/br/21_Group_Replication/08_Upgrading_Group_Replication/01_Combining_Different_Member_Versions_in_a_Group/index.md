### 20.8.1 Combinar diferentes versões do membro em um grupo

20.8.1.1 Versões dos membros durante as atualizações

20.8.1.2 Protocolo de Comunicação de Replicação em Grupo Versão

A replicação em grupo é versionada de acordo com a versão do MySQL Server com a qual o plugin de replicação em grupo foi incluído. Por exemplo, se um membro estiver executando o MySQL 5.7.26, essa é a versão do plugin de replicação em grupo. Para verificar a versão do MySQL Server em um membro do grupo:

```
SELECT MEMBER_HOST,MEMBER_PORT,MEMBER_VERSION FROM performance_schema.replication_group_members;
+-------------+-------------+----------------+
| member_host | member_port | member_version |
+-------------+-------------+----------------+
| example.com |	   3306     |   8.0.13	     |
+-------------+-------------+----------------+
```

Para obter orientações sobre como entender a versão do MySQL Server e selecionar uma versão, consulte a Seção 2.1.2, “Qual versão e distribuição do MySQL instalar”.

Para a compatibilidade e o desempenho ótimos, todos os membros de um grupo devem rodar a mesma versão do MySQL Server e, portanto, da Replicação de Grupo. No entanto, enquanto você estiver no processo de atualização de um grupo online, para maximizar a disponibilidade, você pode precisar ter membros com diferentes versões do MySQL Server rodando ao mesmo tempo. Dependendo das alterações feitas entre as versões do MySQL, você pode encontrar incompatibilidades nessa situação. Por exemplo, se uma funcionalidade foi descontinuada entre as versões principais, então combinar as versões em um grupo pode causar falhas em membros que dependem da funcionalidade descontinuada. Por outro lado, escrever em um membro que está rodando uma versão mais recente do MySQL enquanto há membros de leitura e escrita no grupo rodando uma versão mais antiga do MySQL pode causar problemas em membros que não possuem as funções introduzidas na versão mais recente.

Para evitar esses problemas, a Replicação em Grupo inclui políticas de compatibilidade que permitem combinar membros executando diferentes versões do MySQL no mesmo grupo de forma segura. Um membro aplica essas políticas para decidir se deseja se juntar ao grupo normalmente, em modo de leitura somente ou não se juntar ao grupo, dependendo da escolha que resulta na operação segura do membro que está se juntando e dos membros existentes do grupo. Em um cenário de atualização, cada servidor deve sair do grupo, ser atualizado e se juntar ao grupo com sua nova versão de servidor. Neste ponto, o membro aplica as políticas para sua nova versão de servidor, que pode ter mudado das políticas que ele aplicou quando se juntou ao grupo originalmente.

Como administrador, você pode instruir qualquer servidor a tentar se juntar a qualquer grupo, configurando o servidor adequadamente e emitindo uma declaração `START GROUP_REPLICATION`. A decisão de se juntar ou não ao grupo, ou de se juntar ao grupo no modo de leitura apenas, é tomada e implementada pelo próprio membro que está se juntando após você tentar adicioná-lo ao grupo. O membro que está se juntando recebe informações sobre as versões do MySQL Server dos membros atuais do grupo, avalia sua própria compatibilidade com esses membros e aplica as políticas usadas na própria versão do MySQL Server (*não* as políticas usadas pelos membros existentes) para decidir se é compatível.

As políticas de compatibilidade que um membro que se junta aplica ao tentar se juntar a um grupo são as seguintes:

- Um membro não se junta a um grupo se estiver executando uma versão do MySQL Server inferior à versão mais baixa que os membros do grupo existentes estão executando.

- Um membro se junta a um grupo normalmente se ele estiver executando a mesma versão do servidor MySQL que a versão mais baixa que os membros do grupo existentes estão executando.

- Um membro se junta a um grupo, mas permanece no modo de leitura apenas se estiver executando uma versão superior do MySQL Server do que a versão mais baixa que os membros do grupo existentes estão executando. Esse comportamento só faz diferença quando o grupo está executando no modo multi-primário, porque em um grupo que está executando no modo single-primário, os membros recém-adicionados têm o padrão de ser apenas de leitura em qualquer caso.

Os membros que executam o MySQL 8.0.17 ou superior devem considerar a versão do patch do lançamento ao verificar a compatibilidade. Os membros que executam o MySQL 8.0.16 ou versões anteriores, ou o MySQL 5.7, devem considerar apenas a versão principal. Por exemplo, se você tiver um grupo com membros executando a versão 8.0.13 do MySQL:

- Um membro que está executando a versão 5.7 do MySQL não se junta.

- Um membro que executa o MySQL 8.0.16 se conecta normalmente (porque ele considera a versão principal).

- Um membro que executa o MySQL 8.0.17 se conecta, mas permanece no modo apenas de leitura (porque ele considera a versão do patch).

Observe que, ao juntar membros que executam versões do MySQL antes da versão 5.7.27, verifique se todas as versões do MySQL Server são menores. Portanto, eles falham nessa verificação para um grupo onde qualquer membro esteja executando versões do MySQL 8.0 e não podem se juntar ao grupo, mesmo que ele já tenha outros membros executando versões do MySQL 5.7. A partir da versão 5.7.27, a verificação de junção verifica apenas os membros do grupo que estão executando a versão menor, então eles podem se juntar a um grupo de versões mistas onde outros servidores do MySQL 5.7 estão presentes.

Em um grupo de modo multi-primário com membros que usam diferentes versões do MySQL Server, a Replicação de Grupo gerencia automaticamente o status de leitura/escrita e de leitura apenas dos membros que executam o MySQL 8.0.17 ou uma versão superior. Se um membro sair do grupo, os membros que executam a versão que agora é a mais baixa são automaticamente configurados para o modo de leitura/escrita. Quando você altera um grupo que estava executando em modo único-primário para executar em modo multi-primário, usando a função `group_replication_switch_to_multi_primary_mode()`, a Replicação de Grupo configura automaticamente os membros no modo correto. Os membros são automaticamente colocados no modo de leitura apenas se estiverem executando uma versão do servidor MySQL mais alta do que a versão mais baixa presente no grupo, e os membros que estão executando a versão mais baixa são colocados no modo de leitura/escrita.
