## 12.21 Matemática de Precisão

12.21.1 Tipos de valores numéricos

12.21.2 Características do Tipo de Dados DECIMAL

12.21.3 Gerenciamento de Expressões

12.21.4 Comportamento de arredondamento

12.21.5 Exemplos de matemática de precisão

O MySQL oferece suporte para matemática de precisão: manipulação de valores numéricos que resulta em resultados extremamente precisos e um alto grau de controle sobre valores inválidos. A matemática de precisão é baseada nesses dois recursos:

- Modos SQL que controlam o quão rigoroso o servidor é ao aceitar ou rejeitar dados inválidos.

- A biblioteca MySQL para aritmética de ponto fixo.

Essas funcionalidades têm várias implicações para operações numéricas e proporcionam um alto grau de conformidade com o SQL padrão:

- **Cálculos precisos**: Para números com valor exato, os cálculos não introduzem erros de ponto flutuante. Em vez disso, é usada precisão exata. Por exemplo, o MySQL trata um número como `.0001` como um valor exato, em vez de como uma aproximação, e somando-o 10.000 vezes, o resultado é exatamente `1`, não um valor que é apenas "próximo" de 1.

- **Comportamento de arredondamento bem definido**: Para números com valor exato, o resultado da função `ROUND()` depende de seu argumento, e não de fatores ambientais, como a forma como a biblioteca C subjacente funciona.

- **Independência da plataforma**: As operações com valores numéricos exatos são as mesmas em diferentes plataformas, como Windows e Unix.

- **Controle sobre o tratamento de valores inválidos**: O excesso e a divisão por zero são detectáveis e podem ser tratados como erros. Por exemplo, você pode tratar um valor que é muito grande para uma coluna como um erro, em vez de truncar o valor para ficar dentro do intervalo do tipo de dados da coluna. Da mesma forma, você pode tratar a divisão por zero como um erro, em vez de como uma operação que produz um resultado de `NULL`. A escolha da abordagem a ser adotada é determinada pelo ajuste do modo SQL do servidor.

A discussão a seguir aborda vários aspectos de como a matemática de precisão funciona, incluindo possíveis incompatibilidades com aplicações mais antigas. No final, são fornecidos alguns exemplos que demonstram como o MySQL lida com operações numéricas com precisão. Para obter informações sobre o controle do modo SQL, consulte a Seção 5.1.10, “Modos SQL do Servidor”.
