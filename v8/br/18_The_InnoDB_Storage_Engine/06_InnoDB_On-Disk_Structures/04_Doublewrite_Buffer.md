### 17.6.4 Buffer de escrita dupla

O buffer de escrita dupla é uma área de armazenamento onde o `InnoDB` escreve páginas descarregadas do pool de buffers antes de escrever as páginas em suas posições corretas nos arquivos de dados do `InnoDB`. Se houver um sistema operacional, subsistema de armazenamento ou saída inesperada do processo **mysqld** durante a escrita de uma página, o `InnoDB` pode encontrar uma boa cópia da página do buffer de escrita dupla durante a recuperação em caso de falha.

Embora os dados sejam escritos duas vezes, o buffer de escrita dupla não requer o dobro do overhead de E/S ou o dobro das operações de E/S. Os dados são escritos no buffer de escrita dupla em um grande bloco sequencial, com uma única chamada `fsync()` ao sistema operacional (exceto no caso em que `innodb_flush_method` é definido como `O_DIRECT_NO_FSYNC`).

Antes do MySQL 8.0.20, a área de armazenamento do buffer de escrita dupla estava localizada no espaço de tabela de sistema `InnoDB`. A partir do MySQL 8.0.20, a área de armazenamento do buffer de escrita dupla está localizada em arquivos de escrita dupla.

As seguintes variáveis são fornecidas para a configuração do buffer de escrita dupla:

- `innodb_doublewrite`

  A variável `innodb_doublewrite` controla se o buffer de dupla gravação está habilitado. Ela está habilitada por padrão na maioria dos casos. Para desabilitar o buffer de dupla gravação, defina `innodb_doublewrite` para `OFF`. Considere desabilitar o buffer de dupla gravação se você estiver mais preocupado com o desempenho do que com a integridade dos dados, como pode ser o caso ao realizar benchmarks, por exemplo.

  A partir do MySQL 8.0.30, o `innodb_doublewrite` suporta as configurações `DETECT_AND_RECOVER` e `DETECT_ONLY`.

  A configuração `DETECT_AND_RECOVER` é a mesma da configuração `ON`. Com essa configuração, o buffer de dupla gravação é totalmente habilitado, com o conteúdo da página do banco de dados sendo escrito no buffer de dupla gravação onde é acessado durante a recuperação para corrigir escritas de páginas incompletas.

  Com a configuração `DETECT_ONLY`, apenas os metadados são escritos no buffer de dupla gravação. O conteúdo da página do banco de dados não é escrito no buffer de dupla gravação, e a recuperação não usa o buffer de dupla gravação para corrigir escritas de páginas incompletas. Esta configuração leve é destinada apenas para detectar escritas de páginas incompletas.

  A partir do MySQL 8.0.30, o suporte a alterações dinâmicas no ajuste `innodb_doublewrite` que habilita o buffer de escrita dupla está disponível entre `ON`, `DETECT_AND_RECOVER` e `DETECT_ONLY`. O MySQL não suporta alterações dinâmicas entre um ajuste que habilita o buffer de escrita dupla e `OFF` ou vice-versa.

  Se o buffer de escrita dupla estiver localizado em um dispositivo Fusion-io que suporte escritas atômicas, o buffer de escrita dupla será desativado automaticamente e as escritas de arquivos de dados serão realizadas usando escritas atômicas do Fusion-io. No entanto, esteja ciente de que o ajuste `innodb_doublewrite` é global. Quando o buffer de escrita dupla é desativado, ele é desativado para todos os arquivos de dados, incluindo aqueles que não residem no hardware Fusion-io. Este recurso é suportado apenas no hardware Fusion-io e só está habilitado para o Fusion-io NVMFS no Linux. Para aproveitar ao máximo este recurso, é recomendado um ajuste `innodb_flush_method` de `O_DIRECT`.

- `innodb_doublewrite_dir`

  A variável `innodb_doublewrite_dir` (introduzida no MySQL 8.0.20) define o diretório onde o `InnoDB` cria arquivos de escrita dupla. Se nenhum diretório for especificado, os arquivos de escrita dupla serão criados no diretório `innodb_data_home_dir`, que é o diretório padrão de dados, se não for especificado.

  Um símbolo de hash '#' é automaticamente preenchido com o nome especificado do diretório para evitar conflitos com os nomes do esquema. No entanto, se um prefixo '.', '#'. ou '/' for especificado explicitamente no nome do diretório, o símbolo de hash '#' não é preenchido com o nome do diretório.

  Idealmente, o diretório de doublewrite deve ser colocado no meio de armazenamento mais rápido disponível.

- `innodb_doublewrite_files`

  A variável `innodb_doublewrite_files` define o número de arquivos de dupla gravação. Por padrão, são criados dois arquivos de dupla gravação para cada instância de pool de buffers: um arquivo de lista de esvaziamento de dupla gravação e um arquivo de lista LRU de dupla gravação.

  O arquivo de lista de apagamento duplo é para páginas apagadas da lista de apagamento do pool de buffer. O tamanho padrão de um arquivo de lista de apagamento duplo é o tamanho da página `InnoDB` \* bytes de página de apagamento duplo.

  O arquivo de lista de escrita dupla da LRU é para páginas descartadas da lista de buffer pool LRU. Ele também contém slots para descargas de páginas individuais. O tamanho padrão de um arquivo de lista de escrita dupla da LRU é o tamanho da página `InnoDB` \* (páginas de escrita dupla + (512 / o número de instâncias do pool de buffer)) onde 512 é o número total de slots reservados para descargas de páginas individuais.

  No mínimo, existem dois arquivos de dupla gravação. O número máximo de arquivos de dupla gravação é duas vezes o número de instâncias do pool de buffers. (O número de instâncias do pool de buffers é controlado pela variável `innodb_buffer_pool_instances`.)

  Os nomes de arquivos de dupla gravação têm o seguinte formato: `#ib_page_size_file_number.dblwr` (ou `.bdblwr` com a configuração `DETECT_ONLY`). Por exemplo, os seguintes arquivos de dupla gravação são criados para uma instância do MySQL com um tamanho de páginas `InnoDB` de 16 KB e um único pool de buffers:

  ```
  #ib_16384_0.dblwr
  #ib_16384_1.dblwr
  ```

  A variável `innodb_doublewrite_files` é destinada para o ajuste avançado do desempenho. O ajuste padrão deve ser adequado para a maioria dos usuários.

- `innodb_doublewrite_pages`

  A variável `innodb_doublewrite_pages` (introduzida no MySQL 8.0.20) controla o número máximo de páginas de escrita dupla por thread. Se nenhum valor for especificado, o valor de `innodb_doublewrite_pages` é definido pelo valor de `innodb_write_io_threads`. Esta variável é destinada a ajustes avançados de desempenho. O valor padrão deve ser adequado para a maioria dos usuários.

A partir do MySQL 8.0.23, `InnoDB` criptografa automaticamente as páginas de arquivos de dupla escrita que pertencem a espaços de tabelas criptografados (veja a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”). Da mesma forma, as páginas de arquivos de dupla escrita que pertencem a espaços de tabelas compactados por páginas são compactadas. Como resultado, os arquivos de dupla escrita podem conter diferentes tipos de páginas, incluindo páginas não criptografadas e não compactadas, páginas criptografadas, páginas compactadas e páginas que são tanto criptografadas quanto compactadas.
