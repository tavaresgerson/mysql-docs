### 16.4.1 Recursos e problemas de replicação

16.4.1.1 Replicação e AUTO_INCREMENT

16.4.1.2 Replicação e tabelas BLACKHOLE

16.4.1.3 Replicação e Conjuntos de Caracteres

16.4.1.4 Replicação e TABELA CHECKSUM

16.4.1.5 Replicação de declarações CREATE ... IF NOT EXISTS

16.4.1.6 Replicação de declarações CREATE TABLE ... SELECT

16.4.1.7 Replicação de CREATE SERVER, ALTER SERVER e DROP SERVER

16.4.1.8 Replicação de CURRENT_USER()

16.4.1.9 Replicação de declarações DROP ... IF EXISTS

16.4.1.10 Replicação com definições de tabelas diferentes na fonte e na réplica

16.4.1.11 Opções de tabela de replicação e diretório

16.4.1.12 Replicação e valores de ponto flutuante

16.4.1.13 Suporte à replicação e segundos fracionários

16.4.1.14 Replicação e FLUSH

16.4.1.15 Replicação e funções do sistema

16.4.1.16 Replicação de Recursos Convidados

16.4.1.17 Replicação e LIMITE

16.4.1.18 Replicação e CARREGAR DADOS

16.4.1.19 Replicação e max_allowed_packet

16.4.1.2.20 Replicação e tabelas de MEMORY

16.4.1.21 Replicação do banco de dados do sistema MySQL

16.4.1.22 Replicação e o otimizador de consultas

16.4.1.23 Replicação e Partição

16.4.1.24 Replicação e REPARO DA TÁBLIA

16.4.1.25 Replicação e Palavras Reservadas

16.4.1.26 Replicação e Parada de Fonte ou Replicação

16.4.1.27 Erros de replicação durante a replicação

16.4.1.28 Modo de replicação e servidor SQL

16.4.1.29 Replicação e tabelas temporárias

16.4.1.30 Tentativas de replicação e tempos de espera

16.4.1.31 Replicação e Fuso Horários

16.4.1.32 Inconsistências na Replicação e Transações

16.4.1.33 Replicação e Transações

16.4.1.34 Replicação e gatilhos

16.4.1.35 Replicação e TRUNCATE TABLE

16.4.1.36 Replicação e comprimento do nome do usuário

16.4.1.37 Replicação e Variáveis

16.4.1.38 Replicação e visualizações

As seções a seguir fornecem informações sobre o que é suportado e o que não é suportado na replicação do MySQL, além de problemas e situações específicas que podem ocorrer ao replicar determinadas instruções.

A replicação baseada em declarações depende da compatibilidade no nível SQL entre a fonte e a réplica. Em outras palavras, a replicação baseada em declarações bem-sucedida exige que quaisquer recursos SQL usados sejam suportados tanto pelo servidor fonte quanto pelo servidor réplica. Se você usar um recurso no servidor fonte que está disponível apenas na versão atual do MySQL, não poderá replicar para uma réplica que usa uma versão anterior do MySQL. Tais incompatibilidades também podem ocorrer dentro de uma série de lançamentos, bem como entre versões.

Se você planeja usar a replicação baseada em declarações entre o MySQL 5.7 e uma série anterior de lançamentos do MySQL, é uma boa ideia consultar a edição do *Manual de Referência do MySQL* correspondente à série de lançamentos anterior para obter informações sobre as características de replicação dessa série.

Com a replicação baseada em declarações do MySQL, pode haver problemas na replicação de rotinas ou gatilhos armazenados. Você pode evitar esses problemas usando a replicação baseada em linhas do MySQL. Para uma lista detalhada dos problemas, consulte Seção 23.7, “Registro binário de programas armazenados”. Para mais informações sobre o registro baseada em linhas e replicação baseada em linhas, consulte Seção 5.4.4.1, “Formatos de registro binário” e Seção 16.2.1, “Formatos de replicação”.

Para informações adicionais específicas sobre replicação e `InnoDB`, consulte Seção 14.20, “Replicação InnoDB e MySQL”. Para informações relacionadas à replicação com NDB Cluster, consulte Seção 21.7, “Replicação NDB Cluster”.
