#### 4.6.3.1 Opções Gerais do myisamchk

As opções descritas nesta seção podem ser usadas para qualquer tipo de operação de manutenção de tabela executada pelo **myisamchk**. As seções seguintes descrevem opções que se aplicam apenas a operações específicas, como verificação ou reparo de tabelas.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai. As opções são agrupadas por tipo de operação.

* `--HELP`, `-H`

  <table frame="box" rules="all" summary="Propriedades para HELP"><tbody><tr><tr><th>Formato da Linha de Comando</th> <td><code>--HELP</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai. As opções são apresentadas em uma única lista.

* `--debug=debug_options`, `-# debug_options`

  <table frame="box" rules="all" summary="Propriedades para debug"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>d:t:o,/tmp/myisamchk.trace</code></td> </tr></tbody></table>

  Escreve um log de debugging. Uma string *`debug_options`* típica é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/myisamchk.trace`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Lê este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou estiver inacessível, ocorre um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Usa apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorre um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Lê não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o **myisamchk** normalmente lê o grupo `[myisamchk]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o **myisamchk** também lê o grupo `[myisamchk_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para no-defaults"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não lê nenhum arquivo de opção. Se a inicialização do programa falhar devido à leitura de opções desconhecidas em um arquivo de opção, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de maneira mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — MySQL Configuration Utility”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para print-defaults"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Imprime o nome do programa e todas as opções que ele obtém dos arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para silent"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--silent</code></td> </tr></tbody></table>

  Modo silencioso. Escreve a saída apenas quando ocorrem erros. Você pode usar `-s` duas vezes (`-ss`) para tornar o **myisamchk** muito silencioso.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verboso. Imprime mais informações sobre o que o programa faz. Isso pode ser usado com `-d` e `-e`. Use `-v` múltiplas vezes (`-vv`, `-vvv`) para ainda mais saída.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para HELP"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--HELP</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.

* `--wait`, `-w`

  <table frame="box" rules="all" summary="Propriedades para HELP"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--HELP</code></td> </tr></tbody></table>

  Em vez de terminar com um erro se a tabela estiver em Lock, espera até que a tabela seja desbloqueada antes de continuar. Se você estiver executando o **mysqld** com Locking externo desativado, a tabela só poderá ser bloqueada por outro comando **myisamchk**.

Você também pode definir as seguintes variáveis usando a sintaxe `--var_name=value`:

<table frame="box" rules="all" summary="Propriedades para HELP"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--HELP</code></td> </tr></tbody></table>

As possíveis variáveis do **myisamchk** e seus valores padrão podem ser examinados com **myisamchk --help**:

`myisam_sort_buffer_size` é usado quando os Keys são reparados por meio de ordenação, que é o caso normal ao usar `--recover`. `sort_buffer_size` é um sinônimo obsoleto para `myisam_sort_buffer_size`.

`key_buffer_size` é usado ao verificar a tabela com `--extend-check` ou quando os Keys são reparados inserindo Keys linha por linha na tabela (como ao fazer inserts normais). O reparo através do key buffer é usado nos seguintes casos:

* Você usa `--safe-recover`.
* Os arquivos temporários necessários para ordenar os Keys seriam mais de duas vezes maiores do que ao criar o arquivo de Key diretamente. Isso ocorre frequentemente quando você tem grandes valores de Key para colunas `CHAR`, `VARCHAR` ou `TEXT`, porque a operação de ordenação precisa armazenar os valores de Key completos à medida que avança. Se você tiver muito espaço temporário e puder forçar o **myisamchk** a reparar por ordenação, você pode usar a opção `--sort-recover`.

Reparar através do key buffer consome muito menos espaço em disco do que usar a ordenação, mas também é muito mais lento.

Se você deseja um reparo mais rápido, defina as variáveis `key_buffer_size` e `myisam_sort_buffer_size` para cerca de 25% da sua memória disponível. Você pode definir ambas as variáveis com valores grandes, pois apenas uma delas é usada por vez.

`myisam_block_size` é o tamanho usado para Index blocks.

`stats_method` influencia como os valores `NULL` são tratados para a coleta de estatísticas de Index quando a opção `--analyze` é fornecida. Ele age como a variável de sistema `myisam_stats_method`. Para obter mais informações, consulte a descrição de `myisam_stats_method` na Seção 5.1.7, “Server System Variables”, e na Seção 8.3.7, “InnoDB and MyISAM Index Statistics Collection”.

`ft_min_word_len` e `ft_max_word_len` indicam o comprimento mínimo e máximo da palavra para Indexes `FULLTEXT` em tabelas `MyISAM`. `ft_stopword_file` nomeia o arquivo de stopword. Isso precisa ser definido sob as seguintes circunstâncias.

Se você usar o **myisamchk** para realizar uma operação que modifique Index (como repair ou analyze), os Indexes `FULLTEXT` são reconstruídos usando os valores padrão dos parâmetros full-text para comprimento mínimo e máximo da palavra e o arquivo de stopword, a menos que você especifique o contrário. Isso pode resultar em falha nas Queries.

O problema ocorre porque esses parâmetros são conhecidos apenas pelo server. Eles não são armazenados em arquivos de Index `MyISAM`. Para evitar o problema se você modificou o comprimento mínimo ou máximo da palavra ou o arquivo de stopword no server, especifique os mesmos valores de `ft_min_word_len`, `ft_max_word_len` e `ft_stopword_file` para o **myisamchk** que você usa para o **mysqld**. Por exemplo, se você definiu o comprimento mínimo da palavra como 3, você pode reparar uma tabela com **myisamchk** assim:

```sql
myisamchk --recover --ft_min_word_len=3 tbl_name.MYI
```

Para garantir que o **myisamchk** e o server usem os mesmos valores para parâmetros full-text, você pode colocar cada um nas seções `[mysqld]` e `[myisamchk]` de um arquivo de opção:

```sql
[mysqld]
ft_min_word_len=3

[myisamchk]
ft_min_word_len=3
```

Uma alternativa ao uso do **myisamchk** é usar as instruções `REPAIR TABLE`, `ANALYZE TABLE`, `OPTIMIZE TABLE` ou `ALTER TABLE`. Essas instruções são executadas pelo server, que conhece os valores de parâmetro full-text apropriados a serem usados.
