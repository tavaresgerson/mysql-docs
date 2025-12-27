# Capítulo 25 MySQL NDB Cluster 9.5

**Índice**

25.1 Informações Gerais

25.2 Visão Geral do NDB Cluster:   25.2.1 Conceitos Básicos do NDB Cluster

    25.2.2 Nodos do NDB Cluster, Grupos de Nodos, Replicas de Fragmento e Partições

    25.2.3 Requisitos de Hardware, Software e Redes do NDB Cluster

    25.2.4 O que há de Novo no MySQL NDB Cluster 9.5

    25.2.5 Opções, Variáveis e Parâmetros Adicionados, Descontinuados ou Removidos no NDB 9.5

    25.2.6 O MySQL Server Usando InnoDB Comparado com o NDB Cluster

    25.2.7 Limitações Conhecidas do NDB Cluster

25.3 Instalação do NDB Cluster:   25.3.1 Instalação do NDB Cluster no Linux

    25.3.2 Instalação do NDB Cluster no Windows

    25.3.3 Configuração Inicial do NDB Cluster

    25.3.4 Inicialização do NDB Cluster

    25.3.5 Exemplo do NDB Cluster com Tabelas e Dados

    25.3.6 Desligamento e Reinício Seguros do NDB Cluster

    25.3.7 Atualização e Downgrade do NDB Cluster

25.4 Configuração do NDB Cluster:   25.4.1 Configuração Rápida do NDB Cluster

    25.4.2 Visão Geral dos Parâmetros, Opções e Variáveis de Configuração do NDB Cluster

    25.4.3 Arquivos de Configuração do NDB Cluster

    25.4.4 Uso de Interconexões de Alta Velocidade com o NDB Cluster

25.5 Programas do NDB Cluster:   25.5.1 ndbd — O Daemon do Nó de Dados do NDB Cluster

    25.5.2 ndbinfo\_select\_all — Selecionar de Tabelas ndbinfo

    25.5.3 ndbmtd — O Daemon do Nó de Dados do NDB Cluster (Multi-Thread)

    25.5.4 ndb\_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster

    25.5.5 ndb\_mgm — O Cliente de Gerenciamento do NDB Cluster

    25.5.6 ndb\_blob\_tool — Verificar e Reparar Colunas BLOB e TEXT das Tabelas do NDB Cluster

    25.5.7 ndb\_config — Extrair Informações de Configuração do NDB Cluster

    25.5.8 ndb\_delete\_all — Deletar Todas as Linhas de uma Tabela NDB

    25.5.9 ndb\_desc — Descrever Tabelas NDB

25.5.10 ndb\_drop\_index — Remover índice de uma tabela NDB

    25.5.11 ndb\_drop\_table — Remover uma tabela NDB

    25.5.12 ndb\_error\_reporter — Ferramenta de Relatório de Erros NDB

    25.5.13 ndb\_import — Importar dados CSV em NDB

    25.5.14 ndb\_index\_stat — Ferramenta de Estatísticas de Índices NDB

    25.5.15 ndb\_move\_data — Ferramenta de Cópia de Dados NDB

    25.5.16 ndb\_perror — Obter informações da mensagem de erro NDB

    25.5.17 ndb\_print\_backup\_file — Imprimir o conteúdo do arquivo de backup NDB

    25.5.18 ndb\_print\_file — Imprimir o conteúdo do arquivo de dados do disco NDB

    25.5.19 ndb\_print\_frag\_file — Imprimir o conteúdo do arquivo de lista de fragmentos NDB

    25.5.20 ndb\_print\_schema\_file — Imprimir o conteúdo do arquivo de esquema NDB

    25.5.21 ndb\_print\_sys\_file — Imprimir o conteúdo do arquivo de sistema NDB

    25.5.22 ndb\_redo\_log\_reader — Verificar e imprimir o conteúdo do log de refazimento de cluster

    25.5.23 ndb\_restore — Restaurar um backup de cluster NDB

    25.5.24 ndb\_secretsfile\_reader — Obter informações chave de um arquivo de dados NDB criptografado

    25.5.25 ndb\_select\_all — Imprimir linhas de uma tabela NDB

    25.5.26 ndb\_select\_count — Imprimir contagem de linhas para tabelas NDB

    25.5.27 ndb\_show\_tables — Exibir a lista de tabelas NDB

    25.5.28 ndb\_sign\_keys — Criar, assinar e gerenciar chaves e certificados TLS para o cluster NDB

    25.5.29 ndb\_size.pl — Estimador de Requisitos de Tamanho NDBCLUSTER

    25.5.30 ndb\_top — Visualizar informações de uso de CPU para threads NDB

    25.5.31 ndb\_waiter — Esperar que o cluster NDB atinja um determinado estado

    25.5.32 ndbxfrm — Comprimir, descomprimir, criptografar e descriptografar arquivos criados pelo cluster NDB

25.6.5 Realizando um Reinício Rotativo de um Clúster NDB

    25.6.6 Modo de Usuário Único do Clúster NDB

    25.6.7 Adicionando Nodos de Dados do Clúster NDB Online

    25.6.8 Backup Online do Clúster NDB

    25.6.9 Importando Dados no MySQL Cluster

    25.6.10 Uso do Servidor MySQL para o Clúster NDB

    25.6.11 Tabelas de Dados de Disco do Clúster NDB

    25.6.12 Operações Online com ALTER TABLE no Clúster NDB

    25.6.13 Sincronização de Privilegios e NDB\_STORED\_USER

    25.6.14 Contadores e Variáveis de Estatísticas da API NDB

    25.6.15 ndbinfo: O Banco de Dados de Informações do Clúster NDB

    25.6.16 Tabelas do Schema INFORMATION\_SCHEMA para o Clúster NDB

    25.6.17 Clúster NDB e o Schema Performance Schema

    25.6.18 Referência Rápida: Declarações SQL do Clúster NDB

    25.6.19 Segurança do Clúster NDB

25.7 Replicação do Clúster NDB:   25.7.1 Replicação do Clúster NDB: Abreviações e Símbolos

    25.7.2 Requisitos Gerais para a Replicação do Clúster NDB

    25.7.3 Problemas Conhecidos na Replicação do Clúster NDB

    25.7.4 Schema e Tabelas de Replicação do Clúster NDB

    25.7.5 Preparando o Clúster NDB para a Replicação

    25.7.6 Iniciando a Replicação do Clúster NDB (Canal de Replicação Único)

    25.7.7 Usando Dois Canais de Replicação para a Replicação do Clúster NDB

    25.7.8 Implementando o Failover com a Replicação do Clúster NDB

    25.7.9 Replicação do Clúster NDB com Backup do Clúster NDB

    25.7.10 Replicação do Clúster NDB: Replicação Bidirecional e Circular

    25.7.11 Replicação do Clúster NDB Usando o Aplicável Multithreaded

    25.7.12 Resolução de Conflitos de Replicação do Clúster NDB

Este capítulo fornece informações sobre o MySQL NDB Cluster, uma versão de alta disponibilidade e alta redundância do MySQL adaptada para o ambiente de computação distribuída, além de informações específicas para o NDB Cluster 8.4 (NDB 8.4.7), com base na versão 8.4 do motor de armazenamento NDB. Consulte a Seção 25.2.4, “O que há de novo no MySQL NDB Cluster 9.5”, para obter informações sobre as diferenças entre o NDB 8.4 e as versões anteriores. Consulte o MySQL NDB Cluster 8.0 para obter informações sobre o NDB Cluster 8.0. O NDB 8.0 e o NDB 8.4 são projetados para uso em ambientes de produção. O NDB Cluster 7.6 e 7.5 são versões GA anteriores ainda suportadas em produção, embora novas implantações possam e devam usar o NDB Cluster 8.0 ou 8.4 do MySQL. *As séries de versões NDB Cluster 7.4 e anteriores não são mais suportadas ou mantidas*.