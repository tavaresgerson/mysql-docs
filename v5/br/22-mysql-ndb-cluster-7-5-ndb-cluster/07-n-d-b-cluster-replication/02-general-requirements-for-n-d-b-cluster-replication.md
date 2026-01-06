### 21.7.2 Requisitos Gerais para a Replicação em Clúster do NDB

Um canal de replicação requer dois servidores MySQL atuando como servidores de replicação (um para a fonte e outro para a replica). Por exemplo, isso significa que, no caso de uma configuração de replicação com dois canais de replicação (para fornecer um canal extra para redundância), deve haver um total de quatro nós de replicação, dois por clúster.

A replicação de um NDB Cluster conforme descrito nesta seção e nas seguintes depende da replicação baseada em linhas. Isso significa que o servidor MySQL da fonte de replicação deve estar em execução com `--binlog-format=ROW` ou `--binlog-format=MIXED`, conforme descrito em Seção 21.7.6, “Iniciando a replicação do NDB Cluster (Canal de replicação único)”. Para informações gerais sobre a replicação baseada em linhas, consulte Seção 16.2.1, “Formatos de replicação”.

Importante

Se você tentar usar a Replicação de NDB Cluster com `--binlog-format=STATEMENT`, a replicação não funciona corretamente porque a tabela `ndb_binlog_index` no cluster de origem e a coluna `epoch` da tabela `ndb_apply_status` no cluster de replica não são atualizadas (veja Seção 21.7.4, “Esquema e tabelas de replicação de NDB Cluster”). Em vez disso, apenas as atualizações no servidor MySQL que atua como a fonte de replicação são propagadas para a replica, e nenhuma atualização de qualquer outro nó SQL no cluster de origem é replicada.

O valor padrão para a opção [`--binlog-format`](https://pt.wikipedia.org/wiki/Op%C3%A7%C3%B5es_de_replic%C3%A3o#sysvar_binlog_format) é `MIXED`.

Cada servidor MySQL usado para replicação em qualquer um dos clústeres deve ser identificado de forma única entre todos os servidores de replicação MySQL participantes de qualquer um dos clústeres (não é possível ter servidores de replicação em ambos os clústeres de origem e replica compartilhando o mesmo ID). Isso pode ser feito iniciando cada nó SQL usando a opção `--server-id=id`, onde *`id`* é um número inteiro único. Embora não seja estritamente necessário, assumimos, para fins desta discussão, que todos os binários do NDB Cluster são da mesma versão de lançamento.

Em geral, é verdade que, na replicação do MySQL, ambos os servidores MySQL (**mysqld**) envolvidos devem ser compatíveis entre si, tanto em relação à versão do protocolo de replicação usado quanto aos conjuntos de recursos SQL que eles suportam (veja Seção 16.4.2, “Compatibilidade da Replicação do NDB Cluster”). Devido a essas diferenças entre os binários das distribuições do NDB Cluster e do MySQL Server 5.7, a replicação do NDB Cluster tem o requisito adicional de que ambos os binários do **mysqld**]\(mysqld.html) vêm de uma distribuição do NDB Cluster. A maneira mais simples e fácil de garantir que os servidores do **mysqld**]\(mysqld.html) sejam compatíveis é usar a mesma distribuição do NDB Cluster para todos os binários de origem e replica do **mysqld**]\(mysqld.html).

Acreditamos que o servidor ou clúster de replicação é dedicado à replicação do clúster de origem e que nenhum outro dado está sendo armazenado nele.

Todas as tabelas `NDB` que estão sendo replicadas devem ser criadas usando um servidor e cliente MySQL. As tabelas e outros objetos do banco de dados criados usando a API NDB (com, por exemplo, `Dictionary::createTable()`) não são visíveis para um servidor MySQL e, portanto, não são replicadas. As atualizações feitas por aplicativos da API NDB em tabelas existentes que foram criadas usando um servidor MySQL podem ser replicadas.

Nota

É possível replicar um NDB Cluster usando a replicação baseada em declarações. No entanto, neste caso, as seguintes restrições se aplicam:

- Todas as atualizações das linhas de dados no clúster que atua como fonte devem ser direcionadas a um único servidor MySQL.

- Não é possível replicar um clúster usando múltiplos processos de replicação MySQL simultâneos.

- Apenas as alterações feitas no nível SQL são replicadas.

Esses são, além das outras limitações da replicação baseada em declarações em oposição à replicação baseada em linhas; consulte Seção 16.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Declarações e Baseada em Linhas”, para informações mais específicas sobre as diferenças entre os dois formatos de replicação.
