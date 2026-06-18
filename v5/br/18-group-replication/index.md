# Capítulo 17 Group Replication

**Índice**

17.1 Histórico do Group Replication :   17.1.1 Tecnologias de Replication

    17.1.2 Casos de Uso do Group Replication

    17.1.3 Detalhes do Group Replication

17.2 Primeiros Passos :   17.2.1 Implantando Group Replication no Modo Single-Primary

    17.2.2 Implantando Group Replication Localmente

17.3 Requisitos e Limitações :   17.3.1 Requisitos do Group Replication

    17.3.2 Limitações do Group Replication

17.4 Monitoramento do Group Replication :   17.4.1 Estados do Server do Group Replication

    17.4.2 A Tabela replication_group_members

    17.4.3 A Tabela replication_group_member_stats

17.5 Operações do Group Replication :   17.5.1 Implantando nos Modos Multi-Primary ou Single-Primary

    17.5.2 Ajustando o Recovery

    17.5.3 Particionamento de Rede

    17.5.4 Reiniciando um Grupo

    17.5.5 Usando MySQL Enterprise Backup com Group Replication

17.6 Segurança do Group Replication :   17.6.1 Permissões de Endereço IP (Allowlisting) do Group Replication

    17.6.2 Suporte a Secure Socket Layer (SSL) do Group Replication

    17.6.3 Group Replication e Virtual Private Networks (VPNs)

17.7 Variáveis do Group Replication :   17.7.1 Variáveis de Sistema do Group Replication

    17.7.2 Variáveis de Status do Group Replication

17.8 Perguntas Frequentes

17.9 Detalhes Técnicos do Group Replication :   17.9.1 Arquitetura do Plugin Group Replication

    17.9.2 O Grupo

    17.9.3 Declarações de Manipulação de Dados

    17.9.4 Declarações de Definição de Dados

    17.9.5 Recovery Distribuído

    17.9.6 Observabilidade

    17.9.7 Performance do Group Replication

Este capítulo explica o MySQL Group Replication e como instalar, configurar e monitorar grupos. O MySQL Group Replication é um plugin do MySQL Server que permite criar topologias de replication elásticas, de alta disponibilidade e tolerantes a falhas.

Grupos podem operar no modo single-primary com eleição automática do Primary, onde apenas um server aceita atualizações por vez. Alternativamente, para usuários mais avançados, os grupos podem ser implantados no modo multi-primary, onde todos os servers podem aceitar atualizações, mesmo que sejam emitidas concorrentemente.

Existe um serviço de associação de grupo integrado que mantém a visualização do grupo consistente e disponível para todos os servers em qualquer momento. Servers podem sair e entrar no grupo e a visualização é atualizada correspondentemente. Às vezes, servers podem sair do grupo inesperadamente, caso em que o mecanismo de detecção de falhas detecta isso e notifica o grupo de que a visualização mudou. Isso é totalmente automático.

O capítulo está estruturado da seguinte forma:

* Seção 17.1, “Histórico do Group Replication” fornece uma introdução aos grupos e como o Group Replication funciona.

* Seção 17.2, “Primeiros Passos” explica como configurar múltiplas instâncias do MySQL Server para criar um grupo.

* Seção 17.3, “Requisitos e Limitações” explica a arquitetura, os requisitos de setup e as limitações para o Group Replication.

* Seção 17.4, “Monitoramento do Group Replication” explica como monitorar um grupo.

* Seção 17.5, “Operações do Group Replication” explica como trabalhar com um grupo.

* Seção 17.6, “Segurança do Group Replication” explica como proteger um grupo.

* Atualizando Group Replication explica como atualizar um grupo.

* Seção 17.7, “Variáveis do Group Replication” é uma referência para as variáveis de sistema específicas do Group Replication.

* Seção 17.8, “Perguntas Frequentes” fornece respostas para algumas perguntas técnicas sobre a implantação e operação do Group Replication.

* Seção 17.9, “Detalhes Técnicos do Group Replication” fornece informações detalhadas sobre como o Group Replication funciona.