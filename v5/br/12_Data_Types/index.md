# Capítulo 11 Tipos de dados

O MySQL suporta tipos de dados SQL em várias categorias: tipos numéricos, tipos de data e hora, tipos de string (caractere e byte), tipos espaciais e o tipo de dados `JSON`. Este capítulo fornece uma visão geral e uma descrição mais detalhada das propriedades dos tipos em cada categoria, e um resumo dos requisitos de armazenamento do tipo de dados. As visões iniciais são intencionalmente breves. Consulte as descrições mais detalhadas para obter informações adicionais sobre tipos de dados específicos, como os formatos permitidos nos quais você pode especificar valores.

As descrições dos tipos de dados utilizam essas convenções:

* Para tipos inteiros, *`M`* indica a largura máxima de exibição. Para tipos de ponto flutuante e ponto fixo, *`M`* é o número total de dígitos que podem ser armazenados (a precisão). Para tipos de string, *`M`* é o comprimento máximo. O valor máximo permitido de *`M`* depende do tipo de dados.

* *`D`* se aplica aos tipos de ponto flutuante e ponto fixo e indica o número de dígitos após o ponto decimal (a escala). O valor máximo possível é 30, mas não deve ser maior que *`M`*−2.

* *`fsp`* se aplica aos tipos `TIME`, `DATETIME` e `TIMESTAMP` e representa precisão de frações de segundo; ou seja, o número de dígitos após o ponto decimal para partes fracionárias de segundos. O valor *`fsp`*, se fornecido, deve estar na faixa de 0 a 6. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0. (Isso difere do padrão padrão SQL padrão de 6, para compatibilidade com versões anteriores do MySQL.)

* Os colchetes retos (`[` e `]`) indicam partes opcionais das definições de tipo.