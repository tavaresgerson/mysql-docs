## 13.1 Tipos de Dados Numéricos

13.1.1 Sintaxe dos Tipos de Dados Numéricos

13.1.2 Tipos Inteiros (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT

13.1.3 Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC

13.1.4 Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE

13.1.5 Tipo de Valor de Bit - BIT

13.1.6 Atributos dos Tipos Numéricos

13.1.7 Tratamento de Saída de Faixa e Sobrecarga

O MySQL suporta todos os tipos de dados numéricos padrão do SQL. Esses tipos incluem os tipos de dados numéricos exatos (`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `DECIMAL` - DECIMAL, NUMERIC"), e `NUMERIC` - DECIMAL, NUMERIC"), bem como os tipos de dados numéricos aproximados (`FLOAT` - FLOAT, DOUBLE"), `REAL` - FLOAT, DOUBLE"), e `DOUBLE PRECISION` - FLOAT, DOUBLE"). A palavra-chave `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") é sinônima de `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), e as palavras-chave `DEC` - DECIMAL, NUMERIC") e `FIXED` - DECIMAL, NUMERIC") são sinônimas de `DECIMAL` - DECIMAL, NUMERIC"). O MySQL trata `DOUBLE` - FLOAT, DOUBLE") como sinônimo de `DOUBLE PRECISION` - FLOAT, DOUBLE") (uma extensão não padrão). O MySQL também trata `REAL` - FLOAT, DOUBLE") como sinônimo de `DOUBLE PRECISION` - FLOAT, DOUBLE") (uma variação não padrão), a menos que o modo SQL `REAL_AS_FLOAT` esteja habilitado.

O tipo de dados `BIT` armazena valores de bit e é suportado para tabelas `MyISAM`, `MEMORY`, `InnoDB` e `NDB`.

Para obter informações sobre como o MySQL lida com a atribuição de valores fora da faixa para colunas e sobrecarga durante a avaliação de expressões, consulte a Seção 13.1.7, “Tratamento de Saída de Faixa e Sobrecarga”.

Para informações sobre os requisitos de armazenamento dos tipos de dados numéricos, consulte a Seção 13.7, “Requisitos de Armazenamento de Tipos de Dados”.

Para descrições das funções que operam em valores numéricos, consulte a Seção 14.6, “Funções e Operadores Numéricos”. O tipo de dados utilizado para o resultado de um cálculo em operandos numéricos depende dos tipos dos operandos e das operações realizadas sobre eles. Para mais informações, consulte a Seção 14.6.1, “Operadores Aritméticos”.