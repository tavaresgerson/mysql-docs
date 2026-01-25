#### B.3.3.5 Onde o MySQL Armazena Arquivos Temporários

No Unix, o MySQL usa o valor da variável de ambiente `TMPDIR` como o nome do *path* do diretório no qual armazenar arquivos temporários. Se `TMPDIR` não estiver definida, o MySQL usa o padrão do sistema, que geralmente é `/tmp`, `/var/tmp`, ou `/usr/tmp`.

No Windows, o MySQL verifica em ordem os valores das variáveis de ambiente `TMPDIR`, `TEMP` e `TMP`. Para a primeira que for encontrada definida, o MySQL a utiliza e não verifica as restantes. Se nenhuma de `TMPDIR`, `TEMP` ou `TMP` estiver definida, o MySQL usa o padrão do sistema Windows, que geralmente é `C:\windows\temp\`.

Se o *file system* contendo seu diretório de arquivos temporários for muito pequeno, você pode usar a opção [`--tmpdir`](server-options.html#option_mysqld_tmpdir) do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") para especificar um diretório em um *file system* onde você tenha espaço suficiente.

A opção [`--tmpdir`](server-options.html#option_mysqld_tmpdir) pode ser configurada com uma lista de vários *paths* que são usados em moda *round-robin*. Os *paths* devem ser separados por caracteres de dois pontos (`:`) no Unix e por caracteres de ponto e vírgula (`;`) no Windows.

Note

Para distribuir a carga de forma eficaz, esses *paths* devem estar localizados em discos *physical* (físicos) diferentes, e não em *partitions* diferentes do mesmo disco.

Se o servidor MySQL estiver atuando como uma *replica*, você pode definir a variável de sistema [`slave_load_tmpdir`](replication-options-replica.html#sysvar_slave_load_tmpdir) para especificar um diretório separado para armazenar arquivos temporários ao replicar comandos [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"). Este diretório deve estar em um *file system* baseado em disco (e não em um *file system* baseado em memória) para que os arquivos temporários usados para replicar `LOAD DATA` possam sobreviver a reinicializações da máquina. O diretório também não deve ser um que seja limpo pelo sistema operacional durante o processo de inicialização do sistema. No entanto, a replicação agora pode continuar após uma reinicialização, mesmo que os arquivos temporários tenham sido removidos.

O MySQL garante que os arquivos temporários sejam removidos se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") for encerrado. Em plataformas que o suportam (como Unix), isso é feito pelo *unlinking* (desvinculação) do arquivo após abri-lo. A desvantagem disso é que o nome não aparece nas listagens de diretório e você não consegue ver um arquivo temporário grande que esteja preenchendo o *file system* onde o diretório temporário está localizado. (Nesses casos, `**lsof +L1**` pode ser útil na identificação de arquivos grandes associados ao [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").)

Ao ordenar (`ORDER BY` ou `GROUP BY`), o MySQL normalmente usa um ou dois arquivos temporários. O espaço máximo em disco requerido é determinado pela seguinte expressão:

```sql
(length of what is sorted + sizeof(row pointer))
* number of matched rows
* 2
```

O tamanho do *row pointer* (ponteiro de linha) é geralmente de quatro bytes, mas pode aumentar no futuro para *tables* realmente grandes.

Para alguns comandos, o MySQL cria *temporary SQL tables* que não estão ocultas e têm nomes que começam com `#sql`.

Algumas *queries* [`SELECT`](select.html "13.2.9 SELECT Statement") criam *temporary SQL tables* para armazenar resultados intermediários.

Operações `DDL` que reconstroem a *table* e não são executadas online usando a técnica `ALGORITHM=INPLACE` criam uma cópia temporária da *table* original no mesmo diretório da *table* original.

Operações `DDL` online podem usar arquivos de *log* temporários para registrar `DML` concorrente, arquivos de *sort* temporários ao criar um *Index*, e arquivos de *intermediate tables* temporárias ao reconstruir a *table*. Para mais informações, consulte [Seção 14.13.3, “Online DDL Space Requirements”](innodb-online-ddl-space-requirements.html "14.13.3 Online DDL Space Requirements").

*Temporary tables* `InnoDB` não-comprimidas, criadas pelo usuário, e *internal temporary tables* em disco são criadas em um arquivo de *temporary tablespace* chamado `ibtmp1` no *data directory* do MySQL. Para mais informações, consulte [Seção 14.6.3.5, “The Temporary Tablespace”](innodb-temporary-tablespace.html "14.6.3.5 The Temporary Tablespace").

Consulte também [Seção 14.16.7, “InnoDB INFORMATION_SCHEMA Temporary Table Info Table”](innodb-information-schema-temp-table-info.html "14.16.7 InnoDB INFORMATION_SCHEMA Temporary Table Info Table"). [Orphan Temporary Tables](innodb-troubleshooting-datadict.html#innodb-orphan-temporary-tables "Orphan Temporary Tables").