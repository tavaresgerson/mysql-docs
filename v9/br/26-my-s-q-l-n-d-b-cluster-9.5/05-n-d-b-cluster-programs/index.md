## Programas de NDB Cluster

25.5.1 ndbd — O Daemon do Nó de Dados do NDB Cluster

25.5.2 ndbinfo\_select\_all — Selecionar de tabelas ndbinfo

25.5.3 ndbmtd — O Daemon do Nó de Dados do NDB Cluster (Multi-Thread)

25.5.4 ndb\_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster

25.5.5 ndb\_mgm — O Cliente de Gerenciamento do NDB Cluster

25.5.6 ndb\_blob\_tool — Verificar e Reparar Colunas BLOB e TEXT de Tabelas do NDB Cluster

25.5.7 ndb\_config — Extrair Informações de Configuração do NDB Cluster

25.5.8 ndb\_delete\_all — Deletar Todas as Linhas de uma Tabela NDB

25.5.9 ndb\_desc — Descrever Tabelas NDB

25.5.10 ndb\_drop\_index — Deletar Índice de uma Tabela NDB

25.5.11 ndb\_drop\_table — Deletar uma Tabela NDB

25.5.12 ndb\_error\_reporter — Ferramenta de Relatório de Erros NDB

25.5.13 ndb\_import — Importar Dados CSV em NDB

25.5.14 ndb\_index\_stat — Ferramenta de Estatísticas de Índices NDB

25.5.15 ndb\_move\_data — Ferramenta de Cópia de Dados NDB

25.5.16 ndb\_perror — Obter Informações da Mensagem de Erro NDB

25.5.17 ndb\_print\_backup\_file — Imprimir Conteúdo do Arquivo de Backup NDB

25.5.18 ndb\_print\_file — Imprimir Conteúdo do Arquivo de Dados do Disco NDB

25.5.19 ndb\_print\_frag\_file — Imprimir Conteúdo do Arquivo de Lista de Fragmentos NDB

25.5.20 ndb\_print\_schema\_file — Imprimir Conteúdo do Arquivo de Esquema NDB

25.5.21 ndb\_print\_sys\_file — Imprimir Conteúdo do Arquivo de Sistema NDB

25.5.22 ndb\_redo\_log\_reader — Verificar e Imprimir Conteúdo do Log de Refazer do NDB Cluster

25.5.23 ndb\_restore — Restaurar um Backup do NDB Cluster

25.5.24 ndb\_secretsfile\_reader — Obter Informações Chave de um Arquivo de Dados NDB Encriptado

25.5.25 ndb\_select\_all — Imprimir Linhas de uma Tabela NDB

25.5.26 ndb\_select\_count — Imprimir Contagem de Linhas para Tabelas NDB

25.5.27 ndb\_show\_tables — Exibir Lista de Tabelas NDB

25.5.28 ndb\_sign\_keys — Criar, Assinar e Gerenciar Chaves e Certificados TLS para o NDB Cluster

25.5.29 ndb\_size.pl — Estimador de Requisitos de Tamanho do NDBCLUSTER

25.5.30 ndb\_top — Visualizar informações de uso da CPU para os threads do NDB

25.5.31 ndb\_waiter — Aguardar que o NDB Cluster atinja um status específico

25.5.32 ndbxfrm — Comprimir, descomprimir, criptografar e descriptografar arquivos criados pelo NDB Cluster

Usar e gerenciar um NDB Cluster requer vários programas especializados, que descrevemos neste capítulo. Discutimos os propósitos desses programas em um NDB Cluster, como usar os programas e quais são as opções de inicialização disponíveis para cada um deles.

Esses programas incluem os processos de dados, gerenciamento e nó SQL do NDB Cluster (**ndbd**, **ndbmtd**"), **ndb\_mgmd** e **mysqld**) e o cliente de gerenciamento (**ndb\_mgm**).

Para informações sobre o uso do **mysqld** como um processo do NDB Cluster, consulte a Seção 25.6.10, “Uso do MySQL Server para NDB Cluster”.

Outros programas de utilitários, diagnóstico e exemplos do `NDB` estão incluídos na distribuição do NDB Cluster. Esses incluem **ndb\_restore**, **ndb\_show\_tables** e **ndb\_config**. Esses programas também são cobertos nesta seção.