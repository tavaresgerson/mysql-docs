## 12.21 Matemática de Precisão

12.21.1 Tipos de Valores Numéricos

12.21.2 Características do Tipo de Dados DECIMAL

12.21.3 Tratamento de Expressões

12.21.4 Comportamento de Arredondamento

12.21.5 Exemplos de Matemática de Precisão

O MySQL oferece suporte para matemática de precisão: tratamento de valores numéricos que resulta em resultados extremamente precisos e um alto grau de controle sobre valores inválidos. A matemática de precisão é baseada nestas duas funcionalidades:

* SQL modes que controlam o quão rigoroso o servidor é em aceitar ou rejeitar dados inválidos.

* A biblioteca do MySQL para aritmética de ponto fixo.

Essas funcionalidades têm várias implicações para operações numéricas e oferecem um alto grau de conformidade com o SQL padrão:

* **Cálculos precisos**: Para números de valor exato, os cálculos não introduzem erros de ponto flutuante. Em vez disso, a precisão exata é usada. Por exemplo, o MySQL trata um número como `.0001` como um valor exato, e não como uma aproximação, e somá-lo 10.000 vezes produz um resultado de exatamente `1`, e não um valor que é meramente "próximo" de 1.

* **Comportamento de arredondamento bem definido**: Para números de valor exato, o resultado de `ROUND()` depende do seu argumento, e não de fatores ambientais, como o funcionamento da biblioteca C subjacente.

* **Independência de plataforma**: As operações em valores numéricos exatos são as mesmas em diferentes plataformas, como Windows e Unix.

* **Controle sobre o tratamento de valores inválidos**: Overflow e divisão por zero são detectáveis e podem ser tratados como erros. Por exemplo, você pode tratar um valor que é muito grande para uma column como um erro, em vez de ter o valor truncado para se enquadrar no intervalo do tipo de dados da column. Da mesma forma, você pode tratar a divisão por zero como um erro, em vez de como uma operação que produz um resultado `NULL`. A escolha de qual abordagem tomar é determinada pela configuração do SQL mode do servidor.

A discussão a seguir aborda vários aspectos de como a matemática de precisão funciona, incluindo possíveis incompatibilidades com aplicações mais antigas. No final, são apresentados alguns exemplos que demonstram como o MySQL lida com operações numéricas com precisão. Para obter informações sobre como controlar o SQL mode, consulte a Seção 5.1.10, “Server SQL Modes”.