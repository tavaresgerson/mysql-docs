### 5.8.3 O Pacote DBUG

O servidor MySQL e a maioria dos clientes MySQL são compilados com o pacote `DBUG`, originalmente criado por Fred Fish. Quando você configura o MySQL para debugging, este pacote possibilita a obtenção de um *trace file* (arquivo de rastreamento) do que o programa está executando. Consulte [Seção 5.8.1.2, “Criação de Trace Files”](making-trace-files.html "5.8.1.2 Creating Trace Files").

Esta seção resume os valores de argumento que você pode especificar nas opções de debug na linha de comando para programas MySQL que foram construídos com suporte a debugging.

O pacote `DBUG` pode ser usado invocando um programa com a opção `--debug[=debug_options]` ou `-# [debug_options]`. Se você especificar a opção `--debug` ou `-#` sem um valor *`debug_options`*, a maioria dos programas MySQL utiliza um valor default (padrão). O default do servidor é `d:t:i:o,/tmp/mysqld.trace` no Unix e `d:t:i:O,\mysqld.trace` no Windows. O efeito deste default é:

* `d`: Habilita a saída para todas as macros de debug
* `t`: Rastreia chamadas e saídas de função (function calls and exits)
* `i`: Adiciona o PID (Process ID) às linhas de saída
* `o,/tmp/mysqld.trace`, `O,\mysqld.trace`: Define o arquivo de saída de debug.

A maioria dos programas cliente utiliza um valor *`debug_options`* default de `d:t:o,/tmp/program_name.trace`, independentemente da plataforma.

Aqui estão alguns exemplos de strings de controle de debug como poderiam ser especificadas em uma linha de comando shell:

```sql
--debug=d:t
--debug=d:f,main,subr1:F:L:t,20
--debug=d,input,output,files:n
--debug=d:t:i:O,\\mysqld.trace
```

Para [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), também é possível alterar as configurações `DBUG` em runtime, definindo a *system variable* [`debug`](server-system-variables.html#sysvar_debug). Esta variável possui valores global e de session:

```sql
mysql> SET GLOBAL debug = 'debug_options';
mysql> SET SESSION debug = 'debug_options';
```

Alterar o valor global de [`debug`] requer privilégios suficientes para definir *system variables* globais. Alterar o valor de session de [`debug`] requer privilégios suficientes para definir *system variables* de session restritas. Consulte [Seção 5.1.8.1, “Privilégios de System Variable”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

O valor *`debug_options`* é uma sequência de campos separados por dois-pontos:

```sql
field_1:field_2:...:field_N
```

Cada campo dentro do valor consiste em um caractere de flag obrigatório, opcionalmente precedido por um caractere `+` ou `-`, e opcionalmente seguido por uma lista de modificadores separados por vírgula:

```sql
[+|-]flag[,modifier,modifier,...,modifier]
```

A tabela a seguir descreve os caracteres de flag permitidos. Caracteres de flag não reconhecidos são ignorados silenciosamente.

<table frame="all" summary="Descriptions of permitted debug_options flag characters."><col style="width: 8%"/><col style="width: 92%"/><thead><tr> <th><p> Flag </p></th> <th><p> Descrição </p></th> </tr></thead><tbody><tr> <td><p> <code>d</code> </p></td> <td><p> Habilita a saída das macros <code>DBUG_<em><code>XXX</code></em></code> para o estado atual. Pode ser seguido por uma lista de keywords, o que habilita a saída apenas para as macros DBUG com aquela keyword. Uma lista vazia de keywords habilita a saída para todas as macros. </p><p> No MySQL, as keywords de macro de debug comuns a serem habilitadas são <code>enter</code>, <code>exit</code>, <code>error</code>, <code>warning</code>, <code>info</code> e <code>loop</code>. </p></td> </tr><tr> <td><p> <code>D</code> </p></td> <td><p> Delay após cada linha de saída do debugger. O argumento é o delay (atraso), em décimos de segundo, sujeito às capacidades da máquina. Por exemplo, <code>D,20</code> especifica um delay de dois segundos. </p></td> </tr><tr> <td><p> <code>f</code> </p></td> <td><p> Limita debugging, tracing e profiling à lista de funções nomeadas. Uma lista vazia habilita todas as funções. As flags <code>d</code> ou <code>t</code> apropriadas ainda devem ser fornecidas; esta flag apenas limita suas ações se estiverem habilitadas. </p></td> </tr><tr> <td><p> <code>F</code> </p></td> <td><p> Identifica o nome do arquivo fonte (source file) para cada linha de saída de debug ou trace. </p></td> </tr><tr> <td><p> <code>i</code> </p></td> <td><p> Identifica o processo com o PID ou ID do Thread para cada linha de saída de debug ou trace. </p></td> </tr><tr> <td><p> <code>L</code> </p></td> <td><p> Identifica o número da linha do arquivo fonte para cada linha de saída de debug ou trace. </p></td> </tr><tr> <td><p> <code>n</code> </p></td> <td><p> Imprime a profundidade atual de aninhamento de função (function nesting depth) para cada linha de saída de debug ou trace. </p></td> </tr><tr> <td><p> <code>N</code> </p></td> <td><p> Numera cada linha da saída de debug. </p></td> </tr><tr> <td><p> <code>o</code> </p></td> <td><p> Redireciona o stream de saída do debugger para o arquivo especificado. A saída default é <code>stderr</code>. </p></td> </tr><tr> <td><p> <code>O</code> </p></td> <td><p> Semelhante a <code>o</code>, mas o arquivo é realmente liberado (flushed) entre cada escrita. Quando necessário, o arquivo é fechado e reaberto entre cada escrita. </p></td> </tr><tr> <td><p> <code>a</code> </p></td> <td><p> Semelhante a <code>o</code>, mas abre para append (anexação). </p></td> </tr><tr> <td><p> <code>A</code> </p></td> <td><p> Semelhante a <code>O</code>, mas abre para append (anexação). </p></td> </tr><tr> <td><p> <code>p</code> </p></td> <td><p> Limita as ações do debugger aos processos especificados. Um processo deve ser identificado com a macro <code>DBUG_PROCESS</code> e corresponder a um na lista para que as ações do debugger ocorram. </p></td> </tr><tr> <td><p> <code>P</code> </p></td> <td><p> Imprime o nome do processo atual para cada linha de saída de debug ou trace. </p></td> </tr><tr> <td><p> <code>r</code> </p></td> <td><p> Ao empurrar um novo estado, não herda o nível de aninhamento de função do estado anterior. Útil quando a saída deve começar na margem esquerda. </p></td> </tr><tr> <td><p> <code>t</code> </p></td> <td><p> Habilita as linhas de trace de chamada/saída de função (function call/exit trace lines). Pode ser seguido por uma lista (contendo apenas um modificador) que fornece um nível máximo numérico de trace, além do qual nenhuma saída ocorre para macros de debugging ou tracing. O default é uma opção de tempo de compilação. </p></td> </tr><tr> <td><p> <code>T</code> </p></td> <td><p> Imprime o timestamp atual para cada linha de saída. </p></td> </tr></tbody></table>

O caractere principal `+` ou `-` e a lista de modificadores subsequente são usados para caracteres de flag como `d` ou `f` que podem habilitar uma operação de debug para todos os modificadores aplicáveis ou apenas para alguns deles:

* Sem um `+` ou `-` principal, o valor da flag é definido exatamente como a lista de modificadores fornecida.

* Com um `+` ou `-` principal, os modificadores na lista são adicionados ou subtraídos da lista de modificadores atual.

Os exemplos a seguir mostram como isso funciona para a flag `d`. Uma lista `d` vazia habilita a saída para todas as macros de debug. Uma lista não vazia habilita a saída apenas para as keywords de macro na lista.

Estas declarações definem o valor `d` para a lista de modificadores conforme fornecido:

```sql
mysql> SET debug = 'd';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+
mysql> SET debug = 'd,error,warning';
mysql> SELECT @@debug;
+-----------------+
| @@debug         |
+-----------------+
| d,error,warning |
+-----------------+
```

Um `+` ou `-` principal adiciona ou subtrai do valor `d` atual:

```sql
mysql> SET debug = '+d,loop';
mysql> SELECT @@debug;
+----------------------+
| @@debug              |
+----------------------+
| d,error,warning,loop |
+----------------------+
mysql> SET debug = '-d,error,loop';
mysql> SELECT @@debug;
+-----------+
| @@debug   |
+-----------+
| d,warning |
+-----------+
```

Adicionar a "todas as macros habilitadas" não resulta em alteração:

```sql
mysql> SET debug = 'd';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+
mysql> SET debug = '+d,loop';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+
```

Desabilitar todas as macros habilitadas desabilita a flag `d` completamente:

```sql
mysql> SET debug = 'd,error,loop';
mysql> SELECT @@debug;
+--------------+
| @@debug      |
+--------------+
| d,error,loop |
+--------------+
mysql> SET debug = '-d,error,loop';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
|         |
+---------+
```
