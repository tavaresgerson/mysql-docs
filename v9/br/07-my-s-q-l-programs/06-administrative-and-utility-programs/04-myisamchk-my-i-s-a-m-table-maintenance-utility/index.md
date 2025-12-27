### 6.6.4 myisamchk — Ferramenta de Manutenção de Tabelas MyISAM

6.6.4.1 myisamchk Opções Gerais

6.6.4.2 myisamchk Opções de Verificação

6.6.4.3 myisamchk Opções de Reparo

6.6.4.4 Outras Opções do myisamchk

6.6.4.5 Obtenção de Informações sobre Tabelas com o myisamchk

6.6.4.6 Uso de Memória do myisamchk

A **ferramenta myisamchk** obtém informações sobre as tabelas do seu banco de dados ou verifica, repara ou otimiza-as. A **myisamchk** funciona com tabelas `MyISAM` (tabelas que possuem arquivos `.MYD` e `.MYI` para armazenar dados e índices).

Você também pode usar as instruções `CHECK TABLE` e `REPAIR TABLE` para verificar e reparar tabelas `MyISAM`. Consulte a Seção 15.7.3.2, “Instrução CHECK TABLE”, e a Seção 15.7.3.5, “Instrução REPAIR TABLE”.

O uso da **myisamchk** com tabelas particionadas não é suportado.

Cuidado

É melhor fazer um backup de uma tabela antes de realizar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. As possíveis causas incluem, mas não estão limitadas a, erros no sistema de arquivos.

Inicie a **myisamchk** da seguinte forma:

```
myisamchk [options] tbl_name ...
```

Os *`options`* especificam o que você deseja que a **myisamchk** faça. Eles são descritos nas seções a seguir. Você também pode obter uma lista de opções invocando a **myisamchk --help**.

Sem opções, a **myisamchk** simplesmente verifica sua tabela como a operação padrão. Para obter mais informações ou para dizer à **myisamchk** que tome medidas corretivas, especifique opções conforme descrito na discussão a seguir.

*`tbl_name`* é a tabela do banco de dados que você deseja verificar ou reparar. Se você executar o **myisamchk** em um local diferente do diretório do banco de dados, você deve especificar o caminho para o diretório do banco de dados, pois o **myisamchk** não tem a menor ideia de onde o banco de dados está localizado. Na verdade, o **myisamchk** não se importa se os arquivos com os quais você está trabalhando estão localizados em um diretório de banco de dados. Você pode copiar os arquivos que correspondem a uma tabela do banco de dados para outro local e realizar operações de recuperação neles.

Você pode nomear várias tabelas na linha de comando do **myisamchk** se desejar. Você também pode especificar uma tabela nomeando seu arquivo de índice (o arquivo com o sufixo `.MYI`). Isso permite que você especifique todas as tabelas em um diretório usando o padrão `*.MYI`. Por exemplo, se você estiver em um diretório de banco de dados, você pode verificar todas as tabelas `MyISAM` nesse diretório assim:

```
myisamchk *.MYI
```

Se você não estiver no diretório do banco de dados, você pode verificar todas as tabelas lá, especificando o caminho para o diretório:

```
myisamchk /path/to/database_dir/*.MYI
```

Você pode até verificar todas as tabelas em todos os bancos de dados, especificando um caractere curinga com o caminho para o diretório de dados do MySQL:

```
myisamchk /path/to/datadir/*/*.MYI
```

A maneira recomendada para verificar rapidamente todas as tabelas `MyISAM` é:

```
myisamchk --silent --fast /path/to/datadir/*/*.MYI
```

Se você quiser verificar todas as tabelas `MyISAM` e reparar quaisquer que estejam corrompidas, você pode usar o seguinte comando:

```
myisamchk --silent --force --fast --update-state \
          --key_buffer_size=64M --myisam_sort_buffer_size=64M \
          --read_buffer_size=1M --write_buffer_size=1M \
          /path/to/datadir/*/*.MYI
```

Este comando assume que você tem mais de 64MB de memória livre. Para obter mais informações sobre a alocação de memória com o **myisamchk**, consulte a Seção 6.6.4.6, “Uso de Memória do **myisamchk”**.

Para obter informações adicionais sobre o uso do **myisamchk**, consulte a Seção 9.6, “Manutenção de Tabelas MyISAM e Recuperação de Falhas”.

Importante

*Você deve garantir que nenhum outro programa esteja usando as tabelas enquanto estiver executando **myisamchk**. A maneira mais eficaz de fazer isso é desligar o servidor MySQL enquanto estiver executando **myisamchk**, ou bloquear todas as tabelas nas quais **myisamchk** está sendo usado.

Caso contrário, ao executar **myisamchk**, ele pode exibir a seguinte mensagem de erro:

```
warning: clients are using or haven't closed the table properly
```

Isso significa que você está tentando verificar uma tabela que foi atualizada por outro programa (como o servidor **mysqld**) que ainda não fechou o arquivo ou que morreu sem fechar o arquivo corretamente, o que às vezes pode levar à corrupção de uma ou mais tabelas `MyISAM`.

Se o **mysqld** estiver em execução, você deve forçar-lo a descartar quaisquer modificações de tabela que ainda estejam em buffer na memória usando `FLUSH TABLES`. Em seguida, você deve garantir que ninguém esteja usando as tabelas enquanto estiver executando **myisamchk**.

No entanto, a maneira mais fácil de evitar esse problema é usar `CHECK TABLE` em vez de **myisamchk** para verificar as tabelas. Veja a Seção 15.7.3.2, “Instrução CHECK TABLE”.

**Tabela 6.18 Opções do **myisamchk****
```json
{
  "myisamchk": {
    "options": [
      "--check-table",
      "--check-table-on-start",
      "--check-table-on-error",
      "--check-table-on-startup",
      "--check-table-on-shutdown",
      "--check-table-on-restart",
      "--check-table-on-reload",
      "--check-table-on-update",
      "--check-table-on-create",
      "--check-table-on-drop",
      "--check-table-on-drop-on-error",
      "--check-table-on-drop-on-startup",
      "--check-table-on-drop-on-shutdown",
      "--check-table-on-drop-on-restart",
      "--check-table-on-reload-on-drop",
      "--check-table-on-drop-on-error-on-reload",
      "--check-table-on-drop-on-startup-on-reload",
      "--check-table-on-drop-on-shutdown-on-reload",
      "--check-table-on-drop-on-restart-on-reload",
      "--check-table-on-drop-on-error-on-shutdown-reload",
      "--check-table-on-drop-on-startup-on-shutdown-reload",
      "--check-table-on-drop-on-shutdown-on-restart-reload",
      "--check-table-on-drop-on-error-on-shutdown-restart-reload",
      "--check-table-on-drop-on-startup-on-shutdown-restart-reload",
      "--check-table-on-drop-on-shutdown-on-restart-reload-on-drop",
      "--check-table-on-drop-on-startup-on-shutdown-restart-reload-on-drop-on-error",
      "--check-table-on-drop-on-startup-on-shutdown-restart-reload-on-drop-on-startup-on-reload",
      "--check-table-on-drop-on-shutdown-on-restart-reload-on-drop-on-startup-on-shutdown-reload",
      "--check-table-on-drop-on-error-on-restart-reload",
      "--check-table-on-startup-on-reload",
      "--check-table-on-shutdown-on-reload",
      "--check-table-on-startup-on-shutdown-reload",
      "--check-table-on-shutdown-on-restart-reload",
      "--check-table-on-startup-on-shutdown-restart-reload",
      "--check-table-on-shutdown-on-restart-reload-on-drop",
      "--check-table-on-startup-on-shutdown-restart-reload-on-drop-on-error",
      "--check-table-on-shutdown-on-restart-reload-on-drop-on-startup-on-reload",
      "--check-

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para myisamchk">
<tr><th>Nome da Opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="myisamchk-other-options.html#option_myisamchk_analyze">--analyze</a></td> <td>Analise a distribuição dos valores-chave</td></tr>
<tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_backup">--backup</a></td> <td>Faça um backup do arquivo .MYD como file_name-time.BAK</td></tr>
<tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_block-search">--block-search</a></td> <td>Encontre o registro ao qual um bloco no offset dado pertence</td></tr>
<tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres podem ser encontrados</td></tr>
<tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_check">--check</a></td> <td>Verifique a tabela em busca de erros</td></tr>
<tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_check-only-changed">--check-only-changed</a></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td></tr>
<tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_correct-checksum">--correct-checksum</a></td> <td>Corrija as informações de verificação da tabela</td></tr>
<tr><td><a class="link" href="myisamchk-repair-options.html#option_myisamchk_data-file-length">--data-file-length</a></td> <td>Comprimento máximo do arquivo de dados (quando o arquivo de dados é criado novamente quando está cheio)</td></tr>
<tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_debug">--debug</a></td> <td>Escreva o log de depuração</td></tr>
<tr><td>--decode_bits</td> <td>Decodificar bits</td></tr>
<tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado em adição aos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="myisamchk-general-options.html#option_myisamchk_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="myisamchk-other-options.html#option_myisamchk_description">--description</a></td> <td>Imprima algumas informações descritivas sobre a tabela</td></tr>
<tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_extend-check">--extend-check</a></td> <td>Realize uma verificação muito detalhada da tabela ou faça uma reparação que tente recuperar todas as linhas possíveis do arquivo de dados</td></tr>
<tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_fast">--fast</a></td> <td>Verifique apenas as tabelas que não foram fechadas corretamente</td></tr>
<tr><td><a class="link" href="myisamchk-check-options.html#option_myisamchk_force">--force</a></td> <td>Realize uma operação de reparo automaticamente se myisamchk encontrar erros na tabela</td></tr>
<tr><td>--force</td> <td>Escrever arquivos temporários antigos. Para uso com as opções -r ou -o</td></tr>
<tr><td>--ft_max_word_len</td> <td>Tamanho máximo da palavra para índices FULLTEXT</td></tr>
<tr><td>--ft