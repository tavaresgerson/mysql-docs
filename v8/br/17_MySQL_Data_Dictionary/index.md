# Capítulo 16 Dicionário de Dados MySQL

O MySQL Server incorpora um dicionário de dados transacional que armazena informações sobre objetos de banco de dados. Em versões anteriores do MySQL, os dados do dicionário eram armazenados em arquivos de metadados, tabelas não transacionais e dicionários de dados específicos do mecanismo de armazenamento.

Este capítulo descreve as principais características, benefícios, diferenças de uso e limitações do dicionário de dados. Para outras implicações do recurso do dicionário de dados, consulte a seção “Notas sobre o Dicionário de Dados” no [Notas de lançamento do MySQL 8.0][(/doc/relnotes/mysql/8.0/en/)].

Os benefícios do dicionário de dados MySQL incluem:

* Simplicidade de um esquema de dicionário de dados centralizado que armazena uniformemente os dados do dicionário. Veja a Seção 16.1, “Esquema do Dicionário de Dados”.

* Remoção do armazenamento de metadados baseado em arquivos. Veja a Seção 16.2, “Remoção do armazenamento de metadados baseado em arquivos”.

* Armazenamento transacional e seguro em caso de falha dos dados do dicionário. Veja a Seção 16.3, “Armazenamento transacional dos dados do dicionário”.

* Armazenamento uniforme e centralizado para objetos de dicionário. Veja a Seção 16.4, “Cache de Objetos de Dicionário”.

* Uma implementação mais simples e melhorada para algumas tabelas de `INFORMATION_SCHEMA`. Veja a Seção 16.5, “Integração do INFORMATION_SCHEMA e do Dicionário de Dados”.

* DDL atômico. Veja a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômica”.

Importante

Um servidor com um dicionário de dados implica algumas diferenças operacionais gerais em comparação com um servidor que não possui um dicionário de dados; veja a Seção 16.7, “Diferenças na Utilização do Dicionário de Dados”. Além disso, para atualizações para o MySQL 8.0, o procedimento de atualização difere um pouco dos lançamentos anteriores do MySQL e exige que você verifique a prontidão da atualização de sua instalação, verificando os pré-requisitos específicos. Para mais informações, consulte o Capítulo 3, *Atualizando o MySQL*, particularmente a Seção 3.6, “Preparando sua Instalação para Atualização”.