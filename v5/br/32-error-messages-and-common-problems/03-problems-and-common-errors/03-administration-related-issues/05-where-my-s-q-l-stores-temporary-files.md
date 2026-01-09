#### B.3.3.5 Onde o MySQL armazena arquivos temporários

No Unix, o MySQL usa o valor da variável de ambiente `TMPDIR` como o nome do caminho do diretório onde os arquivos temporários serão armazenados. Se `TMPDIR` não for definido, o MySQL usa o padrão do sistema, que geralmente é `/tmp`, `/var/tmp` ou `/usr/tmp`.

No Windows, o MySQL verifica em ordem os valores das variáveis de ambiente `TMPDIR`, `TEMP` e `TMP`. Para o primeiro valor encontrado, o MySQL usa-o e não verifica os demais. Se nenhum dos valores de `TMPDIR`, `TEMP` ou `TMP` estiver definido, o MySQL usa o padrão do sistema do Windows, que geralmente é `C:\windows\temp\`.

Se o sistema de arquivos que contém o diretório do seu arquivo temporário for muito pequeno, você pode usar a opção [**mysqld**](mysqld.html) [`--tmpdir`](server-options.html#option_mysqld_tmpdir) para especificar um diretório em um sistema de arquivos onde você tenha espaço suficiente.

A opção [`--tmpdir`](server-options.html#option_mysqld_tmpdir) pode ser configurada para uma lista de vários caminhos que são usados de forma rotativa. Os caminhos devem ser separados por colchetes (`:`) no Unix e por pontos e vírgulas (`;`) no Windows.

Nota

Para distribuir a carga de forma eficaz, esses caminhos devem estar localizados em discos *físicos* diferentes, não em partições diferentes do mesmo disco.

Se o servidor MySQL estiver atuando como replica, você pode definir a variável de sistema [`slave_load_tmpdir`](replication-options-replica.html#sysvar_slave_load_tmpdir) para especificar um diretório separado para armazenar arquivos temporários ao replicar instruções de [`LOAD DATA`](load-data.html). Esse diretório deve estar em um sistema de arquivos baseado em disco (não em um sistema de arquivos baseado em memória) para que os arquivos temporários usados para replicar o LOAD DATA possam sobreviver a reinicializações da máquina. O diretório também não deve ser o que o sistema operacional limpar durante o processo de inicialização do sistema. No entanto, a replicação pode continuar após um reinício se os arquivos temporários tiverem sido removidos.

O MySQL garante que os arquivos temporários são removidos se o [**mysqld**](mysqld.html) for encerrado. Em plataformas que o suportam (como o Unix), isso é feito desvinculando o arquivo após abri-lo. A desvantagem disso é que o nome não aparece nas listagens de diretórios e você não vê um grande arquivo temporário que preenche o sistema de arquivos no qual o diretório do arquivo temporário está localizado. (Nesses casos, **lsof +L1** pode ser útil para identificar arquivos grandes associados ao [**mysqld**](mysqld.html).)

Ao ordenar (`ORDER BY` ou `GROUP BY`), o MySQL normalmente usa um ou dois arquivos temporários. O espaço em disco máximo necessário é determinado pela seguinte expressão:

```sql
(length of what is sorted + sizeof(row pointer))
* number of matched rows
* 2
```

O tamanho do ponteiro de linha geralmente é de quatro bytes, mas pode aumentar no futuro para tabelas muito grandes.

Para algumas declarações, o MySQL cria tabelas SQL temporárias que não são ocultas e têm nomes que começam com `#sql`.

Algumas consultas [`SELECT`](select.html) criam tabelas SQL temporárias para armazenar resultados intermediários.

As operações DDL que reconstruem a tabela e não são executadas online usando a técnica `ALGORITHM=INPLACE` criam uma cópia temporária da tabela original no mesmo diretório da tabela original.

As operações DDL online podem usar arquivos de registro temporários para registrar DML concorrente, arquivos de classificação temporários ao criar um índice e arquivos de tabelas intermediárias temporárias ao reconstruir a tabela. Para mais informações, consulte [Seção 14.13.3, “Requisitos de Espaço DDL Online”](innodb-online-ddl-space-requirements.html).

As tabelas temporárias não compactadas, criadas pelo usuário, do tipo `InnoDB` e as tabelas temporárias internas no disco são criadas em um arquivo de espaço de tabelas temporárias chamado `ibtmp1` no diretório de dados do MySQL. Para mais informações, consulte [Seção 14.6.3.5, “O Espaço de Tabelas Temporárias”](innodb-temporary-tablespace.html).

Veja também [Seção 14.16.7, “Tabela de Informações Temporárias do Schema INFORMATION\_SCHEMA da InnoDB”](innodb-information-schema-temp-table-info.html). [Tabelas Temporárias Órfãs](innodb-troubleshooting-datadict.html#innodb-orphan-temporary-tables).
