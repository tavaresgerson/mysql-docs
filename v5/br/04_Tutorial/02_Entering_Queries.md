## 3.2 Inserindo consultas

Certifique-se de que está conectado ao servidor, conforme discutido na seção anterior. Isso, por si só, não seleciona nenhum banco de dados para trabalhar, mas isso está bem. Neste ponto, é mais importante descobrir um pouco sobre como emitir consultas do que pular diretamente na criação de tabelas, carregamento de dados nelas e recuperação de dados deles. Esta seção descreve os princípios básicos de inserir consultas, usando várias consultas que você pode experimentar para se familiarizar com o funcionamento do **mysql**.

Aqui está uma consulta simples que pede ao servidor que lhe informe seu número de versão e a data atual. Digite-a conforme mostrado aqui após o prompt `mysql>` e pressione Enter:

```sql
mysql> SELECT VERSION(), CURRENT_DATE;
+--------------+--------------+
| VERSION()    | CURRENT_DATE |
+--------------+--------------+
| 5.7.1-m4-log | 2012-12-25   |
+--------------+--------------+
1 row in set (0.01 sec)
mysql>
```

Essa consulta ilustra várias coisas sobre o **mysql**:

* Uma consulta normalmente consiste em uma declaração SQL seguida por um ponto e vírgula. (Há algumas exceções em que um ponto e vírgula pode ser omitido. `QUIT`, mencionado anteriormente, é um deles. Vamos abordar outros mais tarde.)

* Quando você emite uma consulta, o **mysql** envia-a para o servidor para execução e exibe os resultados, e então imprime outro prompt `mysql>` para indicar que está pronto para outra consulta.

* **mysql** exibe a saída da consulta em forma tabular (strings e colunas). A primeira string contém rótulos para as colunas. As strings seguintes são os resultados da consulta. Normalmente, os rótulos das colunas são os nomes das colunas que você extrai das tabelas do banco de dados. Se você está recuperando o valor de uma expressão em vez de uma coluna de tabela (como no exemplo mostrado acima), **mysql** rotula a coluna usando a própria expressão.

* **mysql** mostra quantos registros foram retornados e quanto tempo a consulta levou para ser executada, o que lhe dá uma ideia aproximada do desempenho do servidor. Esses valores são imprecisos porque representam o tempo do relógio (não CPU ou tempo da máquina) e porque são afetados por fatores como carga do servidor e latência da rede. (Por economia de espaço, a string “registros no conjunto” às vezes não é mostrada nos exemplos restantes deste capítulo.)

As palavras-chave podem ser inseridas em qualquer letra. As seguintes consultas são equivalentes:

```sql
mysql> SELECT VERSION(), CURRENT_DATE;
mysql> select version(), current_date;
mysql> SeLeCt vErSiOn(), current_DATE;
```

Aqui está outra consulta. Isso demonstra que você pode usar **mysql** como uma calculadora simples:

```sql
mysql> SELECT SIN(PI()/4), (4+1)*5;
+------------------+---------+
| SIN(PI()/4)      | (4+1)*5 |
+------------------+---------+
| 0.70710678118655 |      25 |
+------------------+---------+
1 row in set (0.02 sec)
```

As consultas exibidas até agora foram declarações relativamente curtas, de uma string. Você pode até inserir várias declarações em uma única string. Basta encerrar cada uma com um ponto e vírgula:

```sql
mysql> SELECT VERSION(); SELECT NOW();
+------------------+
| VERSION()        |
+------------------+
| 5.7.10-ndb-7.5.1 |
+------------------+
1 row in set (0.00 sec)

+---------------------+
| NOW()               |
+---------------------+
| 2016-01-29 18:02:55 |
+---------------------+
1 row in set (0.00 sec)
```

Uma consulta não precisa ser dada em uma única string, portanto, consultas longas que exigem várias strings não são um problema. **mysql** determina onde sua declaração termina, procurando o ponto-e-vírgula que termina, e não procurando o fim da string de entrada. (Em outras palavras, **mysql** aceita entrada de formato livre: coleta strings de entrada, mas não as executa até que veja o ponto-e-vírgula.)

Aqui está uma declaração simples de várias strings:

```sql
mysql> SELECT
    -> USER()
    -> ,
    -> CURRENT_DATE;
+---------------+--------------+
| USER()        | CURRENT_DATE |
+---------------+--------------+
| jon@localhost | 2010-08-06   |
+---------------+--------------+
```

Neste exemplo, observe como o prompt muda de `mysql>` para `->` após inserir a primeira string de uma consulta de várias strings. É assim que o **mysql** indica que ainda não viu uma declaração completa e está esperando pelo resto. O prompt é seu amigo, porque fornece feedback valioso. Se você usar esse feedback, sempre poderá estar ciente do que o **mysql** está esperando.

Se você decidir que não quer executar uma consulta que está em processo de inserir, cancele-a digitando `\c`:

```sql
mysql> SELECT
    -> USER()
    -> \c
mysql>
```

Aqui, também, observe o prompt. Ele volta para `mysql>` depois que você digita `\c`, fornecendo feedback para indicar que o **mysql** está pronto para uma nova consulta.

A tabela a seguir mostra cada um dos prompts que você pode ver e resume o que eles significam sobre o estado em que o **mysql** está.

<table summary="MySQL prompts and the meaning of each prompt."><col style="width: 10%"/><col style="width: 80%"/><thead><tr> <th>Prompt</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>mysql&gt;</code></td> <td>Pronto para nova consulta</td> </tr><tr> <td><code>-&gt;</code></td> <td>Esperando pela próxima string de consulta de várias strings</td> </tr><tr> <td><code>'&gt;</code></td> <td>Esperando para a próxima string, esperando a conclusão de uma string que começou com uma única citação (<code>'</code>)</td> </tr><tr> <td><code>"&gt;</code></td> <td>Esperando para a próxima string, esperando a conclusão de uma string que começou com uma citação dupla (<code>"</code>)</td> </tr><tr> <td><code>`&gt;</code></td> <td>Esperando para a próxima string, esperando a conclusão de um identificador que começou com uma barra invertida (<code>`</code>)</td> </tr><tr> <td><code>/*&gt;</code></td> <td>Esperando pela próxima string, esperando a conclusão de um comentário que começou com<code>/*</code></td> </tr></tbody></table>

As declarações de várias strings geralmente ocorrem acidentalmente quando você pretende emitir uma consulta em uma única string, mas esquece o ponto e vírgula final. Neste caso, o **mysql** espera mais entrada:

```sql
mysql> SELECT USER()
    ->
```

Se isso acontecer com você (você acha que entrou em uma declaração, mas a única resposta é um prompt `->`, provavelmente o **mysql** está esperando o ponto e vírgula. Se você não notar o que o prompt está lhe dizendo, pode ficar sentado por um tempo antes de perceber o que precisa fazer. Digite um ponto e vírgula para completar a declaração, e o **mysql** a executa:

```sql
mysql> SELECT USER()
    -> ;
+---------------+
| USER()        |
+---------------+
| jon@localhost |
+---------------+
```

Os prompts `'>` e `">` ocorrem durante a coleta de strings (outra maneira de dizer que o MySQL está esperando a conclusão de uma string). No MySQL, você pode escrever strings cercadas por caracteres `'` ou `"` (por exemplo, `'hello'` ou `"goodbye"`), e o **mysql** permite que você insira strings que se estendem por várias strings. Quando você vê um prompt `'>` ou `">`, isso significa que você inseriu uma string contendo uma string que começa com um caractere de citação `'` ou `"`, mas ainda não inseriu a citação correspondente que termina a string. Isso geralmente indica que você deixou inadvertidamente um caractere de citação. Por exemplo:

```sql
mysql> SELECT * FROM my_table WHERE name = 'Smith AND age < 30;
    '>
```

Se você inserir esta declaração `SELECT`, pressione **Enter** e aguarde o resultado, nada acontece. Em vez de se perguntar por que essa consulta leva tanto tempo, observe a dica fornecida pelo prompt [[`'>`]. Ela lhe diz que o **mysql** espera ver o restante de uma string não terminada. (Você vê o erro na declaração? A string `'Smith` está faltando a segunda aspas simples.)

Neste ponto, o que você faz? A coisa mais simples é cancelar a consulta. No entanto, você não pode simplesmente digitar `\c` neste caso, porque o **mysql** interpreta isso como parte da string que está coletando. Em vez disso, digite o caractere de citação de fechamento (para que o **mysql** saiba que você terminou a string), em seguida, digite `\c`:

```sql
mysql> SELECT * FROM my_table WHERE name = 'Smith AND age < 30;
    '> '\c
mysql>
```

O prompt volta para `mysql>`, indicando que o **mysql** está pronto para uma nova consulta.

Os prompts `` `>` ` prompt is similar to the `'>` and `` indicam que você iniciou, mas não completou um identificador com aspas.

É importante saber o que são os `'>`, `">` e `` `> ` prompts signify, because if you mistakenly enter an unterminated string, any further lines you type appear to be ignored by **mysql**—including a line containing `QUIT`. Isso pode ser bastante confuso, especialmente se você não sabe que precisa fornecer a citação final antes de poder cancelar a consulta atual.

Nota

As declarações de várias strings a partir deste ponto são escritas sem os prompts secundários (`->` ou outros), para facilitar a cópia e a inserção das declarações para que você mesmo possa experimentar.