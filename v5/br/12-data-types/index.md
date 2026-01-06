# Capítulo 11 Tipos de dados

**Índice**

11.1 Tipos de dados numéricos:   11.1.1 Sintaxe do tipo de dados numérico

```
11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT

11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC

11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE

11.1.5 Bit-Value Type - BIT

11.1.6 Numeric Type Attributes

11.1.7 Out-of-Range and Overflow Handling
```

11.2 Tipos de dados de data e hora:   11.2.1 Sintaxe do tipo de dados de data e hora

```
11.2.2 The DATE, DATETIME, and TIMESTAMP Types

11.2.3 The TIME Type

11.2.4 The YEAR Type

11.2.5 2-Digit YEAR(2) Limitations and Migrating to 4-Digit YEAR

11.2.6 Automatic Initialization and Updating for TIMESTAMP and DATETIME

11.2.7 Fractional Seconds in Time Values

11.2.8 What Calendar Is Used By MySQL?

11.2.9 Conversion Between Date and Time Types

11.2.10 2-Digit Years in Dates
```

11.3 Tipos de dados de string:   11.3.1 Sintaxe do tipo de dados de string

```
11.3.2 The CHAR and VARCHAR Types

11.3.3 The BINARY and VARBINARY Types

11.3.4 The BLOB and TEXT Types

11.3.5 The ENUM Type

11.3.6 The SET Type
```

11.4 Tipos de Dados Espaciais:   11.4.1 Tipos de Dados Espaciais

```
11.4.2 The OpenGIS Geometry Model

11.4.3 Supported Spatial Data Formats

11.4.4 Geometry Well-Formedness and Validity

11.4.5 Creating Spatial Columns

11.4.6 Populating Spatial Columns

11.4.7 Fetching Spatial Data

11.4.8 Optimizing Spatial Analysis

11.4.9 Creating Spatial Indexes

11.4.10 Using Spatial Indexes
```

11.5 O Tipo de Dados JSON

11.6 Valores padrão do tipo de dados

11.7 Requisitos de armazenamento de tipos de dados

11.8 Escolhendo o Tipo Certo para uma Coluna

11.9 Uso de Tipos de Dados de Outros Motores de Banco de Dados

O MySQL suporta tipos de dados SQL em várias categorias: tipos numéricos, tipos de data e hora, tipos de string (caractere e byte), tipos espaciais e o tipo de dados `JSON`. Este capítulo fornece uma visão geral e uma descrição mais detalhada das propriedades dos tipos em cada categoria, além de um resumo dos requisitos de armazenamento do tipo de dados. As visões gerais iniciais são intencionalmente breves. Consulte as descrições mais detalhadas para obter informações adicionais sobre tipos de dados específicos, como os formatos permitidos nos quais você pode especificar valores.

As descrições dos tipos de dados utilizam essas convenções:

- Para os tipos inteiros, *`M`* indica a largura máxima de exibição. Para os tipos de ponto flutuante e ponto fixo, *`M`* é o número total de dígitos que podem ser armazenados (a precisão). Para os tipos de string, *`M`* é o comprimento máximo. O valor máximo permitido de *`M`* depende do tipo de dado.

- O caractere `D` aplica-se aos tipos de ponto flutuante e ponto fixo e indica o número de dígitos após o ponto decimal (a escala). O valor máximo possível é 30, mas não deve ser maior que `M`−2.

- *`fsp`* se aplica aos tipos `TIME`, `DATETIME` e `TIMESTAMP` e representa a precisão de frações de segundo; ou seja, o número de dígitos após a vírgula para as partes fracionárias de segundos. O valor *`fsp`*, se fornecido, deve estar no intervalo de 0 a 6. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0. (Isso difere do padrão padrão do SQL de 6, para compatibilidade com versões anteriores do MySQL.)

- Os colchetes (`[` e `]`) indicam partes opcionais das definições de tipos.
