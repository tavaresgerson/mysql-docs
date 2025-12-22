#### 6.5.1.2 comandos do cliente mysql

`mysql` envia cada instrução SQL que você emite para o servidor para ser executado. Há também um conjunto de comandos que `mysql` interpreta. Para uma lista desses comandos, digite `help` ou `\h` no prompt `mysql>`:

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

Se `mysql` é invocado com a opção `--binary-mode`, todos os comandos `mysql` são desativados exceto `charset` e `delimiter` em modo não interativo (para entrada canalizada para `mysql` ou carregada usando o comando `source`).

Cada comando tem uma forma longa e uma forma curta. A forma longa não é sensível a maiúsculas e minúsculas; a forma curta é. A forma longa pode ser seguida por um terminador de ponto e vírgula opcional, mas a forma curta não deve ser.

O uso de comandos de formulário curto dentro de comentários de várias linhas de `/* ... */` não é suportado. Os comandos de formulário curto funcionam dentro de comentários de versão de `/*! ... */` de uma única linha, assim como os comentários de sugestão de otimizador de `/*+ ... */`, que são armazenados em definições de objetos. Se houver uma preocupação de que comentários de sugestão de otimizador possam ser armazenados em definições de objetos para que os arquivos de descarga quando recarregados com `mysql` resultem na execução de tais comandos, invoque `mysql` com a opção `--binary-mode` ou use um cliente de recarga diferente do `mysql`.

- `help [arg]`, `\h [arg]`, `\? [arg]`, `? [arg]`

  Exibe uma mensagem de ajuda listando os comandos `mysql` disponíveis.

  Se você fornecer um argumento para o comando `help`, o `mysql` o usará como uma string de pesquisa para acessar a ajuda do lado do servidor a partir do conteúdo do Manual de Referência do MySQL. Para mais informações, consulte a Seção 6.5.1.4, Ajuda do lado do servidor do cliente do mysql.
- `charset charset_name`, `\C charset_name`

  Altere o conjunto de caracteres padrão e emita uma instrução `SET NAMES`. Isso permite que o conjunto de caracteres permaneça sincronizado no cliente e no servidor se `mysql` for executado com a reconexão automática ativada (o que não é recomendado), porque o conjunto de caracteres especificado é usado para reconexões.
- `clear`, `\c`

  Limpe a entrada atual. Use isso se você mudar de idéia sobre a execução da instrução que você está inserindo.
- `connect [db_name [host_name]]`, `\r [db_name [host_name]]`

  Reconectar ao servidor. Os argumentos opcionais nome de banco de dados e nome de host podem ser dados para especificar o banco de dados padrão ou o host onde o servidor está sendo executado. Se omitidos, os valores atuais são usados.

  Se o comando `connect` especificar um argumento de nome de host, esse host tem precedência sobre qualquer opção `--dns-srv-name` dada na inicialização do `mysql` para especificar um registro DNS SRV.
- `delimiter str`, `\d str`

  Alterar a string que `mysql` interpreta como o separador entre instruções SQL. O padrão é o caractere ponto e vírgula (`;`).

  A cadeia delimitadora pode ser especificada como um argumento não-citado ou citado na linha de comando `delimiter` . A citação pode ser feita com citação simples (`'`), citação dupla (`"`), ou caracteres de backtick (`` ` ``). Para incluir uma citação dentro de uma cadeia de citações, cite a cadeia com um caractere de citação diferente ou escape a citação com um caractere de backslash (`\`). O backslash deve ser evitado fora das cadeias de citações porque é o caractere de escape para o MySQL. Para um argumento não-citado, o delimitador é lido até o primeiro espaço ou o final da linha. Para um argumento citado, o delimitador é lido até a citação correspondente na linha.

  `mysql` interpreta instâncias da string delimitador como um delimitador de instrução onde quer que ocorra, exceto dentro de strings com aspas. Tenha cuidado ao definir um delimitador que possa ocorrer dentro de outras palavras. Por exemplo, se você definir o delimitador como `X`, não é possível usar a palavra `INDEX` em instruções. `mysql` interpreta isso como `INDE` seguido pelo delimitador `X`.

  Quando o delimitador reconhecido por `mysql` é definido para algo diferente do padrão de `;`, instâncias desse caractere são enviadas para o servidor sem interpretação. No entanto, o próprio servidor ainda interpreta `;` como um delimitador de instruções e processa instruções de acordo. Este comportamento no lado do servidor entra em jogo para execução de instruções múltiplas (ver Suporte de Execução de Instruções Múltiplas), e para analisar o corpo de procedimentos armazenados e funções, gatilhos e eventos (ver Seção 27.1,  Definindo Programas Armazenados).
- `edit`, `\e`

  Edite a instrução de entrada atual. `mysql` verifica os valores das variáveis de ambiente `EDITOR` e `VISUAL` para determinar qual editor usar. O editor padrão é **vi** se nenhuma das variáveis estiver definida.

  O comando `edit` funciona apenas no Unix.
- `ego`, `\G`

  Enviar a instrução atual para o servidor para ser executado e exibir o resultado usando o formato vertical.
- `exit`, `\q`

  Saída.
- `go`, `\g`

  Enviar a instrução atual para o servidor para ser executado.
- `nopager`, `\n`

  Desativar a paginação de saída. Veja a descrição de `pager`.

  O comando `nopager` funciona apenas no Unix.
- `notee`, `\t`

  Desativar a cópia de saída para o arquivo de início. Veja a descrição para `tee`.
- `nowarning`, `\w`

  Desativar a exibição de avisos após cada instrução.
- `pager [command]`, `\P [command]`

  Ativar o paging de saída. Ao usar a opção `--pager` quando você invoca `mysql`, é possível navegar ou pesquisar resultados de consulta no modo interativo com programas Unix como **less**, **more**, ou qualquer outro programa semelhante. Se você não especificar nenhum valor para a opção, `mysql` verifica o valor da variável de ambiente `PAGER` e define o pager para isso. A funcionalidade do pager funciona apenas no modo interativo.

  O paging de saída pode ser ativado interativamente com o comando `pager` e desativado com `nopager`. O comando toma um argumento opcional; se for dado, o programa de paging é definido para isso. Sem argumento, o pager é definido para o pager que foi definido na linha de comando, ou `stdout` se nenhum pager foi especificado.

  A paginação de saída funciona apenas no Unix porque usa a função `popen()`, que não existe no Windows. Para o Windows, a opção `tee` pode ser usada em vez disso para salvar a saída da consulta, embora não seja tão conveniente quanto `pager` para navegar na saída em algumas situações.
- `print`, `\p`

  Imprima a instrução de entrada atual sem executá-la.
- `prompt [str]`, `\R [str]`

  Reconfigure o prompt `mysql` para a cadeia de caracteres dada. As sequências de caracteres especiais que podem ser usadas no prompt são descritas mais adiante nesta seção.

  Se você especificar o comando `prompt` sem argumento, `mysql` redefine o prompt para o padrão de `mysql>`.
- `query_attributes name value [name value ...]`

  Defina os atributos de consulta que se aplicam à próxima consulta enviada ao servidor.

  O comando `query_attributes` segue estas regras:

  - O formato e as regras de citação para os nomes e valores de atributos são os mesmos que para o comando `delimiter`.
  - O comando permite até 32 pares de atributo nome/valor. Nomes e valores podem ter até 1024 caracteres de comprimento. Se um nome for dado sem um valor, ocorre um erro.
  - Se vários comandos `query_attributes` forem emitidos antes da execução da consulta, apenas o último comando será aplicado. Após o envio da consulta, `mysql` limpa o conjunto de atributos.
  - Se vários atributos forem definidos com o mesmo nome, as tentativas de recuperar o valor do atributo terão um resultado indefinido.
  - Um atributo definido com um nome vazio não pode ser recuperado por nome.
  - Se ocorrer uma reconexão enquanto `mysql` executa a consulta, `mysql` restaura os atributos após a reconexão para que a consulta possa ser executada novamente com os mesmos atributos.
- `quit`, `\q`

  Saída.
- `rehash`, `\#`

  Reconstrua o hash de conclusão que permite a conclusão do nome do banco de dados, da tabela e da coluna enquanto você está inserindo instruções. (Veja a descrição para a opção `--auto-rehash`.)
- `resetconnection`, `\x`

  Reinicie a conexão para limpar o estado da sessão. Isso inclui limpar quaisquer atributos de consulta atuais definidos usando o comando `query_attributes`.

  A redefinição de uma conexão tem efeitos semelhantes a `mysql_change_user()` ou uma reconexão automática, exceto que a conexão não é fechada e reaberta, e a reautenticação não é feita.

  Este exemplo mostra como `resetconnection` limpa um valor mantido no estado de sessão:

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

  Leia o arquivo nomeado e executa as instruções nele contidas. No Windows, especifique separadores de nome de caminho como `/` ou `\\`.

  Os caracteres de citação são tomados como parte do próprio nome do arquivo. Para melhores resultados, o nome não deve incluir caracteres de espaço.
- `ssl_session_data_print [file_name]`

  Obtém, serializa e opcionalmente armazena os dados de sessão de uma conexão bem-sucedida. O nome de arquivo e os argumentos opcionais podem ser dados para especificar o arquivo para armazenar dados de sessão serializados. Se omitido, os dados de sessão são impressos em `stdout`.

  Se a sessão MySQL for configurada para reutilização, os dados da sessão do arquivo são deserializados e fornecidos ao comando `connect` para reconectar. Quando a sessão é reutilizada com sucesso, o comando `status` contém uma linha mostrando `SSL session reused: true` enquanto o cliente permanece reconectado ao servidor.
- `status`, `\s`

  Forneça informações de status sobre a conexão e o servidor que você está usando. Se você estiver executando com o `--safe-updates` habilitado, o `status` também imprimirá os valores para as variáveis `mysql` que afetam suas consultas.
- `system command`, `\! command`

  Execute o comando dado usando o seu interpretador de comando padrão.

  No MySQL 8.4.3 e posterior, este comando pode ser desativado iniciando o cliente com `--system-command=OFF` ou `--skip-system-command`.
- `tee [file_name]`, `\T [file_name]`

  Ao usar a opção `--tee` quando você invoca `mysql`, você pode registrar instruções e suas saídas. Todos os dados exibidos na tela são anexados a um determinado arquivo. Isso pode ser muito útil para fins de depuração também. `mysql` envia os resultados para o arquivo após cada instrução, logo antes de imprimir seu próximo prompt. A funcionalidade Tee funciona apenas no modo interativo.

  Você pode ativar esse recurso interativamente com o comando `tee`. Sem um parâmetro, o arquivo anterior é usado. O arquivo `tee` pode ser desativado com o comando `notee`.
- `use db_name`, `\u db_name`

  Utilize `db_name` como base de dados padrão.
- `warnings`, `\W`

  Ativar a exibição de avisos após cada instrução (se houver).

Aqui estão algumas dicas sobre o comando `pager`:

- Você pode usá-lo para escrever em um arquivo e os resultados vão apenas para o arquivo:

  ```
  mysql> pager cat > /tmp/log.txt
  ```

  Você também pode passar quaisquer opções para o programa que você deseja usar como seu pager:

  ```
  mysql> pager less -n -i -S
  ```
- No exemplo anterior, observe a opção `-S`. Você pode achá-la muito útil para navegar em resultados de pesquisa amplos. Às vezes, um conjunto de resultados muito amplo é difícil de ler na tela. A opção `-S` para \*\* menos\*\* pode tornar o conjunto de resultados muito mais legível porque você pode rolar horizontalmente usando as teclas de seta esquerda e direita. Você também pode usar `-S` interativamente dentro de \*\* menos\*\* para ativar e desativar o modo de navegação horizontal. Para mais informações, leia a página do manual **less**:

  ```
  man less
  ```
- As opções `-F` e `-X` podem ser usadas com **less** para fazer com que ela saia se a saída se encaixar em uma tela, o que é conveniente quando não é necessário rolar:

  ```
  mysql> pager less -n -i -S -F -X
  ```
- Você pode especificar comandos de pager muito complexos para lidar com a saída de consulta:

  ```
  mysql> pager cat | tee /dr1/tmp/res.txt \
            | tee /dr2/tmp/res2.txt | less -n -i -S
  ```

  Neste exemplo, o comando enviaria os resultados da consulta para dois arquivos em dois diretórios diferentes em dois sistemas de arquivos diferentes montados em `/dr1` e `/dr2`, mas ainda exibiria os resultados na tela usando **less**.

Você também pode combinar as funções `tee` e `pager`. Ter um arquivo `tee` habilitado e o `pager` definido como **less**, e você pode navegar pelos resultados usando o programa **less** e ainda ter tudo anexado em um arquivo ao mesmo tempo. A diferença entre o Unix `tee` usado com o comando `pager` e o comando `tee` incorporado é que o `tee` incorporado funciona mesmo que você não tenha o Unix \*\*\*\* disponível. O `tee` incorporado também registra tudo o que é impresso na tela, enquanto o arquivo Unix **tee** usado com `pager` não faz exatamente isso. Além disso, o registo de logs dentro de alguns arquivos `tee` e outros não pode ser muito útil quando você deseja desligar interativamente, mas isso não pode ser muito útil quando você deseja desligar um arquivo PH\_CODE.

O comando `prompt` reconfigura o prompt padrão `mysql>`. A string para definir o prompt pode conter as seguintes sequências especiais.

<table><col style="width: 15%"/><col style="width: 75%"/><thead><tr> <th>Opção</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>\P</code>]</td> <td>Identificador de conexão actual</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\P</code>]</td> <td>Um contador que aumenta para cada declaração que você emite</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\R</code>]</td> <td>A data corrente completa</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\r</code>]</td> <td>Base de dados padrão</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\S</code>]</td> <td>O servidor de hospedagem</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\s</code>]</td> <td>O delimitador de corrente</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\T</code>]</td> <td>Minutos do tempo atual</td> </tr><tr> <td>[[PH_HTML_CODE_<code>*</code>]</td> <td>Um personagem de linha nova</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\t</code>]</td> <td>O mês em curso em formato de três letras (janeiro, fevereiro, ...)</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\U</code>]</td> <td>O mês em curso em formato numérico</td> </tr><tr> <td>[[<code>\P</code>]]</td> <td>am/pm</td> </tr><tr> <td>[[<code>\c</code><code>\P</code>]</td> <td>O arquivo de soquete ou porta TCP/IP atual</td> </tr><tr> <td>[[<code>\R</code>]]</td> <td>A hora atual, em tempo militar de 24 horas (023)</td> </tr><tr> <td>[[<code>\r</code>]]</td> <td>A hora atual, hora padrão de 12 horas (112)</td> </tr><tr> <td>[[<code>\S</code>]]</td> <td>ponto e vírgula</td> </tr><tr> <td>[[<code>\s</code>]]</td> <td>Segundos do tempo atual</td> </tr><tr> <td>[[<code>\T</code>]]</td> <td>Imprimir um asterisco ([[<code>*</code>]]) se a sessão atual estiver dentro de um bloco de transações</td> </tr><tr> <td>[[<code>\t</code>]]</td> <td>Um caracter de tabulação</td> </tr><tr> <td>[[<code>\U</code>]]</td> <td><p>O seu código HTML completo</em>Não ,<em>[[<code>\D</code><code>\P</code>]</em></code>Nome da conta</p></td> </tr><tr> <td>[[<code>\D</code><code>\R</code>]</td> <td>O seu nome de utilizador</td> </tr><tr> <td>[[<code>\D</code><code>\r</code>]</td> <td>A versão do servidor</td> </tr><tr> <td>[[<code>\D</code><code>\S</code>]</td> <td>O dia da semana em curso em formato de três letras (sexta-feira, quinta-feira, ...)</td> </tr><tr> <td>[[<code>\D</code><code>\s</code>]</td> <td>O ano em curso, quatro dígitos</td> </tr><tr> <td>[[<code>\D</code><code>\T</code>]</td> <td>O ano em curso, dois dígitos</td> </tr><tr> <td>[[<code>\D</code><code>*</code>]</td> <td>Um espaço .</td> </tr><tr> <td>[[<code>\D</code><code>\t</code>]</td> <td>Um espaço (um espaço segue a barra invertida)</td> </tr><tr> <td>[[<code>\D</code><code>\U</code>]</td> <td>Citação única</td> </tr><tr> <td>[[<code>\d</code><code>\P</code>]</td> <td>Citação dupla</td> </tr><tr> <td>[[<code>\d</code><code>\P</code>]</td> <td>Um caractere backslash literal [[<code>\d</code><code>\R</code>]</td> </tr><tr> <td>[[<code>\d</code><code>\r</code>]</em></code></td> <td><p> <em>[[<code>\d</code><code>\S</code>]</em>, para qualquer<span class="quote">“<span class="quote"><em>[[<code>\d</code><code>\s</code>]</em></span>”</span>não listados acima</p></td> </tr></tbody></table>

Pode definir o prompt de várias maneiras:

- - Use uma variável de ambiente. \* Você pode definir a variável de ambiente `MYSQL_PS1` para uma string de prompt. Por exemplo:

  ```
  export MYSQL_PS1="(\u@\h) [\d]> "
  ```
- - Use uma opção de linha de comando. \* Você pode definir a opção `--prompt` na linha de comando para `mysql`. Por exemplo:

  ```
  $> mysql --prompt="(\u@\h) [\d]> "
  (user@host) [database]>
  ```
- - Use um arquivo de opção. \* Você pode definir a opção `prompt` no grupo `[mysql]` de qualquer arquivo de opção do MySQL, como `/etc/my.cnf` ou o arquivo `.my.cnf` em seu diretório inicial. Por exemplo:

  ```
  [mysql]
  prompt=(\\u@\\h) [\\d]>\\_
  ```

  Neste exemplo, observe que os backslashes são duplicados. Se você definir o prompt usando a opção `prompt` em um arquivo de opções, é aconselhável dobrar os backslashes ao usar as opções especiais do prompt. Há alguma sobreposição no conjunto de opções de prompt permitidas e no conjunto de sequências especiais de escape que são reconhecidas em arquivos de opções. (As regras para sequências de escape em arquivos de opções estão listadas na Seção 6.2.2.2, Using Option Files.) A sobreposição pode causar problemas se você usar backslashes únicos. Por exemplo, `\s` é interpretado como um espaço em vez do valor de segundos atual. O exemplo a seguir mostra como definir um prompt dentro de um arquivo de opções para incluir o tempo atual no formato `hh:mm:ss>`:

  ```
  [mysql]
  prompt="\\r:\\m:\\s> "
  ```
- - Configure o prompt interativamente. \* Você pode alterar o prompt interativamente usando o comando `prompt` (ou `\R`). Por exemplo:

  ```
  mysql> prompt (\u@\h) [\d]>\_
  PROMPT set to '(\u@\h) [\d]>\_'
  (user@host) [database]>
  (user@host) [database]> prompt
  Returning to default PROMPT of mysql>
  mysql>
  ```
