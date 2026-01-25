## 16.1 Configurando Replication

[16.1.1 Visão Geral da Configuração de Replication Baseada em Posição de Arquivo de Binary Log](binlog-replication-configuration-overview.html)

[16.1.2 Configurando Replication Baseada em Posição de Arquivo de Binary Log](replication-howto.html)

[16.1.3 Replication com Global Transaction Identifiers](replication-gtids.html)

[16.1.4 Alterando Modos de Replication em Servidores Online](replication-mode-change-online.html)

[16.1.5 MySQL Multi-Source Replication](replication-multi-source.html)

[16.1.6 Opções e Variáveis de Replication e Binary Logging](replication-options.html)

[16.1.7 Tarefas Comuns de Administração de Replication](replication-administration.html)

Esta seção descreve como configurar os diferentes tipos de replication disponíveis no MySQL e inclui o setup e a configuração necessários para um ambiente de replication, incluindo instruções passo a passo para criar um novo ambiente de replication. Os principais componentes desta seção são:

* Para um guia sobre como configurar dois ou mais servidores para replication usando posições de arquivo de binary log, a [Seção 16.1.2, “Configurando Replication Baseada em Posição de Arquivo de Binary Log”](replication-howto.html "16.1.2 Configurando Replication Baseada em Posição de Arquivo de Binary Log"), trata da configuração dos servidores e fornece métodos para copiar dados entre o source e as replicas.

* Para um guia sobre como configurar dois ou mais servidores para replication usando transações GTID, a [Seção 16.1.3, “Replication com Global Transaction Identifiers”](replication-gtids.html "16.1.3 Replication com Global Transaction Identifiers"), trata da configuração dos servidores.

* Eventos no binary log são registrados usando vários formatos. Estes são referidos como statement-based replication (SBR) ou row-based replication (RBR). Um terceiro tipo, mixed-format replication (MIXED), usa replication SBR ou RBR automaticamente para aproveitar os benefícios de ambos os formatos SBR e RBR quando apropriado. Os diferentes formatos são discutidos na [Seção 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").

* Informações detalhadas sobre as diferentes opções de configuração e variáveis que se aplicam à replication são fornecidas na [Seção 16.1.6, “Opções e Variáveis de Replication e Binary Logging”](replication-options.html "16.1.6 Opções e Variáveis de Replication e Binary Logging").

* Uma vez iniciado, o processo de replication deve exigir pouca administração ou monitoramento. No entanto, para obter conselhos sobre tarefas comuns que você pode querer executar, consulte a [Seção 16.1.7, “Tarefas Comuns de Administração de Replication”](replication-administration.html "16.1.7 Tarefas Comuns de Administração de Replication").