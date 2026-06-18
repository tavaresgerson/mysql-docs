### 17.8.12 Habilitar a configuração automática do InnoDB para um servidor MySQL dedicado

Quando o servidor é iniciado com `--innodb-dedicated-server`, o `InnoDB` calcula automaticamente os valores e define as seguintes variáveis de sistema:

- `innodb_buffer_pool_size`

- `innodb_redo_log_capacity` (MySQL 8.0.30 e versões posteriores)

- `innodb_log_file_size` (antes do MySQL 8.0.30)

- `innodb_log_files_in_group` (antes do MySQL 8.0.30)

- `innodb_flush_method`

Nota

`innodb_log_file_size` e `innodb_log_files_in_group` estão desatualizados a partir do MySQL 8.0.30 e são substituídos por `innodb_redo_log_capacity`. Você deve esperar que `innodb_log_file_size` e `innodb_log_files_in_group` sejam removidos em uma versão futura do MySQL.

Você deve considerar o uso de `--innodb-dedicated-server` apenas se a instância do MySQL estiver em um servidor dedicado onde ela possa usar todos os recursos do sistema disponíveis — por exemplo, se você executar o MySQL Server em um contêiner Docker ou VM dedicada que execute apenas o MySQL. O uso de `--innodb-dedicated-server` não é recomendado se a instância do MySQL compartilhar recursos do sistema com outras aplicações.

O valor para cada variável afetada é determinado e aplicado pelo `--innodb-dedicated-server` conforme descrito na lista a seguir:

- `innodb_buffer_pool_size`

  O tamanho do pool de tampão é calculado de acordo com a quantidade de memória detectada no servidor, conforme mostrado na tabela a seguir:

  **Tabela 17.8 Tamanho do Pool de Buffer Configurado automaticamente**

  <table summary="A primeira coluna mostra a quantidade de memória do servidor detectada. A segunda coluna mostra o tamanho do pool de buffers, que é determinado automaticamente."><thead><tr> <th>Memória do servidor detectada</th> <th>Tamanho do Pool de Armazenamento de Buffer</th> </tr></thead><tbody><tr> <td>Menos de 1 GB</td> <td>128 MB (o valor padrão)</td> </tr><tr> <td>1 GB a 4 GB</td> <td><em class="replaceable">[[<code>detected server memory</code>]]</em>* 0,5</td> </tr><tr> <td>Maior que 4 GB</td> <td><em class="replaceable">[[<code>detected server memory</code>]]</em>* 0,75</td> </tr></tbody></table>

- `innodb_redo_log_capacity`

  A capacidade do log de refazer é configurada de acordo com a quantidade de memória detectada no servidor e, em alguns casos, se o `innodb_buffer_pool_size` é configurado explicitamente. Se o `innodb_buffer_pool_size` não for configurado explicitamente, o valor padrão é assumido.

  Aviso

  O comportamento da configuração automática da capacidade do log de refazer é indefinido se `innodb_buffer_pool_size` for definido com um valor maior que a quantidade de memória do servidor detectada.

  **Tabela 17.9 Tamanho do arquivo de registro configurado automaticamente**

  <table summary="A primeira coluna mostra o tamanho do pool de buffers. A segunda coluna mostra a capacidade do log de reverso configurada automaticamente."><thead><tr> <th>Memória do servidor detectada</th> <th>Tamanho do Pool de Armazenamento de Buffer</th> <th>Capacidade do Log Redo</th> </tr></thead><tbody><tr> <td>Menos de 1 GB</td> <td>Não configurado</td> <td>100 MB</td> </tr><tr> <td>Menos de 1 GB</td> <td>Menos de 1 GB</td> <td>100 MB</td> </tr><tr> <td>1 GB a 2 GB</td> <td>Não aplicável</td> <td>100 MB</td> </tr><tr> <td>2GB a 4GB</td> <td>Não configurado</td> <td>1 GB</td> </tr><tr> <td>2GB a 4GB</td> <td>Qualquer valor configurado</td> <td>ao redor(0,5 *<em class="replaceable">[[<code>detected server memory</code>]]</em>em GB) * 0,5 GB</td> </tr><tr> <td>4GB a 10,66GB</td> <td>Não aplicável</td> <td>ao redor(0,75 *<em class="replaceable">[[<code>detected server memory</code>]]</em>em GB) * 0,5 GB</td> </tr><tr> <td>10,66 GB a 170,66 GB</td> <td>Não aplicável</td> <td>ao redor(0,5625 *<em class="replaceable">[[<code>detected server memory</code>]]</em>em GB)
                * 1 GB</td> </tr><tr> <td>Maior que 170,66 GB</td> <td>Não aplicável</td> <td>128GB</td> </tr></tbody></table>

- `innodb_log_file_size` (desatualizado)

  O tamanho do arquivo de registro é definido de acordo com o tamanho do pool de buffer configurado automaticamente, conforme mostrado na tabela a seguir:

  **Tabela 17.10 Tamanho do arquivo de registro configurado automaticamente**

  <table summary="A primeira coluna mostra o tamanho do pool de buffers. A segunda coluna mostra o tamanho do arquivo de log, que é determinado automaticamente."><thead><tr> <th>Tamanho do Pool de Armazenamento de Buffer</th> <th>Tamanho do arquivo de registro</th> </tr></thead><tbody><tr> <td>Menos de 8 GB</td> <td>512 MB</td> </tr><tr> <td>8GB a 128GB</td> <td>1024 MB</td> </tr><tr> <td>Maior que 128 GB</td> <td>2048 MB</td> </tr></tbody></table>

- `innodb_log_files_in_group` (desatualizado)

  O número de arquivos de registro é determinado de acordo com o tamanho do pool de buffer configurado automaticamente, conforme mostrado na tabela a seguir:

  **Tabela 17.11 Número de arquivos de registro configurado automaticamente**

  <table summary="A primeira coluna mostra o tamanho do pool de buffers. A segunda coluna mostra o número de arquivos de log, que é determinado automaticamente."><thead><tr> <th>Tamanho do Pool de Armazenamento de Buffer</th> <th>Número de arquivos de registro</th> </tr></thead><tbody><tr> <td>Menos de 8 GB</td> <td>arredondar(<em class="replaceable">[[<code>buffer pool size</code>]]</em>)</td> </tr><tr> <td>8GB a 128GB</td> <td>arredondar(<em class="replaceable">[[<code>buffer pool size</code>]]</em>* 0,75)</td> </tr><tr> <td>Maior que 128 GB</td> <td>64</td> </tr></tbody></table>

  Nota

  O valor mínimo para o valor `innodb_log_files_in_group` é `2`; esse limite inferior é aplicado se o valor arredondado do tamanho do pool de buffers for menor que esse número.

- `innodb_flush_method`

  O método de limpeza é definido como `O_DIRECT_NO_FSYNC` quando o servidor é iniciado com `--innodb-dedicated-server`. Se `O_DIRECT_NO_FSYNC` não estiver disponível, o valor padrão para `innodb_flush_method`.

  `InnoDB` usa `O_DIRECT` durante o esvaziamento de E/S, mas ignora a chamada de sistema `fsync()` após cada operação de escrita.

  Aviso

  Antes do MySQL 8.0.14, `O_DIRECT_NO_FSYNC` não era adequado para sistemas de arquivos como XFS e EXT4, que exigem uma chamada de sistema `fsync()` para sincronizar as alterações dos metadados do sistema de arquivos.

  A partir do MySQL 8.0.14, `fsync()` é chamado após a criação de um novo arquivo, após o aumento do tamanho do arquivo e após a fechamento de um arquivo, para garantir que as alterações dos metadados do sistema de arquivos sejam sincronizadas. A chamada de sistema `fsync()` ainda é ignorada após cada operação de escrita.

  A perda de dados é possível se os arquivos de log de refazer e os arquivos de dados estiverem em dispositivos de armazenamento diferentes, e uma saída inesperada ocorrer antes que os dados sejam apagados do cache de um dispositivo que não seja alimentado por bateria. Se você estiver usando ou planejando usar diferentes dispositivos de armazenamento para arquivos de log de refazer e arquivos de dados, e seus arquivos de dados estiverem em um dispositivo com um cache que não seja alimentado por bateria, use `O_DIRECT` em vez disso.

Se uma das variáveis listadas anteriormente for definida explicitamente em um arquivo de opções ou em outro lugar, esse valor explícito é usado, e um aviso de inicialização semelhante a este é impresso em `stderr`:

\[Aviso] \[000000] InnoDB: A opção innodb\_dedicated\_server é ignorada para innodb\_buffer\_pool\_size porque innodb\_buffer\_pool\_size=134217728 é especificada explicitamente.

Definir uma variável explicitamente não impede a configuração automática de outras opções.

Se o servidor for iniciado com `--innodb-dedicated-server` e `innodb_buffer_pool_size` for definido explicitamente, as configurações de variáveis baseadas no tamanho do pool de buffers usam o valor do tamanho do pool de buffers calculado de acordo com a quantidade de memória detectada no servidor, em vez do valor explicitamente definido para o tamanho do pool de buffers.

Nota

As configurações automáticas são aplicadas por `--innodb-dedicated-server` *apenas* quando o servidor MySQL é iniciado. Se você definir explicitamente qualquer uma das variáveis afetadas posteriormente, isso substitui seu valor predeterminado, e o valor que foi definido explicitamente é aplicado. Definir uma dessas variáveis para `DEFAULT` faz com que ela seja definida pelo valor padrão real, conforme mostrado na descrição da variável no Manual, e *não* faz com que ela retorne ao valor definido por `--innodb-dedicated-server`. A variável de sistema correspondente `innodb_dedicated_server` é alterada apenas ao iniciar o servidor com `--innodb-dedicated-server` (ou com `--innodb-dedicated-server=ON` ou `--innodb-dedicated-server=OFF`); de outra forma, ela é apenas de leitura.
