### 14.8.1 Configuração de inicialização do InnoDB

As primeiras decisões a serem tomadas sobre a configuração do `InnoDB` envolvem a configuração dos arquivos de dados, arquivos de log, tamanho da página e buffers de memória, que devem ser configurados antes de inicializar o `InnoDB`. A modificação da configuração após a inicialização do `InnoDB` pode envolver procedimentos não triviais.

Esta seção fornece informações sobre como especificar configurações do `InnoDB` em um arquivo de configuração, visualizar informações de inicialização do `InnoDB` e considerações importantes sobre armazenamento.

- Especificando Opções em um Arquivo de Configuração MySQL
- Visualizar informações de inicialização do InnoDB
- Considerações importantes sobre armazenamento
- Configuração do arquivo de dados do espaço de tabela do sistema
- Configuração do arquivo de registro novamente
- Desfazer a configuração do espaço de tabelas
- Configuração de Espaço de Memória Temporário
- Configuração do tamanho da página
- Configuração de Memória

#### Especificando Opções em um Arquivo de Configuração MySQL

Como o MySQL usa configurações de arquivo de dados, arquivo de log e tamanho de página para inicializar o `InnoDB`, recomenda-se que você defina essas configurações em um arquivo de opção que o MySQL lê ao iniciar, antes de inicializar o `InnoDB`. Normalmente, o `InnoDB` é inicializado quando o servidor MySQL é iniciado pela primeira vez.

Você pode colocar as configurações do InnoDB no grupo `[mysqld]` de qualquer arquivo de opções que o servidor lê quando ele começa. Os locais dos arquivos de opções do MySQL são descritos na Seção 4.2.2.2, “Usando arquivos de opções”.

Para garantir que o **mysqld** leia as opções apenas de um arquivo específico, use a opção `--defaults-file` como a primeira opção na linha de comando ao iniciar o servidor:

```sql
mysqld --defaults-file=path_to_option_file
```

#### Visualizar informações de inicialização do InnoDB

Para visualizar as informações de inicialização do `InnoDB` durante a inicialização, inicie o **mysqld** a partir de um prompt de comando, que imprime as informações de inicialização no console.

Por exemplo, no Windows, se o **mysqld** estiver localizado em `C:\Program Files\MySQL\MySQL Server 5.7\bin`, inicie o servidor MySQL da seguinte forma:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld" --console
```

Em sistemas semelhantes ao Unix, o **mysqld** está localizado no diretório `bin` da sua instalação do MySQL:

```sql
$> bin/mysqld --user=mysql &
```

Se você não enviar a saída do servidor para o console, verifique o log de erro após a inicialização para ver as informações de inicialização do `InnoDB` impressas durante o processo de inicialização.

Para obter informações sobre como iniciar o MySQL usando outros métodos, consulte a Seção 2.9.5, “Iniciar e Parar o MySQL automaticamente”.

Nota

O `InnoDB` não abre todas as tabelas de usuário e os arquivos de dados associados no início. No entanto, o `InnoDB` verifica a existência dos arquivos do espaço de tabelas referenciados no dicionário de dados. Se um arquivo de espaço de tabela não for encontrado, o `InnoDB` registra um erro e continua a sequência de inicialização. Arquivos de espaço de tabela referenciados no log de redo podem ser abertos durante a recuperação de falhas para a aplicação de redo.

#### Considerações importantes sobre armazenamento

Revise as seguintes considerações relacionadas ao armazenamento antes de prosseguir com a configuração de inicialização.

- Em alguns casos, você pode melhorar o desempenho do banco de dados ao colocar os arquivos de dados e log em discos físicos separados. Você também pode usar partições de disco bruto (dispositivos brutos) para os arquivos de dados do `InnoDB`, o que pode acelerar o I/O. Veja Usar Partições de Disco Bruto para o Espaço de Tabela do Sistema.

- O `InnoDB` é um mecanismo de armazenamento seguro para transações (compatível com ACID) com capacidades de commit, rollback e recuperação em caso de falha para proteger os dados do usuário. **No entanto, ele não pode fazer isso** se o sistema operacional ou o hardware subjacente não funcionar conforme anunciado. Muitos sistemas operacionais ou subsistemas de disco podem atrasar ou reorganizar operações de escrita para melhorar o desempenho. Em alguns sistemas operacionais, a própria chamada de sistema `fsync()` que deveria esperar até que todos os dados não escritos de um arquivo fossem descarregados pode, na verdade, retornar antes de os dados serem descarregados para o armazenamento estável. Por isso, um travamento do sistema operacional ou uma queda de energia podem destruir dados recentemente comprometidos ou, no pior dos casos, até corromper o banco de dados porque as operações de escrita foram reorganizadas. Se a integridade dos dados é importante para você, realize testes de "desligar" antes de usar qualquer coisa em produção. No macOS, o `InnoDB` usa um método especial de esvaziamento de arquivo `fcntl()`. Sob o Linux, é aconselhável **desativar o cache de escrita de volta**.

  Em unidades de disco ATA/SATA, um comando como `hdparm -W0 /dev/hda` pode funcionar para desabilitar o cache de escrita reversa. **Tenha cuidado, pois algumas unidades ou controladores de disco podem não conseguir desabilitar o cache de escrita reversa.**

- Em relação às capacidades de recuperação do `InnoDB` que protegem os dados do usuário, o `InnoDB` utiliza uma técnica de esvaziamento de arquivos que envolve uma estrutura chamada buffer de dupla escrita, que é ativada por padrão (`innodb_doublewrite=ON`). O buffer de dupla escrita adiciona segurança à recuperação após uma saída inesperada ou queda de energia, e melhora o desempenho na maioria das variedades de Unix, reduzindo a necessidade de operações `fsync()`. Recomenda-se que a opção `innodb_doublewrite` permaneça ativada se você estiver preocupado com a integridade dos dados ou possíveis falhas. Para obter informações sobre o buffer de dupla escrita, consulte a Seção 14.12.1, “I/O de Disco InnoDB”.

- Antes de usar o NFS com o `InnoDB`, revise os problemas potenciais descritos em Usar NFS com MySQL.

- Executar o servidor MySQL em um disco rígido de setor de 4K no Windows não é suportado com `innodb_flush_method=async_unbuffered`, que é o ajuste padrão. A solução é usar `innodb_flush_method=normal`.

#### Configuração do arquivo de dados do espaço de tabela do sistema

A opção `innodb_data_file_path` define o nome, o tamanho e os atributos dos arquivos de dados do espaço de tabela do sistema `InnoDB`. Se você não configurar essa opção antes de inicializar o servidor MySQL, o comportamento padrão é criar um único arquivo de dados auto-extensível, ligeiramente maior que 12 MB, com o nome `ibdata1`:

```sql
mysql> SHOW VARIABLES LIKE 'innodb_data_file_path';
+-----------------------+------------------------+
| Variable_name         | Value                  |
+-----------------------+------------------------+
| innodb_data_file_path | ibdata1:12M:autoextend |
+-----------------------+------------------------+
```

A sintaxe do arquivo de dados completo inclui o nome do arquivo, o tamanho do arquivo, o atributo `autoextend` e o atributo `max`:

```sql
file_name:file_size[:autoextend[:max:max_file_size]]
```

Os tamanhos dos arquivos são especificados em kilobytes, megabytes ou gigabytes, anexando `K`, `M` ou `G` ao valor do tamanho. Se você especificar o tamanho do arquivo de dados em kilobytes, faça isso em múltiplos de 1024. Caso contrário, os valores em kilobytes são arredondados para o limite mais próximo de megabyte (MB). A soma dos tamanhos dos arquivos deve ser, no mínimo, ligeiramente maior que 12 MB.

Você pode especificar mais de um arquivo de dados usando uma lista separada por ponto e vírgula. Por exemplo:

```sql
[mysqld]
innodb_data_file_path=ibdata1:50M;ibdata2:50M:autoextend
```

Os atributos `autoextend` e `max` podem ser usados apenas para o arquivo de dados especificado por último.

Quando o atributo `autoextend` é especificado, o arquivo de dados aumenta automaticamente em incrementos de 64 MB à medida que o espaço necessário é necessário. A variável `innodb_autoextend_increment` controla o tamanho do incremento.

Para especificar um tamanho máximo para um arquivo de dados que se expande automaticamente, use o atributo `max` após o atributo `autoextend`. Use o atributo `max` apenas em casos em que o controle do uso do disco é de importância crítica. A configuração a seguir permite que o `ibdata1` cresça até um limite de 500 MB:

```sql
[mysqld]
innodb_data_file_path=ibdata1:12M:autoextend:max:500M
```

Um tamanho mínimo de arquivo é exigido para o *primeiro* arquivo de dados do espaço de tabela do sistema para garantir que haja espaço suficiente para as páginas do buffer de escrita dupla. A tabela a seguir mostra os tamanhos mínimos de arquivo para cada tamanho de página do `InnoDB`. O tamanho de página padrão do `InnoDB` é de 16384 (16 KB).

<table summary="O arquivo de dados mínimo das tabelas do sistema para cada tamanho de página do InnoDB."><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Tamanho da página (innodb_page_size)</th> <th>Tamanho mínimo do arquivo</th> </tr></thead><tbody><tr> <td>16384 (16KB) ou menos</td> <td>3 MB</td> </tr><tr> <td>32768 (32KB)</td> <td>6 MB</td> </tr><tr> <td>65536 (64KB)</td> <td>12 MB</td> </tr></tbody></table>

Se o disco ficar cheio, você pode adicionar um arquivo de dados em outro disco. Para obter instruções, consulte Redimensionar o espaço de tabelas do sistema.

O limite de tamanho para arquivos individuais é determinado pelo seu sistema operacional. Você pode definir o tamanho do arquivo para mais de 4 GB em sistemas operacionais que suportam arquivos grandes. Você também pode usar partições de disco bruto como arquivos de dados. Consulte Usar Partições de Disco Bruto para o Espaço de Tabela do Sistema.

O `InnoDB` não tem conhecimento do tamanho máximo do arquivo do sistema de arquivos, então tenha cuidado em sistemas de arquivos onde o tamanho máximo do arquivo é um valor pequeno, como 2 GB.

Os arquivos de espaço de tabela do sistema são criados no diretório de dados por padrão (`datadir`). Para especificar um local alternativo, use a opção `innodb_data_home_dir`. Por exemplo, para criar um arquivo de dados de espaço de tabela do sistema em um diretório chamado `myibdata`, use esta configuração:

```sql
[mysqld]
innodb_data_home_dir = /myibdata/
innodb_data_file_path=ibdata1:50M:autoextend
```

Um traço final é necessário ao especificar um valor para `innodb_data_home_dir`. O `InnoDB` não cria diretórios, então certifique-se de que o diretório especificado existe antes de iniciar o servidor. Além disso, certifique-se de que o servidor MySQL tenha os devidos direitos de acesso para criar arquivos no diretório.

`InnoDB` forma o caminho do diretório para cada arquivo de dados, concatenando o valor de `innodb_data_home_dir` ao nome do arquivo de dados. Se `innodb_data_home_dir` não for definido, o valor padrão é “./”, que é o diretório de dados. (O servidor MySQL muda seu diretório de trabalho atual para o diretório de dados quando começa a executar.)

Se você especificar `innodb_data_home_dir` como uma string vazia, você pode especificar caminhos absolutos para os arquivos de dados listados no valor `innodb_data_file_path`. A seguinte configuração é equivalente à anterior:

```sql
[mysqld]
innodb_data_home_dir =
innodb_data_file_path=/myibdata/ibdata1:50M:autoextend
```

#### Configuração do arquivo de registro novamente

O `InnoDB` cria dois arquivos de registro redo de 5 MB chamados `ib_logfile0` e `ib_logfile1` no diretório de dados por padrão.

As seguintes opções podem ser usadas para modificar a configuração padrão:

- `innodb_log_group_home_dir` define o caminho do diretório para os arquivos de log do `InnoDB`. Se esta opção não for configurada, os arquivos de log do `InnoDB` serão criados no diretório de dados do MySQL (`datadir`).

  Você pode usar essa opção para colocar os arquivos de log do InnoDB em um local de armazenamento físico diferente dos arquivos de dados do InnoDB, para evitar potenciais conflitos de recursos de E/S. Por exemplo:

  ```sql
  [mysqld]
  innodb_log_group_home_dir = /dr3/iblogs
  ```

  Nota

  O `InnoDB` não cria diretórios, então certifique-se de que o diretório de log existe antes de iniciar o servidor. Use o comando `mkdir` do Unix ou do DOS para criar os diretórios necessários.

  Certifique-se de que o servidor MySQL tenha os devidos direitos de acesso para criar arquivos no diretório de log. De forma mais geral, o servidor deve ter direitos de acesso em qualquer diretório onde ele precise criar arquivos de log.

- `innodb_log_files_in_group` define o número de arquivos de log na grupo de log. O valor padrão e recomendado é 2.

- `innodb_log_file_size` define o tamanho em bytes de cada arquivo de log no grupo de logs. O tamanho combinado dos arquivos de log (`innodb_log_file_size` \* `innodb_log_files_in_group`) não pode exceder o valor máximo, que é ligeiramente inferior a 512 GB. Um par de arquivos de log de 255 GB, por exemplo, se aproxima do limite, mas não o ultrapassa. O tamanho padrão do arquivo de log é de 48 MB. Geralmente, o tamanho combinado dos arquivos de log deve ser grande o suficiente para que o servidor possa suavizar picos e vales na atividade da carga de trabalho, o que muitas vezes significa que há espaço suficiente para o log de refazer para lidar com mais de uma hora de atividade de escrita. Um tamanho de arquivo de log maior significa menos atividade de esvaziamento de verificação de ponto no pool de buffers, o que reduz o I/O no disco. Para obter informações adicionais, consulte a Seção 8.5.4, “Otimizando o Registro de Refazer InnoDB”.

#### Desfazer a configuração do espaço de tabelas

Os registros de desfazer fazem parte do espaço de tabela do sistema por padrão. No entanto, você pode optar por armazenar os registros de desfazer em um ou mais espaços de tabela de desfazer separados, geralmente em um dispositivo de armazenamento diferente.

A opção de configuração `innodb_undo_directory` define o caminho onde o `InnoDB` cria espaços de tabela separados para os registros de rollback. Essa opção é normalmente usada em conjunto com as opções `innodb_rollback_segments` e `innodb_undo_tablespaces`, que determinam o layout do disco dos registros de rollback fora do espaço de tabela do sistema.

Nota

`innodb_undo_tablespaces` está desatualizado; espere que ele seja removido em uma futura versão.

Para obter mais informações, consulte a Seção 14.6.3.4, “Desfazer Espaços de Tabela”.

#### Configuração de Espaço de Memória Temporário

Por padrão, um único arquivo de dados de espaço de tabela temporário auto-extensível chamado `ibtmp1` é criado no diretório `innodb_data_home_dir`. O tamanho inicial do arquivo de dados do espaço de tabela temporário é ligeiramente maior que 12 MB. A configuração padrão do arquivo de dados do espaço de tabela temporário pode ser modificada durante a inicialização usando a opção de configuração `innodb_temp_data_file_path`.

A opção `innodb_temp_data_file_path` especifica o caminho, o nome do arquivo e o tamanho do arquivo dos arquivos de dados do espaço de tabelas temporários. O caminho completo do diretório é formado concatenando `innodb_data_home_dir` ao caminho especificado por `innodb_temp_data_file_path`. O tamanho do arquivo é especificado em KB, MB ou GB (1024MB) ao anexar K, M ou G ao valor do tamanho. O tamanho do arquivo ou o tamanho combinado deve ser ligeiramente maior que 12MB.

O valor padrão de `innodb_data_home_dir` é o diretório de dados do MySQL (`datadir`).

Um arquivo de dados de espaço de tabela temporário autoextensibile pode se tornar grande em ambientes que utilizam tabelas temporárias grandes ou que as utilizam extensivamente. Um grande arquivo de dados também pode resultar de consultas que executam por muito tempo e utilizam tabelas temporárias. Para evitar que o arquivo de dados temporário se torne muito grande, configure a opção `innodb_temp_data_file_path` para especificar o tamanho máximo do arquivo de dados. Para obter mais informações, consulte Gerenciamento do tamanho do arquivo de dados do espaço de tabela temporário.

#### Configuração do tamanho da página

A opção `innodb_page_size` especifica o tamanho da página para todos os espaços de tabela `InnoDB` em uma instância do MySQL. Esse valor é definido quando a instância é criada e permanece constante posteriormente. Os valores válidos são 64KB, 32KB, 16KB (padrão), 8KB e 4KB. Alternativamente, você pode especificar o tamanho da página em bytes (65536, 32768, 16384, 8192, 4096).

O tamanho padrão de página de 16 KB é apropriado para uma ampla gama de cargas de trabalho, especialmente para consultas que envolvem varreduras de tabelas e operações de manipulação de dados de massa (DML) que envolvem atualizações em massa. Tamanhos de página menores podem ser mais eficientes para cargas de trabalho OLTP que envolvem muitos pequenos registros, onde a concorrência pode ser um problema quando uma única página contém muitas linhas. Páginas menores também podem ser mais eficientes para dispositivos de armazenamento SSD, que geralmente usam tamanhos de bloco pequenos. Manter o tamanho de página do `InnoDB` próximo ao tamanho do bloco do dispositivo de armazenamento minimiza a quantidade de dados não alterados que são reescritos no disco.

Importante

`innodb_page_size` pode ser definido apenas ao inicializar o diretório de dados. Consulte a descrição desta variável para obter mais informações.

#### Configuração de Memória

O MySQL aloca memória para vários caches e buffers para melhorar o desempenho das operações do banco de dados. Ao alocar memória para o `InnoDB`, sempre considere a memória necessária pelo sistema operacional, a memória alocada para outras aplicações e a memória alocada para outros buffers e caches do MySQL. Por exemplo, se você usar tabelas `MyISAM`, considere a quantidade de memória alocada para o buffer de chave (`key_buffer_size`). Para uma visão geral dos buffers e caches do MySQL, consulte a Seção 8.12.4.1, “Como o MySQL Usa a Memória”.

Os buffers específicos para o `InnoDB` são configurados usando os seguintes parâmetros:

- `innodb_buffer_pool_size` define o tamanho do pool de buffers, que é a área de memória que armazena dados cacheados para as tabelas `InnoDB`, índices e outros buffers auxiliares. O tamanho do pool de buffers é importante para o desempenho do sistema, e geralmente é recomendado que `innodb_buffer_pool_size` seja configurado para 50 a 75% da memória do sistema. O tamanho padrão do pool de buffers é de 128 MB. Para obter orientações adicionais, consulte a Seção 8.12.4.1, “Como o MySQL Usa a Memória”. Para informações sobre como configurar o tamanho do pool de buffers `InnoDB`, consulte a Seção 14.8.3.1, “Configurando o Tamanho do Pool de Buffers \`InnoDB’”. O tamanho do pool de buffers pode ser configurado no início ou dinamicamente.

  Em sistemas com uma grande quantidade de memória, você pode melhorar a concorrência dividindo o pool de buffers em várias instâncias do pool de buffers. O número de instâncias do pool de buffers é controlado pela opção `innodb_buffer_pool_instances`. Por padrão, o `InnoDB` cria uma única instância do pool de buffers. O número de instâncias do pool de buffers pode ser configurado durante a inicialização. Para mais informações, consulte a Seção 14.8.3.2, “Configurando Múltiplas Instâncias do Pool de Buffers”.

- `innodb_log_buffer_size` define o tamanho do buffer que o `InnoDB` usa para gravar nos arquivos de log no disco. O tamanho padrão é de 16 MB. Um buffer de log grande permite que transações grandes sejam executadas sem gravar o log no disco antes do commit das transações. Se você tiver transações que atualizam, inserem ou excluem muitas linhas, pode considerar aumentar o tamanho do buffer de log para economizar I/O no disco. `innodb_log_buffer_size` pode ser configurado no momento do início. Para informações relacionadas, consulte a Seção 8.5.4, “Otimizando o registro de refazer do InnoDB”.

Aviso

No GNU/Linux x86 de 32 bits, se o uso de memória for configurado muito alto, o `glibc` pode permitir que o heap do processo cresça além das pilhas de threads, causando uma falha no servidor. Esse é um risco se a memória alocada para o processo **mysqld** para buffers e caches globais e por thread estiver próxima ou exceder 2 GB.

Uma fórmula semelhante à seguinte, que calcula a alocação de memória global e por fio para o MySQL, pode ser usada para estimar o uso de memória do MySQL. Você pode precisar modificar a fórmula para levar em conta os buffers e caches na sua versão e configuração do MySQL. Para uma visão geral dos buffers e caches do MySQL, consulte a Seção 8.12.4.1, “Como o MySQL Usa a Memória”.

```sql
innodb_buffer_pool_size
+ key_buffer_size
+ max_connections*(sort_buffer_size+read_buffer_size+binlog_cache_size)
+ max_connections*2MB
```

Cada fio usa uma pilha (geralmente 2 MB, mas apenas 256 KB nos binários do MySQL fornecidos pela Oracle Corporation.) e, no pior dos casos, também usa `sort_buffer_size + read_buffer_size` memória adicional.

No Linux, se o kernel estiver habilitado para suporte a páginas grandes, o `InnoDB` pode usar páginas grandes para alocar memória para seu pool de buffers. Veja a Seção 8.12.4.3, “Habilitar Suporte a Páginas Grandes”.
