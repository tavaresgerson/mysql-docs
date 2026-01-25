## 17.8 Perguntas Frequentes

Esta seção fornece respostas para perguntas frequentes.

### Qual é o número máximo de servidores MySQL em um grupo?

Um grupo pode consistir em no máximo 9 servidores. A tentativa de adicionar outro servidor a um grupo com 9 membros faz com que a solicitação de JOIN seja recusada. Este limite foi identificado através de testes e *benchmarking* como um limite seguro onde o grupo tem um desempenho confiável em uma rede local estável (LAN).

### Como os servidores em um grupo estão conectados?

Os servidores em um grupo se conectam aos outros servidores do grupo abrindo uma conexão TCP *peer-to-peer*. Essas conexões são usadas apenas para comunicação interna e troca de mensagens entre os servidores do grupo. Este endereço é configurado pela variável [`group_replication_local_address`].

### Para que serve a opção group_replication_bootstrap_group?

A *flag bootstrap* instrui um membro a *criar* um grupo e atuar como o servidor *seed* inicial. O segundo membro que faz o JOIN no grupo precisa solicitar ao membro que fez o *bootstrap* do grupo para que altere dinamicamente a configuração para que ele possa ser adicionado ao grupo.

Um membro precisa fazer o *bootstrap* do grupo em dois cenários. Quando o grupo é criado originalmente, ou ao desligar e reiniciar o grupo inteiro.

### Como configuro as credenciais para o procedimento de recovery?

Você pré-configura as credenciais do canal de *recovery* do Group Replication usando a instrução [`CHANGE MASTER TO`].

### Posso fazer scale-out da minha write-load usando Group Replication?

Não diretamente, mas o MySQL Group Replication é uma solução de *full replication* do tipo *shared nothing*, onde todos os servidores no grupo replicam a mesma quantidade de dados. Portanto, se um membro do grupo gravar N bytes no *storage* como resultado de uma operação de *transaction commit*, então aproximadamente N bytes também serão gravados no *storage* em outros membros, porque a transação é replicada em todos os lugares.

No entanto, visto que outros membros não precisam fazer a mesma quantidade de processamento que o membro original teve que fazer quando executou a transação, eles aplicam as mudanças mais rapidamente. As transações são replicadas em um formato que é usado para aplicar transformações de *row* apenas, sem ter que reexecutar as transações novamente (formato *row-based*).

Além disso, dado que as alterações são propagadas e aplicadas no formato *row-based*, isso significa que elas são recebidas em um formato otimizado e compacto, e provavelmente reduzindo o número de operações de IO necessárias em comparação com o membro de origem.

Em resumo, você pode fazer *scale-out* do processamento, distribuindo transações sem conflito por diferentes membros do grupo. E você provavelmente pode fazer *scale-out* de uma pequena fração de suas operações de IO, visto que servidores remotos recebem apenas as alterações necessárias para aplicar as mudanças de *read-modify-write* no *storage* estável.

### O Group Replication requer mais network bandwidth e CPU, quando comparado a uma replication simples e sob a mesma workload?

É esperada alguma carga adicional porque os servidores precisam interagir constantemente entre si para fins de sincronização. É difícil quantificar o quanto mais de dados. Também depende do tamanho do grupo (três servidores impõem menos estresse aos requisitos de *bandwidth* do que nove servidores no grupo).

Além disso, o *footprint* de memória e CPU é maior, porque um trabalho mais complexo é feito para a parte de sincronização do servidor e para a troca de mensagens do grupo.

### Posso fazer o deploy do Group Replication em wide-area networks?

Sim, mas a conexão de rede entre cada membro *deve* ser confiável e ter um desempenho adequado. Conexões de rede de baixa *latency* e alta *bandwidth* são um requisito para um desempenho ideal.

Se apenas a *network bandwidth* for um problema, a [Seção 17.9.7.2, “Message Compression”](group-replication-message-compression.html "17.9.7.2 Message Compression") pode ser usada para diminuir a *bandwidth* necessária. No entanto, se a rede derrubar pacotes, levando a retransmissões e maior *latency* de ponta a ponta, a *throughput* e a *latency* são afetadas negativamente.

Aviso

Quando o *Round-Trip Time* (RTT) da rede entre quaisquer membros do grupo for de 5 segundos ou mais, você poderá encontrar problemas, pois o mecanismo de detecção de falhas integrado pode ser acionado incorretamente.

### Os membros fazem rejoin automático em um grupo em caso de problemas temporários de conectividade?

Isso depende do motivo do problema de conectividade. Se o problema de conectividade for transitório e a reconexão for rápida o suficiente para que o detector de falhas não o perceba, o servidor pode não ser removido do grupo. Se for um problema de conectividade "longo", o detector de falhas eventualmente suspeitará de um problema e o servidor será removido do grupo.

Depois que um servidor é removido do grupo, você precisa fazê-lo voltar a fazer JOIN. Em outras palavras, depois que um servidor é removido explicitamente do grupo, você precisa fazê-lo fazer *rejoin* manualmente (ou ter um script fazendo isso automaticamente).

### Quando um membro é excluído de um grupo?

Se o membro ficar inativo (*silent*), os outros membros o removem da configuração do grupo. Na prática, isso pode acontecer quando o membro travou (*crashed*) ou há uma desconexão de rede.

A falha é detectada após o *timeout* de um determinado membro expirar e uma nova configuração sem o membro inativo ser criada.

### O que acontece quando um node está significativamente atrasado (lagging behind)?

Não há método para definir políticas sobre quando expulsar membros automaticamente do grupo. Você precisa descobrir por que um membro está atrasado e corrigir isso ou remover o membro do grupo. Caso contrário, se o servidor for tão lento que acione o *flow control*, todo o grupo também ficará lento. O *flow control* pode ser configurado de acordo com as suas necessidades.

### Diante da suspeita de um problema no grupo, existe algum membro especial responsável por acionar uma reconfiguração?

Não, não há nenhum membro especial no grupo encarregado de acionar uma reconfiguração.

Qualquer membro pode suspeitar que há um problema. Todos os membros precisam concordar (automaticamente) que um determinado membro falhou. Um membro é encarregado de expulsá-lo do grupo, acionando uma reconfiguração. Qual membro é responsável por expulsar o membro não é algo que você pode controlar ou definir.

### Posso usar Group Replication para sharding?

O Group Replication foi projetado para fornecer *replica sets* de alta disponibilidade; dados e *writes* são duplicados em cada membro do grupo. Para fazer o *scaling* além do que um único sistema pode fornecer, você precisa de uma estrutura de orquestração e *sharding* construída em torno de vários *sets* do Group Replication, onde cada *replica set* mantém e gerencia um determinado *shard* ou partição do seu conjunto total de dados. Esse tipo de configuração, geralmente chamada de “*sharded cluster*” (*cluster particionado*), permite que você faça o *scaling* de *reads* e *writes* linearmente e sem limites.

### Como uso Group Replication com SELinux?

Se o SELinux estiver habilitado, o que você pode verificar usando **sestatus -v**, então você precisa habilitar o uso da porta de comunicação do Group Replication. Consulte [Setting the TCP Port Context for Group Replication](selinux-context-mysql-feature-ports.html#selinux-context-group-replication-port "Setting the TCP Port Context for Group Replication").

### Como uso Group Replication com iptables?

Se o **iptables** estiver habilitado, você precisa liberar a *port* do Group Replication para comunicação entre as máquinas. Para ver as regras atuais em vigor em cada máquina, execute **iptables -L**. Supondo que a *port* configurada seja 33061, habilite a comunicação pela *port* necessária executando **iptables -A INPUT -p tcp --dport 33061 -j ACCEPT**.

### Como faço o recovery do relay log para um canal de replication usado por um membro do grupo?

Os canais de *replication* usados pelo Group Replication se comportam da mesma forma que os canais de *replication* usados na *replication* de *source* para *replica*, e, como tal, dependem do *relay log*. No caso de uma alteração na variável [`relay_log`], ou quando a opção não está definida e o *hostname* muda, há uma chance de erros. Consulte a [Seção 16.2.4.1, “The Relay Log”](replica-logs-relaylog.html "16.2.4.1 The Relay Log") para um procedimento de *recovery* nesta situação. Alternativamente, outra maneira de corrigir o problema especificamente no Group Replication é emitir uma instrução [`STOP GROUP_REPLICATION`] e, em seguida, uma instrução [`START GROUP_REPLICATION`] para reiniciar a instância. O *plugin* Group Replication cria o canal `group_replication_applier` novamente.

### Por que o Group Replication usa dois bind addresses?

O Group Replication usa dois *bind addresses* para dividir o tráfego de rede entre o endereço SQL, usado pelos *clients* para se comunicar com o membro, e o [`group_replication_local_address`], usado internamente pelos membros do grupo para comunicação. Por exemplo, suponha um servidor com duas interfaces de rede atribuídas aos endereços de rede `203.0.113.1` e `198.51.100.179`. Nessa situação, você pode usar `203.0.113.1:33061` para o endereço de rede do grupo interno definindo [`group_replication_local_address=203.0.113.1:33061`]. Em seguida, você pode usar `198.51.100.179` para [`hostname`] e `3306` para [`port`]. As aplicações SQL *client* se conectariam ao membro em `198.51.100.179:3306`. Isso permite que você configure regras diferentes nas diferentes redes. Da mesma forma, a comunicação interna do grupo pode ser separada da conexão de rede usada para aplicações *client*, para maior segurança.

### Como o Group Replication usa network addresses e hostnames?

O Group Replication usa conexões de rede entre os membros e, portanto, sua funcionalidade é diretamente afetada pela forma como você configura *hostnames* e *ports*. Por exemplo, o procedimento de *recovery* do Group Replication é baseado em *replication* assíncrona que usa o *hostname* e a *port* do servidor. Quando um membro faz JOIN em um grupo, ele recebe as informações de membresia do grupo, usando as informações de *network address* listadas em [`performance_schema.replication_group_members`]. Um dos membros listados nessa tabela é selecionado como o *donor* dos dados ausentes do grupo para o novo membro.

Isso significa que qualquer valor que você configurar usando um *hostname*, como o *network address* SQL ou o endereço *seeds* do grupo, deve ser um nome totalmente qualificado e resolúvel por cada membro do grupo. Você pode garantir isso, por exemplo, através de DNS, ou arquivos `/etc/hosts` configurados corretamente, ou outros processos locais. Se você quiser configurar o valor `MEMBER_HOST` em um servidor, especifique-o usando a opção [`--report-host`] no servidor antes de fazê-lo fazer JOIN no grupo.

Importante

O valor atribuído é usado diretamente e não é afetado pela variável de sistema [`skip_name_resolve`].

Para configurar `MEMBER_PORT` em um servidor, especifique-o usando a variável de sistema [`report_port`].

### Por que a configuração de auto increment no servidor mudou?

Quando o Group Replication é iniciado em um servidor, o valor de [`auto_increment_increment`] é alterado para o valor de [`group_replication_auto_increment_increment`], que por padrão é 7, e o valor de [`auto_increment_offset`] é alterado para o ID do servidor. As alterações são revertidas quando o Group Replication é interrompido. Essas configurações evitam a seleção de valores de *auto-increment* duplicados para *writes* em membros do grupo, o que causa o *rollback* das transações. O valor padrão de *auto increment* de 7 para o Group Replication representa um equilíbrio entre o número de valores utilizáveis e o tamanho máximo permitido de um grupo de *replication* (9 membros).

As alterações são feitas e revertidas apenas se [`auto_increment_increment`] e [`auto_increment_offset`] tiverem seu valor padrão de 1. Se seus valores já tiverem sido modificados em relação ao padrão, o Group Replication não os altera.

### Como encontro o primary?

Se o grupo estiver operando no modo *single-primary*, pode ser útil descobrir qual membro é o *primary*. Consulte a [Seção 17.5.1.3, “Finding the Primary”](group-replication-find-primary.html "17.5.1.3 Finding the Primary")