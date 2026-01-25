### 8.6.1 Otimizando Queries MyISAM

Algumas dicas gerais para acelerar Queries em tabelas `MyISAM`:

* Para ajudar o MySQL a otimizar melhor as Queries, use `ANALYZE TABLE` ou execute **myisamchk --analyze** em uma tabela após ela ter sido carregada com dados. Isso atualiza um valor para cada parte do Index que indica o número médio de linhas que possuem o mesmo valor. (Para Indexes únicos, este valor é sempre 1.) O MySQL usa isso para decidir qual Index escolher quando você faz um JOIN de duas tabelas com base em uma expressão não constante. Você pode verificar o resultado da análise da tabela usando `SHOW INDEX FROM tbl_name` e examinando o valor de `Cardinality`. **myisamchk --description --verbose** mostra informações de distribuição do Index.

* Para ordenar um Index e dados de acordo com um Index, use **myisamchk --sort-index --sort-records=1** (assumindo que você deseja ordenar pelo Index 1). Esta é uma boa maneira de acelerar Queries se você tiver um Index único do qual deseja ler todas as linhas em ordem de acordo com o Index. Na primeira vez que você ordenar uma tabela grande dessa forma, isso pode levar muito tempo.

* Tente evitar Queries `SELECT` complexas em tabelas `MyISAM` que são atualizadas frequentemente, para evitar problemas com Lock de tabela que ocorrem devido à contenção entre leitores e escritores.

* O `MyISAM` suporta Inserts concorrentes: Se uma tabela não tiver blocos livres no meio do arquivo de dados, você pode fazer `INSERT` de novas linhas nela ao mesmo tempo em que outros Threads estão lendo a tabela. Se for importante poder fazer isso, considere usar a tabela de maneiras que evitem a exclusão de linhas. Outra possibilidade é executar `OPTIMIZE TABLE` para desfragmentar a tabela depois de ter excluído muitas linhas dela. Este comportamento é alterado configurando a variável `concurrent_insert`. Você pode forçar que novas linhas sejam anexadas (e, portanto, permitir Inserts concorrentes), mesmo em tabelas que tenham linhas excluídas. Consulte a Seção 8.11.3, “Concurrent Inserts”.

* Para tabelas `MyISAM` que mudam frequentemente, tente evitar todas as colunas de comprimento variável (`VARCHAR`, `BLOB` e `TEXT`). A tabela usa o formato de linha dinâmico se incluir até mesmo uma única coluna de comprimento variável. Consulte o Capítulo 15, *Alternative Storage Engines*.

* Normalmente, não é útil dividir uma tabela em tabelas diferentes apenas porque as linhas se tornam grandes. Ao acessar uma linha, o maior impacto na performance é a busca em disco (disk seek) necessária para encontrar o primeiro byte da linha. Depois de encontrar os dados, a maioria dos discos modernos pode ler a linha inteira rápido o suficiente para a maioria das aplicações. Os únicos casos em que a divisão de uma tabela faz uma diferença apreciável são se for uma tabela `MyISAM` que usa formato de linha dinâmico que você pode alterar para um tamanho de linha fixo, ou se você precisar frequentemente fazer um scan da tabela, mas não precisar da maioria das colunas. Consulte o Capítulo 15, *Alternative Storage Engines*.

* Use `ALTER TABLE ... ORDER BY expr1, expr2, ...` se você geralmente recupera linhas na ordem `expr1, expr2, ...`. Ao usar esta opção após mudanças extensivas na tabela, você pode conseguir uma performance superior.

* Se você frequentemente precisa calcular resultados, como contagens, com base em informações de muitas linhas, pode ser preferível introduzir uma nova tabela e atualizar o contador em tempo real. Um UPDATE da seguinte forma é muito rápido:

  ```sql
  UPDATE tbl_name SET count_col=count_col+1 WHERE key_col=constant;
  ```

  Isto é muito importante quando você usa Storage Engines do MySQL, como `MyISAM`, que possuem apenas Lock em nível de tabela (múltiplos leitores com escritores únicos). Isso também oferece melhor performance na maioria dos sistemas de Database, pois o gerenciador de Row Locking, neste caso, tem menos trabalho a fazer.

* Use `OPTIMIZE TABLE` periodicamente para evitar a fragmentação com tabelas `MyISAM` de formato dinâmico. Consulte a Seção 15.2.3, “MyISAM Table Storage Formats”.

* Declarar uma tabela `MyISAM` com a opção de tabela `DELAY_KEY_WRITE=1` torna os Updates de Index mais rápidos, pois eles não são descarregados para o disco (flushed to disk) até que a tabela seja fechada. A desvantagem é que, se algo interromper o server enquanto essa tabela estiver aberta, você deve garantir que a tabela esteja OK, executando o server com a variável de sistema `myisam_recover_options` configurada, ou executando **myisamchk** antes de reiniciar o server. (No entanto, mesmo neste caso, você não deve perder nada usando `DELAY_KEY_WRITE`, porque as informações da Key podem sempre ser geradas a partir das linhas de dados.)

* Strings são automaticamente comprimidas por prefixo e espaço final em Indexes `MyISAM`. Consulte a Seção 13.1.14, “CREATE INDEX Statement”.

* Você pode aumentar a performance fazendo cache de Queries ou respostas em sua aplicação e, em seguida, executando muitos Inserts ou Updates juntos. Fazer o Locking da tabela durante esta operação garante que o cache do Index seja descarregado (flushed) apenas uma vez após todos os Updates. Você também pode tirar proveito do Query Cache do MySQL para obter resultados semelhantes; consulte a Seção 8.10.3, “The MySQL Query Cache”.