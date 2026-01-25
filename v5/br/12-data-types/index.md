# Capítulo 11 Tipos de Dados

**Índice**

11.1 Tipos de Dados Numéricos : 11.1.1 Sintaxe de Tipos de Dados Numéricos

    11.1.2 Tipos Inteiros (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT

    11.1.3 Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC

    11.1.4 Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE

    111.1.5 Tipo de Valor Bit - BIT

    11.1.6 Atributos de Tipos Numéricos

    11.1.7 Manuseio de Valores Fora do Range e Overflow

11.2 Tipos de Dados de Data e Hora : 11.2.1 Sintaxe de Tipos de Dados de Data e Hora

    11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP

    11.2.3 O Tipo TIME

    11.2.4 O Tipo YEAR

    11.2.5 Limitações de YEAR(2) de 2 Dígitos e Migração para YEAR de 4 Dígitos

    11.2.6 Inicialização e Atualização Automática para TIMESTAMP e DATETIME

    11.2.7 Segundos Fracionários em Valores de Tempo

    11.2.8 Qual Calendário é Usado pelo MySQL?

    11.2.9 Conversão Entre Tipos de Data e Hora

    11.2.10 Anos de 2 Dígitos em Datas

11.3 Tipos de Dados de String : 11.3.1 Sintaxe de Tipos de Dados de String

    11.3.2 Os Tipos CHAR e VARCHAR

    11.3.3 Os Tipos BINARY e VARBINARY

    11.3.4 Os Tipos BLOB e TEXT

    11.3.5 O Tipo ENUM

    11.3.6 O Tipo SET

11.4 Tipos de Dados Espaciais : 11.4.1 Tipos de Dados Espaciais

    11.4.2 O Modelo de Geometria OpenGIS

    11.4.3 Formatos de Dados Espaciais Suportados

    11.4.4 Boa Formatação e Validade de Geometria

    11.4.5 Criação de Colunas Espaciais

    11.4.6 Preenchimento de Colunas Espaciais

    11.4.7 Recuperação de Dados Espaciais

    11.4.8 Otimização de Análise Espacial

    11.4.9 Criação de Indexes Espaciais

    11.4.10 Usando Indexes Espaciais

11.5 O Tipo de Dado JSON

11.6 Valores Padrão de Tipos de Dados

11.7 Requisitos de Armazenamento de Tipos de Dados

11.8 Escolhendo o Tipo Certo para uma Coluna

11.9 Usando Tipos de Dados de Outros Database Engines

O MySQL suporta tipos de dados SQL em várias categorias: tipos numéricos, tipos de data e hora, tipos de string (caractere e byte), tipos espaciais e o tipo de dado `JSON`. Este capítulo fornece uma visão geral e uma descrição mais detalhada das propriedades dos tipos em cada categoria, além de um resumo dos requisitos de armazenamento dos tipos de dados. As visões gerais iniciais são intencionalmente breves. Consulte as descrições mais detalhadas para obter informações adicionais sobre tipos de dados específicos, como os formatos permitidos nos quais você pode especificar valores.

As descrições dos tipos de dados utilizam estas convenções:

*   Para tipos inteiros, *`M`* indica a largura máxima de exibição (*display width*). Para tipos de ponto flutuante e ponto fixo, *`M`* é o número total de dígitos que podem ser armazenados (a precisão). Para tipos de string, *`M`* é o comprimento máximo. O valor máximo permitido de *`M`* depende do tipo de dado.

*   *`D`* aplica-se a tipos de ponto flutuante e ponto fixo e indica o número de dígitos após o ponto decimal (a escala). O valor máximo possível é 30, mas não deve ser maior que *`M`*−2.

*   *`fsp`* aplica-se aos tipos `TIME`, `DATETIME` e `TIMESTAMP` e representa a precisão de segundos fracionários (*fractional seconds precision*); ou seja, o número de dígitos após o ponto decimal para as partes fracionárias dos segundos. O valor *`fsp`*, se fornecido, deve estar no intervalo de 0 a 6. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0. (Isso difere do padrão SQL de 6, por questões de compatibilidade com versões anteriores do MySQL.)

*   Colchetes (`[` e `]`) indicam partes opcionais das definições de tipo.