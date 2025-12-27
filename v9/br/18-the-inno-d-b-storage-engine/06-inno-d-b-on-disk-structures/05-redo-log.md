### 17.6.5 Registro de Refazer

O registro de refazer é uma estrutura de dados baseada em disco usada durante a recuperação em caso de falha para corrigir dados escritos por transações incompletas. Durante operações normais, o registro de refazer codifica solicitações para alterar dados de tabelas que resultam de instruções SQL ou chamadas de API de baixo nível. As modificações que não terminaram de atualizar os arquivos de dados antes de um desligamento inesperado são regravadas automaticamente durante a inicialização e antes que as conexões sejam aceitas. Para obter informações sobre o papel do registro de refazer na recuperação em caso de falha, consulte a Seção 17.18.2, “Recuperação do InnoDB”.

O registro de refazer é representado fisicamente no disco por arquivos de registro de refazer. Os dados escritos nos arquivos de registro de refazer são codificados em termos de registros afetados, e esses dados são coletivamente referidos como refazer. A passagem de dados pelos arquivos de registro de refazer é representada por um valor LSN (Last Sequence Number) sempre crescente. Os dados do registro de refazer são anexados à medida que ocorrem as modificações de dados, e os dados mais antigos são truncados à medida que o ponto de verificação avança.

As informações e procedimentos relacionados aos registros de refazer são descritos nos seguintes tópicos na seção:

* Configurando a Capacidade do Registro de Refazer
* Configuração Automática da Capacidade do Registro de Refazer
* Arquivamento do Registro de Refazer
* Desabilitando o Registro de Refazer
* Tópicos Relacionados

#### Configurando a Capacidade do Registro de Refazer

A variável de sistema `innodb_redo_log_capacity` controla a quantidade de espaço em disco ocupada pelos arquivos de registro de refazer. Você pode definir essa variável em um arquivo de opções durante a inicialização ou em tempo de execução usando uma instrução `SET GLOBAL`; por exemplo, a seguinte instrução define a capacidade do registro de refazer para 8 GB:

```
SET GLOBAL innodb_redo_log_capacity = 8589934592;
```

Quando configurado em tempo de execução, a alteração de configuração ocorre imediatamente, mas pode levar algum tempo para o novo limite ser totalmente implementado. Se os arquivos de log de refazer ocuparem menos espaço do que o valor especificado, as páginas sujas são descarregadas do pool de buffer para os arquivos de dados do espaço de tabelas de forma menos agressiva, aumentando eventualmente o espaço em disco ocupado pelos arquivos de log de refazer. Se os arquivos de log de refazer ocuparem mais espaço do que o valor especificado, as páginas sujas são descarregadas de forma mais agressiva, diminuindo eventualmente o espaço em disco ocupado pelos arquivos de log de refazer.

A variável de status do servidor `Innodb_redo_log_capacity_resized` indica a capacidade total do log de refazer para todos os arquivos de log de refazer.

Os arquivos de log de refazer residem no diretório `#innodb_redo` no diretório de dados, a menos que um diretório diferente tenha sido especificado pela variável `innodb_log_group_home_dir`. Se `innodb_log_group_home_dir` foi definido, os arquivos de log de refazer residem no diretório `#innodb_redo` nesse diretório. Existem dois tipos de arquivos de log de refazer, comuns e de reserva. Arquivos de log de refazer comuns são aqueles que estão sendo usados. Arquivos de log de refazer de reserva são aqueles que estão aguardando para serem usados. O `InnoDB` tenta manter 32 arquivos de log de refazer no total, com cada arquivo de tamanho igual a 1/32 * `innodb_redo_log_capacity`; no entanto, os tamanhos dos arquivos podem diferir por um tempo após a modificação do ajuste `innodb_redo_log_capacity`.

Os arquivos de log de refazer usam uma convenção de nomeação `#ib_redoN`, onde *`N`* é o número do arquivo de log de refazer. Arquivos de log de refazer de reserva são denotados por um sufixo `_tmp`. O exemplo seguinte mostra os arquivos de log de refazer em um diretório `#innodb_redo`, onde há 21 arquivos de log de refazer ativos e 11 arquivos de log de refazer de reserva, numerados sequencialmente.

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

Cada arquivo de log de refazer comum está associado a um intervalo específico de valores de LSN; por exemplo, a seguinte consulta mostra os valores `START_LSN` e `END_LSN` dos arquivos de log de refazer ativos listados no exemplo anterior:

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

Ao realizar um ponto de verificação, o `InnoDB` armazena o LSN do ponto de verificação no cabeçalho do arquivo que contém esse LSN. Durante a recuperação, todos os arquivos de log de refazer são verificados e a recuperação começa no LSN do ponto de verificação mais recente.

Várias variáveis de status são fornecidas para monitorar as operações de redimensionamento da capacidade do log de refazer; por exemplo, você pode consultar `Innodb_redo_log_resize_status` para visualizar o status de uma operação de redimensionamento:

```
mysql> SHOW STATUS LIKE 'Innodb_redo_log_resize_status';
+-------------------------------+-------+
| Variable_name                 | Value |
+-------------------------------+-------+
| Innodb_redo_log_resize_status | OK    |
+-------------------------------+-------+
```

A variável de status `Innodb_redo_log_capacity_resized` mostra o limite atual da capacidade do log de refazer:

```
mysql> SHOW STATUS LIKE 'Innodb_redo_log_capacity_resized';
 +----------------------------------+-----------+
| Variable_name                    | Value     |
+----------------------------------+-----------+
| Innodb_redo_log_capacity_resized | 104857600 |
+----------------------------------+-----------+
```

Outras variáveis de status aplicáveis incluem:

* `Innodb_redo_log_checkpoint_lsn`
* `Innodb_redo_log_current_lsn`
* `Innodb_redo_log_flushed_to_disk_lsn`
* `Innodb_redo_log_logical_size`
* `Innodb_redo_log_physical_size`
* `Innodb_redo_log_read_only`
* `Innodb_redo_log_uuid`

Consulte as descrições das variáveis de status para obter mais informações.

Você pode visualizar informações sobre os arquivos de log de refazer ativos consultando a tabela `innodb_redo_log_files` do Schema de Desempenho. A seguinte consulta recupera dados de todas as colunas da tabela:

```
SELECT FILE_ID, START_LSN, END_LSN, SIZE_IN_BYTES, IS_FULL, CONSUMER_LEVEL
FROM performance_schema.innodb_redo_log_files;
```

#### Configuração Automática da Capacidade do Log de Refazer

Quando o servidor é iniciado com `--innodb-dedicated-server`, o `InnoDB` calcula automaticamente e define os valores para certos parâmetros do `InnoDB`, incluindo a capacidade do log de recuperação. A configuração automatizada é destinada a instâncias do MySQL que residem em um servidor dedicado ao MySQL, onde o servidor MySQL pode usar todos os recursos do sistema disponíveis. Para mais informações, consulte a Seção 17.8.13, “Habilitar Configuração Automática do InnoDB para um Servidor MySQL Dedicado”.

#### Arquivamento do Log de Recuperação

As ferramentas de backup que copiam os registros do log de recuperação podem, às vezes, não acompanhar a geração do log de recuperação enquanto uma operação de backup está em andamento, resultando na perda de registros do log de recuperação devido a esses registros serem sobrescritos. Esse problema ocorre mais frequentemente quando há uma atividade significativa do servidor MySQL durante a operação de backup, e o meio de armazenamento do arquivo de log de recuperação opera em uma velocidade mais rápida do que o meio de armazenamento do backup. O recurso de arquivamento do log de recuperação aborda esse problema ao escrever sequencialmente os registros do log de recuperação em um arquivo de arquivamento, além dos arquivos do log de recuperação. As ferramentas de backup podem copiar os registros do log de recuperação do arquivo de arquivamento conforme necessário, evitando assim a perda potencial de dados.

Se o arquivamento do log de recuperação estiver configurado no servidor, o MySQL Enterprise Backup, disponível com a [MySQL Enterprise Edition](https://www.mysql.com/products/enterprise/), usa o recurso de arquivamento do log de recuperação ao fazer o backup de um servidor MySQL.

Habilitar o arquivamento do log de recuperação no servidor requer definir um valor para a variável de sistema `innodb_redo_log_archive_dirs`. O valor é especificado como uma lista separada por ponto-e-vírgula de diretórios de arquivamento de log de recuperação rotulados. A par de `label:directory` é separada por uma vírgula (`:`). Por exemplo:

```
mysql> SET GLOBAL innodb_redo_log_archive_dirs='label1:directory_path1[;label2:directory_path2;…]';
```

O `label` é um identificador arbitrário para o diretório de arquivo. Pode ser qualquer string de caracteres, com exceção dos colchetes (:), que não são permitidos. Um rótulo vazio também é permitido, mas o colon (:) ainda é necessário neste caso. Um `directory_path` deve ser especificado. O diretório selecionado para o arquivo de arquivo de log de refazer deve existir quando o arquivamento de log de refazer for ativado, ou será retornado um erro. O caminho pode conter colchetes (':'), mas ponto-e-vírgula (;) não são permitidos.

A variável `innodb_redo_log_archive_dirs` deve ser configurada antes que o arquivamento de log de refazer possa ser ativado. O valor padrão é `NULL`, o que não permite ativar o arquivamento de log de refazer.

Observações

Os diretórios que você especificar devem atender aos seguintes requisitos. (Os requisitos são aplicados quando o arquivamento de log de refazer for ativado.):

* Os diretórios devem existir. Os diretórios não são criados pelo processo de arquivo de log de refazer. Caso contrário, o seguinte erro será retornado:

  ERRO 3844 (HY000): O diretório de arquivo de log de refazer '*`directory_path1`*' não existe ou não é um diretório

* Os diretórios não devem ser acessíveis para todos os usuários do sistema. Isso é para evitar que os dados do log de refazer sejam expostos a usuários não autorizados no sistema. Caso contrário, o seguinte erro será retornado:

  ERRO 3846 (HY000): O diretório de arquivo de log de refazer '*`directory_path1`*' é acessível a todos os usuários do sistema

* Os diretórios não podem ser os definidos por `datadir`, `innodb_data_home_dir`, `innodb_directories`, `innodb_log_group_home_dir`, `innodb_temp_tablespaces_dir`, `innodb_tmpdir` `innodb_undo_directory` ou `secure_file_priv`, nem podem ser diretórios pai ou subdiretórios desses diretórios. Caso contrário, será retornado um erro semelhante ao seguinte:

ERRO 3845 (HY000): O diretório de arquivo de log de refazer '*`directory_path1`*' está em, sob ou sobre o diretório do servidor 'datadir' - '*`/caminho/para/diretório_de_dados`*'

Quando uma ferramenta de backup que suporta a arquivagem de log de refazer inicia um backup, a ferramenta de backup ativa a arquivagem de log de refazer invocando a função `innodb_redo_log_archive_start()`.

Se você não estiver usando uma ferramenta de backup que suporte a arquivagem de log de refazer, a arquivagem de log de refazer também pode ser ativada manualmente, como mostrado:

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

Observação

A sessão MySQL que ativa a arquivagem de log de refazer (usando `innodb_redo_log_archive_start()`) deve permanecer aberta durante a arquivagem. A mesma sessão deve desativar a arquivagem de log de refazer (usando `innodb_redo_log_archive_stop()`). Se a sessão for encerrada antes da arquivagem de log de refazer ser explicitamente desativada, o servidor desativa implicitamente a arquivagem de log de refazer e remove o arquivo do arquivo de log de refazer.

onde *`label`* é uma etiqueta definida por `innodb_redo_log_archive_dirs`; `subdir` é um argumento opcional para especificar um subdiretório do diretório identificado por *`label`* para salvar o arquivo de arquivo; deve ser um nome de diretório simples (não é permitido slash (/), barra invertida (\) ou colon (:)). `subdir` pode ser vazio, nulo ou pode ser omitido.

Apenas os usuários com o privilégio `INNODB_REDO_LOG_ARCHIVE` podem ativar a arquivagem de log de refazer invocando `innodb_redo_log_archive_start()`, ou desativá-la usando `innodb_redo_log_archive_stop()`. O usuário MySQL que executa a ferramenta de backup ou o usuário MySQL que ativa e desativa a arquivagem de log de refazer manualmente deve ter esse privilégio.

O caminho do arquivo de log de refazer é `directory_identified_by_label/[subdir/]archive.serverUUID.000001.log`, onde `directory_identified_by_label` é o diretório de arquivo de refazer identificado pelo argumento `label` para `innodb_redo_log_archive_start()`. `subdir` é o argumento opcional usado para `innodb_redo_log_archive_start()`.

Por exemplo, o caminho e o nome completos do arquivo de arquivo de log de refazer parecem semelhantes ao seguinte:

```
/directory_path/subdirectory/archive.e71a47dc-61f8-11e9-a3cb-080027154b4d.000001.log
```

Após a utilidade de backup terminar de copiar os arquivos de dados do `InnoDB`, ela desativa a arquivagem do log de refazer, chamando a função `innodb_redo_log_archive_stop()`.

Se você não estiver usando uma utilidade de backup que suporte a arquivagem do log de refazer, a arquivagem do log de refazer também pode ser desativada manualmente, como mostrado:

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

Após a função de parada ser concluída com sucesso, a utilidade de backup procura a seção relevante dos dados do log de refazer do arquivo de arquivo e copia-a para o backup.

Após a utilidade de backup terminar de copiar os dados do log de refazer e não precisar mais do arquivo de arquivo de log de refazer, ela exclui o arquivo de arquivo.

A remoção do arquivo de arquivo é responsabilidade da utilidade de backup em situações normais. No entanto, se a operação de arquivamento do log de refazer parar inesperadamente antes que `innodb_redo_log_archive_stop()` seja chamada, o servidor MySQL remove o arquivo.

##### Considerações de Desempenho

Ativando a arquivagem do log de refazer, geralmente há um custo de desempenho menor devido à atividade de escrita adicional.

Em sistemas operacionais Unix e Unix-like, o impacto no desempenho é geralmente menor, assumindo que não haja uma taxa alta e sustentada de atualizações. Em Windows, o impacto no desempenho é geralmente um pouco maior, assumindo o mesmo.

Se houver uma taxa alta e sustentada de atualizações e o arquivo de log de refazer estiver na mesma mídia de armazenamento que os arquivos de log de refazer, o impacto no desempenho pode ser mais significativo devido à atividade de escrita acumulada.

Se houver uma taxa alta e sustentada de atualizações e o arquivo de log de refazer estiver em uma mídia de armazenamento mais lenta do que os arquivos de log de refazer, o desempenho é impactado arbitrariamente.

Escrever no arquivo de log de refazer não impede o registro transacional normal, exceto no caso em que a mídia de armazenamento do arquivo de log de refazer opera a uma taxa muito mais lenta do que a mídia de armazenamento do arquivo de log de refazer, e há um grande acúmulo de blocos de log de refazer persistentes à espera de serem escritos no arquivo de log de refazer. Nesse caso, a taxa de registro transacional é reduzida a um nível que pode ser gerenciado pela mídia de armazenamento mais lenta onde o arquivo de log de refazer reside.

#### Desabilitar o Registro de Refazer

Você pode desabilitar o registro de refazer usando a instrução `ALTER INSTANCE DISABLE INNODB REDO_LOG`. Essa funcionalidade é destinada ao carregamento de dados para uma nova instância do MySQL. Desabilitar o registro de refazer acelera o carregamento de dados, evitando gravações no log de refazer e buffer de escrita dupla.

Aviso

Essa funcionalidade é destinada apenas ao carregamento de dados para uma nova instância do MySQL. *Não desabilite o registro de refazer em um sistema de produção.* É permitido desligar e reiniciar o servidor enquanto o registro de refazer está desativado, mas uma parada inesperada do servidor enquanto o registro de refazer está desativado pode causar perda de dados e corrupção da instância.

Tentando reiniciar o servidor após uma parada inesperada do servidor enquanto o registro de refazer está desativado é recusado com o seguinte erro:

```
[ERROR] [MY-013598] [InnoDB] Server was killed when Innodb Redo
logging was disabled. Data files could be corrupt. You can try
to restart the database with innodb_force_recovery=6
```

Nesse caso, inicie uma nova instância do MySQL e reinicie o procedimento de carregamento de dados novamente.

O privilégio `INNODB_REDO_LOG_ENABLE` é necessário para habilitar e desabilitar o registro de redo.

A variável de status `Innodb_redo_log_enabled` permite monitorar o status do registro de redo.

As operações de clonagem e arquivamento do log de redo não são permitidas quando o registro de redo está desativado e vice-versa.

Uma operação `ALTER INSTANCE [ENABLE|DISABLE] INNODB REDO_LOG` requer um bloqueio exclusivo de metadados de backup, o que impede que outras operações `ALTER INSTANCE` sejam executadas simultaneamente. Outras operações `ALTER INSTANCE` devem esperar que o bloqueio seja liberado antes de executar.

O seguinte procedimento demonstra como desativar o registro de redo ao carregar dados para uma nova instância do MySQL.

1. Na nova instância do MySQL, conceda o privilégio `INNODB_REDO_LOG_ENABLE` à conta de usuário responsável por desativar o registro de redo.

   ```
   mysql> GRANT INNODB_REDO_LOG_ENABLE ON *.* to 'data_load_admin';
   ```

2. Como usuário `data_load_admin`, desabilite o registro de redo:

   ```
   mysql> ALTER INSTANCE DISABLE INNODB REDO_LOG;
   ```

3. Verifique a variável de status `Innodb_redo_log_enabled` para garantir que o registro de redo esteja desativado.

   ```
   mysql> SHOW GLOBAL STATUS LIKE 'Innodb_redo_log_enabled';
   +-------------------------+-------+
   | Variable_name           | Value |
   +-------------------------+-------+
   | Innodb_redo_log_enabled | OFF   |
   +-------------------------+-------+
   ```

4. Execute a operação de carregamento de dados.

5. Como usuário `data_load_admin`, habilite o registro de redo após a operação de carregamento de dados terminar:

   ```
   mysql> ALTER INSTANCE ENABLE INNODB REDO_LOG;
   ```

6. Verifique a variável de status `Innodb_redo_log_enabled` para garantir que o registro de redo esteja habilitado.

   ```
   mysql> SHOW GLOBAL STATUS LIKE 'Innodb_redo_log_enabled';
   +-------------------------+-------+
   | Variable_name           | Value |
   +-------------------------+-------+
   | Innodb_redo_log_enabled | ON    |
   +-------------------------+-------+
   ```

#### Tópicos Relacionados

* Configuração do Registro de Redo
* Seção 10.5.4, “Otimizando o Registro de Redo InnoDB”
* Criptografia do Registro de Redo