#### 10.2.1.14 Otimização de dobragem constante

As comparações entre constantes e valores de coluna em que o valor da constante está fora do intervalo ou do tipo errado em relação ao tipo da coluna são agora tratadas uma vez durante a otimização da consulta, em vez de linha a linha, durante a execução. As comparações que podem ser tratadas dessa maneira são `>`, `>=`, `<`, `<=`, `<>`/`!=`, `=` e `<=>`.

Considere a tabela criada pela seguinte declaração:

```
CREATE TABLE t (c TINYINT UNSIGNED NOT NULL);
```

A condição `WHERE` na consulta `SELECT * FROM t WHERE c < 256` contém a constante integral 256, que está fora do intervalo para uma coluna `TINYINT UNSIGNED`. Anteriormente, isso era tratado tratando ambos os operadores como o tipo maior, mas agora, como qualquer valor permitido para `c` é menor que a constante, a expressão `WHERE` pode ser substituída por `WHERE 1`, de modo que a consulta seja reescrita como `SELECT * FROM t WHERE 1`.

Isso permite que o otimizador remova a expressão `WHERE` completamente. Se a coluna `c` fosse nula (ou seja, definida apenas como `TINYINT UNSIGNED`) a consulta seria reescrita da seguinte forma:

```
SELECT * FROM t WHERE ti IS NOT NULL
```

A dobragem é realizada para constantes em comparação com os tipos de coluna do MySQL suportados da seguinte forma:

- **Tipo de coluna inteira.** Os tipos inteiros são comparados com constantes dos seguintes tipos, conforme descrito aqui:

  - **Valor inteiro.** Se a constante estiver fora do intervalo para o tipo de coluna, a comparação será reduzida para `1` ou `IS NOT NULL`, como já mostrado.

    Se a constante for um limite de intervalo, a comparação é engolida para `=`. Por exemplo (usando a mesma tabela já definida):

    ```
    mysql> EXPLAIN SELECT * FROM t WHERE c >= 255;
    *************************** 1. row ***************************
               id: 1
      select_type: SIMPLE
            table: t
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 5
         filtered: 20.00
            Extra: Using where
    1 row in set, 1 warning (0.00 sec)

    mysql> SHOW WARNINGS;
    *************************** 1. row ***************************
      Level: Note
       Code: 1003
    Message: /* select#1 */ select `test`.`t`.`ti` AS `ti` from `test`.`t` where (`test`.`t`.`ti` = 255)
    1 row in set (0.00 sec)
    ```

  - **Valor de ponto flutuante ou fixo.** Se a constante for um dos tipos decimais (como `DECIMAL`, `REAL`, `DOUBLE` ou `FLOAT`) e tiver uma parte decimal não nula, ela não pode ser igual; realize a dobragem conforme necessário. Para outras comparações, arredonde para cima ou para baixo para um valor inteiro de acordo com o sinal, em seguida, realize uma verificação de intervalo e trate conforme já descrito para comparações inteiro-inteiro.

    Um valor `REAL` que é muito pequeno para ser representado como `DECIMAL` é arredondado para .01 ou -.01, dependendo do sinal, e depois tratado como um `DECIMAL`.

  - **Tipos de strings.** Tente interpretar o valor da string como um tipo inteiro, e depois realize a comparação como se fosse entre valores inteiros. Se isso falhar, tente tratar o valor como um `REAL`.

- **Coluna DECIMAL ou REAL.** Os tipos DECIMAL são comparados com constantes dos seguintes tipos, conforme descrito aqui:

  - **Valor inteiro.** Realize uma verificação de intervalo contra a parte inteira do valor da coluna. Se não houver resultados de dobramento, converta a constante para `DECIMAL` com o mesmo número de casas decimais que o valor da coluna, em seguida, verifique-a como um `DECIMAL` (consulte o próximo).

  - **Valor DECIMAL ou REAL.** Verifique se há excesso (ou seja, se a constante tem mais dígitos na parte inteira do que o permitido para o tipo decimal da coluna). Se sim, feche.

    Se a constante tiver mais dígitos decimais significativos do que o tipo da coluna, corte a constante. Se o operador de comparação for `=` ou `<>`, realize a dobragem. Se o operador for `>=` ou `<=`, ajuste o operador devido à redução. Por exemplo, se o tipo da coluna for `DECIMAL(3,1)`, `SELECT * FROM t WHERE f >= 10.13` se torna `SELECT * FROM t WHERE f > 10.1`.

    Se a constante tiver menos dígitos decimais do que o tipo da coluna, converta-a em uma constante com o mesmo número de dígitos. Para o subfluxo de um valor `REAL` (ou seja, com muito poucos dígitos decimais para representá-lo), converta a constante para decimal 0.

  - **Valor de string.** Se o valor puder ser interpretado como um tipo inteiro, trate-o como tal. Caso contrário, tente tratá-lo como `REAL`.

- **Coluna FLOAT ou DOUBLE.** Os valores `FLOAT(m,n)` ou `DOUBLE(m,n)` comparados com constantes são tratados da seguinte forma:

  Se o valor ultrapassar o intervalo da coluna, dobrar.

  Se o valor tiver mais de `n` casas decimais, corte, compensando durante o dobramento. Para as comparações `=` e `<>`, dobre para `TRUE`, `FALSE` ou `IS [NOT] NULL`, conforme descrito anteriormente; para outros operadores, ajuste o operador.

  Se o valor tiver mais de `m` dígitos inteiros, dobrar.

**Limitações.** Esta otimização não pode ser usada nos seguintes casos:

1. Com comparações usando `BETWEEN` ou `IN`.

2. Com colunas `BIT` ou colunas que utilizam tipos de data ou hora.

3. Durante a fase de preparação de uma declaração preparada, embora possa ser aplicada durante a fase de otimização quando a declaração preparada é realmente executada. Isso ocorre porque, durante a preparação da declaração, o valor da constante ainda não é conhecido.
