## 11.8 Escolhendo o Tipo Certo para uma Coluna

Para armazenamento ideal, você deve tentar usar o tipo mais preciso em todos os casos. Por exemplo, se uma coluna de inteiro for usada para valores no intervalo de `1` a `99999`, `MEDIUMINT UNSIGNED` é o melhor tipo. Dos tipos que representam todos os valores exigidos, este tipo utiliza a menor quantidade de armazenamento.

Todos os cálculos básicos (`+`, `-`, `*` e `/`) com colunas `DECIMAL` são feitos com precisão de 65 dígitos decimais (base 10). Consulte a Seção 11.1.1, “Numeric Data Type Syntax”.

Se a acurácia não for muito importante ou se a velocidade for a prioridade máxima, o tipo `DOUBLE` pode ser suficiente. Para alta precisão, você sempre pode converter para um tipo de ponto fixo armazenado em um `BIGINT`. Isso permite que você realize todos os cálculos com inteiros de 64 bits e, em seguida, converta os resultados de volta para valores de ponto flutuante, conforme necessário.