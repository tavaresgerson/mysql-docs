## 5.2 Entrando em Consultas

Certifique-se de que está conectado ao servidor, conforme discutido na seção anterior. Isso não seleciona, por si só, nenhum banco de dados para trabalhar, mas isso está bem. Neste ponto, é mais importante descobrir um pouco sobre como emitir consultas do que pular diretamente para criar tabelas, carregar dados nelas e recuperar dados deles. Esta seção descreve os princípios básicos de entrar em consultas, usando várias consultas que você pode experimentar para se familiarizar com como o `mysql` funciona.

Aqui está uma consulta simples que pede ao servidor para dizer o número da versão e a data atual. Digite-a como mostrado aqui após o prompt `mysql>` e pressione Enter:

```
mysql> SELECT VERSION(), CURRENT_DATE;
+-----------+--------------+
| VERSION() | CURRENT_DATE |
+-----------+--------------+
| 8.4.0-tr  | 2024-01-25   |
+-----------+--------------+
1 row in set (0.00 sec)

mysql>
```

Esta consulta ilustra várias coisas sobre o `mysql`:

* Uma consulta normalmente consiste em uma instrução SQL seguida por um ponto e vírgula. (Há algumas exceções onde um ponto e vírgula pode ser omitido. `QUIT`, mencionado anteriormente, é uma delas. Vamos chegar a outras mais tarde.)
* Quando você emite uma consulta, o `mysql` envia-a para o servidor para execução e exibe os resultados, depois imprime outro prompt `mysql>` para indicar que está pronto para outra consulta.
* O `mysql` exibe a saída da consulta em formato tabular (linhas e colunas). A primeira linha contém rótulos para as colunas. As linhas seguintes são os resultados da consulta. Normalmente, os rótulos das colunas são os nomes das colunas que você recupera das tabelas do banco de dados. Se você está recuperando o valor de uma expressão em vez de uma coluna de tabela (como no exemplo mostrado agora), o `mysql` rotula a coluna usando a própria expressão.
* O `mysql` mostra quantos registros foram retornados e quanto tempo a consulta levou para ser executada, o que lhe dá uma ideia aproximada do desempenho do servidor. Esses valores são imprecisos porque representam o tempo do relógio (não o tempo do CPU ou da máquina) e porque são afetados por fatores como carga do servidor e latência da rede. (Por simplicidade, a linha “rows in set” às vezes não é mostrada nos exemplos restantes neste capítulo.)

As palavras-chave podem ser digitadas em qualquer caso. As seguintes consultas são equivalentes:

```sql
mysql> SELECT VERSION(), CURRENT_DATE;
mysql> select version(), current_date;
mysql> SeLeCt vErSiOn(), current_DATE;
```

Aqui está outra consulta. Ela demonstra que você pode usar `mysql` como uma calculadora simples:

```sql
mysql> SELECT SIN(PI()/4), (4+1)*5;
+------------------+---------+
| SIN(PI()/4)      | (4+1)*5 |
+------------------+---------+
| 0.70710678118655 |      25 |
+------------------+---------+
1 row in set (0.02 sec)
```

As consultas mostradas até agora foram declarações relativamente curtas, de uma linha. Você pode até digitar várias declarações em uma única linha. Basta encerrar cada uma com um ponto e vírgula:

```sql
mysql> SELECT VERSION(); SELECT NOW();
+-----------+
| VERSION() |
+-----------+
| 8.4.0-tr  |
+-----------+
1 row in set (0.00 sec)

+---------------------+
| NOW()               |
+---------------------+
| 2024-01-25 18:33:04 |
+---------------------+
1 row in set (0.00 sec)
```

Uma consulta não precisa ser dada em uma única linha, então consultas longas que requerem várias linhas não são um problema. `mysql` determina onde sua declaração termina procurando o ponto e vírgula final, não procurando o fim da linha de entrada. (Em outras palavras, `mysql` aceita entrada de formato livre: ele coleta linhas de entrada, mas não as executa até ver o ponto e vírgula.)

Aqui está uma declaração simples de várias linhas:

```sql
mysql> SELECT
    -> USER()
    -> ,
    -> CURRENT_DATE;
+---------------+--------------+
| USER()        | CURRENT_DATE |
+---------------+--------------+
| jon@localhost | 2018-08-24   |
+---------------+--------------+
```

Neste exemplo, note como o prompt muda de `mysql>` para `->` após você digitar a primeira linha de uma consulta de várias linhas. É assim que `mysql` indica que ainda não viu uma declaração completa e está esperando pelo resto. O prompt é seu amigo, porque ele fornece feedback valioso. Se você usar esse feedback, sempre poderá estar ciente do que `mysql` está esperando.

Se você decidir que não quer executar uma consulta que está no processo de inserir, cancele-a digitando `\c`:

```sql
mysql> SELECT
    -> USER()
    -> \c
mysql>
```

Aqui, também, note o prompt. Ele volta para `mysql>` após você digitar `\c`, fornecendo feedback para indicar que `mysql` está pronto para uma nova consulta.

A tabela a seguir mostra cada um dos prompts que você pode ver e resume o que eles significam sobre o estado em que `mysql` está.

<table><thead><tr> <th>Prompt</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>mysql&gt;</code></td> <td>Pronto para nova consulta</td> </tr><tr> <td><code>-&gt;</code></td> <td>Aguardando a próxima linha de consulta de várias linhas</td> </tr><tr> <td><code>'&gt;`</code></td> <td>Aguardando a próxima linha, aguardando a conclusão de uma string que começou com uma única aspas (<code>'</code>)</td> </tr><tr> <td><code>"&gt;`</code></td> <td>Aguardando a próxima linha, aguardando a conclusão de uma string que começou com duas aspas (<code>"</code>)</td> </tr><tr> <td><code>`&gt;`</code></td> <td>Aguardando a próxima linha, aguardando a conclusão de um identificador que começou com uma barra invertida (<code>`</code>)</td> </tr><tr> <td><code>/*&gt;`</code></td> <td>Aguardando a próxima linha, aguardando a conclusão de um comentário que começou com <code>/*</code></td> </tr></tbody></table>

Declarações de várias linhas ocorrem comumente acidentalmente quando você pretende emitir uma consulta em uma única linha, mas esquece o ponto e vírgula final. Neste caso, `mysql` espera por mais entrada:

```
mysql> SELECT USER()
    ->
```

Se isso acontecer com você (você acha que você inseriu uma declaração, mas a única resposta é um prompt `->`), provavelmente `mysql` está esperando pelo ponto e vírgula. Se você não notar o que o prompt está lhe dizendo, pode ficar sentado por um tempo antes de perceber o que precisa fazer. Insira um ponto e vírgula para completar a declaração, e `mysql` a executa:

```
mysql> SELECT USER()
    -> ;
+---------------+
| USER()        |
+---------------+
| jon@localhost |
+---------------+
```

Os prompts `'>` e `">` ocorrem durante a coleta de strings (outra maneira de dizer que o MySQL está aguardando a conclusão de uma string). No MySQL, você pode escrever strings envoltas por caracteres `'` ou `"` (por exemplo, `'hello'` ou `"goodbye"`), e o `mysql` permite que você insira strings que se estendem por várias linhas. Quando você vê um prompt `'>` ou `">`, isso significa que você inseriu uma linha contendo uma string que começa com um caractere de citação `'` ou `"`, mas ainda não inseriu a citação correspondente que termina a string. Isso geralmente indica que você inadvertidamente deixou de fora um caractere de citação. Por exemplo:

```
mysql> SELECT * FROM my_table WHERE name = 'Smith AND age < 30;
    '>
```

Se você inserir essa declaração `SELECT`, pressione `Enter` e espere pelo resultado, nada acontece. Em vez de se perguntar por que essa consulta leva tanto tempo, observe a pista fornecida pelo prompt `'>`. Ele diz que o `mysql` espera ver o restante de uma string não terminada. (Você vê o erro na declaração? A string `'Smith` está faltando a segunda aspas.)

Nesse ponto, o que você faz? A coisa mais simples é cancelar a consulta. No entanto, você não pode simplesmente digitar `\c` neste caso, porque o `mysql` interpreta isso como parte da string que está coletando. Em vez disso, insira o caractere de citação de fechamento (para que o `mysql` saiba que você terminou a string), depois digite `\c`:

```
mysql> SELECT * FROM my_table WHERE name = 'Smith AND age < 30;
    '> '\c
mysql>
```

O prompt volta para `mysql>`, indicando que o `mysql` está pronto para uma nova consulta.

O prompt  `> `` significam, porque se você inserir acidentalmente uma string não terminada, quaisquer linhas que você digitar a seguir parecerão ignoradas pelo `mysql`—incluindo uma linha contendo `QUIT`. Isso pode ser bastante confuso, especialmente se você não souber que precisa fornecer a citação de encerramento antes de poder cancelar a consulta atual.

::: info Nota
Portuguese (Brazil):

As declarações em mais de uma linha a partir deste ponto são escritas sem os prompts secundários (`->` ou outros), para facilitar a cópia e a colocação dessas declarações para que você possa experimentar por si mesmo.