## 17.8 Configuração do InnoDB

Esta seção fornece informações de configuração e procedimentos para a inicialização, inicialização e vários componentes e recursos do motor de armazenamento `InnoDB`. Para informações sobre otimização das operações de banco de dados para tabelas `InnoDB`, consulte a Seção 10.5, “Otimizando para Tabelas InnoDB”.

### 17.8.1 Configuração de Inicialização do InnoDB

As primeiras decisões a serem tomadas sobre a configuração do `InnoDB` envolvem a configuração de arquivos de dados, arquivos de registro, tamanho de página e buffers de memória, que devem ser configurados antes de inicializar o `InnoDB`. A modificação da configuração após a inicialização do `InnoDB` pode envolver procedimentos não triviais.

Esta seção fornece informações sobre a especificação dos ajustes do `InnoDB` em um arquivo de configuração, visualização das informações de inicialização do `InnoDB` e considerações importantes sobre armazenamento.

* Especificar opções em um arquivo de opção MySQL
* Visualizar informações de inicialização do InnoDB
* Considerações importantes sobre armazenamento
* Configuração do arquivo de dados do espaço de sistema
* Configuração do arquivo de buffer de dupla escrita do InnoDB
* Configuração do log de refazer
* Configuração da tabela de espaço de desfazer
* Configuração do espaço de tabela temporário global
* Configuração do espaço de tabela temporário de sessão
* Configuração do tamanho da página
* Configuração de memória

#### Especificando opções em um arquivo de opção MySQL

Como o MySQL utiliza configurações de arquivo de dados, arquivo de registro e tamanho de página para inicializar o `InnoDB`, é recomendável que você defina essas configurações em um arquivo de opção que o MySQL lê no início, antes de inicializar o `InnoDB`. Normalmente, o `InnoDB` é inicializado quando o servidor MySQL é iniciado pela primeira vez.

Você pode colocar as opções `InnoDB` no grupo `[mysqld]` de qualquer arquivo de opção que seu servidor leia quando ele começa. As localizações dos arquivos de opção do MySQL são descritas na Seção 6.2.2.2, “Usando arquivos de opção”.

Para garantir que o **mysqld** leia as opções apenas de um arquivo específico (e `mysqld-auto.cnf`), use a opção `--defaults-file` como a primeira opção na linha de comando ao iniciar o servidor:

```
mysqld --defaults-file=path_to_option_file
```

#### Visualizando as Informações de Inicialização do InnoDB

Para visualizar as informações de inicialização de `InnoDB` durante a inicialização, inicie o **mysqld** a partir de um prompt de comando, que imprime as informações de inicialização no console.

Por exemplo, no Windows, se o **mysqld** estiver localizado em `C:\Program Files\MySQL\MySQL Server 8.0\bin`, inicie o servidor MySQL da seguinte forma:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld" --console
```

Nos sistemas semelhantes ao Unix, o **mysqld** está localizado no diretório `bin` da sua instalação do MySQL:

```
$> bin/mysqld --user=mysql &
```

Se você não enviar a saída do servidor para o console, verifique o log de erro após a inicialização para ver as informações de inicialização `InnoDB` impressas durante o processo de inicialização.

Para obter informações sobre como iniciar o MySQL usando outros métodos, consulte a Seção 2.9.5, “Iniciar e Parar o MySQL automaticamente”.

Nota

`InnoDB` não abre todas as tabelas do usuário e os arquivos de dados associados no início. No entanto, `InnoDB` verifica a existência de arquivos de tablespace referenciados no dicionário de dados. Se um arquivo de tablespace não for encontrado, `InnoDB` registra um erro e continua a sequência de inicialização. Arquivos de tablespace referenciados no log de refazer podem ser abertos durante a recuperação de falhas para a aplicação de refazer.

#### Considerações importantes sobre armazenamento

Revise as seguintes considerações relacionadas ao armazenamento antes de prosseguir com a configuração de inicialização.

* Em alguns casos, você pode melhorar o desempenho do banco de dados ao colocar os arquivos de dados e de registro em discos físicos separados. Você também pode usar partições de disco bruto (dispositivos brutos) para os arquivos de dados do `InnoDB`, o que pode acelerar a I/O. Consulte o uso de partições de disco bruto para o espaço de tabelas do sistema.

* `InnoDB` é um motor de armazenamento seguro em transações (compatível com ACID) com capacidades de commit, rollback e recuperação em caso de falha para proteger os dados do usuário. **No entanto, não pode fazer isso** se o sistema operacional subjacente ou o hardware não funcionar conforme anunciado. Muitos sistemas operacionais ou subsistemas de disco podem adiar ou reorganizar operações de escrita para melhorar o desempenho. Em alguns sistemas operacionais, o próprio `fsync()` sistema de chamada que deve esperar até que todos os dados não escritos de um arquivo tenham sido descarregados pode, na verdade, retornar antes de os dados terem sido descarregados para armazenamento estável. Por isso, um desligamento do sistema operacional ou uma falta de energia pode destruir dados recentemente comprometidos ou, no pior dos casos, até corromper o banco de dados, pois as operações de escrita foram reorganizadas. Se a integridade dos dados é importante para você, realize testes de "arranque de tomada" antes de usar qualquer coisa em produção. Em macOS, `InnoDB` usa um método especial de esvaziamento de arquivo `fcntl()`. Sob Linux, é aconselhável **desativar o cache de escrita de volta**.

Em unidades de disco ATA/SATA, um comando como `hdparm -W0 /dev/hda` pode funcionar para desabilitar a cache de escrita de volta. **Cuidado, pois algumas unidades ou controladores de disco podem não ser capazes de desabilitar a cache de escrita de volta.**

* Em relação às capacidades de recuperação `InnoDB` que protegem os dados do usuário, o `InnoDB` utiliza uma técnica de esvaziamento de arquivo que envolve uma estrutura chamada buffer de doublewrite (glossary.html#glos_doublewrite_buffer "doublewrite buffer"), que é ativada por padrão (`innodb_doublewrite=ON`). O buffer de doublewrite adiciona segurança à recuperação após uma saída inesperada ou falta de energia, e melhora o desempenho na maioria das variedades de Unix, reduzindo a necessidade de operações de `fsync()`. É recomendável que a opção `innodb_doublewrite` permaneça ativada se você estiver preocupado com a integridade dos dados ou possíveis falhas. Para informações sobre o buffer de doublewrite, consulte a Seção 17.11.1, “I/O de disco InnoDB”.

* Antes de usar o NFS com `InnoDB`, revise os problemas potenciais descritos em Usar NFS com MySQL.

#### Configuração do arquivo de dados do espaço de tabela do sistema

A opção `innodb_data_file_path` define o nome, o tamanho e os atributos dos arquivos de dados dos sistemas de tabelas `InnoDB`. Se você não configurar esta opção antes de inicializar o servidor MySQL, o comportamento padrão é criar um único arquivo de dados auto-extensibile, ligeiramente maior que 12 MB, com o nome `ibdata1`:

```
mysql> SHOW VARIABLES LIKE 'innodb_data_file_path';
+-----------------------+------------------------+
| Variable_name         | Value                  |
+-----------------------+------------------------+
| innodb_data_file_path | ibdata1:12M:autoextend |
+-----------------------+------------------------+
```

A sintaxe completa do arquivo de dados inclui o nome do arquivo, o tamanho do arquivo, o atributo `autoextend` e o atributo `max`:

```
file_name:file_size[:autoextend[:max:max_file_size]]
```

Os tamanhos dos arquivos são especificados em kilobytes, megabytes ou gigabytes, anexando `K`, `M` ou `G` ao valor do tamanho. Se especificar o tamanho do arquivo de dados em kilobytes, faça isso em múltiplos de 1024. Caso contrário, os valores em kilobytes são arredondados para o próximo limite em megabytes (MB). A soma dos tamanhos dos arquivos deve, no mínimo, ser ligeiramente maior que 12 MB.

Você pode especificar mais de um arquivo de dados usando uma lista separada por ponto e vírgula. Por exemplo:

```
[mysqld]
innodb_data_file_path=ibdata1:50M;ibdata2:50M:autoextend
```

Os atributos `autoextend` e `max` podem ser usados apenas para o arquivo de dados especificado na última posição.

Quando o atributo `autoextend` é especificado, o arquivo de dados aumenta automaticamente em incrementos de 64 MB à medida que o espaço necessário é exigido. A variável `innodb_autoextend_increment` controla o tamanho do incremento.

Para especificar um tamanho máximo para um arquivo de dados auto-extensível, use o atributo `max` após o atributo `autoextend`. Use o atributo `max` apenas nos casos em que a restrição do uso do disco é de importância crítica. A configuração seguinte permite que `ibdata1` cresça até um limite de 500 MB:

```
[mysqld]
innodb_data_file_path=ibdata1:12M:autoextend:max:500M
```

Um tamanho mínimo de arquivo é exigido para o *primeiro* arquivo de dados do espaço de tabela do sistema para garantir que haja espaço suficiente para páginas de buffer de escrita dupla. O quadro a seguir mostra os tamanhos mínimos de arquivo para cada tamanho de página `InnoDB`. O tamanho de página padrão `InnoDB` é de 16384 (16 KB).

<table summary="The minimum system tablespace data file for each InnoDB page size."><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Tamanho da página (innodb_page_size)</th> <th>Minimum File Size</th> </tr></thead><tbody><tr> <td>16384 (16 KB) ou menos</td> <td>5MB</td> </tr><tr> <td>32768 (32 KB)</td> <td>6MB</td> </tr><tr> <td>65536 (64 KB)</td> <td>12MB</td> </tr></tbody></table>

Se o disco ficar cheio, você pode adicionar um arquivo de dados em outro disco. Para obter instruções, consulte o artigo Redimensionamento do espaço de tabelas do sistema.

O limite de tamanho para arquivos individuais é determinado pelo seu sistema operacional. Você pode definir o tamanho do arquivo para mais de 4 GB em sistemas operacionais que suportam arquivos grandes. Você também pode usar partições de disco bruto como arquivos de dados. Consulte o uso de partições de disco bruto para o espaço de tabela do sistema.

`InnoDB` não tem conhecimento sobre o tamanho máximo do sistema de arquivos, portanto, seja cauteloso em sistemas de arquivos onde o tamanho máximo do arquivo é um valor pequeno, como 2 GB.

Os arquivos de espaço de tabela do sistema são criados, por padrão, no diretório de dados (`datadir`). Para especificar um local alternativo, use a opção `innodb_data_home_dir`. Por exemplo, para criar um arquivo de dados de espaço de tabela do sistema em um diretório denominado `myibdata`, use esta configuração:

```
[mysqld]
innodb_data_home_dir = /myibdata/
innodb_data_file_path=ibdata1:50M:autoextend
```

Um traço final é necessário ao especificar um valor para `innodb_data_home_dir`. `InnoDB` não cria diretórios, portanto, certifique-se de que o diretório especificado existe antes de iniciar o servidor. Além disso, certifique-se de que o servidor MySQL tenha os direitos de acesso adequados para criar arquivos no diretório.

`InnoDB` forma o caminho do diretório para cada arquivo de dados, concatenando textualmente o valor de `innodb_data_home_dir` ao nome do arquivo de dados. Se `innodb_data_home_dir` não for definido, o valor padrão é “./”, que é o diretório de dados. (O servidor MySQL muda seu diretório de trabalho atual para o diretório de dados quando começa a executar.)

Como alternativa, você pode especificar um caminho absoluto para os arquivos de dados do espaço de tabela do sistema. A configuração seguinte é equivalente à anterior:

```
[mysqld]
innodb_data_file_path=/myibdata/ibdata1:50M:autoextend
```

Quando você especifica um caminho absoluto para `innodb_data_file_path`, a configuração não é concatenada com a configuração de [[`innodb_data_home_dir`]. Arquivos de espaço de sistema são criados no caminho absoluto especificado. O diretório especificado deve existir antes de iniciar o servidor.

#### Configuração do arquivo de buffer de escrita dupla do InnoDB

A partir do MySQL 8.0.20, a área de armazenamento do buffer de escrita dupla reside em arquivos de escrita dupla, o que oferece flexibilidade em relação à localização de armazenamento das páginas de escrita dupla. Em versões anteriores, a área de armazenamento do buffer de escrita dupla residia no espaço de tabela do sistema. A variável `innodb_doublewrite_dir` define o diretório onde o `InnoDB` cria arquivos de escrita dupla no início. Se não for especificado nenhum diretório, os arquivos de escrita dupla são criados no diretório `innodb_data_home_dir`, que, por padrão, é o diretório de dados, se não for especificado.

Para criar arquivos de escrita dupla em um local diferente do diretório `innodb_data_home_dir`, configure a variável `innodb_doublewrite_dir`. Por exemplo:

```
innodb_doublewrite_dir=/path/to/doublewrite_directory
```

Outras variáveis de buffer de escrita dupla permitem definir o número de arquivos de escrita dupla, o número de páginas por thread e o tamanho do lote de escrita dupla. Para mais informações sobre a configuração do buffer de escrita dupla, consulte a Seção 17.6.4, “Buffer de escrita dupla”.

#### Configuração do Log de Refazer

A partir do MySQL 8.0.30, a quantidade de espaço em disco ocupada pelos arquivos de registro de refazer é controlada pela variável `innodb_redo_log_capacity`, que pode ser definida no início ou durante o runtime; por exemplo, para definir a variável para 8 GiB em um arquivo de opção, adicione a seguinte entrada:

```
[mysqld]
innodb_redo_log_capacity = 8589934592
```

Para obter informações sobre a configuração da capacidade do log de refazer em tempo de execução, consulte Configurando a capacidade do log de refazer (MySQL 8.0.30 ou superior).

A variável `innodb_redo_log_capacity` substitui as variáveis `innodb_log_file_size` e `innodb_log_files_in_group`, que são descontinuadas. Quando a configuração `innodb_redo_log_capacity` é definida, as configurações `innodb_log_file_size` e `innodb_log_files_in_group` são ignoradas; caso contrário, se uma ou ambas essas configurações descontinuadas forem definidas, elas são usadas para calcular `Innodb_redo_log_capacity_resized` como (`innodb_log_files_in_group` * `innodb_log_file_size`). Se nenhuma dessas variáveis for definida, então o valor padrão `innodb_redo_log_capacity` é usado.

A partir do MySQL 8.0.30, `InnoDB` tenta manter 32 arquivos de registro de refazer, com cada arquivo igual a 1/32 * `innodb_redo_log_capacity`. Os arquivos de registro de refazer residem no diretório `#innodb_redo` no diretório de dados, a menos que um diretório diferente tenha sido especificado pela variável `innodb_log_group_home_dir`. Se `innodb_log_group_home_dir` foi definido, os arquivos de registro de refazer residem no diretório `#innodb_redo` nesse diretório. Para mais informações, consulte a Seção 17.6.5, “Registro de Refazer”.

Antes do MySQL 8.0.30, `InnoDB` cria dois arquivos de registro de revisão de 5 MB chamados `ib_logfile0` e `ib_logfile1` no diretório de dados por padrão. Você pode definir um número diferente de arquivos de registro de revisão e tamanho diferente do arquivo de registro de revisão ao inicializar a instância do MySQL Server, configurando as variáveis `innodb_log_files_in_group` e `innodb_log_file_size`.

* `innodb_log_files_in_group` define o número de arquivos de registro no grupo de registro. O valor padrão e recomendado é 2.

* `innodb_log_file_size` define o tamanho em bytes de cada arquivo de registro no grupo de registros. O tamanho combinado do arquivo de registro (`innodb_log_file_size` * `innodb_log_files_in_group`) não pode exceder o valor máximo, que é um pouco menos de 512 GB. Um par de arquivos de registro de 255 GB, por exemplo, se aproxima do limite, mas não o excede. O tamanho padrão do arquivo de registro é de 48 MB. Geralmente, o tamanho combinado dos arquivos de registro deve ser grande o suficiente para que o servidor possa suavizar picos e vales na atividade da carga de trabalho, o que muitas vezes significa que há espaço suficiente para o log redo para lidar com mais de uma hora de atividade de escrita. Um tamanho de arquivo de registro maior significa menos atividade de esvaziamento de verificação no buffer pool, o que reduz o I/O do disco. Para informações adicionais, consulte a Seção 10.5.4, “Otimizando o registro redo do InnoDB”.

O `innodb_log_group_home_dir` define o caminho de diretório para os arquivos de registro do `InnoDB`. Você pode usar essa opção para colocar os arquivos de registro de refazer `InnoDB` em um local de armazenamento físico diferente dos arquivos de dados do `InnoDB` para evitar potenciais conflitos de recursos de E/S; por exemplo:

```
[mysqld]
innodb_log_group_home_dir = /dr3/iblogs
```

Nota

`InnoDB` não cria diretórios, portanto, certifique-se de que o diretório de log exista antes de iniciar o servidor. Use o comando Unix ou DOS `mkdir` para criar os diretórios necessários.

Certifique-se de que o servidor MySQL tenha os direitos de acesso adequados para criar arquivos no diretório de log. Mais geralmente, o servidor deve ter direitos de acesso em qualquer diretório onde ele precise criar arquivos.

#### Desfazer a configuração do Tablespace

Por padrão, os registros de desfazer estão armazenados em dois espaços de tabelas de desfazer criados quando a instância do MySQL é inicializada.

A variável `innodb_undo_directory` define o caminho onde o `InnoDB` cria os espaços de tabela de desfazer padrão. Se essa variável não for definida, os espaços de tabela de desfazer padrão serão criados no diretório de dados. A variável `innodb_undo_directory` não é dinâmica. Configurar essa variável requer o reinício do servidor.

Os padrões de E/S para logs de desfazer tornam os espaços de tabela de desfazer bons candidatos para armazenamento em SSD.

Para obter informações sobre a configuração de tabelas de desfazer adicionais, consulte a Seção 17.6.3.4, “Tabelas de desfazer”.

#### Configuração de espaço de tabela temporário global

O espaço de tabela temporário global armazena segmentos de rollback para as alterações feitas em tabelas temporárias criadas pelo usuário.

Um único arquivo de dados de espaço de tabela temporário global que se autoexpande, denominado `ibtmp1`, no diretório `innodb_data_home_dir` por padrão. O tamanho inicial do arquivo é ligeiramente maior que 12 MB.

A opção `innodb_temp_data_file_path` especifica o caminho, o nome do arquivo e o tamanho do arquivo dos arquivos de dados do espaço de tabela temporário global. O tamanho do arquivo é especificado em KB, MB ou GB, anexando K, M ou G ao valor do tamanho. O tamanho do arquivo ou o tamanho combinado do arquivo deve ser ligeiramente maior que 12 MB.

Para especificar um local alternativo para os arquivos de dados do espaço de tabela temporário global, configure a opção `innodb_temp_data_file_path` na inicialização.

#### Configuração de espaço de tabela temporário de sessão

Em MySQL 8.0.15 e versões anteriores, os espaços temporários de tabelas de sessão armazenam tabelas temporárias criadas pelo usuário e tabelas temporárias internas criadas pelo otimizador quando `InnoDB` é configurado como o mecanismo de armazenamento em disco para tabelas temporárias internas (`internal_tmp_disk_storage_engine=InnoDB`). A partir do MySQL 8.0.16, `InnoDB` é sempre usado como o mecanismo de armazenamento em disco para tabelas temporárias internas.

A variável `innodb_temp_tablespaces_dir` define o local onde o `InnoDB` cria espaços temporários de sessão. O local padrão é o diretório `#innodb_temp` no diretório de dados.

Para especificar um local alternativo para os espaços temporários de tabelas de sessão, configure a variável `innodb_temp_tablespaces_dir` no início. É permitido um caminho totalmente qualificado ou um caminho relativo ao diretório de dados.

#### Configuração do Tamanho da Página

A opção `innodb_page_size` especifica o tamanho da página para todos os `InnoDB` espaços de tabela em uma instância do MySQL. Esse valor é definido quando a instância é criada e permanece constante posteriormente. Os valores válidos são 64KB, 32KB, 16KB (o padrão), 8KB e 4KB. Alternativamente, você pode especificar o tamanho da página em bytes (65536, 32768, 16384, 8192, 4096).

O tamanho padrão de página de 16 KB é apropriado para uma ampla gama de cargas de trabalho, particularmente para consultas que envolvem varreduras de tabela e operações de manipulação de dados de massa (DML) que envolvem atualizações em massa. Tamanhos de página menores podem ser mais eficientes para cargas de trabalho OLTP que envolvem muitos pequenos escritos, onde a concorrência pode ser um problema quando uma única página contém muitas linhas. Páginas menores também podem ser mais eficientes para dispositivos de armazenamento SSD, que normalmente usam tamanhos de bloco pequenos. Manter o tamanho de página `InnoDB` próximo ao tamanho do bloco do dispositivo de armazenamento minimiza a quantidade de dados não alterados que são reescritos no disco.

Importante

`innodb_page_size` pode ser definido apenas ao inicializar o diretório de dados. Consulte a descrição desta variável para obter mais informações.

#### Configuração de Memória

O MySQL aloca memória para vários caches e buffers para melhorar o desempenho das operações do banco de dados. Ao alocar memória para as tabelas `InnoDB`, sempre considere a memória necessária pelo sistema operacional, a memória alocada para outras aplicações e a memória alocada para outros buffers e caches do MySQL. Por exemplo, se você usar as tabelas `MyISAM`, considere a quantidade de memória alocada para o buffer de chave (`key_buffer_size`). Para uma visão geral dos buffers e caches do MySQL, consulte a Seção 10.12.3.1, “Como o MySQL usa memória”.

Os buffers específicos para `InnoDB` são configurados usando os seguintes parâmetros:

* `innodb_buffer_pool_size` define o tamanho do pool de buffers, que é a área de memória que armazena dados cacheados para as tabelas `InnoDB`, índices e outros buffers auxiliares. O tamanho do pool de buffers é importante para o desempenho do sistema, e é tipicamente recomendado que `innodb_buffer_pool_size` seja configurado para 50 a 75 por cento da memória do sistema. O tamanho padrão do pool de buffers é de 128 MB. Para obter orientações adicionais, consulte a Seção 10.12.3.1, “Como o MySQL usa memória”. Para informações sobre como configurar o tamanho do pool de buffers `InnoDB`, consulte a Seção 17.8.3.1, “Configurando o tamanho do pool de buffers InnoDB”. O tamanho do pool de buffers pode ser configurado no início ou dinamicamente.

Em sistemas com uma grande quantidade de memória, você pode melhorar a concorrência dividindo o conjunto de buffers em várias instâncias do conjunto de buffers. O número de instâncias do conjunto de buffers é controlado pela opção `innodb_buffer_pool_instances`. Por padrão, `InnoDB` cria uma instância do conjunto de buffers. O número de instâncias do conjunto de buffers pode ser configurado na inicialização. Para mais informações, consulte a Seção 17.8.3.2, “Configurando várias instâncias do conjunto de buffers”.

* `innodb_log_buffer_size` define o tamanho do buffer que `InnoDB` usa para gravar os arquivos de log no disco. O tamanho padrão é de 16 MB. Um buffer de log grande permite que transações grandes sejam executadas sem gravar o log no disco antes do comprometimento das transações. Se você tiver transações que atualizam, inserem ou excluem muitas linhas, pode considerar aumentar o tamanho do buffer de log para economizar I/O de disco. `innodb_log_buffer_size` pode ser configurado na inicialização. Para informações relacionadas, consulte a Seção 10.5.4, “Otimizando o registro de refazer do InnoDB”.

Aviso

Em GNU/Linux x86 de 32 bits, se o uso de memória estiver configurado muito alto, o `glibc` pode permitir que o heap de processos cresça sobre os pilhas de threads, causando uma falha no servidor. É um risco se a memória alocada para o processo **mysqld** para buffers e caches globais e por thread estiver próxima ou exceder 2 GB.

Uma fórmula semelhante à seguinte, que calcula a alocação de memória global e por thread para o MySQL, pode ser usada para estimar o uso de memória do MySQL. Você pode precisar modificar a fórmula para levar em conta os buffers e caches na sua versão e configuração do MySQL. Para uma visão geral dos buffers e caches do MySQL, consulte a Seção 10.12.3.1, “Como o MySQL usa memória”.

```
innodb_buffer_pool_size
+ key_buffer_size
+ max_connections*(sort_buffer_size+read_buffer_size+binlog_cache_size)
+ max_connections*2MB
```

Cada fio usa uma pilha (frequentemente 2 MB, mas apenas 256 KB nos binários do MySQL fornecidos pela Oracle Corporation) e, no pior dos casos, também usa memória adicional `sort_buffer_size + read_buffer_size`.

Em Linux, se o kernel estiver habilitado para suporte a páginas grandes, `InnoDB` pode usar páginas grandes para alocar memória para seu conjunto de buffers. Veja a Seção 10.12.3.3, “Habilitar suporte a páginas grandes”.

### 17.8.2 Configurando o InnoDB para operação de leitura somente

Você pode consultar as tabelas `InnoDB` onde o diretório de dados MySQL está em mídia somente de leitura, habilitando a opção de configuração `--innodb-read-only` na inicialização do servidor.

#### Como habilitar

Para preparar uma instância para operação apenas de leitura, certifique-se de que todas as informações necessárias foram descarregadas dos arquivos de dados antes de armazená-las no meio de leitura apenas. Execute o servidor com a bufferização de alterações desativada (`innodb_change_buffering=0`) e faça um desligamento lento.

Para habilitar o modo somente leitura para uma instância inteira do MySQL, especifique as seguintes opções de configuração na inicialização do servidor:

* Se a instância estiver em mídia somente de leitura, como um DVD ou CD, ou se o diretório `/var` não for gravável por todos: `--pid-file=path_on_writeable_media` e `--event-scheduler=disabled`

* `--innodb-temp-data-file-path`. Esta opção especifica o caminho, o nome do arquivo e o tamanho do arquivo dos dados do espaço de tabela temporário `InnoDB`. O ajuste padrão é `ibtmp1:12M:autoextend`, que cria o arquivo de dados do espaço de tabela temporário `ibtmp1` no diretório de dados. Para preparar uma instância para operação apenas de leitura, defina `innodb_temp_data_file_path` em uma localização fora do diretório de dados. O caminho deve ser relativo ao diretório de dados. Por exemplo:

  ```
  --innodb-temp-data-file-path=../../../tmp/ibtmp1:12M:autoextend
  ```

A partir do MySQL 8.0, habilitar `innodb_read_only` impede a criação e a supressão de operações de tabela para todos os motores de armazenamento. Essas operações modificam as tabelas do dicionário de dados no banco de dados do sistema `mysql`, mas essas tabelas utilizam o motor de armazenamento `InnoDB` e não podem ser modificadas quando `innodb_read_only` está habilitado. A mesma restrição se aplica a qualquer operação que modifique as tabelas do dicionário de dados, como [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") e [`ALTER TABLE tbl_name ENGINE=engine_name`](alter-table.html "15.1.9 ALTER TABLE Statement").

Além disso, outras tabelas no banco de dados do sistema `mysql` utilizam o mecanismo de armazenamento `InnoDB` no MySQL 8.0. Tornar essas tabelas apenas de leitura resulta em restrições em operações que as modificam. Por exemplo, as operações `CREATE USER`, `GRANT`, `REVOKE` e `INSTALL PLUGIN` não são permitidas no modo de leitura apenas.

#### Cenários de Uso

Esse modo de operação é apropriado em situações como:

* Distribuir um aplicativo MySQL ou um conjunto de dados MySQL em um meio de armazenamento somente de leitura, como um DVD ou CD.

* Múltiplas instâncias do MySQL fazendo consultas no mesmo diretório de dados simultaneamente, geralmente em uma configuração de data warehousing. Você pode usar essa técnica para evitar gargalos que podem ocorrer com uma instância do MySQL fortemente carregada, ou você pode usar diferentes opções de configuração para as várias instâncias para sintonizar cada uma para tipos específicos de consultas.

* Consultar dados que foram colocados em estado de leitura somente por razões de segurança ou integridade de dados, como dados de backup arquivados.

Nota

Este recurso é destinado principalmente à flexibilidade na distribuição e implantação, e não ao desempenho bruto baseado no aspecto de leitura somente. Consulte a Seção 10.5.3, “Otimizando Transações de Leitura Somente do InnoDB”, para obter maneiras de ajustar o desempenho de consultas de leitura somente, que não exigem tornar o servidor como um todo de leitura somente.

#### Como Funciona

Quando o servidor é executado em modo de leitura somente através da opção `--innodb-read-only`, certos recursos e componentes do `InnoDB` são reduzidos ou desativados completamente:

* Não é feita nenhuma [alteração de buffer][(glossary.html#glos_change_buffering "change buffering")], em particular, nenhuma fusão do buffer de alterações. Para garantir que o buffer de alterações esteja vazio quando você preparar a instância para operação somente de leitura, desative o buffer de alterações (`innodb_change_buffering=0`) e faça um [desligamento lento][(glossary.html#glos_slow_shutdown "slow shutdown")] primeiro.

* Não há fase de recuperação de falhas (glossary.html#glos_crash_recovery "crash recovery") na inicialização. A instância deve ter realizado uma (glossary.html#glos_slow_shutdown "slow shutdown") de desligamento lento antes de ser colocada no estado de leitura somente.

* Como o log de refazer não é utilizado em operações de leitura somente, você pode definir `innodb_log_file_size` para o menor tamanho possível (1 MB) antes de tornar a instância de leitura somente.

* A maioria dos threads de fundo está desativada. Os threads de leitura de E/S permanecem, assim como os threads de escrita de E/S e um thread de coordenador de esvaziamento de página para escritas em arquivos temporários, que são permitidas no modo de leitura somente. Um thread de redimensionamento do pool de buffer também permanece ativo para permitir o redimensionamento online do pool de buffer.

* As informações sobre bloqueios, saída do monitor, e assim por diante, não são escritas em arquivos temporários. Como consequência, `SHOW ENGINE INNODB STATUS` (show-engine.html "15.7.7.15 SHOW ENGINE Statement") não produz nenhuma saída.

* Alterações nas configurações das opções de configuração que normalmente alterariam o comportamento das operações de escrita não têm efeito quando o servidor está no modo de leitura somente.

* O processamento MVCC para impor [níveis de isolamento][(glossary.html#glos_isolation_level "isolation level")] está desativado. Todas as consultas leem a versão mais recente de um registro, porque as atualizações e as exclusões não são possíveis.

* O registro de desfazer não é utilizado. Desative todas as configurações para as opções de configuração `innodb_undo_tablespaces` e `innodb_undo_directory`.

### 17.8.3 Configuração do Banco de Armazenamento de Buffer do InnoDB

Esta seção fornece informações de configuração e ajuste para o pool de buffers `InnoDB`.

#### 17.8.3.1 Configurando o tamanho do pool de buffer do InnoDB

Você pode configurar o tamanho do pool de tampão `InnoDB` offline ou enquanto o servidor está em execução. O comportamento descrito nesta seção se aplica a ambos os métodos. Para obter informações adicionais sobre a configuração do tamanho do pool de tampão online, consulte Configurando o tamanho do pool de tampão InnoDB online.

Ao aumentar ou diminuir `innodb_buffer_pool_size`, a operação é realizada em partes. O tamanho do bloco é definido pela opção de configuração `innodb_buffer_pool_chunk_size`, que tem um padrão de `128M`. Para mais informações, consulte Configurando o tamanho do bloco do buffer do InnoDB.

O tamanho do pool de buffer deve sempre ser igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se você configurar `innodb_buffer_pool_size` para um valor que não é igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`, o tamanho do pool de buffer é automaticamente ajustado para um valor que é igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

No exemplo a seguir, `innodb_buffer_pool_size` é definido como `8G`, e `innodb_buffer_pool_instances` é definido como `16`. `innodb_buffer_pool_chunk_size` é `128M`, que é o valor padrão.

`8G` é um valor válido `innodb_buffer_pool_size` porque `8G` é um múltiplo de `innodb_buffer_pool_instances=16` * `innodb_buffer_pool_chunk_size=128M`, que é `2G`.

```
$> mysqld --innodb-buffer-pool-size=8G --innodb-buffer-pool-instances=16
```

```
mysql> SELECT @@innodb_buffer_pool_size/1024/1024/1024;
+------------------------------------------+
| @@innodb_buffer_pool_size/1024/1024/1024 |
+------------------------------------------+
|                           8.000000000000 |
+------------------------------------------+
```

Neste exemplo, `innodb_buffer_pool_size` é definido como `9G`, e `innodb_buffer_pool_instances` é definido como `16`. `innodb_buffer_pool_chunk_size` é `128M`, que é o valor padrão. Neste caso, `9G` não é um múltiplo de `innodb_buffer_pool_instances=16` \* `innodb_buffer_pool_chunk_size=128M`, então `innodb_buffer_pool_size` é ajustado para `10G`, que é um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

```
$> mysqld --innodb-buffer-pool-size=9G --innodb-buffer-pool-instances=16
```

```
mysql> SELECT @@innodb_buffer_pool_size/1024/1024/1024;
+------------------------------------------+
| @@innodb_buffer_pool_size/1024/1024/1024 |
+------------------------------------------+
|                          10.000000000000 |
+------------------------------------------+
```

##### Configurando o tamanho do bloco do pool de buffer do InnoDB

`innodb_buffer_pool_chunk_size` pode ser aumentado ou diminuído em unidades de 1 MB (1048576 bytes), mas só pode ser modificado no momento do arranque, numa cadeia de caracteres de linha de comando ou num ficheiro de configuração MySQL.

Linha de comando:

```
$> mysqld --innodb-buffer-pool-chunk-size=134217728
```

Arquivo de configuração:

```
[mysqld]
innodb_buffer_pool_chunk_size=134217728
```

As seguintes condições se aplicam ao alterar `innodb_buffer_pool_chunk_size`:

* Se o novo valor de `innodb_buffer_pool_chunk_size` * `innodb_buffer_pool_instances` for maior que o tamanho atual do pool de buffer quando o pool de buffer é inicializado, `innodb_buffer_pool_chunk_size` é truncado para `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`.

Por exemplo, se o pool de buffer é inicializado com um tamanho de `2GB` (2147483648 bytes), instâncias de pool de buffer `4` e um tamanho de bloco de `1GB` (1073741824 bytes), o tamanho do bloco é truncado para um valor igual a `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`, conforme mostrado abaixo:

  ```
  $> mysqld --innodb-buffer-pool-size=2147483648 --innodb-buffer-pool-instances=4
  --innodb-buffer-pool-chunk-size=1073741824;
  ```

  ```
  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                2147483648 |
  +---------------------------+

  mysql> SELECT @@innodb_buffer_pool_instances;
  +--------------------------------+
  | @@innodb_buffer_pool_instances |
  +--------------------------------+
  |                              4 |
  +--------------------------------+

  # Chunk size was set to 1GB (1073741824 bytes) on startup but was
  # truncated to innodb_buffer_pool_size / innodb_buffer_pool_instances

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       536870912 |
  +---------------------------------+
  ```

* O tamanho do buffer deve sempre ser igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se alterar `innodb_buffer_pool_chunk_size`, `innodb_buffer_pool_size` é automaticamente ajustado para um valor que é igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. O ajuste ocorre quando o buffer é inicializado. Esse comportamento é demonstrado no exemplo a seguir:

  ```
  # The buffer pool has a default size of 128MB (134217728 bytes)

  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                 134217728 |
  +---------------------------+

  # The chunk size is also 128MB (134217728 bytes)

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       134217728 |
  +---------------------------------+

  # There is a single buffer pool instance

  mysql> SELECT @@innodb_buffer_pool_instances;
  +--------------------------------+
  | @@innodb_buffer_pool_instances |
  +--------------------------------+
  |                              1 |
  +--------------------------------+

  # Chunk size is decreased by 1MB (1048576 bytes) at startup
  # (134217728 - 1048576 = 133169152):

  $> mysqld --innodb-buffer-pool-chunk-size=133169152

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       133169152 |
  +---------------------------------+

  # Buffer pool size increases from 134217728 to 266338304
  # Buffer pool size is automatically adjusted to a value that is equal to
  # or a multiple of innodb_buffer_pool_chunk_size * innodb_buffer_pool_instances

  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                 266338304 |
  +---------------------------+
  ```

Este exemplo demonstra o mesmo comportamento, mas com múltiplas instâncias do pool de buffers:

  ```
  # The buffer pool has a default size of 2GB (2147483648 bytes)

  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                2147483648 |
  +---------------------------+

  # The chunk size is .5 GB (536870912 bytes)

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       536870912 |
  +---------------------------------+

  # There are 4 buffer pool instances

  mysql> SELECT @@innodb_buffer_pool_instances;
  +--------------------------------+
  | @@innodb_buffer_pool_instances |
  +--------------------------------+
  |                              4 |
  +--------------------------------+

  # Chunk size is decreased by 1MB (1048576 bytes) at startup
  # (536870912 - 1048576 = 535822336):

  $> mysqld --innodb-buffer-pool-chunk-size=535822336

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       535822336 |
  +---------------------------------+

  # Buffer pool size increases from 2147483648 to 4286578688
  # Buffer pool size is automatically adjusted to a value that is equal to
  # or a multiple of innodb_buffer_pool_chunk_size * innodb_buffer_pool_instances

  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                4286578688 |
  +---------------------------+
  ```

É necessário ter cuidado ao alterar `innodb_buffer_pool_chunk_size`, pois alterar esse valor pode aumentar o tamanho do pool de buffer, como mostrado nos exemplos acima. Antes de alterar `innodb_buffer_pool_chunk_size`, calcule o efeito em `innodb_buffer_pool_size` para garantir que o tamanho do pool de buffer resultante seja aceitável.

Nota

Para evitar possíveis problemas de desempenho, o número de fragmentos (`innodb_buffer_pool_size` / `innodb_buffer_pool_chunk_size`) não deve exceder 1000.

##### Configurando o tamanho do pool de buffer do InnoDB online

A opção de configuração `innodb_buffer_pool_size` pode ser definida dinamicamente usando uma declaração `SET`, permitindo que você redimensione o pool de buffer sem reiniciar o servidor. Por exemplo:

```
mysql> SET GLOBAL innodb_buffer_pool_size=402653184;
```

Nota

O tamanho do buffer deve ser igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Para alterar esses ajustes de variáveis, é necessário reiniciar o servidor.

As transações e operações ativas realizadas por meio das APIs do `InnoDB` devem ser concluídas antes de redimensionar o pool de buffer. Ao iniciar uma operação de redimensionamento, a operação não começa até que todas as transações ativas sejam concluídas. Uma vez que a operação de redimensionamento esteja em andamento, novas transações e operações que exigem acesso ao pool de buffer devem esperar até que a operação de redimensionamento termine. A exceção à regra é que o acesso concorrente ao pool de buffer é permitido enquanto o pool de buffer está sendo desfragmentado e as páginas são retiradas quando o tamanho do pool de buffer é reduzido. Uma desvantagem de permitir o acesso concorrente é que isso pode resultar em uma escassez temporária de páginas disponíveis enquanto as páginas estão sendo retiradas.

Nota

As transações aninhadas podem falhar se iniciadas após o início da operação de redimensionamento do pool de tampão.

##### Monitoramento do progresso de redimensionamento do Pool de Buffer online

A variável `Innodb_buffer_pool_resize_status` reporta um valor de cadeia que indica o progresso do redimensionamento do pool de buffers; por exemplo:

```
mysql> SHOW STATUS WHERE Variable_name='InnoDB_buffer_pool_resize_status';
+----------------------------------+----------------------------------+
| Variable_name                    | Value                            |
+----------------------------------+----------------------------------+
| Innodb_buffer_pool_resize_status | Resizing also other hash tables. |
+----------------------------------+----------------------------------+
```

A partir do MyQL 8.0.31, você também pode monitorar uma operação de redimensionamento do buffer online usando as variáveis de status `Innodb_buffer_pool_resize_status_code` e `Innodb_buffer_pool_resize_status_progress`, que relatam valores numéricos, preferíveis para monitoramento programático.

A variável de status `Innodb_buffer_pool_resize_status_code` reporta um código de status que indica o estágio de uma operação de redimensionamento do buffer online. Os códigos de status incluem:

* 0: Sem operação de redimensionamento em andamento
* 1: Início do redimensionamento
* 2: Desativação do AHI (Índice Hash Adaptativo)
* 3: Retirada de blocos
* 4: Aquisição de bloqueio global
* 5: Redimensionamento do pool
* 6: Redimensionamento do hash
* 7: Redimensionamento falhou

A variável de status `Innodb_buffer_pool_resize_status_progress` reporta um valor percentual que indica o progresso de cada estágio. O valor percentual é atualizado após cada instância do conjunto de buffers ser processada. À medida que o status (relatado pelo `Innodb_buffer_pool_resize_status_code`) muda de um status para outro, o valor percentual é redefinido para 0.

A consulta a seguir retorna um valor de string que indica o progresso do redimensionamento do buffer pool, um código que indica a etapa atual da operação e o progresso atual dessa etapa, expresso como um valor percentual:

```
SELECT variable_name, variable_value
 FROM performance_schema.global_status
 WHERE LOWER(variable_name) LIKE "innodb_buffer_pool_resize%";
```

O progresso do redimensionamento do buffer pool também é visível no log de erro do servidor. Este exemplo mostra as notas registradas quando o tamanho do buffer pool é aumentado:

```
[Note] InnoDB: Resizing buffer pool from 134217728 to 4294967296. (unit=134217728)
[Note] InnoDB: disabled adaptive hash index.
[Note] InnoDB: buffer pool 0 : 31 chunks (253952 blocks) was added.
[Note] InnoDB: buffer pool 0 : hash tables were resized.
[Note] InnoDB: Resized hash tables at lock_sys, adaptive hash index, dictionary.
[Note] InnoDB: completed to resize buffer pool from 134217728 to 4294967296.
[Note] InnoDB: re-enabled adaptive hash index.
```

Este exemplo mostra as notas registradas quando o tamanho do pool de buffer é diminuído:

```
[Note] InnoDB: Resizing buffer pool from 4294967296 to 134217728. (unit=134217728)
[Note] InnoDB: disabled adaptive hash index.
[Note] InnoDB: buffer pool 0 : start to withdraw the last 253952 blocks.
[Note] InnoDB: buffer pool 0 : withdrew 253952 blocks from free list. tried to relocate
0 pages. (253952/253952)
[Note] InnoDB: buffer pool 0 : withdrawn target 253952 blocks.
[Note] InnoDB: buffer pool 0 : 31 chunks (253952 blocks) was freed.
[Note] InnoDB: buffer pool 0 : hash tables were resized.
[Note] InnoDB: Resized hash tables at lock_sys, adaptive hash index, dictionary.
[Note] InnoDB: completed to resize buffer pool from 4294967296 to 134217728.
[Note] InnoDB: re-enabled adaptive hash index.
```

A partir do MySQL 8.0.31, ao iniciar o servidor com os registros `--log-error-verbosity=3`, informações adicionais são adicionadas ao registro de erro durante uma operação de redimensionamento do buffer online. As informações adicionais incluem os códigos de status reportados pelo `Innodb_buffer_pool_resize_status_code` e o valor de progresso percentual reportado pelo `Innodb_buffer_pool_resize_status_progress`.

```
[Note] [MY-012398] [InnoDB] Requested to resize buffer pool. (new size: 1073741824 bytes)
[Note] [MY-013954] [InnoDB] Status code 1: Resizing buffer pool from 134217728 to 1073741824
(unit=134217728).
[Note] [MY-013953] [InnoDB] Status code 1: 100% complete
[Note] [MY-013952] [InnoDB] Status code 1: Completed
[Note] [MY-013954] [InnoDB] Status code 2: Disabling adaptive hash index.
[Note] [MY-011885] [InnoDB] disabled adaptive hash index.
[Note] [MY-013953] [InnoDB] Status code 2: 100% complete
[Note] [MY-013952] [InnoDB] Status code 2: Completed
[Note] [MY-013954] [InnoDB] Status code 3: Withdrawing blocks to be shrunken.
[Note] [MY-013953] [InnoDB] Status code 3: 100% complete
[Note] [MY-013952] [InnoDB] Status code 3: Completed
[Note] [MY-013954] [InnoDB] Status code 4: Latching whole of buffer pool.
[Note] [MY-013953] [InnoDB] Status code 4: 14% complete
[Note] [MY-013953] [InnoDB] Status code 4: 28% complete
[Note] [MY-013953] [InnoDB] Status code 4: 42% complete
[Note] [MY-013953] [InnoDB] Status code 4: 57% complete
[Note] [MY-013953] [InnoDB] Status code 4: 71% complete
[Note] [MY-013953] [InnoDB] Status code 4: 85% complete
[Note] [MY-013953] [InnoDB] Status code 4: 100% complete
[Note] [MY-013952] [InnoDB] Status code 4: Completed
[Note] [MY-013954] [InnoDB] Status code 5: Starting pool resize
[Note] [MY-013954] [InnoDB] Status code 5: buffer pool 0 : resizing with chunks 1 to 8.
[Note] [MY-011891] [InnoDB] buffer pool 0 : 7 chunks (57339 blocks) were added.
[Note] [MY-013953] [InnoDB] Status code 5: 100% complete
[Note] [MY-013952] [InnoDB] Status code 5: Completed
[Note] [MY-013954] [InnoDB] Status code 6: Resizing hash tables.
[Note] [MY-011892] [InnoDB] buffer pool 0 : hash tables were resized.
[Note] [MY-013953] [InnoDB] Status code 6: 100% complete
[Note] [MY-013954] [InnoDB] Status code 6: Resizing also other hash tables.
[Note] [MY-011893] [InnoDB] Resized hash tables at lock_sys, adaptive hash index, dictionary.
[Note] [MY-011894] [InnoDB] Completed to resize buffer pool from 134217728 to 1073741824.
[Note] [MY-011895] [InnoDB] Re-enabled adaptive hash index.
[Note] [MY-013952] [InnoDB] Status code 6: Completed
[Note] [MY-013954] [InnoDB] Status code 0: Completed resizing buffer pool at 220826  6:25:46.
[Note] [MY-013953] [InnoDB] Status code 0: 100% complete
```

##### Interiores da Redimensionamento do Banco de Buffer Online

A operação de redimensionamento é realizada por um thread de fundo. Ao aumentar o tamanho do pool de buffer, a operação de redimensionamento:

* Adiciona páginas em `chunks` (o tamanho do bloco é definido por `innodb_buffer_pool_chunk_size`)

* Converte tabelas de hash, listas e ponteiros para usar novos endereços na memória

* Adiciona novas páginas à lista gratuita

Enquanto essas operações estão em andamento, outros threads são bloqueados de acessar o pool de buffer.

Ao diminuir o tamanho do pool de buffer, a operação de redimensionamento:

* Desfragmenta o pool de buffer e retira (libera) páginas
* Remove páginas em `chunks` (o tamanho do bloco é definido por `innodb_buffer_pool_chunk_size`)

* Converte tabelas de hash, listas e ponteiros para usar novos endereços na memória

Destas operações, apenas a desfragmentação do pool de buffer e a retirada de páginas permitem que outros threads acessem o pool de buffer simultaneamente.

#### 17.8.3.2 Configurando múltiplas instâncias de um pool de buffer

Para sistemas com pools de buffer na faixa de vários gigabytes, dividir o pool de buffer em instâncias separadas pode melhorar a concorrência, reduzindo a concorrência à medida que diferentes threads leem e escrevem em páginas armazenadas em cache. Esse recurso é tipicamente destinado a sistemas com um tamanho de [pool de buffer][(glossary.html#glos_buffer_pool "buffer pool")] na faixa de vários gigabytes. Múltiplas instâncias do pool de buffer são configuradas usando a opção de configuração `innodb_buffer_pool_instances`, e você também pode ajustar o valor de `innodb_buffer_pool_size`.

Quando o pool de buffers `InnoDB` é grande, muitas solicitações de dados podem ser atendidas pela recuperação da memória. Você pode encontrar gargalos devido a vários threads tentando acessar o pool de buffers ao mesmo tempo. Você pode habilitar vários pools de buffers para minimizar essa concorrência. Cada página que é armazenada ou lida com o pool de buffers é atribuída aleatoriamente a um dos pools de buffers, usando uma função de hashing. Cada pool de buffers gerencia suas próprias listas de livre, listas de esvaziamento, LRUs e todas as outras estruturas de dados conectadas a um pool de buffers. Antes do MySQL 8.0, cada pool de buffers era protegido por seu próprio mutex de pool de buffers. No MySQL 8.0 e posterior, o mutex do pool de buffers foi substituído por vários mutxes de proteção de listas e hash, para reduzir a concorrência.

Para habilitar múltiplas instâncias do pool de buffers, defina a opção de configuração `innodb_buffer_pool_instances` para um valor maior que 1 (o padrão) até 64 (o máximo). Esta opção só tem efeito quando você define `innodb_buffer_pool_size` para um tamanho de 1 GB ou mais. O tamanho total que você especifica é dividido entre todas as instâncias do pool de buffers. Para a melhor eficiência, especifique uma combinação de `innodb_buffer_pool_instances` e `innodb_buffer_pool_size` para que cada instância do pool de buffers seja de pelo menos 1 GB.

Para obter informações sobre a modificação do tamanho do pool de tampão `InnoDB`, consulte a Seção 17.8.3.1, “Configurando o tamanho do pool de tampão InnoDB”.

#### 17.8.3.3 Tornar o escaneamento do Pool de tampão resistente

Em vez de usar um algoritmo LRU rígido, `InnoDB` utiliza uma técnica para minimizar a quantidade de dados que são trazidos para o pool de buffer e nunca mais acessados. O objetivo é garantir que as páginas frequentemente acessadas (“quentes”) permaneçam no pool de buffer, mesmo quando os lemas de leitura e varreduras completas da tabela trazem novos blocos que podem ou não ser acessados posteriormente.

Blocos recém-leídos são inseridos no meio da lista LRU. Todas as páginas recém-lidas são inseridas em um local que, por padrão, é `3/8` da extremidade da lista LRU. As páginas são movidas para a frente da lista (a extremidade mais recentemente usada) quando são acessadas no buffer pool pela primeira vez. Assim, as páginas que nunca são acessadas nunca chegam à parte frontal da lista LRU e são "eliminadas" mais cedo do que com uma abordagem LRU estrita. Esse arranjo divide a lista LRU em dois segmentos, onde as páginas a jusante do ponto de inserção são consideradas "antigas" e são vítimas desejáveis para a eliminação LRU.

Para uma explicação sobre o funcionamento interno do pool de buffers `InnoDB` e detalhes sobre o algoritmo LRU, consulte a Seção 17.5.1, “Pool de Buffers”.

Você pode controlar o ponto de inserção na lista LRU e escolher se o `InnoDB` aplica a mesma otimização aos blocos trazidos para o pool de buffer por varreduras de tabela ou índice. O parâmetro de configuração `innodb_old_blocks_pct` controla a porcentagem de blocos “antigos” na lista LRU. O valor padrão de `innodb_old_blocks_pct` é `37`, correspondendo à proporção fixa original de 3/8. A faixa de valores é `5` (novas páginas no pool de buffer são descartadas rapidamente) a `95` (apenas 5% do pool de buffer é reservado para páginas quentes, fazendo com que o algoritmo se aproxime da estratégia LRU familiar).

A otimização que impede que o pool de tampão seja removido devido a leituras antecipadas pode evitar problemas semelhantes devido a varreduras de tabelas ou índices. Nestas varreduras, uma página de dados é tipicamente acessada algumas vezes em rápida sucessão e nunca é tocada novamente. O parâmetro de configuração `innodb_old_blocks_time` especifica a janela de tempo (em milissegundos) após o primeiro acesso a uma página durante a qual ela pode ser acessada sem ser movida para a frente (extremo mais recentemente usado) da lista LRU. O valor padrão de `innodb_old_blocks_time` é `1000`. Aumentar este valor torna cada vez mais provável que blocos sejam eliminados mais rapidamente do pool de tampão.

Tanto o `innodb_old_blocks_pct` quanto o `innodb_old_blocks_time` podem ser especificados no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou alterados em tempo de execução com a declaração [`SET GLOBAL`(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")]. Alterar o valor em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

Para ajudá-lo a avaliar o efeito da definição desses parâmetros, o comando `SHOW ENGINE INNODB STATUS` relata estatísticas do pool de buffers. Para obter detalhes, consulte o artigo Monitorando o pool de buffers usando o Monitor padrão do InnoDB.

Como os efeitos desses parâmetros podem variar amplamente com base na configuração do seu hardware, nos seus dados e nos detalhes da sua carga de trabalho, sempre realize uma comparação para verificar a eficácia antes de alterar essas configurações em qualquer ambiente crítico de desempenho ou de produção.

Em cargas de trabalho mistas, onde a maioria das atividades é do tipo OLTP, com consultas de relatórios de lote periódicos que resultam em grandes varreduras, definir o valor de `innodb_old_blocks_time` durante as execuções de lote pode ajudar a manter o conjunto de trabalho da carga de trabalho normal no pool de buffer.

Ao digitalizar tabelas grandes que não cabem inteiramente no pool de buffer, definir `innodb_old_blocks_pct` para um valor pequeno mantém os dados que são lidos apenas uma vez, evitando o consumo de uma parte significativa do pool de buffer. Por exemplo, definir `innodb_old_blocks_pct=5` restringe esses dados que são lidos apenas uma vez a 5% do pool de buffer.

Ao digitalizar pequenas tabelas que cabem na memória, há menos sobrecarga para mover páginas dentro do conjunto de buffers, então você pode deixar `innodb_old_blocks_pct` no seu valor padrão, ou até mesmo mais alto, como `innodb_old_blocks_pct=50`.

O efeito do parâmetro `innodb_old_blocks_time` é mais difícil de prever do que o parâmetro `innodb_old_blocks_pct`, é relativamente pequeno e varia mais com a carga de trabalho. Para chegar a um valor ótimo, realize seus próprios benchmarks se a melhoria de desempenho dajuste do `innodb_old_blocks_pct` não for suficiente.

#### 17.8.3.4 Configurando a pré-visualização (leitura antecipada) do buffer do InnoDB Pool

Um pedido de leitura antecipada é uma solicitação de E/S para pré-visualizar várias páginas no pool de buffer de forma assíncrona, antecipando a necessidade iminente dessas páginas. Os pedidos trazem todas as páginas em um mesmo intervalo. `InnoDB` utiliza dois algoritmos de leitura antecipada para melhorar o desempenho de E/S:

O **linear** pré-leitura é uma técnica que prevê quais páginas podem ser necessárias em breve com base em páginas no buffer sendo acessadas sequencialmente. Você controla quando o `InnoDB` realiza uma operação de pré-leitura ajustando o número de acessos sequenciais de página necessários para desencadear uma solicitação de leitura assíncrona, usando o parâmetro de configuração `innodb_read_ahead_threshold`. Antes que este parâmetro fosse adicionado, o `InnoDB` só calculava se emitir uma solicitação de pré-pré-leitura assíncrona para o próximo conjunto inteiro quando lia a última página do conjunto atual.

O parâmetro de configuração `innodb_read_ahead_threshold` controla a sensibilidade de `InnoDB` na detecção de padrões de acesso sequencial à página. Se o número de páginas lidas sequencialmente em um intervalo for maior ou igual a `innodb_read_ahead_threshold`, `InnoDB` inicia uma operação de leitura antecipada assíncrona de todo o intervalo seguinte. `innodb_read_ahead_threshold` pode ser definido para qualquer valor de 0 a 64. O valor padrão é 56. Quanto maior o valor, mais rigoroso o check do padrão de acesso. Por exemplo, se você definir o valor para 48, `InnoDB` aciona uma solicitação de leitura antecipada linear apenas quando 48 páginas no intervalo atual foram acessadas sequencialmente. Se o valor for 8, `InnoDB` aciona uma leitura antecipada assíncrona mesmo que tão somente 8 páginas no intervalo sejam acessadas sequencialmente. Você pode definir o valor deste parâmetro no arquivo de configuração do MySQL [(glossary.html#glos_configuration_file "configuration file")], ou alterá-lo dinamicamente com a declaração [[`SET GLOBAL`][(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")]], que requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

A leitura prévia aleatória é uma técnica que prevê quando as páginas podem ser necessárias em breve com base em páginas já presentes no buffer pool, independentemente da ordem em que essas páginas foram lidas. Se 13 páginas consecutivas do mesmo escopo forem encontradas no buffer pool, `InnoDB` emite ativamente uma solicitação para pré-visualizar as páginas restantes do escopo. Para habilitar essa funcionalidade, defina a variável de configuração `innodb_random_read_ahead` para `ON`.

O comando `SHOW ENGINE INNODB STATUS` exibe estatísticas para ajudá-lo a avaliar a eficácia do algoritmo de leitura antecipada. As estatísticas incluem informações de contador para as seguintes variáveis de status globais:

* `Innodb_buffer_pool_read_ahead`
* `Innodb_buffer_pool_read_ahead_evicted`
* `Innodb_buffer_pool_read_ahead_rnd`

Essa informação pode ser útil ao ajustar o ajuste `innodb_random_read_ahead`.

Para mais informações sobre o desempenho de E/S, consulte a Seção 10.5.8, “Otimizando E/S de disco InnoDB” e a Seção 10.12.1, “Otimizando E/S de disco”.

#### 17.8.3.5 Configurando o esvaziamento do Pool de tampão

`InnoDB` realiza certas tarefas em segundo plano, incluindo o esvaziamento de páginas sujas do pool de buffer. Páginas sujas são aquelas que foram modificadas, mas ainda não foram escritas nos arquivos de dados no disco.

No MySQL 8.0, o esvaziamento do pool de buffers é realizado por threads do limpador de páginas. O número de threads do limpador de páginas é controlado pela variável `innodb_page_cleaners`, que tem um valor padrão de 4. No entanto, se o número de threads do limpador de páginas exceder o número de instâncias do pool de buffers, `innodb_page_cleaners` é automaticamente definido para o mesmo valor que `innodb_buffer_pool_instances`.

O esvaziamento do buffer é iniciado quando a porcentagem de páginas sujas atinge o valor mínimo definido pela variável `innodb_max_dirty_pages_pct_lwm`. O valor mínimo padrão é 10% das páginas do buffer. Um valor `innodb_max_dirty_pages_pct_lwm` de 0 desativa esse comportamento de esvaziamento precoce.

O propósito do limite `innodb_max_dirty_pages_pct_lwm` é controlar a porcentagem de páginas sujas no buffer pool e evitar que a quantidade de páginas sujas atinja o limite definido pela variável `innodb_max_dirty_pages_pct`, que tem um valor padrão de 90. `InnoDB` limpa agressivamente as páginas do buffer pool se a porcentagem de páginas sujas no buffer pool atingir o limite `innodb_max_dirty_pages_pct`.

Ao configurar `innodb_max_dirty_pages_pct_lwm`, o valor deve sempre ser menor que o valor de `innodb_max_dirty_pages_pct`.

Variáveis adicionais permitem o ajuste fino do comportamento de esvaziamento do pool de tampão:

* A variável `innodb_flush_neighbors` define se a limpeza de uma página do pool de buffer também limpa outras páginas sujas na mesma extensão.

+ A configuração padrão de 0 desativa `innodb_flush_neighbors`. Páginas sujas na mesma extensão não são descartadas. Esta configuração é recomendada para dispositivos de armazenamento não rotativo (SSD), onde o tempo de busca não é um fator significativo.

+ Uma configuração de 1 esvaziamento de páginas sujas consecutivas na mesma extensão.

+ Uma configuração de 2 varreduras de páginas sujas na mesma extensão.

Quando os dados da tabela são armazenados em um dispositivo de armazenamento HDD tradicional, o esvaziamento de páginas vizinhas em uma operação reduz o overhead de I/O (principalmente para operações de busca de disco) em comparação com o esvaziamento de páginas individuais em diferentes momentos. Para dados da tabela armazenados em SSD, o tempo de busca não é um fator significativo e você pode desativar essa configuração para espalhar as operações de escrita.

* A variável `innodb_lru_scan_depth` especifica, por instância do pool de buffers, até onde o thread de limpeza de páginas procura, na lista LRU do pool de buffers, as páginas sujas para serem descartadas. Essa é uma operação de fundo realizada por um thread de limpeza de páginas uma vez por segundo.

Um ajuste menor que o padrão é geralmente adequado para a maioria das cargas de trabalho. Um valor significativamente maior que o necessário pode impactar o desempenho. Apenas considere aumentar o valor se você tiver capacidade de E/S disponível em uma carga de trabalho típica. Por outro lado, se uma carga de trabalho intensiva de escrita saturar sua capacidade de E/S, diminua o valor, especialmente no caso de um grande pool de buffers.

Ao ajustar `innodb_lru_scan_depth`, comece com um valor baixo e configure o ajuste para cima, com o objetivo de raramente ver páginas livres em zero. Além disso, considere ajustar `innodb_lru_scan_depth` quando alterar o número de instâncias do buffer pool, pois [[`innodb_lru_scan_depth`] * [`innodb_buffer_pool_instances`]] define a quantidade de trabalho realizada pelo fio de limpeza de página a cada segundo.

As variáveis `innodb_flush_neighbors` e `innodb_lru_scan_depth` são projetadas principalmente para cargas de trabalho intensivas de escrita. Com uma atividade DML intensa, o esvaziamento pode ficar para trás se não for suficientemente agressivo, ou os escritos no disco podem saturar a capacidade de E/S se o esvaziamento for muito agressivo. As configurações ideais dependem do seu trabalho, dos padrões de acesso aos dados e da configuração de armazenamento (por exemplo, se os dados são armazenados em dispositivos HDD ou SSD).

##### Escoamento Adaptativo

`InnoDB` utiliza um algoritmo de limpeza adaptativo para ajustar dinamicamente a taxa de limpeza com base na velocidade da geração do log de revisão e na taxa atual de limpeza. O objetivo é suavizar o desempenho geral, garantindo que a atividade de limpeza esteja alinhada com a carga de trabalho atual. Ajustar automaticamente a taxa de limpeza ajuda a evitar quedas repentinas no desempenho que podem ocorrer quando surtos de atividade de E/S devido ao esvaziamento do pool de buffers afetam a capacidade de E/S disponível para a atividade de leitura e escrita comum.

Pontos de verificação agudos, que são tipicamente associados a cargas de trabalho intensivas de escrita que geram muitas entradas de refazer, podem causar uma mudança súbita no desempenho, por exemplo. Um ponto de verificação agudo ocorre quando `InnoDB` deseja reutilizar uma parte de um arquivo de registro. Antes de fazer isso, todas as páginas sujas com entradas de refazer naquela parte do arquivo de registro devem ser descarregadas. Se os arquivos de registro se tornarem cheios, ocorre um ponto de verificação agudo, causando uma redução temporária no desempenho. Esse cenário pode ocorrer mesmo se o limite `innodb_max_dirty_pages_pct` não for alcançado.

O algoritmo de limpeza adaptativo ajuda a evitar tais cenários, monitorando o número de páginas sujas no pool de buffer e a taxa na qual os registros do log de refazer estão sendo gerados. Com base nessa informação, ele decide quantas páginas sujas devem ser limpas do pool de buffer a cada segundo, o que permite que ele gerencie mudanças repentinas na carga de trabalho.

A variável `innodb_adaptive_flushing_lwm` define uma marca de água baixa para a capacidade do log de refazer. Quando esse limite é ultrapassado, o esvaziamento adaptativo é habilitado, mesmo que a variável `innodb_adaptive_flushing` esteja desativada.

O benchmarking interno mostrou que o algoritmo não só mantém o desempenho ao longo do tempo, mas também pode melhorar significativamente o desempenho geral. No entanto, o esvaziamento adaptativo pode afetar significativamente o padrão de E/S de uma carga de trabalho e pode não ser apropriado em todos os casos. Ele oferece o maior benefício quando o log de revisão está em perigo de ficar cheio. Se o esvaziamento adaptativo não for apropriado às características da sua carga de trabalho, você pode desabilitá-lo. O esvaziamento adaptativo controlado pela variável `innodb_adaptive_flushing`, que é habilitada por padrão.

`innodb_flushing_avg_loops` define o número de iterações que `InnoDB` mantém o instantâneo previamente calculado do estado de limpeza, controlando quão rapidamente a limpeza adaptativa responde às mudanças na carga de trabalho de primeiro plano. Um valor alto de `innodb_flushing_avg_loops` significa que `InnoDB` mantém o instantâneo previamente calculado por mais tempo, portanto, a limpeza adaptativa responde mais lentamente. Ao definir um valor alto, é importante garantir que a utilização do log de refazer não atinja 75% (o limite codificado em que o limpeza assíncrono começa), e que o `innodb_max_dirty_pages_pct` limite mantenha o número de páginas sujas em um nível apropriado para a carga de trabalho.

Sistemas com cargas de trabalho consistentes, um grande tamanho de arquivo de registro (`innodb_log_file_size`), e pequenos picos que não atingem 75% de utilização do espaço de registro devem usar um valor alto `innodb_flushing_avg_loops` para manter o fluxo o mais suave possível. Para sistemas com picos de carga extrema ou arquivos de registro que não fornecem muito espaço, um valor menor permite que o fluxo acompanhe de perto as mudanças na carga de trabalho e ajuda a evitar atingir a utilização de 75% do espaço de registro.

Tenha em atenção que, se o esvaziamento do buffer ficar para trás, a taxa de esvaziamento do buffer pode exceder a capacidade de E/S disponível para `InnoDB`, conforme definido pelo ajuste `innodb_io_capacity`. O valor `innodb_io_capacity_max` define um limite superior para a capacidade de E/S nessas situações, de modo que um aumento na atividade de E/S não consuma toda a capacidade de E/S do servidor.

O ajuste `innodb_io_capacity` é aplicável a todas as instâncias do pool de tampão. Quando as páginas sujas são descarregadas, a capacidade de I/O é dividida igualmente entre as instâncias do pool de tampão.

##### Limitar o esvaziamento do buffer durante períodos de inatividade

A partir do MySQL 8.0.18, você pode usar a variável `innodb_idle_flush_pct` para limitar a taxa de esvaziamento do pool de buffers durante períodos de inatividade, que são períodos de tempo em que as páginas do banco de dados não são modificadas. O valor `innodb_idle_flush_pct` é uma porcentagem do ajuste `innodb_io_capacity`, que define o número de operações de E/S por segundo disponíveis para `InnoDB`. O valor padrão `innodb_idle_flush_pct` é 100, que é 100 por cento do ajuste `innodb_io_capacity`. Para limitar o esvaziamento durante períodos de inatividade, defina um valor `innodb_idle_flush_pct` menor que 100.

Limitar o esvaziamento de páginas durante períodos de inatividade pode ajudar a prolongar a vida útil dos dispositivos de armazenamento em estado sólido. Os efeitos colaterais de limitar o esvaziamento de páginas durante períodos de inatividade podem incluir um tempo de desligamento mais longo após um longo período de inatividade e um período de recuperação mais longo em caso de falha do servidor.

#### 17.8.3.6 Salvar e restaurar o estado do pool de buffer

Para reduzir o período de aquecimento após o reinício do servidor, `InnoDB` salva uma porcentagem das páginas mais recentemente utilizadas para cada conjunto de buffers na parada do servidor e restaura essas páginas no início do servidor. A porcentagem de páginas recentemente utilizadas que é armazenada é definida pela opção de configuração `innodb_buffer_pool_dump_pct`.

Após o reinício de um servidor ocupado, normalmente há um período de aquecimento com desempenho consistentemente crescente, à medida que as páginas do disco que estavam na piscina de buffer são trazidas de volta à memória (já que os mesmos dados são consultados, atualizados, etc.). A capacidade de restaurar a piscina de buffer no início do processo encurta o período de aquecimento, recarregando as páginas do disco que estavam na piscina de buffer antes do reinício, em vez de esperar que as operações de MDO acessem as linhas correspondentes. Além disso, as solicitações de E/S podem ser realizadas em grandes lotes, tornando o E/S como um todo mais rápido. O carregamento das páginas acontece em segundo plano e não retarda o início do banco de dados.

Além de salvar o estado do buffer pool durante o desligamento e restaurá-lo durante o início, você pode salvar e restaurar o estado do buffer pool a qualquer momento, enquanto o servidor estiver em execução. Por exemplo, você pode salvar o estado do buffer pool após atingir um desempenho estável em uma carga de trabalho constante. Você também pode restaurar o estado anterior do buffer pool após executar relatórios ou trabalhos de manutenção que tragam páginas de dados para o buffer pool que são necessárias apenas para essas operações, ou após executar algum outro tipo de carga de trabalho não típico.

Embora um pool de tampão possa ter vários gigabytes de tamanho, os dados do pool de tampão que o `InnoDB` salva em disco são pequenos em comparação. Apenas os IDs de espaço de tabela e IDs de página necessários para localizar as páginas apropriadas são salvos em disco. Essas informações são derivadas da tabela `INNODB_BUFFER_PAGE_LRU` `INFORMATION_SCHEMA`. Por padrão, os dados de IDs de espaço de tabela e IDs de página são salvos em um arquivo denominado `ib_buffer_pool`, que é salvo no diretório de dados `InnoDB`. O nome do arquivo e a localização podem ser modificados usando o parâmetro de configuração `innodb_buffer_pool_filename`.

Como os dados são armazenados e descartados do buffer pool, assim como nas operações regulares do banco de dados, não há problema se as páginas do disco forem recentemente atualizadas, ou se uma operação de DML envolver dados que ainda não foram carregados. O mecanismo de carregamento ignora as páginas solicitadas que não existem mais.

O mecanismo subjacente envolve um fio de fundo que é enviado para realizar as operações de dump e carregamento.

As páginas de disco de tabelas compactadas são carregadas no pool de buffer em sua forma compactada. As páginas são descompactadas como de costume quando o conteúdo das páginas é acessado durante operações de DML. Como descompactuar páginas é um processo intensivo em CPU, é mais eficiente que a concorrência realize a operação em um thread de conexão em vez do único thread que realiza a operação de restauração do pool de buffer.

As operações relacionadas à salvação e restauração do estado do pool de buffer são descritas nos seguintes tópicos:

* Configurar a porcentagem de descarte para páginas do pool de buffer
* Salvar o estado do pool de buffer na desligada e restaurá-lo na inicialização
* Salvar e restaurar o estado do pool de buffer online
* Exibir o progresso do descarte do pool de buffer
* Exibir o progresso da carga do pool de buffer
* Abrir uma operação de carregamento do pool de buffer
* Monitorar o progresso da carga do pool de buffer usando o Schema de desempenho

##### Configurando a porcentagem de descarte para páginas do pool de buffer

Antes de descartar páginas do buffer pool, você pode configurar a porcentagem de páginas do buffer pool mais recentemente usadas que você deseja descartar, definindo a opção `innodb_buffer_pool_dump_pct`. Se você planeja descartar páginas do buffer pool enquanto o servidor estiver em execução, você pode configurar a opção dinamicamente:

```
SET GLOBAL innodb_buffer_pool_dump_pct=40;
```

Se você planeja descartar as páginas do buffer durante o desligamento do servidor, defina `innodb_buffer_pool_dump_pct` em seu arquivo de configuração.

```
[mysqld]
innodb_buffer_pool_dump_pct=40
```

O valor padrão do `innodb_buffer_pool_dump_pct` é 25 (descarte 25% das páginas mais recentemente usadas).

##### Salvar o estado do Pool de Buffer na desligada e restaurá-lo na inicialização

Para salvar o estado do pool de buffer na desativação do servidor, emita a seguinte declaração antes de desativar o servidor:

```
SET GLOBAL innodb_buffer_pool_dump_at_shutdown=ON;
```

`innodb_buffer_pool_dump_at_shutdown` é ativado por padrão.

Para restaurar o estado do pool de tampão no início da inicialização do servidor, especifique a opção `--innodb-buffer-pool-load-at-startup` ao iniciar o servidor:

```
mysqld --innodb-buffer-pool-load-at-startup=ON;
```

`innodb_buffer_pool_load_at_startup` é ativado por padrão.

##### Salvar e restaurar o estado do pool de buffer online

Para salvar o estado do pool de buffer enquanto o servidor MySQL estiver em execução, execute a seguinte instrução:

```
SET GLOBAL innodb_buffer_pool_dump_now=ON;
```

Para restaurar o estado do pool de tampão enquanto o MySQL estiver em execução, execute a seguinte instrução:

```
SET GLOBAL innodb_buffer_pool_load_now=ON;
```

##### Exibindo o progresso do descarte do pool de buffer

Para exibir o progresso ao salvar o estado do buffer no disco, execute a seguinte declaração:

```
SHOW STATUS LIKE 'Innodb_buffer_pool_dump_status';
```

Se a operação ainda não tiver começado, é retornado o valor “não iniciada”. Se a operação estiver concluída, o tempo de conclusão é impresso (por exemplo, Concluído às 11h05m 12:18:02). Se a operação estiver em andamento, são fornecidas informações de status (por exemplo, Buffer de descarte 5/7, página 237/2873).

##### Exibindo o progresso da carga do Pool de Buffer

Para exibir o progresso ao carregar o pool de buffer, execute a seguinte declaração:

```
SHOW STATUS LIKE 'Innodb_buffer_pool_load_status';
```

Se a operação ainda não tiver começado, é retornado “não iniciado”. Se a operação estiver completa, o tempo de conclusão é impresso (por exemplo, Concluído em 110505 12:23:24). Se a operação estiver em andamento, informações de status são fornecidas (por exemplo, Carregada 123/22301 páginas).

##### Abrir uma operação de carregamento de um pool de buffer

Para abortar uma operação de carga de um pool de buffer, emita a seguinte declaração:

```
SET GLOBAL innodb_buffer_pool_load_abort=ON;
```

##### Monitoramento do progresso do Pool de Buffer de Bufferamento Usando o Schema de Desempenho

Você pode monitorar o progresso da carga do pool de tampão usando o Schema de desempenho.

O exemplo a seguir demonstra como habilitar o instrumento de evento de estágio `stage/innodb/buffer pool load` e as tabelas relacionadas do consumidor para monitorar o progresso da carga do pool de tampão.

Para informações sobre os procedimentos de exclusão e carga do pool de tampão utilizados neste exemplo, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de tampão”. Para informações sobre os instrumentos de evento de estágio do Schema de desempenho e os consumidores relacionados, consulte a Seção 29.12.5, “Tabelas de evento de estágio do Schema de desempenho”.

1. Ative o instrumento `stage/innodb/buffer pool load`:

   ```
   mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/buffer%';
   ```

2. Ative as tabelas de consumo de eventos de palco, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```
   mysql> UPDATE performance_schema.setup_consumers SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   ```

3. Descarte o estado atual do pool de buffer habilitando `innodb_buffer_pool_dump_now`.

   ```
   mysql> SET GLOBAL innodb_buffer_pool_dump_now=ON;
   ```

4. Verifique o status do dump do buffer-pool para garantir que a operação tenha sido concluída.

   ```
   mysql> SHOW STATUS LIKE 'Innodb_buffer_pool_dump_status'\G
   *************************** 1. row ***************************
   Variable_name: Innodb_buffer_pool_dump_status
           Value: Buffer pool(s) dump completed at 150202 16:38:58
   ```

5. Carregue o pool de buffer habilitando `innodb_buffer_pool_load_now`:

   ```
   mysql> SET GLOBAL innodb_buffer_pool_load_now=ON;
   ```

6. Verifique o status atual da operação de carga do pool de buffers consultando a tabela do Schema de Desempenho `events_stages_current`. A coluna `WORK_COMPLETED` mostra o número de páginas do pool de buffers carregadas. A coluna `WORK_ESTIMATED` fornece uma estimativa do trabalho restante, em páginas.

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_current;
   +-------------------------------+----------------+----------------+
   | EVENT_NAME                    | WORK_COMPLETED | WORK_ESTIMATED |
   +-------------------------------+----------------+----------------+
   | stage/innodb/buffer pool load |           5353 |           7167 |
   +-------------------------------+----------------+----------------+
   ```

A tabela `events_stages_current` retorna um conjunto vazio se a operação de carga do pool de buffer tiver sido concluída. Nesse caso, você pode verificar a tabela `events_stages_history` para visualizar os dados do evento concluído. Por exemplo:

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_history;
   +-------------------------------+----------------+----------------+
   | EVENT_NAME                    | WORK_COMPLETED | WORK_ESTIMATED |
   +-------------------------------+----------------+----------------+
   | stage/innodb/buffer pool load |           7167 |           7167 |
   +-------------------------------+----------------+----------------+
   ```

Nota

Você também pode monitorar o progresso da carga do pool de buffers usando o Schema de desempenho ao carregar o pool de buffers no início usando `innodb_buffer_pool_load_at_startup`. Nesse caso, o instrumento `stage/innodb/buffer pool load` e os consumidores relacionados devem ser habilitados no início. Para mais informações, consulte a Seção 29.3, “Configuração de inicialização do Schema de desempenho”.

#### 17.8.3.7 Excluindo páginas do buffer do pool de arquivos principais

Um arquivo de núcleo registra o status e a imagem de memória de um processo em execução. Como o conjunto de buffers reside na memória principal e a imagem de memória de um processo em execução é descarregada no arquivo de núcleo, sistemas com grandes conjuntos de buffers podem produzir arquivos de núcleo grandes quando o processo **mysqld** morre.

Arquivos de núcleo grandes podem ser problemáticos por várias razões, incluindo o tempo necessário para escrevê-los, a quantidade de espaço em disco que consomem e os desafios associados à transferência de arquivos grandes.

Para reduzir o tamanho do arquivo de núcleo, você pode desabilitar a variável `innodb_buffer_pool_in_core_file` para omitir as páginas do pool de buffer dos dumps de núcleo. A variável `innodb_buffer_pool_in_core_file` foi introduzida no MySQL 8.0.14 e é ativada por padrão.

Excluir as páginas do buffer pool também pode ser desejável sob a perspectiva da segurança, se você tiver preocupações sobre o descarte de páginas do banco de dados em arquivos de núcleo que possam ser compartilhados dentro ou fora da sua organização para fins de depuração.

Nota

O acesso aos dados presentes nas páginas do buffer pool no momento em que o processo **mysqld** morreu pode ser benéfico em alguns cenários de depuração. Se tiver dúvidas sobre a inclusão ou exclusão de páginas do buffer pool, consulte o Suporte MySQL.

A desativação de `innodb_buffer_pool_in_core_file` só tem efeito se a variável `core_file` estiver habilitada e o sistema operacional suportar a extensão não POSIX `MADV_DONTDUMP` da chamada de sistema madvise(), que é suportada no Linux 3.4 e versões posteriores. A extensão `MADV_DONTDUMP` faz com que as páginas em um intervalo especificado sejam excluídas dos dumps de núcleo.

Supondo que o sistema operacional suporte a extensão `MADV_DONTDUMP`, inicie o servidor com as opções `--core-file` e `--innodb-buffer-pool-in-core-file=OFF` para gerar arquivos de núcleo sem páginas do pool de buffer.

```
$> mysqld --core-file --innodb-buffer-pool-in-core-file=OFF
```

A variável `core_file` é somente de leitura e desabilitada por padrão. Ela é habilitada especificando a opção `--core-file` no início. A variável `innodb_buffer_pool_in_core_file` é dinâmica. Ela pode ser especificada no início ou configurada no runtime usando uma declaração `SET`.

```
mysql> SET GLOBAL innodb_buffer_pool_in_core_file=OFF;
```

Se a variável `innodb_buffer_pool_in_core_file` estiver desativada, mas o `MADV_DONTDUMP` não for suportado pelo sistema operacional, ou ocorrer uma falha no `madvise()`, um aviso é escrito no log de erro do servidor MySQL e a variável `core_file` é desativada para evitar a escrita de arquivos de núcleo que, inadvertidamente, incluam páginas do pool de buffers. Se a variável `core_file` somente leitura for desativada, o servidor deve ser reiniciado para habilitá-la novamente.

A tabela a seguir mostra os cenários de configuração e suporte ao `MADV_DONTDUMP` que determinam se os arquivos principais são gerados e se incluem páginas do pool de buffer.

**Tabela 17.4 Cenários de Configuração do Arquivo Principal**

<table summary="Core file configuration and         MADV_DONTDUMP support scenarios."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 40%"/><thead><tr> <th scope="col"><code>core_file</code> variable</th> <th scope="col"><code>innodb_buffer_pool_in_core_file</code> variable</th> <th scope="col">madvise() MADV_DONTDUMP Support</th> <th scope="col">Outcome</th> </tr></thead><tbody><tr> <th scope="row">OFF (padrão)</th> <td>Não relevante para o resultado</td> <td>Não relevante para o resultado</td> <td>O arquivo principal não foi gerado</td> </tr><tr> <th scope="row">ON</th> <td>ON (padrão)</td> <td>Não relevante para o resultado</td> <td>O arquivo principal é gerado com páginas do pool de buffer</td> </tr><tr> <th scope="row">ON</th> <td>OFF</td> <td>Yes</td> <td>Core file is generated without buffer pool pages</td> </tr><tr> <th scope="row">ON</th> <td>OFF</td> <td>No</td> <td>Core file is not generated, <code>core_file</code> is disabled, and a warning is written to the server error log</td> </tr></tbody></table>

A redução no tamanho do arquivo de núcleo alcançada ao desabilitar a variável `innodb_buffer_pool_in_core_file` depende do tamanho do pool de buffers, mas também é afetada pelo tamanho da página `InnoDB`. Um tamanho de página menor significa que mais páginas são necessárias para a mesma quantidade de dados, e mais páginas significam mais metadados de página. O seguinte quadro fornece exemplos de redução de tamanho que você pode ver para um pool de buffers de 1 GB com diferentes tamanhos de páginas.

**Tabela 17.5 Tamanho do arquivo principal com páginas do pool de buffer incluídas e excluídas**

<table summary="Core file size reduction examples for different pages sizes."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col"><code>innodb_page_size</code> Setting</th> <th scope="col">Buffer Pool Pages Included (<code>innodb_buffer_pool_in_core_file=ON</code>)</th> <th scope="col">Buffer Pool Pages Excluded (<code>innodb_buffer_pool_in_core_file=OFF</code>)</th> </tr></thead><tbody><tr> <th scope="row">4KB</th> <td>2.1GB</td> <td>0.9GB</td> </tr><tr> <th scope="row">64KB</th> <td>1.7GB</td> <td>0.7GB</td> </tr></tbody></table>

### 17.8.4 Configurando Concorrência de Fuso para InnoDB

`InnoDB` utiliza threads do sistema operacional para processar solicitações de transações do usuário. (As transações podem emitir muitas solicitações para `InnoDB` antes de comprometer ou reverter.) Em sistemas operacionais e servidores modernos com processadores multicore, onde a alternância de contexto é eficiente, a maioria das cargas de trabalho funciona bem sem qualquer limite no número de threads concorrentes.

Em situações em que é útil minimizar a alternância de contexto entre os threads, `InnoDB` pode usar várias técnicas para limitar o número de threads do sistema operacional que estão executando simultaneamente (e, portanto, o número de solicitações que são processadas em qualquer momento). Quando `InnoDB` recebe uma nova solicitação de uma sessão de usuário, se o número de threads que estão executando simultaneamente estiver em um limite pré-definido, a nova solicitação dorme por um curto período de tempo antes de tentar novamente. Os threads que estão esperando por bloqueios não são contados no número de threads que estão executando simultaneamente.

Você pode limitar o número de threads concorrentes definindo o parâmetro de configuração `innodb_thread_concurrency`. Assim que o número de threads em execução atingir esse limite, as threads adicionais entram em suspensão por um número de microsegundos, definido pelo parâmetro de configuração `innodb_thread_sleep_delay`, antes de serem colocadas na fila.

Você pode definir a opção de configuração `innodb_adaptive_max_sleep_delay` para o valor máximo que você permitiria para `innodb_thread_sleep_delay`, e `InnoDB` ajusta automaticamente `innodb_thread_sleep_delay` para cima ou para baixo, dependendo da atividade atual de escalonamento de threads. Esse ajuste dinâmico ajuda o mecanismo de escalonamento de threads a funcionar de forma suave em momentos em que o sistema está levemente carregado e quando está operando próximo à capacidade máxima.

O valor padrão para `innodb_thread_concurrency` e o limite padrão implícito sobre o número de threads concorrentes foi alterado em várias versões do MySQL e `InnoDB`. O valor padrão de `innodb_thread_concurrency` é `0`, de modo que, por padrão, não há limite sobre o número de threads que estão executando simultaneamente.

`InnoDB` faz com que os threads durmam apenas quando o número de threads concorrentes é limitado. Quando não há limite no número de threads, todos competem igualmente para ser agendados. Ou seja, se `innodb_thread_concurrency` é `0`, o valor de `innodb_thread_sleep_delay` é ignorado.

Quando há um limite no número de threads (quando `innodb_thread_concurrency` é > 0), `InnoDB` reduz o custo de alternância de contexto, permitindo que múltiplos pedidos feitos durante a execução de uma única declaração SQL entrem em `InnoDB` sem observar o limite definido por `innodb_thread_concurrency`. Como uma declaração SQL (como uma junção) pode incluir múltiplas operações de linha dentro de `InnoDB`, `InnoDB` atribui um número especificado de “ingressos” que permitem que um thread seja agendado repetidamente com mínimo custo.

Quando uma nova declaração SQL começa, um fio não tem ingressos e deve observar `innodb_thread_concurrency`. Uma vez que o fio tem direito a entrar em `InnoDB`, ele recebe um número de ingressos que pode usar para entrar subsequentemente em `InnoDB` para realizar operações de linha. Se os ingressos se esgotarem, o fio é expulsado e `innodb_thread_concurrency` é observado novamente, o que pode colocar o fio de volta na fila de fios em espera de entrada primeiro/primeiro para sair. Quando o fio tem direito a entrar novamente em `InnoDB`, ingressos são atribuídos novamente. O número de ingressos atribuído é especificado pela opção global `innodb_concurrency_tickets`, que é 5000 por padrão. Um fio que está esperando por um bloqueio recebe um ingresso assim que o bloqueio se torna disponível.

Os valores corretos dessas variáveis dependem do seu ambiente e da carga de trabalho. Experimente uma série de valores diferentes para determinar qual valor funciona para suas aplicações. Antes de limitar o número de threads que executam simultaneamente, revise as opções de configuração que podem melhorar o desempenho do `InnoDB` em computadores multicore e multiprocessador, como `innodb_adaptive_hash_index`.

Para informações gerais sobre o desempenho do MySQL em relação ao tratamento de threads, consulte a Seção 7.1.12.1, “Interfaces de Conexão”.

### 17.8.5 Configurando o número de threads de E/S do InnoDB em segundo plano

`InnoDB` utiliza threads de fundo para atender vários tipos de solicitações de E/S. Você pode configurar o número de threads de fundo que atendem a solicitações de leitura e escrita de E/S em páginas de dados usando os parâmetros de configuração `innodb_read_io_threads` e `innodb_write_io_threads`. Esses parâmetros indicam o número de threads de fundo usadas para solicitações de leitura e escrita, respectivamente. Eles são eficazes em todas as plataformas suportadas. Você pode definir valores para esses parâmetros no arquivo de opção MySQL (`my.cnf` ou `my.ini`); você não pode alterar valores dinamicamente. O valor padrão desses parâmetros é `4` e os valores permitidos variam de `1-64`.

O propósito dessas opções de configuração é tornar o `InnoDB` mais escalável em sistemas de alta performance. Cada thread de fundo pode lidar com até 256 solicitações de I/O pendentes. Uma das principais fontes de I/O de fundo são as solicitações de leitura antecipada. O `InnoDB` tenta equilibrar a carga de solicitações recebidas de forma que a maioria das threads de fundo compartilhe o trabalho igualmente. O `InnoDB` também tenta alocar solicitações de leitura da mesma extensão para o mesmo thread, para aumentar as chances de coalescer as solicitações. Se você tem um subsistema de I/O de alta performance e vê mais de 64 × `innodb_read_io_threads` solicitações de leitura pendentes na saída do `SHOW ENGINE INNODB STATUS`, você pode melhorar o desempenho aumentando o valor do `innodb_read_io_threads`.

Nos sistemas Linux, `InnoDB` usa o subsistema de E/S assíncrona por padrão para realizar solicitações de leitura antecipada e escrita para páginas de arquivos de dados, o que altera a maneira como os `InnoDB` threads de segundo plano atendem a esses tipos de solicitações de E/S. Para mais informações, consulte a Seção 17.8.6, “Usando E/S Assíncrona no Linux”.

Para mais informações sobre o desempenho de E/S de `InnoDB`, consulte a Seção 10.5.8, “Otimizando o E/S de disco do InnoDB”.

### 17.8.6 Usando I/O assíncrono no Linux

`InnoDB` utiliza o subsistema de E/S assíncrono (AIO nativo) no Linux para realizar solicitações de leitura antecipada e escrita para páginas de arquivos de dados. Esse comportamento é controlado pela opção de configuração `innodb_use_native_aio`, que se aplica apenas a sistemas Linux e é ativada por padrão. Em outros sistemas similares ao Unix, `InnoDB` utiliza apenas E/S síncrona. Historicamente, `InnoDB` usava apenas E/S assíncrona em sistemas Windows. O uso do subsistema de E/S assíncrono no Linux requer a biblioteca `libaio`.

Com I/O síncrono, os threads de consulta colocam as solicitações de I/O em fila, e os threads de `InnoDB` de segundo plano recuperam as solicitações em fila uma de cada vez, emitindo uma chamada de I/O síncrono para cada uma. Quando uma solicitação de I/O é concluída e a chamada de I/O retorna, o thread de segundo plano `InnoDB` que está lidando com a solicitação chama uma rotina de conclusão de I/O e retorna para processar a próxima solicitação. O número de solicitações que podem ser processadas em paralelo é *`n`*, onde *`n`* é o número de threads de `InnoDB` de segundo plano. O número de threads de `InnoDB` de segundo plano é controlado por `innodb_read_io_threads` e `innodb_write_io_threads`. Veja a Seção 17.8.5, “Configurando o Número de Threads de I/O de InnoDB de Segundo Plano”.

Com o AIO nativo, os threads de consulta enviam solicitações de I/O diretamente ao sistema operacional, removendo assim o limite imposto pelo número de threads de segundo plano. Os threads de segundo plano aguardam por eventos de I/O para sinalizar solicitações concluídas. Quando uma solicitação é concluída, um thread de segundo plano chama uma rotina de conclusão de I/O e retoma a espera por eventos de I/O. `InnoDB`

A vantagem do AIO nativo é a escalabilidade para sistemas fortemente dependentes de I/O, que geralmente apresentam muitos leitores/escritores pendentes na saída `SHOW ENGINE INNODB STATUS\G`. O aumento do processamento paralelo ao usar o AIO nativo significa que o tipo de agendamento de I/O ou as propriedades do controlador da matriz de disco têm uma influência maior no desempenho de I/O.

Uma possível desvantagem do AIO nativo para sistemas com grande demanda de I/O é a falta de controle sobre o número de solicitações de escrita de I/O enviadas ao sistema operacional de uma vez. Em alguns casos, enviar muitas solicitações de escrita de I/O ao sistema operacional para processamento paralelo pode resultar em escassez de leitura de I/O, dependendo da quantidade de atividade de I/O e das capacidades do sistema.

Se um problema com o subsistema de E/S assíncrona no SO impedir que o `InnoDB` seja iniciado, você pode iniciar o servidor com o `innodb_use_native_aio=0`. Esta opção também pode ser desativada automaticamente durante a inicialização se o `InnoDB` detectar um problema potencial, como uma combinação de localização do `tmpdir`, sistema de arquivos do `tmpfs` e kernel Linux que não suporta E/S assíncrona no `tmpfs`.

### 17.8.7 Configurando a Capacidade de I/O do InnoDB

O fio mestre `InnoDB` e outros fios realizam várias tarefas em segundo plano, a maioria das quais está relacionada a I/O, como esvaziar páginas sujas do pool de buffer e escrever as alterações do buffer de alterações nos índices secundários apropriados. `InnoDB` tenta realizar essas tarefas de uma maneira que não afete negativamente o funcionamento normal do servidor. Ele tenta estimar a largura de banda de I/O disponível e ajustar suas atividades para aproveitar a capacidade disponível.

A variável `innodb_io_capacity` define a capacidade geral de E/S disponível para `InnoDB`. Deve ser definida aproximadamente no número de operações de E/S que o sistema pode realizar por segundo (IOPS). Quando `innodb_io_capacity` é definido, `InnoDB` estima a largura de banda de E/S disponível para tarefas de segundo plano com base no valor definido.

Você pode definir `innodb_io_capacity` para um valor de 100 ou superior. O valor padrão é `200`. Normalmente, valores em torno de 100 são apropriados para dispositivos de armazenamento de nível de consumidor, como discos rígidos de até 7200 RPM. Disco rígido mais rápido, configurações RAID e unidades de estado sólido (SSDs) se beneficiam de valores mais altos.

Idealmente, mantenha o valor o mais baixo possível, mas não tão baixo que as atividades de fundo fiquem para trás. Se o valor for muito alto, os dados são removidos do pool de buffer e o buffer de mudança é alterado muito rapidamente para que o cache forneça um benefício significativo. Para sistemas ocupados, capazes de taxas de I/O mais altas, você pode definir um valor mais alto para ajudar o servidor a lidar com o trabalho de manutenção de fundo associado a uma alta taxa de mudanças de linha. Geralmente, você pode aumentar o valor como uma função do número de unidades usadas para o I/O do `InnoDB`. Por exemplo, você pode aumentar o valor em sistemas que usam vários discos ou SSDs.

O ajuste padrão de 200 é geralmente suficiente para um SSD de menor porte. Para um SSD com conexão em bus de maior porte, considere um valor mais alto, como 1000, por exemplo. Para sistemas com unidades individuais de 5400 RPM ou 7200 RPM, você pode reduzir o valor para 100, que representa uma proporção estimada das operações de entrada/saída por segundo (IOPS) disponíveis para unidades de disco de geração mais antiga, que podem realizar cerca de 100 IOPS.

Embora você possa especificar um valor alto, como um milhão, na prática, esses valores grandes têm pouco benefício. Geralmente, um valor superior a 20.000 não é recomendado, a menos que você esteja certo de que valores menores são insuficientes para sua carga de trabalho.

Considere a carga de trabalho de escrita ao ajustar `innodb_io_capacity`. Sistemas com grande carga de trabalho de escrita provavelmente se beneficiarão de um ajuste mais alto. Um ajuste mais baixo pode ser suficiente para sistemas com uma pequena carga de trabalho de escrita.

O ajuste `innodb_io_capacity` não é um ajuste para uma instância de pool de buffers. A capacidade de E/S disponível é distribuída igualmente entre as instâncias do pool de buffers para atividades de limpeza.

Você pode definir o valor `innodb_io_capacity` no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou modificá-lo em tempo de execução usando uma declaração `SET GLOBAL`, que requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

#### Ignorar a capacidade de E/S nos pontos de verificação

A variável `innodb_flush_sync`, que é habilitada por padrão, faz com que o ajuste `innodb_io_capacity` seja ignorado durante os surtos de atividade de E/S que ocorrem em pontos de verificação. Para aderir à taxa de E/S definida pelos ajustes `innodb_io_capacity` e `innodb_io_capacity_max`, desative `innodb_flush_sync`.

Você pode definir o valor `innodb_flush_sync` no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou modificá-lo em tempo de execução usando uma declaração [`SET GLOBAL`(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")], que requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

#### Configurando um Máximo de Capacidade de Entrada/Saída

Se a atividade de limpeza ficar para trás, `InnoDB` pode realizar uma limpeza mais agressiva, com uma taxa mais alta de operações de entrada/saída por segundo (IOPS) do que a definida pela variável `innodb_io_capacity`. A variável `innodb_io_capacity_max` define um número máximo de IOPS realizadas pelas tarefas de segundo plano `InnoDB` nessas situações.

Se você especificar um ajuste `innodb_io_capacity` no início, mas não especificar um valor para `innodb_io_capacity_max`, `innodb_io_capacity_max` será definido como o dobro do valor de `innodb_io_capacity` ou 2000, dependendo do valor maior.

Ao configurar `innodb_io_capacity_max`, o dobro do `innodb_io_capacity` é frequentemente um bom ponto de partida. O valor padrão de 2000 é destinado a cargas de trabalho que utilizam um SSD ou mais de uma unidade de disco regular. Um ajuste de 2000 é provavelmente muito alto para cargas de trabalho que não utilizam SSDs ou múltiplas unidades de disco, e poderia permitir um esvaziamento excessivo. Para uma única unidade de disco regular, é recomendado um ajuste entre 20 e 400. Para um SSD de alta gama, acoplado à barra, considere um ajuste mais alto, como 2500. Como com o ajuste do `innodb_io_capacity`, mantenha o ajuste o mais baixo possível, mas não tão baixo que o `InnoDB` não possa estender suficientemente a taxa de IOPS além do ajuste do `innodb_io_capacity`.

Considere a carga de trabalho de escrita ao ajustar `innodb_io_capacity_max`. Sistemas com grande carga de trabalho de escrita podem se beneficiar de um ajuste mais alto. Um ajuste mais baixo pode ser suficiente para sistemas com uma pequena carga de trabalho de escrita.

`innodb_io_capacity_max` não pode ser definido com um valor menor que o valor `innodb_io_capacity`.

Definir `innodb_io_capacity_max` para `DEFAULT` usando uma declaração `SET` (`SET GLOBAL innodb_io_capacity_max=DEFAULT`) define `innodb_io_capacity_max` para o valor máximo.

O limite `innodb_io_capacity_max` se aplica a todas as instâncias do pool de buffers. Não é uma configuração por instância do pool de buffers.

### 17.8.8 Configurando a Pesquisa de Bloqueio Espiral

Os mutexes e bloqueios rw são, normalmente, reservados para intervalos curtos. Em um sistema multicore, pode ser mais eficiente para um thread verificar continuamente se pode adquirir um mutex ou bloqueio rw por um período de tempo antes de adormecer. Se o mutex ou bloqueio rw ficar disponível durante esse período, o thread pode continuar imediatamente, no mesmo intervalo de tempo. No entanto, a verificação frequente de um objeto compartilhado, como um mutex ou bloqueio rw, por vários threads pode causar o "ping-pong de cache", o que resulta na desativação de partes da cache de cada um dos processadores. `InnoDB` minimiza esse problema, forçando um atraso aleatório entre as verificações para des sincronizar a atividade de verificação. O atraso aleatório é implementado como um loop de espera em rotação.

A duração de um loop de espera de spin é determinada pelo número de instruções PAUSE que ocorrem no loop. Esse número é gerado selecionando aleatoriamente um número inteiro variando de 0 até, mas não incluindo, o valor `innodb_spin_wait_delay`, e multiplicando esse valor por 50. (O valor do multiplicador, 50, é hardcoded antes do MySQL 8.0.16, e configurável posteriormente.) Por exemplo, um número inteiro é selecionado aleatoriamente da seguinte faixa para um ajuste `innodb_spin_wait_delay` de 6:

```
{0,1,2,3,4,5}
```

O número inteiro selecionado é multiplicado por 50, resultando em um dos seis possíveis valores de instruções PAUSE:

```
{0,50,100,150,200,250}
```

Para esse conjunto de valores, 250 é o número máximo de instruções PAUSE que podem ocorrer em um loop de espera de rotação. Uma configuração `innodb_spin_wait_delay` de 5 resulta em um conjunto de cinco valores possíveis `{0,50,100,150,200}`, onde 200 é o número máximo de instruções PAUSE, e assim por diante. Dessa forma, a configuração `innodb_spin_wait_delay` controla o atraso máximo entre as pesquisas de bloqueio de rotação.

Em um sistema onde todos os núcleos do processador compartilham uma memória de cache rápida, você pode reduzir o atraso máximo ou desativar o loop ocupado completamente, definindo `innodb_spin_wait_delay=0`. Em um sistema com vários chips de processador, o efeito da invalidação da cache pode ser mais significativo e você pode aumentar o atraso máximo.

Na era do Pentium de 100 MHz, uma unidade `innodb_spin_wait_delay` foi calibrada para ser equivalente a um microsegundo. Esse tempo de equivalência não se manteve, mas a duração da instrução PAUSE permaneceu relativamente constante em termos de ciclos do processador em relação a outras instruções da CPU, até a introdução da geração Skylake de processadores, que têm uma instrução PAUSE comparativamente mais longa. A variável `innodb_spin_wait_pause_multiplier` foi introduzida no MySQL 8.0.16 para fornecer uma maneira de levar em conta as diferenças na duração da instrução PAUSE.

A variável `innodb_spin_wait_pause_multiplier` controla o tamanho dos valores das instruções PAUSE. Por exemplo, assumindo um ajuste `innodb_spin_wait_delay` de 6, a diminuição do valor `innodb_spin_wait_pause_multiplier` de 50 (o valor padrão e previamente codificado) para 5 gera um conjunto de valores menores para as instruções PAUSE:

```
{0,5,10,15,20,25}
```

A capacidade de aumentar ou diminuir os valores das instruções PAUSE permite o ajuste fino do `InnoDB` para diferentes arquiteturas de processador. Valores menores para as instruções PAUSE seriam apropriados para arquiteturas de processador com uma instrução PAUSE comparativamente mais longa, por exemplo.

As variáveis `innodb_spin_wait_delay` e `innodb_spin_wait_pause_multiplier` são dinâmicas. Elas podem ser especificadas em um arquivo de opção MySQL ou modificadas em tempo de execução usando uma declaração `SET GLOBAL`. A modificação das variáveis em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

### 17.8.9 Configuração de purga

`InnoDB` não remove fisicamente uma linha do banco de dados imediatamente quando você a exclui com uma declaração SQL. Uma linha e seus registros de índice são removidos fisicamente apenas quando `InnoDB` descarta o registro do log de desfazer escrito para a exclusão. Essa operação de remoção, que ocorre apenas após a linha não ser mais necessária para o controle de concorrência de múltiplas versões (MVCC) ou rollback, é chamada de purga.

A purga é executada em um cronograma periódico. Ela analisa e processa as páginas do registro de desfazer da lista de histórico, que é uma lista de páginas do registro de desfazer para transações comprometidas que é mantida pelo sistema de transação `InnoDB`. A purga libera as páginas do registro de desfazer da lista de histórico após processá-las.

#### Configurando Purgar Threads

As operações de purga são realizadas em segundo plano por um ou mais fios de purga. O número de fios de purga é controlado pela variável `innodb_purge_threads`. O valor padrão é 4.

Se a ação DML estiver concentrada em uma única tabela, as operações de purga para a tabela são realizadas por um único fio de purga, o que pode resultar em operações de purga mais lentas, aumento do atraso de purga e aumento do tamanho do arquivo de espaço de tabela, se as operações DML envolverem valores de objetos grandes. A partir do MySQL 8.0.26, se o ajuste `innodb_max_purge_lag` for excedido, o trabalho de purga é automaticamente redistribuído entre os fios de purga disponíveis. Muitas threads de purga ativas neste cenário podem causar concorrência com as threads do usuário, então gerencie o ajuste `innodb_purge_threads` de acordo. A variável `innodb_max_purge_lag` é definida como 0 por padrão, o que significa que não há atraso de purga máximo por padrão.

Se a ação DML estiver concentrada em poucas tabelas, mantenha o ajuste `innodb_purge_threads` baixo para que os threads não concorram entre si pelo acesso às tabelas ocupadas. Se as operações DML forem distribuídas em muitas tabelas, considere um ajuste `innodb_purge_threads` mais alto. O número máximo de threads de purga é de 32.

O ajuste `innodb_purge_threads` é o número máximo de threads de purga permitidas. O sistema de purga ajusta automaticamente o número de threads de purga que são utilizadas.

#### Configurando o tamanho do lote de purga

A variável `innodb_purge_batch_size` define o número de páginas do log de desfazer que limpam e processam em um lote da lista de histórico. O valor padrão é 300. Em uma configuração de purga multisseriada, o thread de purga do coordenador divide `innodb_purge_batch_size` por `innodb_purge_threads` e atribui esse número de páginas a cada thread de purga.

O sistema de purga também libera as páginas do registro de desfazer que não são mais necessárias. Isso é feito a cada 128 iterações através dos registros de desfazer. Além de definir o número de páginas do registro de desfazer analisadas e processadas em um lote, a variável `innodb_purge_batch_size` define o número de páginas do registro de desfazer que a purga libera a cada 128 iterações através dos registros de desfazer.

A variável `innodb_purge_batch_size` é destinada a ajustes avançados de desempenho e experimentação. A maioria dos usuários não precisa alterar `innodb_purge_batch_size` do seu valor padrão.

#### Configurando o Lag Máximo de Purga

A variável `innodb_max_purge_lag` define o atraso máximo de purga desejado. Quando o atraso de purga excede o limite `innodb_max_purge_lag`, um atraso é imposto nas operações de `INSERT`, `UPDATE` e `DELETE` para permitir tempo para que as operações de purga se recuperem. O valor padrão é 0, o que significa que não há atraso máximo de purga e nenhum atraso.

O sistema de transação `InnoDB` mantém uma lista de transações que possuem registros de índice marcados para exclusão por operações de `UPDATE` ou `DELETE`. O comprimento da lista é o atraso de purga. Antes do MySQL 8.0.14, o atraso do atraso de purga é calculado pela fórmula a seguir, que resulta em um atraso mínimo de 5000 microsegundos:

```
(purge lag/innodb_max_purge_lag - 0.5) * 10000
```

A partir do MySQL 8.0.14, o atraso de purga é calculado pela fórmula revisada a seguir, que reduz o atraso mínimo para 5 microsegundos. Um atraso de 5 microsegundos é mais apropriado para sistemas modernos.

```
(purge_lag/innodb_max_purge_lag - 0.9995) * 10000
```

O atraso é calculado no início de um lote de purga.

Um ajuste típico do `innodb_max_purge_lag` para uma carga de trabalho problemática pode ser 1.000.000 (1 milhão), assumindo que as transações são pequenas, com apenas 100 bytes de tamanho, e é permitido ter 100 MB de linhas de tabela não limpadas.

O atraso de purga é apresentado como o valor `History list length` na seção `TRANSACTIONS` do [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.15 SHOW ENGINE Statement") de saída.

```
mysql> SHOW ENGINE INNODB STATUS;
...
------------
TRANSACTIONS
------------
Trx id counter 0 290328385
Purge done for trx's n:o < 0 290315608 undo n:o < 0 17
History list length 20
```

O `History list length` é, normalmente, um valor baixo, geralmente inferior a alguns milhares, mas um volume de trabalho com muitas operações de escrita ou transações de longa duração pode fazer com que ele aumente, mesmo para transações que são apenas de leitura. A razão pela qual uma transação de longa duração pode fazer com que o `History list length` aumente é que, sob um nível de isolamento de leitura consistente, como o `REPEATABLE READ`, uma transação deve retornar o mesmo resultado do que quando a vista de leitura para essa transação foi criada. Consequentemente, o sistema de controle de concorrência multiversão (MVCC) `InnoDB` deve manter uma cópia dos dados no log de desfazer até que todas as transações que dependem desses dados tenham sido concluídas. Os seguintes são exemplos de transações de longa duração que podem fazer com que o `History list length` aumente:

* Uma operação de **mysqldump** que utiliza a opção `--single-transaction` enquanto há uma quantidade significativa de DML concorrente.

* Realizar uma consulta `SELECT` após desabilitar `autocommit`, e esquecer de emitir um `COMMIT` ou `ROLLBACK` explícito.

Para evitar atrasos excessivos em situações extremas, onde o atraso de purga se torna enorme, você pode limitar o atraso, definindo a variável `innodb_max_purge_lag_delay`. A variável `innodb_max_purge_lag_delay` especifica o atraso máximo em microsegundos para o atraso imposto quando o limite `innodb_max_purge_lag` é excedido. O valor especificado `innodb_max_purge_lag_delay` é um limite superior para o período de atraso calculado pela fórmula `innodb_max_purge_lag`.

#### Limpeza e anulação da truncagem de tablespace

O sistema de purga também é responsável por truncar os espaços de tabelas de desfazer. Você pode configurar a variável `innodb_purge_rseg_truncate_frequency` para controlar a frequência com que o sistema de purga procura espaços de tabelas de desfazer para truncar. Para mais informações, consulte Truncar espaços de tabelas de desfazer.

### 17.8.10 Configurando as estatísticas do otimizador para InnoDB

Esta seção descreve como configurar estatísticas de otimizador persistentes e não persistentes para as tabelas `InnoDB`.

As estatísticas de otimizador persistentes são mantidas mesmo após o reinício do servidor, permitindo maior estabilidade do plano e desempenho mais consistente das consultas. As estatísticas de otimizador persistentes também oferecem controle e flexibilidade com esses benefícios adicionais:

* Você pode usar a opção de configuração `innodb_stats_auto_recalc` para controlar se as estatísticas são atualizadas automaticamente após alterações substanciais em uma tabela.

* Você pode usar as cláusulas `STATS_PERSISTENT`, `STATS_AUTO_RECALC` e `STATS_SAMPLE_PAGES` com as declarações `CREATE TABLE` e `ALTER TABLE` para configurar estatísticas do otimizador para tabelas individuais.

* Você pode consultar dados de estatísticas do otimizador nas tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats`.

* Você pode visualizar a coluna `last_update` das tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats` para ver quando as estatísticas foram atualizadas pela última vez.

* Você pode modificar manualmente as tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats` para forçar um plano de otimização de consulta específica ou para testar planos alternativos sem modificar o banco de dados.

A função de estatísticas otimizador persistente é ativada por padrão (`innodb_stats_persistent=ON`).

As estatísticas de otimizador não persistentes são apagadas em cada reinício do servidor e após algumas outras operações, e recomputadas na próxima consulta à tabela. Como resultado, diferentes estimativas podem ser produzidas ao recomputar as estatísticas, levando a diferentes escolhas nos planos de execução e variações no desempenho das consultas.

Esta seção também fornece informações sobre a estimativa da complexidade do `ANALYZE TABLE`, o que pode ser útil ao tentar alcançar um equilíbrio entre estatísticas precisas e o tempo de execução do `ANALYZE TABLE`.

#### 17.8.10.1 Configurando Parâmetros de Estatísticas de Otimizador Persistente

O recurso de otimização persistente de estatísticas melhora a estabilidade do plano ao armazenar estatísticas em disco e torná-las persistentes em caso de reinício do servidor, de modo que o otimizador tenha mais probabilidade de tomar escolhas consistentes cada vez para uma consulta específica.

As estatísticas do otimizador são persistidas no disco quando `innodb_stats_persistent=ON` ou quando tabelas individuais são definidas com `STATS_PERSISTENT=1`. `innodb_stats_persistent` é habilitado por padrão.

Anteriormente, as estatísticas do otimizador eram limpas ao reiniciar o servidor e após alguns outros tipos de operações, e recomportadas no próximo acesso à tabela. Consequentemente, diferentes estimativas poderiam ser produzidas ao recalcular as estatísticas, o que levava a diferentes escolhas nos planos de execução de consultas e variação no desempenho das consultas.

Estatísticas persistentes são armazenadas nas tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats`. Veja a Seção 17.8.10.1.5, “Tabelas de Estatísticas P persistentes do InnoDB”.

Se você preferir não persistir as estatísticas do otimizador no disco, consulte a Seção 17.8.10.2, “Configurando Parâmetros de Estatísticas de Otimizador Não Persistente”.

##### 17.8.10.1.1 Configurando o cálculo automático de estatísticas para estatísticas de otimizador persistente

A variável `innodb_stats_auto_recalc`, que é ativada por padrão, controla se as estatísticas são calculadas automaticamente quando uma tabela sofre alterações em mais de 10% de suas linhas. Você também pode configurar a recálculo automático das estatísticas para tabelas individuais, especificando a cláusula `STATS_AUTO_RECALC` ao criar ou alterar uma tabela.

Devido à natureza assíncrona da recálculo automático das estatísticas, que ocorre em segundo plano, as estatísticas podem não ser recálculado instantaneamente após a execução de uma operação de DML que afeta mais de 10% de uma tabela, mesmo quando o `innodb_stats_auto_recalc` está habilitado. A recálculo das estatísticas pode ser adiado por alguns segundos em alguns casos. Se estatísticas atualizadas são necessárias imediatamente, execute o `ANALYZE TABLE` para iniciar um recálculo síncrono (em primeiro plano) das estatísticas.

Se o `innodb_stats_auto_recalc` estiver desativado, você pode garantir a precisão das estatísticas do otimizador executando a declaração `ANALYZE TABLE`(analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") após fazer alterações substanciais nas colunas indexadas. Você também pode considerar adicionar o `ANALYZE TABLE` aos scripts de configuração que você executa após carregar os dados e executar o `ANALYZE TABLE` em um cronograma em momentos de baixa atividade.

Quando um índice é adicionado a uma tabela existente, ou quando uma coluna é adicionada ou excluída, as estatísticas do índice são calculadas e adicionadas à tabela `innodb_index_stats`, independentemente do valor de `innodb_stats_auto_recalc`.

##### 17.8.10.1.2 Configurando parâmetros de estatísticas do otimizador para tabelas individuais

`innodb_stats_persistent`, `innodb_stats_auto_recalc` e `innodb_stats_persistent_sample_pages` são variáveis globais. Para substituir essas configurações em todo o sistema e configurar os parâmetros de estatísticas do otimizador para tabelas individuais, você pode definir as cláusulas `STATS_PERSISTENT`, `STATS_AUTO_RECALC` e `STATS_SAMPLE_PAGES` nas declarações de `CREATE TABLE` ou `ALTER TABLE`.

* `STATS_PERSISTENT` especifica se deve habilitar as estatísticas persistentes (glossary.html#glos_persistent_statistics "persistent statistics") para uma tabela `InnoDB`. O valor `DEFAULT` faz com que o ajuste das estatísticas persistentes para a tabela seja determinado pelo ajuste `innodb_stats_persistent`. Um valor de `1` habilita as estatísticas persistentes para a tabela, enquanto um valor de `0` desativa o recurso. Após habilitar as estatísticas persistentes para uma tabela individual, use `ANALYZE TABLE` para calcular estatísticas após o carregamento dos dados da tabela.

* `STATS_AUTO_RECALC` especifica se a estatística persistente deve ser recalculada automaticamente (glossary.html#glos_persistent_statistics "persistent statistics"). O valor `DEFAULT` faz com que a configuração da estatística persistente para a tabela seja determinada pela configuração do `innodb_stats_auto_recalc`. Um valor de `1` faz com que as estatísticas sejam recalculadas quando 10% dos dados da tabela forem alterados. Um valor `0` impede a recálculo automático para a tabela. Ao usar um valor de 0, use `ANALYZE TABLE` para recálculo de estatísticas após fazer alterações substanciais na tabela.

* `STATS_SAMPLE_PAGES` especifica o número de páginas de índice a serem amostradas quando a cardinalidade e outras estatísticas são calculadas para uma coluna indexada, por exemplo, por meio de uma operação `ANALYZE TABLE`.

Todas as três cláusulas são especificadas no seguinte exemplo `CREATE TABLE`:

```
CREATE TABLE `t1` (
`id` int(8) NOT NULL auto_increment,
`data` varchar(255),
`date` datetime,
PRIMARY KEY  (`id`),
INDEX `DATE_IX` (`date`)
) ENGINE=InnoDB,
  STATS_PERSISTENT=1,
  STATS_AUTO_RECALC=1,
  STATS_SAMPLE_PAGES=25;
```

##### 17.8.10.1.3 Configurando o Número de Páginas Amostradas para Estatísticas do Optimizer InnoDB

O otimizador usa estatísticas estimadas sobre as distribuições de chaves para escolher os índices para um plano de execução, com base na seletividade relativa do índice. Operações como `ANALYZE TABLE`(analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") fazem com que `InnoDB` amostra páginas aleatórias de cada índice em uma tabela para estimar a cardinalidade do índice. Essa técnica de amostragem é conhecida como mergulho aleatório.

O `innodb_stats_persistent_sample_pages` controla o número de páginas amostradas. Você pode ajustar a configuração no momento da execução para gerenciar a qualidade das estimativas de estatísticas usadas pelo otimizador. O valor padrão é 20. Considere modificar a configuração quando encontrar os seguintes problemas:

1. *As estatísticas não são suficientemente precisas e o otimizador escolhe planos subótimos*, conforme mostrado na saída de `EXPLAIN`. Você pode verificar a precisão das estatísticas comparando a cardinalidade real de um índice (determinada ao executar `SELECT DISTINCT` sobre as colunas do índice) com as estimativas na tabela `mysql.innodb_index_stats`.

Se for determinado que as estatísticas não são suficientemente precisas, o valor de `innodb_stats_persistent_sample_pages` deve ser aumentado até que as estimativas das estatísticas sejam suficientemente precisas. No entanto, aumentar o `innodb_stats_persistent_sample_pages` demais pode fazer com que `ANALYZE TABLE` execute lentamente.

2. *`ANALYZE TABLE` é muito lento*. Neste caso, `innodb_stats_persistent_sample_pages` deve ser reduzido até que o tempo de execução de [`ANALYZE TABLE`(analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") seja aceitável. No entanto, reduzir o valor demais pode levar ao primeiro problema de estatísticas imprecisas e planos de execução de consulta subótimos.

Se não for possível alcançar um equilíbrio entre estatísticas precisas e o tempo de execução de `ANALYZE TABLE`(analyze-table.html "15.7.3.1 ANALYZE TABLE Statement"), considere diminuir o número de colunas indexadas na tabela ou limitar o número de partições para reduzir a complexidade de `ANALYZE TABLE`. O número de colunas na chave primária da tabela também é importante considerar, pois as colunas da chave primária são anexadas a cada índice não exclusivo.

Para informações relacionadas, consulte a Seção 17.8.10.3, “Estimativa da complexidade da tabela ANALYZE para tabelas InnoDB”.

##### 17.8.10.1.4 Inclusão de registros marcados como excluídos em cálculos de estatísticas persistentes

Por padrão, `InnoDB` lê dados não comprometidos ao calcular estatísticas. No caso de uma transação não comprometida que exclui linhas de uma tabela, os registros marcados para exclusão são excluídos ao calcular estimativas de linha e estatísticas de índice, o que pode levar a planos de execução não ótimos para outras transações que operam na tabela simultaneamente usando um nível de isolamento de transação diferente de `READ UNCOMMITTED`. Para evitar esse cenário, `innodb_stats_include_delete_marked` pode ser habilitado para garantir que os registros marcados para exclusão sejam incluídos ao calcular estatísticas de otimizador persistentes.

Quando o `innodb_stats_include_delete_marked` está habilitado, o `ANALYZE TABLE` considera os registros marcados para exclusão ao recalcular as estatísticas.

`innodb_stats_include_delete_marked` é um ajuste global que afeta todas as tabelas `InnoDB`, e só é aplicável às estatísticas de otimizador persistentes.

##### 17.8.10.1.5 Tabelas de estatísticas persistentes do InnoDB

O recurso de estatísticas persistentes depende das tabelas gerenciadas internamente no banco de dados `mysql`, nomeadas `innodb_table_stats` e `innodb_index_stats`. Essas tabelas são configuradas automaticamente em todos os procedimentos de instalação, atualização e construção a partir de fonte.

**Tabela 17.6 Colunas de innodb_table_stats**

<table summary="Columns of the mysql.innodb_table_stats table."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Column name</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>database_name</code></td> <td>Nome do banco de dados</td> </tr><tr> <td><code>table_name</code></td> <td>Nome da tabela, nome da partição ou nome da subpartição</td> </tr><tr> <td><code>last_update</code></td> <td>Um marcador de tempo que indica a última vez que<code>InnoDB</code>atualizada esta linha</td> </tr><tr> <td><code>n_rows</code></td> <td>O número de linhas na tabela</td> </tr><tr> <td><code>clustered_index_size</code></td> <td>O tamanho do índice principal, em páginas</td> </tr><tr> <td><code>sum_of_other_index_sizes</code></td> <td>O tamanho total de outros índices (não primários), em páginas</td> </tr></tbody></table>

**Tabela 17.7 Colunas de innodb_index_stats**

<table summary="Columns of the mysql.innodb_index_stats table."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Column name</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>database_name</code></td> <td>Nome do banco de dados</td> </tr><tr> <td><code>table_name</code></td> <td>Nome da tabela, nome da partição ou nome da subpartição</td> </tr><tr> <td><code>index_name</code></td> <td>Nome do índice</td> </tr><tr> <td><code>last_update</code></td> <td>Um marcador de tempo que indica a última vez que a linha foi atualizada</td> </tr><tr> <td><code>stat_name</code></td> <td>O nome da estatística, cujo valor é relatado no<code>stat_value</code>coluna</td> </tr><tr> <td><code>stat_value</code></td> <td>O valor da estatística que é nomeada em<code>stat_name</code>coluna</td> </tr><tr> <td><code>sample_size</code></td> <td>O número de páginas amostradas para a estimativa fornecida no<code>stat_value</code>coluna</td> </tr><tr> <td><code>stat_description</code></td> <td>Descrição da estatística que é nomeada no<code>stat_name</code>coluna</td> </tr></tbody></table>

As tabelas `innodb_table_stats` e `innodb_index_stats` incluem uma coluna `last_update` que mostra quando as estatísticas do índice foram atualizadas pela última vez:

```
mysql> SELECT * FROM innodb_table_stats \G
*************************** 1. row ***************************
           database_name: sakila
              table_name: actor
             last_update: 2014-05-28 16:16:44
                  n_rows: 200
    clustered_index_size: 1
sum_of_other_index_sizes: 1
...
```

```
mysql> SELECT * FROM innodb_index_stats \G
*************************** 1. row ***************************
   database_name: sakila
      table_name: actor
      index_name: PRIMARY
     last_update: 2014-05-28 16:16:44
       stat_name: n_diff_pfx01
      stat_value: 200
     sample_size: 1
     ...
```

As tabelas `innodb_table_stats` e `innodb_index_stats` podem ser atualizadas manualmente, o que permite forçar um plano de otimização de consulta específica ou testar planos alternativos sem modificar o banco de dados. Se você atualizar manualmente as estatísticas, use a declaração `FLUSH TABLE tbl_name` para carregar as estatísticas atualizadas.

As estatísticas persistentes são consideradas informações locais, porque elas se relacionam à instância do servidor. As tabelas `innodb_table_stats` e `innodb_index_stats` não são, portanto, replicadas quando a recálculo automático das estatísticas ocorre. Se você executar `ANALYZE TABLE` para iniciar um recálculo sincronizado das estatísticas, a declaração é replicada (a menos que você tenha suprimido o registro para ela), e o recálculo ocorre nas réplicas.

##### 17.8.10.1.6 Tabelas de estatísticas persistentes do InnoDB Exemplo

A tabela `innodb_table_stats` contém uma linha para cada tabela. O exemplo a seguir demonstra o tipo de dados coletados.

A tabela `t1` contém um índice primário (colunas `a`, `b`) e um índice secundário (colunas `c`, `d`), além de um índice exclusivo (colunas `e`, `f`):

```
CREATE TABLE t1 (
a INT, b INT, c INT, d INT, e INT, f INT,
PRIMARY KEY (a, b), KEY i1 (c, d), UNIQUE KEY i2uniq (e, f)
) ENGINE=INNODB;
```

Após inserir cinco linhas de dados de amostra, a tabela `t1` aparece da seguinte forma:

```
mysql> SELECT * FROM t1;
+---+---+------+------+------+------+
| a | b | c    | d    | e    | f    |
+---+---+------+------+------+------+
| 1 | 1 |   10 |   11 |  100 |  101 |
| 1 | 2 |   10 |   11 |  200 |  102 |
| 1 | 3 |   10 |   11 |  100 |  103 |
| 1 | 4 |   10 |   12 |  200 |  104 |
| 1 | 5 |   10 |   12 |  100 |  105 |
+---+---+------+------+------+------+
```

Para atualizar imediatamente as estatísticas, execute `ANALYZE TABLE` (se `innodb_stats_auto_recalc` estiver habilitado, as estatísticas são atualizadas automaticamente em poucos segundos, assumindo que o limite de 10% para linhas de tabela alteradas é atingido):

```
mysql> ANALYZE TABLE t1;
+---------+---------+----------+----------+
| Table   | Op      | Msg_type | Msg_text |
+---------+---------+----------+----------+
| test.t1 | analyze | status   | OK       |
+---------+---------+----------+----------+
```

As estatísticas da tabela para a tabela `t1` mostram a última vez que `InnoDB` atualizou as estatísticas da tabela (`2014-03-14 14:36:34`), o número de linhas na tabela (`5`), o tamanho do índice agrupado (`1` páginas) e o tamanho combinado dos outros índices (`2` páginas).

```
mysql> SELECT * FROM mysql.innodb_table_stats WHERE table_name like 't1'\G
*************************** 1. row ***************************
           database_name: test
              table_name: t1
             last_update: 2014-03-14 14:36:34
                  n_rows: 5
    clustered_index_size: 1
sum_of_other_index_sizes: 2
```

A tabela `innodb_index_stats` contém várias linhas para cada índice. Cada linha na tabela `innodb_index_stats` fornece dados relacionados a uma estatística de índice específica, que é nomeada na coluna `stat_name` e descrita na coluna `stat_description`. Por exemplo:

```
mysql> SELECT index_name, stat_name, stat_value, stat_description
       FROM mysql.innodb_index_stats WHERE table_name like 't1';
+------------+--------------+------------+-----------------------------------+
| index_name | stat_name    | stat_value | stat_description                  |
+------------+--------------+------------+-----------------------------------+
| PRIMARY    | n_diff_pfx01 |          1 | a                                 |
| PRIMARY    | n_diff_pfx02 |          5 | a,b                               |
| PRIMARY    | n_leaf_pages |          1 | Number of leaf pages in the index |
| PRIMARY    | size         |          1 | Number of pages in the index      |
| i1         | n_diff_pfx01 |          1 | c                                 |
| i1         | n_diff_pfx02 |          2 | c,d                               |
| i1         | n_diff_pfx03 |          2 | c,d,a                             |
| i1         | n_diff_pfx04 |          5 | c,d,a,b                           |
| i1         | n_leaf_pages |          1 | Number of leaf pages in the index |
| i1         | size         |          1 | Number of pages in the index      |
| i2uniq     | n_diff_pfx01 |          2 | e                                 |
| i2uniq     | n_diff_pfx02 |          5 | e,f                               |
| i2uniq     | n_leaf_pages |          1 | Number of leaf pages in the index |
| i2uniq     | size         |          1 | Number of pages in the index      |
+------------+--------------+------------+-----------------------------------+
```

A coluna `stat_name` exibe os seguintes tipos de estatísticas:

* `size`: Onde `stat_name`=`size`, a coluna `stat_value` exibe o número total de páginas no índice.

* `n_leaf_pages`: Onde `stat_name`=`n_leaf_pages`, a coluna `stat_value` exibe o número de páginas de folha no índice.

* `n_diff_pfxNN`: Onde `stat_name`=`n_diff_pfx01`, a coluna `stat_value` exibe o número de valores distintos na primeira coluna do índice. Onde `stat_name`=`n_diff_pfx02`, a coluna `stat_value` exibe o número de valores distintos nas duas primeiras colunas do índice, e assim por diante. Onde `stat_name`=`n_diff_pfxNN`, a coluna `stat_description` exibe uma lista separada por vírgula das colunas do índice que são contadas.

Para ilustrar ainda mais a estatística `n_diff_pfxNN`, que fornece dados de cardinalidade, considere novamente o exemplo da tabela `t1` que foi introduzido anteriormente. Como mostrado abaixo, a tabela `t1` é criada com um índice primário (colunas `a`, `b`), um índice secundário (colunas `c`, `d`) e um índice único (colunas `e`, `f`):

```
CREATE TABLE t1 (
  a INT, b INT, c INT, d INT, e INT, f INT,
  PRIMARY KEY (a, b), KEY i1 (c, d), UNIQUE KEY i2uniq (e, f)
) ENGINE=INNODB;
```

Após inserir cinco linhas de dados de amostra, a tabela `t1` aparece da seguinte forma:

```
mysql> SELECT * FROM t1;
+---+---+------+------+------+------+
| a | b | c    | d    | e    | f    |
+---+---+------+------+------+------+
| 1 | 1 |   10 |   11 |  100 |  101 |
| 1 | 2 |   10 |   11 |  200 |  102 |
| 1 | 3 |   10 |   11 |  100 |  103 |
| 1 | 4 |   10 |   12 |  200 |  104 |
| 1 | 5 |   10 |   12 |  100 |  105 |
+---+---+------+------+------+------+
```

Quando você consulta os `index_name`, `stat_name`, `stat_value` e `stat_description`, onde `stat_name LIKE 'n_diff%'`, o seguinte conjunto de resultados é retornado:

```
mysql> SELECT index_name, stat_name, stat_value, stat_description
       FROM mysql.innodb_index_stats
       WHERE table_name like 't1' AND stat_name LIKE 'n_diff%';
+------------+--------------+------------+------------------+
| index_name | stat_name    | stat_value | stat_description |
+------------+--------------+------------+------------------+
| PRIMARY    | n_diff_pfx01 |          1 | a                |
| PRIMARY    | n_diff_pfx02 |          5 | a,b              |
| i1         | n_diff_pfx01 |          1 | c                |
| i1         | n_diff_pfx02 |          2 | c,d              |
| i1         | n_diff_pfx03 |          2 | c,d,a            |
| i1         | n_diff_pfx04 |          5 | c,d,a,b          |
| i2uniq     | n_diff_pfx01 |          2 | e                |
| i2uniq     | n_diff_pfx02 |          5 | e,f              |
+------------+--------------+------------+------------------+
```

Para o índice `PRIMARY`, há duas linhas `n_diff%`. O número de linhas é igual ao número de colunas no índice.

Nota

Para índices não únicos, `InnoDB` adiciona as colunas da chave primária.

* Onde `index_name`=`PRIMARY` e `stat_name`=`n_diff_pfx01`, o `stat_value` é `1`, o que indica que há um único valor distinto na primeira coluna do índice (coluna `a`). O número de valores distintos na coluna `a` é confirmado ao visualizar os dados na coluna `a` da tabela `t1`, na qual há um único valor distinto (`1`). A coluna contada (`a`) é mostrada na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`PRIMARY` e `stat_name`=`n_diff_pfx02`, o `stat_value` é `5`, o que indica que há cinco valores distintos nas duas colunas do índice (`a,b`). O número de valores distintos nas colunas `a` e `b` é confirmado ao visualizar os dados nas colunas `a` e `b` na tabela `t1`, na qual há cinco valores distintos: (`1,1`), (`1,2`), (`1,3`), (`1,4`) e (`1,5`). As colunas contadas (`a,b`) são mostradas na coluna `stat_description` do conjunto de resultados.

Para o índice secundário (`i1`), há quatro linhas `n_diff%`. Apenas duas colunas são definidas para o índice secundário (`c,d`) mas há quatro linhas `n_diff%` para o índice secundário porque `InnoDB` sufixa todos os índices não únicos com a chave primária. Como resultado, há quatro linhas `n_diff%` em vez de duas para contabilizar tanto as colunas do índice secundário (`c,d`) quanto as colunas da chave primária (`a,b`).

* Onde `index_name`=`i1` e `stat_name`=`n_diff_pfx01`, o `stat_value` é `1`, o que indica que há um único valor distinto na primeira coluna do índice (coluna `c`). O número de valores distintos na coluna `c` é confirmado ao visualizar os dados na coluna `c` da tabela `t1`, na qual há um único valor distinto: (`10`). A coluna contada (`c`) é mostrada na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`i1` e `stat_name`=`n_diff_pfx02`, o `stat_value` é `2`, o que indica que há dois valores distintos nas duas primeiras colunas do índice (`c,d`). O número de valores distintos nas colunas `c` e `d` é confirmado ao visualizar os dados nas colunas `c` e `d` na tabela `t1`, na qual há dois valores distintos: (`10,11`) e (`10,12`). As colunas contadas (`c,d`) são mostradas na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`i1` e `stat_name`=`n_diff_pfx03`, o `stat_value` é `2`, o que indica que há dois valores distintos nas três primeiras colunas do índice (`c,d,a`). O número de valores distintos nas colunas `c`, `d`, e `a` é confirmado ao visualizar os dados na coluna `c`, `d`, e `a` na tabela `t1`, na qual há dois valores distintos: (`10,11,1`) e (`10,12,1`). As colunas contadas (`c,d,a`) são mostradas na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`i1` e `stat_name`=`n_diff_pfx04`, o `stat_value` é `5`, o que indica que há cinco valores distintos nas quatro colunas do índice (`c,d,a,b`). O número de valores distintos nas colunas `c`, `d`, `a` e `b` é confirmado ao visualizar os dados nas colunas `c`, `d`, `a` e `b` na tabela `t1`, na qual há cinco valores distintos: (`10,11,1,1`), (`10,11,1,2`), (`10,11,1,3`), (`10,12,1,4`), e (`10,12,1,5`). As colunas contadas (`c,d,a,b`) são mostradas na coluna `stat_description` do conjunto de resultados.

Para o índice único (`i2uniq`), há duas linhas `n_diff%`.

* Onde `index_name`=`i2uniq` e `stat_name`=`n_diff_pfx01`, o `stat_value` é `2`, o que indica que há dois valores distintos na primeira coluna do índice (coluna `e`). O número de valores distintos na coluna `e` é confirmado ao visualizar os dados na coluna `e` da tabela `t1`, na qual há dois valores distintos: (`100`) e (`200`). A coluna contada (`e`) é mostrada na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`i2uniq` e `stat_name`=`n_diff_pfx02`, o `stat_value` é `5`, o que indica que há cinco valores distintos nas duas colunas do índice (`e,f`). O número de valores distintos nas colunas `e` e `f` é confirmado ao visualizar os dados nas colunas `e` e `f` na tabela `t1`, na qual há cinco valores distintos: (`100,101`), (`200,102`), (`100,103`), (`200,104`), e (`100,105`). As colunas contadas (`e,f`) são mostradas na coluna `stat_description` do conjunto de resultados.

##### 17.8.10.1.7 Recuperação do tamanho do índice usando a tabela innodb_index_stats

Você pode recuperar o tamanho do índice para tabelas, partições ou subpartições usando a tabela `innodb_index_stats`. No exemplo a seguir, os tamanhos dos índices são recuperados para a tabela `t1`. Para uma definição da tabela `t1` e estatísticas de índice correspondentes, consulte a Seção 17.8.10.1.6, “Exemplo de tabelas de estatísticas persistentes InnoDB”.

```
mysql> SELECT SUM(stat_value) pages, index_name,
       SUM(stat_value)*@@innodb_page_size size
       FROM mysql.innodb_index_stats WHERE table_name='t1'
       AND stat_name = 'size' GROUP BY index_name;
+-------+------------+-------+
| pages | index_name | size  |
+-------+------------+-------+
|     1 | PRIMARY    | 16384 |
|     1 | i1         | 16384 |
|     1 | i2uniq     | 16384 |
+-------+------------+-------+
```

Para partições ou subpartições, você pode usar a mesma consulta com uma cláusula modificada `WHERE` para recuperar os tamanhos dos índices. Por exemplo, a consulta a seguir recupera os tamanhos dos índices para as partições da tabela `t1`:

```
mysql> SELECT SUM(stat_value) pages, index_name,
       SUM(stat_value)*@@innodb_page_size size
       FROM mysql.innodb_index_stats WHERE table_name like 't1#P%'
       AND stat_name = 'size' GROUP BY index_name;
```

#### 17.8.10.2 Configurando Parâmetros de Estatísticas de Otimizador Não Persistente

Esta seção descreve como configurar estatísticas de otimizador não persistentes. As estatísticas do otimizador não são armazenadas em disco quando `innodb_stats_persistent=OFF` ou quando tabelas individuais são criadas ou alteradas com `STATS_PERSISTENT=0`. Em vez disso, as estatísticas são armazenadas na memória e são perdidas quando o servidor é desligado. As estatísticas também são atualizadas periodicamente por certas operações e sob certas condições.

As estatísticas do otimizador são persistidas no disco por padrão, habilitadas pela opção de configuração `innodb_stats_persistent`. Para informações sobre estatísticas de otimizador persistidas, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistidas”.

##### Atualizações de estatísticas do otimizador

As estatísticas do otimizador não persistentes são atualizadas quando:

* Executando `ANALYZE TABLE`. * Executando `SHOW TABLE STATUS`, `SHOW INDEX` ou consultando os esquemas de informação `TABLES` ou `STATISTICS` com a opção `innodb_stats_on_metadata` habilitada.

A configuração padrão para `innodb_stats_on_metadata` é `OFF`. Ativação de `innodb_stats_on_metadata` pode reduzir a velocidade de acesso para esquemas que têm um grande número de tabelas ou índices, e reduzir a estabilidade dos planos de execução para consultas que envolvem tabelas de `InnoDB`. `innodb_stats_on_metadata` é configurado globalmente usando uma declaração de `SET`.

  ```
  SET GLOBAL innodb_stats_on_metadata=ON
  ```

Nota

`innodb_stats_on_metadata` só se aplica quando as estatísticas do otimizador são configuradas para não serem persistentes (quando `innodb_stats_persistent` está desativado).

* Iniciar um cliente **mysql** com a opção `--auto-rehash` habilitada, que é a opção padrão. A opção `auto-rehash` faz com que todas as tabelas `InnoDB` sejam abertas e as operações de tabela abertas fazem com que as estatísticas sejam recalculadas.

Para melhorar o tempo de inicialização do cliente **mysql** e para atualizar as estatísticas, você pode desativar `auto-rehash` usando a opção `--disable-auto-rehash`. O recurso `auto-rehash` permite a conclusão automática de nomes de banco de dados, tabelas e colunas para usuários interativos.

* Uma tabela é aberta primeiro. * `InnoDB` detecta que 1/16 da tabela foi modificada desde a última vez que as estatísticas foram atualizadas.

##### Configurando o número de páginas amostradas

O otimizador de consultas do MySQL usa estatísticas estimadas sobre as distribuições de chaves para escolher os índices para um plano de execução, com base na seletividade relativa do índice. Quando o `InnoDB` atualiza as estatísticas do otimizador, ele amostra páginas aleatórias de cada índice em uma tabela para estimar a cardinalidade do índice. (Essa técnica é conhecida como mergulhos aleatórios.)

Para lhe dar controle sobre a qualidade da estimativa estatística (e, assim, melhores informações para o otimizador de consulta), você pode alterar o número de páginas amostradas usando o parâmetro `innodb_stats_transient_sample_pages`. O número padrão de páginas amostradas é 8, o que pode ser insuficiente para produzir uma estimativa precisa, levando a escolhas de índice ruins pelo otimizador de consulta. Essa técnica é especialmente importante para tabelas grandes e tabelas usadas em junções. Escaneios completos de tabela desnecessários para tais tabelas podem ser um problema de desempenho substancial. Consulte a Seção 10.2.1.23, “Evitando Escaneios Completos de Tabela”, para dicas sobre o ajuste de tais consultas. `innodb_stats_transient_sample_pages` é um parâmetro global que pode ser definido em tempo de execução.

O valor de `innodb_stats_transient_sample_pages` afeta a amostragem do índice para todas as tabelas e índices `InnoDB` quando `innodb_stats_persistent=0`. Esteja ciente dos seguintes impactos potencialmente significativos ao alterar o tamanho da amostra do índice:

Valores pequenos, como 1 ou 2, podem resultar em estimativas imprecisas de cardinalidade.

* Aumentar o valor de `innodb_stats_transient_sample_pages` pode exigir mais leituras de disco. Valores muito maiores que 8 (digamos, 100) podem causar um atraso significativo no tempo necessário para abrir uma tabela ou executar `SHOW TABLE STATUS`.

* O otimizador pode escolher planos de consulta muito diferentes com base em diferentes estimativas de seletividade do índice.

Qualquer valor de `innodb_stats_transient_sample_pages` que funcione melhor para um sistema, defina a opção e deixe-a nesse valor. Escolha um valor que resulte em estimativas razoavelmente precisas para todas as tabelas do seu banco de dados, sem exigir I/O excessivo. Como as estatísticas são recalculadas automaticamente em vários momentos, além da execução de `ANALYZE TABLE`, não faz sentido aumentar o tamanho da amostra do índice, executar `ANALYZE TABLE`, e depois diminuir o tamanho da amostra novamente.

Tabelas menores geralmente exigem menos amostras de índice do que tabelas maiores. Se o seu banco de dados tiver muitas tabelas grandes, considere usar um valor maior para `innodb_stats_transient_sample_pages` do que se você tiver principalmente tabelas menores.

#### 17.8.10.3 Estimação da complexidade da Tabela ANALYZE para tabelas InnoDB

A complexidade para as tabelas `ANALYZE TABLE` para `InnoDB` depende de:

* O número de páginas amostradas, conforme definido por `innodb_stats_persistent_sample_pages`.

* O número de colunas indexadas em uma tabela; * O número de partições. Se uma tabela não tiver partições, o número de partições é considerado como 1.

Usando esses parâmetros, uma fórmula aproximada para estimar a complexidade do `ANALYZE TABLE` seria:

O valor de `innodb_stats_persistent_sample_pages` * número de colunas indexadas em uma tabela * número de partições

Normalmente, quanto maior o valor resultante, maior o tempo de execução para `ANALYZE TABLE`.

Nota

`innodb_stats_persistent_sample_pages` define o número de páginas amostradas em nível global. Para definir o número de páginas amostradas para uma tabela individual, use a opção `STATS_SAMPLE_PAGES` com `CREATE TABLE` ou `ALTER TABLE`. Para mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”.

Se `innodb_stats_persistent=OFF`, o número de páginas amostradas é definido por `innodb_stats_transient_sample_pages`. Consulte a Seção 17.8.10.2, “Configurando Parâmetros de Estatísticas de Otimizador Não Persistente”, para obter informações adicionais.

Para uma abordagem mais aprofundada na estimativa da complexidade do `ANALYZE TABLE`, considere o exemplo a seguir.

Na notação de [Big O][(http://en.wikipedia.org/wiki/Big_O_notation)], a complexidade é descrita como em `ANALYZE TABLE`.

```
 O(n_sample
  * (n_cols_in_uniq_i
     + n_cols_in_non_uniq_i
     + n_cols_in_pk * (1 + n_non_uniq_i))
  * n_part)
```

onde:

* `n_sample` é o número de páginas amostradas (definido por `innodb_stats_persistent_sample_pages`)

* `n_cols_in_uniq_i` é o número total de todas as colunas em todos os índices exclusivos (não contando as colunas da chave primária)

* `n_cols_in_non_uniq_i` é o número total de todas as colunas em todos os índices não exclusivos

* `n_cols_in_pk` é o número de colunas na chave primária (se uma chave primária não for definida, `InnoDB` cria uma chave primária única internamente)

* `n_non_uniq_i` é o número de índices não únicos na tabela

* `n_part` é o número de partições. Se não forem definidas partições, a tabela é considerada uma única partição.

Agora, considere a tabela a seguir (tabela `t`), que possui uma chave primária (2 colunas), um índice único (2 colunas) e dois índices não exclusivos (2 colunas cada):

```
CREATE TABLE t (
  a INT,
  b INT,
  c INT,
  d INT,
  e INT,
  f INT,
  g INT,
  h INT,
  PRIMARY KEY (a, b),
  UNIQUE KEY i1uniq (c, d),
  KEY i2nonuniq (e, f),
  KEY i3nonuniq (g, h)
);
```

Para os dados de coluna e índice necessários para o algoritmo descrito acima, consulte a tabela de estatísticas persistentes do índice `mysql.innodb_index_stats` para a tabela `t`. As estatísticas `n_diff_pfx%` mostram as colunas que são contadas para cada índice. Por exemplo, as colunas `a` e `b` são contadas para o índice de chave primária. Para os índices não exclusivos, as colunas da chave primária (a, b) são contadas, além das colunas definidas pelo usuário.

Nota

Para informações adicionais sobre as tabelas de estatísticas persistentes `InnoDB`, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”

```
mysql> SELECT index_name, stat_name, stat_description
       FROM mysql.innodb_index_stats WHERE
       database_name='test' AND
       table_name='t' AND
       stat_name like 'n_diff_pfx%';
  +------------+--------------+------------------+
  | index_name | stat_name    | stat_description |
  +------------+--------------+------------------+
  | PRIMARY    | n_diff_pfx01 | a                |
  | PRIMARY    | n_diff_pfx02 | a,b              |
  | i1uniq     | n_diff_pfx01 | c                |
  | i1uniq     | n_diff_pfx02 | c,d              |
  | i2nonuniq  | n_diff_pfx01 | e                |
  | i2nonuniq  | n_diff_pfx02 | e,f              |
  | i2nonuniq  | n_diff_pfx03 | e,f,a            |
  | i2nonuniq  | n_diff_pfx04 | e,f,a,b          |
  | i3nonuniq  | n_diff_pfx01 | g                |
  | i3nonuniq  | n_diff_pfx02 | g,h              |
  | i3nonuniq  | n_diff_pfx03 | g,h,a            |
  | i3nonuniq  | n_diff_pfx04 | g,h,a,b          |
  +------------+--------------+------------------+
```

Com base nos dados estatísticos do índice mostrados acima e na definição da tabela, os seguintes valores podem ser determinados:

* `n_cols_in_uniq_i`, o número total de todas as colunas em todos os índices exclusivos, excluindo as colunas da chave primária, é 2 (`c` e `d`)

* `n_cols_in_non_uniq_i`, o número total de todas as colunas em todos os índices não únicos, é 4 (`e`, `f`, `g` e `h`)

* `n_cols_in_pk`, o número de colunas na chave primária, é 2 (`a` e `b`)

* `n_non_uniq_i`, o número de índices não únicos na tabela, é 2 (`i2nonuniq` e `i3nonuniq`))

* `n_part`, o número de divisões, é 1.

Agora você pode calcular [[`innodb_stats_persistent_sample_pages`] * (2 + 4

+ 2 \* (1 + 2)) \* 1 para determinar o número de páginas de folha que são digitalizadas. Com `innodb_stats_persistent_sample_pages` definido no valor padrão de `20`, e com um tamanho de página padrão de 16 `KiB` (`innodb_page_size`=16384), você pode então estimar que 20 \* 12 \* 16384 `bytes` são lidos para a tabela `t`, ou cerca de 4 `MiB`.

Nota

Todos os 4 `MiB` podem não ser lidos a partir do disco, pois algumas páginas de folha podem já estar cacheadas na reserva de buffer.

### 17.8.11 Configurando o Limiar de Fusão para Páginas de Índice

Você pode configurar o valor `MERGE_THRESHOLD` para páginas de índice. Se a porcentagem de “página cheia” para uma página de índice cair abaixo do valor `MERGE_THRESHOLD` quando uma linha é excluída ou quando uma linha é encurtada por uma operação `UPDATE`, o `InnoDB` tenta combinar a página de índice com uma página de índice vizinha. O valor padrão `MERGE_THRESHOLD` é 50, que é o valor previamente codificado. O valor mínimo `MERGE_THRESHOLD` é 1 e o valor máximo é 50.

Quando a porcentagem de "página cheia" para uma página de índice cair abaixo de 50%, que é o ajuste padrão do `MERGE_THRESHOLD`, o `InnoDB` tenta combinar a página de índice com uma página vizinha. Se ambas as páginas estiverem próximas a 50% de cheia, uma divisão de página pode ocorrer logo após as páginas serem combinadas. Se esse comportamento de junção e divisão ocorrer frequentemente, pode ter um efeito adverso no desempenho. Para evitar junções frequentes, você pode diminuir o valor do `MERGE_THRESHOLD` para que o `InnoDB` tente fazer junções de página em uma porcentagem de "página cheia" mais baixa. A junção de páginas em uma porcentagem de "página cheia" mais baixa deixa mais espaço nas páginas de índice e ajuda a reduzir o comportamento de junção e divisão.

O `MERGE_THRESHOLD` para páginas de índice pode ser definido para uma tabela ou para índices individuais. Um valor `MERGE_THRESHOLD` definido para um índice individual tem prioridade sobre um valor `MERGE_THRESHOLD` definido para a tabela. Se não definido, o valor `MERGE_THRESHOLD` tem como padrão 50.

#### Definindo o LIMITE_MERGE para uma Tabela

Você pode definir o valor `MERGE_THRESHOLD` para uma tabela usando a cláusula *`table_option`* `COMMENT` da declaração `CREATE TABLE`. Por exemplo:

```
CREATE TABLE t1 (
   id INT,
  KEY id_index (id)
) COMMENT='MERGE_THRESHOLD=45';
```

Você também pode definir o valor `MERGE_THRESHOLD` para uma tabela existente usando a cláusula *`table_option`* `COMMENT` com `ALTER TABLE`:

```
CREATE TABLE t1 (
   id INT,
  KEY id_index (id)
);

ALTER TABLE t1 COMMENT='MERGE_THRESHOLD=40';
```

#### Definindo o MERGE_THRESHOLD para Índices Individuais

Para definir o valor do `MERGE_THRESHOLD` para um índice individual, você pode usar a cláusula *`index_option`* `COMMENT` com `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`, conforme mostrado nos exemplos a seguir:

* Definindo `MERGE_THRESHOLD` para um índice individual usando `CREATE TABLE`:

  ```
  CREATE TABLE t1 (
     id INT,
    KEY id_index (id) COMMENT 'MERGE_THRESHOLD=40'
  );
  ```

* Definindo `MERGE_THRESHOLD` para um índice individual usando `ALTER TABLE`:

  ```
  CREATE TABLE t1 (
     id INT,
    KEY id_index (id)
  );

  ALTER TABLE t1 DROP KEY id_index;
  ALTER TABLE t1 ADD KEY id_index (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

* Definindo `MERGE_THRESHOLD` para um índice individual usando `CREATE INDEX`:

  ```
  CREATE TABLE t1 (id INT);
  CREATE INDEX id_index ON t1 (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

Nota

Você não pode modificar o valor `MERGE_THRESHOLD` no nível do índice para `GEN_CLUST_INDEX`, que é o índice agrupado criado por `InnoDB` quando uma tabela `InnoDB` é criada sem uma chave primária ou índice de chave única. Você só pode modificar o valor `MERGE_THRESHOLD` para `GEN_CLUST_INDEX` definindo `MERGE_THRESHOLD` para a tabela.

#### Consultando o Valor de MERGE_THRESHOLD para um Índice

O valor atual do `MERGE_THRESHOLD` para um índice pode ser obtido consultando a tabela `INNODB_INDEXES`. Por exemplo:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_INDEXES WHERE NAME='id_index' \G
*************************** 1. row ***************************
       INDEX_ID: 91
           NAME: id_index
       TABLE_ID: 68
           TYPE: 0
       N_FIELDS: 1
        PAGE_NO: 4
          SPACE: 57
MERGE_THRESHOLD: 40
```

Você pode usar `SHOW CREATE TABLE` para visualizar o valor de `MERGE_THRESHOLD` para uma tabela, se explicitamente definido usando a cláusula *`table_option`* `COMMENT`:

```
mysql> SHOW CREATE TABLE t2 \G
*************************** 1. row ***************************
       Table: t2
Create Table: CREATE TABLE `t2` (
  `id` int(11) DEFAULT NULL,
  KEY `id_index` (`id`) COMMENT 'MERGE_THRESHOLD=40'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

Nota

Um valor `MERGE_THRESHOLD` definido no nível do índice tem prioridade sobre um valor `MERGE_THRESHOLD` definido para a tabela. Se indefinido, `MERGE_THRESHOLD` tem como padrão 50% (`MERGE_THRESHOLD=50`, que é o valor previamente codificado.

Da mesma forma, você pode usar `SHOW INDEX` para visualizar o valor de `MERGE_THRESHOLD` para um índice, se explicitamente definido usando a cláusula *`index_option`* `COMMENT`:

```
mysql> SHOW INDEX FROM t2 \G
*************************** 1. row ***************************
        Table: t2
   Non_unique: 1
     Key_name: id_index
 Seq_in_index: 1
  Column_name: id
    Collation: A
  Cardinality: 0
     Sub_part: NULL
       Packed: NULL
         Null: YES
   Index_type: BTREE
      Comment:
Index_comment: MERGE_THRESHOLD=40
```

#### Medindo o efeito das configurações de MERGE_THRESHOLD

A tabela `INNODB_METRICS` fornece dois contadores que podem ser usados para medir o efeito de uma configuração `MERGE_THRESHOLD` em fusões de páginas de índice.

```
mysql> SELECT NAME, COMMENT FROM INFORMATION_SCHEMA.INNODB_METRICS
       WHERE NAME like '%index_page_merge%';
+-----------------------------+----------------------------------------+
| NAME                        | COMMENT                                |
+-----------------------------+----------------------------------------+
| index_page_merge_attempts   | Number of index page merge attempts    |
| index_page_merge_successful | Number of successful index page merges |
+-----------------------------+----------------------------------------+
```

Ao diminuir o valor do `MERGE_THRESHOLD`, os objetivos são:

* Menor número de tentativas de fusão de páginas e fusões de páginas bem-sucedidas

* Um número semelhante de tentativas de fusão de páginas e fusões de páginas bem-sucedidas

Um ajuste `MERGE_THRESHOLD` que é muito pequeno pode resultar em arquivos de dados grandes devido a uma quantidade excessiva de espaço de página vazio.

Para obter informações sobre o uso dos contabilistas `INNODB_METRICS`, consulte a Seção 17.15.6, “Tabela de métricas do InnoDB INFORMATION_SCHEMA”.

### 17.8.12 Habilitar a configuração automática do InnoDB para um servidor MySQL dedicado

Quando o servidor é iniciado com `--innodb-dedicated-server`, `InnoDB` calcula automaticamente os valores para e define as seguintes variáveis do sistema:

* `innodb_buffer_pool_size`
* `innodb_redo_log_capacity` (MySQL 8.0.30 e posterior)

* `innodb_log_file_size` (antes do MySQL 8.0.30)

* `innodb_log_files_in_group` (antes do MySQL 8.0.30)

* `innodb_flush_method`

Nota

`innodb_log_file_size` e `innodb_log_files_in_group` são descontinuados a partir do MySQL 8.0.30 e são substituídos por `innodb_redo_log_capacity`. Você deve esperar que `innodb_log_file_size` e `innodb_log_files_in_group` sejam removidos em uma versão futura do MySQL.

Você deve considerar o uso de `--innodb-dedicated-server` apenas se a instância do MySQL estiver em um servidor dedicado onde ela pode usar todos os recursos do sistema disponíveis — por exemplo, se você executar o MySQL Server em um contêiner Docker ou VM dedicada que executa o MySQL apenas. O uso de `--innodb-dedicated-server` não é recomendado se a instância do MySQL compartilhar recursos do sistema com outras aplicações.

O valor para cada variável afetada é determinado e aplicado por `--innodb-dedicated-server` conforme descrito na lista a seguir:

* `innodb_buffer_pool_size`

O tamanho do pool de buffer é calculado de acordo com a quantidade de memória detectada no servidor, conforme mostrado na tabela a seguir:

**Tabela 17.8 Tamanho do Pool de Buffer Configurado automaticamente**

  <table summary="The first column           shows the amount of server memory detected. The second column shows           the buffer pool size which is automatically determined."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Memória do servidor detectada</th> <th>Tamanho do Pool de Buffer</th> </tr></thead><tbody><tr> <td>Menos de 1 GB</td> <td>128 MB (o valor padrão)</td> </tr><tr> <td>1 GB a 4 GB</td> <td><em class="replaceable"><code>detected server memory</code></em>* 0,5</td> </tr><tr> <td>Maior que 4 GB</td> <td><em class="replaceable"><code>detected server memory</code></em>* 0,75</td> </tr></tbody></table>

* `innodb_redo_log_capacity`

A capacidade do log de refazer é configurada de acordo com a quantidade de memória detectada no servidor e, em alguns casos, se o `innodb_buffer_pool_size` é configurado explicitamente. Se o `innodb_buffer_pool_size` não for configurado explicitamente, o valor padrão é assumido.

Aviso

O comportamento da configuração automática da capacidade do log de refazer é indefinido se `innodb_buffer_pool_size` estiver definido com um valor maior que a quantidade detectada de memória do servidor.

**Tabela 17.9 Tamanho do arquivo de registro configurado automaticamente**

  <table summary="The first column shows the buffer pool size. The second column shows the automatically configured redo log capacity."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 34%"/><thead><tr> <th>Memória do servidor detectada</th> <th>Buffer Pool Size</th> <th>Capacidade de registro vermelha</th> </tr></thead><tbody><tr> <td>Menos de 1 GB</td> <td>Not configured</td> <td>100 MB</td> </tr><tr> <td>Menos de 1 GB</td> <td>Less than 1GB</td> <td>100 MB</td> </tr><tr> <td>1 GB a 2 GB</td> <td>Not applicable</td> <td>100 MB</td> </tr><tr> <td>2 GB a 4 GB</td> <td>Not configured</td> <td>1 GB</td> </tr><tr> <td>2 GB a 4 GB</td> <td>Any configured value</td> <td>ao redor(0,5 *<em class="replaceable"><code>detected server memory</code></em>GB) * 0,5 GB</td> </tr><tr> <td>4GB a 10,66 GB</td> <td>Not applicable</td> <td>ao redor(0,75 *<em class="replaceable"><code>detected server memory</code></em>GB) * 0,5 GB</td> </tr><tr> <td>10,66 GB a 170,66 GB</td> <td>Not applicable</td> <td>ao arredondar (0,5625 *<em class="replaceable"><code>detected server memory</code></em>em GB)
                * 1 GB</td> </tr><tr> <td>Maior que 170,66 GB</td> <td>Not applicable</td> <td>128 GB</td> </tr></tbody></table>

* `innodb_log_file_size` (descontinuada)

O tamanho do arquivo de registro é definido de acordo com o tamanho do conjunto de buffers configurado automaticamente, conforme mostrado na tabela a seguir:

**Tabela 17.10 Tamanho do arquivo de registro configurado automaticamente**

  <table summary="The first column           shows the buffer pool size. The second column shows the log file size           which is automatically determined."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Tamanho do Pool de Buffer</th> <th>Log File Size</th> </tr></thead><tbody><tr> <td>Menos de 8 GB</td> <td>512MB</td> </tr><tr> <td>8 GB a 128 GB</td> <td>1024MB</td> </tr><tr> <td>Maior que 128 GB</td> <td>2048MB</td> </tr></tbody></table>

* `innodb_log_files_in_group` (descontinuada)

O número de arquivos de registro é determinado de acordo com o tamanho do conjunto de buffers configurado automaticamente, conforme mostrado na tabela a seguir:

**Tabela 17.11 Número de arquivos de registro configurado automaticamente**

  <table summary="The first column shows           the buffer pool size. The second column shows the number of log files           which is automatically determined."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Tamanho do Pool de Buffer</th> <th>Número de arquivos de registro</th> </tr></thead><tbody><tr> <td>Menos de 8 GB</td> <td>ao redor<em class="replaceable"><code>buffer pool size</code></em>)</td> </tr><tr> <td>8 GB a 128 GB</td> <td>ao redor<em class="replaceable"><code>buffer pool size</code></em>* 0,75)</td> </tr><tr> <td>Maior que 128 GB</td> <td>64</td> </tr></tbody></table>

Nota

O valor mínimo para o valor `innodb_log_files_in_group` é `2`; esse limite inferior é aplicado se o valor do tamanho do buffer arredondado for menor que esse número.

* `innodb_flush_method`

O método de limpeza é definido como `O_DIRECT_NO_FSYNC` quando o servidor é iniciado com `--innodb-dedicated-server`. Se `O_DIRECT_NO_FSYNC` não estiver disponível, o valor padrão para `innodb_flush_method`.

`InnoDB` utiliza `O_DIRECT` durante o fluxo de I/O, mas ignora a chamada de sistema `fsync()` após cada operação de escrita.

Aviso

Antes do MySQL 8.0.14, `O_DIRECT_NO_FSYNC` não era adequado para sistemas de arquivos como XFS e EXT4, que exigem uma chamada de sistema `fsync()` para sincronizar as mudanças de metadados do sistema de arquivos.

A partir do MySQL 8.0.14, `fsync()` é chamado após a criação de um novo arquivo, após o aumento do tamanho do arquivo e após a fechamento de um arquivo, para garantir que as mudanças de metadados do sistema de arquivos sejam sincronizadas. A chamada de sistema `fsync()` ainda é ignorada após cada operação de escrita.

A perda de dados é possível se os arquivos de registro de refazer e os arquivos de dados estiverem em dispositivos de armazenamento diferentes, e uma saída inesperada ocorrer antes que as gravações dos arquivos de dados sejam apagadas de um cache de dispositivo que não seja alimentado por bateria. Se você estiver usando ou pretende usar diferentes dispositivos de armazenamento para arquivos de registro de refazer e arquivos de dados, e seus arquivos de dados estiverem em um dispositivo com um cache que não seja alimentado por bateria, use `O_DIRECT` em vez disso.

Se uma das variáveis listadas anteriormente for definida explicitamente em um arquivo de opções ou em outro lugar, esse valor explícito é usado e um aviso de inicialização semelhante ao seguinte é impresso em `stderr`:

[Aviso] [000000] InnoDB: A opção innodb_dedicated_server é ignorada para innodb_buffer_pool_size porque innodb_buffer_pool_size=134217728 é especificada explicitamente.

Definir uma variável explicitamente não impede a configuração automática de outras opções.

Se o servidor for iniciado com `--innodb-dedicated-server` e `innodb_buffer_pool_size` for definido explicitamente, as configurações variáveis com base no tamanho do pool de buffers utilizam o valor do tamanho do pool de buffers calculado de acordo com a quantidade de memória detectada no servidor, em vez do valor explícito do tamanho do pool de buffers.

Nota

As configurações automáticas são aplicadas por `--innodb-dedicated-server` *apenas* quando o servidor MySQL é iniciado. Se você definir posteriormente qualquer uma das variáveis afetadas explicitamente, isso substitui seu valor predeterminado, e o valor que foi explicitamente definido é aplicado. Definir uma dessas variáveis para `DEFAULT` faz com que ela seja definida pelo valor padrão real, conforme mostrado na descrição da variável no Manual, e *não* faz com que ela retorne ao valor definido por `--innodb-dedicated-server`. A variável de sistema correspondente `innodb_dedicated_server` é alterada apenas ao iniciar o servidor com `--innodb-dedicated-server` (ou com `--innodb-dedicated-server=ON` ou `--innodb-dedicated-server=OFF`); de outra forma, ela é somente leitura.