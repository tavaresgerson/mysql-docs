## 13.1 Tipos de dados numéricos

13.1.1 Sintaxe do Tipo de Dados Numérico

13.1.2 Tipos de Inteiros (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT

13.1.3 Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC

13.1.4 Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE

13.1.5 Tipo de Valor de Bit - BIT

13.1.6 Atributos de Tipo Numérico

13.1.7 Gerenciamento de Saídas Fora do Alcance e Transbordamento

O MySQL suporta todos os tipos de dados numéricos padrão do SQL. Esses tipos incluem os tipos de dados numéricos exatos (`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `DECIMAL` - DECIMAL, NUMERIC"), e `NUMERIC` - DECIMAL, NUMERIC")), bem como os tipos de dados numéricos aproximados (`FLOAT` - FLOAT, DOUBLE"), `REAL` - FLOAT, DOUBLE"), e `DOUBLE PRECISION` - FLOAT, DOUBLE")). A palavra-chave `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") é um sinônimo de `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), e as palavras-chave `DEC` - DECIMAL, NUMERIC") e `FIXED` - DECIMAL, NUMERIC") são sinônimos de `DECIMAL` - DECIMAL, NUMERIC"). O MySQL trata `DOUBLE` - FLOAT, DOUBLE") como um sinônimo de `DOUBLE PRECISION` - FLOAT, DOUBLE") (uma extensão não padrão). O MySQL também trata `REAL` - FLOAT, DOUBLE") como um sinônimo de `DOUBLE PRECISION` - FLOAT, DOUBLE") (uma variação não padrão), a menos que o modo SQL `REAL_AS_FLOAT` esteja habilitado.

O tipo de dados `BIT` armazena valores de bits e é suportado para as tabelas `MyISAM`, `MEMORY`, `InnoDB` e `NDB`.

Para obter informações sobre como o MySQL lida com a atribuição de valores fora do intervalo a colunas e com o excesso durante a avaliação de expressões, consulte a Seção 13.1.7, “Tratamento de Excesso e Fora do Intervalo”.

Para obter informações sobre os requisitos de armazenamento dos tipos de dados numéricos, consulte a Seção 13.7, “Requisitos de Armazenamento de Tipos de Dados”.

Para descrições das funções que operam em valores numéricos, consulte a Seção 14.6, “Funções e Operadores Numéricos”. O tipo de dados utilizado para o resultado de um cálculo em operandos numéricos depende dos tipos dos operandos e das operações realizadas sobre eles. Para mais informações, consulte a Seção 14.6.1, “Operadores Aritméticos”.
