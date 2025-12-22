#### 6.6.4.1 Opções gerais

As opções descritas nesta seção podem ser utilizadas para qualquer tipo de operação de manutenção de mesa realizada por `myisamchk`. As seções seguintes descrevem opções que se referem apenas a operações específicas, como verificação ou reparo de mesa.

- `--help`, `-?`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

As opções são agrupadas por tipo de operação.

- `--HELP`, `-H`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--HELP</code>]]</td> </tr></tbody></table>

Exibe uma mensagem de ajuda e de saída. As opções são apresentadas numa única lista.

- `--debug=debug_options`, `-# debug_options`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug[=debug_option<code>d:t:o,/tmp/myisamchk.trace</code></code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>d:t:o,/tmp/myisamchk.trace</code>]]</td> </tr></tbody></table>

Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/myisamchk.trace`.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--defaults-extra-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-extra-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou for inacessível, ocorre um erro. Se \* `file_name` \* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Use apenas o arquivo de opção dado. Se o arquivo não existir ou for inacessível, ocorre um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-group-suffix=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-group-suffix=str</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também os grupos com os nomes usuais e um sufixo de \* `str` \*. Por exemplo, \*\* myisamchk \*\* normalmente lê o grupo `[myisamchk]` . Se esta opção for dada como `--defaults-group-suffix=_other`, \*\* myisamchk \*\* também lê o grupo `[myisamchk_other]` .

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedi-las de serem lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma forma mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--print-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--print-defaults</code>]]</td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--silent`, `-s`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--silent</code>]]</td> </tr></tbody></table>

Modo silencioso. Escreva a saída apenas quando ocorrem erros. Você pode usar `-s` duas vezes (`-ss`) para fazer `myisamchk` muito silencioso.

- `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

Modo Verbose. Imprima mais informações sobre o que o programa faz. Isso pode ser usado com `-d` e `-e`. Use `-v` várias vezes (`-vv`, `-vvv`) para obter ainda mais saída.

- `--version`, `-V`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version</code>]]</td> </tr></tbody></table>

Informações de versão e saída.

- `--wait`, `-w`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--wait</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Em vez de terminar com um erro se a tabela estiver bloqueada, espere até que a tabela seja desbloqueada antes de continuar. Se você estiver executando `mysqld` com bloqueio externo desativado, a tabela só pode ser bloqueada por outro comando `myisamchk`.

Você também pode definir as seguintes variáveis usando a sintaxe `--var_name=value`:

<table><col style="width: 35%"/><col style="width: 35%"/><thead><tr> <th>Variavel</th> <th>Valor por defeito</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>stats_method</code>]</td> <td>9 de Dezembro</td> </tr><tr> <td>[[PH_HTML_CODE_<code>stats_method</code>]</td> <td>dependente da versão</td> </tr><tr> <td>[[<code>ft_min_word_len</code>]]</td> <td>Quatro</td> </tr><tr> <td>[[<code>ft_stopword_file</code>]]</td> <td>lista integrada</td> </tr><tr> <td>[[<code>key_buffer_size</code>]]</td> <td>523264 (em inglês)</td> </tr><tr> <td>[[<code>myisam_block_size</code>]]</td> <td>1024 - Serviços de saúde</td> </tr><tr> <td>[[<code>myisam_sort_key_blocks</code>]]</td> <td>16 de março</td> </tr><tr> <td>[[<code>read_buffer_size</code>]]</td> <td>262136 (em inglês)</td> </tr><tr> <td>[[<code>sort_buffer_size</code>]]</td> <td>2097144 (em inglês)</td> </tr><tr> <td>[[<code>sort_key_blocks</code>]]</td> <td>16 de março</td> </tr><tr> <td>[[<code>stats_method</code>]]</td> <td>nulls_unequal</td> </tr><tr> <td>[[<code>ft_max_word_len</code><code>stats_method</code>]</td> <td>262136 (em inglês)</td> </tr></tbody></table>

As possíveis variáveis `myisamchk` e seus valores padrão podem ser examinados com **myisamchk --help**:

`myisam_sort_buffer_size` é usado quando as chaves são reparadas por chaves de classificação, que é o caso normal quando você usa `--recover`. `sort_buffer_size` é um sinônimo depreciado para `myisam_sort_buffer_size`.

`key_buffer_size` é usado quando você está verificando a tabela com `--extend-check` ou quando as chaves são reparadas inserindo linhas de chaves na tabela (como quando faz inserções normais).

- Você usa `--safe-recover`.
- Os arquivos temporários necessários para classificar as chaves seriam mais do que o dobro do tamanho do que ao criar o arquivo de chave diretamente. Este é geralmente o caso quando você tem grandes valores de chave para as colunas `CHAR`, `VARCHAR`, ou `TEXT`, porque a operação de classificação precisa armazenar os valores de chave completos à medida que avança. Se você tem muito espaço temporário e você pode forçar `myisamchk` a reparar por classificação, você pode usar a opção `--sort-recover`.

O reparo através do buffer de chave leva muito menos espaço em disco do que o uso de classificação, mas também é muito mais lento.

Se você quiser um reparo mais rápido, defina as variáveis `key_buffer_size` e `myisam_sort_buffer_size` em cerca de 25% da sua memória disponível. Você pode definir ambas as variáveis em valores grandes, porque apenas uma delas é usada de cada vez.

`myisam_block_size` é o tamanho usado para blocos de índice.

O `stats_method` influencia a forma como os valores do `NULL` são tratados para a coleta de estatísticas de índice quando a opção `--analyze` é fornecida. Ele age como a variável do sistema `myisam_stats_method`. Para mais informações, consulte a descrição do `myisam_stats_method` na Seção 7.1.8, Variáveis do Sistema do Servidor, e na Seção 10.3.8, InnoDB e MyISAM Index Statistics Collection.

`ft_min_word_len` e `ft_max_word_len` indicam o comprimento mínimo e máximo de palavras para os índices `FULLTEXT` nas tabelas `MyISAM`. `ft_stopword_file` nomeia o arquivo de palavras de parada. Estes precisam ser definidos nas seguintes circunstâncias.

Se você usar `myisamchk` para executar uma operação que modifique os índices da tabela (como reparar ou analisar), os índices `FULLTEXT` são reconstruídos usando os valores padrão do parâmetro de texto completo para o comprimento mínimo e máximo da palavra e o arquivo de palavra-limite, a menos que você especifique o contrário. Isso pode resultar na falha das consultas.

O problema ocorre porque esses parâmetros são conhecidos apenas pelo servidor. Eles não são armazenados em arquivos de índice `MyISAM`. Para evitar o problema se você tiver modificado o comprimento mínimo ou máximo da palavra ou o arquivo de palavra de parada no servidor, especifique os mesmos valores `ft_min_word_len`, `ft_max_word_len`, e `ft_stopword_file` para `myisamchk` que você usa para `mysqld`. Por exemplo, se você tiver definido o comprimento mínimo da palavra em 3, você pode reparar uma tabela com **isammychk** assim:

```
myisamchk --recover --ft_min_word_len=3 tbl_name.MYI
```

Para garantir que `myisamchk` e o servidor usam os mesmos valores para parâmetros de texto completo, você pode colocar cada um nas seções `[mysqld]` e `[myisamchk]` de um arquivo de opções:

```
[mysqld]
ft_min_word_len=3

[myisamchk]
ft_min_word_len=3
```

Uma alternativa ao uso de `myisamchk` é usar o `REPAIR TABLE`, `ANALYZE TABLE`, `OPTIMIZE TABLE`, ou `ALTER TABLE`.
