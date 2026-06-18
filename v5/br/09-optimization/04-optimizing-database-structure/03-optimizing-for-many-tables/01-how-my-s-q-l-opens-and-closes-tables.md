#### 8.4.3.1 Como o MySQL abre e fecha tabelas

Quando você executar o comando **mysqladmin status**, você deve ver algo como este:

```sql
Uptime: 426 Running threads: 1 Questions: 11082
Reloads: 1 Open tables: 12
```

O valor `Open tables` de 12 pode ser um pouco confuso se você tiver menos de 12 mesas.

O MySQL é multithread, então pode haver muitos clientes emitindo consultas para uma tabela específica simultaneamente. Para minimizar o problema de várias sessões de clientes com estados diferentes na mesma tabela, a tabela é aberta de forma independente por cada sessão concorrente. Isso utiliza memória adicional, mas normalmente aumenta o desempenho. Com as tabelas `MyISAM`, um descritor de arquivo extra é necessário para o arquivo de dados para cada cliente que tem a tabela aberta. (Em contraste, o descritor de arquivo de índice é compartilhado entre todas as sessões.)

As variáveis de sistema `table_open_cache` e `max_connections` afetam o número máximo de arquivos que o servidor mantém abertos. Se você aumentar um ou ambos esses valores, pode encontrar um limite imposto pelo seu sistema operacional sobre o número de descritores de arquivo abertos por processo. Muitos sistemas operacionais permitem que você aumente o limite de arquivos abertos, embora o método varie muito de sistema para sistema. Consulte a documentação do seu sistema operacional para determinar se é possível aumentar o limite e como fazer isso.

`table_open_cache` está relacionado com `max_connections`. Por exemplo, para 200 conexões em execução simultânea, especifique um tamanho de cache de tabela de pelo menos `200 * N`, onde *`N`* é o número máximo de tabelas por junção em qualquer uma das consultas que você executa. Você também deve reservar alguns descritores de arquivo extras para tabelas e arquivos temporários.

Certifique-se de que o seu sistema operacional possa lidar com o número de descritores de arquivo abertos implícito pelo ajuste `table_open_cache`. Se `table_open_cache` for definido muito alto, o MySQL pode ficar sem descritores de arquivo e apresentar sintomas como recusar conexões ou não realizar consultas.

Além disso, tenha em mente que o mecanismo de armazenamento `MyISAM` precisa de dois descritores de arquivo para cada tabela aberta de forma única. Para uma tabela `MyISAM` particionada, são necessários dois descritores de arquivo para cada partição da tabela aberta. (Quando o `MyISAM` abre uma tabela particionada, ele abre cada partição dessa tabela, independentemente de uma determinada partição estar ou não sendo usada. Veja `MyISAM` e uso de descritores de arquivo de partição.) Para aumentar o número de descritores de arquivo disponíveis para o MySQL, defina a variável de sistema `open_files_limit`. Veja a Seção B.3.2.16, “Arquivo Não Encontrado e Erros Semelhantes”.

O cache de tabelas abertas é mantido em um nível de `table_open_cache` entradas. O servidor ajusta automaticamente o tamanho do cache ao iniciar. Para definir o tamanho explicitamente, defina a variável de sistema `table_open_cache` ao iniciar. O MySQL pode abrir temporariamente mais tabelas do que isso para executar consultas, conforme descrito mais adiante nesta seção.

O MySQL fecha uma tabela não utilizada e a remove do cache de tabelas nas seguintes circunstâncias:

- Quando o cache está cheio e um thread de execução tenta abrir uma tabela que não está no cache.

- Quando o cache contém mais de `table_open_cache` entradas e uma tabela no cache não está mais sendo usada por nenhum dos threads.

- Quando ocorre uma operação de limpeza de tabela. Isso acontece quando alguém emite uma instrução `FLUSH TABLES` ou executa um comando **mysqladmin flush-tables** ou **mysqladmin refresh**.

Quando o cache da tabela se esgota, o servidor utiliza o seguinte procedimento para localizar uma entrada de cache a ser usada:

- As tabelas que não estão em uso atual são liberadas, começando com a tabela menos utilizada recentemente.

- Se uma nova tabela precisar ser aberta, mas o cache estiver cheio e nenhuma tabela possa ser liberada, o cache será temporariamente estendido conforme necessário. Quando o cache estiver em estado temporariamente estendido e uma tabela passar de estado usado para estado não usado, a tabela será fechada e liberada do cache.

Uma tabela `MyISAM` é aberta para cada acesso concorrente. Isso significa que a tabela precisa ser aberta duas vezes se dois threads acessarem a mesma tabela ou se um thread acessar a tabela duas vezes na mesma consulta (por exemplo, ao se juntar à tabela a si mesma). Cada abertura concorrente requer uma entrada no cache da tabela. A primeira abertura de qualquer tabela `MyISAM` requer dois descritores de arquivo: um para o arquivo de dados e outro para o arquivo de índice. Cada uso adicional da tabela requer apenas um descritor de arquivo para o arquivo de dados. O descritor de arquivo de índice é compartilhado entre todos os threads.

Se você estiver abrindo uma tabela com a instrução `HANDLER tbl_name OPEN`, um objeto de tabela dedicado é alocado para o thread. Esse objeto de tabela não é compartilhado por outros threads e não é fechado até que o thread chame `HANDLER tbl_name CLOSE` ou o thread termine. Quando isso acontece, a tabela é colocada de volta no cache de tabelas (se o cache não estiver cheio). Veja a Seção 13.2.4, “Instrução HANDLER”.

Para determinar se o cache da tabela é muito pequeno, verifique a variável `Opened_tables` (tabelas abertas), que indica o número de operações de abertura de tabelas desde que o servidor começou:

```sql
mysql> SHOW GLOBAL STATUS LIKE 'Opened_tables';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| Opened_tables | 2741  |
+---------------+-------+
```

Se o valor for muito grande ou aumentar rapidamente, mesmo quando você não emitiu muitas instruções `FLUSH TABLES`, aumente o valor `table_open_cache` ao iniciar o servidor.
