# Capítulo 16 Dicionário de Dados MySQL

**Índice**

16.1 Esquema do Dicionário de Dados

16.2 Remoção do Armazenamento de Metadados Baseados em Arquivos

16.3 Armazenamento Transacional de Dados do Dicionário

16.4 Cache de Objetos do Dicionário

16.5 Integração do esquema de informações e do dicionário de dados

16.6 Informações do dicionário serializado (SDI)

16.7 Diferenças no uso do dicionário de dados

16.8 Limitações do Dicionário de Dados

O MySQL Server incorpora um dicionário de dados transacional que armazena informações sobre objetos de banco de dados. Em versões anteriores do MySQL, os dados do dicionário eram armazenados em arquivos de metadados, tabelas não transacionais e dicionários de dados específicos do mecanismo de armazenamento.

Este capítulo descreve as principais características, benefícios, diferenças de uso e limitações do dicionário de dados. Para outras implicações da funcionalidade do dicionário de dados, consulte a seção "Notas do Dicionário de Dados" nas Notas de Lançamento do MySQL 8.0.

Os benefícios do dicionário de dados do MySQL incluem:

- Simplicidade de um esquema de dicionário de dados centralizado que armazena uniformemente os dados do dicionário. Veja a Seção 16.1, “Esquema do Dicionário de Dados”.

- Remoção do armazenamento de metadados baseados em arquivos. Consulte a Seção 16.2, “Remoção do Armazenamento de Metadados Baseados em Arquivos”.

- Armazenamento seguro em transação dos dados do dicionário. Consulte a Seção 16.3, “Armazenamento em Transação dos Dados do Dicionário”.

- Cache uniforme e centralizado para objetos de dicionário. Veja a Seção 16.4, “Cache de Objetos de Dicionário”.

- Uma implementação mais simples e aprimorada para algumas tabelas `INFORMATION_SCHEMA`. Veja a Seção 16.5, “Integração do INFORMATION\_SCHEMA e do Dicionário de Dados”.

- DDL atômico. Consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômicos”.

Importante

Um servidor com um dicionário de dados implica algumas diferenças operacionais gerais em comparação com um servidor que não possui um dicionário de dados; veja a Seção 16.7, “Diferenças no Uso do Dicionário de Dados”. Além disso, para atualizações para o MySQL 8.0, o procedimento de atualização difere um pouco das versões anteriores do MySQL e exige que você verifique a prontidão da atualização de sua instalação, verificando os pré-requisitos específicos. Para mais informações, consulte o Capítulo 3, *Atualizando o MySQL*, particularmente a Seção 3.6, “Preparando Sua Instalação para Atualização”.
