#### 10.4.3.1 Como o MySQL Abre e Fecha Tabelas

Quando você executa o comando **mysqladmin status**, você deve ver algo como isso:

```
Uptime: 426 Running threads: 1 Questions: 11082
Reloads: 1 Open tables: 12
```

O valor `Open tables` (Abrir tabelas) de 12 pode ser um pouco intrigante se você tiver menos de 12 tabelas.

O MySQL é multithread, então pode haver muitos clientes emitindo consultas para uma determinada tabela simultaneamente. Para minimizar o problema de várias sessões de cliente com estados diferentes na mesma tabela, a tabela é aberta de forma independente por cada sessão concorrente. Isso usa memória adicional, mas normalmente aumenta o desempenho. Com tabelas `MyISAM`, um descritor de arquivo extra é necessário para o arquivo de dados para cada cliente que tem a tabela aberta. (Em contraste, o descritor de arquivo de índice é compartilhado entre todas as sessões.)

As variáveis de sistema `table_open_cache` e `max_connections` afetam o número máximo de arquivos que o servidor mantém abertos. Se você aumentar um ou ambos esses valores, pode encontrar um limite imposto pelo seu sistema operacional sobre o número de descritores de arquivo abertos por processo. Muitos sistemas operacionais permitem que você aumente o limite de arquivos abertos, embora o método varie muito de sistema para sistema. Consulte a documentação do seu sistema operacional para determinar se é possível aumentar o limite e como fazer isso.

`table_open_cache` está relacionado a `max_connections`. Por exemplo, para 200 conexões em execução simultâneas, especifique um tamanho de cache de tabela de pelo menos `200 * N`, onde *`N`* é o número máximo de tabelas por junção em qualquer uma das consultas que você executa. Você também deve reservar alguns descritores de arquivo extras para tabelas e arquivos temporários.

Certifique-se de que o seu sistema operacional possa lidar com o número de descritores de arquivo abertos implícito pelo ajuste `table_open_cache`. Se `table_open_cache` estiver definido muito alto, o MySQL pode ficar sem descritores de arquivo e apresentar sintomas como recusar conexões ou não realizar consultas.

Além disso, tenha em mente que o mecanismo de armazenamento `MyISAM` precisa de dois descritores de arquivo para cada tabela aberta de forma única. Para aumentar o número de descritores de arquivo disponíveis para o MySQL, defina a variável de sistema `open_files_limit`. Veja a Seção B.3.2.16, “Arquivo Não Encontrado e Erros Semelhantes”.

O cache de tabelas abertas é mantido em um nível de entradas de `table_open_cache`. O servidor ajusta automaticamente o tamanho do cache ao iniciar. Para definir o tamanho explicitamente, defina a variável de sistema `table_open_cache` ao iniciar. O MySQL pode abrir temporariamente mais tabelas do que isso para executar consultas, conforme descrito mais adiante nesta seção.

O MySQL fecha uma tabela não utilizada e a remove do cache de tabelas nas seguintes circunstâncias:

* Quando o cache está cheio e um thread tenta abrir uma tabela que não está no cache.

* Quando o cache contém mais de `table_open_cache` entradas e uma tabela no cache não está mais sendo usada por nenhum thread.

* Quando uma operação de limpeza de tabela ocorre. Isso acontece quando alguém emite uma declaração `FLUSH TABLES` ou executa um comando **mysqladmin flush-tables** ou **mysqladmin refresh**.

Quando o cache de tabelas se esgota, o servidor usa o seguinte procedimento para localizar uma entrada de cache a ser usada:

* Tabelas atualmente não em uso são liberadas, começando com a tabela menos recentemente usada.

* Se uma nova tabela precisar ser aberta, mas o cache estiver cheio e nenhuma tabela possa ser liberada, o cache será temporariamente estendido conforme necessário. Quando o cache estiver em estado temporariamente estendido e uma tabela passar de estado usado para estado não usado, a tabela será fechada e liberada do cache.

Uma tabela `MyISAM` é aberta para cada acesso concorrente. Isso significa que a tabela precisa ser aberta duas vezes se dois threads acessarem a mesma tabela ou se um thread acessar a tabela duas vezes na mesma consulta (por exemplo, ao se juntar a si mesma). Cada abertura concorrente requer uma entrada no cache de tabela. A primeira abertura de qualquer tabela `MyISAM` requer dois descritores de arquivo: um para o arquivo de dados e um para o arquivo de índice. Cada uso adicional da tabela requer apenas um descritor de arquivo para o arquivo de dados. O descritor de arquivo de índice é compartilhado entre todos os threads.

Se você estiver abrindo uma tabela com a instrução `HANDLER tbl_name OPEN`, um objeto de tabela dedicado é alocado para o thread. Esse objeto de tabela não é compartilhado por outros threads e não é fechado até que o thread chame `HANDLER tbl_name CLOSE` ou o thread termine. Quando isso acontece, a tabela é colocada de volta no cache de tabela (se o cache não estiver cheio). Veja a Seção 15.2.5, “Instrução HANDLER”.

Para determinar se o cache de sua tabela é pequeno demais, verifique a variável `Opened_tables` (Tabelas Abertas), que indica o número de operações de abertura de tabela desde que o servidor começou:

```
mysql> SHOW GLOBAL STATUS LIKE 'Opened_tables';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| Opened_tables | 2741  |
+---------------+-------+
```

Se o valor for muito grande ou aumentar rapidamente, mesmo quando você não emitiu muitas instruções `FLUSH TABLES`, aumente o valor `table_open_cache` no início do servidor.