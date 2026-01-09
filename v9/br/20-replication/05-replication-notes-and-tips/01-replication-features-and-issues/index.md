### 19.5.1 Funções e Problemas de Replicação

19.5.1.1 Replicação e AUTO_INCREMENT

19.5.1.2 Replicação e Tabelas BLACKHOLE

19.5.1.3 Replicação e Conjuntos de Caracteres

19.5.1.4 Replicação e CHECKSUM TABLE

19.5.1.5 Replicação de CREATE SERVER, ALTER SERVER e DROP SERVER

19.5.1.6 Replicação de Declarações CREATE ... IF NOT EXISTS

19.5.1.7 Replicação de Declarações CREATE TABLE ... SELECT

19.5.1.8 Replicação de CURRENT_USER()

19.5.1.9 Replicação com Definições de Tabelas Diferentes na Fonte e na Replicação

19.5.1.10 Replicação e Opções de Tabelas DIRECTORY

19.5.1.11 Replicação de Declarações DROP ... IF EXISTS

19.5.1.12 Replicação e Valores de Ponto Flutuante

19.5.1.13 Replicação e FLUSH

19.5.1.14 Replicação e Funções do Sistema

19.5.1.15 Replicação e Suporte a Segundos Fracionários

19.5.1.16 Replicação de Recursos Invocáveis

19.5.1.17 Replicação de Documentos JSON

19.5.1.18 Replicação e Programas Armazenados em JavaScript

19.5.1.19 Replicação e LIMIT

19.5.1.20 Replicação e LOAD DATA

19.5.1.21 Replicação e max_allowed_packet

19.5.1.22 Replicação e Tabelas de MEMÓRIA

19.5.1.23 Replicação do Esquema do Sistema mysql

19.5.1.24 Replicação e Otimizador de Consultas

19.5.1.25 Replicação e Partição

19.5.1.26 Replicação e REPAIR TABLE

19.5.1.27 Replicação e Palavras Reservadas

19.5.1.28 Replicação e Pesquisas de Linhas

19.5.1.29 Replicação e Parada do Servidor ou da Fonte

19.5.1.30 Erros de Replicação Durante a Replicação

19.5.1.31 Replicação e Modo SQL do Servidor

19.5.1.32 Replicação e Tabelas Temporárias

19.5.1.33 Tentativas de Replicação e Timeout

19.5.1.34 Replicação e Fuso Horário

19.5.1.35 Replicação e Inconsistências de Transações

19.5.1.36 Replicação e Transações

19.5.1.37 Replicação e Triggers

19.5.1.38 Replicação e TRUNCATE TABLE

19.5.1.39 Replicação e Comprimento do Nome do Usuário

19.5.1.40 Replicação e Variáveis

As seções a seguir fornecem informações sobre o que é suportado e o que não é suportado na replicação do MySQL, além de problemas e situações específicas que podem ocorrer ao replicar certas instruções.

A replicação baseada em instruções depende da compatibilidade no nível SQL entre a fonte e a replica. Em outras palavras, a replicação baseada em instruções bem-sucedida requer que todas as funcionalidades SQL usadas sejam suportadas pelos servidores fonte e replica. Se você usar uma funcionalidade no servidor fonte que está disponível apenas na versão atual do MySQL, não poderá replicar para uma replica que usa uma versão anterior do MySQL. Tais incompatibilidades também podem ocorrer dentro de uma série de lançamentos, bem como entre versões.

Se você planeja usar a replicação baseada em instruções entre o MySQL 9.5 e uma série de lançamentos anteriores do MySQL, é uma boa ideia consultar a edição do *Manual de Referência do MySQL* correspondente à série de lançamentos anteriores para obter informações sobre as características de replicação dessa série.

Com a replicação baseada em instruções do MySQL, pode haver problemas para replicar rotinas armazenadas ou gatilhos. Você pode evitar esses problemas usando a replicação baseada em linhas do MySQL. Para uma lista detalhada dos problemas, consulte a Seção 27.9, “Registro de Binário de Programas Armazenados”. Para mais informações sobre o registro baseada em linhas e replicação baseada em linhas, consulte a Seção 7.4.4.1, “Formatos de Registro Binário”, e a Seção 19.2.1, “Formatos de Replicação”.

Para informações adicionais específicas sobre replicação e `InnoDB`, consulte a Seção 17.19, “Replicação InnoDB e MySQL”. Para informações relacionadas à replicação com o NDB Cluster, consulte a Seção 25.7, “Replicação do NDB Cluster”.