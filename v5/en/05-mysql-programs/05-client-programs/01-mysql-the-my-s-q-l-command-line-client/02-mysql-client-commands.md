#### 4.5.1.2 Comandos do Client mysql

O **mysql** envia cada instrução SQL que você emite para o server para ser executada. Há também um conjunto de comandos que o próprio **mysql** interpreta. Para uma lista desses comandos, digite `help` ou `\h` no prompt `mysql>`:

```sql
mysql> help

List of all MySQL commands:
Note that all text commands must be first on line and end with ';'
?         (\?) Synonym for `help'.
clear     (\c) Clear the current input statement.
connect   (\r) Reconnect to the server. Optional arguments are db and host.
delimiter (\d) Set statement delimiter.
edit      (\e) Edit command with $EDITOR.
ego       (\G) Send command to mysql server, display result vertically.
exit      (\q) Exit mysql. Same as quit.
go        (\g) Send command to mysql server.
help      (\h) Display this help.
nopager   (\n) Disable pager, print to stdout.
notee     (\t) Don't write into outfile.
pager     (\P) Set PAGER [to_pager]. Print the query results via PAGER.
print     (\p) Print current command.
prompt    (\R) Change your mysql prompt.
quit      (\q) Quit mysql.
rehash    (\#) Rebuild completion hash.
source    (\.) Execute an SQL script file. Takes a file name as an argument.
status    (\s) Get status information from the server.
system    (\!) Execute a system shell command.
tee       (\T) Set outfile [to_outfile]. Append everything into given
               outfile.
use       (\u) Use another database. Takes database name as argument.
charset   (\C) Switch to another charset. Might be needed for processing
               binlog with multi-byte charsets.
warnings  (\W) Show warnings after every statement.
nowarning (\w) Don't show warnings after every statement.
resetconnection(\x) Clean session context.

For server side help, type 'help contents'
```

Se o **mysql** for invocado com a opção `--binary-mode`, todos os comandos do **mysql** são desativados, exceto `charset` e `delimiter` no modo não interativo (para input canalizado para o **mysql** ou carregado usando o comando `source`).

Cada comando tem formas longas e curtas. A forma longa não diferencia maiúsculas de minúsculas; a forma curta diferencia. A forma longa pode ser seguida por um ponto e vírgula (`semicolon`) terminador opcional, mas a forma curta não deve ser.

O uso de comandos de forma curta dentro de comentários de múltiplas linhas `/* ... */` não é suportado. Comandos de forma curta funcionam dentro de comentários de versão de linha única `/*! ... */`, assim como em comentários de `optimizer-hint` `/*+ ... */`, que são armazenados em definições de objeto. Se houver a preocupação de que comentários de `optimizer-hint` possam ser armazenados em definições de objeto, de modo que os `dump files` recarregados com **mysql** resultem na execução desses comandos, invoque o **mysql** com a opção `--binary-mode` ou use um `reload client` diferente do **mysql**.

* `help [arg]`, `\h [arg]`, `\? [arg]`, `? [arg]`

  Exibe uma mensagem de ajuda listando os comandos **mysql** disponíveis.

  Se você fornecer um argumento para o comando `help`, o **mysql** o utiliza como uma string de busca para acessar a ajuda do lado do server (*server-side help*) a partir do conteúdo do Manual de Referência do MySQL. Para mais informações, consulte a Seção 4.5.1.4, “Ajuda do Lado do Server do Client mysql”.

* `charset charset_name`, `\C charset_name`

  Altera o `character set` padrão e emite uma instrução `SET NAMES`. Isso permite que o `character set` permaneça sincronizado no client e no server se o **mysql** for executado com o `auto-reconnect` ativado (o que não é recomendado), porque o `character set` especificado é usado para reconexões.

* `clear`, `\c`

  Limpa o input atual. Use isso se você mudar de ideia sobre executar a instrução que está digitando.

* `connect [db_name [host_name`, `\r [db_name [host_name`

  Reconecta ao server. Os argumentos opcionais de nome de Database e nome de host podem ser fornecidos para especificar a Database padrão ou o host onde o server está sendo executado. Se omitidos, os valores atuais são usados.

* `delimiter str`, `\d str`

  Altera a string que o **mysql** interpreta como o separador entre as instruções SQL. O padrão é o caractere ponto e vírgula (`;`).

  A string do `delimiter` pode ser especificada como um argumento sem aspas ou entre aspas na linha de comando `delimiter`. A citação pode ser feita com aspas simples (`'`), aspas duplas (`"`) ou caracteres *backtick* (`` ` ``). Para incluir uma aspa dentro de uma string entre aspas, coloque a string entre aspas usando um caractere de aspa diferente ou escape a aspa com um caractere *backslash* (`\`). O *backslash* deve ser evitado fora das strings entre aspas, pois é o caractere de escape para MySQL. Para um argumento sem aspas, o `delimiter` é lido até o primeiro espaço ou fim de linha. Para um argumento entre aspas, o `delimiter` é lido até as aspas correspondentes na linha.

  O **mysql** interpreta instâncias da string de `delimiter` como um delimitador de instrução em qualquer lugar que ocorra, exceto dentro de strings entre aspas. Tenha cuidado ao definir um `delimiter` que possa ocorrer dentro de outras palavras. Por exemplo, se você definir o `delimiter` como `X`, não será possível usar a palavra `INDEX` nas instruções. O **mysql** interpreta isso como `INDE` seguido pelo `delimiter` `X`.

  Quando o `delimiter` reconhecido pelo **mysql** é definido como algo diferente do padrão `;`, as instâncias desse caractere são enviadas ao server sem interpretação. No entanto, o próprio server ainda interpreta `;` como um delimitador de instrução e processa as instruções de acordo. Este comportamento do lado do server entra em jogo para a execução de múltiplas instruções (consulte Suporte à Execução de Múltiplas Instruções) e para a análise do corpo de `stored procedures` e funções, `triggers` e `events` (consulte a Seção 23.1, “Definindo Programas Armazenados”).

* `edit`, `\e`

  Edita a instrução de input atual. O **mysql** verifica os valores das `Environment Variables` `EDITOR` e `VISUAL` para determinar qual editor usar. O editor padrão é **vi** se nenhuma das variáveis estiver definida.

  O comando `edit` funciona apenas no Unix.

* `ego`, `\G`

  Envia a instrução atual para o server para ser executada e exibe o resultado usando o formato vertical.

* `exit`, `\q`

  Sai do **mysql**.

* `go`, `\g`

  Envia a instrução atual para o server para ser executada.

* `nopager`, `\n`

  Desativa a paginação de output. Consulte a descrição de `pager`.

  O comando `nopager` funciona apenas no Unix.

* `notee`, `\t`

  Desativa a cópia de output para o arquivo `tee`. Consulte a descrição de `tee`.

* `nowarning`, `\w`

  Desativa a exibição de *warnings* após cada instrução.

* `pager [command]`, `\P [command]`

  Ativa a paginação de output. Ao usar a opção `--pager` ao invocar o **mysql**, é possível navegar ou buscar resultados de Query no modo interativo com programas Unix como **less**, **more** ou qualquer outro programa similar. Se você não especificar nenhum valor para a opção, o **mysql** verifica o valor da `Environment Variable` `PAGER` e define o `pager` para esse valor. A funcionalidade de `pager` funciona apenas no modo interativo.

  A paginação de output pode ser ativada interativamente com o comando `pager` e desativada com `nopager`. O comando aceita um argumento opcional; se fornecido, o programa de paginação é definido para isso. Sem argumento, o `pager` é definido para o `pager` que foi configurado na linha de comando, ou `stdout` se nenhum `pager` tiver sido especificado.

  A paginação de output funciona apenas no Unix porque usa a função `popen()`, que não existe no Windows. Para Windows, a opção `tee` pode ser usada em vez disso para salvar o output da Query, embora não seja tão conveniente quanto o `pager` para navegar pelo output em algumas situações.

* `print`, `\p`

  Imprime a instrução de input atual sem executá-la.

* `prompt [str]`, `\R [str]`

  Reconfigura o prompt do **mysql** para a string fornecida. As sequências de caracteres especiais que podem ser usadas no prompt são descritas posteriormente nesta seção.

  Se você especificar o comando `prompt` sem argumento, o **mysql** redefine o prompt para o padrão `mysql>`.

* `quit`, `\q`

  Sai do **mysql**.

* `rehash`, `\#`

  Reconstrói o *completion hash* que permite a conclusão de nomes de Database, tabela e coluna enquanto você insere instruções. (Consulte a descrição da opção `--auto-rehash`.)

* `resetconnection`, `\x`

  Reseta a connection para limpar o estado da `session`.

  Resetar uma connection tem efeitos semelhantes a `mysql_change_user()` ou um `auto-reconnect`, exceto que a connection não é fechada e reaberta, e a reautenticação não é realizada. Consulte mysql_change_user() e Controle Automático de Reconexão.

  Este exemplo mostra como `resetconnection` limpa um valor mantido no estado da `session`:

  ```sql
  mysql> SELECT LAST_INSERT_ID(3);
  +-------------------+
  | LAST_INSERT_ID(3) |
  +-------------------+
  |                 3 |
  +-------------------+

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                3 |
  +------------------+

  mysql> resetconnection;

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                0 |
  +------------------+
  ```

* `source file_name`, `\. file_name`

  Lê o arquivo nomeado e executa as instruções contidas nele. No Windows, especifique os separadores de nome de caminho como `/` ou `\\`.

  Os caracteres de aspas são considerados parte do próprio nome do arquivo. Para melhores resultados, o nome não deve incluir caracteres de espaço.

* `status`, `\s`

  Fornece informações de status sobre a connection e o server que você está usando. Se você estiver executando com `--safe-updates` ativado, `status` também imprime os valores para as variáveis **mysql** que afetam seus Queries.

* `system command`, `\! command`

  Executa o comando fornecido usando seu interpretador de comandos padrão.

  O comando `system` funciona apenas no Unix.

* `tee [file_name]`, `\T [file_name]`

  Ao usar a opção `--tee` ao invocar o **mysql**, você pode logar instruções e seus outputs. Todos os dados exibidos na tela são anexados a um arquivo fornecido. Isso também pode ser muito útil para fins de debugging. O **mysql** envia os resultados para o arquivo após cada instrução, pouco antes de imprimir seu próximo prompt. A funcionalidade `Tee` funciona apenas no modo interativo.

  Você pode ativar este recurso interativamente com o comando `tee`. Sem um parâmetro, o arquivo anterior é usado. O arquivo `tee` pode ser desativado com o comando `notee`. Executar `tee` novamente reativa o logging.

* `use db_name`, `\u db_name`

  Usa *`db_name`* como a Database padrão.

* `warnings`, `\W`

  Ativa a exibição de *warnings* após cada instrução (se houver alguma).

Aqui estão algumas dicas sobre o comando `pager`:

* Você pode usá-lo para escrever em um arquivo e os resultados vão apenas para o arquivo:

  ```sql
  mysql> pager cat > /tmp/log.txt
  ```

  Você também pode passar quaisquer opções para o programa que deseja usar como seu `pager`:

  ```sql
  mysql> pager less -n -i -S
  ```

* No exemplo anterior, observe a opção `-S`. Você pode achá-la muito útil para navegar por resultados de Query amplos. Às vezes, um conjunto de resultados muito amplo é difícil de ler na tela. A opção `-S` para **less** pode tornar o conjunto de resultados muito mais legível porque você pode rolá-lo horizontalmente usando as teclas de seta para a esquerda e para a direita. Você também pode usar `-S` interativamente dentro do **less** para ligar e desligar o modo de navegação horizontal. Para mais informações, leia a página do manual do **less**:

  ```sql
  man less
  ```

* As opções `-F` e `-X` podem ser usadas com **less** para fazer com que ele saia se o output couber em uma tela, o que é conveniente quando nenhuma rolagem é necessária:

  ```sql
  mysql> pager less -n -i -S -F -X
  ```

* Você pode especificar comandos `pager` muito complexos para manipular o output de Query:

  ```sql
  mysql> pager cat | tee /dr1/tmp/res.txt \
            | tee /dr2/tmp/res2.txt | less -n -i -S
  ```

  Neste exemplo, o comando enviaria os resultados da Query para dois arquivos em dois diretórios diferentes em dois `file systems` diferentes montados em `/dr1` e `/dr2`, e ainda assim exibiria os resultados na tela usando **less**.

Você também pode combinar as funções `tee` e `pager`. Mantenha um arquivo `tee` ativado e o `pager` configurado como **less**, e você poderá navegar pelos resultados usando o programa **less** e ainda ter tudo anexado a um arquivo ao mesmo tempo. A diferença entre o `tee` do Unix usado com o comando `pager` e o comando `tee` integrado do **mysql** é que o `tee` integrado funciona mesmo se você não tiver o `tee` do Unix disponível. O `tee` integrado também registra tudo o que é impresso na tela, enquanto o `tee` do Unix usado com o `pager` não registra tanto. Além disso, o logging do arquivo `tee` pode ser ativado e desativado interativamente dentro do **mysql**. Isso é útil quando você deseja logar algumas Queries em um arquivo, mas não outras.

O comando `prompt` reconfigura o prompt padrão `mysql>`. A string para definir o prompt pode conter as seguintes sequências especiais.

<table><thead><tr> <th>Opção</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>\C</code></td> <td>O identificador de connection atual</td> </tr><tr> <td><code>\c</code></td> <td>Um contador que incrementa para cada instrução que você emite</td> </tr><tr> <td><code>\D</code></td> <td>A data atual completa</td> </tr><tr> <td><code>\d</code></td> <td>A Database padrão</td> </tr><tr> <td><code>\h</code></td> <td>O host do server</td> </tr><tr> <td><code>\l</code></td> <td>O <code>delimiter</code> atual</td> </tr><tr> <td><code>\m</code></td> <td>Minutos da hora atual</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere de nova linha (<code>newline character</code>)</td> </tr><tr> <td><code>\O</code></td> <td>O mês atual no formato de três letras (Jan, Fev, …)</td> </tr><tr> <td><code>\o</code></td> <td>O mês atual no formato numérico</td> </tr><tr> <td><code>\P</code></td> <td>am/pm</td> </tr><tr> <td><code>\p</code></td> <td>A porta TCP/IP ou arquivo socket atual</td> </tr><tr> <td><code>\R</code></td> <td>A hora atual, no formato militar de 24 horas (0–23)</td> </tr><tr> <td><code>\r</code></td> <td>A hora atual, no formato padrão de 12 horas (1–12)</td> </tr><tr> <td><code>\S</code></td> <td>Ponto e vírgula (<code>Semicolon</code>)</td> </tr><tr> <td><code>\s</code></td> <td>Segundos da hora atual</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere tab (<code>tab character</code>)</td> </tr><tr> <td><code>\U</code></td> <td><p> O seu nome de conta completo <code><em><code>user_name</code></em>@<em><code>host_name</code></em></code> </p></td> </tr><tr> <td><code>\u</code></td> <td>Seu nome de usuário</td> </tr><tr> <td><code>\v</code></td> <td>A versão do server</td> </tr><tr> <td><code>\w</code></td> <td>O dia atual da semana no formato de três letras (Seg, Ter, …)</td> </tr><tr> <td><code>\Y</code></td> <td>O ano atual, quatro dígitos</td> </tr><tr> <td><code>\y</code></td> <td>O ano atual, dois dígitos</td> </tr><tr> <td><code>_</code></td> <td>Um espaço</td> </tr><tr> <td><code>\ </code></td> <td>Um espaço (um espaço segue o backslash)</td> </tr><tr> <td><code>\'</code></td> <td>Aspa simples</td> </tr><tr> <td><code>\"</code></td> <td>Aspa dupla</td> </tr><tr> <td><code>\\</code></td> <td>Um caractere <code>\</code> literal (<em>backslash</em>)</td> </tr><tr> <td><code>\<em><code>x</code></em></code></td> <td><p> <em><code>x</code></em>, para qualquer <em><code>x</code></em> não listado acima </p></td> </tr></tbody></table>

Você pode configurar o prompt de várias maneiras:

* *Use uma Environment Variable.* Você pode definir a `Environment Variable` `MYSQL_PS1` para uma string de prompt. Por exemplo:

  ```sql
  export MYSQL_PS1="(\u@\h) [\d]> "
  ```

* *Use uma opção de linha de comando.* Você pode definir a opção `--prompt` na linha de comando para **mysql**. Por exemplo:

  ```sql
  $> mysql --prompt="(\u@\h) [\d]> "
  (user@host) [database]>
  ```

* *Use um arquivo de opção.* Você pode definir a opção `prompt` no grupo `[mysql]` de qualquer arquivo de opção MySQL, como `/etc/my.cnf` ou o arquivo `.my.cnf` no seu diretório `home`. Por exemplo:

  ```sql
  [mysql]
  prompt=(\\u@\\h) [\\d]>_
  ```

  Neste exemplo, observe que os *backslashes* são duplicados. Se você definir o prompt usando a opção `prompt` em um arquivo de opção, é aconselhável duplicar os *backslashes* ao usar as opções de prompt especiais. Existe alguma sobreposição no conjunto de opções de prompt permitidas e no conjunto de sequências de escape especiais que são reconhecidas em arquivos de opção. (As regras para sequências de escape em arquivos de opção estão listadas na Seção 4.2.2.2, “Usando Arquivos de Opção”.) A sobreposição pode causar problemas se você usar *backslashes* únicos. Por exemplo, `\s` é interpretado como um espaço em vez do valor dos segundos atuais. O exemplo a seguir mostra como definir um prompt dentro de um arquivo de opção para incluir a hora atual no formato `hh:mm:ss>`:

  ```sql
  [mysql]
  prompt="\\r:\\m:\\s> "
  ```

* *Defina o prompt interativamente.* Você pode alterar seu prompt interativamente usando o comando `prompt` (ou `\R`). Por exemplo:

  ```sql
  mysql> prompt (\u@\h) [\d]>_
  PROMPT set to '(\u@\h) [\d]>_'
  (user@host) [database]>
  (user@host) [database]> prompt
  Returning to default PROMPT of mysql>
  mysql>
  ```
