## Tipos de Dados Numéricos

O MySQL suporta todos os tipos de dados numéricos padrão do SQL. Esses tipos incluem os tipos de dados numéricos exatos (`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT", `DECIMAL` - DECIMAL, NUMERIC" e `NUMERIC` - DECIMAL, NUMERIC", bem como os tipos de dados numéricos aproximados (`FLOAT` - FLOAT, DOUBLE"), `REAL` - FLOAT, DOUBLE" e `DOUBLE PRECISION` - FLOAT, DOUBLE". A palavra-chave `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT" é sinônima de `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT", e as palavras-chave `DEC` - DECIMAL, NUMERIC" e `FIXED` - DECIMAL, NUMERIC" são sinônimas de `DECIMAL` - DECIMAL, NUMERIC". O MySQL trata `DOUBLE` - FLOAT, DOUBLE" como sinônimo de `DOUBLE PRECISION` - FLOAT, DOUBLE" (uma extensão não padrão). O MySQL também trata  `REAL` - FLOAT, DOUBLE" como sinônimo de  `DOUBLE PRECISION` - FLOAT, DOUBLE" (uma variação não padrão), a menos que o modo SQL `REAL_AS_FLOAT` esteja habilitado.

O tipo de dados `BIT` armazena valores de bits e é suportado para as tabelas `MyISAM`, `MEMORY`, `InnoDB` e `NDB`.

Para informações sobre como o MySQL lida com a atribuição de valores fora do intervalo para colunas e sobreposição durante a avaliação de expressões, consulte a Seção 13.1.7, “Tratamento de Valores Fora do Intervalo e Sobreposição”.

Para informações sobre os requisitos de armazenamento dos tipos de dados numéricos, consulte a Seção 13.7, “Requisitos de Armazenamento de Tipos de Dados”.

Para descrições de funções que operam em valores numéricos, consulte a Seção 14.6, “Funções e Operadores Numéricos”. O tipo de dados usado para o resultado de um cálculo em operandos numéricos depende dos tipos dos operandos e das operações realizadas neles. Para mais informações, consulte a Seção 14.6.1, “Operadores Aritméticos”.