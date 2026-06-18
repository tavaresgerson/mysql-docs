## 11.1 Tipos de Dados Numéricos

11.1.1 Sintaxe de Tipos de Dados Numéricos

11.1.2 Tipos Inteiros (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT

11.1.3 Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC

11.1.4 Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE

11.1.5 Tipo de Valor Bit - BIT

11.1.6 Atributos de Tipo Numérico

11.1.7 Tratamento de Valores Fora de Alcance e Overflow

O MySQL suporta todos os tipos de dados numéricos SQL padrão. Esses tipos incluem os tipos de dados numéricos exatos (`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `DECIMAL` - DECIMAL, NUMERIC"), e `NUMERIC` - DECIMAL, NUMERIC")), bem como os tipos de dados numéricos aproximados (`FLOAT` - FLOAT, DOUBLE"), `REAL` - FLOAT, DOUBLE"), e `DOUBLE PRECISION` - FLOAT, DOUBLE")). A palavra-chave `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") é um sinônimo para `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), e as palavras-chave `DEC` - DECIMAL, NUMERIC") e `FIXED` - DECIMAL, NUMERIC") são sinônimos para `DECIMAL` - DECIMAL, NUMERIC"). O MySQL trata `DOUBLE` - FLOAT, DOUBLE") como um sinônimo para `DOUBLE PRECISION` - FLOAT, DOUBLE") (uma extensão não padrão). O MySQL também trata `REAL` - FLOAT, DOUBLE") como um sinônimo para `DOUBLE PRECISION` - FLOAT, DOUBLE") (uma variação não padrão), a menos que o modo SQL `REAL_AS_FLOAT` esteja habilitado.

O tipo de dado `BIT` armazena valores bit e é suportado para tabelas `MyISAM`, `MEMORY`, `InnoDB` e `NDB`.

Para obter informações sobre como o MySQL lida com a atribuição de valores fora de alcance às colunas e com o *overflow* durante a avaliação de expressões, consulte a Seção 11.1.7, “Tratamento de Valores Fora de Alcance e Overflow”.

Para obter informações sobre os requisitos de armazenamento dos tipos de dados numéricos, consulte a Seção 11.7, “Requisitos de Armazenamento de Tipos de Dados”.

Para descrições de funções que operam em valores numéricos, consulte a Seção 12.6, “Funções e Operadores Numéricos”. O tipo de dado usado para o resultado de um cálculo em operandos numéricos depende dos tipos dos operandos e das operações realizadas neles. Para mais informações, consulte a Seção 12.6.1, “Operadores Aritméticos”.