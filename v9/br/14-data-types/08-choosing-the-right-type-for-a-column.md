## 13.8 Escolhendo o Tipo Certo para uma Coluna

Para o armazenamento ótimo, você deve tentar usar o tipo mais preciso em todos os casos. Por exemplo, se uma coluna de inteiro for usada para valores na faixa de `1` a `99999`, o tipo `MEDIUMINT UNSIGNED` é o melhor. Dos tipos que representam todos os valores necessários, este tipo usa a menor quantidade de armazenamento.

Todos os cálculos básicos (`+`, `-`, `*`, e `/`) com colunas `DECIMAL` - DECIMAL, NUMERIC") são feitos com precisão de 65 dígitos decimais (base 10). Veja a Seção 13.1.1, “Sintaxe do Tipo de Dados Numérico”.

Se a precisão não for muito importante ou se a velocidade for a prioridade máxima, o tipo `DOUBLE` - FLOAT, DOUBLE") pode ser bom o suficiente. Para alta precisão, você sempre pode converter para um tipo de ponto fixo armazenado em um `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Isso permite que você faça todos os cálculos com inteiros de 64 bits e, em seguida, converta os resultados de volta para valores de ponto flutuante conforme necessário.