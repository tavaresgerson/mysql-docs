# Capítulo 17 Replicação em grupo

Este capítulo explica o MySQL Group Replication e como instalar, configurar e monitorar grupos. O MySQL Group Replication é um plugin do MySQL Server que permite criar topologias de replicação elásticas, altamente disponíveis e tolerantes a falhas.

Os grupos podem operar no modo primário único com eleição primária automática, onde apenas um servidor aceita atualizações de cada vez. Como alternativa, para usuários mais avançados, os grupos podem ser implantados no modo multi-primário, onde todos os servidores podem aceitar atualizações, mesmo que sejam emitidas simultaneamente.

Existe um serviço de associação de grupo integrado que mantém a visão do grupo consistente e disponível para todos os servidores em qualquer momento. Os servidores podem sair e ingressar no grupo e a visão é atualizada conforme necessário. Às vezes, os servidores podem sair do grupo inesperadamente, e, nesse caso, o mecanismo de detecção de falha detecta isso e notifica o grupo de que a visão foi alterada. Tudo isso é automático.

O capítulo é estruturado da seguinte forma:

* A Seção 17.1, “Contexto de Replicação de Grupo”, fornece uma introdução sobre grupos e como a Replicação de Grupo funciona.

* A Seção 17.2, “Começando”, explica como configurar várias instâncias do MySQL Server para criar um grupo.

* A seção 17.3, “Requisitos e Limitações”, explica os requisitos e limitações de arquitetura e configuração para a Replicação em Grupo.

* Seção 17.4, “Replicação do Grupo de Monitoramento”, explica como monitorar um grupo.

* A seção 17.5, “Operações de Replicação em Grupo”, explica como trabalhar com um grupo.

* A Seção 17.6, “Segurança da Replicação em Grupo”, explica como proteger um grupo.

* Atualizando a Replicação em Grupo explica como atualizar um grupo.

* A Seção 17.7, “Variáveis de Replicação de Grupo”, é uma referência para as variáveis do sistema específicas para a Replicação de Grupo.

* A seção 17.8, “Perguntas Frequentes”, fornece respostas para algumas perguntas técnicas sobre a implantação e operação da Replicação de Grupo.

* A Seção 17.9, “Detalhes técnicos da replicação em grupo”, fornece informações detalhadas sobre como a replicação em grupo funciona.