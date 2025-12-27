### 17.8.1 Configuração de Inicialização do InnoDB

As primeiras decisões sobre a configuração do `InnoDB` envolvem a configuração dos arquivos de dados, arquivos de log, tamanho da página e buffers de memória, que devem ser configurados antes de inicializar o `InnoDB`. Modificar a configuração após o `InnoDB` ser inicializado pode envolver procedimentos não triviais.

Esta seção fornece informações sobre a especificação de configurações do `InnoDB` em um arquivo de opções, visualização das informações de inicialização do `InnoDB` e considerações importantes sobre armazenamento.

* Especificação de Opções em um Arquivo de Opções do MySQL
* Visualização das Informações de Inicialização do InnoDB
* Considerações Importantes sobre Armazenamento
* Configuração do Arquivo de Dados do Espaço de Armazenamento do Sistema
* Configuração do Arquivo de Buffer de Dupla Escrita do InnoDB
* Configuração do Log de Refazer
* Configuração do Espaço de Armazenamento de Refazer
* Configuração do Espaço de Armazenamento Temporário Global
* Configuração do Espaço de Armazenamento Temporário de Sessão
* Configuração do Tamanho da Página
* Configuração de Memória

#### Especificação de Opções em um Arquivo de Opções do MySQL

Como o MySQL usa configurações de arquivos de dados, arquivos de log e tamanho da página para inicializar o `InnoDB`, recomenda-se que você defina essas configurações em um arquivo de opções que o MySQL lê ao inicializar, antes de inicializar o `InnoDB`. Normalmente, o `InnoDB` é inicializado quando o servidor MySQL é iniciado pela primeira vez.

Você pode colocar as opções do `InnoDB` no grupo `[mysqld]` de qualquer arquivo de opções que o seu servidor lê ao iniciar. Os locais dos arquivos de opções do MySQL são descritos na Seção 6.2.2.2, “Uso de Arquivos de Opções”.

Para garantir que o **mysqld** leia as opções apenas de um arquivo específico (e `mysqld-auto.cnf`), use a opção `--defaults-file` como a primeira opção na linha de comando ao iniciar o servidor:

```
mysqld --defaults-file=path_to_option_file
```

#### Visualização das Informações de Inicialização do InnoDB

Para visualizar as informações de inicialização do `InnoDB` durante a inicialização, inicie o **mysqld** a partir de um prompt de comando, que imprime as informações de inicialização no console.

Por exemplo, no Windows, se o **mysqld** estiver localizado em `C:\Program Files\MySQL\MySQL Server 9.5\bin`, inicie o servidor MySQL da seguinte forma:

```
C:\> "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysqld" --console
```

Em sistemas semelhantes ao Unix, o **mysqld** está localizado no diretório `bin` da sua instalação do MySQL:

```
$> bin/mysqld --user=mysql &
```

Se você não enviar a saída do servidor para o console, verifique o log de erro após a inicialização para ver as informações de inicialização do `InnoDB` impressas durante o processo de inicialização.

Para obter informações sobre como iniciar o MySQL usando outros métodos, consulte a Seção 2.9.5, “Iniciar e Parar o MySQL Automaticamente”.

Observação

O `InnoDB` não abre todas as tabelas do usuário e os arquivos de dados associados durante a inicialização. No entanto, o `InnoDB` verifica a existência de arquivos de espaço de tabela referenciados no dicionário de dados. Se um arquivo de espaço de tabela não for encontrado, o `InnoDB` registra um erro e continua a sequência de inicialização. Arquivos de espaço de tabela referenciados no log de redo podem ser abertos durante a recuperação de falhas para a aplicação de redo.

#### Considerações Importantes sobre Armazenamento

Revise as seguintes considerações relacionadas ao armazenamento antes de prosseguir com a configuração de inicialização.

* Em alguns casos, você pode melhorar o desempenho do banco de dados ao colocar os arquivos de dados e log em discos físicos separados. Você também pode usar partições de disco bruto (dispositivos brutos) para os arquivos de dados do `InnoDB`, o que pode acelerar a I/O. Consulte Usar Partições de Disco Bruto para o Espaço de Tabela do Sistema.

* `InnoDB` é um motor de armazenamento seguro para transações (compatível com ACID) com capacidades de commit, rollback e recuperação em caso de falha para proteger os dados do usuário. **No entanto, ele não pode fazer isso** se o sistema operacional ou o hardware subjacente não funcionar conforme anunciado. Muitos sistemas operacionais ou subsistemas de disco podem atrasar ou reorganizar operações de escrita para melhorar o desempenho. Em alguns sistemas operacionais, a própria chamada de sistema `fsync()` que deveria esperar até que todos os dados não escritos de um arquivo tenham sido descarregados pode, na verdade, retornar antes de os dados terem sido descarregados para o armazenamento estável. Por isso, um travamento do sistema operacional ou uma queda de energia podem destruir dados recentemente comprometidos ou, no pior dos casos, até corromper o banco de dados porque as operações de escrita foram reorganizadas. Se a integridade dos dados é importante para você, realize testes de "desligar" antes de usar qualquer coisa em produção. No macOS, `InnoDB` usa um método especial de esvaziamento de arquivo `fcntl()`. Sob o Linux, é aconselhável **desativar o cache de escrita de volta**.
  Em unidades de disco ATA/SATA, um comando como `hdparm -W0 /dev/hda` pode funcionar para desativar o cache de escrita de volta. **Cuidado para que algumas unidades ou controladores de disco não consigam desativar o cache de escrita de volta.**

* Em relação às capacidades de recuperação do `InnoDB` que protegem os dados do usuário, o `InnoDB` utiliza uma técnica de esvaziamento de arquivos que envolve uma estrutura chamada buffer de dupla gravação, que é ativada por padrão (`innodb_doublewrite=ON`). O buffer de dupla gravação adiciona segurança à recuperação após uma saída inesperada ou queda de energia, e melhora o desempenho na maioria das variedades de Unix, reduzindo a necessidade de operações `fsync()`. Recomenda-se que a opção `innodb_doublewrite` permaneça ativada se você estiver preocupado com a integridade dos dados ou possíveis falhas. Para informações sobre o buffer de dupla gravação, consulte a Seção 17.11.1, “I/O de Disco do InnoDB”.

* Antes de usar o NFS com o `InnoDB`, revise os problemas potenciais descritos em Usar NFS com MySQL.

#### Configuração do Arquivo de Dados do Espaço de Tabela do Sistema

A opção `innodb_data_file_path` define o nome, tamanho e atributos dos arquivos de dados do espaço de tabela do sistema do `InnoDB`. Se você não configurar essa opção antes de inicializar o servidor MySQL, o comportamento padrão é criar um único arquivo de dados auto-extensível, ligeiramente maior que 12 MB, chamado `ibdata1`:

```
mysql> SHOW VARIABLES LIKE 'innodb_data_file_path';
+-----------------------+------------------------+
| Variable_name         | Value                  |
+-----------------------+------------------------+
| innodb_data_file_path | ibdata1:12M:autoextend |
+-----------------------+------------------------+
```

A sintaxe completa da especificação do arquivo de dados inclui o nome do arquivo, o tamanho do arquivo, o atributo `autoextend` e o atributo `max`:

```
file_name:file_size[:autoextend[:max:max_file_size]]
```

Os tamanhos dos arquivos são especificados em kilobytes, megabytes ou gigabytes, anexando `K`, `M` ou `G` ao valor do tamanho. Se você especificar o tamanho do arquivo de dados em kilobytes, faça isso em múltiplos de 1024. Caso contrário, os valores em kilobytes são arredondados para o limite mais próximo de megabyte (MB). A soma dos tamanhos dos arquivos deve, no mínimo, ser ligeiramente maior que 12 MB.

Você pode especificar mais de um arquivo de dados usando uma lista separada por ponto e vírgula. Por exemplo:

```
[mysqld]
innodb_data_file_path=ibdata1:50M;ibdata2:50M:autoextend
```

Os atributos `autoextend` e `max` podem ser usados apenas para o arquivo de dados especificado por último.

Quando o atributo `autoextend` é especificado, o arquivo de dados aumenta automaticamente em incrementos de 64 MB à medida que o espaço necessário é exigido. A variável `innodb_autoextend_increment` controla o tamanho do incremento.

Para especificar um tamanho máximo para um arquivo de dados auto-extensível, use o atributo `max` após o atributo `autoextend`. Use o atributo `max` apenas em casos em que a restrição do uso do disco é de importância crítica. A configuração seguinte permite que o `ibdata1` cresça até um limite de 500 MB:

```
[mysqld]
innodb_data_file_path=ibdata1:12M:autoextend:max:500M
```

Um tamanho mínimo de arquivo é exigido para o *primeiro* arquivo de dados do espaço de tabelas do sistema para garantir que haja espaço suficiente para as páginas do buffer de escrita dupla. A tabela a seguir mostra os tamanhos mínimos de arquivo para cada tamanho de página do `InnoDB`. O tamanho padrão da página do `InnoDB` é 16384 (16 KB).

<table summary="O tamanho mínimo do arquivo de tabelas do sistema para cada tamanho de página do InnoDB."><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Tamanho da Página (innodb_page_size)</th> <th>Tamanho Mínimo do Arquivo</th> </tr></thead><tbody><tr> <td>16384 (16 KB) ou menos</td> <td>5 MB</td> </tr><tr> <td>32768 (32 KB)</td> <td>6 MB</td> </tr><tr> <td>65536 (64 KB)</td> <td>12 MB</td> </tr></tbody></table>

Se o disco ficar cheio, você pode adicionar um arquivo de dados em outro disco. Para obter instruções, consulte Redimensionamento do Espaço de Tabelas do Sistema.

O limite de tamanho para arquivos individuais é determinado pelo seu sistema operacional. Você pode definir o tamanho do arquivo para mais de 4 GB em sistemas operacionais que suportam arquivos grandes. Você também pode usar partições de disco bruto como arquivos de dados. Consulte Uso de Partições de Disco Bruto para o Espaço de Tabelas do Sistema.

O `InnoDB` não tem conhecimento do tamanho máximo do arquivo do sistema de arquivos, então seja cauteloso em sistemas de arquivos onde o tamanho máximo do arquivo é um valor pequeno, como 2 GB.

Os arquivos de espaço de tabela do sistema são criados no diretório de dados por padrão (`datadir`). Para especificar um local alternativo, use a opção `innodb_data_home_dir`. Por exemplo, para criar um arquivo de dados de espaço de tabela do sistema em um diretório chamado `myibdata`, use esta configuração:

```
[mysqld]
innodb_data_home_dir = /myibdata/
innodb_data_file_path=ibdata1:50M:autoextend
```

Uma barra invertida final é necessária ao especificar um valor para `innodb_data_home_dir`. O `InnoDB` não cria diretórios, então certifique-se de que o diretório especificado existe antes de iniciar o servidor. Além disso, certifique-se de que o servidor MySQL tenha os devidos direitos de acesso para criar arquivos no diretório.

O `InnoDB` forma o caminho do diretório para cada arquivo de dados concatenando o valor de `innodb_data_home_dir` ao nome do arquivo de dados. Se `innodb_data_home_dir` não for definido, o valor padrão é “./”, que é o diretório de dados. (O servidor MySQL muda seu diretório de trabalho atual para o diretório de dados quando começa a executar.)

Alternativamente, você pode especificar um caminho absoluto para arquivos de dados de espaço de tabela do sistema. A seguinte configuração é equivalente à anterior:

```
[mysqld]
innodb_data_file_path=/myibdata/ibdata1:50M:autoextend
```

Quando você especifica um caminho absoluto para `innodb_data_file_path`, o ajuste não é concatenado com o ajuste `innodb_data_home_dir`. Arquivos de dados de espaço de tabela do sistema são criados no caminho absoluto especificado. O diretório especificado deve existir antes de iniciar o servidor.

#### Configuração do Arquivo de Buffer de Doublewrite do InnoDB

A área de armazenamento do buffer de escrita dupla do `InnoDB` reside em arquivos de escrita dupla, o que oferece flexibilidade em relação à localização de armazenamento das páginas de escrita dupla. Em versões anteriores, a área de armazenamento do buffer de escrita dupla residia no espaço de tabelas do sistema. A variável `innodb_doublewrite_dir` define o diretório onde o `InnoDB` cria arquivos de escrita dupla ao inicializar. Se não for especificado nenhum diretório, os arquivos de escrita dupla são criados no diretório `innodb_data_home_dir`, que tem como padrão o diretório de dados, se não for especificado.

Para que os arquivos de escrita dupla sejam criados em uma localização diferente do diretório `innodb_data_home_dir`, configure a variável `innodb_doublewrite_dir`. Por exemplo:

```
innodb_doublewrite_dir=/path/to/doublewrite_directory
```

Outras variáveis de buffer de escrita dupla permitem definir o número de arquivos de escrita dupla, o número de páginas por thread e o tamanho do lote de escrita dupla. Para obter mais informações sobre a configuração do buffer de escrita dupla, consulte a Seção 17.6.4, “Buffer de Escrita Dupla”.

#### Configuração do Log de Revisão

A quantidade de espaço em disco ocupada pelos arquivos de log de revisão é controlada pela variável `innodb_redo_log_capacity`, que pode ser definida ao inicializar ou em tempo de execução; por exemplo, para definir a variável para 8GiB em um arquivo de opções, adicione a seguinte entrada:

```
[mysqld]
innodb_redo_log_capacity = 8589934592
```

Para obter informações sobre a configuração da capacidade do log de revisão em tempo de execução, consulte Configurando a Capacidade do Log de Revisão.

O `InnoDB` tenta manter 32 arquivos de log de revisão, com cada arquivo igual a 1/32 * `innodb_redo_log_capacity`. Os arquivos de log de revisão residem no diretório `#innodb_redo` no diretório de dados, a menos que um diretório diferente tenha sido especificado pela variável `innodb_log_group_home_dir`. Se `innodb_log_group_home_dir` foi definido, os arquivos de log de revisão residem no diretório `#innodb_redo` nesse diretório. Para mais informações, consulte a Seção 17.6.5, “Log de Revisão”.

O `innodb_log_group_home_dir` define o caminho do diretório para os arquivos de log do `InnoDB`. Você pode usar essa opção para colocar os arquivos de log de reverso do `InnoDB` em um local de armazenamento físico diferente dos arquivos de dados do `InnoDB` para evitar potenciais conflitos de recursos de E/S; por exemplo:

```
[mysqld]
innodb_log_group_home_dir = /dr3/iblogs
```

Observação

O `InnoDB` não cria diretórios, então certifique-se de que o diretório de log existe antes de iniciar o servidor. Use o comando `mkdir` do Unix ou DOS para criar os diretórios necessários.

Certifique-se de que o servidor MySQL tenha os devidos direitos de acesso para criar arquivos no diretório de log. De forma mais geral, o servidor deve ter direitos de acesso em qualquer diretório onde ele precise criar arquivos.

#### Configuração do Espaço de Tabela de Reversão

Por padrão, os logs de reversão residem em dois espaços de tabela de reversão criados quando a instância do MySQL é inicializada.

A variável `innodb_undo_directory` define o caminho onde o `InnoDB` cria espaços de tabela de reversão padrão. Se essa variável não for definida, os espaços de tabela de reversão padrão são criados no diretório de dados. A variável `innodb_undo_directory` não é dinâmica. Configurar isso requer reiniciar o servidor.

Os padrões de E/S para logs de reversão tornam os espaços de tabela de reversão bons candidatos para armazenamento em SSD.

Para obter informações sobre a configuração de espaços de tabela de reversão adicionais, consulte a Seção 17.6.3.4, “Espaços de Tabela de Reversão”.

#### Configuração do Espaço de Tabela Temporal Global

O espaço de tabela temporal global armazena segmentos de rollback para alterações feitas em tabelas temporárias criadas pelo usuário.

Um único arquivo de dados do espaço de tabela temporal global auto-extensibile chamado `ibtmp1` no diretório `innodb_data_home_dir` por padrão. O tamanho inicial do arquivo é ligeiramente maior que 12 MB.

A opção `innodb_temp_data_file_path` especifica o caminho, o nome do arquivo e o tamanho do arquivo para os arquivos de dados do espaço de tabelas temporárias globais. O tamanho do arquivo é especificado em KB, MB ou GB, anexando K, M ou G ao valor do tamanho. O tamanho do arquivo ou o tamanho combinado do arquivo deve ser ligeiramente maior que 12 MB.

Para especificar um local alternativo para os arquivos de dados do espaço de tabelas temporárias globais, configure a opção `innodb_temp_data_file_path` durante a inicialização.

#### Configuração do Espaço de Tabelas Temporárias de Sessão

No MySQL 9.5, o `InnoDB` é sempre usado como o motor de armazenamento no disco para tabelas temporárias internas.

A variável `innodb_temp_tablespaces_dir` define o local onde o `InnoDB` cria espaços de tabelas temporárias de sessão. A localização padrão é o diretório `#innodb_temp` no diretório de dados.

Para especificar um local alternativo para os espaços de tabelas temporárias de sessão, configure a variável `innodb_temp_tablespaces_dir` durante a inicialização. É permitido um caminho totalmente qualificado ou um caminho relativo ao diretório de dados.

#### Configuração do Tamanho da Página

A opção `innodb_page_size` especifica o tamanho da página para todos os espaços de tabelas `InnoDB` em uma instância do MySQL. Esse valor é definido quando a instância é criada e permanece constante posteriormente. Os valores válidos são 64 KB, 32 KB, 16 KB (o padrão), 8 KB e 4 KB. Alternativamente, você pode especificar o tamanho da página em bytes (65536, 32768, 16384, 8192, 4096).

O tamanho padrão de página de 16 KB é apropriado para uma ampla gama de cargas de trabalho, especialmente para consultas que envolvem varreduras de tabelas e operações de manipulação de dados de massa (DML) que envolvem atualizações em massa. Tamanhos de página menores podem ser mais eficientes para cargas de trabalho OLTP que envolvem muitos pequenos registros, onde a concorrência pode ser um problema quando uma única página contém muitas linhas. Páginas menores também podem ser mais eficientes para dispositivos de armazenamento SSD, que geralmente usam tamanhos de bloco pequenos. Manter o tamanho de página do `InnoDB` próximo ao tamanho de bloco do dispositivo de armazenamento minimiza a quantidade de dados não alterados que são reescritos no disco.

Importante

`innodb_page_size` pode ser definido apenas ao inicializar o diretório de dados. Consulte a descrição desta variável para obter mais informações.

#### Configuração de Memória

O MySQL aloca memória para vários caches e buffers para melhorar o desempenho das operações do banco de dados. Ao alocar memória para o `InnoDB`, sempre considere a memória necessária pelo sistema operacional, a memória alocada para outras aplicações e a memória alocada para outros buffers e caches do MySQL. Por exemplo, se você usar tabelas `MyISAM`, considere a quantidade de memória alocada para o buffer de chave (`key_buffer_size`). Para uma visão geral dos buffers e caches do MySQL, consulte a Seção 10.12.3.1, “Como o MySQL Usa Memória”.

Os buffers específicos para `InnoDB` são configurados usando os seguintes parâmetros:

* `innodb_buffer_pool_size` define o tamanho do pool de buffers, que é a área de memória que armazena dados em cache para as tabelas `InnoDB`, índices e outros buffers auxiliares. O tamanho do pool de buffers é importante para o desempenho do sistema, e normalmente é recomendado que `innodb_buffer_pool_size` seja configurado para 50 a 75% da memória do sistema. O tamanho padrão do pool de buffers é de 128MB. Para obter orientações adicionais, consulte a Seção 10.12.3.1, “Como o MySQL Usa a Memória”. Para informações sobre como configurar o tamanho do pool de buffers de `InnoDB`, consulte a Seção 17.8.3.1, “Configurando o Tamanho do Pool de Buffers de `InnoDB’”. O tamanho do pool de buffers pode ser configurado no início ou dinamicamente.

Em sistemas com uma grande quantidade de memória, você pode melhorar a concorrência dividindo o pool de buffers em várias instâncias do pool de buffers. O número de instâncias do pool de buffers é controlado pela opção `innodb_buffer_pool_instances`. Por padrão, o `InnoDB` cria uma instância do pool de buffers. O número de instâncias do pool de buffers pode ser configurado no início. Para mais informações, consulte a Seção 17.8.3.2, “Configurando Múltiplas Instâncias do Pool de Buffers”.

* `innodb_log_buffer_size` define o tamanho do buffer que o `InnoDB` usa para escrever nos arquivos de log no disco. O tamanho padrão é de 64MB. Um buffer de log grande permite que transações grandes sejam executadas sem escrever o log no disco antes do commit das transações. Se você tiver transações que atualizam, inserem ou excluem muitas linhas, você pode considerar aumentar o tamanho do buffer de log para economizar I/O de disco. `innodb_log_buffer_size` pode ser configurado no início. Para informações relacionadas, consulte a Seção 10.5.4, “Otimizando o Registro de Refazer do `InnoDB’”.

Aviso

No GNU/Linux x86 de 32 bits, se o uso de memória estiver configurado muito alto, o `glibc` pode permitir que o heap do processo cresça além das pilhas de threads, causando uma falha no servidor. Esse é um risco se a memória alocada para o processo **mysqld** para buffers e caches globais e por thread estiver próxima ou exceder 2 GB.

Uma fórmula semelhante à seguinte, que calcula a alocação de memória global e por thread para o MySQL, pode ser usada para estimar o uso de memória do MySQL. Você pode precisar modificar a fórmula para levar em conta os buffers e caches na sua versão e configuração do MySQL. Para uma visão geral dos buffers e caches do MySQL, consulte a Seção 10.12.3.1, “Como o MySQL usa memória”.

```
innodb_buffer_pool_size
+ key_buffer_size
+ max_connections*(sort_buffer_size+read_buffer_size+binlog_cache_size)
+ max_connections*2MB
```

Cada thread usa uma pilha (geralmente 2 MB, mas apenas 256 KB nos binários do MySQL fornecidos pela Oracle Corporation.) e, no pior dos casos, também usa `sort_buffer_size + read_buffer_size` memória adicional.

No Linux, se o kernel estiver habilitado para suporte a páginas grandes, o `InnoDB` pode usar páginas grandes para alocar memória para seu pool de buffers. Veja a Seção 10.12.3.3, “Habilitar suporte a páginas grandes”.