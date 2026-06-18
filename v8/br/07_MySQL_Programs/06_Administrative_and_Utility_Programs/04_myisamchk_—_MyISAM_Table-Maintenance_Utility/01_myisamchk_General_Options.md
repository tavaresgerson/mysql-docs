#### 6.6.4.1 Opções Gerais do myisamchk

As opções descritas nesta seção podem ser usadas para qualquer tipo de operação de manutenção de tabela realizada pelo **myisamchk**. As seções que seguem desta descrevem opções que se aplicam apenas a operações específicas, como verificação ou reparo de tabela.

- `--help`, `-?`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia. As opções são agrupadas por tipo de operação.

- `--HELP`, `-H`

  <table summary="Propriedades para AJUDA"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--HELP</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia. As opções são apresentadas em uma única lista.

- `--debug=debug_options`, `-# debug_options`

  <table summary="Propriedades para depuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug[=debug_option<code>d:t:o,/tmp/myisamchk.trace</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>d:t:o,/tmp/myisamchk.trace</code>]]</td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/myisamchk.trace`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--defaults-extra-file=file_name`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=file_name`

  <table summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-group-suffix=str</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Leia não apenas os grupos de opções habituais, mas também grupos com os nomes habituais e um sufixo de `str`. Por exemplo, **myisamchk** normalmente lê o grupo `[myisamchk]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **myisamchk** também lê o grupo `[myisamchk_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--no-defaults`

  <table summary="Propriedades sem penalidades"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr></tbody></table>

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--print-defaults`

  <table summary="Propriedades para padrões de impressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--print-defaults</code>]]</td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--silent`, `-s`

  <table summary="Propriedades para silencioso"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--silent</code>]]</td> </tr></tbody></table>

  Modo silencioso. Escreva a saída apenas quando ocorrerem erros. Você pode usar `-s` duas vezes (`-ss`) para tornar o **myisamchk** muito silencioso.

- `--verbose`, `-v`

  <table summary="Propriedades para verbose"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

  Modo verbose. Imprima mais informações sobre o que o programa faz. Isso pode ser usado com `-d` e `-e`. Use `-v` várias vezes (`-vv`, `-vvv`) para obter ainda mais saída.

- `--version`, `-V`

  <table summary="Propriedades para AJUDA"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--HELP</code>]]</td> </tr></tbody></table>0

  Exibir informações da versão e sair.

- `--wait`, `-w`

  <table summary="Propriedades para AJUDA"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--HELP</code>]]</td> </tr></tbody></table>1

  Em vez de encerrar com um erro se a tabela estiver bloqueada, espere até que a tabela seja desbloqueada antes de continuar. Se você estiver executando o **mysqld** com o bloqueio externo desativado, a tabela só pode ser bloqueada por outro comando **myisamchk**.

Você também pode definir as seguintes variáveis usando a sintaxe `--var_name=value`:

<table summary="Propriedades para AJUDA"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--HELP</code>]]</td> </tr></tbody></table>2

As possíveis variáveis **myisamchk** e seus valores padrão podem ser examinadas com **myisamchk --help**:

`myisam_sort_buffer_size` é usado quando as chaves são reparadas por meio da classificação de chaves, que é o caso normal quando você usa `--recover`. `sort_buffer_size` é um sinônimo desatualizado para `myisam_sort_buffer_size`.

`key_buffer_size` é usado quando você está verificando a tabela com `--extend-check` ou quando as chaves são reparadas inserindo linhas de chaves uma a uma na tabela (como ao fazer inserções normais). A reparação através do buffer de chave é usada nos seguintes casos:

- Você usa `--safe-recover`.
- Os arquivos temporários necessários para ordenar as chaves seriam mais do que o dobro do tamanho quando o arquivo de chave é criado diretamente. Isso geralmente acontece quando você tem valores de chave grandes para as colunas `CHAR`, `VARCHAR` ou `TEXT`, porque a operação de ordenação precisa armazenar os valores completos da chave conforme ela prossegue. Se você tiver muito espaço temporário e puder forçar o **myisamchk** a reparar por meio da ordenação, você pode usar a opção `--sort-recover`.

A reparação através do buffer de chave ocupa muito menos espaço no disco do que o uso da ordenação, mas também é muito mais lenta.

Se você deseja uma reparação mais rápida, defina as variáveis `key_buffer_size` e `myisam_sort_buffer_size` em cerca de 25% da memória disponível. Você pode definir ambas as variáveis para valores grandes, pois apenas uma delas é usada de cada vez.

`myisam_block_size` é o tamanho usado para blocos de índice.

`stats_method` influencia como os valores de `NULL` são tratados para a coleta de estatísticas de índice quando a opção `--analyze` é fornecida. Ele atua como a variável de sistema `myisam_stats_method`. Para mais informações, consulte a descrição de `myisam_stats_method` na Seção 7.1.8, “Variáveis do Sistema do Servidor”, e na Seção 10.3.8, “Coleta de Estatísticas de Índices InnoDB e MyISAM”.

`ft_min_word_len` e `ft_max_word_len` indicam o comprimento mínimo e máximo da palavra para os índices `FULLTEXT` nas tabelas `MyISAM`. `ft_stopword_file` nomeia o arquivo de palavras-chave. Estes precisam ser configurados nas seguintes circunstâncias.

Se você usar o **myisamchk** para realizar uma operação que modifica os índices de tabela (como reparo ou análise), os índices `FULLTEXT` são reconstruídos usando os valores padrão dos parâmetros de texto completo para comprimento mínimo e máximo de palavras e o arquivo de palavras-chave, a menos que você especifique o contrário. Isso pode resultar em consultas que falham.

O problema ocorre porque esses parâmetros são conhecidos apenas pelo servidor. Eles não são armazenados nos arquivos de índice `MyISAM`. Para evitar o problema se você tiver modificado o comprimento mínimo ou máximo da palavra ou o arquivo de palavras-chave no servidor, especifique os mesmos valores de `ft_min_word_len`, `ft_max_word_len` e `ft_stopword_file` para o **myisamchk** que você usa para o **mysqld**. Por exemplo, se você definiu o comprimento mínimo da palavra para 3, você pode reparar uma tabela com o **myisamchk** da seguinte maneira:

```
myisamchk --recover --ft_min_word_len=3 tbl_name.MYI
```

Para garantir que o **myisamchk** e o servidor utilizem os mesmos valores para os parâmetros de texto completo, você pode colocar cada um deles nas seções `[mysqld]` e `[myisamchk]` de um arquivo de opções:

```
[mysqld]
ft_min_word_len=3

[myisamchk]
ft_min_word_len=3
```

Uma alternativa para usar o **myisamchk** é usar os `REPAIR TABLE`, `ANALYZE TABLE`, `OPTIMIZE TABLE` ou `ALTER TABLE`. Essas declarações são realizadas pelo servidor, que conhece os valores corretos dos parâmetros de texto completo a serem usados.
