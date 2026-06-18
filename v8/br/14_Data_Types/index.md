# Capítulo 13 Tipos de dados

**Índice**

13.1 Tipos de dados numéricos:   13.1.1 Sintaxe do tipo de dados numérico

```
13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT

13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC

13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE

13.1.5 Bit-Value Type - BIT

13.1.6 Numeric Type Attributes

13.1.7 Out-of-Range and Overflow Handling
```

13.2 Tipos de dados de data e hora:   13.2.1 Sintaxe do tipo de dados de data e hora

```
13.2.2 The DATE, DATETIME, and TIMESTAMP Types

13.2.3 The TIME Type

13.2.4 The YEAR Type

13.2.5 Automatic Initialization and Updating for TIMESTAMP and DATETIME

13.2.6 Fractional Seconds in Time Values

13.2.7 What Calendar Is Used By MySQL?

13.2.8 Conversion Between Date and Time Types

13.2.9 2-Digit Years in Dates
```

13.3 Tipos de dados de string:   13.3.1 Sintaxe do tipo de dados de string

```
13.3.2 The CHAR and VARCHAR Types

13.3.3 The BINARY and VARBINARY Types

13.3.4 The BLOB and TEXT Types

13.3.5 The ENUM Type

13.3.6 The SET Type
```

13.4 Tipos de Dados Espaciais:   13.4.1 Tipos de Dados Espaciais

```
13.4.2 The OpenGIS Geometry Model

13.4.3 Supported Spatial Data Formats

13.4.4 Geometry Well-Formedness and Validity

13.4.5 Spatial Reference System Support

13.4.6 Creating Spatial Columns

13.4.7 Populating Spatial Columns

13.4.8 Fetching Spatial Data

13.4.9 Optimizing Spatial Analysis

13.4.10 Creating Spatial Indexes

13.4.11 Using Spatial Indexes
```

13.5 Tipo de Dados JSON

13.6 Valores padrão do tipo de dados

13.7 Requisitos de armazenamento de tipo de dados

13.8 Escolhendo o Tipo Certo para uma Coluna

13.9 Uso de Tipos de Dados de Outros Motores de Banco de Dados

O MySQL suporta tipos de dados SQL em várias categorias: tipos numéricos, tipos de data e hora, tipos de string (caractere e byte), tipos espaciais e o tipo de dados `JSON`. Este capítulo fornece uma visão geral e uma descrição mais detalhada das propriedades dos tipos em cada categoria, além de um resumo dos requisitos de armazenamento do tipo de dados. As visões gerais iniciais são intencionalmente breves. Consulte as descrições mais detalhadas para obter informações adicionais sobre tipos de dados específicos, como os formatos permitidos nos quais você pode especificar valores.

As descrições dos tipos de dados utilizam essas convenções:

- Para os tipos inteiros, `M` indica a largura máxima de exibição. Para os tipos de ponto flutuante e ponto fixo, `M` é o número total de dígitos que podem ser armazenados (a precisão). Para os tipos de string, `M` é o comprimento máximo. O valor máximo permitido de `M` depende do tipo de dado.

- `D` aplica-se aos tipos de ponto flutuante e ponto fixo e indica o número de dígitos após o ponto decimal (a escala). O valor máximo possível é 30, mas não deve ser maior que `M`−2.

- `fsp` se aplica aos tipos `TIME`, `DATETIME` e `TIMESTAMP` e representa a precisão de frações de segundo; ou seja, o número de dígitos após o ponto decimal para partes fracionárias de segundos. O valor `fsp`, se fornecido, deve estar no intervalo de 0 a 6. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0. (Isso difere do padrão padrão do SQL de 6, para compatibilidade com versões anteriores do MySQL.)

- Os colchetes retos (`[` e `]`) indicam partes opcionais das definições de tipo.
