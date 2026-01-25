# Capítulo 17 Group Replication

**Índice**

[17.1 Histórico do Group Replication](group-replication-background.html) :   [17.1.1 Tecnologias de Replication](group-replication-replication-technologies.html)

    [17.1.2 Casos de Uso do Group Replication](group-replication-use-cases.html)

    [17.1.3 Detalhes do Group Replication](group-replication-details.html)

[17.2 Primeiros Passos](group-replication-getting-started.html) :   [17.2.1 Implantando Group Replication no Modo Single-Primary](group-replication-deploying-in-single-primary-mode.html)

    [17.2.2 Implantando Group Replication Localmente](group-replication-deploying-locally.html)

[17.3 Requisitos e Limitações](group-replication-requirements-and-limitations.html) :   [17.3.1 Requisitos do Group Replication](group-replication-requirements.html)

    [17.3.2 Limitações do Group Replication](group-replication-limitations.html)

[17.4 Monitoramento do Group Replication](group-replication-monitoring.html) :   [17.4.1 Estados do Server do Group Replication](group-replication-server-states.html)

    [17.4.2 A Tabela replication_group_members](group-replication-replication-group-members.html)

    [17.4.3 A Tabela replication_group_member_stats](group-replication-replication-group-member-stats.html)

[17.5 Operações do Group Replication](group-replication-operations.html) :   [17.5.1 Implantando nos Modos Multi-Primary ou Single-Primary](group-replication-deploying-in-multi-primary-or-single-primary-mode.html)

    [17.5.2 Ajustando o Recovery](group-replication-tuning-recovery.html)

    [17.5.3 Particionamento de Rede](group-replication-network-partitioning.html)

    [17.5.4 Reiniciando um Grupo](group-replication-restarting-group.html)

    [17.5.5 Usando MySQL Enterprise Backup com Group Replication](group-replication-enterprise-backup.html)

[17.6 Segurança do Group Replication](group-replication-security.html) :   [17.6.1 Permissões de Endereço IP (Allowlisting) do Group Replication](group-replication-ip-address-permissions.html)

    [17.6.2 Suporte a Secure Socket Layer (SSL) do Group Replication](group-replication-secure-socket-layer-support-ssl.html)

    [17.6.3 Group Replication e Virtual Private Networks (VPNs)](group-replication-virtual-private-networks-vpn.html)

[17.7 Variáveis do Group Replication](group-replication-options.html) :   [17.7.1 Variáveis de Sistema do Group Replication](group-replication-system-variables.html)

    [17.7.2 Variáveis de Status do Group Replication](group-replication-status-variables.html)

[17.8 Perguntas Frequentes](group-replication-frequently-asked-questions.html)

[17.9 Detalhes Técnicos do Group Replication](group-replication-technical-details.html) :   [17.9.1 Arquitetura do Plugin Group Replication](group-replication-plugin-architecture.html)

    [17.9.2 O Grupo](group-replication-the-group.html)

    [17.9.3 Declarações de Manipulação de Dados](group-replication-data-manipulation-statements.html)

    [17.9.4 Declarações de Definição de Dados](group-replication-data-definition-statements.html)

    [17.9.5 Recovery Distribuído](group-replication-distributed-recovery.html)

    [17.9.6 Observabilidade](group-replication-observability.html)

    [17.9.7 Performance do Group Replication](group-replication-performance.html)

Este capítulo explica o MySQL Group Replication e como instalar, configurar e monitorar grupos. O MySQL Group Replication é um plugin do MySQL Server que permite criar topologias de replication elásticas, de alta disponibilidade e tolerantes a falhas.

Grupos podem operar no modo single-primary com eleição automática do Primary, onde apenas um server aceita atualizações por vez. Alternativamente, para usuários mais avançados, os grupos podem ser implantados no modo multi-primary, onde todos os servers podem aceitar atualizações, mesmo que sejam emitidas concorrentemente.

Existe um serviço de associação de grupo integrado que mantém a visualização do grupo consistente e disponível para todos os servers em qualquer momento. Servers podem sair e entrar no grupo e a visualização é atualizada correspondentemente. Às vezes, servers podem sair do grupo inesperadamente, caso em que o mecanismo de detecção de falhas detecta isso e notifica o grupo de que a visualização mudou. Isso é totalmente automático.

O capítulo está estruturado da seguinte forma:

* [Seção 17.1, “Histórico do Group Replication”](group-replication-background.html "17.1 Group Replication Background") fornece uma introdução aos grupos e como o Group Replication funciona.

* [Seção 17.2, “Primeiros Passos”](group-replication-getting-started.html "17.2 Getting Started") explica como configurar múltiplas instâncias do MySQL Server para criar um grupo.

* [Seção 17.3, “Requisitos e Limitações”](group-replication-requirements-and-limitations.html "17.3 Requirements and Limitations") explica a arquitetura, os requisitos de setup e as limitações para o Group Replication.

* [Seção 17.4, “Monitoramento do Group Replication”](group-replication-monitoring.html "17.4 Monitoring Group Replication") explica como monitorar um grupo.

* [Seção 17.5, “Operações do Group Replication”](group-replication-operations.html "17.5 Group Replication Operations") explica como trabalhar com um grupo.

* [Seção 17.6, “Segurança do Group Replication”](group-replication-security.html "17.6 Group Replication Security") explica como proteger um grupo.

* [Atualizando Group Replication](/doc/refman/8.0/en/group-replication-upgrade.html) explica como atualizar um grupo.

* [Seção 17.7, “Variáveis do Group Replication”](group-replication-options.html "17.7 Group Replication Variables") é uma referência para as variáveis de sistema específicas do Group Replication.

* [Seção 17.8, “Perguntas Frequentes”](group-replication-frequently-asked-questions.html "17.8 Frequently Asked Questions") fornece respostas para algumas perguntas técnicas sobre a implantação e operação do Group Replication.

* [Seção 17.9, “Detalhes Técnicos do Group Replication”](group-replication-technical-details.html "17.9 Group Replication Technical Details") fornece informações detalhadas sobre como o Group Replication funciona.