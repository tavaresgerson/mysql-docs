#### 6.6.4.1 Opções Gerais do `myisamchk`

As opções descritas nesta seção podem ser usadas para qualquer tipo de operação de manutenção de tabelas realizada pelo `myisamchk`. As seções seguintes descrevem opções que se aplicam apenas a operações específicas, como verificação ou reparo de tabelas.

*  `--help`, `-?`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair. As opções são agrupadas por tipo de operação.
*  `--HELP`, `-H`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--HELP</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair. As opções são apresentadas em uma única lista.
*  `--debug=debug_options`, `-# debug_options`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>d:t:o,/tmp/myisamchk.trace</code></td> </tr></tbody></table>

  Escrever um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O valor padrão é `d:t:o,/tmp/myisamchk.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--defaults-extra-file=nome_do_arquivo`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Ler este arquivo de opções após o arquivo de opções globais, mas (no Unix) antes do arquivo de opções de usuário. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`nome_do_arquivo`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte  Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.
*  `--defaults-file=nome_do_arquivo`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas a opção fornecida. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`nome_do_arquivo`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre essa e outras opções de arquivo, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.
*  `--defaults-group-suffix=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o `myisamchk` normalmente lê o grupo `[myisamchk]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o `myisamchk` também lê o grupo `[myisamchk_other]`.

  Para obter informações adicionais sobre essa e outras opções de arquivo, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.
*  `--no-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário `mysql_config_editor`. Consulte Seção 6.6.7, “mysql_config_editor — Ferramenta de configuração do MySQL”.

  Para obter informações adicionais sobre essa e outras opções de arquivo, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.
*  `--print-defaults`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

  Para obter informações adicionais sobre isso e outras opções de arquivos de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
*  `--silent`, `-s`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--silent</code></td> </tr></tbody></table>

  Modo silencioso. Escreva a saída apenas quando ocorrerem erros. Você pode usar `-s` duas vezes (`-ss`) para tornar o `myisamchk` muito silencioso.
*  `--verbose`, `-v`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose. Imprima mais informações sobre o que o programa faz. Isso pode ser usado com `-d` e `-e`. Use `-v` várias vezes (`-vv`, `-vvv`) para obter ainda mais saída.
*  `--version`, `-V`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--version</code></td> </tr></tbody></table>

  Exibir informações de versão e sair.
*  `--wait`, `-w`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--wait</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Em vez de terminar com um erro se a tabela estiver bloqueada, espere até que a tabela seja desbloqueada antes de continuar. Se você estiver executando o `mysqld` com o bloqueio externo desativado, a tabela só pode ser bloqueada por outro comando `myisamchk`.

Você também pode definir as seguintes variáveis usando a sintaxe `--var_name=value`:

<table>
   <thead>
      <tr>
         <th>Variável</th>
         <th>Valor padrão</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>decode_bits</code></td>
         <td><code>9</code></td>
      </tr>
      <tr>
         <td><code>ft_max_word_len</code></td>
         <td><code>dependente da versão</code></td>
      </tr>
      <tr>
         <td><code>ft_min_word_len</code></td>
         <td><code>4</code></td>
      </tr>
      <tr>
         <td><code>ft_stopword_file</code></td>
         <td>lista embutida</td>
      </tr>
      <tr>
         <td><code>key_buffer_size</code></td>
         <td><code>523264</code></td>
      </tr>
      <tr>
         <td><code>myisam_block_size</code></td>
         <td><code>1024</code></td>
      </tr>
      <tr>
         <td><code>myisam_sort_key_blocks</code></td>
         <td><code>16</code></td>
      </tr>
      <tr>
         <td><code>read_buffer_size</code></td>
         <td><code>262136</code></td>
      </tr>
      <tr>
         <td><code>sort_buffer_size</code></td>
         <td><code>2097144</code></td>
      </tr>
      <tr>
         <td><code>sort_key_blocks</code></td>
         <td><code>16</code></td>
      </tr>
      <tr>
         <td><code>stats_method</code></td>
         <td><code>nulls_unequal</code></td>
      </tr>
      <tr>
         <td><code>write_buffer_size</code></td>
         <td><code>262136</code></td>
      </tr>
   </tbody>
</table>

As possíveis variáveis do `myisamchk` e seus valores padrão podem ser examinadas com `myisamchk --help`:

`myisam_sort_buffer_size` é usado quando as chaves são reparadas por ordenação de chaves, que é o caso normal ao usar `--recover`. `sort_buffer_size` é um sinônimo desatualizado de `myisam_sort_buffer_size`.

`key_buffer_size` é usado quando você está verificando a tabela com `--extend-check` ou quando as chaves são reparadas inserindo chaves linha por linha na tabela (como ao fazer inserções normais). A reparação através do buffer de chaves é usada nos seguintes casos:

* Você usa `--safe-recover`.
* Os arquivos temporários necessários para ordenar as chaves seriam mais do que o dobro do tamanho quando você cria o arquivo de chave diretamente. Isso geralmente acontece quando você tem valores de chave grandes para as colunas `CHAR`, `VARCHAR` ou `TEXT`, porque a operação de ordenação precisa armazenar os valores completos da chave à medida que prossegue. Se você tiver muito espaço temporário e puder forçar o `myisamchk` a reparar por meio da ordenação, você pode usar a opção `--sort-recover`.

Reparar através do buffer de chave consome muito menos espaço em disco do que usar a ordenação, mas também é muito mais lento.

Se você quiser uma reparação mais rápida, defina as variáveis `key_buffer_size` e `myisam_sort_buffer_size` para cerca de 25% da sua memória disponível. Você pode definir ambas as variáveis para valores grandes, porque apenas uma delas é usada de cada vez.

`myisam_block_size` é o tamanho usado para blocos de índice.

`stats_method` influencia como os valores `NULL` são tratados para a coleta de estatísticas de índice quando a opção `--analyze` é fornecida. Ele atua como a variável de sistema `myisam_stats_method`. Para mais informações, consulte a descrição de `myisam_stats_method` na Seção 7.1.8, “Variáveis do Sistema do Servidor”, e na Seção 10.3.8, “Coleta de Estatísticas de Índices de MyISAM e InnoDB”.

`ft_min_word_len` e `ft_max_word_len` indicam o comprimento mínimo e máximo da palavra para índices `FULLTEXT` em tabelas `MyISAM`. `ft_stopword_file` nomeia o arquivo de palavras-chave. Essas precisam ser definidas nas seguintes circunstâncias.

Se você usar `myisamchk` para realizar uma operação que modifica índices de tabela (como reparo ou análise), os índices `FULLTEXT` são reconstruídos usando os valores padrão dos parâmetros de texto completo para comprimento mínimo e máximo da palavra e o arquivo de palavras-chave, a menos que você especifique o contrário. Isso pode resultar em consultas que falham.

O problema ocorre porque esses parâmetros são conhecidos apenas pelo servidor. Eles não são armazenados nos arquivos de índice `MyISAM`. Para evitar o problema se você tiver modificado o comprimento mínimo ou máximo da palavra ou o arquivo de palavras-chave no servidor, especifique os mesmos valores de `ft_min_word_len`, `ft_max_word_len` e `ft_stopword_file` para `myisamchk` que você usa para `mysqld`. Por exemplo, se você definiu o comprimento mínimo da palavra para 3, você pode reparar uma tabela com `myisamchk` da seguinte forma:

```
myisamchk --recover --ft_min_word_len=3 tbl_name.MYI
```

Para garantir que `myisamchk` e o servidor usem os mesmos valores para os parâmetros de texto completo, você pode colocar cada um deles nas seções `[mysqld]` e `[myisamchk]` de um arquivo de opções:

```
[mysqld]
ft_min_word_len=3

[myisamchk]
ft_min_word_len=3
```

Uma alternativa ao uso de `myisamchk` é usar `REPAIR TABLE`, `ANALYZE TABLE`, `OPTIMIZE TABLE` ou `ALTER TABLE`. Essas instruções são executadas pelo servidor, que conhece os valores corretos dos parâmetros de texto completo a serem usados.