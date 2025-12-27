#### 10.2.1.14 Otimização de Constantes

As comparações entre constantes e valores de coluna em que o valor constante está fora de faixa ou do tipo errado em relação ao tipo da coluna são agora tratadas uma vez durante a otimização da consulta, em vez de linha a linha, durante a execução. As comparações que podem ser tratadas dessa maneira são `>`, `>=`, `<`, `<=`, `<>`/`!=`, `=`, e `<=>`.

Considere a tabela criada pela seguinte declaração:

```
CREATE TABLE t (c TINYINT UNSIGNED NOT NULL);
```

A condição `WHERE` na consulta `SELECT * FROM t WHERE c < 256` contém a constante inteira 256, que está fora de faixa para uma coluna `TINYINT UNSIGNED`. Anteriormente, isso era tratado tratando ambos os operandos como o tipo maior, mas agora, uma vez que qualquer valor permitido para `c` é menor que a constante, a expressão `WHERE` pode ser unificada como `WHERE 1`, de modo que a consulta é reescrita como `SELECT * FROM t WHERE 1`.

Isso torna possível para o otimizador remover a expressão `WHERE` completamente. Se a coluna `c` fosse nulo (ou seja, definida apenas como `TINYINT UNSIGNED`), a consulta seria reescrita assim:

```
SELECT * FROM t WHERE ti IS NOT NULL
```

A unificação é realizada para constantes comparadas a tipos de coluna MySQL suportados da seguinte forma:

* **Tipo de coluna `Integer`.** Os tipos inteiros são comparados com constantes dos seguintes tipos, conforme descrito aqui:

  + **Valor `Integer`.** Se a constante estiver fora de faixa para o tipo da coluna, a comparação é unificada para `1` ou `IS NOT NULL`, como já mostrado.

    Se a constante for um limite de intervalo, a comparação é unificada para `=`. Por exemplo (usando a mesma tabela já definida):

    ```bOws0SjN5F
  + **Valor de ponto flutuante ou fixo.** Se a constante for um dos tipos decimais (como `DECIMAL`, `REAL`, `DOUBLE` ou `FLOAT`) e tiver uma parte decimal não nula, não pode ser igual; unifique de acordo. Para outras comparações, arredonde para cima ou para baixo para um valor inteiro de acordo com o sinal, então realize uma verificação de intervalo e trate como já descrito para comparações inteiro-inteiro.

Um valor `REAL` que é muito pequeno para ser representado como `DECIMAL` é arredondado para .01 ou -.01, dependendo do sinal, e então tratado como um `DECIMAL`.
* **Tipos `String`.** Tente interpretar o valor da string como um tipo inteiro, e então trate a comparação como entre valores inteiros. Se isso falhar, tente tratar o valor como um `REAL`.
* **Coluna `DECIMAL` ou `REAL`.** Os tipos `DECIMAL` são comparados com constantes dos seguintes tipos conforme descrito aqui:

  + **Valor `Integer`.** Realize uma verificação de intervalo contra a parte inteira do valor da coluna. Se não houver dobragem, converta a constante para `DECIMAL` com o mesmo número de casas decimais que o valor da coluna, e então verifique como um `DECIMAL` (veja a próxima).
  + **Valor `DECIMAL` ou `REAL`.** Verifique se há excesso (ou seja, se a constante tem mais dígitos em sua parte inteira do que o permitido para o tipo decimal da coluna). Se sim, dobre.
    Se a constante tiver mais dígitos fracionários significativos do que o tipo da coluna, corte o valor. Se o operador de comparação for `=` ou `<>`, dobre. Se o operador for `>=` ou `<=`, ajuste o operador devido à corte. Por exemplo, se o tipo da coluna for `DECIMAL(3,1)`, `SELECT * FROM t WHERE f >= 10.13` se torna `SELECT * FROM t WHERE f > 10.1`.
    Se a constante tiver menos dígitos decimais do que o tipo da coluna, converta-a em uma constante com o mesmo número de dígitos. Para o subfluxo de um valor `REAL` (ou seja, com poucos dígitos fracionários para representá-lo), converta a constante para decimal 0.
  + **Valor `String`.** Se o valor puder ser interpretado como um tipo inteiro, trate-o como tal. Caso contrário, tente tratá-lo como `REAL`.
* **Coluna `FLOAT` ou `DOUBLE`.** Os valores `FLOAT(m,n)` ou `DOUBLE(m,n)` comparados com constantes são tratados da seguinte forma:

  Se o valor ultrapassar o intervalo da coluna, dobre.

Se o valor tiver mais de *`n`* casas decimais, trunque, compensando durante o dobramento. Para comparações `=` e `<>`, dobre para `TRUE`, `FALSE` ou `IS [NOT] NULL` conforme descrito anteriormente; para outros operadores, ajuste o operador.

Se o valor tiver mais de `m` dígitos inteiros, dobre.

**Limitações.** Esta otimização não pode ser usada nos seguintes casos:

1. Com comparações usando `BETWEEN` ou `IN`.
2. Com colunas `BIT` ou colunas que usam tipos de data ou hora.
3. Durante a fase de preparação para uma instrução preparada, embora possa ser aplicada durante a fase de otimização quando a instrução preparada for executada. Isso ocorre porque, durante a preparação da instrução, o valor da constante ainda não é conhecido.