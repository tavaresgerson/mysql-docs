# Capítulo 17 O Motor de Armazenamento InnoDB

**Índice**

17.1 Introdução ao Motor de Armazenamento InnoDB :   17.1.1 Benefícios de Usar Tabelas InnoDB

    17.1.2 Melhores Práticas para Tabelas InnoDB

    17.1.3 Verificando se o InnoDB é o Motor de Armazenamento Padrão

    17.1.4 Testando e Benchmarkando com o InnoDB

17.2 InnoDB e o Modelo ACID

17.3 Multiversão do InnoDB

17.4 Arquitetura do InnoDB

17.5 Estruturas em Memória do InnoDB :   17.5.1 Pool de Armazenamento

    17.5.2 Armazenamento de Alterações

    17.5.3 Índice Hash Adaptativo

    17.5.4 Armazenamento de Log

17.6 Estruturas em Disco do InnoDB :   17.6.1 Tabelas

    17.6.2 Índices

    17.6.3 Espaços de Tabela

    17.6.4 Armazenamento de Redo

    17.6.5 Log de Refazer

    17.6.6 Logs de Refazer

17.7 Modelo de Acionamento e de Transação do InnoDB :   17.7.1 Acionamento do InnoDB

    17.7.2 Modelo de Transação do InnoDB

    17.7.3 Bloqueios Definidos por Diferentes Instruções SQL no InnoDB

    17.7.4 Linhas Fantoma

    17.7.5 Engarrafamentos no InnoDB

    17.7.6 Agendamento de Transações

17.8 Configuração do InnoDB :   17.8.1 Configuração de Inicialização do InnoDB

    17.8.2 Configurando o InnoDB para Operação Apenas de Leitura

    17.8.3 Configuração do Pool de Armazenamento do InnoDB

    17.8.4 Configurando a Concorrência de Filamentos para o InnoDB

    17.8.5 Configurando o Número de Filamentos de E/S do InnoDB em Segundo Plano

    17.8.6 Usando E/S Assíncrona no Linux

    17.8.7 Configurando a Capacidade de E/S do InnoDB

    17.8.8 Configurando a Pesquisa de Bloqueio Espiral

    17.8.9 Configuração de Purga

    17.8.10 Configurando Estatísticas do Otimizador para o InnoDB

    17.8.11 Configurando o Limite de Fusão para Páginas de Índices

    17.8.12 Detecção e Configuração de Contêineres

    17.8.13 Habilitando a Configuração Automática do InnoDB para um Servidor MySQL Dedicado

17.11 Gerenciamento de E/S e Espaço em Disco do InnoDB:   17.11.1 E/S em Disco do InnoDB

    17.11.2 Gerenciamento de Espaço em Disco

    17.11.3 Pontos de Controle do InnoDB

    17.11.4 Desfragmentação de uma Tabela

    17.11.5 Recuperação de Espaço em Disco com TRUNCATE TABLE

17.12 InnoDB e DDL Online:   17.12.1 Operações de DDL Online

    17.12.2 Desempenho e Concorrência do DDL Online

    17.12.3 Requisitos de Espaço do DDL Online

    17.12.4 Gerenciamento de Memória do DDL Online

    17.12.5 Configuração de Threads Paralelos para Operações de DDL Online

    17.12.6 Simplificação de Declarações de DDL com DDL Online

    17.12.7 Condições de Falha do DDL Online

    17.12.8 Limitações do DDL Online

17.13 Criptografia de Dados em Repouso do InnoDB

17.14 Opções de Inicialização e Variáveis de Sistema do InnoDB

17.15 Tabelas do Schema INFORMATION_SCHEMA do InnoDB:   17.15.1 Tabelas do Schema INFORMATION_SCHEMA do InnoDB sobre Compressão

    17.15.2 Informações de Transação e Bloqueio do InnoDB

    17.15.3 Tabelas de Objetos do Schema do InnoDB

    17.15.4 Tabelas de Índices FULLTEXT do InnoDB

    17.15.5 Tabelas do Buffer Pool do InnoDB

    17.15.6 Tabelas do InnoDB Metrics

    17.15.7 Tabela de Informações de Tabelas Temporárias do InnoDB

    17.15.8 Recuperação de Metadados do Espaço em Disco do InnoDB a partir do INFORMATION_SCHEMA.FILES

17.16 Integração do InnoDB com o Schema de Desempenho do MySQL:   17.16.1 Monitoramento do Progresso da ALTER TABLE para Tabelas do InnoDB Usando o Schema de Desempenho

    17.16.2 Monitoramento das Espera do InnoDB Mutex Usando o Schema de Desempenho

17.17 Monitores do InnoDB:   17.17.1 Tipos de Monitor do InnoDB

    17.17.2 Habilitando Monitores do InnoDB

    17.17.3 Saída do Monitor Padrão do InnoDB e do Monitor de Bloqueio

17.18 Backup e Recuperação do InnoDB:   17.18.1 Backup do InnoDB

    17.18.2 Recuperação do InnoDB

17.20 Solução de problemas do InnoDB:   17.20.1 Solução de problemas de E/S do InnoDB

    17.20.2 Solução de problemas de falhas de recuperação

    17.20.3 Forçar a recuperação do InnoDB

    17.20.4 Solução de problemas de operações do Dicionário de Dados do InnoDB

    17.20.5 Gerenciamento de erros do InnoDB

17.21 Limites do InnoDB

17.22 Restrições e limitações do InnoDB