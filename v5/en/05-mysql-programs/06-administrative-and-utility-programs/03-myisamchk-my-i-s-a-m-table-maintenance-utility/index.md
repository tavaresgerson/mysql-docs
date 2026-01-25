### 4.6.3 myisamchk — Utilitário de Manutenção de Tabela MyISAM

4.6.3.1 Opções Gerais do myisamchk

4.6.3.2 Opções de Verificação do myisamchk

4.6.3.3 Opções de Reparo do myisamchk

4.6.3.4 Outras Opções do myisamchk

4.6.3.5 Obtendo Informações da Tabela com myisamchk

4.6.3.6 Uso de Memória do myisamchk

O utilitário **myisamchk** obtém informações sobre suas tabelas de Database ou as verifica, repara ou otimiza. **myisamchk** funciona com tabelas `MyISAM` (tabelas que possuem arquivos `.MYD` e `.MYI` para armazenar dados e Indexes).

Você também pode usar as instruções `CHECK TABLE` e `REPAIR TABLE` para verificar e reparar tabelas `MyISAM`. Consulte a Seção 13.7.2.2, “Instrução CHECK TABLE”, e a Seção 13.7.2.5, “Instrução REPAIR TABLE”.

O uso do **myisamchk** com tabelas particionadas não é suportado.

Atenção

É melhor fazer um backup de uma tabela antes de executar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. As possíveis causas incluem, mas não se limitam a, erros de sistema de arquivos (file system errors).

Invoque **myisamchk** desta forma:

```sql
myisamchk [options] tbl_name ...
```

As *`options`* (opções) especificam o que você deseja que o **myisamchk** faça. Elas estão descritas nas seções a seguir. Você também pode obter uma lista de opções invocando **myisamchk --help**.

Sem opções, o **myisamchk** simplesmente verifica sua tabela como operação padrão. Para obter mais informações ou para instruir o **myisamchk** a tomar medidas corretivas, especifique opções conforme descrito na discussão a seguir.

*`tbl_name`* é a tabela do Database que você deseja verificar ou reparar. Se você executar o **myisamchk** em um local diferente do diretório do Database, deverá especificar o path (caminho) para o diretório do Database, pois o **myisamchk** não sabe onde o Database está localizado. Na verdade, o **myisamchk** não se importa se os arquivos nos quais você está trabalhando estão localizados em um diretório do Database. Você pode copiar os arquivos que correspondem a uma tabela do Database para algum outro local e executar operações de recovery (recuperação) neles.

Você pode nomear várias tabelas na linha de comando do **myisamchk**, se desejar. Você também pode especificar uma tabela nomeando seu arquivo Index (o arquivo com o sufixo `.MYI`). Isso permite que você especifique todas as tabelas em um diretório usando o padrão `*.MYI`. Por exemplo, se você estiver em um diretório de Database, poderá verificar todas as tabelas `MyISAM` nesse diretório desta forma:

```sql
myisamchk *.MYI
```

Se você não estiver no diretório do Database, poderá verificar todas as tabelas lá especificando o path para o diretório:

```sql
myisamchk /path/to/database_dir/*.MYI
```

Você pode até verificar todas as tabelas em todos os Databases especificando um wildcard (curinga) com o path para o diretório de dados do MySQL:

```sql
myisamchk /path/to/datadir/*/*.MYI
```

A maneira recomendada de verificar rapidamente todas as tabelas `MyISAM` é:

```sql
myisamchk --silent --fast /path/to/datadir/*/*.MYI
```

Se você quiser verificar todas as tabelas `MyISAM` e reparar qualquer uma que esteja corrompida, você pode usar o seguinte comando:

```sql
myisamchk --silent --force --fast --update-state \
          --key_buffer_size=64M --myisam_sort_buffer_size=64M \
          --read_buffer_size=1M --write_buffer_size=1M \
          /path/to/datadir/*/*.MYI
```

Este comando pressupõe que você tenha mais de 64MB livres. Para obter mais informações sobre a alocação de memória com o **myisamchk**, consulte a Seção 4.6.3.6, “Uso de Memória do myisamchk”.

Para obter informações adicionais sobre o uso do **myisamchk**, consulte a Seção 7.6, “Manutenção de Tabela MyISAM e Crash Recovery”.

Importante

*Você deve garantir que nenhum outro programa esteja usando as tabelas enquanto você executa o **myisamchk***. A forma mais eficaz de fazer isso é desligar o MySQL server enquanto executa o **myisamchk**, ou aplicar Lock em todas as tabelas nas quais o **myisamchk** está sendo usado.

Caso contrário, ao executar o **myisamchk**, ele pode exibir a seguinte mensagem de erro:

```sql
warning: clients are using or haven't closed the table properly
```

Isso significa que você está tentando verificar uma tabela que foi atualizada por outro programa (como o **mysqld** server) que ainda não fechou o arquivo ou que falhou (died) sem fechar o arquivo corretamente, o que às vezes pode levar à corrupção de uma ou mais tabelas `MyISAM`.

Se o **mysqld** estiver em execução, você deve forçá-lo a fazer o flush de quaisquer modificações de tabela que ainda estejam em Buffer na memória usando `FLUSH TABLES`. Você deve então garantir que ninguém esteja usando as tabelas enquanto você executa o **myisamchk**.

No entanto, a maneira mais fácil de evitar esse problema é usar `CHECK TABLE` em vez de **myisamchk** para verificar tabelas. Consulte a Seção 13.7.2.2, “Instrução CHECK TABLE”.

O **myisamchk** suporta as seguintes opções, que podem ser especificadas na linha de comando ou no grupo `[myisamchk]` de um arquivo de opções. Para obter informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando Arquivos de Opções”.

**Tabela 4.21 Opções do myisamchk**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para myisamchk."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--analyze</td> <td>Analisa a distribuição dos valores de key (chave)</td> </tr><tr><td>--backup</td> <td>Cria um backup do arquivo .MYD como *nome_do_arquivo*-*hora*.BAK</td> </tr><tr><td>--block-search</td> <td>Encontra o record (registro) ao qual pertence um bloco no offset (deslocamento) fornecido</td> </tr><tr><td>--character-sets-dir</td> <td>Diretório onde os conjuntos de caracteres podem ser encontrados</td> </tr><tr><td>--check</td> <td>Verifica a tabela em busca de erros</td> </tr><tr><td>--check-only-changed</td> <td>Verifica apenas as tabelas que foram alteradas desde a última verificação</td> </tr><tr><td>--correct-checksum</td> <td>Corrige a informação de checksum para a tabela</td> </tr><tr><td>--data-file-length</td> <td>Comprimento máximo do arquivo de dados (ao recriar o arquivo de dados quando estiver cheio)</td> </tr><tr><td>--debug</td> <td>Escreve o log de debugging</td> </tr><tr><td>--decode_bits</td> <td>Decode_bits</td> </tr><tr><td>--defaults-extra-file</td> <td>Lê o arquivo de opções nomeado além dos arquivos de opções usuais</td> </tr><tr><td>--defaults-file</td> <td>Lê apenas o arquivo de opções nomeado</td> </tr><tr><td>--defaults-group-suffix</td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td>--description</td> <td>Imprime algumas informações descritivas sobre a tabela</td> </tr><tr><td>--extend-check</td> <td>Realiza uma verificação ou reparo muito completa da tabela que tenta recuperar todas as linhas possíveis do arquivo de dados</td> </tr><tr><td>--fast</td> <td>Verifica apenas as tabelas que não foram fechadas corretamente</td> </tr><tr><td>--force</td> <td>Executa uma operação de reparo automaticamente se o myisamchk encontrar quaisquer erros na tabela</td> </tr><tr><td>--force</td> <td>Sobrescreve arquivos temporários antigos. Para uso com a opção -r ou -o</td> </tr><tr><td>--ft_max_word_len</td> <td>Comprimento máximo de palavra para Indexes FULLTEXT</td> </tr><tr><td>--ft_min_word_len</td> <td>Comprimento mínimo de palavra para Indexes FULLTEXT</td> </tr><tr><td>--ft_stopword_file</td> <td>Usa stopwords (palavras de parada) deste arquivo em vez da lista built-in (incorporada)</td> </tr><tr><td>--HELP</td> <td>Exibe mensagem de ajuda e sai</td> </tr><tr><td>--help</td> <td>Exibe mensagem de ajuda e sai</td> </tr><tr><td>--information</td> <td>Imprime estatísticas informativas sobre a tabela que está sendo verificada</td> </tr><tr><td>--key_buffer_size</td> <td>Tamanho do Buffer usado para blocos de Index de tabelas MyISAM</td> </tr><tr><td>--keys-used</td> <td>Um valor de bit que indica quais Indexes devem ser atualizados</td> </tr><tr><td>--max-record-length</td> <td>Ignora linhas maiores do que o comprimento fornecido se o myisamchk não puder alocar memória para contê-las</td> </tr><tr><td>--medium-check</td> <td>Realiza uma verificação mais rápida do que uma operação --extend-check</td> </tr><tr><td>--myisam_block_size</td> <td>Tamanho do Block a ser usado para páginas de Index MyISAM</td> </tr><tr><td>--myisam_sort_buffer_size</td> <td>O Buffer que é alocado ao ordenar o Index durante um REPAIR ou ao criar Indexes com CREATE INDEX ou ALTER TABLE</td> </tr><tr><td>--no-defaults</td> <td>Não lê arquivos de opções</td> </tr><tr><td>--parallel-recover</td> <td>Usa a mesma técnica que -r e -n, mas cria todas as keys em paralelo, usando diferentes Threads (beta)</td> </tr><tr><td>--print-defaults</td> <td>Imprime opções padrão</td> </tr><tr><td>--quick</td> <td>Consegue um reparo mais rápido ao não modificar o arquivo de dados</td> </tr><tr><td>--read_buffer_size</td> <td>Cada Thread que faz um sequential scan (leitura sequencial) aloca um Buffer deste tamanho para cada tabela que ele verifica</td> </tr><tr><td>--read-only</td> <td>Não marca a tabela como verificada</td> </tr><tr><td>--recover</td> <td>Realiza um reparo que pode corrigir quase todos os problemas, exceto keys exclusivas que não são exclusivas (unique keys that aren't unique)</td> </tr><tr><td>--safe-recover</td> <td>Realiza um reparo usando um método de recovery antigo que lê todas as linhas em ordem e atualiza todas as árvores de Index com base nas linhas encontradas</td> </tr><tr><td>--set-auto-increment</td> <td>Força a numeração AUTO_INCREMENT para novos records a começar no valor fornecido</td> </tr><tr><td>--set-collation</td> <td>Especifica o collation (ordenamento) a ser usado para ordenar os Indexes da tabela</td> </tr><tr><td>--silent</td> <td>Modo silencioso</td> </tr><tr><td>--sort_buffer_size</td> <td>O Buffer que é alocado ao ordenar o Index durante um REPAIR ou ao criar Indexes com CREATE INDEX ou ALTER TABLE</td> </tr><tr><td>--sort-index</td> <td>Ordena os blocos da árvore de Index em ordem decrescente</td> </tr><tr><td>--sort_key_blocks</td> <td>sort_key_blocks</td> </tr><tr><td>--sort-records</td> <td>Ordena records (registros) de acordo com um Index específico</td> </tr><tr><td>--sort-recover</td> <td>Força o myisamchk a usar a ordenação para resolver as keys, mesmo que os arquivos temporários sejam muito grandes</td> </tr><tr><td>--stats_method</td> <td>Especifica como o código de coleta de estatísticas de Index MyISAM deve tratar os NULLs</td> </tr><tr><td>--tmpdir</td> <td>Diretório a ser usado para armazenar arquivos temporários</td> </tr><tr><td>--unpack</td> <td>Descompacta uma tabela que foi empacotada com myisampack</td> </tr><tr><td>--update-state</td> <td>Armazena informações no arquivo .MYI para indicar quando a tabela foi verificada e se a tabela falhou (crashed)</td> </tr><tr><td>--verbose</td> <td>Modo verboso (detalhado)</td> </tr><tr><td>--version</td> <td>Exibe informações da versão e sai</td> </tr><tr><td>--wait</td> <td>Espera que a tabela com Lock seja desbloqueada, em vez de ser encerrado</td> </tr><tr><td>--write_buffer_size</td> <td>Tamanho do Write Buffer (Buffer de escrita)</td> </tr> </tbody></table>