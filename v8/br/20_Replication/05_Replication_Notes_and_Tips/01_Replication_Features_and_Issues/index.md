### 19.5.1 Recursos e problemas de replicação

19.5.1.1 Replicação e AUTO\_INCREMENT

19.5.1.2 Replicação e tabelas BLACKHOLE

19.5.1.3 Replicação e Conjuntos de Caracteres

19.5.1.4 Replicação e CHECKSUM TABLE

19.5.1.5 Replicação de CREATE SERVER, ALTER SERVER e DROP SERVER

19.5.1.6 Replicação de declarações CREATE ... IF NOT EXISTS

19.5.1.7 Replicação de declarações CREATE TABLE ... SELECT

19.5.1.8 Replicação de CURRENT\_USER()

19.5.1.9 Replicação com definições de tabela diferentes na fonte e na réplica

19.5.1.10 Replicação e Opções de Tabela de Diretório

19.5.1.11 Replicação de declarações DROP ... IF EXISTS

19.5.1.12 Replicação e valores de ponto flutuante

19.5.1.13 Replicação e FLUSH

19.5.1.14 Replicação e Funções do Sistema

19.5.1.15 Suporte à replicação e segundos fracionários

19.5.1.16 Replicação de recursos solicitados

19.5.1.17 Replicação de documentos JSON

19.5.1.18 Replicação e LIMITE

19.5.1.19 Replicação e CARREGAR DADOS

19.5.1.20 Replicação e max\_allowed\_packet

19.5.1.21 Replicação e tabelas de MEMÓRIA

19.5.1.22 Replicação do esquema do sistema MySQL

19.5.1.23 Replicação e o otimizador de consultas

19.5.1.24 Replicação e Partição

19.5.1.25 Replicação e REPARO DA TÁBLIA

19.5.1.26 Replicação e Palavras Reservadas

19.5.1.27 Replicação e Pesquisas de Linhas

19.5.1.28 Replicação e interrupções de fontes ou réplicas

19.5.1.29 Erros de replicação durante a replicação

19.5.1.30 Replicação e modo de servidor SQL

19.5.1.31 Replicação e tabelas temporárias

19.5.1.32 Tentativas de replicação e tempos de espera

19.5.1.33 Replicação e Fuso Horários

19.5.1.34 Inconsistências na Replicação e Transações

19.5.1.35 Replicação e Transações

19.5.1.36 Replicação e gatilhos

19.5.1.37 Replicação e TRUNCATE TABLE

19.5.1.38 Replicação e comprimento do nome do usuário

19.5.1.39 Replicação e Variáveis

19.5.1.40 Replicação e visualizações

As seções a seguir fornecem informações sobre o que é suportado e o que não é suportado na replicação do MySQL, além de problemas e situações específicas que podem ocorrer ao replicar determinadas instruções.

A replicação baseada em declarações depende da compatibilidade no nível SQL entre a fonte e a réplica. Em outras palavras, a replicação baseada em declarações bem-sucedida exige que quaisquer recursos SQL usados sejam suportados tanto pelo servidor fonte quanto pelo servidor réplica. Se você usar um recurso no servidor fonte que está disponível apenas na versão atual do MySQL, não poderá replicar para uma réplica que usa uma versão anterior do MySQL. Tais incompatibilidades também podem ocorrer dentro de uma série de lançamentos, bem como entre versões.

Se você planeja usar a replicação baseada em declarações entre o MySQL 8.0 e uma série anterior de lançamentos do MySQL, é uma boa ideia consultar a edição do *Manual de Referência do MySQL* correspondente à série de lançamentos anterior para obter informações sobre as características de replicação dessa série.

Com a replicação baseada em declarações do MySQL, pode haver problemas na replicação de rotinas ou gatilhos armazenados. Você pode evitar esses problemas usando a replicação baseada em linhas do MySQL. Para uma lista detalhada dos problemas, consulte a Seção 27.7, “Registro binário de programas armazenados”. Para mais informações sobre o registro baseada em linhas e replicação baseada em linhas, consulte a Seção 7.4.4.1, “Formatos de registro binário” e a Seção 19.2.1, “Formatos de replicação”.

Para informações adicionais específicas sobre replicação e `InnoDB`, consulte a Seção 17.19, “InnoDB e replicação do MySQL”. Para informações relacionadas à replicação com o NDB Cluster, consulte a Seção 25.7, “Replicação do NDB Cluster”.
