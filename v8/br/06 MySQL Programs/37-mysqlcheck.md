### 6.5.3 `mysqlcheck` — Um Programa de Manutenção de Tabelas

O cliente `mysqlcheck` realiza a manutenção de tabelas: ele verifica, repara, otimiza ou analisa tabelas.

Cada tabela é bloqueada e, portanto, indisponível para outras sessões enquanto está sendo processada, embora, para operações de verificação, a tabela seja bloqueada com um bloqueio `READ`. As operações de manutenção de tabelas podem ser demoradas, especialmente para tabelas grandes. Se você usar a opção `--databases` ou `--all-databases` para processar todas as tabelas em uma ou mais bases de dados, uma invocação do `mysqlcheck` pode levar muito tempo. (Isso também é verdadeiro para o procedimento de atualização do MySQL se ele determinar que a verificação de tabelas é necessária, pois ele processa as tabelas da mesma maneira.)

O `mysqlcheck` deve ser usado quando o servidor `mysqld` estiver em execução, o que significa que você não precisa parar o servidor para realizar a manutenção de tabelas.

O `mysqlcheck` usa as instruções SQL `CHECK TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` e `OPTIMIZE TABLE` de uma maneira conveniente para o usuário. Ele determina quais instruções usar para a operação que você deseja realizar e, em seguida, envia as instruções ao servidor para serem executadas. Para obter detalhes sobre quais motores de armazenamento cada instrução funciona com, consulte as descrições dessas instruções na Seção 15.7.3, “Instruções de Manutenção de Tabelas”.

Nem todos os motores de armazenamento necessariamente suportam todas as quatro operações de manutenção. Nesse caso, uma mensagem de erro é exibida. Por exemplo, se `test.t` for uma tabela `MEMORY`, uma tentativa de verificá-la produz este resultado:

```
$> mysqlcheck test t
test.t
note     : The storage engine for the table doesn't support check
```

Se o `mysqlcheck` não conseguir reparar uma tabela, consulte a Seção 3.14, “Reestruturação ou reparo de tabelas ou índices” para estratégias de reparo manual de tabelas. Esse é o caso, por exemplo, para tabelas `InnoDB`, que podem ser verificadas com `CHECK TABLE`, mas não reparadas com `REPAIR TABLE`.

Cuidado

É melhor fazer um backup de uma tabela antes de realizar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. As possíveis causas incluem, mas não estão limitadas a, erros no sistema de arquivos.

Existem três maneiras gerais de invocar o `mysqlcheck`:

```
mysqlcheck [options] db_name [tbl_name ...]
mysqlcheck [options] --databases db_name ...
mysqlcheck [options] --all-databases
```

Se você não nomear nenhuma tabela após `db_name` ou se usar a opção `--databases` ou `--all-databases`, as inteiras bases de dados são verificadas.

O `mysqlcheck` tem uma característica especial em comparação com outros programas cliente. O comportamento padrão de verificação de tabelas (`--check`) pode ser alterado renomeando o binário. Se você deseja ter uma ferramenta que repara tabelas por padrão, basta fazer uma cópia do `mysqlcheck` chamada `mysqlrepair`, ou fazer um link simbólico para `mysqlcheck` chamado `mysqlrepair`. Se você invocar `mysqlrepair`, ele reparará as tabelas.

Os nomes mostrados na tabela a seguir podem ser usados para alterar o comportamento padrão do `mysqlcheck`.

<table>
   <thead>
      <tr>
         <th>Comando</th>
         <th>Significado</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>mysqlrepair</code></td>
         <td>A opção padrão é <code>--repair</code></td>
      </tr>
      <tr>
         <td><code>mysqlanalyze</code></td>
         <td>A opção padrão é <code>--analyze</code></td>
      </tr>
      <tr>
         <td><code>mysqloptimize</code></td>
         <td>A opção padrão é <code>--optimize</code></td>
      </tr>
   </tbody>
</table>

O `mysqlcheck` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlcheck]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.12 Opções do `mysqlcheck`**

<table>
   <thead>
      <tr>
         <th>Nome da Opção</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>--all-databases</code></td>
         <td>Ver todas as tabelas em todos os bancos de dados</td>
      </tr>
      <tr>
         <td><code>--all-in-1</code></td>
         <td>Execute uma única instrução para cada banco de dados que nomeia todas as tabelas desse banco de dados</td>
      </tr>
      <tr>
         <td><code>--analyze</code></td>
         <td>Analisar as tabelas</td>
      </tr>
      <tr>
         <td><code>--auto-repair</code></td>
         <td>Se uma tabela verificada estiver corrompida, corrija automaticamente</td>
      </tr>
      <tr>
         <td><code>--bind-address</code></td>
         <td>Use a interface de rede especificada para se conectar ao MySQL Server</td>
      </tr>
      <tr>
         <td><code>--character-sets-dir</code></td>
         <td>Diretório onde os conjuntos de caracteres são instalados</td>
      </tr>
      <tr>
         <td><code>--check</code></td>
         <td>Verificar as tabelas em busca de erros</td>
      </tr>
      <tr>
         <td><code>--check-only-changed</code></td>
         <td>Verificar apenas tabelas que foram alteradas desde a última verificação</td>
      </tr>
      <tr>
         <td><code>--check-upgrade</code></td>
         <td>Invocar <code>CHECK TABLE</code> com a opção <code>FOR UPGRADE</code></td>
      </tr>
      <tr>
         <td><code>--compress</code></td>
         <td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
      </tr>
      <tr>
         <td><code>--compression-algorithms</code></td>
         <td>Algoritmos de compressão permitidos para conexões com o servidor</td>
      </tr>
      <tr>
         <td><code>--databases</code></td>
         <td>Interpretar todos os argumentos como nomes de bancos de dados</td>
      </tr>
      <tr>
         <td><code>--debug</code></td>
         <td>Escrever log de depuração</td>
      </tr>
      <tr>
         <td><code>--debug-check</code></td>
         <td>Imprimir informações de depuração quando o programa sair</td>
      </tr>
      <tr>
         <td><code>--debug-info</code></td>
         <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sair</td>
      </tr>
      <tr>
         <td><code>--default-auth</code></td>
         <td>Plugin de autenticação a usar</td>
      </tr>
      <tr>
         <td><code>--default-character-set</code></td>
         <td>Especificar o conjunto de caracteres padrão</td>
      </tr>
      <tr>
         <td><code>--defaults-extra-file</code></td>
         <td>Ler o arquivo de opções nomeadas além dos arquivos de opções usuais</td>
      </tr>
      <tr>
         <td><code>--defaults-file</code></td>
         <td>Ler apenas o arquivo de opções nomeadas</td>
      </tr>
      <tr>
         <td><code>--defaults-group-suffix</code></td>
         <td>Valor do sufixo do grupo de opções</td>
      </tr>
      <tr>
         <td><code>--enable-cleartext-plugin</code></td>
         <td>Habilitar o plugin de autenticação em texto claro</td>
      </tr>
      <tr>
         <td><code>--extended</code></td>
         <td>Verificar e reparar tabelas</td>
      </tr>
      <tr>
         <td><code>--fast</code></td>
         <td>Verificar apenas tabelas que não foram fechadas corretamente</td>
      </tr>
      <tr>
         <td><code>--force</code></td>
         <td>Continuar mesmo se ocorrer um erro SQL</td>
      </tr>
      <tr>
         <td><code>--get-server-public-key</code></td>
         <td>Solicitar a chave pública RSA do servidor</td>
      </tr>
      <tr>
         <td><code>--help</code></td>
         <td>Mostrar mensagem de ajuda e sair</td>
      </tr>
      <tr>
         <td><code>--host</code></td>
         <td>Host em que o servidor MySQL está localizado</td>
      </tr>
      <tr>
         <td><code>--login-path</code></td>
         <td>Ler as opções de caminho de login a partir de .mylogin.cnf</td>
      </tr>
      <tr>
         <td><code>--medium-check</code></td>
         <td>Fazer uma verificação mais rápida do que uma operação <code>--extended</code></td>
      </tr>
      <tr>
         <td><code>--no-defaults</code></td>
         <td>Ler nenhum arquivo de opções</td>
      </tr>
      <tr>
         <td><code>--no-login-paths</code></td>
         <td>Não ler caminhos de login a partir do arquivo de caminhos de login</td>
      </tr>
      <tr>
         <td><code>--optimize</code></td>
         <td>Otimizar as tabelas</td>
      </tr>
      <tr>
         <td><code>--password</code></td>
         <td>Senha a usar ao

*  `--help`, `-?`

  <table>
   <tbody>
      <tr>
         <th>Formato de linha de comando</th>
         <td><code>--help</code></td>
      </tr>
   </tbody>
</table>

  Exibir uma mensagem de ajuda e sair.
*  `--all-databases`, `-A`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Ver todas as tabelas em todas as bases de dados. Isso é o mesmo que usar a opção `--databases` e nomear todas as bases de dados na linha de comando, exceto que as bases de dados `INFORMATION_SCHEMA` e `performance_schema` não são verificadas. Elas podem ser verificadas explicitamente nomeando-as com a opção `--databases`.
*  `--all-in-1`, `-1`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

  Em vez de emitir uma declaração para cada tabela, execute uma única declaração para cada base de dados que nomeia todas as tabelas dessa base de dados a serem processadas.
*  `--analyze`, `-a`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--analyze</code></td> </tr></tbody></table>

  Analisar as tabelas.
*  `--auto-repair`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-repair</code></td> </tr></tbody></table>

  Se uma tabela verificada estiver corrompida, corrija automaticamente. Quaisquer reparos necessários são feitos após todas as tabelas terem sido verificadas.
*  `--bind-address=ip_address`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.
*  `--character-sets-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.
*  `--check`, `-c`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--check</code></td> </tr></tbody></table>

  Verifique as tabelas em busca de erros. Esta é a operação padrão.
*  `--check-only-changed`, `-C`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--check-only-changed</code></td> </tr></tbody></table>

  Verifique apenas as tabelas que foram alteradas desde a última verificação ou que não foram fechadas corretamente.
*  `--check-upgrade`, `-g`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--check-upgrade</code></td> </tr></tbody></table>

  Invoque `CHECK TABLE` com a opção `FOR UPGRADE` para verificar as tabelas em busca de incompatibilidades com a versão atual do servidor.
*  `--compress`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 6.2.8, “Controle de compressão de conexão”.

  Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Veja Configurando a compressão de conexão legada.
*  `--compression-algorithms=value`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><code>zlib</code><code>zstd</code><code>uncompressed</code></td> </tr></tbody></table>

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

  Para mais informações, veja a Seção 6.2.8, “Controle de compressão de conexão”.
*  `--databases`, `-B`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--databases</code></td> </tr></tbody></table>

Processar todas as tabelas nos bancos de dados nomeados. Normalmente, o `mysqlcheck` trata o argumento de nome no formato de linha de comando como o nome do banco de dados e quaisquer nomes subsequentes como nomes de tabelas. Com esta opção, ele trata todos os argumentos de nome como nomes de bancos de dados.
*  `--debug[=debug_options]`, `-# [debug_options]`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Escrever um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_arquivo`. O valor padrão é `d:t:o`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--debug-check`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprimir algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--debug-info`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--default-character-set=charset_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”.
*  `--defaults-extra-file=file_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Leia este arquivo de opções após o arquivo de opções globais, mas (no Unix) antes do arquivo de opções do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.
*  `--defaults-file=file_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas o arquivo de opções fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.
*  `--defaults-group-suffix=str`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, `mysqlcheck` normalmente lê os grupos `[client]` e `[mysqlcheck]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, `mysqlcheck` também lê os grupos `[client_other]` e `[mysqlcheck_other]`.

Para obter informações adicionais sobre esta e outras opções de arquivo, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos Opção-File”.
*  `--extended`, `-e`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--extended</code></td> </tr></tbody></table>

  Se você estiver usando esta opção para verificar tabelas, ela garante que elas sejam 100% consistentes, mas leva muito tempo.

  Se você estiver usando esta opção para reparar tabelas, ela executa uma reparação estendida que pode não apenas levar muito tempo para ser executada, mas também pode gerar muitas linhas de lixo!
*  `--default-auth=plugin`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Consulte a Seção 8.2.17, “Autenticação Personalizável”.
*  `--enable-cleartext-plugin`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Ative o plugin de autenticação em texto claro `mysql_clear_password`.
*  `--fast`, `-F`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--fast</code></td> </tr></tbody></table>

  Verifique apenas tabelas que não foram fechadas corretamente.
*  `--force`, `-f`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--force</code></td> </tr></tbody></table>

  Continuar mesmo se ocorrer um erro SQL.
*  `--get-server-public-key`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr></tbody></table>

Solicitar a chave pública do servidor necessária para a troca de senhas baseada em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação SHA-2 Pluggable”. *  `--host=host_name`, `-h host_name`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

Conectar-se ao servidor MySQL no host fornecido. *  `--login-path=name`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Ler opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contêm opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário `mysql_config_editor`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”. *  `--no-login-paths`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

Ignora a leitura de opções do arquivo de caminho de login.

Consulte `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de opções de arquivo”.
* `--medium-check`, `-m`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--medium-check</code></td> </tr></tbody></table>

  Faça uma verificação mais rápida do que uma operação `--extended`. Isso encontra apenas 99,99% de todos os erros, o que deve ser suficiente na maioria dos casos.
* `--no-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário `mysql_config_editor`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de opções de arquivo”.
* `--optimize`, `-o`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--optimize</code></td> </tr></tbody></table>

  Otimize as tabelas.
* `--password[=password]`, `-p[password]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysqlcheck` solicitará uma senha. Se fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

Para especificar explicitamente que não há senha e que o `mysqlcheck` não deve solicitar uma, use a opção `--skip-password`.
*  `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysqlcheck` solicitará uma. Se for fornecido, não deve haver *espaço* entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o `mysqlcheck` não deve solicitar uma, use a opção `--skip-password1`.

   `--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.
*  `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para detalhes.
*  `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para detalhes.
*  `--pipe`, `-W`

  <table><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
*  `--plugin-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o `mysqlcheck` não o encontrar.
*  `--port=port_num`, `-P port_num`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Número</td> </tr><tr><th>Valor padrão</th> <td><code>3306</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado.
*  `--print-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

  Para obter informações adicionais sobre esta e outras opções de arquivos de opções, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
*  `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--protocol=type</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[ver texto]</code></td> </tr><tr><th>Valores válidos</th> <td><code>TCP</code><code>SOCKET</code><code>PIPE</code><code>MEMORY</code></td> </tr></tbody></table>

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.
*  `--quick`, `-q`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--quick</code></td> </tr></tbody></table>

  Se você estiver usando essa opção para verificar tabelas, ela impede que a verificação escaneie as linhas para verificar links incorretos. Esse é o método de verificação mais rápido.

  Se você estiver usando essa opção para reparar tabelas, ela tenta reparar apenas a árvore de índice. Esse é o método de reparo mais rápido.
*  `--repair`, `-r`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--repair</code></td> </tr></tbody></table>

  Realize uma reparação que pode corrigir quase tudo, exceto chaves únicas que não são únicas.
*  `--server-public-key-path=file_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--server-public-key-path=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em pares de chaves RSA. Essa opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`. Essa opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como no caso em que o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password` (desatualizado), essa opção se aplica apenas se o MySQL foi compilado usando o OpenSSL.

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--shared-memory-base-name=nome</code></td> </tr><tr><th>Específico da plataforma</th> <td>Windows</td> </tr></tbody></table>

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é case-sensitive.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.
*  `--silent`, `-s`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--silent</code></td> </tr></tbody></table>

  Modo silencioso. Imprima apenas mensagens de erro.
*  `--skip-database=db_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-database=db_name</code></td> </tr></tbody></table>

  Não inclua o banco de dados nomeado (case-sensitive) nas operações realizadas pelo `mysqlcheck`.
*  `--socket=caminho`, `-S caminho`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--socket={nome_de_arquivo|nome_de_canal}</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, em Windows, o nome do canal nomeado a ser usado.

  Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.
* `--ssl*`

  Opções que começam com `--ssl` especificam se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.
*  `--ssl-fips-mode={OFF|ON|STRICT}`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores válidos</th> <td><code>OFF</code><code>ON</code><code>STRICT</code></td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Consulte  Seção 8.8, “Suporte FIPS”.

  Esses valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  ::: info Nota

  Se o Módulo de Objeto FIPS do OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza uma mensagem de aviso na inicialização e opere no modo não FIPS.

  :::

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL. *  `--tables`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tables</code></td> </tr></tbody></table>

  Substitua a opção `--databases` ou `-B`. Todos os argumentos de nome que seguem a opção são considerados nomes de tabelas.
*  `--tls-ciphersuites=ciphersuite_list`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-ciphersuites=ciphersuite_list</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Os ciphersuites permitidos para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de ciphersuites separados por vírgula. Os ciphersuites que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte Seção 8.3.2, “Protocolos e ciphers TLS de Conexão Criptografada”.
*  `--tls-sni-servername=server_name`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-sni-servername=servername</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que essa opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.
*  `--tls-version=lista_protocolos`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-version=lista_protocolos</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code> (OpenSSL 1.1.1 ou superior)<code>TLSv1,TLSv1.1,TLSv1.2</code> (caso contrário)</td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para essa opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.
*  `--use-frm`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--use-frm</code></td> </tr></tbody></table>

  Para operações de reparo em tabelas `MyISAM`, obtenha a estrutura da tabela do dicionário de dados para que a tabela possa ser reparada mesmo se o cabeçalho `.MYI` estiver corrompido.
*  `--user=nome_do_usuario`, `-u nome_do_usuario`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--user=nome_do_usuario,</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome do usuário da conta MySQL a ser usado para se conectar ao servidor.
*  `--verbose`, `-v`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose. Imprima informações sobre as várias etapas da operação do programa.
*  `--version`, `-V`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--version</code></td> </tr></tbody></table>

  Exibir informações da versão e sair.
*  `--write-binlog`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--write-binlog</code></td> </tr></tbody></table>

  Esta opção está habilitada por padrão, para que as instruções `ANALYZE TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE` geradas pelo `mysqlcheck` sejam escritas no log binário. Use `--skip-write-binlog` para adicionar `NO_WRITE_TO_BINLOG` às instruções para que elas não sejam registradas. Use `--skip-write-binlog` quando essas instruções não devem ser enviadas para réplicas ou executadas ao usar os logs binários para recuperação a partir de backups.
*  `--zstd-compression-level=level`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--zstd-compression-level=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr></tbody></table>

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão é 3. O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.