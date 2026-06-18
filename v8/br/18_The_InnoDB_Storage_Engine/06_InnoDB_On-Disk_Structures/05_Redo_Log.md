### 17.6.5 Registro de Refazer

O log de refazer é uma estrutura de dados baseada em disco usada durante a recuperação em caso de falha para corrigir dados escritos por transações incompletas. Durante operações normais, o log de refazer codifica solicitações para alterar dados de tabelas que resultam de instruções SQL ou chamadas de API de nível baixo. As modificações que não terminaram de atualizar os arquivos de dados antes de um desligamento inesperado são regravadas automaticamente durante a inicialização e antes que as conexões sejam aceitas. Para obter informações sobre o papel do log de refazer na recuperação em caso de falha, consulte a Seção 17.18.2, “Recuperação do InnoDB”.

O log de refazer é representado fisicamente no disco por arquivos de log de refazer. Os dados que são escritos nos arquivos de log de refazer são codificados em termos de registros afetados, e esses dados são coletivamente referidos como refazer. A passagem dos dados pelos arquivos de log de refazer é representada por um valor de LSN (Local Sequence Number) sempre crescente. Os dados do log de refazer são anexados à medida que ocorrem as modificações de dados, e os dados mais antigos são truncados à medida que o ponto de verificação avança.

As informações e os procedimentos relacionados aos registros de revisão são descritos nos seguintes tópicos na seção:

- Configurar a capacidade do log de refazer (MySQL 8.0.30 ou superior)
- Configurar a capacidade do log de refazer (antes do MySQL 8.0.30)")
- Configuração da capacidade do log de refação automática
- Arquivamento do Log do Redo
- Desativar o registro de refazer
- Tópicos relacionados

#### Configurando a capacidade do log de refazer (MySQL 8.0.30 ou superior)

A partir do MySQL 8.0.30, a variável de sistema `innodb_redo_log_capacity` controla a quantidade de espaço em disco ocupada pelos arquivos de log de refazer. Você pode definir essa variável em um arquivo de opções durante o início ou durante o runtime usando uma declaração `SET GLOBAL`; por exemplo, a seguinte declaração define a capacidade do log de refazer para 8 GB:

```
SET GLOBAL innodb_redo_log_capacity = 8589934592;
```

Quando configurado durante a execução, a alteração da configuração ocorre imediatamente, mas pode levar algum tempo para o novo limite ser totalmente implementado. Se os arquivos de log de reversão ocuparem menos espaço do que o valor especificado, as páginas sujas serão descartadas do pool de buffer para os arquivos de dados do espaço de tabelas de forma menos agressiva, aumentando eventualmente o espaço em disco ocupado pelos arquivos de log de reversão. Se os arquivos de log de reversão ocuparem mais espaço do que o valor especificado, as páginas sujas serão descartadas de forma mais agressiva, diminuindo eventualmente o espaço em disco ocupado pelos arquivos de log de reversão.

Se `innodb_redo_log_capacity` não for definido e se nem `innodb_log_file_size` nem `innodb_log_files_in_group` forem definidos, então o valor padrão de `innodb_redo_log_capacity` será utilizado.

Se `innodb_redo_log_capacity` não estiver definido e se `innodb_log_file_size` e/ou `innodb_log_files_in_group` estiverem definidos, a capacidade do log de reverso do InnoDB será calculada como *(innodb\_log\_files\_in\_group \* innodb\_log\_file\_size)*. Esse cálculo não altera o valor da configuração `innodb_redo_log_capacity` não utilizada.

A variável de status do servidor `Innodb_redo_log_capacity_resized` indica a capacidade total do log de reverso para todos os arquivos de log de reverso.

Os arquivos de log de recuperação estão no diretório `#innodb_redo` no diretório de dados, a menos que um diretório diferente tenha sido especificado pela variável `innodb_log_group_home_dir`. Se `innodb_log_group_home_dir` foi definido, os arquivos de log de recuperação são encontrados no diretório `#innodb_redo` nesse diretório. Existem dois tipos de arquivos de log de recuperação: comuns e de reserva. Os arquivos de log de recuperação comuns são aqueles que estão sendo usados. Os arquivos de log de recuperação de reserva são aqueles que estão aguardando para serem usados. `InnoDB` tenta manter 32 arquivos de log de recuperação no total, com cada arquivo sendo igual em tamanho a 1/32 \* `innodb_redo_log_capacity`; no entanto, os tamanhos dos arquivos podem diferir por um tempo após a modificação da configuração `innodb_redo_log_capacity`.

Os arquivos de log de recuperação usam uma convenção de nomeação `#ib_redoN`, onde `N` é o número do arquivo de log de recuperação. Os arquivos de log de recuperação de reserva são indicados por um sufixo `_tmp`. O exemplo a seguir mostra os arquivos de log de recuperação em um diretório `#innodb_redo`, onde há 21 arquivos de log de recuperação ativos e 11 arquivos de log de recuperação de reserva, numerados sequencialmente.

```
'#ib_redo582'  '#ib_redo590'  '#ib_redo598'      '#ib_redo606_tmp'
'#ib_redo583'  '#ib_redo591'  '#ib_redo599'      '#ib_redo607_tmp'
'#ib_redo584'  '#ib_redo592'  '#ib_redo600'      '#ib_redo608_tmp'
'#ib_redo585'  '#ib_redo593'  '#ib_redo601'      '#ib_redo609_tmp'
'#ib_redo586'  '#ib_redo594'  '#ib_redo602'      '#ib_redo610_tmp'
'#ib_redo587'  '#ib_redo595'  '#ib_redo603_tmp'  '#ib_redo611_tmp'
'#ib_redo588'  '#ib_redo596'  '#ib_redo604_tmp'  '#ib_redo612_tmp'
'#ib_redo589'  '#ib_redo597'  '#ib_redo605_tmp'  '#ib_redo613_tmp'
```

Cada arquivo de registro de recuperação normal está associado a um intervalo específico de valores LSN; por exemplo, a seguinte consulta mostra os valores `START_LSN` e `END_LSN` para os arquivos de registro de recuperação ativos listados no exemplo anterior:

```
mysql> SELECT FILE_NAME, START_LSN, END_LSN FROM performance_schema.innodb_redo_log_files;
+----------------------------+--------------+--------------+
| FILE_NAME                  | START_LSN    | END_LSN      |
+----------------------------+--------------+--------------+
| ./#innodb_redo/#ib_redo582 | 117654982144 | 117658256896 |
| ./#innodb_redo/#ib_redo583 | 117658256896 | 117661531648 |
| ./#innodb_redo/#ib_redo584 | 117661531648 | 117664806400 |
| ./#innodb_redo/#ib_redo585 | 117664806400 | 117668081152 |
| ./#innodb_redo/#ib_redo586 | 117668081152 | 117671355904 |
| ./#innodb_redo/#ib_redo587 | 117671355904 | 117674630656 |
| ./#innodb_redo/#ib_redo588 | 117674630656 | 117677905408 |
| ./#innodb_redo/#ib_redo589 | 117677905408 | 117681180160 |
| ./#innodb_redo/#ib_redo590 | 117681180160 | 117684454912 |
| ./#innodb_redo/#ib_redo591 | 117684454912 | 117687729664 |
| ./#innodb_redo/#ib_redo592 | 117687729664 | 117691004416 |
| ./#innodb_redo/#ib_redo593 | 117691004416 | 117694279168 |
| ./#innodb_redo/#ib_redo594 | 117694279168 | 117697553920 |
| ./#innodb_redo/#ib_redo595 | 117697553920 | 117700828672 |
| ./#innodb_redo/#ib_redo596 | 117700828672 | 117704103424 |
| ./#innodb_redo/#ib_redo597 | 117704103424 | 117707378176 |
| ./#innodb_redo/#ib_redo598 | 117707378176 | 117710652928 |
| ./#innodb_redo/#ib_redo599 | 117710652928 | 117713927680 |
| ./#innodb_redo/#ib_redo600 | 117713927680 | 117717202432 |
| ./#innodb_redo/#ib_redo601 | 117717202432 | 117720477184 |
| ./#innodb_redo/#ib_redo602 | 117720477184 | 117723751936 |
+----------------------------+--------------+--------------+
```

Ao realizar um ponto de verificação, o `InnoDB` armazena o LSN do ponto de verificação no cabeçalho do arquivo que contém esse LSN. Durante a recuperação, todos os arquivos de log de reverso são verificados e a recuperação começa no LSN mais recente do ponto de verificação.

Várias variáveis de status são fornecidas para monitorar as operações de redimensionamento do log de refazer e da capacidade do log de refazer; por exemplo, você pode consultar `Innodb_redo_log_resize_status` para visualizar o status de uma operação de redimensionamento:

```
mysql> SHOW STATUS LIKE 'Innodb_redo_log_resize_status';
+-------------------------------+-------+
| Variable_name                 | Value |
+-------------------------------+-------+
| Innodb_redo_log_resize_status | OK    |
+-------------------------------+-------+
```

A variável de status `Innodb_redo_log_capacity_resized` mostra o limite atual de capacidade do log de reversão:

```
mysql> SHOW STATUS LIKE 'Innodb_redo_log_capacity_resized';
 +----------------------------------+-----------+
| Variable_name                    | Value     |
+----------------------------------+-----------+
| Innodb_redo_log_capacity_resized | 104857600 |
+----------------------------------+-----------+
```

Outras variáveis de status aplicáveis incluem:

- `Innodb_redo_log_checkpoint_lsn`
- `Innodb_redo_log_current_lsn`
- `Innodb_redo_log_flushed_to_disk_lsn`
- `Innodb_redo_log_logical_size`
- `Innodb_redo_log_physical_size`
- `Innodb_redo_log_read_only`
- `Innodb_redo_log_uuid`

Consulte as descrições das variáveis de status para obter mais informações.

Você pode visualizar informações sobre os arquivos de log de reversão ativos consultando a tabela `innodb_redo_log_files` do Schema de Desempenho. A consulta a seguir recupera dados de todas as colunas da tabela:

```
SELECT FILE_ID, START_LSN, END_LSN, SIZE_IN_BYTES, IS_FULL, CONSUMER_LEVEL
FROM performance_schema.innodb_redo_log_files;
```

#### Configurando a capacidade do log de refazer (antes do MySQL 8.0.30)

Antes do MySQL 8.0.30, o `InnoDB` cria dois arquivos de log de refazer no diretório de dados por padrão, com os nomes `ib_logfile0` e `ib_logfile1`, e escreve nesses arquivos de forma circular.

Para modificar a capacidade do log de reversão, é necessário alterar o número ou o tamanho dos arquivos do log de reversão, ou ambos.

1. Pare o servidor MySQL e certifique-se de que ele seja desligado sem erros.

2. Editar `my.cnf` para alterar a configuração do arquivo de log de refazer. Para alterar o tamanho do arquivo de log de refazer, configure `innodb_log_file_size`. Para aumentar o número de arquivos de log de refazer, configure `innodb_log_files_in_group`.

3. Reinicie o servidor MySQL.

Se o `InnoDB` detectar que o `innodb_log_file_size` difere do tamanho do arquivo de log de revisão, ele escreve um ponto de verificação de log, fecha e remove os arquivos de log antigos, cria novos arquivos de log no tamanho solicitado e abre os novos arquivos de log.

#### Configuração da capacidade do log de refação automática

Quando o servidor é iniciado com `--innodb-dedicated-server`, o `InnoDB` calcula e define automaticamente os valores para certos parâmetros `InnoDB`, incluindo a capacidade do log de reversão. A configuração automatizada é destinada a instâncias do MySQL que residem em um servidor dedicado ao MySQL, onde o servidor MySQL pode usar todos os recursos do sistema disponíveis. Para mais informações, consulte a Seção 17.8.12, “Habilitar Configuração Automática do InnoDB para um Servidor MySQL Dedicado”.

#### Arquivamento do Log do Redo

As ferramentas de backup que copiam registros do log de refazer podem, às vezes, não acompanhar a geração do log de refazer enquanto uma operação de backup está em andamento, resultando na perda de registros do log de refazer devido a esses registros serem sobrescritos. Esse problema ocorre com mais frequência quando há uma atividade significativa do servidor MySQL durante a operação de backup e o meio de armazenamento do arquivo de log de refazer opera em uma velocidade mais rápida do que o meio de armazenamento do backup. O recurso de arquivamento do log de refazer, introduzido no MySQL 8.0.17, resolve esse problema ao escrever sequencialmente os registros do log de refazer em um arquivo de arquivo, além dos arquivos do log de refazer. As ferramentas de backup podem copiar os registros do log de refazer do arquivo de arquivo conforme necessário, evitando assim a perda potencial de dados.

Se o arquivamento do log de refazer estiver configurado no servidor, o MySQL Enterprise Backup, disponível com a Edição Empresarial do MySQL, utiliza o recurso de arquivamento do log de refazer ao fazer o backup de um servidor MySQL.

Para habilitar o arquivamento do log de reversão no servidor, é necessário definir um valor para a variável de sistema `innodb_redo_log_archive_dirs`. O valor é especificado como uma lista separada por ponto-e-vírgula de diretórios de arquivo de log de reversão rotulados. O par `label:directory` é separado por dois pontos (`:`). Por exemplo:

```
mysql> SET GLOBAL innodb_redo_log_archive_dirs='label1:directory_path1[;label2:directory_path2;…]';
```

O \*`label` é um identificador arbitrário para o diretório do arquivo. Pode ser qualquer string de caracteres, com exceção dos colchetes (:), que não são permitidos. Um rótulo vazio também é permitido, mas o colon (:) ainda é necessário neste caso. Um `directory_path` deve ser especificado. O diretório selecionado para o arquivo de log de refazer deve existir quando o arquivamento do log de refazer for ativado, ou será retornado um erro. O caminho pode conter colchetes ('':\`''), mas ponto e vírgula (;) não são permitidos.

A variável `innodb_redo_log_archive_dirs` deve ser configurada antes que o arquivamento do log de refazer possa ser ativado. O valor padrão é `NULL`, que não permite a ativação do arquivamento do log de refazer.

Notas

Os diretórios de arquivo que você especificar devem atender aos seguintes requisitos. (Os requisitos são aplicados quando a arquivamento do log de refazer é ativado.):

- As diretórios devem existir. As diretórios não são criados pelo processo de arquivo de log de refazer. Caso contrário, o seguinte erro é retornado:

  ERRO 3844 (HY000): O diretório de arquivo de log refeito '`directory_path1`' não existe ou não é um diretório

- As diretórios não devem ser acessíveis mundialmente. Isso é para evitar que os dados do log de refazer sejam expostos a usuários não autorizados no sistema. Caso contrário, o seguinte erro será retornado:

  ERRO 3846 (HY000): O diretório de arquivo de log refeito '`directory_path1`' é acessível a todos os usuários do sistema operacional

- As diretórios não podem ser os definidos por `datadir`, `innodb_data_home_dir`, `innodb_directories`, `innodb_log_group_home_dir`, `innodb_temp_tablespaces_dir`, `innodb_tmpdir` `innodb_undo_directory` ou `secure_file_priv`, nem podem ser diretórios pai ou subdiretórios desses diretórios. Caso contrário, será retornado um erro semelhante ao seguinte:

  ERRO 3845 (HY000): O diretório de arquivo de log refeito '`directory_path1`' está em, sob ou sobre o diretório do servidor 'datadir' - '`/path/to/data_directory`'

Quando uma ferramenta de backup que suporta a arquivamento de log de refazer inicia um backup, a ferramenta de backup ativa o arquivamento de log de refazer invocando a função `innodb_redo_log_archive_start()`.

Se você não estiver usando uma ferramenta de backup que suporte a arquivamento do log de refazer, o arquivamento do log de refazer também pode ser ativado manualmente, conforme mostrado:

```
mysql> SELECT innodb_redo_log_archive_start('label', 'subdir');
+------------------------------------------+
| innodb_redo_log_archive_start('label') |
+------------------------------------------+
| 0                                        |
+------------------------------------------+
```

Ou:

```
mysql> DO innodb_redo_log_archive_start('label', 'subdir');
Query OK, 0 rows affected (0.09 sec)
```

Nota

A sessão do MySQL que ativa o arquivamento do log de refazer (usando `innodb_redo_log_archive_start()`) deve permanecer aberta durante a arquivagem. A mesma sessão deve desativar o arquivamento do log de refazer (usando `innodb_redo_log_archive_stop()`). Se a sessão for encerrada antes que o arquivamento do log de refazer seja explicitamente desativado, o servidor desativa o arquivamento do log de refazer implicitamente e remove o arquivo de arquivamento do log de refazer.

onde `label` é um rótulo definido por `innodb_redo_log_archive_dirs`; `subdir` é um argumento opcional para especificar um subdiretório do diretório identificado por `label` para salvar o arquivo de arquivo; ele deve ser um nome de diretório simples (não é permitido traço (/), barra invertida (), ou dois pontos (:)). `subdir` pode ser vazio, nulo ou pode ser omitido.

Apenas os usuários com o privilégio `INNODB_REDO_LOG_ARCHIVE` podem ativar o arquivamento do log de revisão invocando `innodb_redo_log_archive_start()`, ou desativá-lo usando `innodb_redo_log_archive_stop()`. O usuário MySQL que executa o utilitário de backup ou o usuário MySQL que ativa e desativa o arquivamento do log de revisão manualmente deve ter esse privilégio.

O caminho do arquivo de log de refazer é `directory_identified_by_label/[subdir/]archive.serverUUID.000001.log`, onde `directory_identified_by_label` é o diretório de arquivo identificado pelo argumento `label` para `innodb_redo_log_archive_start()`. `subdir` é o argumento opcional usado para `innodb_redo_log_archive_start()`.

Por exemplo, o caminho completo e o nome de um arquivo de log de refazer parecem semelhantes ao seguinte:

```
/directory_path/subdirectory/archive.e71a47dc-61f8-11e9-a3cb-080027154b4d.000001.log
```

Após o utilitário de backup terminar de copiar os arquivos de dados `InnoDB`, ele desativa o arquivamento do log de reversão, chamando a função `innodb_redo_log_archive_stop()`.

Se você não estiver usando uma ferramenta de backup que suporte a arquivamento do log de refazer, o arquivamento do log de refazer também pode ser desativado manualmente, conforme mostrado:

```
mysql> SELECT innodb_redo_log_archive_stop();
+--------------------------------+
| innodb_redo_log_archive_stop() |
+--------------------------------+
| 0                              |
+--------------------------------+
```

Ou:

```
mysql> DO innodb_redo_log_archive_stop();
Query OK, 0 rows affected (0.01 sec)
```

Após a função de parada ser concluída com sucesso, a ferramenta de backup procura a seção relevante dos dados do log de reversão do arquivo de arquivamento e copia-a para o backup.

Depois que a ferramenta de backup terminar de copiar os dados do log de reversão e não precisar mais do arquivo do arquivo de log de reversão, ele exclui o arquivo do arquivo de log de reversão.

A remoção do arquivo de arquivo de backup é responsabilidade do utilitário de backup em situações normais. No entanto, se a operação de arquivamento do log de refazer interromper inesperadamente antes que o `innodb_redo_log_archive_stop()` seja chamado, o servidor MySQL remove o arquivo.

##### Considerações sobre o desempenho

A ativação do arquivamento do log de revisão geralmente tem um custo de desempenho menor devido à atividade de escrita adicional.

Nos sistemas operacionais Unix e similares, o impacto no desempenho é geralmente menor, assumindo que não haja uma taxa alta e sustentada de atualizações. No Windows, o impacto no desempenho é geralmente um pouco maior, assumindo o mesmo.

Se houver uma taxa alta e sustentada de atualizações e o arquivo de log de refazer estiver na mesma mídia de armazenamento que os arquivos de log de refazer, o impacto no desempenho pode ser mais significativo devido à atividade de escrita acumulada.

Se houver uma taxa alta e sustentada de atualizações e o arquivo de log de refazer estiver em um meio de armazenamento mais lento do que os arquivos de log de refazer, o desempenho será afetado arbitrariamente.

Escrever no arquivo de log de reversão não impede o registro transacional normal, exceto no caso em que o meio de armazenamento do arquivo de log de reversão opera em uma taxa muito mais lenta do que o meio de armazenamento do arquivo de log de reversão, e há um grande acúmulo de blocos de log de reversão persistentes à espera de serem escritos no arquivo de log de reversão. Nesse caso, a taxa de registro transacional é reduzida a um nível que pode ser gerenciado pelo meio de armazenamento mais lento onde o arquivo de log de reversão reside.

#### Desativar o registro de refazer

A partir do MySQL 8.0.21, você pode desabilitar o registro de redo usando a instrução `ALTER INSTANCE DISABLE INNODB REDO_LOG`. Essa funcionalidade é destinada ao carregamento de dados em uma nova instância do MySQL. Desabilitar o registro de redo acelera o carregamento de dados, evitando gravações no log de redo e buffer de escrita dupla.

Aviso

Este recurso é destinado apenas para carregar dados em uma nova instância do MySQL. *Não desative o registro de redo em um sistema de produção.* É permitido desligar e reiniciar o servidor enquanto o registro de redo está desativado, mas uma parada inesperada do servidor enquanto o registro de redo está desativado pode causar perda de dados e corrupção da instância.

A tentativa de reiniciar o servidor após uma interrupção inesperada do servidor, enquanto o registro de redo está desativado, é recusada com o seguinte erro:

```
[ERROR] [MY-013598] [InnoDB] Server was killed when Innodb Redo
logging was disabled. Data files could be corrupt. You can try
to restart the database with innodb_force_recovery=6
```

Nesse caso, inicie uma nova instância do MySQL e reinicie o procedimento de carregamento de dados.

O privilégio `INNODB_REDO_LOG_ENABLE` é necessário para habilitar e desabilitar o registro de redo.

A variável de status `Innodb_redo_log_enabled` permite monitorar o status do registro de redo.

As operações de clonagem e arquivamento do log de refazer não são permitidas quando o registro de refazer está desativado e vice-versa.

Uma operação `ALTER INSTANCE [ENABLE|DISABLE] INNODB REDO_LOG` requer um bloqueio exclusivo de metadados de backup, o que impede que outras operações `ALTER INSTANCE` sejam executadas simultaneamente. Outras operações `ALTER INSTANCE` devem esperar que o bloqueio seja liberado antes de executar.

O procedimento a seguir demonstra como desabilitar o registro de refazer ao carregar dados em uma nova instância do MySQL.

1. Na nova instância do MySQL, conceda o privilégio `INNODB_REDO_LOG_ENABLE` à conta de usuário responsável por desabilitar o registro de redo.

   ```
   mysql> GRANT INNODB_REDO_LOG_ENABLE ON *.* to 'data_load_admin';
   ```

2. Como usuário do `data_load_admin`, desative o registro de rollback:

   ```
   mysql> ALTER INSTANCE DISABLE INNODB REDO_LOG;
   ```

3. Verifique a variável de status `Innodb_redo_log_enabled` para garantir que o registro de refazer esteja desativado.

   ```
   mysql> SHOW GLOBAL STATUS LIKE 'Innodb_redo_log_enabled';
   +-------------------------+-------+
   | Variable_name           | Value |
   +-------------------------+-------+
   | Innodb_redo_log_enabled | OFF   |
   +-------------------------+-------+
   ```

4. Execute a operação de carregamento de dados.

5. Como usuário do `data_load_admin`, habilite o registro de reversão após a operação de carregamento de dados terminar:

   ```
   mysql> ALTER INSTANCE ENABLE INNODB REDO_LOG;
   ```

6. Verifique a variável de status `Innodb_redo_log_enabled` para garantir que o registro de refazer esteja habilitado.

   ```
   mysql> SHOW GLOBAL STATUS LIKE 'Innodb_redo_log_enabled';
   +-------------------------+-------+
   | Variable_name           | Value |
   +-------------------------+-------+
   | Innodb_redo_log_enabled | ON    |
   +-------------------------+-------+
   ```

#### Tópicos relacionados

- Configuração do Log Redo
- Seção 10.5.4, “Otimizando o registro de reinicialização do InnoDB”
- Criptografia do Log de Refazer
