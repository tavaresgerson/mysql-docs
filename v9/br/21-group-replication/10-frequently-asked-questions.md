## 20.10 Perguntas Frequentes

Esta seção fornece respostas para perguntas frequentes.

### Qual é o número máximo de servidores MySQL em um grupo?

Um grupo pode conter no máximo 9 servidores. Tentar adicionar outro servidor a um grupo com 9 membros faz com que o pedido de adesão seja recusado. Esse limite foi identificado por meio de testes e benchmarks como um limite seguro onde o grupo funciona de forma confiável em uma rede local estável.

### Como os servidores em um grupo são conectados?

Os servidores em um grupo se conectam aos outros servidores do grupo abrindo uma conexão TCP ponto a ponto. Essas conexões são usadas apenas para comunicação interna e passagem de mensagens entre os servidores do grupo. Esse endereço é configurado pela variável `group_replication_local_address`.

### Para que serve a opção group\_replication\_bootstrap\_group?

A bandeira bootstrap instrui um membro a *criar* um grupo e atuar como o servidor inicial de semente. O segundo membro que se junta ao grupo precisa pedir ao membro que iniciou o grupo para alterar dinamicamente a configuração para que ele possa ser adicionado ao grupo.

Um membro precisa bootstrap o grupo em dois cenários. Quando o grupo é criado originalmente ou quando o grupo inteiro é desligado e reiniciado.

### Como definir as credenciais para o processo de recuperação distribuída?

Você pode definir as credenciais do usuário permanentemente como as credenciais para o canal `group_replication_recovery`, usando uma declaração `CHANGE REPLICATION SOURCE TO`. Você pode especificá-las na declaração `START GROUP_REPLICATION` toda vez que a Replicação do Grupo for iniciada.

As credenciais do usuário definidas usando `ALTERAR FONTE DE REPLICAÇÃO PARA` são armazenadas em texto plano nos repositórios de metadados de replicação no servidor, mas as credenciais do usuário especificadas em `INICIAR REPLICAÇÃO EM GRUPO` são salvas apenas na memória e são removidas por uma instrução `STOP REPLICAÇÃO EM GRUPO` ou o desligamento do servidor. Usar `INICIAR REPLICAÇÃO EM GRUPO` para especificar as credenciais do usuário, portanto, ajuda a proteger os servidores de replicação em grupo contra acesso não autorizado. No entanto, esse método não é compatível com o início automático da replicação em grupo, conforme especificado pela variável de sistema `group_replication_start_on_boot`. Para mais informações, consulte a Seção 20.6.3.1, “Segurança das Credenciais do Usuário para Recuperação Distribuída”.

### Posso escalar minha carga de escrita usando a replicação em grupo?

Não diretamente, mas a replicação em grupo do MySQL é uma solução de replicação completa sem nada compartilhado, onde todos os servidores no grupo replicam a mesma quantidade de dados. Portanto, se um membro do grupo escreve N bytes no armazenamento como resultado de uma operação de commit de transação, então aproximadamente N bytes são escritos no armazenamento em outros membros também, porque a transação é replicada em todos os lugares.

No entanto, dado que outros membros não precisam fazer a mesma quantidade de processamento que o membro original teve que fazer quando executou a transação originalmente, eles aplicam as mudanças mais rapidamente. As transações são replicadas em um formato que é usado para aplicar transformações de linha apenas, sem precisar reexecutar as transações novamente (formato baseado em linha).

Além disso, dado que as mudanças são propagadas e aplicadas em formato baseado em linha, isso significa que são recebidas em um formato otimizado e compacto, e provavelmente reduzindo o número de operações de I/O necessárias em comparação com o membro original.

Para resumir, você pode escalar o processamento, espalhando transações livres de conflitos por diferentes membros do grupo. E você provavelmente pode escalar uma pequena fração de suas operações de I/O, já que os servidores remotos recebem apenas as alterações necessárias para as alterações de leitura-modificação-escrita no armazenamento estável.

### A replicação em grupo exige mais largura de banda de rede e CPU em comparação com a replicação simples e sob a mesma carga de trabalho?

Espera-se uma carga adicional porque os servidores precisam interagir constantemente uns com os outros para fins de sincronização. É difícil quantificar quanto mais dados. Isso também depende do tamanho do grupo (três servidores colocam menos estresse nas exigências de largura de banda do que nove servidores no grupo).

Além disso, a pegada de memória e CPU é maior, porque mais trabalho complexo é realizado para a parte de sincronização do servidor e para a mensagem do grupo.

### Posso implementar a replicação em grupo em redes de área ampla?

Sim, mas a conexão de rede entre cada membro *deve* ser confiável e ter desempenho adequado. Conexões de rede com baixa latência e alta largura de banda são um requisito para um desempenho ótimo.

Se a largura de banda da rede sozinha for um problema, então a Seção 20.7.4, “Compressão de Mensagens”, pode ser usada para reduzir a largura de banda necessária. No entanto, se a rede perder pacotes, levando a retransmissões e maior latência de ponta a ponta, o throughput e a latência são afetados negativamente.

Aviso

Quando o tempo de ida e volta da rede (RTT) entre quaisquer membros do grupo for de 5 segundos ou mais, você pode encontrar problemas, pois o mecanismo de detecção de falha embutido pode ser acionado incorretamente.

### Os membros se reinserem automaticamente em um grupo em caso de problemas de conectividade temporários?

Isso depende da razão do problema de conectividade. Se o problema de conectividade for transitório e a reconexão for rápida o suficiente para que o detector de falhas não perceba, então o servidor pode não ser removido do grupo. Se for um problema de conectividade "longo", o detector de falhas eventualmente suspeitará de um problema e o servidor será removido do grupo.

Dois ajustes estão disponíveis para aumentar as chances de um membro permanecer no grupo ou se reconectar:

* `group_replication_member_expel_timeout` aumenta o tempo entre a criação de uma suspeita (que acontece após um período inicial de detecção de 5 segundos) e a expulsão do membro. Você pode definir um período de espera de até 1 hora. Um período de espera de 5 segundos é definido como padrão.

* `group_replication_autorejoin_tries` faz com que o membro tente se reconectar ao grupo após uma expulsão ou um tempo de maioria inacessível. O membro faz o número especificado de tentativas de autoconexão a cada cinco minutos. Essa funcionalidade está ativada por padrão; o membro faz três tentativas de autoconexão.

Se um servidor for expulso do grupo e nenhuma das tentativas de autoconexão tiver sucesso, você precisa reconectá-lo novamente. Em outras palavras, após um servidor ser removido explicitamente do grupo, você precisa reconectá-lo manualmente (ou ter um script fazendo isso automaticamente).

### Quando um membro é excluído de um grupo?

Se o membro ficar silencioso, os outros membros o removem da configuração do grupo. Na prática, isso pode acontecer quando o membro falha ou há uma desconexão de rede.

A falha é detectada após o término de um tempo limite para um membro específico e uma nova configuração sem o membro silencioso é criada.

### O que acontece quando um nó está significativamente atrasado?

Não há um método para definir políticas sobre quando expulsar automaticamente os membros do grupo. Você precisa descobrir por que um membro está atrasado e corrigir isso ou remover o membro do grupo. Caso contrário, se o servidor estiver tão lento que isso desencadeie o controle de fluxo, todo o grupo também desacelerará. O controle de fluxo pode ser configurado de acordo com suas necessidades.

### Em caso de suspeita de um problema no grupo, há um membro especial responsável por desencadear uma reconfiguração?

Não, não há um membro especial no grupo responsável por desencadear uma reconfiguração.

Qualquer membro pode suspeitar que há um problema. Todos os membros precisam (automática) concordar que um determinado membro falhou. Um membro é responsável por expulsá-lo do grupo, desencadeando uma reconfiguração. Qual membro é responsável por expulsar o membro não é algo que você pode controlar ou definir.

### Posso usar a Replicação de Grupo para sharding?

A Replicação de Grupo é projetada para fornecer conjuntos de replicações altamente disponíveis; os dados e as escritas são duplicados em cada membro do grupo. Para escalar além do que um único sistema pode fornecer, você precisa de uma estrutura de orquestração e sharding construída em torno de vários conjuntos de Replicação de Grupo, onde cada conjunto de replicação mantém e gerencia um shard ou partição específica de seu conjunto de dados total. Esse tipo de configuração, frequentemente chamado de "clúster dividido", permite que você escale leituras e escritas linearmente e sem limite.

### Como uso a Replicação de Grupo com SELinux?

Se o SELinux estiver habilitado, o que você pode verificar usando **sestatus -v**, então você precisa habilitar o uso do porto de comunicação da Replicação de Grupo. Veja Configurando o Contexto do Porto TCP para a Replicação de Grupo.

### Como uso a Replicação de Grupo com iptables?

Se o **iptables** estiver habilitado, você precisa abrir a porta de Replicação em Grupo para a comunicação entre as máquinas. Para ver as regras atuais em cada máquina, execute **iptables -L**. Supondo que a porta configurada seja 33061, habilite a comunicação na porta necessária, emitindo **iptables -A INPUT -p tcp --dport 33061 -j ACCEPT**.

### Como posso recuperar o log de retransmissão para um canal de replicação usado por um membro do grupo?

Os canais de replicação usados pela Replicação em Grupo se comportam da mesma maneira que os canais de replicação usados na replicação assíncrona de fonte para replicação, e, como tal, dependem do log de retransmissão. Em caso de alteração da variável `relay_log` ou quando a opção não estiver definida e o nome do host mudar, há a possibilidade de erros. Consulte a Seção 19.2.4.1, “O Log de Retransmissão”, para um procedimento de recuperação nessa situação. Alternativamente, outra maneira de resolver o problema especificamente na Replicação em Grupo é emitir uma declaração `STOP GROUP_REPLICATION` e, em seguida, uma declaração `START GROUP_REPLICATION` para reiniciar a instância. O plugin de Replicação em Grupo cria novamente o canal `group_replication_applier`.

### Por que a Replicação em Grupo usa dois endereços de vinculação?

A Replicação em Grupo usa duas endereços de conexão para dividir o tráfego de rede entre o endereço SQL, usado pelos clientes para se comunicarem com o membro, e o `group_replication_local_address`, usado internamente pelos membros do grupo para se comunicarem. Por exemplo, suponha que um servidor tenha duas interfaces de rede atribuídas aos endereços de rede `203.0.113.1` e `198.51.100.179`. Nessa situação, você poderia usar `203.0.113.1:33061` para o endereço de rede interno do grupo, configurando `group_replication_local_address=203.0.113.1:33061`. Em seguida, você poderia usar `198.51.100.179` para `hostname` e `3306` para a `port`. As aplicações SQL dos clientes então se conectarão ao membro em `198.51.100.179:3306`. Isso permite que você configure regras diferentes nas diferentes redes. Da mesma forma, a comunicação interna do grupo pode ser separada da conexão de rede usada para aplicações de clientes, para aumentar a segurança.

### Como a Replicação em Grupo usa endereços de rede e nomes de host?

A Replicação em Grupo usa conexões de rede entre os membros e, portanto, sua funcionalidade é diretamente impactada pela forma como você configura nomes de host e portas. Por exemplo, o processo de recuperação distribuída da Replicação em Grupo cria uma conexão com um membro do grupo existente usando o nome de host e a porta do servidor. Quando um membro se junta a um grupo, ele recebe as informações de filiação ao grupo, usando as informações de endereço de rede listadas em `performance_schema.replication_group_members`. Um dos membros listados naquela tabela é selecionado como doador dos dados faltantes do grupo para o membro que está se juntando.

Isso significa que qualquer valor que você configure usando um nome de host, como o endereço de rede SQL ou o endereço de seeds do grupo, deve ser um nome totalmente qualificado e resolvível por cada membro do grupo. Você pode garantir isso, por exemplo, por meio do DNS, ou arquivos `/etc/hosts` configurados corretamente, ou outros processos locais. Se você quiser configurar o valor `MEMBER_HOST` em um servidor, especifique-o usando a opção `--report-host` no servidor antes de adicioná-lo ao grupo.

Importante

O valor atribuído é usado diretamente e não é afetado pela variável de sistema `skip_name_resolve`.

Para configurar `MEMBER_PORT` em um servidor, especifique-o usando a variável de sistema `report_port`.

### Por que a configuração de auto incremento no servidor mudou?

Quando a Replicação de Grupo é iniciada em um servidor, o valor de `auto_increment_increment` é alterado para o valor de `group_replication_auto_increment_increment`, que tem o valor padrão de 7, e o valor de `auto_increment_offset` é alterado para o ID do servidor. As alterações são revertidas quando a Replicação de Grupo é parada. Essas configurações evitam a seleção de valores de auto incremento duplicados para escritas nos membros do grupo, o que causa o rollback de transações. O valor padrão de auto incremento de 7 para a Replicação de Grupo representa um equilíbrio entre o número de valores utilizáveis e o tamanho máximo permitido de um grupo de replicação (9 membros).

As alterações são feitas e revertidas apenas se `auto_increment_increment` e `auto_increment_offset` tiverem seus valores padrão (1 em ambos os casos). Se seus valores já tiverem sido modificados do padrão, a Replicação de Grupo não os altera. As variáveis de sistema também não são modificadas quando a Replicação de Grupo está no modo de único primário, onde apenas um servidor escreve.

### Como eu encontro o primário?

Se o grupo estiver operando no modo de primário único, pode ser útil descobrir qual membro é o primário. Consulte a Seção 20.1.3.1.2, “Encontrando o Primário”.