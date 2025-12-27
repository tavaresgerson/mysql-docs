### 10.6.1 Otimizando Consultas em `MyISAM`

Algumas dicas gerais para acelerar consultas em tabelas `MyISAM`:

* Para ajudar o MySQL a otimizar melhor as consultas, use `ANALYZE TABLE` ou execute **myisamchk --analyze** em uma tabela após ela ter sido carregada com dados. Isso atualiza um valor para cada parte do índice que indica o número médio de linhas que têm o mesmo valor. (Para índices únicos, esse valor é sempre 1.) O MySQL usa isso para decidir qual índice escolher quando você junta duas tabelas com base em uma expressão não constante. Você pode verificar o resultado da análise da tabela usando `SHOW INDEX FROM tbl_name` e examinando o valor `Cardinalidade`. **myisamchk --description --verbose** mostra informações sobre a distribuição dos índices.

* Para ordenar um índice e os dados de acordo com um índice, use **myisamchk --sort-index --sort-records=1** (assumindo que você deseja ordenar pelo índice 1). Essa é uma boa maneira de tornar as consultas mais rápidas se você tiver um índice único a partir do qual deseja ler todas as linhas em ordem de acordo com o índice. A primeira vez que você ordena uma tabela grande dessa maneira, pode levar um tempo longo.

* Tente evitar consultas `SELECT` complexas em tabelas `MyISAM` que são atualizadas frequentemente, para evitar problemas com o bloqueio da tabela que ocorrem devido à concorrência entre leitores e escritores.

* O `MyISAM` suporta inserções concorrentes: Se uma tabela não tiver blocos livres no meio do arquivo de dados, você pode inserir novas linhas nela ao mesmo tempo em que outros threads estão lendo a tabela. Se for importante ser capaz de fazer isso, considere usar a tabela de maneiras que evitem a exclusão de linhas. Outra possibilidade é executar `OPTIMIZE TABLE` para desfragmentar a tabela após ter excluído muitas linhas dela. Esse comportamento é alterado ao definir a variável `concurrent_insert`. Você pode forçar que novas linhas sejam anexadas (e, portanto, permitir inserções concorrentes), mesmo em tabelas que tenham linhas excluídas. Veja a Seção 10.11.3, “Inserções Concorrentes”.

* Para tabelas `MyISAM` que mudam com frequência, tente evitar todas as colunas de comprimento variável (`VARCHAR`, `BLOB` e `TEXT`). A tabela usa o formato de linha dinâmico se incluir até uma única coluna de comprimento variável. Veja o Capítulo 18, *Motores de Armazenamento Alternativos*.

* Normalmente, não é útil dividir uma tabela em diferentes tabelas apenas porque as linhas se tornam grandes. Ao acessar uma linha, o maior impacto no desempenho é o seek no disco necessário para encontrar o primeiro byte da linha. Após encontrar os dados, a maioria dos discos modernos pode ler toda a linha o suficiente para a maioria das aplicações. Os únicos casos em que dividir uma tabela faz uma diferença apreciável são se for uma tabela `MyISAM` usando o formato de linha dinâmico que você pode mudar para um tamanho de linha fixo, ou se você precisar muito frequentemente de escanear a tabela, mas não precisar de a maioria das colunas. Veja o Capítulo 18, *Motores de Armazenamento Alternativos*.

* Use `ALTER TABLE ... ORDER BY expr1, expr2, ...` se você geralmente recuperar linhas na ordem `expr1, expr2, ...`. Ao usar essa opção após alterações extensas na tabela, você pode ser capaz de obter um desempenho maior.

* Se você precisa calcular resultados, como contagens, com base em informações de muitas linhas, pode ser preferível criar uma nova tabela e atualizar o contador em tempo real. Uma atualização do seguinte formato é muito rápida:

  ```
  UPDATE tbl_name SET count_col=count_col+1 WHERE key_col=constant;
  ```

  Isso é muito importante quando você usa motores de armazenamento MySQL, como `MyISAM`, que tem apenas bloqueio de nível de tabela (leitores múltiplos com escritores únicos). Isso também proporciona um melhor desempenho com a maioria dos sistemas de banco de dados, porque o gerenciador de bloqueio de linha, neste caso, tem menos a fazer.

* Use `OPTIMIZE TABLE` periodicamente para evitar fragmentação com tabelas `MyISAM` com formato dinâmico. Veja a Seção 18.2.3, “Formatos de Armazenamento de Tabelas MyISAM”.

* Declarar uma tabela `MyISAM` com a opção de tabela `DELAY_KEY_WRITE=1` torna as atualizações de índice mais rápidas, pois elas não são descarregadas no disco até que a tabela seja fechada. A desvantagem é que, se algo matar o servidor enquanto uma tabela estiver aberta, você deve garantir que a tabela esteja em ordem, executando o servidor com a variável de sistema `myisam_recover_options` definida, ou executando **myisamchk** antes de reiniciar o servidor. (No entanto, mesmo neste caso, você não deve perder nada ao usar `DELAY_KEY_WRITE`, porque as informações chave podem sempre ser geradas a partir das linhas de dados.)

* As strings são automaticamente compactadas com espaços de prefixo e de fim em índices `MyISAM`. Veja a Seção 15.1.18, “Instrução CREATE INDEX”.

* Você pode aumentar o desempenho cacheando consultas ou respostas em sua aplicação e, em seguida, executando muitas inserções ou atualizações juntas. Bloquear a tabela durante essa operação garante que o cache de índice seja descarregado apenas uma vez após todas as atualizações.