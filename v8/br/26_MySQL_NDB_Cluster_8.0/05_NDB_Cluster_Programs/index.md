## 25.5 Programas de Agrupamento do BND

25.5.1 ndbd — O daemon do nó de dados do clúster NDB

25.5.2 ndbinfo\_select\_all — Selecionar de tabelas ndbinfo

25.5.3 ndbmtd — O daemon do nó de dados do cluster NDB (multi-threaded)

25.5.4 ndb\_mgmd — O daemon do servidor de gerenciamento de cluster NDB

25.5.5 ndb\_mgm — O cliente de gerenciamento de cluster NDB

25.5.6 ndb\_blob\_tool — Verificar e reparar colunas BLOB e TEXT de tabelas de NDB Cluster

25.5.7 ndb\_config — Extrair informações de configuração do NDB Cluster

25.5.8 ndb\_delete\_all — Excluir todas as linhas de uma tabela NDB

25.5.9 ndb\_desc — Descrever tabelas NDB

25.5.10 ndb\_drop\_index — Remover índice de uma tabela NDB

25.5.11 ndb\_drop\_table — Remover uma tabela NDB

25.5.12 ndb\_error\_reporter — Ferramenta de Relatório de Erros do NDB

25.5.13 ndb\_import — Importar dados CSV no NDB

25.5.14 ndb\_index\_stat — Ferramenta de estatísticas do índice NDB

25.5.15 ndb\_move\_data — Ferramenta de cópia de dados do NDB

25.5.16 ndb\_perror — Obter informações da mensagem de erro do NDB

25.5.17 ndb\_print\_backup\_file — Imprimir o conteúdo do arquivo de backup do NDB

25.5.18 ndb\_print\_file — Imprimir o conteúdo do arquivo de dados do disco NDB

25.5.19 ndb\_print\_frag\_file — Imprimir o conteúdo do arquivo de lista de fragmentos do NDB

25.5.20 ndb\_print\_schema\_file — Imprimir o conteúdo do arquivo de esquema do NDB

25.5.21 ndb\_print\_sys\_file — Imprimir o conteúdo do arquivo do sistema NDB

25.5.22 ndb\_redo\_log\_reader — Verificar e imprimir o conteúdo do log de refazer do cluster

25.5.23 ndb\_restore — Restaurar um backup de um cluster NDB

25.5.24 ndb\_secretsfile\_reader — Obter informações-chave de um arquivo de dados criptografado do NDB

25.5.25 ndb\_select\_all — Imprimir linhas de uma tabela NDB

25.5.26 ndb\_select\_count — Imprimir contagem de linhas para tabelas NDB

25.5.27 ndb\_show\_tables — Exibir a Lista de Tabelas NDB

25.5.28 ndb\_size.pl — Estimator de Requisitos de Tamanho do NDBCLUSTER

25.5.29 ndb\_top — Visualizar informações de uso da CPU para os threads do NDB

25.5.30 ndb\_waiter — Aguarde o NDB Cluster atingir um status específico

25.5.31 ndbxfrm — Comprimir, descomprimir, criptografar e descriptografar arquivos criados pelo NDB Cluster

Usar e gerenciar um NDB Cluster requer vários programas especializados, que descrevemos neste capítulo. Discutimos os propósitos desses programas em um NDB Cluster, como usar os programas e quais são as opções de inicialização disponíveis para cada um deles.

Esses programas incluem os processos de dados, gerenciamento e nó SQL do NDB Cluster (**ndbd**, **ndbmtd**"), **ndb\_mgmd** e **mysqld**) e o cliente de gerenciamento (**ndb\_mgm**).

Para obter informações sobre o uso do **mysqld** como processo do NDB Cluster, consulte a Seção 25.6.10, “Uso do MySQL Server para NDB Cluster”.

Outros programas de utilitários, diagnóstico e exemplos `NDB` estão incluídos na distribuição do NDB Cluster. Esses incluem **ndb\_restore**, **ndb\_show\_tables** e **ndb\_config**. Esses programas também são abordados nesta seção.
