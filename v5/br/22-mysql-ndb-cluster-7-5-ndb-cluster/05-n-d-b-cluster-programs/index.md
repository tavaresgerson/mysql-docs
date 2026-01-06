## 21.5 Programas de Agrupamento do BND

21.5.1 ndbd — O daemon do nó de dados do clúster NDB

21.5.2 ndbinfo\_select\_all — Selecionar de tabelas ndbinfo

21.5.3 ndbmtd — O Daemon de Nó de Dados do NDB Cluster (Multi-Thread)

21.5.4 ndb\_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster

21.5.5 ndb\_mgm — O cliente de gerenciamento de cluster NDB

21.5.6 ndb\_blob\_tool — Verificar e reparar colunas BLOB e TEXT de tabelas de NDB Cluster

21.5.7 ndb\_config — Extrair informações de configuração do NDB Cluster

21.5.8 ndb\_cpcd — Automatizar testes para o desenvolvimento do NDB

21.5.9 ndb\_delete\_all — Excluir todas as linhas de uma tabela NDB

21.5.10 ndb\_desc — Descreva as tabelas NDB

21.5.11 ndb\_drop\_index — Remover índice de uma tabela NDB

21.5.12 ndb\_drop\_table — Remover uma tabela NDB

21.5.13 ndb\_error\_reporter — Ferramenta de Relatório de Erros do NDB

21.5.14 ndb\_import — Importar dados CSV no NDB

21.5.15 ndb\_index\_stat — Ferramenta de estatísticas do índice NDB

21.5.16 ndb\_move\_data — Ferramenta de cópia de dados NDB

21.5.17 ndb\_perror — Obter informações da mensagem de erro do NDB

21.5.18 ndb\_print\_backup\_file — Imprimir conteúdo do arquivo de backup do NDB

21.5.19 ndb\_print\_file — Imprimir conteúdo do arquivo de dados do disco NDB

21.5.20 ndb\_print\_frag\_file — Imprimir o conteúdo do arquivo de lista de fragmentos do NDB

21.5.21 ndb\_print\_schema\_file — Imprimir o conteúdo do arquivo de esquema NDB

21.5.22 ndb\_print\_sys\_file — Imprimir conteúdos do arquivo do sistema NDB

21.5.23 ndb\_redo\_log\_reader — Verificar e imprimir o conteúdo do log de refazer do cluster

21.5.24 ndb\_restore — Restaurar um backup de um cluster NDB

21.5.25 ndb\_select\_all — Imprimir linhas de uma tabela NDB

21.5.26 ndb\_select\_count — Imprimir contagem de linhas para tabelas NDB

21.5.27 ndb\_show\_tables — Exibir Lista de Tabelas NDB

21.5.28 ndb\_size.pl — Estimator de Requisitos de Tamanho do NDBCLUSTER

21.5.29 ndb\_top — Ver informações de uso da CPU para threads NDB

21.5.30 ndb\_waiter — Aguarde o NDB Cluster atingir um status específico

Usar e gerenciar um NDB Cluster requer vários programas especializados, que descrevemos neste capítulo. Discutimos os propósitos desses programas em um NDB Cluster, como usar os programas e quais são as opções de inicialização disponíveis para cada um deles.

Esses programas incluem os processos de dados, gerenciamento e nó SQL do NDB Cluster (**ndbd**, **ndbmtd**, **ndb\_mgmd** e **mysqld**) e o cliente de gerenciamento (**ndb\_mgm**).

Para obter informações sobre o uso do **mysqld** como um processo do NDB Cluster, consulte Seção 21.6.10, “Uso do MySQL Server para NDB Cluster”.

Outros programas de utilidade, diagnóstico e exemplos do NDB Cluster estão incluídos na distribuição do NDB Cluster. Estes incluem **ndb\_restore**, **ndb\_show\_tables** e **ndb\_config**. Estes programas também estão cobertos nesta seção.

A parte final desta seção contém tabelas de opções que são comuns a todos os vários programas do NDB Cluster.
