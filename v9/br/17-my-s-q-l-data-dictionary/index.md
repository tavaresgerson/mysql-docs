# Capítulo 16 Dicionário de Dados do MySQL

**Índice**

16.1 Esquema do Dicionário de Dados

16.2 Remoção do Armazenamento de Metadados Baseado em Arquivos

16.3 Armazenamento Transacional de Dados do Dicionário

16.4 Cache de Objetos do Dicionário

16.5 INFORMAÇÃO\_SCHEMA e Integração com o Dicionário de Dados

16.6 Informações Serializadas do Dicionário (SDI)

16.7 Diferenças de Uso do Dicionário de Dados

16.8 Limitações do Dicionário de Dados

O MySQL Server incorpora um dicionário de dados transacional que armazena informações sobre objetos de banco de dados. Em versões anteriores do MySQL, os dados do dicionário eram armazenados em arquivos de metadados, tabelas não transacionais e dicionários de dados específicos do mecanismo de armazenamento.

Este capítulo descreve as principais características, benefícios, diferenças de uso e limitações do dicionário de dados. Para outras implicações da funcionalidade do dicionário de dados, consulte a seção “Notas sobre o Dicionário de Dados” nas Notas de Lançamento do MySQL 9.5.

Os benefícios do dicionário de dados do MySQL incluem:

* Simplicidade de um esquema centralizado de dicionário de dados que armazena uniformemente os dados do dicionário. Veja a Seção 16.1, “Esquema do Dicionário de Dados”.

* Remoção do armazenamento de metadados baseado em arquivos. Veja a Seção 16.2, “Remoção do Armazenamento de Metadados Baseado em Arquivos”.

* Armazenamento transacional e seguro contra falhas de dados do dicionário. Veja a Seção 16.3, “Armazenamento Transacional de Dados do Dicionário”.

* Caching uniforme e centralizado para objetos do dicionário. Veja a Seção 16.4, “Cache de Objetos do Dicionário”.

* Uma implementação mais simples e aprimorada para algumas tabelas do `INFORMATION_SCHEMA`. Veja a Seção 16.5, “Integração do INFORMAÇÃO\_SCHEMA e do Dicionário de Dados”.

* DDL atômico. Veja a Seção 15.1.1, “Suporte para Declaração de Definição de Dados Atômica”.