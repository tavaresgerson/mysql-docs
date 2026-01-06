### 13.3.7 Transações XA

13.3.7.1 Declarações SQL de Transações XA

13.3.7.2 Estados de Transação XA

13.3.7.3 Restrições para Transações XA

O suporte para transações XA está disponível para o mecanismo de armazenamento \`InnoDB. A implementação MySQL XA é baseada no documento X/Open CAE *Processamento de Transações Distribuídas: A Especificação XA*. Este documento é publicado pelo The Open Group e está disponível em <http://www.opengroup.org/public/pubs/catalog/c193.htm>. As limitações da implementação atual do XA são descritas em Seção 13.3.7.3, “Restrições para Transações XA”.

Do lado do cliente, não há requisitos especiais. A interface XA para um servidor MySQL consiste em instruções SQL que começam com a palavra-chave `XA`. Os programas clientes do MySQL devem ser capazes de enviar instruções SQL e entender a semântica da interface da instrução XA. Eles não precisam ser vinculados a uma biblioteca de cliente recente. Bibliotecas de cliente mais antigas também funcionam.

Entre os Conectores MySQL, o MySQL Connector/J 5.0.0 e versões superiores suportam o XA diretamente, por meio de uma interface de classe que gerencia a interface de declaração SQL XA para você.

O XA suporta transações distribuídas, ou seja, a capacidade de permitir que vários recursos transacionais separados participem de uma transação global. Os recursos transacionais são frequentemente RDBMS, mas podem ser outros tipos de recursos.

Uma transação global envolve várias ações que são transacionais por si mesmas, mas todas devem ser concluídas com sucesso como um grupo ou todas devem ser revertidas como um grupo. Em essência, isso estende as propriedades ACID “para cima” para que múltiplas transações ACID possam ser executadas em conjunto como componentes de uma operação global que também possui propriedades ACID. (Assim como nas transações não distribuídas, `SERIALIZABLE` pode ser preferível se suas aplicações são sensíveis a fenômenos de leitura. `REPEATABLE READ` pode não ser suficiente para transações distribuídas.)

Alguns exemplos de transações distribuídas:

- Um aplicativo pode atuar como uma ferramenta de integração que combina um serviço de mensagens com um RDBMS. O aplicativo garante que as transações relacionadas ao envio, recuperação e processamento de mensagens, que também envolvem um banco de dados transacional, ocorram em uma transação global. Você pode pensar nisso como um "e-mail transacional".

- Uma aplicação executa ações que envolvem diferentes servidores de banco de dados, como um servidor MySQL e um servidor Oracle (ou múltiplos servidores MySQL), onde as ações que envolvem múltiplos servidores devem ocorrer como parte de uma transação global, em vez de como transações separadas locais em cada servidor.

- Um banco mantém as informações das contas em um RDBMS e distribui e recebe dinheiro por meio de caixas eletrônicos (ATM). É necessário garantir que as ações do ATM sejam refletidas corretamente nas contas, mas isso não pode ser feito apenas com o RDBMS. Um gerente de transações globais integra os recursos do ATM e do banco de dados para garantir a consistência geral das transações financeiras.

Aplicações que utilizam transações globais envolvem um ou mais Gerenciadores de Recursos e um Gerenciador de Transações:

- Um Gestor de Recursos (RM) fornece acesso a recursos transacionais. Um servidor de banco de dados é um tipo de gerenciador de recursos. Deve ser possível confirmar ou reverter as transações gerenciadas pelo RM.

- Um Gestor de Transações (TM) coordena as transações que fazem parte de uma transação global. Ele se comunica com os RM que lidam com cada uma dessas transações. As transações individuais dentro de uma transação global são "ramos" da transação global. As transações globais e seus ramos são identificados por um esquema de nomeação descrito mais adiante.

A implementação do XA no MySQL permite que um servidor MySQL atue como um Gerenciador de Recursos que lida com transações XA dentro de uma transação global. Um programa cliente que se conecta ao servidor MySQL atua como o Gerenciador de Transações.

Para realizar uma transação global, é necessário saber quais componentes estão envolvidos e levar cada componente a um ponto em que ele possa ser comprometido ou desfeito. Dependendo do que cada componente relata sobre sua capacidade de sucesso, todos eles devem comprometer ou desfazer como um grupo atômico. Ou seja, todos os componentes devem comprometer ou desfazer. Para gerenciar uma transação global, é necessário levar em conta que qualquer componente ou a rede de conexão pode falhar.

O processo para executar uma transação global utiliza o commit de duas fases (2PC). Isso ocorre após as ações realizadas pelas ramificações da transação global terem sido executadas.

1. Na primeira fase, todos os ramos são preparados. Ou seja, eles são informados pelo TM para se prepararem para o commit. Normalmente, isso significa que cada RM que gerencia um ramo registra as ações para o ramo em armazenamento estável. Os ramos indicam se eles são capazes de fazer isso, e esses resultados são usados para a segunda fase.

2. Na segunda fase, o TM informa aos RM se devem comprometer ou reverter. Se todos os ramos indicarem que podem comprometer-se quando foram preparados, todos os ramos são informados para comprometer-se. Se algum ramo indicar que não pode comprometer-se quando foi preparado, todos os ramos são informados para reverter.

Em alguns casos, uma transação global pode usar o commit de uma fase (1PC). Por exemplo, quando um Gestor de Transações descobre que uma transação global consiste em apenas um recurso transacional (ou seja, um único ramo), esse recurso pode ser instruído a se preparar e se comprometer ao mesmo tempo.
