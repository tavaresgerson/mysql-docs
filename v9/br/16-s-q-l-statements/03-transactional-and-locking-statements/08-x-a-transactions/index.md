### 15.3.8 Transações XA

15.3.8.1 Declarações SQL de Transações XA

15.3.8.2 Estados de Transações XA

15.3.8.3 Restrições para Transações XA

O suporte para transações XA está disponível para o mecanismo de armazenamento `InnoDB`. A implementação do MySQL XA é baseada no documento X/Open CAE *Processamento de Transações Distribuídas: A Especificação XA*. Este documento é publicado pelo The Open Group e está disponível em <http://www.opengroup.org/public/pubs/catalog/c193.htm>. As limitações da implementação atual do XA são descritas na Seção 15.3.8.3, “Restrições para Transações XA”.

Do lado do cliente, não há requisitos especiais. A interface XA para um servidor MySQL consiste em declarações SQL que começam com a palavra-chave `XA`. Os programas clientes do MySQL devem ser capazes de enviar declarações SQL e entender a semântica da interface de declaração XA. Eles não precisam ser vinculados a uma biblioteca cliente recente. Bibliotecas cliente mais antigas também funcionam.

Entre os Conectadores MySQL, o MySQL Connector/J 5.0.0 e versões superiores suportam XA diretamente, por meio de uma interface de classe que lida com a interface de declaração SQL XA para você.

O XA suporta transações distribuídas, ou seja, a capacidade de permitir que múltiplos recursos transacionais separados participem de uma transação global. Os recursos transacionais são frequentemente RDBMS, mas podem ser outros tipos de recursos.

Uma transação global envolve várias ações que são transacionais por si mesmas, mas todas devem ser concluídas com sucesso como um grupo ou todas devem ser revertidas como um grupo. Em essência, isso estende as propriedades ACID “para cima” para que múltiplas transações ACID possam ser executadas em conjunto como componentes de uma operação global que também possui propriedades ACID. (Assim como nas transações não distribuídas, `SERIALIZABLE` pode ser preferível se suas aplicações são sensíveis a fenômenos de leitura. `REPEATABLE READ` pode não ser suficiente para transações distribuídas.)

Alguns exemplos de transações distribuídas:

* Uma aplicação pode atuar como uma ferramenta de integração que combina um serviço de mensagens com um RDBMS. A aplicação garante que as transações que lidam com o envio, recuperação e processamento de mensagens que também envolvem um banco de dados transacional ocorram em uma transação global. Você pode pensar nisso como “e-mail transacional”.

* Uma aplicação realiza ações que envolvem diferentes servidores de banco de dados, como um servidor MySQL e um servidor Oracle (ou múltiplos servidores MySQL), onde as ações que envolvem múltiplos servidores devem ocorrer como parte de uma transação global, em vez de como transações separadas locais em cada servidor.

* Um banco mantém informações de contas em um RDBMS e distribui e recebe dinheiro através de caixas eletrônicos (ATMs). É necessário garantir que as ações dos ATMs sejam refletidas corretamente nas contas, mas isso não pode ser feito com o RDBMS sozinho. Um gerenciador de transação global integra os recursos do ATM e do banco de dados para garantir a consistência geral das transações financeiras.

Aplicações que usam transações globais envolvem um ou mais Gerenciadores de Recursos e um Gerenciador de Transações:

* Um Gerenciador de Recursos (RM) fornece acesso a recursos transacionais. Um servidor de banco de dados é um tipo de gerenciador de recursos. Deve ser possível comprometer ou reverter transações gerenciadas pelo RM.

* Um Gerenciador de Transações (TM) coordena as transações que fazem parte de uma transação global. Ele se comunica com os RM que lidam com cada uma dessas transações. As transações individuais dentro de uma transação global são "ramos" da transação global. As transações globais e seus ramos são identificados por um esquema de nomeação descrito mais adiante.

A implementação do MySQL de XA permite que um servidor MySQL atue como um Gerenciador de Recursos que lida com transações XA dentro de uma transação global. Um programa cliente que se conecta ao servidor MySQL atua como o Gerenciador de Transações.

Para realizar uma transação global, é necessário saber quais componentes estão envolvidos e levar cada componente a um ponto em que ele possa ser comprometido ou revogado. Dependendo do que cada componente relata sobre sua capacidade de sucesso, todos eles devem comprometer ou revogar como um grupo atômico. Ou seja, todos os componentes devem comprometer ou revogar. Para gerenciar uma transação global, é necessário levar em conta que qualquer componente ou a rede de conexão pode falhar.

O processo para executar uma transação global usa o compromisso de duas fases (2PC). Isso ocorre após as ações realizadas pelos ramos da transação global terem sido executadas.

1. Na primeira fase, todos os ramos são preparados. Isso significa que eles são informados pelo TM para se prepararem para comprometer. Tipicamente, isso significa que cada RM que gerencia um ramo registra as ações para o ramo em armazenamento estável. Os ramos indicam se eles são capazes de fazer isso, e esses resultados são usados para a segunda fase.

2. Na segunda fase, o Gestor de Transações informa aos Gestores de Transações se devem comprometer ou reverter. Se todos os ramos indicarem, quando foram preparados, que podem comprometer, todos os ramos são informados para comprometer. Se algum ramo indicar, quando foi preparado, que não pode comprometer, todos os ramos são informados para reverter.

Em alguns casos, uma transação global pode usar o compromisso de uma fase (1PC). Por exemplo, quando um Gestor de Transações descobre que uma transação global consiste em apenas um recurso transacional (ou seja, um único ramo), esse recurso pode ser informado para se preparar e comprometer ao mesmo tempo.