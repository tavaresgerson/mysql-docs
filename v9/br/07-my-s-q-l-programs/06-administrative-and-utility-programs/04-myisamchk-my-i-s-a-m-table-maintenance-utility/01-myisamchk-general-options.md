#### 6.6.4.1 Opções Gerais de myisamchk

As opções descritas nesta seção podem ser usadas para qualquer tipo de operação de manutenção de tabelas realizada pelo **myisamchk**. As seções seguintes descrevem opções que se aplicam apenas a operações específicas, como verificação ou reparo de tabelas.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair. As opções são agrupadas por tipo de operação.

* `--HELP`, `-H`

  <table frame="box" rules="all" summary="Propriedades para HELP"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--HELP</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair. As opções são apresentadas em uma única lista.

* `--debug=debug_options`, `-# debug_options`

  <table frame="box" rules="all" summary="Propriedades para debug"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>d:t:o,/tmp/myisamchk.trace</code></td> </tr></tbody></table>

  Escrever um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O valor padrão é `d:t:o,/tmp/myisamchk.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--defaults-extra-file=nome_do_arquivo`

<table frame="box" rules="all" summary="Propriedades para defaults-extra-file">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--defaults-extra-file=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  </tbody>
</table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`nome_do_arquivo`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

* `--defaults-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para defaults-file">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--defaults-file=nome_do_arquivo</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do arquivo</td>
    </tr>
  </tbody>
  </table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`nome_do_arquivo`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--defaults-group-suffix=str</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
  </tbody>
  </table>

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **myisamchk** normalmente lê o grupo `[myisamchk]` . Se esta opção for dada como `--defaults-group-suffix=_other`, **myisamchk** também lê o grupo `[myisamchk_other]` .

Para informações adicionais sobre isso e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para no-defaults"><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de configuração do MySQL”.

  Para informações adicionais sobre isso e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para print-defaults"><tbody><tr><th>Formato de linha de comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivo de opção”.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para modo silencioso"><tbody><tr><th>Formato de linha de comando</th> <td><code>--silent</code></td> </tr></tbody></table>

  Modo silencioso. Escreva a saída apenas quando ocorrerem erros. Você pode usar `-s` duas vezes (`-ss`) para tornar o **myisamchk** muito silencioso.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para modo verbose"><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose. Imprima mais informações sobre o que o programa faz. Isso pode ser usado com `-d` e `-e`. Use `-v` várias vezes (`-vv`, `-vvv`) para obter ainda mais saída.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para AJUDA"><tbody><tr><th>Formato de linha de comando</th> <td><code>--HELP</code></td> </tr></tbody></table>

  Exibir informações de versão e sair.

* `--wait`, `-w`

  <table frame="box" rules="all" summary="Propriedades para AJUDA"><tbody><tr><th>Formato de linha de comando</th> <td><code>--HELP</code></td> </tr></tbody></table>

  Em vez de terminar com um erro se a tabela estiver bloqueada, espere até que a tabela seja desbloqueada antes de continuar. Se você estiver executando o **mysqld** com o bloqueio externo desativado, a tabela só pode ser bloqueada por outro comando **myisamchk**.

Você também pode definir as seguintes variáveis usando a sintaxe `--var_name=value`:

<table frame="box" rules="all" summary="Propriedades para HELP"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--HELP</code></td> </tr></tbody></table>

As possíveis variáveis do **myisamchk** e seus valores padrão podem ser examinados com **myisamchk --help**:

`myisam_sort_buffer_size` é usado quando as chaves são reparadas por meio da ordenação de chaves, que é o caso normal quando você usa `--recover`. `sort_buffer_size` é um sinônimo desatualizado de `myisam_sort_buffer_size`.

`key_buffer_size` é usado quando você está verificando a tabela com `--extend-check` ou quando as chaves são reparadas inserindo chaves linha por linha na tabela (como ao fazer inserções normais). A reparação através do buffer de chave é usada nos seguintes casos:

* Você usa `--safe-recover`.
* Os arquivos temporários necessários para ordenar as chaves seriam mais do que o dobro do tamanho quando criando o arquivo de chave diretamente. Isso geralmente é o caso quando você tem valores de chave grandes para colunas `CHAR`, `VARCHAR` ou `TEXT`, porque a operação de ordenação precisa armazenar os valores completos da chave à medida que prossegue. Se você tiver muito espaço temporário e puder forçar o **myisamchk** a reparar por meio da ordenação, você pode usar a opção `--sort-recover`.

A reparação através do buffer de chave consome muito menos espaço em disco do que usar a ordenação, mas também é muito mais lenta.

Se você deseja uma reparação mais rápida, defina as variáveis `key_buffer_size` e `myisam_sort_buffer_size` para cerca de 25% da sua memória disponível. Você pode definir ambas as variáveis para valores grandes, porque apenas uma delas é usada de cada vez.

`myisam_block_size` é o tamanho usado para blocos de índice.

`stats_method` influencia como os valores `NULL` são tratados para a coleta de estatísticas de índice quando a opção `--analyze` é fornecida. Ele atua como a variável de sistema `myisam_stats_method`. Para mais informações, consulte a descrição de `myisam_stats_method` na Seção 7.1.8, “Variáveis de Sistema do Servidor”, e na Seção 10.3.8, “Coleta de Estatísticas de Índices de InnoDB e MyISAM”.

`ft_min_word_len` e `ft_max_word_len` indicam o comprimento mínimo e máximo da palavra para índices `FULLTEXT` em tabelas `MyISAM`. `ft_stopword_file` nomeia o arquivo de palavras-chave. Estes precisam ser definidos nas seguintes circunstâncias.

Se você usar **myisamchk** para realizar uma operação que modifica índices de tabela (como reparo ou análise), os índices `FULLTEXT` são reconstruídos usando os valores padrão dos parâmetros de texto completo para comprimento mínimo e máximo da palavra e o arquivo de palavras-chave, a menos que você especifique o contrário. Isso pode resultar em consultas que falham.

O problema ocorre porque esses parâmetros são conhecidos apenas pelo servidor. Eles não são armazenados nos arquivos de índice `MyISAM`. Para evitar o problema se você tiver modificado o comprimento mínimo ou máximo da palavra ou o arquivo de palavras-chave no servidor, especifique os mesmos valores de `ft_min_word_len`, `ft_max_word_len` e `ft_stopword_file` para **myisamchk** que você usa para **mysqld**. Por exemplo, se você definiu o comprimento mínimo da palavra para 3, você pode reparar uma tabela com **myisamchk** da seguinte forma:

```
myisamchk --recover --ft_min_word_len=3 tbl_name.MYI
```

Para garantir que **myisamchk** e o servidor usem os mesmos valores para parâmetros de texto completo, você pode colocar cada um deles nas seções `[mysqld]` e `[myisamchk]` de um arquivo de opções:

```
[mysqld]
ft_min_word_len=3

[myisamchk]
ft_min_word_len=3
```

Uma alternativa para usar o **myisamchk** é usar as instruções `REPAIR TABLE`, `ANALYZE TABLE`, `OPTIMIZE TABLE` ou `ALTER TABLE`. Essas instruções são executadas pelo servidor, que conhece os valores corretos dos parâmetros de texto completo a serem usados.