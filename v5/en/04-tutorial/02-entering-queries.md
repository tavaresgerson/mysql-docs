## 3.2 Inserindo Queries

Certifique-se de estar conectado ao servidor, conforme discutido na seção anterior. Isso, por si só, não seleciona nenhum Database para trabalhar, mas não há problema. Neste ponto, é mais importante aprender um pouco sobre como emitir queries do que começar imediatamente a criar tabelas, carregar dados nelas e recuperá-los. Esta seção descreve os princípios básicos de inserção de queries, usando vários exemplos que você pode experimentar para se familiarizar com o funcionamento do **mysql**.

Aqui está uma Query simples que solicita ao servidor que informe seu número de versão e a data atual. Digite-a conforme mostrado, seguindo o prompt `mysql>`, e pressione Enter:

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

Esta Query ilustra várias coisas sobre o **mysql**:

* Uma Query normalmente consiste em uma declaração SQL seguida por um ponto e vírgula. (Há algumas exceções onde um ponto e vírgula pode ser omitido. `QUIT`, mencionado anteriormente, é uma delas. Abordaremos outras mais tarde.)

* Quando você emite uma Query, o **mysql** a envia ao servidor para execução e exibe os resultados, e então imprime outro prompt `mysql>` para indicar que está pronto para uma nova Query.

* O **mysql** exibe a saída da Query em formato tabular (linhas e colunas). A primeira linha contém rótulos para as colunas. As linhas seguintes são os resultados da Query. Normalmente, os rótulos das colunas são os nomes das colunas que você busca nas tabelas do Database. Se você estiver recuperando o valor de uma expressão em vez de uma coluna de tabela (como no exemplo acima), o **mysql** rotula a coluna usando a própria expressão.

* O **mysql** mostra quantas linhas foram retornadas e quanto tempo a Query levou para ser executada, o que lhe dá uma ideia aproximada do desempenho do servidor. Esses valores são imprecisos porque representam tempo de relógio de parede (*wall clock time*) (não tempo de CPU ou máquina), e porque são afetados por fatores como carga do servidor e latência de rede. (Para simplificar, a linha “rows in set” às vezes não é mostrada nos exemplos restantes deste capítulo.)

As palavras-chave podem ser inseridas em qualquer caso de letra. As seguintes queries são equivalentes:

```sql
mysql> SELECT VERSION(), CURRENT_DATE;
mysql> select version(), current_date;
mysql> SeLeCt vErSiOn(), current_DATE;
```

Aqui está outra Query. Ela demonstra que você pode usar o **mysql** como uma calculadora simples:

```sql
mysql> SELECT SIN(PI()/4), (4+1)*5;
+------------------+---------+
| SIN(PI()/4)      | (4+1)*5 |
+------------------+---------+
| 0.70710678118655 |      25 |
+------------------+---------+
1 row in set (0.02 sec)
```

As queries mostradas até agora foram declarações relativamente curtas, de linha única. Você pode até inserir múltiplas declarações em uma única linha. Basta terminar cada uma com um ponto e vírgula:

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

Não é necessário que uma Query seja fornecida inteiramente em uma única linha, então queries longas que exigem várias linhas não são um problema. O **mysql** determina onde sua declaração termina procurando pelo ponto e vírgula de terminação, e não pelo fim da linha de entrada. (Em outras palavras, o **mysql** aceita entrada de formato livre: ele coleta linhas de entrada, mas não as executa até ver o ponto e vírgula.)

Aqui está uma declaração simples de múltiplas linhas:

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

Neste exemplo, observe como o prompt muda de `mysql>` para `->` após você inserir a primeira linha de uma Query de múltiplas linhas. É assim que o **mysql** indica que ainda não viu uma declaração completa e está esperando pelo restante. O prompt é seu amigo, pois fornece feedback valioso. Se você usar esse feedback, poderá estar sempre ciente do que o **mysql** está esperando.

Se você decidir que não deseja executar uma Query que está no processo de inserção, cancele-a digitando `\c`:

```sql
mysql> SELECT
    -> USER()
    -> \c
mysql>
```

Aqui também, observe o prompt. Ele volta para `mysql>` depois que você digita `\c`, fornecendo feedback para indicar que o **mysql** está pronto para uma nova Query.

A tabela a seguir mostra cada um dos prompts que você pode ver e resume o que eles significam sobre o estado em que o **mysql** se encontra.

<table summary="Prompts do MySQL e o significado de cada prompt."><col style="width: 10%"/><col style="width: 80%"/><thead><tr> <th>Prompt</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>mysql&gt;</code></td> <td>Pronto para uma nova Query</td> </tr><tr> <td><code>-&gt;</code></td> <td>Esperando pela próxima linha de uma Query de múltiplas linhas</td> </tr><tr> <td><code>'&gt;</code></td> <td>Esperando pela próxima linha, aguardando a conclusão de uma string que começou com aspas simples (<code>'</code>)</td> </tr><tr> <td><code>"&gt;</code></td> <td>Esperando pela próxima linha, aguardando a conclusão de uma string que começou com aspas duplas (<code>"</code>)</td> </tr><tr> <td><code>`&gt;</code></td> <td>Esperando pela próxima linha, aguardando a conclusão de um identifier que começou com um backtick (<code>`</code>)</td> </tr><tr> <td><code>/*&gt;</code></td> <td>Esperando pela próxima linha, aguardando a conclusão de um comentário que começou com <code>/*</code></td> </tr></tbody></table>

Declarações de múltiplas linhas ocorrem frequentemente por acidente quando você pretende emitir uma Query em uma única linha, mas esquece o ponto e vírgula de terminação. Neste caso, o **mysql** aguarda mais entrada:

```sql
mysql> SELECT USER()
    ->
```

Se isso acontecer com você (você acha que inseriu uma declaração, mas a única resposta é um prompt `->`), é muito provável que o **mysql** esteja esperando pelo ponto e vírgula. Se você não notar o que o prompt está lhe dizendo, poderá ficar esperando por um tempo antes de perceber o que precisa fazer. Insira um ponto e vírgula para completar a declaração, e o **mysql** a executa:

```sql
mysql> SELECT USER()
    -> ;
+---------------+
| USER()        |
+---------------+
| jon@localhost |
+---------------+
```

Os prompts `'>` e `">` ocorrem durante a coleta de string (outra forma de dizer que o MySQL está aguardando a conclusão de uma string). No MySQL, você pode escrever strings cercadas por caracteres `'` ou `"` (por exemplo, `'hello'` ou `"goodbye"`), e o **mysql** permite que você insira strings que abrangem múltiplas linhas. Quando você vê um prompt `'>` ou `">`, significa que você inseriu uma linha contendo uma string que começa com um caractere de aspas `'` ou `"`, mas ainda não inseriu as aspas correspondentes que terminam a string. Isso geralmente indica que você omitiu inadvertidamente um caractere de aspas. Por exemplo:

```sql
mysql> SELECT * FROM my_table WHERE name = 'Smith AND age < 30;
    '>
```

Se você inserir esta declaração `SELECT`, pressionar **Enter** e esperar pelo resultado, nada acontece. Em vez de se perguntar por que esta Query está demorando tanto, observe a pista fornecida pelo prompt `'>`. Ele informa que o **mysql** espera ver o restante de uma string não terminada. (Você consegue ver o erro na declaração? A string `'Smith` está faltando a segunda aspa simples.)

Neste ponto, o que você faz? O mais simples é cancelar a Query. No entanto, você não pode simplesmente digitar `\c` neste caso, porque o **mysql** o interpreta como parte da string que está sendo coletada. Em vez disso, insira o caractere de aspas de fechamento (para que o **mysql** saiba que você terminou a string), e depois digite `\c`:

```sql
mysql> SELECT * FROM my_table WHERE name = 'Smith AND age < 30;
    '> '\c
mysql>
```

O prompt muda de volta para `mysql>`, indicando que o **mysql** está pronto para uma nova Query.

O prompt `` `> `` é semelhante aos prompts `'>` e `">`, mas indica que você iniciou, mas não completou, um identifier entre aspas backtick.

É importante saber o que os prompts `'>`, `">` e `` `> `` significam, pois se você inserir erroneamente uma string não terminada, quaisquer linhas adicionais que você digitar parecerão ser ignoradas pelo **mysql**—incluindo uma linha contendo `QUIT`. Isso pode ser bastante confuso, especialmente se você não souber que precisa fornecer as aspas de terminação antes de poder cancelar a Query atual.

Nota

As declarações de múltiplas linhas a partir deste ponto serão escritas sem os prompts secundários (`->` ou outros), para facilitar a cópia e colagem das declarações para que você possa experimentá-las.