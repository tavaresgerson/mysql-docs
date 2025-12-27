# Capítulo 10 Otimização

**Índice**

10.1 Visão Geral da Otimização

10.2 Otimização de Instruções SQL:   10.2.1 Otimização de Instruções SELECT

    10.2.2 Otimização de Subconsultas, Tabelas Derivadas, Referências de Visualizações e Expressões de Tabela Comum

    10.2.3 Otimização de Consultas do INFORMATION_SCHEMA

    10.2.4 Otimização de Consultas do Performance Schema

    10.2.5 Otimização de Declarações de Alteração de Dados

    10.2.6 Otimização de Privilegios de Banco de Dados

    10.2.7 Outras Dicas de Otimização

10.3 Otimização e Índices:   10.3.1 Como o MySQL Usa Índices

    10.3.2 Otimização de Chave Primária

    10.3.3 Otimização de Índices Espaciais

    10.3.4 Otimização de Chaves Estrangeiras

    10.3.5 Índices de Coluna

    10.3.6 Índices de Múltiplas Colunas

    10.3.7 Verificação do Uso de Índices

    10.3.8 Coleta de Estatísticas de Índices InnoDB e MyISAM

    10.3.9 Comparação de Índices B-Tree e Hash

    10.3.10 Uso de Extensões de Índices

    10.3.11 Uso do Otimizador de Índices de Coluna Gerada

    10.3.12 Índices Invisíveis

    10.3.13 Índices Decrescente

    10.3.14 Busca Indexada por Colunas TIMESTAMP

10.4 Otimização da Estrutura do Banco de Dados:   10.4.1 Otimização do Tamanho dos Dados

    10.4.2 Otimização dos Tipos de Dados do MySQL

    10.4.3 Otimização para Muitas Tabelas

    10.4.4 Uso de Tabelas Temporárias Internas no MySQL

    10.4.5 Limites para Número de Bancos de Dados e Tabelas

    10.4.6 Limites para Tamanho das Tabelas

    10.4.7 Limites para Número de Colunas da Tabela e Tamanho da Linha

10.5 Otimização para Tabelas InnoDB:   10.5.1 Otimização do Layout de Armazenamento para Tabelas InnoDB

    10.5.2 Otimização da Gestão de Transações InnoDB

    10.5.3 Otimização de Transações de Apenas Leitura InnoDB

    10.5.4 Otimização do Registro de Regra de Refazimento InnoDB

    10.5.5 Carregamento de Dados em Massa para Tabelas InnoDB

    10.5.6 Otimização de Consultas InnoDB

    10.5.7 Otimização de Operações de DDL InnoDB

10.5.8 Otimizando o I/O de Disco do InnoDB

    10.5.9 Otimizando as Variáveis de Configuração do InnoDB

    10.5.10 Otimizando o InnoDB para Sistemas com Muitas Tabelas

10.6 Otimizando para Tabelas MyISAM:   10.6.1 Otimizando Consultas MyISAM

    10.6.2 Carregamento de Dados em Massa para Tabelas MyISAM

    10.6.3 Otimizando as Instruções REPAIR TABLE

10.7 Otimizando para Tabelas de MEMÓRIA

10.8 Entendendo o Plano de Execução da Consulta:   10.8.1 Otimizando Consultas com EXPLAIN

    10.8.2 Formato de Saída do EXPLAIN

    10.8.3 Formato de Saída Extendido do EXPLAIN

    10.8.4 Obtendo Informações do Plano de Execução para uma Conexão Nomeada

    10.8.5 Estimativa do Desempenho da Consulta

10.9 Controlando o Otimizador de Consultas:   10.9.1 Controlando a Avaliação do Plano de Consulta

    10.9.2 Otimizações Alternativas

    10.9.3 Dicas do Otimizador

    10.9.4 Dicas de Índices

    10.9.5 O Modelo de Custo do Otimizador

    10.9.6 Estatísticas do Otimizador

10.10 Buffering e Caching:   10.10.1 Otimizando o Pool de Buffer do InnoDB

    10.10.2 O Cache de Chave MyISAM

    10.10.3 Caching de Declarações Preparadas e Programas Armazenados

10.11 Otimizando Operações de Acionamento de Bloqueio:   10.11.1 Métodos Internacionais de Acionamento de Bloqueio

    10.11.2 Problemas de Acionamento de Bloqueio de Tabelas

    10.11.3 Inserções Concorrentes

    10.11.4 Acionamento de Metadados

    10.11.5 Acionamento Externo

10.12 Otimizando o Servidor MySQL:   10.12.1 Otimizando o I/O de Disco

    10.12.2 Usando Links Simbólicos

    10.12.3 Otimizando o Uso de Memória

10.13 Medindo o Desempenho (Benchmarking):   10.13.1 Medindo a Velocidade de Expressões e Funções

    10.13.2 Usando Suas Próprias Benchmarking

    10.13.3 Medindo o Desempenho com performance\_schema

10.14 Examinando Informações de Fundo de Processo (Processo):   10.14.1 Acessando a Lista de Processos

    10.14.2 Valores de Comando do Fundo de Processo

    10.14.3 Estados Gerais do Fundo de Processo

    10.14.4 Estados de Fundo de Processo de Replicação

10.14.5 Estados de Filo de I/O de Replicação (Receptor)

    10.14.6 Estados de Filo de SQL de Replicação

    10.14.7 Estados de Filo de Conexão de Replicação

    10.14.8 Estados de Filo do NDB Cluster

    10.14.9 Estados de Filo do Agendamento de Eventos

10.15 Rastreamento do Otimizador:   10.15.1 Uso Típico

    10.15.2 Variáveis de Sistema que Controlam o Rastreamento

    10.15.3 Declarações Rastreamáveis

    10.15.4 Ajuste da Purga de Rastreamento

    10.15.5 Rastreamento do Uso de Memória

    10.15.6 Verificação de Privilegios

    10.15.7 Interação com a Opção --debug

    10.15.8 A Variável de Sistema optimizer\_trace

    10.15.9 A Variável de Sistema end\_markers\_in\_json

    10.15.10 Seleção de Recursos do Otimizador para Rastreamento

    10.15.11 Estrutura Geral do Rastreamento

    10.15.12 Exemplo

    10.15.13 Exibição de Rastreamentos em Outras Aplicações

    10.15.14 Prevenção do Uso do Rastreamento do Otimizador

    10.15.15 Testando o Rastreamento do Otimizador

    10.15.16 Implementação do Rastreamento do Otimizador

Este capítulo explica como otimizar o desempenho do MySQL e fornece exemplos. A otimização envolve a configuração, o ajuste e a medição do desempenho, em vários níveis. Dependendo do seu papel (desenvolvedor, DBA ou uma combinação dos dois), você pode otimizar no nível de declarações SQL individuais, de aplicações inteiras, de um único servidor de banco de dados ou de múltiplos servidores de banco de dados em rede. Às vezes, você pode ser proativo e planejar com antecedência para o desempenho, enquanto outras vezes você pode solucionar um problema de configuração ou código após o problema ocorrer. A otimização do uso da CPU e da memória também pode melhorar a escalabilidade, permitindo que o banco de dados lide com mais carga sem desacelerar.