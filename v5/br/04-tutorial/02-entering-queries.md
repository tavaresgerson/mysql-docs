## 3.2 Inserindo Consultas

Certifique-se de que está conectado ao servidor, conforme discutido na seção anterior. Isso não seleciona, por si só, nenhum banco de dados para trabalhar, mas isso está bem. Neste ponto, é mais importante descobrir um pouco sobre como emitir consultas do que pular diretamente para criar tabelas, carregar dados nelas e recuperar dados deles. Esta seção descreve os princípios básicos de inserir consultas, usando várias consultas que você pode experimentar para se familiarizar com o funcionamento do **mysql**.

Aqui está uma consulta simples que pede ao servidor para lhe informar seu número de versão e a data atual. Digite-a conforme mostrado aqui após o prompt `mysql>` e pressione Enter:

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

Essa consulta ilustra várias coisas sobre **mysql**:

- Uma consulta normalmente consiste em uma instrução SQL seguida de um ponto e vírgula. (Existem algumas exceções em que um ponto e vírgula pode ser omitido. `QUIT`, mencionado anteriormente, é um deles. Vamos abordar outros mais tarde.)

- Quando você emite uma consulta, o **mysql** envia-a para o servidor para execução e exibe os resultados, e então imprime outro prompt `mysql>` para indicar que está pronto para outra consulta.

- **mysql** exibe o resultado da consulta em formato tabular (linhas e colunas). A primeira linha contém rótulos para as colunas. As linhas seguintes são os resultados da consulta. Normalmente, os rótulos das colunas são os nomes das colunas que você recupera das tabelas do banco de dados. Se você estiver recuperando o valor de uma expressão em vez de uma coluna de tabela (como no exemplo mostrado), **mysql** rotula a coluna usando a própria expressão.

- **mysql** mostra quantos registros foram retornados e quanto tempo a consulta levou para ser executada, o que lhe dá uma ideia geral do desempenho do servidor. Esses valores são imprecisos porque representam o tempo medido em relógios de parede (não CPU ou tempo da máquina) e porque são afetados por fatores como carga do servidor e latência da rede. (Por simplicidade, a linha “registros no conjunto” às vezes não é mostrada nos exemplos restantes deste capítulo.)

As palavras-chave podem ser digitadas em qualquer letra. As seguintes consultas são equivalentes:

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

As consultas exibidas até agora foram declarações relativamente curtas, de uma linha. Você pode até inserir várias declarações em uma única linha. Basta encerrar cada uma com um ponto e vírgula:

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

Uma consulta não precisa ser fornecida em uma única linha, portanto, consultas longas que exigem várias linhas não são um problema. **mysql** determina onde sua declaração termina, procurando o ponto-e-vírgula que a encerra, e não procurando o final da linha de entrada. (Em outras palavras, **mysql** aceita entrada de formato livre: ele coleta linhas de entrada, mas não as executa até ver o ponto-e-vírgula.)

Aqui está uma declaração simples de várias linhas:

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

Neste exemplo, observe como o prompt muda de `mysql>` para `->` após você inserir a primeira linha de uma consulta de várias linhas. É assim que **mysql** indica que ainda não viu uma declaração completa e está esperando pelo restante. O prompt é seu amigo, porque ele fornece feedback valioso. Se você usar esse feedback, sempre poderá estar ciente do que **mysql** está esperando.

Se você decidir que não quer executar uma consulta que está prestes a inserir, cancele-a digitando `\c`:

```sql
mysql> SELECT
    -> USER()
    -> \c
mysql>
```

Aqui, também, observe o prompt. Ele volta para `mysql>` depois que você digita `\c`, fornecendo feedback para indicar que **mysql** está pronto para uma nova consulta.

A tabela a seguir mostra cada um dos prompts que você pode ver e resume o que eles significam sobre o estado em que o **mysql** está.

<table>
   <thead>
      <tr>
         <th>Prompt</th>
         <th>Significado</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>[[<code>mysql&gt;</code>]]</td>
         <td>Pronto para nova consulta</td>
      </tr>
      <tr>
         <td>[[<code>-&gt;</code>]]</td>
         <td>Esperando pela próxima linha da consulta de várias linhas</td>
      </tr>
      <tr>
         <td>[[<code>'&gt;</code>]]</td>
         <td>Esperando pela próxima linha, esperando pela conclusão de uma string que começou com uma única aspas ([[<code>'</code>]])</td>
      </tr>
      <tr>
         <td>[[<code>"&gt;</code>]]</td>
         <td>Esperando pela próxima linha, esperando pela conclusão de uma string que começou com uma aspas duplas ([[<code>"</code>]])</td>
      </tr>
      <tr>
         <td>[[<code>`&gt;</code>]]</td>
         <td>Esperando pela próxima linha, esperando pela conclusão de um identificador que começou com uma barra invertida ([[<code>`</code>]])</td>
      </tr>
      <tr>
         <td>[[<code>/*&gt;</code>]]</td>
         <td>Esperando pela próxima linha, esperando pela conclusão de um comentário que começou com [[<code>/*</code>]]</td>
      </tr>
   </tbody>
</table>

Declarações de várias linhas geralmente ocorrem acidentalmente quando você pretende emitir uma consulta em uma única linha, mas esquece o ponto e vírgula final. Nesse caso, **mysql** espera por mais entrada:

```sql
mysql> SELECT USER()
    ->
```

Se isso acontecer com você (você acha que digitou uma declaração, mas a única resposta é um prompt `->`), provavelmente o **mysql** está esperando o ponto e vírgula. Se você não notar o que o prompt está dizendo, pode ficar sentado por um tempo antes de perceber o que precisa fazer. Digite um ponto e vírgula para completar a declaração, e o **mysql** a executa:

```sql
mysql> SELECT USER()
    -> ;
+---------------+
| USER()        |
+---------------+
| jon@localhost |
+---------------+
```

Os prompts `'>` e `">` ocorrem durante a coleta de strings (outra maneira de dizer que o MySQL está aguardando a conclusão de uma string). No MySQL, você pode escrever strings envoltas por caracteres `'` ou `"` (por exemplo, `'hello'` ou `"goodbye"`), e o **mysql** permite que você insira strings que se estendem por várias linhas. Quando você vê um prompt `'>` ou `">`, significa que você inseriu uma linha contendo uma string que começa com um caractere de citação `'` ou `"`, mas ainda não inseriu a citação correspondente que termina a string. Isso geralmente indica que você deixou inadvertidamente um caractere de citação. Por exemplo:

```sql
mysql> SELECT * FROM my_table WHERE name = 'Smith AND age < 30;
    '>
```

Se você inserir essa instrução `SELECT`, pressione **Enter** e espere pelo resultado, nada acontece. Em vez de se perguntar por que essa consulta leva tanto tempo, observe a dica fornecida pelo prompt `'>`. Ele informa que o **mysql** espera ver o restante de uma string não encerrada. (Você vê o erro na instrução? A string `'Smith` está faltando a segunda aspas simples.)

Neste ponto, o que você faz? A coisa mais simples é cancelar a consulta. No entanto, você não pode simplesmente digitar `\c` neste caso, porque **mysql** interpreta isso como parte da string que está coletando. Em vez disso, insira o caractere de citação fechamento (para que **mysql** saiba que você terminou a string), depois digite `\c`:

```sql
mysql> SELECT * FROM my_table WHERE name = 'Smith AND age < 30;
    '> '\c
mysql>
```

O prompt volta para `mysql>`, indicando que **mysql** está pronto para uma nova consulta.

O prompt `>` é semelhante aos prompts `>` e `">`, mas indica que você iniciou, mas não completou, um identificador com aspas de retrocesso.

É importante saber o que os prompts `>``, `">`, e ``>` significam, porque se você inserir acidentalmente uma string não finalizada, quaisquer linhas subsequentes que você digitar parecerão ignoradas pelo **mysql**—incluindo uma linha que contenha `QUIT`. Isso pode ser bastante confuso, especialmente se você não souber que precisa fornecer a citação final antes de poder cancelar a consulta atual.

::: info Nota
A partir deste ponto, as declarações em várias linhas são escritas sem os prompts secundários (`->` ou outros), para facilitar a cópia e a colocação das declarações para que você possa experimentar.
:::
