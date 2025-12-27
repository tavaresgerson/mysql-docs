### 6.6.4 `myisamchk` — Ferramenta de Manutenção de Tabelas MyISAM

A ferramenta `myisamchk` obtém informações sobre as tabelas do seu banco de dados ou verifica, conserta ou otimiza elas. `myisamchk` funciona com tabelas `MyISAM` (tabelas que possuem arquivos `.MYD` e `.MYI` para armazenar dados e índices).

Você também pode usar as instruções `CHECK TABLE` e `REPAIR TABLE` para verificar e consertar tabelas `MyISAM`.

O uso de `myisamchk` com tabelas particionadas não é suportado.

Cuidado

É melhor fazer um backup de uma tabela antes de realizar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. As possíveis causas incluem, mas não estão limitadas a, erros no sistema de arquivos.

Inicie `myisamchk` da seguinte forma:

```
myisamchk [options] tbl_name ...
```

As opções especificam o que você deseja que `myisamchk` faça. Elas são descritas nas seções a seguir. Você também pode obter uma lista de opções invocando `myisamchk --help`.

Sem opções, `myisamchk` simplesmente verifica sua tabela como a operação padrão. Para obter mais informações ou para dizer a `myisamchk` que tome medidas corretivas, especifique opções conforme descrito na discussão a seguir.

`tbl_name` é a tabela do banco de dados que você deseja verificar ou reparar. Se você executar `myisamchk` em outro local que não seja o diretório do banco de dados, você deve especificar o caminho para o diretório do banco de dados, porque `myisamchk` não tem a menor ideia de onde o banco de dados está localizado. Na verdade, `myisamchk` não se importa se os arquivos com os quais você está trabalhando estão localizados em um diretório de banco de dados. Você pode copiar os arquivos que correspondem a uma tabela do banco de dados para outro local e realizar operações de recuperação neles.

Você pode nomear várias tabelas na linha de comando do `myisamchk` se desejar. Você também pode especificar uma tabela nomeando seu arquivo de índice (o arquivo com o sufixo `.MYI`). Isso permite que você especifique todas as tabelas em um diretório usando o padrão `*.MYI`. Por exemplo, se você estiver em um diretório de banco de dados, você pode verificar todas as tabelas `MyISAM` nesse diretório da seguinte forma:

```
myisamchk *.MYI
```

Se você não estiver no diretório do banco de dados, pode verificar todas as tabelas lá, especificando o caminho para o diretório:

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

Se você quiser verificar todas as tabelas `MyISAM` e reparar quaisquer que estejam corrompidas, pode usar o seguinte comando:

```
myisamchk --silent --force --fast --update-state \
          --key_buffer_size=64M --myisam_sort_buffer_size=64M \
          --read_buffer_size=1M --write_buffer_size=1M \
          /path/to/datadir/*/*.MYI
```

Este comando assume que você tem mais de 64 MB de memória livre. Para obter mais informações sobre a alocação de memória com `myisamchk`, consulte a Seção 6.6.4.6, “Uso de Memória do `myisamchk`”.

Para obter informações adicionais sobre o uso do `myisamchk`, consulte a Seção 9.6, “Manutenção de Tabelas MyISAM e Recuperação de Falhas”.

Importante

*Você deve garantir que nenhum outro programa esteja usando as tabelas enquanto estiver executando `myisamchk`*. O meio mais eficaz de fazer isso é desligar o servidor MySQL enquanto estiver executando `myisamchk`, ou bloquear todas as tabelas nas quais o `myisamchk` está sendo usado.

Caso contrário, quando você executar `myisamchk`, ele pode exibir a seguinte mensagem de erro:

```
warning: clients are using or haven't closed the table properly
```

Isso significa que você está tentando verificar uma tabela que foi atualizada por outro programa (como o servidor `mysqld`) que ainda não fechou o arquivo ou que morreu sem fechar o arquivo corretamente, o que às vezes pode levar à corrupção de uma ou mais tabelas `MyISAM`.

Se o `mysqld` estiver em execução, você deve forçar-lo a limpar quaisquer modificações de tabela que ainda estejam em buffer na memória usando `FLUSH TABLES`. Você deve então garantir que ninguém esteja usando as tabelas enquanto estiver executando `myisamchk`

No entanto, a maneira mais fácil de evitar esse problema é usar `CHECK TABLE` em vez de `myisamchk` para verificar as tabelas. Veja a Seção 15.7.3.2, “Instrução CHECK TABLE”.

`myisamchk` suporta as seguintes opções, que podem ser especificadas na linha de comando ou no grupo `[myisamchk]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.17 Opções de `myisamchk`**

<table>
   <thead>
      <tr>
         <th>Nome da Opção</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>--analyze</code></td>
         <td>Analisar a distribuição dos valores-chave</td>
      </tr>
      <tr>
         <td><code>--backup</code></td>
         <td>Fazer um backup do arquivo `.MYD` como <code>file_name-time.BAK</code></td>
      </tr>
      <tr>
         <td><code>--block-search</code></td>
         <td>Encontrar o registro ao qual um bloco no deslocamento dado pertence</td>
      </tr>
      <tr>
         <td><code>--character-sets-dir</code></td>
         <td>Diretório onde os conjuntos de caracteres podem ser encontrados</td>
      </tr>
      <tr>
         <td><code>--check</code></td>
         <td>Verificar a tabela em busca de erros</td>
      </tr>
      <tr>
         <td><code>--check-only-changed</code></td>
         <td>Verificar apenas as tabelas que foram alteradas desde a última verificação</td>
      </tr>
      <tr>
         <td><code>--correct-checksum</code></td>
         <td>Corrigir as informações de verificação da tabela</td>
      </tr>
      <tr>
         <td><code>--data-file-length</code></td>
         <td>Comprimento máximo do arquivo de dados (quando recriar o arquivo de dados quando ele estiver cheio)</td>
      </tr>
      <tr>
         <td><code>--debug</code></td>
         <td>Escrever o log de depuração</td>
      </tr>
      <tr>
         <td><code>--decode_bits</code></td>
         <td><code>Decode_bits</code></td>
      </tr>
      <tr>
         <td><code>--defaults-extra-file</code></td>
         <td>Ler o arquivo de opções nomeado além dos arquivos de opções usuais</td>
      </tr>
      <tr>
         <td><code>--defaults-file</code></td>
         <td>Ler apenas o arquivo de opções nomeado</td>
      </tr>
      <tr>
         <td><code>--defaults-group-suffix</code></td>
         <td>Valor do sufixo do grupo de opções</td>
      </tr>
      <tr>
         <td><code>--description</code></td>
         <td>Imprimir algumas informações descritivas sobre a tabela que está sendo verificada</td>
      </tr>
      <tr>
         <td><code>--extend-check</code></td>
         <td>Realizar uma verificação muito rápida para a tabela ou reparo que tenta recuperar todas as possíveis linhas do arquivo de dados</td>
      </tr>
      <tr>
         <td><code>--fast</code></td>
         <td>Verificar apenas as tabelas que não foram fechadas corretamente</td>
      </tr>
      <tr>
         <td><code>--force</code></td>
         <td>Realizar uma operação de reparo automaticamente se o <code>myisamchk</code> encontrar erros na tabela</td>
      </tr>
      <tr>
         <td><code>--force</code></td>
         <td>Escrever arquivos temporários antigos. Para uso com as opções <code>-r</code> ou <code>-o</code></td>
      </tr>
      <tr>
         <td><code>--ft_max_word_len</code></td>
         <td>Comprimento máximo da palavra para índices <code>FULLTEXT</code></td>
      </tr>
      <tr>
         <td><code>--ft_min_word_len</code></td>
         <td>Comprimento mínimo da palavra para índices <code>FULLTEXT</code></td>
      </tr>
      <tr>
         <td><code>--ft_stopword_file</code></td>
         <td>Usar a lista de palavras-stop deste arquivo em vez da lista embutida</td>
      </tr>
      <tr>
         <td><code>--HELP</code></td>
         <td>Mostrar a mensagem de ajuda e sair</td>
      </tr>
      <tr>
         <td><code>--help</code></td>
         <td>Mostrar a mensagem de ajuda e sair</td>
      </tr>
      <tr>
         <td><code>--information</code></td>
         <td>Imprimir estatísticas informativas sobre a tabela que está sendo verificada</td>
      </tr>
      <tr>
         <td><code>--key_buffer_size</code></td>
         <td>Tamanho do buffer usado para as páginas de índice para tabelas MyISAM</td>
      </tr>
      <tr>
         <td><code>--keys-used</code></td>
         <td>Valor de bit que indica quais índices devem ser atualizados</td>
      </tr>
      <tr>
         <td><code>--max-record-length</code></td>
         <td>Ignorar linhas maiores que o comprimento dado se o <code>myisamchk</code> não puder alocar memória para armazená-las</td>
      </tr>
      <tr>
         <td><code>--medium-check</code></td>
         <td>Realizar uma verificação mais rápida do que uma operação <code>--extend-check</code></td>
      </tr>
      <tr>
         <td><code>--myisam_block_size</code></td>
         <td>Tamanho do bloco a ser usado para as páginas de índice para tabelas MyISAM</td>
      </tr>
      <tr>
         <td><code>--myis