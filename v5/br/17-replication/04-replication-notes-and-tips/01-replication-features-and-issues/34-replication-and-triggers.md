#### 16.4.1.34 Replicação e Triggers

Com a replicação baseada em Statement (statement-based replication), os Triggers executados na Fonte também são executados na Réplica. Com a replicação baseada em Row (row-based replication), os Triggers executados na Fonte não são executados na Réplica. Em vez disso, as alterações de Row na Fonte, resultantes da execução do Trigger, são replicadas e aplicadas na Réplica.

Este comportamento é proposital (by design). Se, sob a replicação baseada em Row, a Réplica aplicasse tanto os Triggers quanto as alterações de Row causadas por eles, as alterações seriam, na verdade, aplicadas duas vezes na Réplica, resultando em dados diferentes na Fonte e na Réplica.

Se você deseja que os Triggers sejam executados tanto na Fonte quanto na Réplica — talvez porque você tenha Triggers diferentes em cada um —, você deve usar a replicação baseada em Statement. Contudo, para habilitar Triggers do lado da Réplica, não é necessário usar a replicação baseada em Statement exclusivamente. É suficiente alternar para a replicação baseada em Statement apenas para os Statements onde você deseja esse efeito, e usar a replicação baseada em Row no restante do tempo.

Um Statement que invoca um Trigger (ou função) que causa uma atualização em uma coluna `AUTO_INCREMENT` não é replicado corretamente usando a replicação baseada em Statement. O MySQL 5.7 marca tais Statements como inseguros (unsafe). (Bug #45677)

Um Trigger pode ter Triggers para diferentes combinações de evento do Trigger ([`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement")) e tempo de ação (`BEFORE`, `AFTER`), mas, antes do MySQL 5.7.2, não era possível ter múltiplos Triggers que possuíssem o mesmo evento de Trigger e tempo de ação. O MySQL 5.7.2 elimina essa limitação e permite múltiplos Triggers. Essa alteração tem implicações de replicação para *upgrades* e *downgrades*.

Para simplificar, o termo “múltiplos Triggers” aqui é uma abreviação para “múltiplos Triggers que possuem o mesmo evento de Trigger e tempo de ação.”

**Upgrades.** Suponha que você faça o upgrade de um servidor antigo que não suporta múltiplos Triggers para o MySQL 5.7.2 ou superior. Se o novo servidor for um servidor Fonte de replicação e tiver Réplicas antigas que não suportam múltiplos Triggers, ocorrerá um erro nessas Réplicas se um Trigger for criado na Fonte para uma tabela que já possui um Trigger com o mesmo evento de Trigger e tempo de ação. Para evitar esse problema, faça o upgrade das Réplicas primeiro, e depois o upgrade da Fonte.

**Downgrades.** Se você fizer o downgrade de um servidor que suporta múltiplos Triggers para uma versão mais antiga que não suporta, o downgrade terá os seguintes efeitos:

* Para cada tabela que tem Triggers, todas as definições de Trigger permanecem no arquivo `.TRG` da tabela. No entanto, se houver múltiplos Triggers com o mesmo evento de Trigger e tempo de ação, o servidor executará apenas um deles quando o evento do Trigger ocorrer. Para informações sobre arquivos `.TRG`, consulte a seção Table Trigger Storage da documentação Doxygen do Servidor MySQL, disponível em [https://dev.mysql.com/doc/index-other.html](/doc/index-other.html).

* Se Triggers para a tabela forem adicionados ou removidos após o downgrade, o servidor reescreve o arquivo `.TRG` da tabela. O arquivo reescrito retém apenas um Trigger por combinação de evento de Trigger e tempo de ação; os demais são perdidos.

Para evitar esses problemas, modifique seus Triggers antes de fazer o downgrade. Para cada tabela que tem múltiplos Triggers por combinação de evento de Trigger e tempo de ação, converta cada um desses conjuntos de Triggers em um único Trigger da seguinte forma:

1. Para cada Trigger, crie uma rotina armazenada (stored routine) que contenha todo o código do Trigger. Valores acessados usando `NEW` e `OLD` podem ser passados para a rotina usando parâmetros. Se o Trigger precisar de um único valor de resultado do código, você pode colocar o código em uma stored function e fazer com que a função retorne o valor. Se o Trigger precisar de múltiplos valores de resultado do código, você pode colocar o código em uma stored procedure e retornar os valores usando parâmetros `OUT`.

2. Remova (Drop) todos os Triggers da tabela.
3. Crie um novo Trigger para a tabela que invoca as rotinas armazenadas recém-criadas. O efeito para este Trigger é, portanto, o mesmo que o dos múltiplos Triggers que ele substitui.
