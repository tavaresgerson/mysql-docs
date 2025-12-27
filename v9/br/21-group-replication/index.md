# Capítulo 20 Replicação em Grupo

**Índice**

20.1 Contexto da Replicação em Grupo:   20.1.1 Tecnologias de Replicação

    20.1.2 Casos de Uso da Replicação em Grupo

    20.1.3 Modos Multi-Primário e Único-Primário

    20.1.4 Serviços de Replicação em Grupo

    20.1.5 Arquitetura de Plugin de Replicação em Grupo

20.2 Começando:   20.2.1 Deploying Group Replication em Modo Único-Primário

    20.2.2 Deploying Group Replication Localmente

20.3 Requisitos e Limitações:   20.3.1 Requisitos de Replicação em Grupo

    20.3.2 Limitações de Replicação em Grupo

20.4 Monitoramento da Replicação em Grupo:   20.4.1 GTIDs e Replicação em Grupo

    20.4.2 Estados dos Servidores de Replicação em Grupo

    20.4.3 A Tabela replication\_group\_members

    20.4.4 A Tabela replication\_group\_member\_stats

20.5 Operações de Replicação em Grupo:   20.5.1 Configurando um Grupo Online

    20.5.2 Reiniciando um Grupo

    20.5.3 Garantindo Consistência de Transações

    20.5.4 Recuperação Distribuída

    20.5.5 Suporte para IPv6 e para Grupos Mistas IPv6 e IPv4

    20.5.6 Usando o Backup do MySQL Enterprise com a Replicação em Grupo

20.6 Segurança da Replicação em Grupo:   20.6.1 Pilha de Comunicação para Gerenciamento de Segurança de Conexão

    20.6.2 Asegurando Conexões de Comunicação de Replicação com Secure Socket Layer (SSL)

    20.6.3 Asegurando Conexões de Recuperação Distribuída

    20.6.4 Permissões de Endereço IP de Replicação em Grupo

20.7 Desempenho e Solução de Problemas da Replicação em Grupo:   20.7.1 Ajustando o Fundo de Comunicação do Grupo

    20.7.2 Controle de Fluxo

    20.7.3 Líder de Consenso Único

    20.7.4 Compressão de Mensagens

    20.7.5 Fragmentação de Mensagens

    20.7.6 Gerenciamento do Cache XCom

    20.7.7 Respostas à Detecção de Falha e Partição de Rede

    20.7.8 Lidando com uma Partição de Rede e Perda de Quórum

20.7.9 Monitoramento do Uso da Memória da Replicação do Grupo com Instrumentação de Memória do Schema de Desempenho

20.8 Atualização da Replicação do Grupo:   20.8.1 Combinando Diferentes Versões de Membros em um Grupo

    20.8.2 Atualização Offline da Replicação do Grupo

    20.8.3 Atualização Online da Replicação do Grupo

20.9 Variáveis da Replicação do Grupo:   20.9.1 Variáveis do Sistema de Replicação do Grupo

    20.9.2 Variáveis de Status da Replicação do Grupo

20.10 Perguntas Frequentes

Este capítulo explica a Replicação do Grupo no MySQL 9.5 e como instalar, configurar e monitorar grupos. A Replicação do Grupo do MySQL permite que você crie topologias de replicação elásticas, altamente disponíveis e tolerantes a falhas.

Os grupos podem operar em modo único de primário com eleição automática de primário, onde apenas um servidor aceita atualizações de cada vez. Alternativamente, os grupos podem ser implantados em modo multi-primário, onde todos os servidores podem aceitar atualizações, mesmo que sejam emitidas simultaneamente.

Existe um serviço de associação de grupo embutido que mantém a visão do grupo consistente e disponível para todos os servidores em qualquer momento. Os servidores podem sair e entrar no grupo e a visão é atualizada conforme necessário. Às vezes, os servidores podem sair do grupo inesperadamente, caso em que o mecanismo de detecção de falha detecta isso e notifica o grupo que a visão foi alterada. Tudo isso é automático.

A Replicação do Grupo garante que o serviço de banco de dados esteja continuamente disponível. No entanto, é importante entender que, se um dos membros do grupo ficar indisponível, os clientes conectados a esse membro do grupo devem ser redirecionados ou transferidos para outro servidor no grupo, usando um conector, um equilibrador de carga, um roteador ou alguma forma de middleware. A Replicação do Grupo não tem um método embutido para fazer isso. Por exemplo, veja o MySQL Router 9.5.

A Replicação em Grupo é fornecida como um plugin para o MySQL Server. Você pode seguir as instruções neste capítulo para configurar o plugin em cada uma das instâncias do servidor que você deseja no grupo, iniciar o grupo e monitorar e administrar o grupo. Uma maneira alternativa de implantar um grupo de instâncias do MySQL Server é usando o InnoDB Cluster.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do MySQL Server no MySQL Shell. O InnoDB Cluster envolve a Replicação em Grupo do MySQL em um ambiente programático que permite implantar facilmente um clúster de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster se integra perfeitamente com o MySQL Router, o que permite que suas aplicações se conectem ao clúster sem precisar escrever seu próprio processo de falha. Para casos de uso semelhantes que não requerem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação para o MySQL Shell podem ser encontradas aqui.

O MySQL 9.5 e versões posteriores suportam vários componentes do MySQL para uso com a Replicação em Grupo do MySQL. Consulte a Seção 7.5.6, “Componentes de Replicação”, para obter mais informações.

Este capítulo é estruturado da seguinte forma:

* Seção 20.1, “Contexto da Replicação em Grupo” fornece uma introdução aos grupos e como a Replicação em Grupo funciona.

* Seção 20.2, “Começando” explica como configurar múltiplas instâncias do MySQL Server para criar um grupo.

* Seção 20.3, “Requisitos e Limitações” explica os requisitos e limitações de arquitetura e configuração para a Replicação em Grupo.

* Seção 20.4, “Monitorando a Replicação em Grupo” explica como monitorar um grupo.

* Seção 20.5, “Operações de Replicação em Grupo” explica como trabalhar com um grupo.

* A seção 20.6, “Segurança da Replicação em Grupo”, explica como proteger um grupo.

* A seção 20.7, “Desempenho e solução de problemas da replicação em grupo”, explica como ajustar o desempenho de um grupo.

* A seção 20.8, “Atualização da replicação em grupo”, explica como atualizar um grupo.

* A seção 20.9, “Variáveis da replicação em grupo”, é uma referência para as variáveis do sistema específicas para a replicação em grupo.

* A seção 20.10, “Perguntas frequentes”, fornece respostas para algumas perguntas técnicas sobre a implantação e operação da replicação em grupo.