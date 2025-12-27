### 6.5.3 mysqlcheck — Um Programa de Manutenção de Tabelas

O cliente **mysqlcheck** realiza a manutenção de tabelas: ele verifica, conserta, otimiza ou analisa tabelas.

Cada tabela é bloqueada e, portanto, indisponível para outras sessões enquanto está sendo processada, embora, para operações de verificação, a tabela seja bloqueada com um bloqueio `READ` (leitura) apenas (consulte a Seção 15.3.6, “Instruções LOCK TABLES e UNLOCK TABLES”, para mais informações sobre os bloqueios `READ` e `WRITE`). As operações de manutenção de tabelas podem ser demoradas, especialmente para tabelas grandes. Se você usar a opção `--databases` ou `--all-databases` para processar todas as tabelas em um ou mais bancos de dados, uma invocação do **mysqlcheck** pode levar muito tempo. (Isso também é verdadeiro para o procedimento de atualização do MySQL se ele determinar que a verificação de tabelas é necessária, pois ele processa as tabelas da mesma maneira.)

**mysqlcheck** deve ser usado quando o servidor **mysqld** estiver em execução, o que significa que você não precisa parar o servidor para realizar a manutenção de tabelas.

**mysqlcheck** usa as instruções SQL `CHECK TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` e `OPTIMIZE TABLE` de uma maneira conveniente para o usuário. Ele determina quais instruções usar para a operação que você deseja realizar e, em seguida, envia as instruções ao servidor para serem executadas. Para detalhes sobre quais motores de armazenamento cada instrução funciona, consulte as descrições dessas instruções na Seção 15.7.3, “Instruções de Manutenção de Tabelas”.

Nem todos os motores de armazenamento necessariamente suportam todas as quatro operações de manutenção. Nesse caso, uma mensagem de erro é exibida. Por exemplo, se `test.t` for uma tabela `MEMORY`, uma tentativa de verificá-la produz este resultado:

```
$> mysqlcheck test t
test.t
note     : The storage engine for the table doesn't support check
```

Se o **mysqlcheck** não conseguir reparar uma tabela, consulte a Seção 3.14, “Reestruturação ou reparo de tabelas ou índices”, para estratégias de reparo manual de tabelas. Esse é o caso, por exemplo, das tabelas `InnoDB`, que podem ser verificadas com `CHECK TABLE`, mas não reparadas com `REPAIR TABLE`.

Cuidado

É melhor fazer um backup de uma tabela antes de realizar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. As causas possíveis incluem, mas não se limitam a, erros no sistema de arquivos.

Existem três maneiras gerais de invocar o **mysqlcheck**:

```
mysqlcheck [options] db_name [tbl_name ...]
mysqlcheck [options] --databases db_name ...
mysqlcheck [options] --all-databases
```

Se você não nomear nenhuma tabela após *`db_name`* ou se usar a opção `--databases` ou `--all-databases`, as inteiras bases de dados são verificadas.

O **mysqlcheck** tem uma característica especial em comparação com outros programas cliente. O comportamento padrão de verificação de tabelas (`--check`) pode ser alterado renomeando o binário. Se você deseja ter uma ferramenta que repara tabelas por padrão, basta fazer uma cópia do **mysqlcheck** chamada **mysqlrepair**, ou fazer um link simbólico para o **mysqlcheck** chamado **mysqlrepair**. Se você invocar o **mysqlrepair**, ele reparará as tabelas.

Os nomes mostrados na tabela a seguir podem ser usados para alterar o comportamento padrão do **mysqlcheck**.

<table summary="Nomes de comandos que podem ser usados para alterar o comportamento padrão do mysqlcheck."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Comando</th> <th>Significado</th> </tr></thead><tbody><tr> <td><span class="command"><strong>mysqlrepair</strong></span></td> <td>A opção padrão é <a class="link" href="mysqlcheck.html#option_mysqlcheck_repair"><code class="option">--repair</code></a></td> </tr><tr> <td><span class="command"><strong>mysqlanalyze</strong></span></td> <td>A opção padrão é <a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze"><code class="option">--analyze</code></a></td> </tr><tr> <td><span class="command"><strong>mysqloptimize</strong></span></td> <td>A opção padrão é <a class="link" href="mysqlcheck.html#option_mysqlcheck_optimize"><code class="option">--optimize</code></a></td> </tr></tbody></table>

O **mysqlcheck** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlcheck]` e `[client]` de um arquivo de opções. Para obter informações sobre as opções de arquivos usadas por programas MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.12 Opções do mysqlcheck**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlcheck">
<tr><th>Nome da opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></td> <td>Verifique todas as tabelas em todos os bancos de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></td> <td>Execute uma única instrução para cada banco de dados que nomeia todas as tabelas desse banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></td> <td>Analisar as tabelas</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></td> <td>Se uma tabela verificada estiver corrompida, corrija automaticamente</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></td> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres estão instalados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></td> <td>Verifique as tabelas quanto a erros</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></td> <td>Invoque CHECK TABLE com a opção FOR UPGRADE</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></td> <td>Compress todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></td> <td>Interprete todos os argumentos como nomes de banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></td> <td>Escreva o log de depuração</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></td> <td>Imprima informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></td> <td>Imprima informações de depuração, estatísticas de memória e CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></td> <td>Especificar o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado adicionalmente aos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Habilitar o plugin de texto em branco</td></tr>
<tr><td><a class="link" href="mysqlcheck

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--help</code></td> </tr></table>

  Exibir uma mensagem de ajuda e sair.

* `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Propriedades para all-databases"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--all-databases</code></td> </tr></table>

  Ver todas as tabelas em todas as bases de dados. Isso é o mesmo que usar a opção `--databases` e nomear todas as bases de dados na linha de comando, exceto que as bases de dados `INFORMATION_SCHEMA` e `performance_schema` não são verificadas. Elas podem ser verificadas explicitamente nomeando-as com a opção `--databases`.

* `--all-in-1`, `-1`

  <table frame="box" rules="all" summary="Propriedades para all-in-1"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--all-in-1</code></td> </tr></table>

  Em vez de emitir uma declaração para cada tabela, execute uma única declaração para cada base de dados que nomeia todas as tabelas dessa base de dados a serem processadas.

* `--analyze`, `-a`

  <table frame="box" rules="all" summary="Propriedades para analyze"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--analyze</code></td> </tr></table>

  Analisar as tabelas.

* `--auto-repair`

  <table frame="box" rules="all" summary="Propriedades para auto-repair"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--auto-repair</code></td> </tr></table>

Se uma tabela verificada estiver corrompida, corrija-a automaticamente. Quaisquer reparos necessários são feitos após todas as tabelas terem sido verificadas.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--check`, `-c`

  <table frame="box" rules="all" summary="Propriedades para check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--check</code></td> </tr></tbody></table>

  Verifique as tabelas em busca de erros. Esta é a operação padrão.

* `--check-only-changed`, `-C`

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlcheck">
<tr><th>Nome da opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></td> <td>Verifique todas as tabelas em todos os bancos de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></td> <td>Execute uma única instrução para cada banco de dados que nomeia todas as tabelas desse banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></td> <td>Analise as tabelas</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></td> <td>Se uma tabela verificada for corrompida, corrija automaticamente</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></td> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres são instalados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></td> <td>Verifique as tabelas em busca de erros</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></td> <td>Invoque CHECK TABLE com a opção FOR UPGRADE</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></td> <td>Compress todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></td> <td>Interprete todos os argumentos como nomes de banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></td> <td>Escreva o log de depuração</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></td> <td>Imprima informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></td> <td>Imprima informações de depuração, estatísticas de memória e CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></td> <td>Especifique o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado adicionalmente aos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Habilitar o plugin de texto em branco</td></tr>
<tr><td><a class="link" href="mysqlcheck

Verifique apenas as tabelas que foram alteradas desde a última verificação ou que não foram fechadas corretamente.

* `--check-upgrade`, `-g`

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlcheck">
<tr><th>Nome da opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></td> <td>Verifique todas as tabelas em todos os bancos de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></td> <td>Execute uma única instrução para cada banco de dados que nomeia todas as tabelas desse banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></td> <td>Analise as tabelas</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></td> <td>Se uma tabela verificada estiver corrompida, corrija automaticamente</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></td> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres estão instalados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></td> <td>Verifique as tabelas quanto a erros</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></td> <td>Invoque CHECK TABLE com a opção FOR UPGRADE</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></td> <td>Compress todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></td> <td>Interprete todos os argumentos como nomes de banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></td> <td>Escreva o log de depuração</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></td> <td>Imprima informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></td> <td>Imprima informações de depuração, estatísticas de memória e CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></td> <td>Especifique o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado adicionalmente aos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Habilitar o plugin de texto em branco</td></tr>
<tr><td><a class="link" href="mysqlcheck.

Invoque `CHECK TABLE` com a opção `FOR UPGRADE` para verificar as tabelas quanto à incompatibilidade com a versão atual do servidor.

* `--compress`

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlcheck">
<tr><th>Nome da opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></td> <td>Verifique todas as tabelas em todos os bancos de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></td> <td>Execute uma única instrução para cada banco de dados que nomeia todas as tabelas desse banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></td> <td>Analise as tabelas</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></td> <td>Se uma tabela verificada estiver corrompida, corrija automaticamente</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></td> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres estão instalados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></td> <td>Verifique as tabelas quanto a erros</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></td> <td>Invoque CHECK TABLE com a opção FOR UPGRADE</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></td> <td>Compress todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></td> <td>Interprete todos os argumentos como nomes de banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></td> <td>Escreva o log de depuração</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></td> <td>Imprima informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></td> <td>Imprima informações de depuração, estatísticas de memória e CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></td> <td>Especifique o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado adicionalmente aos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Habilitar o plugin de texto em branco</td></tr>
<tr><td><a class="link" href="mysqlcheck.

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Esta opção está desatualizada. Espera-se que ela seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.

* `--compression-algorithms=value`

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlcheck">
<tr><th>Nome da opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></td> <td>Verifique todas as tabelas em todos os bancos de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></td> <td>Execute uma única instrução para cada banco de dados que nomeia todas as tabelas desse banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></td> <td>Analise as tabelas</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></td> <td>Se uma tabela verificada estiver corrompida, corrija automaticamente</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></td> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres estão instalados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></td> <td>Verifique as tabelas quanto a erros</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></td> <td>Invoque CHECK TABLE com a opção FOR UPGRADE</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></td> <td>Compress todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></td> <td>Interprete todos os argumentos como nomes de banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></td> <td>Escreva o log de depuração</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></td> <td>Imprima informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></td> <td>Imprima informações de depuração, estatísticas de memória e CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></td> <td>Especifique o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado adicionalmente aos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Habilitar o plugin de texto em branco</td></tr>
<tr><td><a class="link" href="mysqlcheck.

Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.

* `--databases`, `-B`

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlcheck">
<tr><th>Nome da opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></td> <td>Verifique todas as tabelas em todos os bancos de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></td> <td>Execute uma única instrução para cada banco de dados que nomeia todas as tabelas desse banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></td> <td>Analise as tabelas</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></td> <td>Se uma tabela verificada estiver corrompida, corrija automaticamente</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></td> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres estão instalados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></td> <td>Verifique as tabelas em busca de erros</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></td> <td>Invoque CHECK TABLE com a opção FOR UPGRADE</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></td> <td>Compress todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></td> <td>Interprete todos os argumentos como nomes de banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></td> <td>Escreva o log de depuração</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></td> <td>Imprima informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></td> <td>Imprima informações de depuração, estatísticas de memória e CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></td> <td>Especifique o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado adicionalmente aos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Habilitar o plugin de texto em branco</td></tr>
<tr><td><a class="link" href="mysqlcheck

Processar todas as tabelas nos bancos de dados nomeados. Normalmente, o **mysqlcheck** trata o argumento de nome no comando da linha como um nome de banco de dados e quaisquer nomes seguintes como nomes de tabelas. Com esta opção, ele trata todos os argumentos de nome como nomes de banco de dados.

* `--debug[=debug_options]`, `-# [debug_options]`

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlcheck">
<tr><th>Nome da opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></td> <td>Verifique todas as tabelas em todos os bancos de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></td> <td>Execute uma única instrução para cada banco de dados que nomeia todas as tabelas desse banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></td> <td>Analise as tabelas</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></td> <td>Se uma tabela verificada estiver corrompida, corrija automaticamente</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></td> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres estão instalados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></td> <td>Verifique as tabelas quanto a erros</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></td> <td>Invoque CHECK TABLE com a opção FOR UPGRADE</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></td> <td>Compress todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></td> <td>Interprete todos os argumentos como nomes de banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></td> <td>Escreva o log de depuração</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></td> <td>Imprima informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></td> <td>Imprima informações de depuração, estatísticas de memória e CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></td> <td>Especifique o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado adicionalmente aos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Habilitar o plugin de texto em branco</td></tr>
<tr><td><a class="link" href="mysqlcheck.

Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o`.

Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-check`

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlcheck">
<tr><th>Nome da opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></td> <td>Verifique todas as tabelas em todos os bancos de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></td> <td>Execute uma única instrução para cada banco de dados que nomeia todas as tabelas desse banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></td> <td>Analise as tabelas</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></td> <td>Se uma tabela verificada estiver corrompida, corrija automaticamente</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></td> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres estão instalados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></td> <td>Verifique as tabelas quanto a erros</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></td> <td>Invoque CHECK TABLE com a opção FOR UPGRADE</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></td> <td>Compress todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></td> <td>Interprete todos os argumentos como nomes de banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></td> <td>Escreva o log de depuração</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></td> <td>Imprima informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></td> <td>Imprima informações de depuração, estatísticas de memória e CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></td> <td>Especifique o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado adicionalmente aos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Habilitar o plugin de texto em branco</td></tr>
<tr><td><a class="link" href="mysqlcheck.

Imprima algumas informações de depuração quando o programa sair.

Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-info`

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlcheck">
<tr><th>Nome da opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></td> <td>Verifique todas as tabelas em todos os bancos de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></td> <td>Execute uma única instrução para cada banco de dados que nomeia todas as tabelas desse banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></td> <td>Analisar as tabelas</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></td> <td>Se uma tabela verificada estiver corrompida, corrija automaticamente</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></td> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres estão instalados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></td> <td>Verifique as tabelas quanto a erros</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></td> <td>Invoque CHECK TABLE com a opção FOR UPGRADE</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></td> <td>Compress todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></td> <td>Interprete todos os argumentos como nomes de banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></td> <td>Escreva o log de depuração</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></td> <td>Imprima informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></td> <td>Imprima informações de depuração, estatísticas de memória e CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></td> <td>Especificar o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado adicionalmente aos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Habilitar o plugin de texto em branco</td></tr>
<tr><td><a class="link" href="mysqlcheck

Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--default-character-set=charset_name`

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlcheck.">
<tr><th>Nome da opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></td> <td>Verifique todas as tabelas em todos os bancos de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></td> <td>Execute uma única instrução para cada banco de dados que nomeia todas as tabelas desse banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></td> <td>Analise as tabelas</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></td> <td>Se uma tabela verificada estiver corrompida, corrija automaticamente</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></td> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres estão instalados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></td> <td>Verifique as tabelas quanto a erros</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></td> <td>Invoque CHECK TABLE com a opção FOR UPGRADE</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></td> <td>Compress todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></td> <td>Interprete todos os argumentos como nomes de banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></td> <td>Escreva o log de depuração</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></td> <td>Imprima informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></td> <td>Imprima informações de depuração, estatísticas de memória e CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></td> <td>Especifique o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado adicionalmente aos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Habilitar o plugin de texto em branco</td></tr>
<tr><td><a class="link" href="mysqlcheck

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--defaults-extra-file=file_name`

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlcheck">
<tr><th>Nome da opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></td> <td>Verifique todas as tabelas em todos os bancos de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></td> <td>Execute uma única instrução para cada banco de dados que nomeia todas as tabelas desse banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></td> <td>Analise as tabelas</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></td> <td>Se uma tabela verificada estiver corrompida, corrija automaticamente</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></td> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres estão instalados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></td> <td>Verifique as tabelas em busca de erros</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></td> <td>Invoque CHECK TABLE com a opção FOR UPGRADE</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></td> <td>Compress todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></td> <td>Interprete todos os argumentos como nomes de banco de dados</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></td> <td>Escreva o log de depuração</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></td> <td>Imprima informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></td> <td>Imprima informações de depuração, estatísticas de memória e CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></td> <td>Especifique o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado adicionalmente aos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Habilitar o plugin de texto em branco</td></tr>
<tr><td><a class="link" href="mysqlcheck

Leia este arquivo de opções após o arquivo de opções globais, mas (no Unix) antes do arquivo de opções do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>0

  Use apenas o arquivo de opções fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>1

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlcheck** normalmente lê os grupos `[client]` e `[mysqlcheck]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlcheck** também lê os grupos `[client_other]` e `[mysqlcheck_other]`.

Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--extended`, `-e`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>2

  Se você estiver usando esta opção para verificar tabelas, ela garante que elas sejam 100% consistentes, mas leva muito tempo.

  Se você estiver usando esta opção para reparar tabelas, ela executa uma reparação estendida que pode não apenas levar muito tempo para ser executada, mas também pode gerar muitas linhas de lixo!

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>3

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Consulte a Seção 8.2.17, “Autenticação Pluggable do Lado do Cliente”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>4

  Ative o plugin de autenticação `mysql_clear_password` de texto claro. (Consulte a Seção 8.4.1.3, “Autenticação Pluggable do Lado do Cliente de Texto Claro”.)

* `--fast`, `-F`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>5

  Verifique apenas tabelas que não foram fechadas corretamente.

* `--force`, `-f`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--help</code></td>
  </tr>
</table>
6

  Continue mesmo que ocorra um erro SQL.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades de ajuda">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--help</code></td>
    </tr>
  </table>
7

  Solicitar ao servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.1, “Cacheamento de Pluggable Authentication SHA-2”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades de ajuda">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--help</code></td>
    </tr>
  </table>
8

  Conectar-se ao servidor MySQL no host fornecido.

* `--login-path=name`

<table frame="box" rules="all" summary="Propriedades para ajuda">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--help</code></td>
  </tr>
</table>
9

Leia opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

Para obter informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--no-caminhos-de-login`

<table frame="box" rules="all" summary="Propriedades para todas as bases de dados">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--all-databases</code></td>
  </tr>
</table>
0

Ignora a leitura de opções do arquivo de caminho de login.

Veja `--caminho-de-login` para informações relacionadas.

Para obter informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--medium-check`, `-m`

<table frame="box" rules="all" summary="Propriedades para todas as bases de dados">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--all-databases</code></td>
  </tr>
</table>
1

Realiza uma verificação mais rápida do que uma operação `--extended`. Isso encontra apenas 99,99% de todos os erros, o que deve ser suficiente na maioria dos casos.

* `--no-defaults`

<table frame="box" rules="all" summary="Propriedades para todas as bases de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--all-databases</code></td> </tr></tbody></table>2

  Não leia arquivos de opções. Se o início do programa falhar ao ler opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--optimize`, `-o`

  <table frame="box" rules="all" summary="Propriedades para todas as bases de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--all-databases</code></td> </tr></tbody></table>3

  Otimizar as tabelas.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para todas as bases de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--all-databases</code></td> </tr></tbody></table>4

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlcheck** solicitará uma senha. Se fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

Para especificar explicitamente que não há senha e que o **mysqlcheck** não deve solicitar uma, use a opção `--skip-password`.

* `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlcheck** solicita uma. Se for fornecido, não deve haver *espaço* entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o **mysqlcheck** não deve solicitar uma, use a opção `--skip-password1`.

  `--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica dessa opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para detalhes.

* `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica dessa opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para detalhes.

* `--pipe`, `-W`

<table frame="box" rules="all" summary="Propriedades para todas as bases de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--all-databases</code></td> </tr></tbody></table>5

  No Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para todas as bases de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--all-databases</code></td> </tr></tbody></table>6

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlcheck** não o encontrar. Veja a Seção 8.2.17, “Autenticação Extensível”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para todas as bases de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--all-databases</code></td> </tr></tbody></table>7

  Para conexões TCP/IP, o número de porta a ser usado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para todas as bases de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--all-databases</code></td> </tr></tbody></table>8

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

Para obter informações adicionais sobre esta e outras opções de arquivo, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivo Opção-Arquivo”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para todos os bancos de dados"><tr><th>Formato de linha de comando</th> <td><code class="literal">--all-databases</code></td> </tr></table>9

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de transporte de conexão”.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Propriedades para todos-em-um"><tr><th>Formato de linha de comando</th> <td><code class="literal">--all-in-1</code></td> </tr></table>0

  Se você estiver usando esta opção para verificar tabelas, ela impede que a verificação escaneie as linhas para verificar links incorretos. Este é o método de verificação mais rápido.

  Se você estiver usando esta opção para reparar tabelas, ela tenta reparar apenas a árvore de índice. Este é o método de reparo mais rápido.

* `--repair`, `-r`

  <table frame="box" rules="all" summary="Propriedades para todos-em-um"><tr><th>Formato de linha de comando</th> <td><code class="literal">--all-in-1</code></td> </tr></table>1

  Realize uma reparação que pode corrigir quase tudo, exceto chaves únicas que não são únicas.

* `--server-public-key-path=file_name`

<table frame="box" rules="all" summary="Propriedades para all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--all-in-1</code></td> </tr></tbody></table>2

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em pares de chaves RSA. Esta opção aplica-se a clientes que autenticam-se com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não autenticam-se com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção só se aplica se o MySQL foi compilado usando OpenSSL.

  Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.2, “Autenticação Personalizável SHA-256”, e a Seção 8.4.1.1, “Autenticação Personalizável SHA-2”.

* `--shared-memory-base-name=name`

<table frame="box" rules="all" summary="Propriedades para all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--all-in-1</code></td> </tr></tbody></table>3

  Em Windows, o nome do compartilhamento de memória a ser usado para conexões feitas usando compartilhamento de memória para um servidor local. O valor padrão é `MYSQL`. O nome do compartilhamento de memória é case-sensitive.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de compartilhamento de memória.

* `--silent`, `-s`

<table frame="box" rules="all" summary="Propriedades para all-in-1"><tr><th>Formato de linha de comando</th><td><code class="literal">--all-in-1</code></td> </tr></table>4

  Modo silencioso. Imprima apenas mensagens de erro.

* `--skip-database=db_name`

  <table frame="box" rules="all" summary="Propriedades para all-in-1"><tr><th>Formato de linha de comando</th><td><code class="literal">--all-in-1</code></td> </tr></table>5

  Não inclua a base de dados nomeada (sensível a maiúsculas e minúsculas) nas operações realizadas pelo **mysqlcheck**.

* `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para all-in-1"><tr><th>Formato de linha de comando</th><td><code class="literal">--all-in-1</code></td> </tr></table>6

  Para conexões com `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Estes valores de `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.
+ `ON`: Habilitar o modo FIPS.
+ `STRICT`: Habilitar o modo FIPS “estricto”.

Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza uma mensagem de aviso no início e opere no modo não FIPS.

Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.

* `--tables`

  <table frame="box" rules="all" summary="Propriedades para all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--all-in-1</code></td> </tr></tbody></table>8

  Sobrepor a opção `--databases` ou `-B`. Todos os argumentos de nome que seguem a opção são considerados nomes de tabelas.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Propriedades para all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--all-in-1</code></td> </tr></tbody></table>9

  Os ciphersuites permitidos para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de ciphersuites separados por vírgula. Os ciphersuites que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e Criptografadores TLS de Conexão Criptografada”.

* `--tls-sni-servername=server_name`

<table frame="box" rules="all" summary="Propriedades para análise">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--analyze</code></td>
  </tr>
</table>0

  Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que essa opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.

* `--tls-version=lista_protocolos`

  <table frame="box" rules="all" summary="Propriedades para análise">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--analyze</code></td>
    </tr>
  </table>1

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para essa opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.

* `--use-frm`

  <table frame="box" rules="all" summary="Propriedades para análise">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--analyze</code></td>
    </tr>
  </table>2

  Para operações de reparo em tabelas `MyISAM`, obtenha a estrutura da tabela do dicionário de dados para que a tabela possa ser reparada mesmo se o cabeçalho `.MYI` estiver corrompido.

* `--user=nome_do_usuário`, `-u nome_do_usuário`

<table frame="box" rules="all" summary="Propriedades para análise">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--analyze</code></td> </tr>
</table>4

  Modo verbose. Imprima informações sobre as várias etapas da operação do programa.

* `--version`, `-V`

<table frame="box" rules="all" summary="Propriedades para análise">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--analyze</code></td> </tr>
</table>5

  Exibir informações da versão e sair.

* `--write-binlog`

<table frame="box" rules="all" summary="Propriedades para análise">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--analyze</code></td> </tr>
</table>6

  Esta opção está habilitada por padrão, para que as instruções `ANALYZE TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE` geradas pelo **mysqlcheck** sejam escritas no log binário. Use `--skip-write-binlog` para adicionar `NO_WRITE_TO_BINLOG` às instruções para que elas não sejam registradas. Use `--skip-write-binlog` quando essas instruções não devem ser enviadas para réplicas ou executadas ao usar os logs binários para recuperação a partir de backups.

* `--zstd-compression-level=level`

<table frame="box" rules="all" summary="Propriedades para análise">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--analyze</code></td>
  </tr>
</table>7

  O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis de compressão crescentes. O nível de compressão padrão do `zstd` é 3. O ajuste do nível de compressão não afeta as conexões que não utilizam compressão `zstd`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.