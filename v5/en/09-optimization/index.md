# Capítulo 8 Otimização

**Sumário**

8.1 Visão Geral da Otimização

8.2 Otimizando Declarações SQL : 8.2.1 Otimizando Declarações SELECT

    8.2.2 Otimizando Subqueries, Derived Tables e Referências de View

    8.2.3 Otimizando Queries INFORMATION_SCHEMA

    8.2.4 Otimizando Declarações de Mudança de Dados

    8.2.5 Otimizando Privilégios de Database

    8.2.6 Outras Dicas de Otimização

8.3 Otimização e Indexes : 8.3.1 Como o MySQL Usa Indexes

    8.3.2 Otimização de Primary Key

    8.3.3 Otimização de Foreign Key

    8.3.4 Indexes de Coluna

    8.3.5 Indexes de Múltiplas Colunas

    8.3.6 Verificando o Uso de Index

    8.3.7 Coleta de Estatísticas de Index no InnoDB e MyISAM

    8.3.8 Comparação de Indexes B-Tree e Hash

    8.3.9 Uso de Extensões de Index

    8.3.10 Uso de Indexes de Coluna Gerada pelo Otimizador

    8.3.11 Buscas Indexadas a partir de Colunas TIMESTAMP

8.4 Otimizando a Estrutura do Database : 8.4.1 Otimizando o Tamanho dos Dados

    8.4.2 Otimizando Data Types do MySQL

    8.4.3 Otimizando para Muitas Tabelas

    8.4.4 Uso de Tabela Temporária Interna no MySQL

    8.4.5 Limites no Número de Databases e Tabelas

    8.4.6 Limites no Tamanho da Tabela

    8.4.7 Limites na Contagem de Colunas da Tabela e Tamanho da Linha

8.5 Otimizando para Tabelas InnoDB : 8.5.1 Otimizando o Layout de Armazenamento para Tabelas InnoDB

    8.5.2 Otimizando o Gerenciamento de Transação do InnoDB

    8.5.3 Otimizando Transações Somente Leitura do InnoDB

    8.5.4 Otimizando o Redo Logging do InnoDB

    8.5.5 Carregamento de Dados em Massa para Tabelas InnoDB

    8.5.6 Otimizando Queries InnoDB

    8.5.7 Otimizando Operações DDL do InnoDB

    8.5.8 Otimizando I/O de Disco do InnoDB

    8.5.9 Otimizando Variáveis de Configuração do InnoDB

    8.5.10 Otimizando o InnoDB para Sistemas com Muitas Tabelas

8.6 Otimizando para Tabelas MyISAM : 8.6.1 Otimizando Queries MyISAM

    8.6.2 Carregamento de Dados em Massa para Tabelas MyISAM

    8.6.3 Otimizando Declarações REPAIR TABLE

8.7 Otimizando para Tabelas MEMORY

8.8 Entendendo o Plano de Execução de Query : 8.8.1 Otimizando Queries com EXPLAIN

    8.8.2 Formato de Saída EXPLAIN

    8.8.3 Formato de Saída EXPLAIN Estendido

    8.8.4 Obtendo Informações do Plano de Execução para uma Conexão Nomeada

    8.8.5 Estimando a Performance de Query

8.9 Controlando o Otimizador de Query : 8.9.1 Controlando a Avaliação do Plano de Query

    8.9.2 Otimizações Chaveáveis

    8.9.3 Hints do Otimizador

    8.9.4 Hints de Index

    8.9.5 O Modelo de Custo do Otimizador

8.10 Buffering e Caching : 8.10.1 Otimização do Buffer Pool do InnoDB

    8.10.2 O Key Cache do MyISAM

    8.10.3 O Query Cache do MySQL

    8.10.4 Caching de Prepared Statements e Stored Programs

8.11 Otimizando Operações de Locking : 8.11.1 Métodos de Locking Internos

    8.11.2 Problemas de Locking de Tabela

    8.11.3 Inserts Concorrentes

    8.11.4 Metadata Locking

    8.11.5 Locking Externo

8.12 Otimizando o Servidor MySQL : 8.12.1 Fatores do Sistema

    8.12.2 Otimizando I/O de Disco

    8.12.3 Usando Links Simbólicos

    8.12.4 Otimizando o Uso de Memória

8.13 Medindo Performance (Benchmarking) : 8.13.1 Medindo a Velocidade de Expressões e Funções

    8.13.2 Usando Seus Próprios Benchmarks

    8.13.3 Medindo Performance com performance_schema

8.14 Examinando Informações de Thread (Processo) do Servidor : 8.14.1 Acessando a Lista de Processos

    8.14.2 Valores de Comando de Thread

    8.14.3 Estados Gerais de Thread

    8.14.4 Estados de Thread do Query Cache

    8.14.5 Estados de Thread Fonte de Replicação

    8.14.6 Estados de Thread I/O de Réplica de Replicação

    8.14.7 Estados de Thread SQL de Réplica de Replicação

    8.14.8 Estados de Thread de Conexão de Réplica de Replicação

    8.14.9 Estados de Thread NDB Cluster

    8.14.10 Estados de Thread do Event Scheduler

8.15 Rastreando o Otimizador : 8.15.1 Uso Típico

    8.15.2 Variáveis do Sistema que Controlam o Rastreamento

    8.15.3 Declarações Rastreáveis

    8.15.4 Ajustando a Limpeza de Rastreamento

    8.15.5 Rastreando o Uso de Memória

    8.15.6 Verificação de Privilégios

    8.15.7 Interação com a Opção --debug

    8.15.8 A Variável de Sistema optimizer_trace

    8.15.9 A Variável de Sistema end_markers_in_json

    8.15.10 Selecionando Recursos do Otimizador para Rastrear

    8.15.11 Estrutura Geral de Rastreamento

    8.15.12 Exemplo

    8.15.13 Exibindo Rastreamentos em Outras Aplicações

    8.15.14 Prevenindo o Uso de Optimizer Trace

    8.15.15 Testando o Optimizer Trace

    8.15.16 Implementação do Optimizer Trace

Este capítulo explica como otimizar a performance do MySQL e fornece exemplos. A otimização envolve a configuração, o ajuste fino (tuning) e a medição da performance em vários níveis. Dependendo do seu papel (desenvolvedor, DBA, ou uma combinação de ambos), você pode otimizar no nível de Declarações SQL individuais, aplicações inteiras, um único servidor de Database, ou múltiplos servidores de Database em rede. Às vezes, você pode ser proativo e planejar a performance com antecedência, enquanto outras vezes você pode ter que solucionar um problema de configuração ou código após a ocorrência de uma falha. A otimização do uso da CPU e da memória também pode melhorar a escalabilidade, permitindo que o Database lide com mais carga sem lentidão.