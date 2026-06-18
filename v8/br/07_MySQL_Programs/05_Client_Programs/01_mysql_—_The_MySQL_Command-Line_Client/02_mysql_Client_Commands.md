#### 6.5.1.2 Comandos do cliente do MySQL

O **mysql** envia cada instrução SQL que você emite para o servidor a ser executada. Há também um conjunto de comandos que o próprio **mysql** interpreta. Para obter uma lista desses comandos, digite `help` ou `\h` no prompt `mysql>`:

```
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
query_attributes Sets string parameters (name1 value1 name2 value2 ...)
for the next query to pick up.
ssl_session_data_print Serializes the current SSL session data to stdout
or file.

For server side help, type 'help contents'
```

Se o **mysql** for invocado com a opção `--binary-mode`, todos os comandos do **mysql** serão desativados, exceto `charset` e `delimiter` no modo não interativo (para entrada canalizada para o **mysql** ou carregada usando o comando `source`). A partir do MySQL 8.0.43, a opção `--commands` pode ser usada para habilitar ou desabilitar todos os comandos, exceto `/C`, `delimiter` e `use`.

Cada comando tem uma forma longa e uma forma curta. A forma longa não é case-sensitive; a forma curta é. A forma longa pode ser seguida por um finalizador opcional por ponto e vírgula, mas a forma curta não deve.

O uso de comandos de formato curto dentro de comentários de várias linhas `/* ... */` não é suportado. Os comandos de formato curto funcionam dentro de comentários de versão de linha única `/*! ... */`, assim como os comentários de `/*+ ... */` otimizador-sinal, que são armazenados nas definições de objetos. Se houver preocupação de que os comentários de otimizador-sinal possam ser armazenados em definições de objetos, de modo que os arquivos de dump, ao serem carregados novamente com `mysql`, resultem na execução desses comandos, invocando **mysql** com a opção `--binary-mode` ou usando um cliente de carregamento diferente de **mysql**.

- `help [arg]`, `\h [arg]`, `\? [arg]`, `? [arg]`

  Exiba uma mensagem de ajuda listando os comandos **mysql** disponíveis.

  Se você fornecer um argumento para o comando `help`, o **mysql** usa-o como uma string de busca para acessar a ajuda do lado do servidor a partir do conteúdo do Manual de Referência do MySQL. Para mais informações, consulte a Seção 6.5.1.4, “Ajuda do lado do servidor do cliente mysql”.

- `charset charset_name`, `\C charset_name`

  Altere o conjunto de caracteres padrão e emita uma declaração `SET NAMES`. Isso permite que o conjunto de caracteres permaneça sincronizado no cliente e no servidor se o **mysql** for executado com o recurso de reconexão automática habilitado (o que não é recomendado), pois o conjunto de caracteres especificado é usado para reconexões.

- `clear`, `\c`

  Limpe a entrada atual. Use isso se você mudar de ideia sobre a execução da declaração que você está inserindo.

- `connect [db_name [host_name]]`, `\r [db_name [host_name]]`

  Recupere a conexão com o servidor. Os argumentos opcionais para o nome do banco de dados e o nome do host podem ser fornecidos para especificar o banco de dados padrão ou o host onde o servidor está sendo executado. Se omitidos, os valores atuais são usados.

  Se o comando `connect` especificar um argumento de nome de host, esse host terá precedência sobre qualquer opção `--dns-srv-name` dada no **mysql** ao iniciar para especificar um registro DNS SRV.

- `delimiter str`, `\d str`

  Altere a string que o **mysql** interpreta como o separador entre as instruções SQL. O padrão é o caractere ponto e vírgula (`;`).

  A string de delimitador pode ser especificada como um argumento não citado ou citado na linha de comando do comando `delimiter`. A citação pode ser feita com caracteres de aspas simples (`'`), aspas duplas (`"`), ou barra invertida (`` ` ``). Para incluir uma aspa dentro de uma string citada, cite a string com um caractere de aspa diferente ou escape a aspa com o caractere de barra invertida (`\`). A barra invertida deve ser evitada fora de strings citadas, pois é o caractere de escape para o MySQL. Para um argumento não citado, o delimitador é lido até o primeiro espaço ou o final da linha. Para um argumento citado, o delimitador é lido até a aspa correspondente na linha.

  O **mysql** interpreta as ocorrências da string de delimitador como um delimitador de declaração em qualquer lugar onde ocorre, exceto dentro de strings com aspas. Tenha cuidado ao definir um delimitador que possa ocorrer dentro de outras palavras. Por exemplo, se você definir o delimitador como `X`, não é possível usar a palavra `INDEX` em declarações. O **mysql** interpreta isso como `INDE` seguido pelo delimitador `X`.

  Quando o delimitador reconhecido pelo **mysql** é definido para algo diferente do padrão `;`, as instâncias desse caractere são enviadas ao servidor sem interpretação. No entanto, o próprio servidor ainda interpreta `;` como um delimitador de declaração e processa as declarações conforme necessário. Esse comportamento no lado do servidor entra em jogo para a execução de múltiplas declarações (veja Suporte à Execução de Múltiplas Declarações) e para a análise do corpo de procedimentos e funções armazenados, gatilhos e eventos (veja Seção 27.1, “Definindo Programas Armazenados”).

- `edit`, `\e`

  Edita a declaração de entrada atual. O **mysql** verifica os valores das variáveis de ambiente `EDITOR` e `VISUAL` para determinar qual editor usar. O editor padrão é o **vi** se nenhuma dessas variáveis estiver definida.

  O comando `edit` funciona apenas no Unix.

- `ego`, `\G`

  Envie a declaração atual para o servidor a ser executado e exiba o resultado usando o formato vertical.

- `exit`, `\q`

  Saia do **mysql**.

- `go`, `\g`

  Envie a declaração atual para o servidor a ser executado.

- `nopager`, `\n`

  Desative a exibição de páginas de saída. Consulte a descrição para `pager`.

  O comando `nopager` funciona apenas no Unix.

- `notee`, `\t`

  Desative a cópia de saída para o arquivo tee. Consulte a descrição para `tee`.

- `nowarning`, `\w`

  Desative a exibição de avisos após cada declaração.

- `pager [command]`, `\P [command]`

  Ative a exibição de páginas de saída. Ao usar a opção `--pager` ao invocar o **mysql**, é possível navegar ou pesquisar os resultados das consultas no modo interativo com programas Unix, como **less**, **more** ou qualquer outro programa semelhante. Se você não especificar um valor para a opção, o **mysql** verifica o valor da variável de ambiente `PAGER` e define o visualizador conforme necessário. A funcionalidade do visualizador funciona apenas no modo interativo.

  A exibição de páginas de saída pode ser habilitada interativamente com o comando `pager` e desabilitada com `nopager`. O comando aceita um argumento opcional; se fornecido, o programa de exibição de páginas é definido para ele. Sem argumento, o visualizador de páginas é definido para o visualizador de páginas que foi definido na linha de comando, ou `stdout` se nenhum visualizador de páginas foi especificado.

  A exibição de resultados de saída funciona apenas no Unix porque usa a função `popen()`, que não existe no Windows. Para o Windows, a opção `tee` pode ser usada em vez disso para salvar a saída da consulta, embora não seja tão conveniente quanto `pager` para navegar pela saída em algumas situações.

- `print`, `\p`

  Imprima a declaração de entrada atual sem executá-la.

- `prompt [str]`, `\R [str]`

  Reconfigure o prompt **mysql** para a string fornecida. As sequências de caracteres especiais que podem ser usadas no prompt são descritas mais adiante nesta seção.

  Se você especificar o comando `prompt` sem argumento, o **mysql** redefini o prompt para o padrão `mysql>`.

- `query_attributes name value [name value ...]`

  Defina os atributos da consulta que se aplicam à próxima consulta enviada ao servidor. Para discussão sobre o propósito e o uso dos atributos da consulta, consulte a Seção 11.6, “Atributos da Consulta”.

  O comando `query_attributes` segue estas regras:

  - O formato e as regras de citação para os nomes e valores dos atributos são os mesmos do comando `delimiter`.

  - O comando permite até 32 pares de nome/valor de atributo. Os nomes e valores podem ter até 1024 caracteres. Se um nome for fornecido sem um valor, ocorrerá um erro.

  - Se vários comandos `query_attributes` forem emitidos antes da execução da consulta, apenas o último comando será aplicado. Após enviar a consulta, o **mysql** limpa o conjunto de atributos.

  - Se vários atributos forem definidos com o mesmo nome, as tentativas de recuperar o valor do atributo terão um resultado indefinido.

  - Um atributo definido com um nome vazio não pode ser recuperado pelo nome.

  - Se ocorrer uma reconexão enquanto o **mysql** executa a consulta, o **mysql** restaura os atributos após a reconexão, para que a consulta possa ser executada novamente com os mesmos atributos.

- `quit`, `\q`

  Saia do **mysql**.

- `rehash`, `\#`

  Recrie o hash de conclusão que permite a conclusão do nome do banco de dados, da tabela e do nome da coluna enquanto você está digitando as instruções. (Veja a descrição da opção `--auto-rehash`.)

- `resetconnection`, `\x`

  Reinicie a conexão para limpar o estado da sessão. Isso inclui a limpeza de quaisquer atributos de consulta atuais definidos usando o comando `query_attributes`.

  A reinicialização de uma conexão tem efeitos semelhantes ao `mysql_change_user()` ou a um controle de reconexão automática, exceto que a conexão não é fechada e reaberta, e a reautenticação não é realizada. Veja mysql\_change\_user() e Controle de Reconexão Automática.

  Este exemplo mostra como `resetconnection` limpa um valor mantido no estado da sessão:

  ```
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

- `source file_name`, `\. file_name`

  Leia o arquivo nomeado e execute as instruções contidas nele. Em Windows, especifique os separadores de nome de caminho como `/` ou `\\`.

  Os caracteres de citação são considerados parte do próprio nome do arquivo. Para obter os melhores resultados, o nome não deve incluir caracteres de espaço.

- `ssl_session_data_print [file_name]`

  Obtém, serializa e, opcionalmente, armazena os dados da sessão de uma conexão bem-sucedida. O nome do arquivo e os argumentos opcionais podem ser fornecidos para especificar o arquivo onde os dados serializados da sessão serão armazenados. Se omitidos, os dados da sessão serão impressos em `stdout`.

  Se a sessão MySQL estiver configurada para reutilização, os dados da sessão do arquivo são deserializados e fornecidos ao comando `connect` para reconectar. Quando a sessão é reutilizada com sucesso, o comando `status` contém uma linha mostrando `SSL session reused: true`, enquanto o cliente permanece reconectado ao servidor.

- `status`, `\s`

  Forneça informações de status sobre a conexão e o servidor que você está usando. Se você estiver executando com o `--safe-updates` habilitado, o `status` também imprime os valores das variáveis **mysql** que afetam suas consultas.

- `system command`, `\! command`

  Execute o comando fornecido usando o interpretador de comandos padrão.

  Antes do MySQL 8.0.19, o comando `system` funcionava apenas no Unix. A partir do 8.0.19, ele também funciona no Windows.

  No MySQL 8.0.40 e versões posteriores, este comando pode ser desativado ao iniciar o cliente com `--system-command=OFF` ou `--skip-system-command`.

- `tee [file_name]`, `\T [file_name]`

  Ao usar a opção `--tee` ao invocar o **mysql**, você pode registrar declarações e suas saídas. Todos os dados exibidos na tela são anexados a um arquivo específico. Isso também pode ser muito útil para fins de depuração. O **mysql** descarrega os resultados no arquivo após cada declaração, logo antes de imprimir sua próxima solicitação. A funcionalidade de Tee funciona apenas no modo interativo.

  Você pode habilitar essa funcionalidade interativamente com o comando `tee`. Sem um parâmetro, o arquivo anterior é usado. O arquivo `tee` pode ser desativado com o comando `notee`. Executar `tee` novamente reativa o registro.

- `use db_name`, `\u db_name`

  Use `db_name` como banco de dados padrão.

- `warnings`, `\W`

  Ative a exibição de avisos após cada declaração (se houver alguma).

Aqui estão algumas dicas sobre o comando `pager`:

- Você pode usá-lo para escrever em um arquivo e os resultados vão apenas para o arquivo:

  ```
  mysql> pager cat > /tmp/log.txt
  ```

  Você também pode passar quaisquer opções para o programa que você deseja usar como seu pager:

  ```
  mysql> pager less -n -i -S
  ```

- No exemplo anterior, observe a opção `-S`. Você pode achar que ela é muito útil para navegar por resultados de consultas amplas. Às vezes, um conjunto de resultados muito amplo é difícil de ler na tela. A opção `-S` para **less** pode tornar o conjunto de resultados muito mais legível, pois você pode rolar horizontalmente usando as teclas seta para a esquerda e seta para a direita. Você também pode usar `-S` interativamente dentro de **less** para ativar e desativar o modo de navegação horizontal. Para mais informações, leia a página do manual do **less**:

  ```
  man less
  ```

- As opções `-F` e `-X` podem ser usadas com **menos** para fazê-lo sair se a saída cabe em um único ecrã, o que é conveniente quando não é necessário rolar:

  ```
  mysql> pager less -n -i -S -F -X
  ```

- Você pode especificar comandos de paginador muito complexos para lidar com o resultado da consulta:

  ```
  mysql> pager cat | tee /dr1/tmp/res.txt \
            | tee /dr2/tmp/res2.txt | less -n -i -S
  ```

  Neste exemplo, o comando enviaria os resultados da consulta para dois arquivos em dois diretórios diferentes em dois sistemas de arquivos diferentes montados em `/dr1` e `/dr2`, mas ainda exibiriam os resultados na tela usando o **less**.

Você também pode combinar as funções `tee` e `pager`. Tenha um arquivo `tee` habilitado e `pager` definido como **menos**, e você poderá navegar pelos resultados usando o programa **less** e ainda ter tudo anexado a um arquivo ao mesmo tempo. A diferença entre o Unix `tee` usado com o comando `pager` e o comando interno `tee` do **mysql** é que o interno `tee` funciona mesmo se você não tiver o **tee** do Unix disponível. O interno `tee` também registra tudo o que é impresso na tela, enquanto o **tee** do Unix usado com `pager` não registra tanto. Além disso, o registro de arquivos `tee` pode ser ativado e desativado interativamente dentro do **mysql**. Isso é útil quando você deseja registrar algumas consultas em um arquivo, mas não outras.

O comando `prompt` reconfigura o prompt padrão `mysql>`. A string para definir o prompt pode conter as seguintes sequências especiais.

<table summary="opções de comando de prompt que são usadas para configurar o prompt mysql&gt;"><thead><tr> <th>Opção</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>\P</code>]</td> <td>O identificador de conexão atual</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\P</code>]</td> <td>Um contador que aumenta para cada declaração que você emite</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\R</code>]</td> <td>A data atual completa</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\r</code>]</td> <td>O banco de dados padrão</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\S</code>]</td> <td>O anfitrião do servidor</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\s</code>]</td> <td>O delimitador atual</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\T</code>]</td> <td>Minutos da hora atual</td> </tr><tr> <td>[[PH_HTML_CODE_<code>*</code>]</td> <td>Um caractere de nova linha</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\t</code>]</td> <td>O mês atual no formato de três letras (Jan, Feb, …)</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\U</code>]</td> <td>O mês atual no formato numérico</td> </tr><tr> <td>[[<code>\P</code>]]</td> <td>am/pm</td> </tr><tr> <td>[[<code>\c</code><code>\P</code>]</td> <td>A porta TCP/IP atual ou o arquivo de soquete</td> </tr><tr> <td>[[<code>\R</code>]]</td> <td>A hora atual, em hora militar de 24 horas (0–23)</td> </tr><tr> <td>[[<code>\r</code>]]</td> <td>A hora atual, horário padrão de 12 horas (1–12)</td> </tr><tr> <td>[[<code>\S</code>]]</td> <td>Ponto e vírgula</td> </tr><tr> <td>[[<code>\s</code>]]</td> <td>Segundos do horário atual</td> </tr><tr> <td>[[<code>\T</code>]]</td> <td>Imprima um asterisco ([[<code>*</code>]]) se a sessão atual estiver dentro de um bloco de transação (a partir do MySQL 8.0.28)</td> </tr><tr> <td>[[<code>\t</code>]]</td> <td>Um caractere de tabulação</td> </tr><tr> <td>[[<code>\U</code>]]</td> <td><p>Seu código completo [[<code>\D</code><code>\P</code>]</em>@<em class="replaceable">[[<code>\D</code><code>\P</code>]</em></code>nome da conta</p></td> </tr><tr> <td>[[<code>\D</code><code>\R</code>]</td> <td>Seu nome de usuário</td> </tr><tr> <td>[[<code>\D</code><code>\r</code>]</td> <td>A versão do servidor</td> </tr><tr> <td>[[<code>\D</code><code>\S</code>]</td> <td>O dia atual da semana no formato de três letras (Seg, Ter, …)</td> </tr><tr> <td>[[<code>\D</code><code>\s</code>]</td> <td>O ano atual, quatro dígitos</td> </tr><tr> <td>[[<code>\D</code><code>\T</code>]</td> <td>O ano atual, com dois dígitos</td> </tr><tr> <td>[[<code>\D</code><code>*</code>]</td> <td>Um espaço</td> </tr><tr> <td>[[<code>\D</code><code>\t</code>]</td> <td>Um espaço (um espaço segue o backslash)</td> </tr><tr> <td>[[<code>\D</code><code>\U</code>]</td> <td>Citação única</td> </tr><tr> <td>[[<code>\d</code><code>\P</code>]</td> <td>"Dois aspas"</td> </tr><tr> <td>[[<code>\d</code><code>\P</code>]</td> <td>Um caractere literal de barra invertida [[<code>\d</code><code>\R</code>]</td> </tr><tr> <td>[[<code>\d</code><code>\r</code>]</em></code></td> <td><p> <em class="replaceable">[[<code>\d</code><code>\S</code>]</em>, para qualquer<span class="quote">“<span class="quote"><em class="replaceable">[[<code>\d</code><code>\s</code>]</em></span>”</span>não listado acima</p></td> </tr></tbody></table>

Você pode definir o prompt de várias maneiras:

- *Use uma variável de ambiente.* Você pode definir a variável de ambiente `MYSQL_PS1` com uma string de prompt. Por exemplo:

  ```
  export MYSQL_PS1="(\u@\h) [\d]> "
  ```

- *Use uma opção de linha de comando.* Você pode definir a opção `--prompt` na linha de comando para **mysql**. Por exemplo:

  ```
  $> mysql --prompt="(\u@\h) [\d]> "
  (user@host) [database]>
  ```

- *Use um arquivo de opções.* Você pode definir a opção `prompt` no grupo `[mysql]` de qualquer arquivo de opções do MySQL, como o arquivo `/etc/my.cnf` ou o arquivo `.my.cnf` no seu diretório de casa. Por exemplo:

  ```
  [mysql]
  prompt=(\\u@\\h) [\\d]>\_
  ```

  Neste exemplo, observe que os backslashes são duplicados. Se você definir o prompt usando a opção `prompt` em um arquivo de opções, é aconselhável duplicar os backslashes ao usar as opções de prompt especiais. Há alguma sobreposição no conjunto de opções de prompt permitidas e no conjunto de sequências de escape especiais reconhecidas em arquivos de opções. (As regras para sequências de escape em arquivos de opções estão listadas na Seção 6.2.2.2, “Usando Arquivos de Opções”). A sobreposição pode causar problemas se você usar backslashes simples. Por exemplo, `\s` é interpretado como um espaço em vez do valor atual dos segundos. O exemplo a seguir mostra como definir um prompt dentro de um arquivo de opções para incluir a hora atual no formato `hh:mm:ss>`:

  ```
  [mysql]
  prompt="\\r:\\m:\\s> "
  ```

- *Defina o prompt interativamente.* Você pode alterar o prompt interativamente usando o comando `prompt` (ou `\R`). Por exemplo:

  ```
  mysql> prompt (\u@\h) [\d]>_
  PROMPT set to '(\u@\h) [\d]>_'
  (user@host) [database]>
  (user@host) [database]> prompt
  Returning to default PROMPT of mysql>
  mysql>
  ```
