### 17.8.1 Configuração de inicialização do InnoDB

As primeiras decisões a serem tomadas sobre a configuração do `InnoDB` envolvem a configuração de arquivos de dados, arquivos de log, tamanho da página e buffers de memória, que devem ser configurados antes de inicializar o `InnoDB`. A modificação da configuração após o `InnoDB` ser inicializado pode envolver procedimentos não triviais.

Esta seção fornece informações sobre a especificação dos parâmetros `InnoDB` em um arquivo de configuração, a visualização das informações de inicialização `InnoDB` e considerações importantes sobre o armazenamento.

- Especificando Opções em um Arquivo de Opções MySQL
- Visualizar informações de inicialização do InnoDB
- Considerações importantes sobre armazenamento
- Configuração do arquivo de dados do espaço de tabela do sistema
- Configuração do arquivo de buffer de escrita dupla do InnoDB
- Configuração do Log Redo
- Desfazer a configuração do espaço de tabelas
- Configuração global de espaço de tabela temporário
- Configuração de espaço de tabela temporário de sessão
- Configuração do tamanho da página
- Configuração de Memória

#### Especificando Opções em um Arquivo de Opções MySQL

Como o MySQL usa configurações de arquivo de dados, arquivo de log e tamanho de página para inicializar `InnoDB`, recomenda-se que você defina essas configurações em um arquivo de opção que o MySQL lê ao iniciar, antes de inicializar `InnoDB`. Normalmente, `InnoDB` é inicializado quando o servidor MySQL é iniciado pela primeira vez.

Você pode colocar as opções `InnoDB` no grupo `[mysqld]` de qualquer arquivo de opções que seu servidor lê quando ele começa. Os locais dos arquivos de opções do MySQL são descritos na Seção 6.2.2.2, “Usando Arquivos de Opções”.

Para garantir que o **mysqld** leia as opções apenas de um arquivo específico (e `mysqld-auto.cnf`), use a opção `--defaults-file` como a primeira opção na linha de comando ao iniciar o servidor:

```
mysqld --defaults-file=path_to_option_file
```

#### Visualizar informações de inicialização do InnoDB

Para visualizar as informações de inicialização do `InnoDB` durante a inicialização, inicie o **mysqld** a partir de um prompt de comando, que imprime as informações de inicialização no console.

Por exemplo, no Windows, se o **mysqld** estiver localizado em `C:\Program Files\MySQL\MySQL Server 8.0\bin`, inicie o servidor MySQL da seguinte maneira:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld" --console
```

Em sistemas semelhantes ao Unix, o **mysqld** está localizado no diretório `bin` da sua instalação do MySQL:

```
$> bin/mysqld --user=mysql &
```

Se você não enviar a saída do servidor para o console, verifique o log de erro após a inicialização para ver as informações de inicialização `InnoDB` impressas durante o processo de inicialização.

Para obter informações sobre como iniciar o MySQL usando outros métodos, consulte a Seção 2.9.5, “Iniciar e Parar o MySQL automaticamente”.

Nota

`InnoDB` não abre todas as tabelas de usuário e os arquivos de dados associados ao iniciar. No entanto, `InnoDB` verifica a existência de arquivos de tablespace referenciados no dicionário de dados. Se um arquivo de tablespace não for encontrado, `InnoDB` registra um erro e continua a sequência de inicialização. Arquivos de tablespace referenciados no log de redo podem ser abertos durante a recuperação de falhas para a aplicação de redo.

#### Considerações importantes sobre armazenamento

Revise as seguintes considerações relacionadas ao armazenamento antes de prosseguir com a configuração de inicialização.

- Em alguns casos, você pode melhorar o desempenho do banco de dados ao colocar os arquivos de dados e log em discos físicos separados. Você também pode usar partições de disco bruto (dispositivos brutos) para os arquivos de dados `InnoDB`, o que pode acelerar o I/O. Veja Usar Partições de Disco Bruto para o Espaço de Tabela do Sistema.

- `InnoDB` é um mecanismo de armazenamento seguro para transações (compatível com ACID) com capacidades de commit, rollback e recuperação em caso de falha para proteger os dados dos usuários. No entanto, ele não pode fazer isso se o sistema operacional ou o hardware subjacente não funcionar conforme anunciado. Muitos sistemas operacionais ou subsistemas de disco podem atrasar ou reorganizar operações de escrita para melhorar o desempenho. Em alguns sistemas operacionais, a própria chamada de sistema `fsync()` que deveria esperar até que todos os dados não escritos de um arquivo tenham sido descarregados pode, na verdade, retornar antes de os dados terem sido descarregados para o armazenamento estável. Por isso, um crash do sistema operacional ou uma queda de energia pode destruir dados recentemente comprometidos ou, no pior dos casos, até corromper o banco de dados porque as operações de escrita foram reorganizadas. Se a integridade dos dados é importante para você, realize testes de "desligar o plugue" antes de usar qualquer coisa em produção. No macOS, `InnoDB` usa um método especial de esvaziamento de arquivo `fcntl()`. Sob o Linux, é aconselhável **desativar o cache de escrita reversa**.

  Em unidades de disco ATA/SATA, um comando como `hdparm -W0 /dev/hda` pode funcionar para desativar o cache de escrita reversa. **Tenha cuidado, pois algumas unidades ou controladores de disco podem não conseguir desativar o cache de escrita reversa.**

- Em relação às capacidades de recuperação `InnoDB` que protegem os dados do usuário, o `InnoDB` utiliza uma técnica de esvaziamento de arquivos que envolve uma estrutura chamada buffer de dupla gravação, que é ativada por padrão (`innodb_doublewrite=ON`). O buffer de dupla gravação adiciona segurança à recuperação após uma saída inesperada ou queda de energia, e melhora o desempenho na maioria das variedades de Unix, reduzindo a necessidade de operações `fsync()`. Recomenda-se que a opção `innodb_doublewrite` permaneça ativada se você estiver preocupado com a integridade dos dados ou possíveis falhas. Para obter informações sobre o buffer de dupla gravação, consulte a Seção 17.11.1, “I/O de Disco InnoDB”.

- Antes de usar o NFS com `InnoDB`, revise os problemas potenciais descritos em Usar NFS com MySQL.

#### Configuração do arquivo de dados do espaço de tabela do sistema

A opção `innodb_data_file_path` define o nome, o tamanho e os atributos dos arquivos de dados dos espaços de sistema de tabelas do sistema `InnoDB`. Se você não configurar essa opção antes de inicializar o servidor MySQL, o comportamento padrão é criar um único arquivo de dados de autoextensão, ligeiramente maior que 12 MB, com o nome `ibdata1`:

```
mysql> SHOW VARIABLES LIKE 'innodb_data_file_path';
+-----------------------+------------------------+
| Variable_name         | Value                  |
+-----------------------+------------------------+
| innodb_data_file_path | ibdata1:12M:autoextend |
+-----------------------+------------------------+
```

A sintaxe do arquivo de dados completo inclui o nome do arquivo, o tamanho do arquivo, o atributo `autoextend` e o atributo `max`:

```
file_name:file_size[:autoextend[:max:max_file_size]]
```

Os tamanhos dos arquivos são especificados em kilobytes, megabytes ou gigabytes, anexando `K`, `M` ou `G` ao valor do tamanho. Se especificar o tamanho do arquivo de dados em kilobytes, faça isso em múltiplos de 1024. Caso contrário, os valores em kilobytes são arredondados para o limite mais próximo de megabyte (MB). A soma dos tamanhos dos arquivos deve ser, no mínimo, ligeiramente maior que 12 MB.

Você pode especificar mais de um arquivo de dados usando uma lista separada por ponto e vírgula. Por exemplo:

```
[mysqld]
innodb_data_file_path=ibdata1:50M;ibdata2:50M:autoextend
```

Os atributos `autoextend` e `max` podem ser usados apenas para o arquivo de dados especificado por último.

Quando o atributo `autoextend` é especificado, o arquivo de dados aumenta automaticamente em incrementos de 64 MB à medida que o espaço necessário é necessário. A variável `innodb_autoextend_increment` controla o tamanho do incremento.

Para especificar um tamanho máximo para um arquivo de dados auto-extensível, use o atributo `max` após o atributo `autoextend`. Use o atributo `max` apenas em casos em que o controle do uso do disco é de importância crítica. A configuração a seguir permite que `ibdata1` cresça até um limite de 500 MB:

```
[mysqld]
innodb_data_file_path=ibdata1:12M:autoextend:max:500M
```

Um tamanho mínimo de arquivo é exigido para o *primeiro* arquivo de dados do espaço de tabela do sistema para garantir que haja espaço suficiente para as páginas do buffer de escrita dupla. A tabela a seguir mostra os tamanhos mínimos de arquivo para cada tamanho de página `InnoDB`. O tamanho de página padrão `InnoDB` é de 16384 (16KB).

<table summary="O arquivo de dados mínimo das tabelas do sistema para cada tamanho de página do InnoDB."><thead><tr> <th>Tamanho da página (innodb_page_size)</th> <th>Tamanho mínimo do arquivo</th> </tr></thead><tbody><tr> <td>16384 (16KB) ou menos</td> <td>5 MB</td> </tr><tr> <td>32768 (32KB)</td> <td>6 MB</td> </tr><tr> <td>65536 (64KB)</td> <td>12 MB</td> </tr></tbody></table>

Se o disco ficar cheio, você pode adicionar um arquivo de dados em outro disco. Para obter instruções, consulte Redimensionar o espaço de tabelas do sistema.

O limite de tamanho para arquivos individuais é determinado pelo seu sistema operacional. Você pode definir o tamanho do arquivo para mais de 4 GB em sistemas operacionais que suportam arquivos grandes. Você também pode usar partições de disco bruto como arquivos de dados. Consulte Usar Partições de Disco Bruto para o Espaço de Tabela do Sistema.

`InnoDB` não tem conhecimento do tamanho máximo do arquivo do sistema de arquivos, então tenha cuidado com sistemas de arquivos onde o tamanho máximo do arquivo é um valor pequeno, como 2 GB.

Os arquivos de espaço de tabela do sistema são criados no diretório de dados por padrão (`datadir`). Para especificar um local alternativo, use a opção `innodb_data_home_dir`. Por exemplo, para criar um arquivo de dados de espaço de tabela do sistema em um diretório chamado `myibdata`, use esta configuração:

```
[mysqld]
innodb_data_home_dir = /myibdata/
innodb_data_file_path=ibdata1:50M:autoextend
```

É necessário usar um traço final ao especificar um valor para `innodb_data_home_dir`. `InnoDB` não cria diretórios, então certifique-se de que o diretório especificado existe antes de iniciar o servidor. Além disso, certifique-se de que o servidor MySQL tenha os devidos direitos de acesso para criar arquivos no diretório.

`InnoDB` forma o caminho do diretório para cada arquivo de dados, concatenando o valor de `innodb_data_home_dir` ao nome do arquivo de dados. Se `innodb_data_home_dir` não for definido, o valor padrão é “./”, que é o diretório de dados. (O servidor MySQL muda seu diretório de trabalho atual para o diretório de dados quando começa a executar.)

Alternativamente, você pode especificar um caminho absoluto para os arquivos de dados do espaço de tabela do sistema. A seguinte configuração é equivalente à anterior:

```
[mysqld]
innodb_data_file_path=/myibdata/ibdata1:50M:autoextend
```

Quando você especifica um caminho absoluto para `innodb_data_file_path`, a configuração não é concatenada com a configuração `innodb_data_home_dir`. Os arquivos do sistema de espaço de tabela são criados no caminho absoluto especificado. O diretório especificado deve existir antes de você iniciar o servidor.

#### Configuração do arquivo de buffer de escrita dupla do InnoDB

A partir do MySQL 8.0.20, a área de armazenamento do buffer de escrita dupla reside em arquivos de escrita dupla, o que oferece flexibilidade em relação à localização de armazenamento das páginas de escrita dupla. Em versões anteriores, a área de armazenamento do buffer de escrita dupla residia no espaço de tabela do sistema. A variável `innodb_doublewrite_dir` define o diretório onde o `InnoDB` cria arquivos de escrita dupla ao iniciar. Se não for especificado nenhum diretório, os arquivos de escrita dupla são criados no diretório `innodb_data_home_dir`, que tem como padrão o diretório de dados, se não for especificado.

Para que arquivos de escrita dupla sejam criados em um local diferente do diretório `innodb_data_home_dir`, configure a variável `innodb_doublewrite_dir`. Por exemplo:

```
innodb_doublewrite_dir=/path/to/doublewrite_directory
```

Outras variáveis do buffer de escrita dupla permitem definir o número de arquivos de escrita dupla, o número de páginas por thread e o tamanho do lote de escrita dupla. Para obter mais informações sobre a configuração do buffer de escrita dupla, consulte a Seção 17.6.4, “Buffer de Escrita Dupla”.

#### Configuração do Log Redo

A partir do MySQL 8.0.30, a quantidade de espaço em disco ocupada pelos arquivos de log de refazer é controlada pela variável `innodb_redo_log_capacity`, que pode ser definida no início ou durante o runtime; por exemplo, para definir a variável para 8GiB em um arquivo de opções, adicione a seguinte entrada:

```
[mysqld]
innodb_redo_log_capacity = 8589934592
```

Para obter informações sobre a configuração da capacidade do log de reversão em tempo de execução, consulte "Configurando a capacidade do log de reversão (MySQL 8.0.30 ou superior)".

A variável `innodb_redo_log_capacity` substitui as variáveis `innodb_log_file_size` e `innodb_log_files_in_group`, que estão desatualizadas. Quando a configuração `innodb_redo_log_capacity` é definida, as configurações `innodb_log_file_size` e `innodb_log_files_in_group` são ignoradas; caso contrário, se uma ou ambas essas configurações desatualizadas forem definidas, elas são usadas para calcular `Innodb_redo_log_capacity_resized` como (`innodb_log_files_in_group` \* `innodb_log_file_size`). Se nenhuma dessas variáveis for definida, o valor padrão `innodb_redo_log_capacity` é usado.

A partir do MySQL 8.0.30, `InnoDB` tenta manter 32 arquivos de registro de refazer, com cada arquivo igual a 1/32 \* `innodb_redo_log_capacity`. Os arquivos de registro de refazer residem no diretório `#innodb_redo` no diretório de dados, a menos que um diretório diferente tenha sido especificado pela variável `innodb_log_group_home_dir`. Se `innodb_log_group_home_dir` foi definido, os arquivos de registro de refazer residem no diretório `#innodb_redo` nesse diretório. Para mais informações, consulte a Seção 17.6.5, “Registro de Refazer”.

Antes do MySQL 8.0.30, `InnoDB` cria dois arquivos de log de reverso de 5 MB chamados `ib_logfile0` e `ib_logfile1` no diretório de dados por padrão. Você pode definir um número diferente de arquivos de log de reverso e um tamanho diferente de arquivo de log de reverso ao inicializar a instância do MySQL Server, configurando as variáveis `innodb_log_files_in_group` e `innodb_log_file_size`.

- `innodb_log_files_in_group` define o número de arquivos de log no grupo de log. O valor padrão e recomendado é 2.

- `innodb_log_file_size` define o tamanho em bytes de cada arquivo de registro no grupo de registros. O tamanho combinado dos arquivos de registro (`innodb_log_file_size` \* `innodb_log_files_in_group`) não pode exceder o valor máximo, que é ligeiramente inferior a 512 GB. Um par de arquivos de registro de 255 GB, por exemplo, se aproxima do limite, mas não o ultrapassa. O tamanho padrão do arquivo de registro é de 48 MB. Geralmente, o tamanho combinado dos arquivos de registro deve ser grande o suficiente para que o servidor possa suavizar picos e vales na atividade da carga de trabalho, o que muitas vezes significa que há espaço suficiente para o log redo para lidar com mais de uma hora de atividade de escrita. Um tamanho de arquivo de registro maior significa menos atividade de esvaziamento de verificação de ponto em queda no pool de buffers, o que reduz o I/O do disco. Para obter informações adicionais, consulte a Seção 10.5.4, “Otimizando o Registro Redo do InnoDB”.

O `innodb_log_group_home_dir` define o caminho do diretório para os arquivos de log `InnoDB`. Você pode usar essa opção para colocar os arquivos de log de refazer `InnoDB` em um local de armazenamento físico diferente dos arquivos de dados `InnoDB` para evitar potenciais conflitos de recursos de E/S; por exemplo:

```
[mysqld]
innodb_log_group_home_dir = /dr3/iblogs
```

Nota

`InnoDB` não cria diretórios, então certifique-se de que o diretório de log existe antes de iniciar o servidor. Use o comando Unix ou DOS `mkdir` para criar os diretórios necessários.

Certifique-se de que o servidor MySQL tenha os devidos direitos de acesso para criar arquivos no diretório de log. De forma mais geral, o servidor deve ter direitos de acesso em qualquer diretório onde ele precise criar arquivos.

#### Desfazer a configuração do espaço de tabelas

Por padrão, os registros de desfazer residem em dois espaços de tabelas de desfazer criados quando a instância do MySQL é inicializada.

A variável `innodb_undo_directory` define o caminho onde o `InnoDB` cria os espaços de tabela de recuperação padrão. Se essa variável estiver indefinida, os espaços de tabela de recuperação padrão serão criados no diretório de dados. A variável `innodb_undo_directory` não é dinâmica. Configurar isso requer reiniciar o servidor.

Os padrões de E/S para os registros de desfazer tornam os espaços de tabelas de desfazer bons candidatos para armazenamento em SSD.

Para obter informações sobre a configuração de tabelas espaços de desfazer adicionais, consulte a Seção 17.6.3.4, “Tabelas espaços de desfazer”.

#### Configuração global de espaço de tabela temporário

O espaço de tabela temporário global armazena segmentos de rollback para as alterações feitas em tabelas temporárias criadas pelo usuário.

Um único arquivo de dados de espaço de tabela temporário global de autoextensão chamado `ibtmp1` no diretório `innodb_data_home_dir` por padrão. O tamanho inicial do arquivo é ligeiramente maior que 12 MB.

A opção `innodb_temp_data_file_path` especifica o caminho, o nome do arquivo e o tamanho do arquivo para os arquivos de dados do espaço de tabela temporário global. O tamanho do arquivo é especificado em KB, MB ou GB, anexando K, M ou G ao valor do tamanho. O tamanho do arquivo ou o tamanho combinado do arquivo deve ser ligeiramente maior que 12 MB.

Para especificar um local alternativo para os arquivos de dados do espaço de tabela temporário global, configure a opção `innodb_temp_data_file_path` durante a inicialização.

#### Configuração de espaço de tabela temporário de sessão

No MySQL 8.0.15 e versões anteriores, os espaços de armazenamento temporários das sessões armazenam tabelas temporárias criadas pelo usuário e tabelas temporárias internas criadas pelo otimizador quando `InnoDB` é configurado como o mecanismo de armazenamento em disco para tabelas temporárias internas (`internal_tmp_disk_storage_engine=InnoDB`). A partir do MySQL 8.0.16, `InnoDB` é sempre usado como o mecanismo de armazenamento em disco para tabelas temporárias internas.

A variável `innodb_temp_tablespaces_dir` define o local onde o `InnoDB` cria espaços temporários de tabelas de sessão. O local padrão é o diretório `#innodb_temp` no diretório de dados.

Para especificar um local alternativo para os espaços de tabelas temporárias das sessões, configure a variável `innodb_temp_tablespaces_dir` durante a inicialização. É permitido um caminho totalmente qualificado ou um caminho relativo ao diretório de dados.

#### Configuração do tamanho da página

A opção `innodb_page_size` especifica o tamanho da página para todos os `InnoDB` espaços de tabela em uma instância do MySQL. Esse valor é definido quando a instância é criada e permanece constante posteriormente. Os valores válidos são 64KB, 32KB, 16KB (padrão), 8KB e 4KB. Alternativamente, você pode especificar o tamanho da página em bytes (65536, 32768, 16384, 8192, 4096).

O tamanho padrão de página de 16 KB é apropriado para uma ampla gama de cargas de trabalho, especialmente para consultas que envolvem varreduras de tabelas e operações de manipulação de dados de massa (DML) que envolvem atualizações em massa. Tamanhos de página menores podem ser mais eficientes para cargas de trabalho OLTP que envolvem muitos pequenos registros, onde a concorrência pode ser um problema quando uma única página contém muitas linhas. Páginas menores também podem ser mais eficientes para dispositivos de armazenamento SSD, que geralmente usam tamanhos de bloco pequenos. Manter o tamanho de página `InnoDB` próximo ao tamanho de bloco do dispositivo de armazenamento minimiza a quantidade de dados não alterados que são reescritos no disco.

Importante

`innodb_page_size` pode ser definido apenas ao inicializar o diretório de dados. Consulte a descrição desta variável para obter mais informações.

#### Configuração de Memória

O MySQL aloca memória para vários caches e buffers para melhorar o desempenho das operações do banco de dados. Ao alocar memória para `InnoDB`, sempre considere a memória necessária pelo sistema operacional, a memória alocada para outras aplicações e a memória alocada para outros buffers e caches do MySQL. Por exemplo, se você usar tabelas `MyISAM`, considere a quantidade de memória alocada para o buffer de chave (`key_buffer_size`). Para uma visão geral dos buffers e caches do MySQL, consulte a Seção 10.12.3.1, “Como o MySQL Usa a Memória”.

Os buffers específicos para `InnoDB` são configurados usando os seguintes parâmetros:

- `innodb_buffer_pool_size` define o tamanho do pool de buffers, que é a área de memória que armazena dados em cache para as tabelas `InnoDB`, índices e outros buffers auxiliares. O tamanho do pool de buffers é importante para o desempenho do sistema, e geralmente é recomendado que `innodb_buffer_pool_size` seja configurado para 50 a 75% da memória do sistema. O tamanho padrão do pool de buffers é de 128 MB. Para obter orientações adicionais, consulte a Seção 10.12.3.1, “Como o MySQL Usa a Memória”. Para informações sobre como configurar o tamanho do pool de buffers `InnoDB`, consulte a Seção 17.8.3.1, “Configurando o Tamanho do Pool de Buffers do InnoDB”. O tamanho do pool de buffers pode ser configurado no início ou dinamicamente.

  Em sistemas com uma grande quantidade de memória, você pode melhorar a concorrência dividindo o pool de buffers em várias instâncias do pool de buffers. O número de instâncias do pool de buffers é controlado pela opção `innodb_buffer_pool_instances`. Por padrão, `InnoDB` cria uma única instância do pool de buffers. O número de instâncias do pool de buffers pode ser configurado durante o início. Para mais informações, consulte a Seção 17.8.3.2, “Configurando Múltiplas Instâncias do Pool de Buffers”.

- `innodb_log_buffer_size` define o tamanho do buffer que `InnoDB` usa para gravar nos arquivos de log no disco. O tamanho padrão é de 16 MB. Um buffer de log grande permite que transações grandes sejam executadas sem gravar o log no disco antes do commit das transações. Se você tiver transações que atualizam, inserem ou excluem muitas linhas, pode considerar aumentar o tamanho do buffer de log para economizar I/O no disco. `innodb_log_buffer_size` pode ser configurado na inicialização. Para informações relacionadas, consulte a Seção 10.5.4, “Otimizando o Registro de Refazimento InnoDB”.

Aviso

No GNU/Linux x86 de 32 bits, se o uso de memória for configurado muito alto, o `glibc` pode permitir que o heap do processo cresça além das pilhas de threads, causando uma falha no servidor. Esse é um risco se a memória alocada ao processo **mysqld** para buffers e caches globais e por thread estiver próxima ou exceder 2 GB.

Uma fórmula semelhante à seguinte, que calcula a alocação de memória global e por fio para o MySQL, pode ser usada para estimar o uso de memória do MySQL. Você pode precisar modificar a fórmula para levar em conta os buffers e caches na sua versão e configuração do MySQL. Para uma visão geral dos buffers e caches do MySQL, consulte a Seção 10.12.3.1, “Como o MySQL Usa a Memória”.

```
innodb_buffer_pool_size
+ key_buffer_size
+ max_connections*(sort_buffer_size+read_buffer_size+binlog_cache_size)
+ max_connections*2MB
```

Cada fio usa uma pilha (geralmente 2 MB, mas apenas 256 KB nos binários do MySQL fornecidos pela Oracle Corporation.) e, no pior dos casos, também usa `sort_buffer_size + read_buffer_size` memória adicional.

No Linux, se o kernel estiver habilitado para suporte a páginas grandes, o `InnoDB` pode usar páginas grandes para alocar memória para seu pool de buffers. Veja a Seção 10.12.3.3, “Habilitar Suporte a Páginas Grandes”.
