#### 8.4.3.1 Como o MySQL Abre e Fecha Tabelas

Quando você executa um comando **mysqladmin status**, você deve ver algo como isto:

```sql
Uptime: 426 Running threads: 1 Questions: 11082
Reloads: 1 Open tables: 12
```

O valor de `Open tables` de 12 pode ser um tanto intrigante se você tiver menos de 12 tabelas.

O MySQL é *multithreaded*, portanto, pode haver muitos *clients* emitindo *Queries* para uma determinada tabela simultaneamente. Para minimizar o problema de múltiplas sessões de *client* terem estados diferentes na mesma tabela, a tabela é aberta independentemente por cada sessão concorrente. Isso usa memória adicional, mas normalmente aumenta o *performance*. Com tabelas `MyISAM`, é necessário um *file descriptor* extra para o arquivo de dados para cada *client* que tem a tabela aberta. (Em contraste, o *file descriptor* do *Index* é compartilhado entre todas as sessões.)

As variáveis de sistema `table_open_cache` e `max_connections` afetam o número máximo de arquivos que o *server* mantém abertos. Se você aumentar um ou ambos esses valores, você pode atingir um limite imposto pelo seu sistema operacional no número de *file descriptors* abertos por processo. Muitos sistemas operacionais permitem que você aumente o limite de arquivos abertos (*open-files limit*), embora o método varie amplamente de sistema para sistema. Consulte a documentação do seu sistema operacional para determinar se é possível aumentar o limite e como fazê-lo.

`table_open_cache` está relacionado a `max_connections`. Por exemplo, para 200 conexões concorrentes em execução, especifique um tamanho de *table cache* de pelo menos `200 * N`, onde *`N`* é o número máximo de tabelas por *JOIN* em qualquer uma das *Queries* que você executa. Você também deve reservar alguns *file descriptors* extras para tabelas e arquivos temporários.

Certifique-se de que seu sistema operacional pode lidar com o número de *file descriptors* abertos implícito na configuração de `table_open_cache`. Se `table_open_cache` for definido muito alto, o MySQL pode ficar sem *file descriptors* e apresentar sintomas como recusar conexões ou falhar ao executar *Queries*.

Também leve em consideração que o *storage engine* `MyISAM` precisa de dois *file descriptors* para cada tabela aberta única. Para uma tabela `MyISAM` particionada, dois *file descriptors* são necessários para cada *partition* da tabela aberta. (Quando o `MyISAM` abre uma tabela particionada, ele abre todas as *partitions* dessa tabela, independentemente de uma determinada *partition* ser realmente usada. Consulte MyISAM e uso de *file descriptors* de *partition*.) Para aumentar o número de *file descriptors* disponíveis para o MySQL, defina a variável de sistema `open_files_limit`. Consulte a Seção B.3.2.16, “File Not Found and Similar Errors” (Arquivo Não Encontrado e Erros Semelhantes).

O *cache* de tabelas abertas é mantido em um nível de `table_open_cache` entradas. O *server* ajusta automaticamente o tamanho do *cache* na inicialização (*startup*). Para definir o tamanho explicitamente, defina a variável de sistema `table_open_cache` no *startup*. O MySQL pode abrir temporariamente mais tabelas do que isso para executar *Queries*, conforme descrito posteriormente nesta seção.

O MySQL fecha uma tabela não utilizada e a remove do *table cache* nas seguintes circunstâncias:

* Quando o *cache* está cheio e um *Thread* tenta abrir uma tabela que não está no *cache*.

* Quando o *cache* contém mais de `table_open_cache` entradas e uma tabela no *cache* não está mais sendo usada por nenhum *Thread*.

* Quando ocorre uma operação de *table-flushing*. Isso acontece quando alguém emite uma instrução `FLUSH TABLES` ou executa um comando **mysqladmin flush-tables** ou **mysqladmin refresh**.

Quando o *table cache* se enche, o *server* usa o seguinte procedimento para localizar uma entrada de *cache* a ser utilizada:

* Tabelas não utilizadas no momento são liberadas, começando pela tabela usada menos recentemente.

* Se uma nova tabela deve ser aberta, mas o *cache* está cheio e nenhuma tabela pode ser liberada, o *cache* é temporariamente estendido conforme necessário. Quando o *cache* está em um estado temporariamente estendido e uma tabela passa de um estado usado para não usado, a tabela é fechada e liberada do *cache*.

Uma tabela `MyISAM` é aberta para cada acesso concorrente. Isso significa que a tabela precisa ser aberta duas vezes se dois *Threads* acessarem a mesma tabela ou se um *Thread* acessar a tabela duas vezes na mesma *Query* (por exemplo, ao fazer um *JOIN* da tabela consigo mesma). Cada abertura concorrente requer uma entrada no *table cache*. A primeira abertura de qualquer tabela `MyISAM` requer dois *file descriptors*: um para o arquivo de dados e um para o arquivo de *Index*. Cada uso adicional da tabela requer apenas um *file descriptor* para o arquivo de dados. O *file descriptor* do *Index* é compartilhado entre todos os *Threads*.

Se você estiver abrindo uma tabela com a instrução `HANDLER tbl_name OPEN`, um objeto de tabela dedicado é alocado para o *Thread*. Este objeto de tabela não é compartilhado por outros *Threads* e não é fechado até que o *Thread* chame `HANDLER tbl_name CLOSE` ou o *Thread* termine. Quando isso acontece, a tabela é colocada de volta no *table cache* (se o *cache* não estiver cheio). Consulte a Seção 13.2.4, “HANDLER Statement” (Instrução HANDLER).

Para determinar se o seu *table cache* é muito pequeno, verifique a variável de *Status* `Opened_tables`, que indica o número de operações de abertura de tabela desde que o *server* foi iniciado:

```sql
mysql> SHOW GLOBAL STATUS LIKE 'Opened_tables';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| Opened_tables | 2741  |
+---------------+-------+
```

Se o valor for muito grande ou aumentar rapidamente, mesmo quando você não emitiu muitas instruções `FLUSH TABLES`, aumente o valor de `table_open_cache` no *server startup*.