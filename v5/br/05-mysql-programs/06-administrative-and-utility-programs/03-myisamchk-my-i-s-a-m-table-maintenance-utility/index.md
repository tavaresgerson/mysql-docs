### 4.6.3 myisamchk — Ferramenta de manutenção de tabelas MyISAM

4.6.3.1 Opções Gerais do myisamchk

4.6.3.2 myisamchk Verificar opções

4.6.3.3 Opções de reparo do myisamchk

4.6.3.4 Outras opções do myisamchk

4.6.3.5 Obter informações da tabela com myisamchk

4.6.3.6 Uso de memória do myisamchk

O utilitário **myisamchk** obtém informações sobre as tabelas ou verificações do seu banco de dados, realiza reparos ou otimiza-as. O **myisamchk** funciona com tabelas `MyISAM` (tabelas que possuem arquivos `.MYD` e `.MYI` para armazenar dados e índices).

Você também pode usar as instruções `CHECK TABLE` e `REPAIR TABLE` para verificar e reparar tabelas `MyISAM`. Veja a Seção 13.7.2.2, “Instrução CHECK TABLE”, e a Seção 13.7.2.5, “Instrução REPAIR TABLE”.

O uso de **myisamchk** com tabelas particionadas não é suportado.

Cuidado

É melhor fazer um backup de uma tabela antes de realizar uma operação de reparo da tabela; em algumas circunstâncias, a operação pode causar perda de dados. As possíveis causas incluem, mas não estão limitadas a, erros no sistema de arquivos.

Invoque **myisamchk** da seguinte forma:

```sql
myisamchk [options] tbl_name ...
```

As opções especificam o que você deseja que o *`myisamchk`* faça. Elas são descritas nas seções a seguir. Você também pode obter uma lista de opções invocando **myisamchk --help**.

Sem opções, o **myisamchk** simplesmente verifica sua tabela como operação padrão. Para obter mais informações ou para instruir o **myisamchk** a tomar medidas corretivas, especifique as opções conforme descrito na discussão a seguir.

*`tbl_name`* é a tabela do banco de dados que você deseja verificar ou reparar. Se você executar o **myisamchk** em algum lugar que não seja o diretório do banco de dados, você deve especificar o caminho para o diretório do banco de dados, porque o **myisamchk** não tem a menor ideia de onde o banco de dados está localizado. Na verdade, o **myisamchk** não se importa se os arquivos com os quais você está trabalhando estão localizados em um diretório de banco de dados. Você pode copiar os arquivos que correspondem a uma tabela do banco de dados para outro local e realizar operações de recuperação neles.

Você pode nomear várias tabelas na linha de comando do comando **myisamchk** se desejar. Você também pode especificar uma tabela nomeando seu arquivo de índice (o arquivo com o sufixo `.MYI`). Isso permite que você especifique todas as tabelas em um diretório usando o padrão `*.MYI`. Por exemplo, se você estiver em um diretório de banco de dados, você pode verificar todas as tabelas `MyISAM` nesse diretório da seguinte maneira:

```sql
myisamchk *.MYI
```

Se você não estiver no diretório do banco de dados, pode verificar todas as tabelas lá, especificando o caminho para o diretório:

```sql
myisamchk /path/to/database_dir/*.MYI
```

Você pode até verificar todas as tabelas em todos os bancos de dados, especificando um caractere curinga com o caminho para o diretório de dados do MySQL:

```sql
myisamchk /path/to/datadir/*/*.MYI
```

A maneira recomendada para verificar rapidamente todas as tabelas `MyISAM` é:

```sql
myisamchk --silent --fast /path/to/datadir/*/*.MYI
```

Se você quiser verificar todas as tabelas `MyISAM` e reparar aquelas que estão corrompidas, você pode usar o seguinte comando:

```sql
myisamchk --silent --force --fast --update-state \
          --key_buffer_size=64M --myisam_sort_buffer_size=64M \
          --read_buffer_size=1M --write_buffer_size=1M \
          /path/to/datadir/*/*.MYI
```

Este comando pressupõe que você tem mais de 64 MB de espaço livre. Para obter mais informações sobre a alocação de memória com **myisamchk**, consulte a Seção 4.6.3.6, “Uso de memória do myisamchk”.

Para obter informações adicionais sobre o uso do **myisamchk**, consulte a Seção 7.6, “Manutenção e Recuperação após Falha de Tabelas MyISAM”.

Importante

\*Você deve garantir que nenhum outro programa esteja usando as tabelas enquanto estiver executando o **myisamchk**. A maneira mais eficaz de fazer isso é desligar o servidor MySQL enquanto estiver executando o **myisamchk**, ou bloquear todas as tabelas nas quais o **myisamchk** está sendo usado.

Caso contrário, ao executar **myisamchk**, pode ser exibida a seguinte mensagem de erro:

```sql
warning: clients are using or haven't closed the table properly
```

Isso significa que você está tentando verificar uma tabela que foi atualizada por outro programa (como o servidor **mysqld**) que ainda não fechou o arquivo ou que morreu sem fechar o arquivo corretamente, o que às vezes pode levar à corrupção de uma ou mais tabelas `MyISAM`.

Se o **mysqld** estiver em execução, você deve forçar-lo a descartar quaisquer modificações de tabela que ainda estejam em buffer na memória usando `FLUSH TABLES`. Em seguida, você deve garantir que ninguém esteja usando as tabelas enquanto estiver executando o **myisamchk**

No entanto, a maneira mais fácil de evitar esse problema é usar `CHECK TABLE` em vez de **myisamchk** para verificar tabelas. Veja a Seção 13.7.2.2, “Instrução CHECK TABLE”.

O **myisamchk** suporta as seguintes opções, que podem ser especificadas na linha de comando ou no grupo **\[myisamchk]** de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.21 Opções do myisamchk**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para myisamchk."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="myisamchk-other-options.html#option_myisamchk_analyze">--analisar</a></td> <td>Analise a distribuição dos valores-chave</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_backup">--backup</a></td> <td>Faça um backup do arquivo .MYD como file_name-time.BAK</td> </tr><tr><td><a class="link" href="myisamchk-other-options.html#option_myisamchk_block-search">--block-search</a></td> <td>Encontre o registro de que um bloco no deslocamento dado pertence</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_character-sets-dir">--sets-de-caracteres-dir</a></td> <td>Diretório onde os conjuntos de caracteres podem ser encontrados</td> </tr><tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_check">--check</a></td> <td>Verifique a tabela em busca de erros</td> </tr><tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_check-only-changed">--check-only-changed</a></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_correct-checksum">--correct-checksum</a></td> <td>Corrija as informações do checksum da tabela</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_data-file-length">--data-file-length</a></td> <td>Comprimento máximo do arquivo de dados (quando o arquivo de dados é recriado quando está cheio)</td> </tr><tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_debug">--debug</a></td> <td>Escreva o log de depuração</td> </tr><tr><td>--decode_bits</td> <td>Decodificar_bits</td> </tr><tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> </tr><tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_defaults-file">--defaults-file</a></td> <td>Arquivo de opção de leitura apenas nomeado</td> </tr><tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td><a class="link" href="myisamchk-other-options.html#option_myisamchk_description">--descrição</a></td> <td>Imprima algumas informações descritivas sobre a tabela</td> </tr><tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_extend-check">--extend-check</a></td> <td>Faça uma verificação ou reparo muito detalhado da tabela que tente recuperar todas as linhas possíveis do arquivo de dados</td> </tr><tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_fast">--rápido</a></td> <td>Verifique apenas as tabelas que não foram fechadas corretamente</td> </tr><tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_force">--force</a></td> <td>Realize uma operação de reparo automaticamente se o myisamchk encontrar erros na tabela</td> </tr><tr><td>--force</td> <td>Substitua arquivos temporários antigos. Para uso com a opção -r ou -o</td> </tr><tr><td>--ft_max_word_len</td> <td>Comprimento máximo de palavras para índices FULLTEXT</td> </tr><tr><td>--ft_min_word_len</td> <td>Comprimento mínimo de palavras para índices FULLTEXT</td> </tr><tr><td>--ft_stopword_file</td> <td>Use as palavras-chave de parada deste arquivo em vez da lista integrada</td> </tr><tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_HELP">--AJUDA</a></td> <td>Exibir mensagem de ajuda e sair</td> </tr><tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_help">--help</a></td> <td>Exibir mensagem de ajuda e sair</td> </tr><tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_information">--informação</a></td> <td>Imprima estatísticas informativas sobre a tabela que está sendo verificada</td> </tr><tr><td>--key_buffer_size</td> <td>Tamanho do buffer usado para blocos de índice para tabelas MyISAM</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_keys-used">--keys-used</a></td> <td>Um valor de bit que indica quais índices devem ser atualizados</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_max-record-length">--max-record-length</a></td> <td>Ignorar linhas maiores que o comprimento especificado se o myisamchk não conseguir alocar memória para armazená-las</td> </tr><tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_medium-check">--medium-check</a></td> <td>Faça uma verificação mais rápida do que uma operação de --extend-check</td> </tr><tr><td>--myisam_block_size</td> <td>Tamanho do bloco a ser usado para as páginas do índice MyISAM</td> </tr><tr><td>--myisam_sort_buffer_size</td> <td>O buffer que é alocado ao ordenar o índice ao realizar uma REPARAR ou ao criar índices com CREATE INDEX ou ALTER TABLE</td> </tr><tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_no-defaults">--no-defaults</a></td> <td>Não ler arquivos de opção</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_parallel-recover">--parallel-recover</a></td> <td>Usa a mesma técnica que -r e -n, mas cria todas as chaves em paralelo, usando diferentes threads (beta)</td> </tr><tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_print-defaults">--print-defaults</a></td> <td>Opções padrão de impressão</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_quick">--rápido</a></td> <td>Obtenha uma reparação mais rápida sem modificar o arquivo de dados</td> </tr><tr><td>--read_buffer_size</td> <td>Cada fio que realiza uma varredura sequencial aloca um buffer desse tamanho para cada tabela que ele varre.</td> </tr><tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_read-only">-- apenas leitura</a></td> <td>Não marque a tabela como marcada</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_recover">--recuperar</a></td> <td>Faça uma reparação que possa resolver quase qualquer problema, exceto chaves únicas que não são únicas</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_safe-recover">--safe-recover</a></td> <td>Faça uma reparação usando um método de recuperação antigo que lê todas as linhas em ordem e atualiza todas as árvores de índice com base nas linhas encontradas</td> </tr><tr><td><a class="link" href="myisamchk-other-options.html#option_myisamchk_set-auto-increment">--set-auto-increment</a></td> <td>Forçar a numeração AUTO_INCREMENT para novos registros começar no valor fornecido</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_set-collation">--set-collation</a></td> <td>Especifique a correspondência a ser usada para ordenar os índices da tabela</td> </tr><tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_silent">--silencioso</a></td> <td>Modo silencioso</td> </tr><tr><td>--sort_buffer_size</td> <td>O buffer que é alocado ao ordenar o índice ao realizar uma REPARAR ou ao criar índices com CREATE INDEX ou ALTER TABLE</td> </tr><tr><td><a class="link" href="myisamchk-other-options.html#option_myisamchk_sort-index">--sort-index</a></td> <td>Classifique os blocos da árvore de índice em ordem de alto para baixo</td> </tr><tr><td>--sort_key_blocks</td> <td>sort_key_blocks</td> </tr><tr><td><a class="link" href="myisamchk-other-options.html#option_myisamchk_sort-records">--sort-records</a></td> <td>Classificar registros de acordo com um índice específico</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_sort-recover">--sort-recover</a></td> <td>Forçar o myisamchk a usar a classificação para resolver as chaves, mesmo que os arquivos temporários sejam muito grandes</td> </tr><tr><td>--stats_method</td> <td>Especifica como o código de coleta de estatísticas de índice MyISAM deve tratar os NULLs</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_tmpdir">--tmpdir</a></td> <td>Diretório a ser usado para armazenar arquivos temporários</td> </tr><tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_unpack">--descompactar</a></td> <td>Descompactar uma tabela que foi compactada com o myisampack</td> </tr><tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_update-state">--update-state</a></td> <td>Armazene informações no arquivo .MYI para indicar quando a tabela foi verificada e se a tabela falhou</td> </tr><tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_verbose">--verbose</a></td> <td>Modo verbosos</td> </tr><tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_version">--version</a></td> <td>Exibir informações da versão e sair</td> </tr><tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_wait">--wait</a></td> <td>Aguarde a tabela bloqueada ser desbloqueada, em vez de encerrar</td> </tr><tr><td>--write_buffer_size</td> <td>Tamanho do buffer de escrita</td> </tr></tbody></table>
