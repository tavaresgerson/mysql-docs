### 5.8.3 O Pacote DBUG

O servidor MySQL e a maioria dos clientes MySQL são compilados com o pacote `DBUG`, originalmente criado por Fred Fish. Quando você configura o MySQL para depuração, este pacote permite obter um arquivo de registro do que o programa está fazendo. Veja Seção 5.8.1.2, “Criando Arquivos de Registro”.

Esta seção resume os valores de argumento que você pode especificar nas opções de depuração na linha de comando para programas MySQL que foram compilados com suporte de depuração.

O pacote `DBUG` pode ser usado invocando um programa com a opção `--debug[=debug_options]` ou `-# [debug_options]`. Se você especificar a opção `--debug` ou `-#` sem um valor de *`debug_options`*, a maioria dos programas do MySQL usa um valor padrão. O padrão do servidor é `d:t:i:o,/tmp/mysqld.trace` no Unix e `d:t:i:O,\mysqld.trace` no Windows. O efeito desse padrão é:

- `d`: Habilitar a saída para todas as macros de depuração
- `t`: Rastrear chamadas de função e saídas
- `i`: Adicione PID às linhas de saída
- `o,/tmp/mysqld.trace`, `O,\mysqld.trace`: Defina o arquivo de saída de depuração.

A maioria dos programas de clientes usa um valor padrão de *`debug_options`* de `d:t:o,/tmp/program_name.trace`, independentemente da plataforma.

Aqui estão alguns exemplos de strings de controle de depuração, conforme podem ser especificadas em uma linha de comando do shell:

```sql
--debug=d:t
--debug=d:f,main,subr1:F:L:t,20
--debug=d,input,output,files:n
--debug=d:t:i:O,\\mysqld.trace
```

Para o **mysqld**, também é possível alterar as configurações do `DBUG` em tempo de execução, definindo a variável de sistema `debug` (server-system-variables.html#sysvar_debug). Essa variável tem valores globais e de sessão:

```sql
mysql> SET GLOBAL debug = 'debug_options';
mysql> SET SESSION debug = 'debug_options';
```

Para alterar o valor global do `debug`, é necessário ter privilégios suficientes para definir variáveis de sistema globais. Para alterar o valor da sessão do `debug`, é necessário ter privilégios suficientes para definir variáveis de sistema de sessão restritas. Consulte Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

O valor *`debug_options`* é uma sequência de campos separados por vírgula:

```sql
field_1:field_2:...:field_N
```

Cada campo dentro do valor consiste em um caractere de sinal obrigatório, opcionalmente precedido por um caractere `+` ou `-`, e opcionalmente seguido por uma lista de modificadores separados por vírgula:

```sql
[+|-]flag[,modifier,modifier,...,modifier]
```

A tabela a seguir descreve os caracteres de bandeira permitidos. Os caracteres de bandeira não reconhecidos são ignorados silenciosamente.

<table frame="all" summary="Descrição dos caracteres permitidos da bandeira debug_options."><col style="width: 8%"/><col style="width: 92%"/><thead><tr> <th><p>Bandeira</p></th> <th><p>Descrição</p></th> </tr></thead><tbody><tr> <td><p> [[PH_HTML_CODE_<code>D,20</code>] </p></td> <td><p>Ative a saída de [[PH_HTML_CODE_<code>D,20</code>]</em></code>macros para o estado atual. Pode ser seguido por uma lista de palavras-chave, que permite a saída apenas para os macros [[PH_HTML_CODE_<code>d</code>] com essa palavra-chave. Uma lista vazia de palavras-chave permite a saída para todos os macros.</p><p>No MySQL, as palavras-chave comuns de macros de depuração que podem ser ativadas são [[PH_HTML_CODE_<code>t</code>], [[PH_HTML_CODE_<code>F</code>], [[PH_HTML_CODE_<code>i</code>], [[PH_HTML_CODE_<code>L</code>], [[PH_HTML_CODE_<code>n</code>] e [[PH_HTML_CODE_<code>N</code>].</p></td> </tr><tr> <td><p> [[PH_HTML_CODE_<code>o</code>] </p></td> <td><p>Atraso após cada linha de saída do depurador. O argumento é o atraso, em décimos de segundo, sujeito às capacidades da máquina. Por exemplo, [[<code>D,20</code>]] especifica um atraso de dois segundos.</p></td> </tr><tr> <td><p> [[<code>DBUG_<em><code>XXX</code><code>D,20</code>] </p></td> <td><p>Limite o depuração, o rastreamento e o perfilamento à lista de funções nomeadas. Uma lista vazia habilita todas as funções. As flags apropriadas [[<code>d</code>]] ou [[<code>t</code>]] ainda devem ser fornecidas; essa flag limita apenas suas ações se estiverem habilitadas.</p></td> </tr><tr> <td><p> [[<code>F</code>]] </p></td> <td><p>Identifique o nome do arquivo de origem para cada linha de saída de depuração ou rastreamento.</p></td> </tr><tr> <td><p> [[<code>i</code>]] </p></td> <td><p>Identifique o processo com o PID ou ID de thread para cada linha de saída de depuração ou registro.</p></td> </tr><tr> <td><p> [[<code>L</code>]] </p></td> <td><p>Identifique o número da linha do arquivo de origem para cada linha de saída de depuração ou rastreamento.</p></td> </tr><tr> <td><p> [[<code>n</code>]] </p></td> <td><p>Imprima a profundidade atual da função de encaixe para cada linha de saída de depuração ou rastreamento.</p></td> </tr><tr> <td><p> [[<code>N</code>]] </p></td> <td><p>Numerar cada linha da saída de depuração.</p></td> </tr><tr> <td><p> [[<code>o</code>]] </p></td> <td><p>Redirecione o fluxo de saída do depurador para o arquivo especificado. A saída padrão é [[<code>DBUG</code><code>D,20</code>].</p></td> </tr><tr> <td><p> [[<code>DBUG</code><code>D,20</code>] </p></td> <td><p>Como [[<code>DBUG</code><code>d</code>], mas o arquivo é realmente descarregado entre cada escrita. Quando necessário, o arquivo é fechado e reaberto entre cada escrita.</p></td> </tr><tr> <td><p> [[<code>DBUG</code><code>t</code>] </p></td> <td><p>Como [[<code>DBUG</code><code>F</code>], mas abre para adição.</p></td> </tr><tr> <td><p> [[<code>DBUG</code><code>i</code>] </p></td> <td><p>Como [[<code>DBUG</code><code>L</code>], mas abre para adição.</p></td> </tr><tr> <td><p> [[<code>DBUG</code><code>n</code>] </p></td> <td><p>Limite as ações do depurador aos processos especificados. Um processo deve ser identificado com a macro [[<code>DBUG</code><code>N</code>] e corresponder a um na lista para que as ações do depurador ocorram.</p></td> </tr><tr> <td><p> [[<code>DBUG</code><code>o</code>] </p></td> <td><p>Imprima o nome do processo atual para cada linha de saída de depuração ou rastreamento.</p></td> </tr><tr> <td><p> [[<code>enter</code><code>D,20</code>] </p></td> <td><p>Ao empurrar um novo estado, não herde o nível de encadernação de funções do estado anterior. Útil quando a saída deve começar na margem esquerda.</p></td> </tr><tr> <td><p> [[<code>enter</code><code>D,20</code>] </p></td> <td><p>Ative as linhas de rastreamento de chamadas de função/saída. Pode ser seguido por uma lista (contendo apenas um modificador) que fornece um nível máximo numérico de rastreamento, além do qual nenhuma saída ocorre para macros de depuração ou rastreamento. O padrão é uma opção de tempo de compilação.</p></td> </tr><tr> <td><p> [[<code>enter</code><code>d</code>] </p></td> <td><p>Imprima o timestamp atual para cada linha de saída.</p></td> </tr></tbody></table>

O caractere de sinalizador `+` ou `-` e a lista de modificadores finais são usados para caracteres de sinalizador, como `d` ou `f`, que podem habilitar uma operação de depuração para todos os modificadores aplicáveis ou apenas alguns deles:

- Sem o sinal de adição (`+`) ou subtração (`-`) no início, o valor da bandeira é definido exatamente na lista de modificadores fornecida.

- Com um sinal de adição `+` ou subtração `-`, os modificadores na lista são adicionados ou subtraídos da lista atual de modificadores.

Os exemplos a seguir mostram como isso funciona para a bandeira `d`. Uma lista `d` vazia habilitava a saída para todas as macros de depuração. Uma lista não vazia habilitava a saída apenas para as palavras-chave da macro na lista.

Essas declarações definem o valor `d` na lista de modificadores conforme fornecido:

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

Um sinal de adição `+` ou subtração `-` adiciona ou subtrai do valor atual `d`:

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

Adicionar “todas as macros habilitadas” não resulta em nenhuma alteração:

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

Desativando todas as macros habilitadas, a bandeira `d` é desativada completamente:

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
