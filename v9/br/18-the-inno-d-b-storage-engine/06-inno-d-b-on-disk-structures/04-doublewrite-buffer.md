### 17.6.4 Buffer de Dupla Escrita

O buffer de dupla escrita é uma área de armazenamento onde o `InnoDB` escreve páginas descarregadas do pool de buffers antes de escrever as páginas para suas posições apropriadas nos arquivos de dados do `InnoDB`. Se houver um sistema operacional, subsistema de armazenamento ou a saída inesperada do processo `mysqld` durante a escrita de uma página, o `InnoDB` pode encontrar uma boa cópia da página do buffer de dupla escrita durante a recuperação em caso de falha.

Embora os dados sejam escritos duas vezes, o buffer de dupla escrita não requer o dobro do overhead de I/O ou o dobro das operações de I/O. Os dados são escritos no buffer de dupla escrita em um grande bloco sequencial, com uma única chamada `fsync()` ao sistema operacional (exceto no caso em que `innodb_flush_method` esteja configurado para `O_DIRECT_NO_FSYNC`).

A área de armazenamento do buffer de dupla escrita está localizada em arquivos de dupla escrita.

As seguintes variáveis são fornecidas para a configuração do buffer de dupla escrita:

* `innodb_doublewrite`

  A variável `innodb_doublewrite` controla se o buffer de dupla escrita está habilitado. É habilitado por padrão na maioria dos casos. Para desabilitar o buffer de dupla escrita, defina `innodb_doublewrite` para `OFF`. Considere desabilitar o buffer de dupla escrita se você estiver mais preocupado com o desempenho do que com a integridade dos dados, como pode ser o caso ao realizar benchmarks, por exemplo.

  O `innodb_doublewrite` suporta as configurações `DETECT_AND_RECOVER` e `DETECT_ONLY`.

  A configuração `DETECT_AND_RECOVER` é a mesma que a configuração `ON`. Com essa configuração, o buffer de dupla escrita está totalmente habilitado, com o conteúdo das páginas do banco de dados escrito no buffer de dupla escrita onde é acessado durante a recuperação para corrigir escritas de páginas incompletas.

Com a configuração `DETECT_ONLY`, apenas os metadados são escritos no buffer de dupla gravação. O conteúdo das páginas do banco de dados não é escrito no buffer de dupla gravação, e a recuperação não usa o buffer de dupla gravação para corrigir escritas de páginas incompletas. Esta configuração leve é destinada apenas para detectar escritas de páginas incompletas.

O MySQL suporta alterações dinâmicas na configuração `innodb_doublewrite` que habilita o buffer de dupla gravação, entre `ON`, `DETECT_AND_RECOVER` e `DETECT_ONLY`. O MySQL não suporta alterações dinâmicas entre uma configuração que habilita o buffer de dupla gravação e `OFF` ou vice-versa.

Se o buffer de dupla gravação estiver localizado em um dispositivo Fusion-io que suporte escritas atômicas, o buffer de dupla gravação é automaticamente desativado e as escritas de arquivos de dados são realizadas usando escritas atômicas do Fusion-io. No entanto, esteja ciente de que a configuração `innodb_doublewrite` é global. Quando o buffer de dupla gravação é desativado, ele é desativado para todos os arquivos de dados, incluindo aqueles que não residem no hardware Fusion-io. Esta funcionalidade é suportada apenas no hardware Fusion-io e é habilitada apenas para Fusion-io NVMFS no Linux. Para aproveitar ao máximo esta funcionalidade, é recomendado o uso da configuração `innodb_flush_method` de `O_DIRECT`.

* `innodb_doublewrite_dir`

  A variável `innodb_doublewrite_dir` define o diretório onde o `InnoDB` cria arquivos de dupla gravação. Se nenhum diretório for especificado, os arquivos de dupla gravação são criados no diretório `innodb_data_home_dir`, que é definido como o diretório de dados, se não for especificado.

  Um símbolo de hash '#' é automaticamente prefixado ao nome do diretório especificado para evitar conflitos com nomes de esquema. No entanto, se um prefixo '.`, '#'. ou '/' for especificado explicitamente no nome do diretório, o símbolo de hash '#' não é prefixado ao nome do diretório.

Idealmente, o diretório doublewrite deve ser colocado no meio de armazenamento mais rápido disponível.

* `innodb_doublewrite_files`

  A variável `innodb_doublewrite_files` define o número de arquivos doublewrite, que tem um valor padrão de 2. Por padrão, dois arquivos doublewrite são criados para cada instância do pool de buffers: um arquivo doublewrite de lista de varredura e um arquivo doublewrite de lista LRU.

  O arquivo doublewrite de lista de varredura é para páginas varridas da lista de varredura do pool de buffers. O tamanho padrão de um arquivo doublewrite de lista de varredura é o tamanho da página `InnoDB` \* bytes de página doublewrite.

  O arquivo doublewrite de lista LRU é para páginas varridas da lista LRU do pool de buffers. Ele também contém slots para varreduras de páginas individuais. O tamanho padrão de um arquivo doublewrite de lista LRU é o tamanho da página `InnoDB` \* (páginas doublewrite + (512 / o número de instâncias do pool de buffers)) onde 512 é o número total de slots reservados para varreduras de páginas individuais.

  No mínimo, existem dois arquivos doublewrite. O número máximo de arquivos doublewrite é duas vezes o número de instâncias do pool de buffers. (O número de instâncias do pool de buffers é controlado pela variável `innodb_buffer_pool_instances`.)

  Os nomes dos arquivos doublewrite têm o seguinte formato: `#ib_page_size_file_number.dblwr` (ou `.bdblwr` com a configuração `DETECT_ONLY`). Por exemplo, os seguintes arquivos doublewrite são criados para uma instância do MySQL com um tamanho de páginas `InnoDB` de 16KB e um único pool de buffers:

  ```
  #ib_16384_0.dblwr
  #ib_16384_1.dblwr
  ```

  A variável `innodb_doublewrite_files` é destinada para o ajuste avançado do desempenho. O ajuste padrão deve ser adequado para a maioria dos usuários.

* `innodb_doublewrite_pages`

A variável `innodb_doublewrite_pages` controla o número máximo de páginas de escrita dupla por thread. Essa variável é destinada ao ajuste avançado do desempenho. O valor padrão deve ser adequado para a maioria dos usuários.

O `InnoDB` criptografa automaticamente as páginas de arquivo de escrita dupla que pertencem a espaços de tabela criptografados (consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”). Da mesma forma, as páginas de arquivo de escrita dupla que pertencem a espaços de tabela compactados por páginas são compactadas. Como resultado, os arquivos de escrita dupla podem conter diferentes tipos de páginas, incluindo páginas não criptografadas e não compactadas, páginas criptografadas, páginas compactadas e páginas que são tanto criptografadas quanto compactadas.