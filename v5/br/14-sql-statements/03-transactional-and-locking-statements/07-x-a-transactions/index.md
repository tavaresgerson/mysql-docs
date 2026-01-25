### 13.3.7 Transações XA

[13.3.7.1 Declarações SQL de Transação XA](xa-statements.html)

[13.3.7.2 Estados de Transação XA](xa-states.html)

[13.3.7.3 Restrições em Transações XA](xa-restrictions.html)

O suporte para transações [XA](glossary.html#glos_xa "XA") está disponível para o [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") storage engine. A implementação XA do MySQL é baseada no documento X/Open CAE *Distributed Transaction Processing: The XA Specification*. Este documento é publicado pelo The Open Group e está disponível em <http://www.opengroup.org/public/pubs/catalog/c193.htm>. As limitações da implementação XA atual são descritas na [Seção 13.3.7.3, “Restrições em Transações XA”](xa-restrictions.html "13.3.7.3 Restrictions on XA Transactions").

No lado do cliente (client side), não há requisitos especiais. A interface XA para um servidor MySQL consiste em declarações SQL que começam com a palavra-chave (keyword) `XA`. Programas cliente MySQL devem ser capazes de enviar declarações SQL e compreender a semântica da interface de declarações XA. Eles não precisam ser linkados contra uma biblioteca cliente recente. Bibliotecas cliente mais antigas também funcionam.

Entre os MySQL Connectors, o MySQL Connector/J 5.0.0 e superior suporta XA diretamente, por meio de uma interface de classe que lida com a interface de declaração SQL XA para você.

O XA suporta transações distribuídas, ou seja, a capacidade de permitir que múltiplos recursos transacionais separados participem de uma transação global. Recursos transacionais geralmente são RDBMSs, mas podem ser outros tipos de recursos.

Uma transação global envolve várias ações que são transacionais por si mesmas, mas que todas devem ser concluídas com sucesso como um grupo, ou todas devem ser rolled back (revertidas) como um grupo. Em essência, isso estende as propriedades ACID "um nível acima" para que múltiplas transações ACID possam ser executadas em conjunto como componentes de uma operação global que também possui propriedades ACID. (Assim como acontece com transações não distribuídas, [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable) pode ser preferível se suas aplicações forem sensíveis a fenômenos de leitura. [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read) pode não ser suficiente para transações distribuídas.)

Alguns exemplos de transações distribuídas:

* Uma aplicação pode atuar como uma ferramenta de integração que combina um serviço de mensagens com um RDBMS. A aplicação garante que transações relacionadas ao envio, recuperação e processamento de mensagens que também envolvem um Database transacional ocorram em uma transação global. Isso pode ser pensado como “e-mail transacional”.

* Uma aplicação executa ações que envolvem diferentes Database servers, como um servidor MySQL e um servidor Oracle (ou múltiplos servidores MySQL), onde as ações que envolvem múltiplos servidores devem ocorrer como parte de uma transação global, em vez de como transações separadas locais a cada servidor.

* Um banco mantém informações de contas em um RDBMS e distribui e recebe dinheiro através de caixas eletrônicos (ATMs). É necessário garantir que as ações do ATM sejam corretamente refletidas nas contas, mas isso não pode ser feito apenas com o RDBMS. Um Transaction Manager global integra os recursos do ATM e do Database para garantir a consistência geral das transações financeiras.

Aplicações que usam transações globais envolvem um ou mais Resource Managers e um Transaction Manager:

* Um Resource Manager (RM) fornece acesso a recursos transacionais. Um Database server é um tipo de Resource Manager. Deve ser possível fazer commit ou roll back das transações gerenciadas pelo RM.

* Um Transaction Manager (TM) coordena as transações que fazem parte de uma transação global. Ele se comunica com os RMs que lidam com cada uma dessas transações. As transações individuais dentro de uma transação global são "branches" (ramificações) da transação global. Transações globais e seus branches são identificados por um esquema de nomenclatura descrito posteriormente.

A implementação MySQL de XA permite que um servidor MySQL atue como um Resource Manager que lida com transações XA dentro de uma transação global. Um programa cliente que se conecta ao servidor MySQL atua como o Transaction Manager.

Para executar uma transação global, é necessário saber quais componentes estão envolvidos e levar cada componente a um ponto em que possa ser committed ou rolled back. Dependendo do que cada componente relata sobre sua capacidade de sucesso, todos eles devem fazer commit ou roll back como um grupo atômico. Ou seja, ou todos os componentes devem fazer commit, ou todos os componentes devem fazer roll back. Para gerenciar uma transação global, é necessário levar em consideração que qualquer componente ou a rede de conexão pode falhar.

O processo para executar uma transação global usa two-phase commit (2PC, commit de duas fases). Isso ocorre após a execução das ações realizadas pelos branches da transação global.

1. Na primeira fase, todos os branches são preparados. Ou seja, o TM os informa para se prepararem para o commit. Tipicamente, isso significa que cada RM que gerencia um branch registra as ações para o branch em armazenamento estável. Os branches indicam se são capazes de fazer isso, e esses resultados são usados para a segunda fase.

2. Na segunda fase, o TM informa aos RMs se devem fazer commit ou roll back. Se todos os branches indicaram, quando foram preparados, que podem fazer commit, todos os branches são instruídos a fazer commit. Se qualquer branch indicou, quando foi preparado, que não poderia fazer commit, todos os branches são instruídos a fazer roll back.

Em alguns casos, uma transação global pode usar one-phase commit (1PC, commit de uma fase). Por exemplo, quando um Transaction Manager descobre que uma transação global consiste em apenas um recurso transacional (ou seja, um único branch), esse recurso pode ser instruído a preparar e fazer commit ao mesmo tempo.
