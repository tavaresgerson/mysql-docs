#### 6.5.1.2 Comandos do Cliente `mysql`

O `mysql` envia cada instrução SQL que você emite para o servidor a ser executada. Há também um conjunto de comandos que o próprio `mysql` interpreta. Para obter uma lista desses comandos, digite `help` ou `\h` no prompt `mysql>`:

```
mysql> help

List of all MySQL commands:
Note that all text commands must be first on line and end with ';'
?         (\?) Synonym for `help'.
clear     (\c) Clear the current input st nt.
connect   (\r) Reconnect to the server. Optional arguments are db and host.
delimiter (\d) Set st nt delimiter.
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
sy    (\!) Execute a sy shell command.
tee       (\T) Set outfile [to_outfile]. Append everything into given
               outfile.
use       (\u) Use another database. Takes database name as argument.
charset   (\C) Switch to another charset. Might be needed for processing
               binlog with multi-byte charsets.
warnings  (\W) Show warnings after every st nt.
nowarning (\w) Don't show warnings after every st nt.
resetconnection(\x) Clean session context.
query_attributes Sets string parameters (name1 value1 name2 value2 ...)
for the next query to pick up.
ssl_session_data_print Serializes the current SSL session data to stdout
or file.

For server side help, type 'help contents'
```

Se o `mysql` for invocado com a opção `--binary-mode`, todos os comandos do `mysql` serão desabilitados, exceto `charset` e `delimiter` no modo não interativo (para entrada canalizada para o `mysql` ou carregada usando o comando `source`). A partir do MySQL 8.4.6, a opção `--commands` pode ser usada para habilitar ou desabilitar todos os comandos, exceto `/C`, `delimiter` e `use`.

Cada comando tem uma forma longa e curta. A forma longa não é case-sensitive; a forma curta é. A forma longa pode ser seguida por um terminator opcional de colon, mas a forma curta não deve.

O uso de comandos de forma curta dentro de comentários de várias linhas `/* ... */` não é suportado. Os comandos de forma curta funcionam dentro de comentários de versão de linha única `/*! ... */`, assim como os comentários de dicas de otimização `/*+ ... */`, que são armazenados em definições de objeto. Se houver preocupação de que os comentários de dicas de otimização possam ser armazenados em definições de objeto para que os arquivos de dump, ao serem recarregados com o `mysql`, resultem na execução desses comandos, invoque o `mysql` com a opção `--binary-mode` ou use um cliente de re carregamento diferente do `mysql`.

* `help [arg]`, `\h [arg]`, `\? [arg]`, `? [arg]`

  Exibir uma mensagem de ajuda listando os comandos `mysql` disponíveis.

  Se você fornecer um argumento para o comando `help`, o `mysql` usa-o como uma string de busca para acessar a ajuda do lado do servidor a partir do conteúdo do Manual de Referência do MySQL. Para mais informações, consulte a Seção 6.5.1.4, “Ajuda do Lado do Servidor do Cliente `mysql`”.
* `charset charset_name`, `\C charset_name`

Altere o conjunto de caracteres padrão e execute um comando `SET NAMES`. Isso permite que o conjunto de caracteres seja sincronizado no cliente e no servidor se o `mysql` for executado com o auto-reconexão habilitada (o que não é recomendado), porque o conjunto de caracteres especificado é usado para reconexões.
* `clear`, `\c`

  Limpe a entrada atual. Use isso se você mudar de ideia sobre a execução do comando `SET NAMES` que você está inserindo.
* `connect [db_name [host_name]]`, `\r [db_name [host_name]]`

  Reconecte-se ao servidor. Os argumentos opcionais de nome de banco de dados e nome do host podem ser fornecidos para especificar o banco de dados padrão ou o host onde o servidor está em execução. Se omitidos, os valores atuais são usados.

  Se o comando `connect` especificar um argumento de nome de host, esse nome de host tem precedência sobre qualquer opção `--dns-srv-name` dada no início do `mysql` para especificar um registro DNS SRV.
* `delimiter str`, `\d str`

  Altere a string que o `mysql` interpreta como o separador entre os comandos SQL. O padrão é o caractere colon (`;`).

  A string de delimitador pode ser especificada como um argumento não citado ou citado na linha de comando do comando `delimiter`. A citação pode ser feita com caracteres de aspas simples (`'`), aspas duplas (`"`) ou caracteres de barra invertida (`` ` ``). Para incluir uma aspa dentro de uma string citada, ou cite a string com um caractere de aspa diferente ou escape a aspa com o caractere de barra invertida (`\`). A barra invertida deve ser evitada fora de strings citadas, pois é o caractere de escape para o MySQL. Para um argumento não citado, o delimitador é lido até o primeiro espaço ou o final da linha. Para um argumento citado, o delimitador é lido até a aspa correspondente na linha.

`mysql` interpreta instâncias da string delimitador como um delimitador st nt em qualquer lugar que ocorra, exceto dentro de strings com aspas. Tenha cuidado ao definir um delimitador que possa ocorrer dentro de outras palavras. Por exemplo, se você definir o delimitador como `X`, não é possível usar a palavra `INDEX` em st nts. `mysql` interpreta isso como `INDE` seguido do delimitador `X`.

Quando o delimitador reconhecido por `mysql` é definido para algo diferente do padrão `;`, instâncias desse caractere são enviadas ao servidor sem interpretação. No entanto, o próprio servidor ainda interpreta `;` como um delimitador st nt e processa st nts de acordo. Esse comportamento no lado do servidor entra em jogo para a execução de múltiplos st nts (veja Suporte à Execução de Múltiplos st nts), e para a análise do corpo de procedimentos armazenados, funções, gatilhos e eventos (veja Seção 27.1, “Definindo Programas Armazenados”).
* `edit`, `\e`

  Editar o st nt de entrada atual. `mysql` verifica os valores das variáveis de ambiente `EDITOR` e `VISUAL` para determinar qual editor usar. O editor padrão é `vi` se nenhuma das variáveis for definida.

  O comando `edit` funciona apenas no Unix.
* `ego`, `\G`

  Enviar o st nt atual ao servidor para ser executado e exibir o resultado usando o formato vertical.
* `exit`, `\q`

  Sair do `mysql`.
* `go`, `\g`

  Enviar o st nt atual ao servidor para ser executado.
* `nopager`, `\n`

  Desabilitar a exibição de páginas de saída. Veja a descrição para `pager`.

  O comando `nopager` funciona apenas no Unix.
* `notee`, `\t`

  Desabilitar a cópia de saída para o arquivo tee. Veja a descrição para `tee`.
* `nowarning`, `\w`

  Desabilitar a exibição de avisos após cada st nt.
* `pager [comando]`, `\P [comando]`

Ative a exibição de páginas de saída. Ao usar a opção `--pager` ao invocar o `mysql`, é possível navegar ou pesquisar os resultados das consultas em modo interativo com programas Unix, como `less`, `more` ou qualquer outro programa semelhante. Se você não especificar um valor para a opção, o `mysql` verifica o valor da variável de ambiente `PAGER` e define o pager para isso. A funcionalidade do pager funciona apenas em modo interativo.

A exibição de páginas de saída pode ser ativada interativamente com o comando `pager` e desativada com `nopager`. O comando aceita um argumento opcional; se fornecido, o programa de exibição é definido para ele. Sem argumento, o pager é definido para o pager que foi definido na linha de comando, ou `stdout` se nenhum pager foi especificado.

A exibição de páginas de saída funciona apenas em Unix porque usa a função `popen()`, que não existe no Windows. Para o Windows, a opção `tee` pode ser usada em vez disso para salvar a saída da consulta, embora não seja tão conveniente quanto o `pager` para navegar pela saída em algumas situações.
* `print`, `\p`

  Imprima o estado atual da entrada sem executá-lo.
* `prompt [str]`, `\R [str]`

  Reconfigura o prompt do `mysql` para a string fornecida. As sequências de caracteres especiais que podem ser usadas no prompt são descritas mais adiante nesta seção.

  Se você especificar o comando `prompt` sem argumento, o `mysql` redefini o prompt para o padrão `mysql>`.
* `query_attributes nome valor [nome valor ...]`

  Defina atributos de consulta que se aplicam à próxima consulta enviada ao servidor. Para discussão sobre o propósito e uso dos atributos de consulta, consulte  Seção 11.6, “Atributos de Consulta”.

  O comando `query_attributes` segue estas regras:

+ O formato e as regras de citação para nomes e valores de atributos são os mesmos que para o comando `delimiter`.
+ O comando permite até 32 pares de nomes e valores de atributos. Os nomes e valores podem ter até 1024 caracteres. Se um nome for fornecido sem um valor, ocorre um erro.
+ Se vários comandos `query_attributes` forem emitidos antes da execução da consulta, apenas o último comando será aplicado. Após enviar a consulta, o `mysql` limpa o conjunto de atributos.
+ Se vários atributos forem definidos com o mesmo nome, um comando `ts` para recuperar o valor do atributo terá um resultado indefinido.
+ Um atributo definido com um nome `ty` não pode ser recuperado por nome.
+ Se ocorrer uma reconexão enquanto o `mysql` executa a consulta, o `mysql` restaura os atributos após a reconexão, para que a consulta possa ser executada novamente com os mesmos atributos.
* `quit`, `\q`

  Sair do `mysql`.
* `rehash`, `\#`

  Recrie o hash de complementação que permite a complementação de nomes de banco de dados, tabela e coluna enquanto você está digitando st nts. (Veja a descrição da opção `--auto-rehash`.
* `resetconnection`, `\x`

  Reinicie a conexão para limpar o estado da sessão. Isso inclui a limpeza de quaisquer atributos de consulta atuais definidos usando o comando `query_attributes`.

  Reiniciar uma conexão tem efeitos semelhantes a `mysql_change_user()` ou a um auto-reconexão, exceto que a conexão não é fechada e reaberta, e a reautenticação não é feita. Veja `mysql_change_user()`, e Controle de Reconexão Automática.

Este exemplo mostra como o `resetconnection` limpa um valor mantido no estado da sessão:

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
* `source file_name`, `\. file_name`

  Leia o arquivo nomeado e executa os st nts contidos nele. Em Windows, especifique os separadores de nomes de caminho como `/` ou `\\`.

  Os caracteres de citação são considerados parte do próprio nome do arquivo. Para melhores resultados, o nome não deve incluir caracteres de espaço.
* `ssl_session_data_print [file_name]`

Obtém, serializa e, opcionalmente, armazena os dados da sessão de uma conexão bem-sucedida. O nome do arquivo e os argumentos opcionais podem ser fornecidos para especificar o arquivo onde os dados serializados da sessão serão armazenados. Se omitidos, os dados da sessão são impressos no `stdout`.

Se a sessão MySQL estiver configurada para reutilização, os dados da sessão do arquivo são deserializados e fornecidos ao comando `connect` para reconectar. Quando a sessão é reutilizada com sucesso, o comando `status` contém uma linha mostrando `Sessão SSL reutilizada: true` enquanto o cliente é reconectado ao servidor.
* `status`, `\s`

  Forneça informações de status sobre a conexão e o servidor que você está usando. Se você estiver executando com `--safe-updates` habilitado, o `status` também imprime os valores das variáveis `mysql` que afetam suas consultas.
* `sy command`, `\! command`

  Execute o comando fornecido usando seu interpretador de comandos padrão.

  No MySQL 8.4.3 e versões posteriores, este comando pode ser desabilitado iniciando o cliente com `--sy command=OFF` ou `--skip-sy command`.
* `tee [file_name]`, `\T [file_name]`

  Usando a opção `--tee` ao invocar o `mysql`, você pode registrar as entradas e suas saídas. Todos os dados exibidos na tela são anexados a um arquivo especificado. Isso pode ser muito útil para fins de depuração também. O `mysql` esvazia os resultados para o arquivo após cada entrada, pouco antes de imprimir seu próximo prompt. A funcionalidade `tee` funciona apenas no modo interativo.

  Você pode habilitar essa funcionalidade interativamente com o comando `tee`. Sem um parâmetro, o arquivo anterior é usado. O arquivo `tee` pode ser desativado com o comando `notee`. Executar `tee` novamente reativa a logagem.
* `use db_name`, `\u db_name`

  Use *`db_name`* como a base de dados padrão.
* `warnings`, `\W`

  Ative a exibição de avisos após cada entrada (se houver).

Aqui estão algumas dicas sobre o comando `pager`:

* Você pode usá-lo para escrever em um arquivo e os resultados vão apenas para o arquivo:

  ```
  mysql> pager cat > /tmp/log.txt
  ```

Você também pode passar quaisquer opções para o programa que deseja usar como seu pager:

```
  mysql> pager less -n -i -S
  ```
* No exemplo anterior, observe a opção `-S`. Ela pode ser muito útil para navegar por resultados de consultas amplos. Às vezes, um conjunto de resultados muito amplo é difícil de ler na tela. A opção `-S` para o `less` pode tornar o conjunto de resultados muito mais legível, pois você pode rolar horizontalmente usando as teclas seta para a esquerda e seta para a direita. Você também pode usar `-S` interativamente dentro do `less` para ativar e desativar o modo de navegação horizontal. Para mais informações, leia a página do manual do `less`:

```
  man less
  ```
* As opções `-F` e `-X` podem ser usadas com o `less` para fazê-lo sair se a saída caber em uma tela, o que é conveniente quando não é necessário rolar:

```
  mysql> pager less -n -i -S -F -X
  ```
* Você pode especificar comandos de pager muito complexos para lidar com a saída da consulta:

```
  mysql> pager cat | tee /dr1/tmp/res.txt \
            | tee /dr2/tmp/res2.txt | less -n -i -S
  ```

Neste exemplo, o comando enviaria os resultados da consulta para dois arquivos em dois diretórios diferentes em dois diretórios de arquivos montados em `/dr1` e `/dr2`, e ainda exibiriam os resultados na tela usando o programa `less`.

Você também pode combinar as funções `tee` e `pager`. Ative o arquivo `tee` e defina o `pager` como `less`, e você poderá navegar pelos resultados usando o programa `less` e ainda ter tudo anexado a um arquivo ao mesmo tempo. A diferença entre o `tee` Unix usado com o comando `pager` e o comando `tee` embutido do `mysql` é que o `tee` embutido funciona mesmo se você não tiver o `tee` Unix disponível. O `tee` embutido também registra tudo o que é impresso na tela, enquanto o `tee` Unix usado com `pager` não registra tanto. Além disso, o registro de arquivos `tee` pode ser ativado e desativado interativamente dentro do `mysql`. Isso é útil quando você deseja registrar algumas consultas em um arquivo, mas não outras.

O comando `prompt` reconfigura o prompt padrão `mysql>`. A string para definir o prompt pode conter as seguintes sequências especiais.

<table><thead><tr> <th>Opção</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>\C</code></td> <td>O identificador atual da conexão</td> </tr><tr> <td><code>\c</code></td> <td>Um contador que é incrementado em nts para cada st nt emitido</td> </tr><tr> <td><code>\D</code></td> <td>A data atual completa</td> </tr><tr> <td><code>\d</code></td> <td>A base de dados padrão</td> </tr><tr> <td><code>\h</code></td> <td>O host do servidor</td> </tr><tr> <td><code>\l</code></td> <td>O delimitador atual</td> </tr><tr> <td><code>\m</code></td> <td>Minutos da hora atual</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere de nova linha</td> </tr><tr> <td><code>\O</code></td> <td>O mês atual no formato de três letras (Jan, Feb, etc.)</td> </tr><tr> <td><code>\o</code></td> <td>O mês atual no formato numérico</td> </tr><tr> <td><code>\P</code></td> <td>am/pm</td> </tr><tr> <td><code>\p</code></td> <td>A porta TCP/IP atual ou o arquivo socket</td> </tr><tr> <td><code>\R</code></td> <td>A hora atual, em hora militar de 24 horas (0–23)</td> </tr><tr> <td><code>\r</code></td> <td>A hora atual, em hora padrão de 12 horas (1–12)</td> </tr><tr> <td><code>\S</code></td> <td colon</td> </tr><tr> <td><code>\s</code></td> <td>Segundos da hora atual</td> </tr><tr> <td><code>\T</code></td> <td>Imprima um asterisco (<code>*</code>) se a sessão atual estiver dentro de um bloco de transação</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere de tabulação</td> </tr><tr> <td><code>\U</code></td> <td><p> Seu nome de usuário completo <code>user_name</code> <code>host_name</code> </p></td> </tr><tr> <td><code>\u</code></td> <td>Seu nome de usuário</td> </tr><tr> <td><code>\v</code></td> <td>A versão do servidor</td> </tr><tr> <td><code>\w</code></td> <td>O dia da semana atual no formato de três letras (Mon, Tue, etc.)</td> </tr><tr> <td><code>\Y</code></td> <td>O ano atual, com quatro dígitos</td> </tr><tr> <td><code>\y</code></td> <td>O ano atual, com dois dígitos</td> </tr><tr> <td><code>\_</code></td> <td>Um espaço</td> </tr><tr> <td><code>\ </code></td> <td>Um espaço (um espaço segue a barra invertida)</td> </tr><tr> <td><code>\'</code></td> <td>Uma citação simples</td> </tr><tr> <td><code>\"</code></td> <td>Uma citação dupla</td> </tr><tr> <td><code>\\</code></td> <td>Um caractere de barra invertida literal</td> </tr><tr> <td> <code><code>x</code> </code></td> <td><p> <code>x</code> , para um <code>x</code> não listado acima </p></td> </tr></tbody></table>

Você pode definir o prompt de várias maneiras:

* *Use uma variável de ambiente.* Você pode definir a variável de ambiente `MYSQL_PS1` com uma string de prompt. Por exemplo:

  ```
  export MYSQL_PS1="(\u@\h) [\d]> "
  ```
* *Use uma opção de linha de comando.* Você pode definir a opção `--prompt` na linha de comando com `mysql`. Por exemplo:

  ```
  $> mysql --prompt="(\u@\h) [\d]> "
  (user@host) [database]>
  ```
* *Use um arquivo de opção.* Você pode definir a opção `prompt` no grupo `[mysql]` de qualquer arquivo de opção MySQL, como `/etc/my.cnf` ou o arquivo `.my.cnf` no seu diretório de casa. Por exemplo:

  ```
  [mysql]
  prompt=(\\u@\\h) [\\d]>\\_
  ```

  Neste exemplo, observe que os backslashes são duplicados. Se você definir o prompt usando a opção `prompt` em um arquivo de opção, é aconselhável duplicar os backslashes ao usar as opções de prompt especiais. Há alguma sobreposição no conjunto de opções de prompt permitidas e no conjunto de sequências de escape especiais que são reconhecidas em arquivos de opção. (As regras para sequências de escape em arquivos de opção estão listadas na Seção 6.2.2.2, “Usando Arquivos de Opção”.) A sobreposição pode causar problemas se você usar backslashes simples. Por exemplo, `\s` é interpretado como um espaço em vez do valor atual de segundos. O exemplo a seguir mostra como definir um prompt dentro de um arquivo de opção para incluir a hora atual no formato `hh:mm:ss>`:

  ```
  [mysql]
  prompt="\\r:\\m:\\s> "
  ```
* *Defina o prompt interativamente.* Você pode alterar o prompt interativamente usando o comando `prompt` (ou `\R`). Por exemplo:

  ```
  mysql> prompt (\u@\h) [\d]>\_
  PROMPT set to '(\u@\h) [\d]>\_'
  (user@host) [database]>
  (user@host) [database]> prompt
  Returning to default PROMPT of mysql>
  mysql>
  ```