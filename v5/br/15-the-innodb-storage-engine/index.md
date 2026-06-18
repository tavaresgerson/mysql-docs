# Capítulo 14 O Mecanismo de Armazenamento InnoDB

**Índice**

14.1 Introdução ao InnoDB:
    14.1.1 Benefícios de Usar Tabelas InnoDB
    14.1.2 Melhores Práticas para Tabelas InnoDB
    14.1.3 Verificando se o InnoDB é o Mecanismo de Armazenamento Padrão
    14.1.4 Testes e Benchmarking com InnoDB
    14.1.5 Desativando o InnoDB

14.2 InnoDB e o Modelo ACID

14.3 Multi-Versioning do InnoDB

14.4 Arquitetura do InnoDB

14.5 Estruturas em Memória do InnoDB:
    14.5.1 Buffer Pool
    14.5.2 Change Buffer
    14.5.3 Adaptive Hash Index
    14.5.4 Log Buffer

14.6 Estruturas em Disco do InnoDB:
    14.6.1 Tabelas
    14.6.2 Indexes
    14.6.3 Tablespaces
    14.6.4 Data Dictionary do InnoDB
    14.6.5 Doublewrite Buffer
    14.6.6 Redo Log
    14.6.7 Undo Logs

14.7 Bloqueio (Locking) e Modelo de Transaction do InnoDB:
    14.7.1 Locking do InnoDB
    14.7.2 Modelo de Transaction do InnoDB
    14.7.3 Locks Definidos por Diferentes Instruções SQL no InnoDB
    14.7.4 Phantom Rows
    14.7.5 Deadlocks no InnoDB

14.8 Configuração do InnoDB:
    14.8.1 Configuração de Inicialização do InnoDB
    14.8.2 Configurando o InnoDB para Operação Somente Leitura (Read-Only)
    14.8.3 Configuração do Buffer Pool do InnoDB
    14.8.4 Configurando o Alocador de Memória para o InnoDB
    14.8.5 Configurando a Concorrência de Thread para o InnoDB
    14.8.6 Configurando o Número de Threads de I/O de Background do InnoDB
    14.8.7 Usando I/O Assíncrono no Linux
    14.8.8 Configurando a Capacidade de I/O do InnoDB
    14.8.9 Configurando o Polling de Spin Lock
    14.8.10 Configuração de Purge
    14.8.11 Configurando Estatísticas do Optimizer para o InnoDB
    14.8.12 Configurando o Limite de Merge para Index Pages

14.9 Compressão de Tabela e Page do InnoDB:
    14.9.1 Compressão de Tabela do InnoDB
    14.9.2 Compressão de Page do InnoDB

14.10 Gerenciamento de Formato de Arquivo (File-Format) do InnoDB:
    14.10.1 Habilitando Formatos de Arquivo
    14.10.2 Verificando a Compatibilidade de Formato de Arquivo
    14.10.3 Identificando o Formato de Arquivo em Uso
    14.10.4 Modificando o Formato de Arquivo

14.11 Formatos de Linha (Row Formats) do InnoDB

14.12 I/O de Disco e Gerenciamento de Espaço de Arquivo do InnoDB:
    14.12.1 I/O de Disco do InnoDB
    14.12.2 Gerenciamento de Espaço de Arquivo
    14.12.3 Checkpoints do InnoDB
    14.12.4 Desfragmentando uma Tabela
    14.12.5 Recuperando Espaço em Disco com TRUNCATE TABLE

14.13 InnoDB e DDL Online:
    14.13.1 Operações de DDL Online
    14.13.2 Performance e Concorrência de DDL Online
    14.13.3 Requisitos de Espaço de DDL Online
    14.13.4 Simplificando Instruções DDL com DDL Online
    14.13.5 Condições de Falha de DDL Online
    14.13.6 Limitações de DDL Online

14.14 Criptografia de Dados em Repouso (Data-at-Rest) do InnoDB

14.15 Opções de Inicialização (Startup) e Variáveis de Sistema do InnoDB

14.16 Tabelas INFORMATION_SCHEMA do InnoDB:
    14.16.1 Tabelas INFORMATION_SCHEMA do InnoDB sobre Compressão
    14.16.2 Informações de Transaction e Locking nas Tabelas INFORMATION_SCHEMA do InnoDB
    14.16.3 Tabelas de Sistema INFORMATION_SCHEMA do InnoDB
    14.16.4 Tabelas de Index FULLTEXT INFORMATION_SCHEMA do InnoDB
    14.16.5 Tabelas do Buffer Pool INFORMATION_SCHEMA do InnoDB
    14.16.6 Tabela de Métricas INFORMATION_SCHEMA do InnoDB
    14.16.7 Tabela de Informações de Temporary Table INFORMATION_SCHEMA do InnoDB
    14.16.8 Recuperando Metadados de Tablespace do InnoDB a partir de INFORMATION_SCHEMA.FILES

14.17 Integração do InnoDB com o Performance Schema do MySQL:
    14.17.1 Monitorando o Progresso de ALTER TABLE para Tabelas InnoDB Usando o Performance Schema
    14.17.2 Monitorando Esperas de Mutex do InnoDB Usando o Performance Schema

14.18 Monitores do InnoDB:
    14.18.1 Tipos de Monitor do InnoDB
    14.18.2 Habilitando Monitores do InnoDB
    14.18.3 Saída do Monitor Padrão e do Lock Monitor do InnoDB

14.19 Backup e Recovery do InnoDB:
    14.19.1 Backup do InnoDB
    14.19.2 Recovery do InnoDB

14.20 InnoDB e Replicação do MySQL

14.21 Plugin memcached do InnoDB:
    14.21.1 Benefícios do Plugin memcached do InnoDB
    14.21.2 Arquitetura memcached do InnoDB
    14.21.3 Configurando o Plugin memcached do InnoDB
    14.21.4 Considerações de Segurança para o Plugin memcached do InnoDB
    14.21.5 Escrevendo Aplicações para o Plugin memcached do InnoDB
    14.21.6 O Plugin memcached do InnoDB e Replicação
    14.21.7 Detalhes Internos do Plugin memcached do InnoDB
    14.21.8 Solução de Problemas (Troubleshooting) do Plugin memcached do InnoDB

14.22 Solução de Problemas (Troubleshooting) do InnoDB:
    14.22.1 Solução de Problemas de I/O do InnoDB
    14.22.2 Forçando o Recovery do InnoDB
    14.22.3 Solução de Problemas de Operações do Data Dictionary do InnoDB
    14.22.4 Tratamento de Erros do InnoDB

14.23 Limites do InnoDB

14.24 Restrições e Limitações do InnoDB