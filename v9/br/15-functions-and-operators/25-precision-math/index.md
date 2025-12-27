## Matemática de Precisão

14.25.1 Tipos de Valores Numéricos

14.25.2 Características do Tipo de Dados DECIMAL

14.25.3 Tratamento de Expressões

14.25.4 Comportamento de Ajuste

14.25.5 Exemplos de Matemática de Precisão

O MySQL oferece suporte para matemática de precisão: manipulação de valores numéricos que resulta em resultados extremamente precisos e um alto grau de controle sobre valores inválidos. A matemática de precisão é baseada nesses dois recursos:

* Modos SQL que controlam o quão rigoroso o servidor é ao aceitar ou rejeitar dados inválidos.

* A biblioteca MySQL para aritmética de ponto fixo.

Esses recursos têm várias implicações para operações numéricas e proporcionam um alto grau de conformidade com o SQL padrão:

* **Cálculos precisos**: Para números de valor exato, os cálculos não introduzem erros de ponto flutuante. Em vez disso, é usada precisão exata. Por exemplo, o MySQL trata um número como `.0001` como um valor exato, em vez de como uma aproximação, e somando-o 10.000 vezes, o resultado é exatamente `1`, não um valor que é apenas "próximo" de 1.

* **Comportamento de ajuste bem definido**: Para números de valor exato, o resultado de `ROUND()` depende de seu argumento, e não de fatores ambientais como o funcionamento da biblioteca C subjacente.

* **Independência da plataforma**: As operações em valores numéricos exatos são as mesmas em diferentes plataformas, como Windows e Unix.

* **Controle sobre o tratamento de valores inválidos**: O excesso e a divisão por zero são detectáveis e podem ser tratados como erros. Por exemplo, você pode tratar um valor que é muito grande para uma coluna como um erro, em vez de truncar o valor para ficar dentro do intervalo do tipo de dados da coluna. Da mesma forma, você pode tratar a divisão por zero como um erro, em vez de como uma operação que produz um resultado de `NULL`. A escolha da abordagem a ser adotada é determinada pelo ajuste do modo SQL do servidor.

A discussão a seguir abrange vários aspectos de como a matemática de precisão funciona, incluindo possíveis incompatibilidades com aplicações mais antigas. No final, são fornecidos alguns exemplos que demonstram como o MySQL lida com operações numéricas com precisão. Para obter informações sobre o controle do modo SQL, consulte a Seção 7.1.11, “Modos SQL do Servidor”.