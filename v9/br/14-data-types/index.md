# Capítulo 13 Tipos de Dados

**Índice**

13.1 Tipos de Dados Numéricos:   13.1.1 Sintaxe do Tipo de Dados Numérico

    13.1.2 Tipos de Inteiros (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT

    13.1.3 Tipos de Ponto Fijo (Valor Exato) - DECIMAL, NUMERIC

    13.1.4 Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE

    13.1.5 Tipo de Valor de Bit - BIT

    13.1.6 Atributos dos Tipos de Dados Numéricos

    13.1.7 Gerenciamento de Saída de Faixa e Sobrecarga

13.2 Tipos de Dados de Data e Hora:   13.2.1 Sintaxe do Tipo de Dados de Data e Hora

    13.2.2 Os Tipos DATE, DATETIME e TIMESTAMP

    13.2.3 O Tipo TIME

    13.2.4 O Tipo YEAR

    13.2.5 Inicialização e Atualização Automáticas para TIMESTAMP e DATETIME

    13.2.6 Segundos Fracionários em Valores de Hora

    13.2.7 Qual Calendário é Usado pelo MySQL?

    13.2.8 Conversão entre Tipos de Data e Hora

    13.2.9 Anos de 2 Dígitos em Datas

13.3 Tipos de Dados de String:   13.3.1 Sintaxe do Tipo de Dados de String

    13.3.2 Os Tipos CHAR e VARCHAR

    13.3.3 Os Tipos BINARY e VARBINARY

    13.3.4 Os Tipos BLOB e TEXT

    13.3.5 O Tipo VECTOR

    13.3.6 O Tipo ENUM

    13.3.7 O Tipo SET

13.4 Tipos de Dados Espaciais:   13.4.1 Tipos de Dados Espaciais

    13.4.2 O Modelo de Geometria OpenGIS

    13.4.3 Formatos de Dados Espaciais Compatíveis

    13.4.4 Formação e Validade da Geometria

    13.4.5 Suporte a Sistemas de Referência Espacial

    13.4.6 Criação de Colunas Espaciais

    13.4.7 Preenchimento de Colunas Espaciais

    13.4.8 Recuperação de Dados Espaciais

    13.4.9 Otimização da Análise Espacial

    13.4.10 Criação de Índices Espaciais

    13.4.11 Uso de Índices Espaciais

13.5 O Tipo de Dados JSON

13.6 Valores Padrão de Tipo de Dados

13.7 Requisitos de Armazenamento de Tipo de Dados

13.8 Escolhendo o Tipo Certo para uma Coluna

13.9 Uso de Tipos de Dados de Outros Motores de Banco de Dados

O MySQL suporta tipos de dados SQL em várias categorias: tipos numéricos, tipos de data e hora, tipos de string (caractere e byte), tipos espaciais e o tipo de dados `JSON`. Este capítulo fornece uma visão geral e uma descrição mais detalhada das propriedades dos tipos em cada categoria, além de um resumo dos requisitos de armazenamento do tipo de dados. As visões gerais iniciais são intencionalmente breves. Consulte as descrições mais detalhadas para obter informações adicionais sobre tipos de dados específicos, como os formatos permitidos nos quais você pode especificar valores.

As descrições dos tipos de dados usam essas convenções:

* Para tipos inteiros, *`M`* indica a largura máxima de exibição. Para tipos de ponto flutuante e ponto fixo, *`M`* é o número total de dígitos que podem ser armazenados (a precisão). Para tipos de string, *`M`* é o comprimento máximo. O valor máximo permitido de *`M`* depende do tipo de dados.

* *`D`* se aplica a tipos de ponto flutuante e ponto fixo e indica o número de dígitos após o ponto decimal (a escala). O valor máximo possível é 30, mas não deve ser maior que *`M`−2.

* *`fsp`* se aplica aos tipos `TIME`, `DATETIME` e `TIMESTAMP` e representa a precisão de segundos fracionários; ou seja, o número de dígitos após o ponto decimal para partes fracionárias de segundos. O valor *`fsp`*, se fornecido, deve estar no intervalo de 0 a 6. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0. (Isso difere do padrão SQL padrão de 6, para compatibilidade com versões anteriores do MySQL.)

* Colchetes (`[` e `]`) indicam partes opcionais das definições de tipos.