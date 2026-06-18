### 14.8.1 Configuração de Inicialização do InnoDB

As primeiras decisões a serem tomadas sobre a configuração do `InnoDB` envolvem a configuração dos arquivos de dados, arquivos de log, tamanho de página (page size) e buffers de memória (memory buffers), que devem ser configurados antes de inicializar o `InnoDB`. Modificar a configuração após a inicialização do `InnoDB` pode envolver procedimentos não triviais.

Esta seção fornece informações sobre como especificar as configurações do `InnoDB` em um arquivo de configuração, visualizar as informações de inicialização do `InnoDB` e considerações importantes sobre armazenamento.

* Especificando Opções em um Arquivo de Configuração MySQL
* Visualizando Informações de Inicialização do InnoDB
* Considerações Importantes sobre Armazenamento
* Configuração do Arquivo de Dados do Tablespace do Sistema
* Configuração do Arquivo de Redo Log
* Configuração do Undo Tablespace
* Configuração do Temporary Tablespace
* Configuração do Page Size
* Configuração de Memória

#### Especificando Opções em um Arquivo de Configuração MySQL

Como o MySQL usa as configurações de arquivo de dados, arquivo de log e page size para inicializar o `InnoDB`, é recomendável que você defina essas configurações em um arquivo de opção que o MySQL leia na inicialização, antes de inicializar o `InnoDB`. Normalmente, o `InnoDB` é inicializado quando o servidor MySQL é iniciado pela primeira vez.

Você pode colocar as configurações do `InnoDB` no grupo `[mysqld]` de qualquer arquivo de opção que seu servidor leia ao iniciar. Os locais dos arquivos de opção do MySQL são descritos na Seção 4.2.2.2, “Usando Arquivos de Opção”.

Para garantir que o **mysqld** leia as opções apenas de um arquivo específico, use a opção `--defaults-file` como a primeira opção na linha de comando ao iniciar o servidor:

```sql
mysqld --defaults-file=path_to_option_file
```

#### Visualizando Informações de Inicialização do InnoDB

Para visualizar as informações de inicialização do `InnoDB` durante a startup, inicie o **mysqld** a partir de um prompt de comando, que imprime as informações de inicialização no console.

Por exemplo, no Windows, se o **mysqld** estiver localizado em `C:\Program Files\MySQL\MySQL Server 5.7\bin`, inicie o servidor MySQL assim:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld" --console
```

Em sistemas tipo Unix, o **mysqld** está localizado no diretório `bin` da sua instalação MySQL:

```sql
$> bin/mysqld --user=mysql &
```

Se você não enviar a saída do servidor para o console, verifique o error log após a inicialização para ver as informações que o `InnoDB` imprimiu durante o processo de inicialização.

Para obter informações sobre como iniciar o MySQL usando outros métodos, consulte a Seção 2.9.5, “Iniciando e Parando o MySQL Automaticamente”.

Nota

O `InnoDB` não abre todas as tabelas de usuário e arquivos de dados associados na startup. No entanto, o `InnoDB` verifica a existência dos arquivos de tablespace referenciados no data dictionary. Se um arquivo de tablespace não for encontrado, o `InnoDB` registra um error e continua a sequência de inicialização. Os arquivos de tablespace referenciados no redo log podem ser abertos durante a crash recovery para aplicação de redo.

#### Considerações Importantes sobre Armazenamento

Revise as seguintes considerações relacionadas ao armazenamento antes de prosseguir com a sua configuração de inicialização.

* Em alguns casos, você pode melhorar o desempenho do database colocando arquivos de dados e de log em discos físicos separados. Você também pode usar partições de disco brutas (raw devices) para arquivos de dados do `InnoDB`, o que pode acelerar o I/O. Consulte Usando Partições de Disco Brutas para o System Tablespace.

* O `InnoDB` é um storage engine com segurança de transação (compatível com ACID) com recursos de commit, rollback e crash-recovery para proteger os dados do usuário. **No entanto, ele não pode fazer isso** se o sistema operacional ou o hardware subjacente não funcionar conforme o esperado. Muitos sistemas operacionais ou subsistemas de disco podem atrasar ou reordenar operações de escrita para melhorar o desempenho. Em alguns sistemas operacionais, a própria chamada de sistema `fsync()` que deveria aguardar até que todos os dados não escritos de um arquivo fossem descarregados (flushed) pode, na verdade, retornar antes que os dados tenham sido descarregados para o armazenamento estável. Por causa disso, uma falha do sistema operacional ou uma queda de energia pode destruir dados recentemente committed, ou, no pior caso, até mesmo corromper o database porque as operações de escrita foram reordenadas. Se a integridade dos dados for importante para você, realize testes de “arrancar o cabo” (pull-the-plug tests) antes de usar qualquer coisa em produção. No macOS, o `InnoDB` usa um método especial de file flush `fcntl()`. No Linux, é aconselhável **desativar o write-back cache**.

  Em unidades de disco ATA/SATA, um comando como `hdparm -W0 /dev/hda` pode funcionar para desativar o write-back cache. **Esteja ciente de que algumas unidades ou controladores de disco podem não ser capazes de desativar o write-back cache.**

* Em relação aos recursos de recovery do `InnoDB` que protegem os dados do usuário, o `InnoDB` usa uma técnica de file flush envolvendo uma estrutura chamada doublewrite buffer, que está ativada por padrão (`innodb_doublewrite=ON`). O doublewrite buffer adiciona segurança à recovery após uma saída inesperada ou queda de energia, e melhora o desempenho na maioria das variedades de Unix, reduzindo a necessidade de operações `fsync()`. Recomenda-se que a opção `innodb_doublewrite` permaneça ativada se você estiver preocupado com a integridade dos dados ou possíveis falhas. Para obter informações sobre o doublewrite buffer, consulte a Seção 14.12.1, “InnoDB Disk I/O”.

* Antes de usar NFS com `InnoDB`, revise os problemas potenciais descritos em Usando NFS com MySQL.

* Executar o servidor MySQL em um disco rígido de setor 4K no Windows não é suportado com `innodb_flush_method=async_unbuffered`, que é a configuração padrão. A solução alternativa (workaround) é usar `innodb_flush_method=normal`.

#### Configuração do Arquivo de Dados do Tablespace do Sistema

A opção `innodb_data_file_path` define o nome, tamanho e atributos dos arquivos de dados do system tablespace do `InnoDB`. Se você não configurar esta opção antes de inicializar o servidor MySQL, o comportamento padrão é criar um único arquivo de dados com autoextensão (auto-extending), ligeiramente maior que 12MB, chamado `ibdata1`:

```sql
mysql> SHOW VARIABLES LIKE 'innodb_data_file_path';
+-----------------------+------------------------+
| Variable_name         | Value                  |
+-----------------------+------------------------+
| innodb_data_file_path | ibdata1:12M:autoextend |
+-----------------------+------------------------+
```

A sintaxe completa da especificação do arquivo de dados inclui o nome do arquivo, tamanho do arquivo, atributo `autoextend` e atributo `max`:

```sql
file_name:file_size[:autoextend[:max:max_file_size
```

Os tamanhos dos arquivos são especificados em kilobytes, megabytes ou gigabytes anexando `K`, `M` ou `G` ao valor do tamanho. Se estiver especificando o tamanho do arquivo de dados em kilobytes, faça-o em múltiplos de 1024. Caso contrário, os valores em kilobyte são arredondados para o limite de megabyte (MB) mais próximo. A soma dos tamanhos dos arquivos deve ser, no mínimo, ligeiramente maior que 12MB.

Você pode especificar mais de um arquivo de dados usando uma lista separada por ponto e vírgula. Por exemplo:

```sql
[mysqld]
innodb_data_file_path=ibdata1:50M;ibdata2:50M:autoextend
```

Os atributos `autoextend` e `max` podem ser usados apenas para o arquivo de dados que é especificado por último.

Quando o atributo `autoextend` é especificado, o tamanho do arquivo de dados aumenta automaticamente em incrementos de 64MB conforme o espaço é necessário. A variável `innodb_autoextend_increment` controla o tamanho do incremento.

Para especificar um tamanho máximo para um arquivo de dados de autoextensão, use o atributo `max` após o atributo `autoextend`. Use o atributo `max` apenas nos casos em que restringir o uso do disco é de importância crítica. A seguinte configuração permite que `ibdata1` cresça até um limite de 500MB:

```sql
[mysqld]
innodb_data_file_path=ibdata1:12M:autoextend:max:500M
```

Um tamanho mínimo de arquivo é imposto para o *primeiro* arquivo de dados do system tablespace para garantir que haja espaço suficiente para as doublewrite buffer pages. A tabela a seguir mostra os tamanhos mínimos de arquivo para cada page size do `InnoDB`. O page size padrão do `InnoDB` é 16384 (16KB).

<table summary="O tamanho mínimo do arquivo de dados do tablespace do sistema para cada tamanho de página do InnoDB."><thead><tr> <th>Tamanho da Página (innodb_page_size)</th> <th>Tamanho Mínimo do Arquivo</th> </tr></thead><tbody><tr> <td>16384 (16KB) ou menos</td> <td>3MB</td> </tr><tr> <td>32768 (32KB)</td> <td>6MB</td> </tr><tr> <td>65536 (64KB)</td> <td>12MB</td> </tr> </tbody></table>

Se o seu disco ficar cheio, você pode adicionar um arquivo de dados em outro disco. Para obter instruções, consulte Redimensionando o System Tablespace.

O limite de tamanho para arquivos individuais é determinado pelo seu sistema operacional. Você pode definir o tamanho do arquivo para mais de 4GB em sistemas operacionais que suportam arquivos grandes. Você também pode usar partições de disco brutas como arquivos de dados. Consulte Usando Partições de Disco Brutas para o System Tablespace.

O `InnoDB` não tem conhecimento do tamanho máximo do arquivo do file system, portanto, seja cauteloso em file systems onde o tamanho máximo do arquivo é um valor pequeno, como 2GB.

Os arquivos do system tablespace são criados no data directory por padrão (`datadir`). Para especificar um local alternativo, use a opção `innodb_data_home_dir`. Por exemplo, para criar um arquivo de dados do system tablespace em um diretório chamado `myibdata`, use esta configuração:

```sql
[mysqld]
innodb_data_home_dir = /myibdata/
innodb_data_file_path=ibdata1:50M:autoextend
```

Uma barra invertida (trailing slash) é necessária ao especificar um valor para `innodb_data_home_dir`. O `InnoDB` não cria diretórios, portanto, certifique-se de que o diretório especificado exista antes de iniciar o servidor. Além disso, certifique-se de que o servidor MySQL tenha os direitos de acesso adequados para criar arquivos no diretório.

O `InnoDB` forma o caminho do diretório para cada arquivo de dados concatenando textualmente o valor de `innodb_data_home_dir` ao nome do arquivo de dados. Se `innodb_data_home_dir` não for definido, o valor padrão é “./”, que é o data directory. (O servidor MySQL muda seu diretório de trabalho atual para o data directory quando começa a ser executado.)

Se você especificar `innodb_data_home_dir` como uma string vazia, você pode especificar caminhos absolutos para os arquivos de dados listados no valor de `innodb_data_file_path`. A seguinte configuração é equivalente à anterior:

```sql
[mysqld]
innodb_data_home_dir =
innodb_data_file_path=/myibdata/ibdata1:50M:autoextend
```

#### Configuração do Arquivo de Redo Log

O `InnoDB` cria dois arquivos de redo log de 5MB chamados `ib_logfile0` e `ib_logfile1` no data directory por padrão.

As seguintes opções podem ser usadas para modificar a configuração padrão:

* `innodb_log_group_home_dir` define o caminho do diretório para os arquivos de log do `InnoDB`. Se esta opção não for configurada, os arquivos de log do `InnoDB` são criados no data directory do MySQL (`datadir`).

  Você pode usar esta opção para colocar os arquivos de log do `InnoDB` em um local de armazenamento físico diferente dos arquivos de dados do `InnoDB` para evitar potenciais conflitos de recurso de I/O. Por exemplo:

  ```sql
  [mysqld]
  innodb_log_group_home_dir = /dr3/iblogs
  ```

  Nota

  O `InnoDB` não cria diretórios, portanto, certifique-se de que o diretório de log exista antes de iniciar o servidor. Use o comando `mkdir` do Unix ou DOS para criar quaisquer diretórios necessários.

  Certifique-se de que o servidor MySQL tenha os direitos de acesso adequados para criar arquivos no diretório de log. Mais genericamente, o servidor deve ter direitos de acesso em qualquer diretório onde precise criar arquivos de log.

* `innodb_log_files_in_group` define o número de arquivos de log no log group. O valor padrão e recomendado é 2.

* `innodb_log_file_size` define o tamanho em bytes de cada arquivo de log no log group. O tamanho combinado do arquivo de log (`innodb_log_file_size` \* `innodb_log_files_in_group`) não pode exceder o valor máximo, que é ligeiramente inferior a 512GB. Um par de arquivos de log de 255 GB, por exemplo, se aproxima do limite, mas não o excede. O tamanho padrão do arquivo de log é 48MB. Geralmente, o tamanho combinado dos arquivos de log deve ser grande o suficiente para que o servidor possa suavizar picos e vales na atividade da workload, o que frequentemente significa que há espaço suficiente no redo log para lidar com mais de uma hora de atividade de escrita. Um tamanho de arquivo de log maior significa menos atividade de checkpoint flush no buffer pool, o que reduz o disk I/O. Para informações adicionais, consulte a Seção 8.5.4, “Otimizando o Redo Logging do InnoDB”.

#### Configuração do Undo Tablespace

Os undo logs fazem parte do system tablespace por padrão. No entanto, você pode optar por armazenar os undo logs em um ou mais undo tablespaces separados, tipicamente em um dispositivo de armazenamento diferente.

A opção de configuração `innodb_undo_directory` define o caminho onde o `InnoDB` cria tablespaces separados para os undo logs. Esta opção é tipicamente usada em conjunto com as opções `innodb_rollback_segments` e `innodb_undo_tablespaces`, que determinam o layout em disco dos undo logs fora do system tablespace.

Nota

`innodb_undo_tablespaces` está obsoleto (deprecated); espere que seja removido em uma versão futura.

Para obter mais informações, consulte a Seção 14.6.3.4, “Undo Tablespaces”.

#### Configuração do Temporary Tablespace

Um único arquivo de dados de temporary tablespace com autoextensão chamado `ibtmp1` é criado no diretório `innodb_data_home_dir` por padrão. O tamanho inicial do arquivo é ligeiramente maior que 12MB. A configuração padrão do arquivo de dados do temporary tablespace pode ser modificada na inicialização usando a opção de configuração `innodb_temp_data_file_path`.

A opção `innodb_temp_data_file_path` especifica o caminho, nome do arquivo e tamanho do arquivo para arquivos de dados de temporary tablespace. O caminho completo do diretório é formado concatenando `innodb_data_home_dir` ao caminho especificado por `innodb_temp_data_file_path`. O tamanho do arquivo é especificado em KB, MB ou GB (1024MB) anexando K, M ou G ao valor do tamanho. O tamanho do arquivo ou o tamanho combinado do arquivo deve ser ligeiramente maior que 12MB.

O valor padrão de `innodb_data_home_dir` é o data directory do MySQL (`datadir`).

Um arquivo de dados de temporary tablespace com autoextensão pode se tornar grande em ambientes que usam temporary tables grandes ou que usam temporary tables extensivamente. Um arquivo de dados grande também pode resultar de Querys de longa duração que usam temporary tables. Para evitar que o arquivo de dados temporário se torne muito grande, configure a opção `innodb_temp_data_file_path` para especificar um tamanho máximo de arquivo de dados. Para obter mais informações, consulte Gerenciando o Tamanho do Arquivo de Dados do Temporary Tablespace.

#### Configuração do Page Size

A opção `innodb_page_size` especifica o page size para todos os tablespaces do `InnoDB` em uma instância MySQL. Este valor é definido quando a instância é criada e permanece constante depois disso. Os valores válidos são 64KB, 32KB, 16KB (o padrão), 8KB e 4KB. Alternativamente, você pode especificar o page size em bytes (65536, 32768, 16384, 8192, 4096).

O page size padrão de 16KB é apropriado para uma ampla gama de workloads, particularmente para Querys envolvendo table scans e operações DML envolvendo atualizações em massa (bulk updates). Page sizes menores podem ser mais eficientes para workloads OLTP envolvendo muitas escritas pequenas, onde a contenção pode ser um problema quando uma única página contém muitas linhas. Páginas menores também podem ser mais eficientes para dispositivos de armazenamento SSD, que tipicamente usam tamanhos de bloco pequenos. Manter o page size do `InnoDB` próximo ao tamanho do bloco do dispositivo de armazenamento minimiza a quantidade de dados inalterados que são reescritos no disco.

Importante

`innodb_page_size` só pode ser definido ao inicializar o data directory. Consulte a descrição desta variável para obter mais informações.

#### Configuração de Memória

O MySQL aloca memória para vários caches e buffers para melhorar o desempenho das operações de database. Ao alocar memória para o `InnoDB`, sempre considere a memória exigida pelo sistema operacional, a memória alocada para outras aplicações e a memória alocada para outros buffers e caches do MySQL. Por exemplo, se você usa tabelas `MyISAM`, considere a quantidade de memória alocada para o key buffer (`key_buffer_size`). Para uma visão geral dos buffers e caches do MySQL, consulte a Seção 8.12.4.1, “Como o MySQL Usa a Memória”.

Os buffers específicos do `InnoDB` são configurados usando os seguintes parâmetros:

* `innodb_buffer_pool_size` define o tamanho do buffer pool, que é a área de memória que armazena dados em cache para tabelas `InnoDB`, Indexes e outros buffers auxiliares. O tamanho do buffer pool é importante para o desempenho do sistema e geralmente é recomendado que `innodb_buffer_pool_size` seja configurado para 50 a 75 por cento da memória do sistema. O tamanho padrão do buffer pool é 128MB. Para orientação adicional, consulte a Seção 8.12.4.1, “Como o MySQL Usa a Memória”. Para obter informações sobre como configurar o tamanho do buffer pool do `InnoDB`, consulte a Seção 14.8.3.1, “Configurando o Tamanho do Buffer Pool do InnoDB”. O tamanho do buffer pool pode ser configurado na inicialização ou dinamicamente.

  Em sistemas com uma grande quantidade de memória, você pode melhorar a concorrência dividindo o buffer pool em múltiplas buffer pool instances. O número de buffer pool instances é controlado pela opção `innodb_buffer_pool_instances`. Por padrão, o `InnoDB` cria uma buffer pool instance. O número de buffer pool instances pode ser configurado na inicialização. Para obter mais informações, consulte a Seção 14.8.3.2, “Configurando Múltiplas Buffer Pool Instances”.

* `innodb_log_buffer_size` define o tamanho do buffer que o `InnoDB` usa para escrever nos arquivos de log no disco. O tamanho padrão é 16MB. Um log buffer grande permite que transações grandes sejam executadas sem escrever o log no disco antes que as transações façam o commit. Se você tiver transações que atualizam, inserem ou excluem muitas linhas, você pode considerar aumentar o tamanho do log buffer para economizar disk I/O. `innodb_log_buffer_size` pode ser configurado na inicialização. Para informações relacionadas, consulte a Seção 8.5.4, “Otimizando o Redo Logging do InnoDB”.

Aviso

Em GNU/Linux x86 de 32 bits, se o uso de memória for definido muito alto, o `glibc` pode permitir que o heap do processo cresça sobre as thread stacks, causando uma falha no servidor. É um risco se a memória alocada ao processo **mysqld** para buffers globais e por thread e caches estiver próxima ou exceder 2GB.

Uma fórmula semelhante à seguinte que calcula a alocação de memória global e por thread para o MySQL pode ser usada para estimar o uso de memória do MySQL. Você pode precisar modificar a fórmula para contabilizar buffers e caches na sua versão e configuração do MySQL. Para uma visão geral dos buffers e caches do MySQL, consulte a Seção 8.12.4.1, “Como o MySQL Usa a Memória”.

```sql
innodb_buffer_pool_size
+ key_buffer_size
+ max_connections*(sort_buffer_size+read_buffer_size+binlog_cache_size)
+ max_connections*2MB
```

Cada thread usa um stack (frequentemente 2MB, mas apenas 256KB em binários MySQL fornecidos pela Oracle Corporation) e, no pior caso, também usa memória adicional `sort_buffer_size + read_buffer_size`.

No Linux, se o kernel estiver ativado para suporte a large page, o `InnoDB` pode usar large pages para alocar memória para seu buffer pool. Consulte a Seção 8.12.4.3, “Habilitando o Suporte a Large Page”.