## 17.8 Perguntas Frequentes

Esta seção fornece respostas para perguntas frequentes.

### Qual é o número máximo de servidores MySQL em um grupo?

Um grupo pode conter no máximo 9 servidores. Se tentar adicionar outro servidor a um grupo com 9 membros, o pedido de adição será recusado. Esse limite foi identificado por meio de testes e comparações, como um limite seguro em que o grupo funciona de forma confiável em uma rede local estável.

### Como os servidores de um grupo estão conectados?

Os servidores de um grupo se conectam aos outros servidores do grupo abrindo uma conexão TCP ponto a ponto. Essas conexões são usadas apenas para comunicação interna e transmissão de mensagens entre os servidores do grupo. Esse endereço é configurado pela variável `group_replication_local_address`.

### Para que serve a opção group_replication_bootstrap_group?

A bandeira de bootstrap instrui um membro a *criar* um grupo e a atuar como o servidor inicial de semente. O segundo membro que se junta ao grupo precisa pedir ao membro que iniciou o grupo para alterar dinamicamente a configuração para que ele seja adicionado ao grupo.

Um membro precisa inicializar o grupo em dois cenários. Quando o grupo é criado originalmente ou quando ele é encerrado e reiniciado.

### Como definir as credenciais para o procedimento de recuperação?

Você pré-configura as credenciais do canal de recuperação da replicação em grupo usando a instrução `CHANGE MASTER TO`.

### Posso escalar minha carga de escrita usando a Replicação por Grupo?

Não diretamente, mas a replicação do MySQL Group é uma solução de replicação completa sem compartilhamento, onde todos os servidores do grupo replicam a mesma quantidade de dados. Portanto, se um membro do grupo escrever N bytes no armazenamento como resultado de uma operação de commit de transação, então aproximadamente N bytes são escritos no armazenamento em outros membros também, porque a transação é replicada em todos os lugares.

No entanto, dado que outros membros não precisam realizar a mesma quantidade de processamento que o membro original precisava quando executou a transação originalmente, eles aplicam as alterações mais rapidamente. As transações são replicadas em um formato que é usado apenas para aplicar transformações de linha, sem precisar reexecutar as transações novamente (formato baseado em linha).

Além disso, dado que as alterações são propagadas e aplicadas em formato de linha, isso significa que elas são recebidas em um formato otimizado e compacto, e provavelmente reduzem o número de operações de E/S necessárias em comparação com o membro de origem.

Para resumir, você pode escalar o processamento, espalhando transações livres de conflitos por diferentes membros do grupo. E você provavelmente pode escalar uma pequena fração de suas operações de E/S, pois os servidores remotos recebem apenas as alterações necessárias para as alterações de leitura, modificação e escrita no armazenamento estável.

### A replicação em grupo exige mais largura de banda de rede e CPU em comparação com a replicação simples e sob a mesma carga de trabalho?

Espera-se uma carga adicional porque os servidores precisam estar constantemente interagindo entre si para fins de sincronização. É difícil quantificar quanto mais dados. Isso também depende do tamanho do grupo (três servidores colocam menos estresse nos requisitos de largura de banda do que nove servidores no grupo).

Além disso, a memória e a pegada de CPU são maiores, porque mais trabalho complexo é realizado para a parte de sincronização do servidor e para a mensagem de grupo.

### Posso implementar a Replicação em Grupo em redes de longa distância?

Sim, mas a conexão de rede entre cada membro *deve* ser confiável e ter um desempenho adequado. Conexões de rede com baixa latência e alta largura de banda são um requisito para um desempenho ótimo.

Se o problema for apenas a largura de banda da rede, então seção 17.9.7.2, “Compressão de Mensagens” pode ser usada para reduzir a largura de banda necessária. No entanto, se a rede perder pacotes, levando a retransmissões e maior latência de ponta a ponta, o desempenho e a latência são afetados negativamente.

Aviso

Quando o tempo de ida e volta da rede (RTT) entre qualquer membro do grupo for de 5 segundos ou mais, você pode encontrar problemas, pois o mecanismo de detecção de falhas integrado pode ser acionado incorretamente.

### Os membros retornam automaticamente a um grupo em caso de problemas temporários de conectividade?

Isso depende da razão do problema de conectividade. Se o problema de conectividade for transitório e a reconexão for rápida o suficiente para que o detector de falhas não perceba, então o servidor pode não ser removido do grupo. Se for um problema de conectividade "longo", o detector de falhas eventualmente suspeitará de um problema e o servidor será removido do grupo.

Quando um servidor é removido do grupo, você precisa adicioná-lo novamente. Em outras palavras, após um servidor ser removido explicitamente do grupo, você precisa adicioná-lo manualmente (ou ter um script fazendo isso automaticamente).

### Quando um membro é excluído de um grupo?

Se o membro ficar silencioso, os outros membros o removerão da configuração do grupo. Na prática, isso pode acontecer quando o membro falhar ou houver uma desconexão da rede.

O erro é detectado após o tempo limite especificado para um membro específico expirar e uma nova configuração sem o membro silencioso ser criada.

### O que acontece quando um nó está significativamente atrasado?

Não há um método para definir políticas sobre quando expulsar automaticamente os membros do grupo. Você precisa descobrir por que um membro está atrasado e resolver isso ou remover o membro do grupo. Caso contrário, se o servidor for tão lento que acionar o controle de fluxo, então todo o grupo também desacelera. O controle de fluxo pode ser configurado de acordo com suas necessidades.

### Em caso de suspeita de um problema no grupo, há um membro especial responsável por desencadear uma reconfiguração?

Não, não há um membro especial no grupo responsável por desencadear uma reconfiguração.

Qualquer membro pode suspeitar que há um problema. Todos os membros precisam concordar (automaticamente) que um determinado membro falhou. Um membro é responsável por expulsá-lo do grupo, acionando uma reconfiguração. Qual membro é responsável por expulsar o membro não é algo que você pode controlar ou definir.

### Posso usar a Replicação em Grupo para particionamento?

A Replicação em Grupo é projetada para fornecer conjuntos de replicação altamente disponíveis; os dados e as escritas são duplicados em cada membro do grupo. Para escalar além do que um único sistema pode fornecer, você precisa de uma estrutura de orquestração e fragmentação construída em torno de vários conjuntos de Replicação em Grupo, onde cada conjunto de replicação mantém e gerencia um fragmento ou partição específica do seu conjunto de dados total. Esse tipo de configuração, frequentemente chamado de "clúster fragmentado", permite que você escale leituras e escritas linearmente e sem limite.

### Como usar a replicação em grupo com o SELinux?

Se o SELinux estiver ativado, o que você pode verificar usando **sestatus -v**, então você precisa habilitar o uso da porta de comunicação da Replicação de Grupo. Veja Definindo o contexto da porta TCP para a Replicação de Grupo.

### Como usar a replicação em grupo com o iptables?

Se o **iptables** estiver habilitado, você precisará abrir a porta de Replicação de Grupo para a comunicação entre as máquinas. Para ver as regras atuais em cada máquina, execute **iptables -L**. Supondo que a porta configurada seja 33061, habilite a comunicação na porta necessária, emitindo **iptables -A INPUT -p tcp --dport 33061 -j ACCEPT**.

### Como posso recuperar o registro do retransmissor para um canal de replicação usado por um membro do grupo?

Os canais de replicação usados pelo Grupo de Replicação se comportam da mesma maneira que os canais de replicação usados na fonte para replicar a replicação, e, como tal, dependem do log de relevo. Em caso de alteração da variável `relay_log`, ou quando a opção não estiver definida e o nome do host mudar, há a possibilidade de erros. Consulte Seção 16.2.4.1, “O Log de Relevo” para um procedimento de recuperação nesta situação. Alternativamente, outra maneira de corrigir o problema especificamente no Grupo de Replicação é emitir uma declaração `STOP GROUP_REPLICATION` e, em seguida, uma declaração `START GROUP_REPLICATION` para reiniciar a instância. O plugin de Grupo de Replicação cria novamente o canal `group_replication_applier`.

### Por que o Grupo de Replicação usa duas endereços de conexão?

A replicação em grupo usa duas endereços de conexão para dividir o tráfego de rede entre o endereço SQL, usado pelos clientes para se comunicarem com o membro, e o `group_replication_local_address`, usado internamente pelos membros do grupo para se comunicarem. Por exemplo, suponha que um servidor tenha duas interfaces de rede atribuídas aos endereços de rede `203.0.113.1` e `198.51.100.179`. Nessa situação, você poderia usar `203.0.113.1:33061` para o endereço de rede interno do grupo, configurando `group_replication_local_address=203.0.113.1:33061`. Então, você poderia usar `198.51.100.179` para o `hostname` e `3306` para o `port`. As aplicações SQL dos clientes então se conectariam ao membro em `198.51.100.179:3306`. Isso permite que você configure regras diferentes nas diferentes redes. Da mesma forma, a comunicação interna do grupo pode ser separada da conexão de rede usada para aplicações de clientes, para aumentar a segurança.

### Como o Grupo de Replicação usa endereços de rede e nomes de host?

A replicação em grupo usa conexões de rede entre os membros, e, portanto, sua funcionalidade é diretamente afetada pela forma como você configura os nomes de host e portas. Por exemplo, o procedimento de recuperação da replicação em grupo é baseado em replicação assíncrona, que usa o nome de host e a porta do servidor. Quando um membro se junta a um grupo, ele recebe as informações de filiação ao grupo, usando as informações de endereço de rede listadas em `performance_schema.replication_group_members`. Um dos membros listados naquela tabela é selecionado como o doador dos dados faltantes do grupo para o novo membro.

Isso significa que qualquer valor que você configure usando um nome de host, como o endereço de rede SQL ou o endereço de sementes do grupo, deve ser um nome totalmente qualificado e resolvível por cada membro do grupo. Você pode garantir isso, por exemplo, por meio do DNS, ou arquivos `/etc/hosts` configurados corretamente, ou outros processos locais. Se você quiser configurar o valor `MEMBER_HOST` em um servidor, especifique-o usando a opção [`--report-host`](https://replication-options-replica.html#sysvar_report_host) no servidor antes de conectá-lo ao grupo.

Importante

O valor atribuído é usado diretamente e não é afetado pela variável de sistema `skip_name_resolve`.

Para configurar `MEMBER_PORT` em um servidor, especifique-o usando a variável de sistema [`report_port`](https://docs.mariadb.org/en/stable/replication-options-replica.html#sysvar_report_port).

### Por que o ajuste de incremento automático no servidor mudou?

Quando a Replicação em Grupo é iniciada em um servidor, o valor de `auto_increment_increment` é alterado para o valor de `group_replication_auto_increment_increment`, que tem o valor padrão de 7, e o valor de `auto_increment_offset` é alterado para o ID do servidor. As alterações são revertidas quando a Replicação em Grupo é parada. Essas configurações evitam a seleção de valores duplicados de autoincremento para escritas nos membros do grupo, o que causa o rollback das transações. O valor padrão de autoincremento de 7 para a Replicação em Grupo representa um equilíbrio entre o número de valores utilizáveis e o tamanho máximo permitido de um grupo de replicação (9 membros).

As alterações só são feitas e revertidas se `auto_increment_increment` e `auto_increment_offset` tiverem seus valores padrão de 1. Se seus valores já tiverem sido modificados do padrão, o Grupo de Replicação não os altera.

### Como encontro o principal?

Se o grupo estiver operando no modo de primário único, pode ser útil descobrir qual membro é o primário. Consulte Seção 17.5.1.3, “Encontrando o Primário”
