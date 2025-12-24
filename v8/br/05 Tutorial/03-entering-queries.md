## 5.2 Introdução de consultas

Certifique-se de que você está conectado ao servidor, como discutido na seção anterior. Fazer isso em si não seleciona nenhum banco de dados para trabalhar, mas isso é bom. Neste ponto, é mais importante descobrir um pouco sobre como emitir consultas do que saltar diretamente na criação de tabelas, carregando dados nelas e recuperando dados delas. Esta seção descreve os princípios básicos de inserir consultas, usando várias consultas que você pode experimentar para se familiarizar com o funcionamento do `mysql`.

Aqui está uma consulta simples que pede ao servidor para lhe dizer o seu número de versão e a data atual. Digite-o como mostrado aqui seguindo o prompt `mysql>` e pressione Enter:

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

Esta consulta ilustra várias coisas sobre \[`mysql`]:

- Uma consulta normalmente consiste em uma instrução SQL seguida de um ponto e vírgula. (Há algumas exceções em que um ponto e vírgula pode ser omitido. `QUIT`, mencionado anteriormente, é um deles. Nós chegaremos aos outros mais tarde.)
- Quando você emite uma consulta, `mysql` envia-a para o servidor para execução e exibe os resultados, em seguida, imprime outro `mysql>` para indicar que está pronto para outra consulta.
- A primeira linha contém os rótulos para as colunas. As linhas seguintes são os resultados da consulta. Normalmente, os rótulos das colunas são os nomes das colunas que você obtém de tabelas de banco de dados. Se você está recuperando o valor de uma expressão em vez de uma coluna de tabela (como no exemplo exibido), a `mysql` rotula a coluna usando a própria expressão.
- \[`mysql`] mostra quantas linhas foram retornadas e quanto tempo a consulta levou para ser executada, o que lhe dá uma idéia aproximada do desempenho do servidor. Estes valores são imprecisos porque representam o tempo do relógio de parede (não o tempo da CPU ou da máquina), e porque são afetados por fatores como a carga do servidor e a latência da rede.

As palavras-chave podem ser introduzidas em qualquer letra maiúscula.

```sql
mysql> SELECT VERSION(), CURRENT_DATE;
mysql> select version(), current_date;
mysql> SeLeCt vErSiOn(), current_DATE;
```

Aqui está outra consulta. Demonstra que você pode usar o `mysql` como uma calculadora simples:

```sql
mysql> SELECT SIN(PI()/4), (4+1)*5;
+------------------+---------+
| SIN(PI()/4)      | (4+1)*5 |
+------------------+---------+
| 0.70710678118655 |      25 |
+------------------+---------+
1 row in set (0.02 sec)
```

As consultas mostradas até agora foram relativamente curtas, instruções de uma linha. Você pode até mesmo inserir várias instruções em uma única linha. Apenas termine cada uma com um ponto e vírgula:

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

Uma consulta não precisa ser dada toda em uma única linha, então consultas longas que exigem várias linhas não são um problema. `mysql` determina onde sua instrução termina procurando o ponto e vírgula de término, não procurando o final da linha de entrada. (Em outras palavras, `mysql` aceita entrada de formato livre: coleta linhas de entrada, mas não as executa até ver o ponto e vírgula.)

Aqui está uma simples declaração de várias linhas:

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

Neste exemplo, observe como o prompt muda de `mysql>` para `->` depois de inserir a primeira linha de uma consulta de várias linhas. É assim que `mysql` indica que ainda não viu uma instrução completa e está esperando o resto. O prompt é seu amigo, porque fornece um feedback valioso. Se você usar esse feedback, você sempre pode estar ciente do que `mysql` está esperando.

Se você decidir que não deseja executar uma consulta que está entrando, cancele-a digitando `\c`:

```sql
mysql> SELECT
    -> USER()
    -> \c
mysql>
```

Aqui, também, observe o prompt. Ele muda de volta para `mysql>` depois de digitar `\c`, fornecendo feedback para indicar que `mysql` está pronto para uma nova consulta.

A tabela a seguir mostra cada um dos prompts que você pode ver e resume o que eles significam sobre o estado em que o `mysql` está.

<table><thead><tr> <th>Imediatamente .</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[<code>mysql&gt;</code>]]</td> <td>Pronto para nova consulta</td> </tr><tr> <td>[[<code>-&gt;</code>]]</td> <td>Aguardando a próxima linha de consulta de linhas múltiplas</td> </tr><tr> <td>[[<code>'&gt;</code>]]</td> <td>Aguardando a próxima linha, aguardando a conclusão de uma string que começou com uma única citação ([[<code>'</code>]])</td> </tr><tr> <td>[[<code>"&gt;</code>]]</td> <td>Aguardando a próxima linha, aguardando a conclusão de uma string que começou com uma citação dupla ([[<code>"</code>]])</td> </tr><tr> <td>[[<code>`&gt;</code>]]</td> <td>Aguardando a próxima linha, aguardando a conclusão de um identificador que começou com um backtick ([[<code>`</code>]])</td> </tr><tr> <td>[[<code>/*&gt;</code>]]</td> <td>Aguardando a próxima linha, aguardando a conclusão de um comentário que começou com [[<code>/*</code>]]</td> </tr></tbody></table>

As instruções de várias linhas geralmente ocorrem por acidente quando você pretende emitir uma consulta em uma única linha, mas esquece o ponto e vírgula de término. Neste caso, `mysql` espera por mais entrada:

```
mysql> SELECT USER()
    ->
```

Se isso acontecer com você (você acha que você inseriu uma instrução, mas a única resposta é um prompt `->`), provavelmente `mysql` está esperando pelo ponto e vírgula. Se você não perceber o que o prompt está lhe dizendo, você pode ficar sentado por um tempo antes de perceber o que precisa fazer. Insira um ponto e vírgula para completar a instrução, e `mysql` a executa:

```
mysql> SELECT USER()
    -> ;
+---------------+
| USER()        |
+---------------+
| jon@localhost |
+---------------+
```

Os prompts `'>` e `">` ocorrem durante a coleta de strings (outra maneira de dizer que o MySQL está esperando a conclusão de uma string). No MySQL, você pode escrever strings cercados por caracteres `'` ou `"` (por exemplo, `'hello'` ou `"goodbye"`), e `mysql` permite que você insira strings que abrangem várias linhas. Quando você vê um prompt `'>` ou `">` significa que você inseriu uma linha contendo uma string que começa com uma citação `'` ou \[\[PH\_CODE\_CODE\_10]], mas não inseriu a citação correspondente que termina a string. Isso muitas vezes indica que você inadvertidamente deixou uma citação de um caractere. Por exemplo:

```
mysql> SELECT * FROM my_table WHERE name = 'Smith AND age < 30;
    '>
```

Se você inserir esta instrução, em seguida, pressione o código e espere o resultado, nada acontece. Em vez de se perguntar por que esta consulta leva tanto tempo, observe a pista fornecida pelo prompt. Ele diz que o código espera ver o resto de uma string subminada.

Neste ponto, o que você faz? A coisa mais simples é cancelar a consulta. No entanto, você não pode simplesmente digitar `\c` neste caso, porque `mysql` interpreta como parte da string que está coletando. Em vez disso, digite o caractere de citação de fechamento (para que `mysql` saiba que você terminou a string), então digite `\c`:

```
mysql> SELECT * FROM my_table WHERE name = 'Smith AND age < 30;
    '> '\c
mysql>
```

O prompt muda de volta para `mysql>`, indicando que `mysql` está pronto para uma nova consulta.

O prompt `` `> `` é semelhante aos promptes `'>` e `">`, mas indica que você começou, mas não completou um identificador com citação de backtick.

É importante saber o que os prompts `'>`, `">`, e `` `> `` significam, porque se você por engano inserir uma string subminada, quaisquer linhas adicionais que você digitar parecem ser ignoradas por `mysql` incluindo uma linha contendo `QUIT`. Isso pode ser bastante confuso, especialmente se você não sabe que você precisa fornecer a citação de término antes de cancelar a consulta atual.

::: info Note

As instruções multilíneas a partir deste ponto são escritas sem as instruções secundárias (`->` ou outras), para facilitar a cópia e colagem das instruções para tentar por si mesmo.

:::
