### 7.9.4 O pacote DBUG

O servidor MySQL e a maioria dos clientes MySQL são compilados com o pacote `DBUG` originalmente criado por Fred Fish. Quando você configurou o MySQL para depuração, este pacote torna possível obter um arquivo de rastreamento do que o programa está fazendo.

Esta seção resume os valores de argumento que você pode especificar nas opções de depuração na linha de comando para programas MySQL que foram construídos com suporte de depuração.

O pacote `DBUG` pode ser usado invocando um programa com a `--debug[=debug_options]` ou `-# [debug_options]` opção. Se você especificar a `--debug` ou `-#` opção sem um `debug_options` valor, a maioria dos programas do MySQL usar um valor padrão. O padrão do servidor é `d:t:i:o,/tmp/mysqld.trace` no Unix e `d:t:i:O,\mysqld.trace` no Windows. O efeito deste padrão é:

- `d`: Ativar a saída para todas as macros de depuração
- `t`: chamadas de função de rastreamento e saídas
- `i`: Adicionar PID às linhas de saída
- `o,/tmp/mysqld.trace`, `O,\mysqld.trace`: Defina o arquivo de saída de depuração.

A maioria dos programas cliente usa um valor padrão \* `debug_options` \* de `d:t:o,/tmp/program_name.trace`, independentemente da plataforma.

Aqui estão alguns exemplos de strings de controle de depuração como eles podem ser especificados em uma linha de comando do shell:

```
--debug=d:t
--debug=d:f,main,subr1:F:L:t,20
--debug=d,input,output,files:n
--debug=d:t:i:O,\\mysqld.trace
```

Para `mysqld`, também é possível alterar as configurações do DBUG no tempo de execução, definindo a variável de sistema `debug`. Esta variável tem valores globais e de sessão:

```
mysql> SET GLOBAL debug = 'debug_options';
mysql> SET SESSION debug = 'debug_options';
```

A alteração do valor global `debug` requer privilégios suficientes para definir variáveis globais do sistema. A alteração do valor da sessão `debug` requer privilégios suficientes para definir variáveis de sistema de sessão restritas. Veja Seção 7.1.9.1, "Privilégios de variáveis do sistema".

O valor `debug_options` é uma sequência de campos separados por dois pontos:

```
field_1:field_2:...:field_N
```

Cada campo dentro do valor consiste em um caracter de bandeira obrigatório, opcionalmente precedido por um `+` ou `-` e opcionalmente seguido por uma lista de modificadores separados por vírgulas:

```
[+|-]flag[,modifier,modifier,...,modifier]
```

A tabela a seguir descreve os caracteres de bandeira permitidos. Os caracteres de bandeira não reconhecidos são silenciosamente ignorados.

<table><col style="width: 8%"/><col style="width: 92%"/><thead><tr> <th><p>Bandeira</p></th> <th><p>Descrição</p></th> </tr></thead><tbody><tr> <td><p> [[PH_HTML_CODE_<code>f</code>] </p></td> <td><p>Ativar a saída de [[PH_HTML_CODE_<code>f</code>]</em></code>macros para o estado atual. Pode ser seguido por uma lista de palavras-chave, que permite a saída apenas para as macros DBUG com essa palavra-chave. Uma lista vazia de palavras-chave permite a saída para todas as macros.</p><p>No MySQL, as palavras-chave de depuração macro comuns para ativar são [[PH_HTML_CODE_<code>t</code>], [[PH_HTML_CODE_<code>F</code>], [[PH_HTML_CODE_<code>i</code>], [[PH_HTML_CODE_<code>L</code>], [[PH_HTML_CODE_<code>n</code>], e [[PH_HTML_CODE_<code>N</code>].</p></td> </tr><tr> <td><p> [[PH_HTML_CODE_<code>o</code>] </p></td> <td><p>O argumento é o atraso, em décimos de segundo, sujeito às capacidades da máquina. Por exemplo, [[PH_HTML_CODE_<code>stderr</code>] especifica um atraso de dois segundos.</p></td> </tr><tr> <td><p> [[<code>f</code>]] </p></td> <td><p>Limite a depuração, rastreamento e perfil à lista de funções nomeadas. Uma lista vazia habilita todas as funções. As bandeiras [[<code>DBUG_<em><code>XXX</code><code>f</code>] ou [[<code>t</code>]] apropriadas ainda devem ser dadas; esta bandeira só limita suas ações se elas estiverem habilitadas.</p></td> </tr><tr> <td><p> [[<code>F</code>]] </p></td> <td><p>Identificar o nome do ficheiro de origem para cada linha de saída de depuração ou de rastreamento.</p></td> </tr><tr> <td><p> [[<code>i</code>]] </p></td> <td><p>Identificar o processo com o PID ou o ID de thread para cada linha de saída de depuração ou rastreamento.</p></td> </tr><tr> <td><p> [[<code>L</code>]] </p></td> <td><p>Identificar o número de linha do ficheiro de origem para cada linha de saída de depuração ou de rastreamento.</p></td> </tr><tr> <td><p> [[<code>n</code>]] </p></td> <td><p>Imprima a profundidade de aninhamento da função atual para cada linha de saída de depuração ou rastreamento.</p></td> </tr><tr> <td><p> [[<code>N</code>]] </p></td> <td><p>Numerar cada linha de saída de depuração.</p></td> </tr><tr> <td><p> [[<code>o</code>]] </p></td> <td><p>Redirecionar o fluxo de saída do depurador para o arquivo especificado. A saída padrão é [[<code>stderr</code>]].</p></td> </tr><tr> <td><p> [[<code>enter</code><code>f</code>] </p></td> <td><p>Como [[<code>enter</code><code>f</code>], mas o arquivo é realmente lavado entre cada escrita. Quando necessário, o arquivo é fechado e reaberto entre cada escrita.</p></td> </tr><tr> <td><p> [[<code>enter</code><code>t</code>] </p></td> <td><p>Como [[<code>enter</code><code>F</code>], mas abre para append.</p></td> </tr><tr> <td><p> [[<code>enter</code><code>i</code>] </p></td> <td><p>Como [[<code>enter</code><code>L</code>], mas abre para append.</p></td> </tr><tr> <td><p> [[<code>enter</code><code>n</code>] </p></td> <td><p>Limite as ações de depuração a processos especificados. Um processo deve ser identificado com a macro [[<code>enter</code><code>N</code>] e corresponder a uma na lista para que as ações de depuração ocorram.</p></td> </tr><tr> <td><p> [[<code>enter</code><code>o</code>] </p></td> <td><p>Imprima o nome do processo atual para cada linha de saída de depuração ou rastreamento.</p></td> </tr><tr> <td><p> [[<code>enter</code><code>stderr</code>] </p></td> <td><p>Ao empurrar um novo estado, não herde o nível de aninhamento da função do estado anterior. Útil quando a saída deve começar na margem esquerda.</p></td> </tr><tr> <td><p> [[<code>exit</code><code>f</code>] </p></td> <td><p>Ativar linhas de rastreamento de chamada/saída de função. Pode ser seguido por uma lista (contendo apenas um modificador) dando um nível de rastreamento máximo numérico, além do qual nenhuma saída ocorre para depuração ou rastreamento de macros. O padrão é uma opção de tempo de compilação.</p></td> </tr><tr> <td><p> [[<code>exit</code><code>f</code>] </p></td> <td><p>Imprima o carimbo de hora actual para cada linha de saída.</p></td> </tr></tbody></table>

O caractere principal `+` ou `-` e a lista de seguimento de modificadores são usados para caracteres de bandeira como `d` ou `f` que podem permitir uma operação de depuração para todos os modificadores aplicáveis ou apenas alguns deles:

- Sem `+` ou `-`, o valor da bandeira é definido exatamente como a lista de modificadores.
- Com um `+` ou `-` de liderança, os modificadores na lista são adicionados ou subtraídos da lista de modificadores atual.

Os exemplos a seguir mostram como isso funciona para a bandeira `d`. Uma lista vazia de `d` permite a saída para todas as macros de depuração. Uma lista não vazia permite a saída apenas para as palavras-chave de macro na lista.

Estas instruções definem o valor `d` para a lista de modificadores como indicado:

```
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

```
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

A adição de todas as macros habilitadas não resulta em nenhuma alteração:

```
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

Desativar todas as macros habilitadas desativa a bandeira `d` inteiramente:

```
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
