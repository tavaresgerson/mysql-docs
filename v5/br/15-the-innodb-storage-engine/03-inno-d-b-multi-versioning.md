## 14.3 Multiversão do InnoDB

`InnoDB` é um motor de armazenamento de múltiplas versões. Ele mantém informações sobre versões antigas de linhas alteradas para suportar recursos transacionais, como concorrência e rollback. Essas informações são armazenadas no espaço de tabela do sistema ou nos espaços de tabela de desfazer em uma estrutura de dados chamada segmento de desfazer. Veja a Seção 14.6.3.4, “Espaços de Tabela de Desfazer”. O `InnoDB` usa as informações no segmento de desfazer para realizar as operações de desfazer necessárias em um rollback de transação. Ele também usa as informações para construir versões anteriores de uma linha para uma leitura consistente. Veja a Seção 14.7.2.3, “Leitura Consistente Não Bloqueada”.

Internamente, o `InnoDB` adiciona três campos a cada linha armazenada no banco de dados:

- Um campo `DB_TRX_ID` de 6 bytes indica o identificador da transação para a última transação que inseriu ou atualizou a linha. Além disso, uma exclusão é tratada internamente como uma atualização, onde um bit especial na linha é definido para marcar como excluída.

- Um campo `DB_ROLL_PTR` de 7 bytes chamado ponteiro de desfazer. O ponteiro de desfazer aponta para um registro do log de desfazer escrito no segmento de rollback. Se a linha foi atualizada, o registro do log de desfazer contém as informações necessárias para reconstruir o conteúdo da linha antes que ela fosse atualizada.

- Um campo `DB_ROW_ID` de 6 bytes contém um ID de linha que aumenta de forma monótona à medida que novas linhas são inseridas. Se o `InnoDB` gerar um índice agrupado automaticamente, o índice contém valores de ID de linha. Caso contrário, a coluna `DB_ROW_ID` não aparece em nenhum índice.

Os registros de desfazer no segmento de rollback são divididos em registros de desfazer de inserção e atualização. Os registros de desfazer de inserção são necessários apenas em rollback de transações e podem ser descartados assim que a transação é confirmada. Os registros de desfazer de atualização são usados também em leituras consistentes, mas só podem ser descartados após não haver mais nenhuma transação para a qual o `InnoDB` tenha atribuído um instantâneo que, em uma leitura consistente, possa exigir as informações no registro de desfazer de atualização para construir uma versão anterior de uma linha de banco de dados. Para obter informações adicionais sobre registros de desfazer, consulte a Seção 14.6.7, “Registros de Desfazer”.

Recomenda-se que você execute transações regularmente, incluindo transações que realizam apenas leituras consistentes. Caso contrário, o `InnoDB` não poderá descartar dados dos registros de desfazer de atualização e o segmento de rollback pode crescer demais, enchendo o espaço de tabelas em que está armazenado. Para obter informações sobre a gestão de tabelas de desfazer, consulte a Seção 14.6.3.4, “Tabelas de desfazer”.

O tamanho físico de um registro do log de desfazer no segmento de rollback é geralmente menor que o respectivo registro inserido ou atualizado. Você pode usar essa informação para calcular o espaço necessário para o seu segmento de rollback.

No esquema de multiversão `InnoDB`, uma linha não é removida fisicamente do banco de dados imediatamente quando você a exclui com uma instrução SQL. O `InnoDB` remove fisicamente apenas a linha correspondente e seus registros de índice quando descarta o registro do log de desfazer da atualização escrito para a exclusão. Essa operação de remoção é chamada de purga e é bastante rápida, geralmente levando o mesmo tempo que a instrução SQL que fez a exclusão.

Se você inserir e excluir linhas em lotes pequenos e a uma taxa aproximadamente igual na tabela, o fio de purga pode começar a ficar para trás e a tabela pode ficar cada vez maior devido a todas as linhas "mortais", tornando tudo vinculado ao disco e muito lento. Nesses casos, reduza as operações de nova linha e aloque mais recursos ao fio de purga ajustando a variável de sistema `innodb_max_purge_lag`. Para mais informações, consulte a Seção 14.8.10, “Configuração de Purga”.

### Múltiplas versões e índices secundários

O controle de concorrência multiversão (MVCC) do `InnoDB` trata os índices secundários de maneira diferente dos índices agrupados. Os registros em um índice agrupado são atualizados in-place, e suas colunas de sistema ocultas apontam para entradas do log de desfazer a partir das quais versões anteriores dos registros podem ser reconstruídas. Ao contrário dos registros de índice agrupado, os registros de índice secundário não contêm colunas de sistema ocultas nem são atualizados in-place.

Quando uma coluna de índice secundário é atualizada, os registros antigos do índice secundário são marcados para exclusão, novos registros são inseridos e os registros marcados para exclusão são eventualmente eliminados. Quando um registro de índice secundário é marcado para exclusão ou a página do índice secundário é atualizada por uma transação mais recente, o `InnoDB` busca o registro do banco de dados no índice agrupado. No índice agrupado, o `DB_TRX_ID` do registro é verificado e a versão correta do registro é recuperada do log de desfazer se o registro foi modificado após a transação de leitura ter sido iniciada.

Se um registro de índice secundário for marcado para exclusão ou se a página do índice secundário for atualizada por uma transação mais recente, a técnica de índice coberto não é usada. Em vez de retornar valores da estrutura do índice, o `InnoDB` busca o registro no índice agrupado.

No entanto, se a otimização da condição de empilhamento do índice (ICP) estiver habilitada e partes da condição `WHERE` puderem ser avaliadas usando apenas campos do índice, o servidor MySQL ainda empurra essa parte da condição `WHERE` para o mecanismo de armazenamento, onde é avaliada usando o índice. Se não forem encontrados registros correspondentes, a pesquisa de índice agrupado é evitada. Se forem encontrados registros correspondentes, mesmo entre registros marcados para exclusão, o `InnoDB` pesquisa o registro no índice agrupado.
