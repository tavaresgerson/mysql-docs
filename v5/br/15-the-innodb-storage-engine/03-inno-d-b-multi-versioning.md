## 14.3 Multi-Versioning do InnoDB

O `InnoDB` é um *storage engine* multi-versão. Ele mantém informações sobre versões antigas de linhas alteradas para dar suporte a funcionalidades transacionais, como *concurrency* e *rollback*. Essa informação é armazenada no *system tablespace* ou *undo tablespaces* em uma estrutura de dados chamada *rollback segment*. Consulte a Seção 14.6.3.4, “Undo Tablespaces”. O `InnoDB` usa as informações no *rollback segment* para executar as operações de *undo* necessárias em um *transaction rollback*. Ele também usa as informações para construir versões anteriores de uma linha para uma *consistent read*. Consulte a Seção 14.7.2.3, “Consistent Nonlocking Reads”.

Internamente, o `InnoDB` adiciona três campos a cada linha armazenada no *Database*:

* Um campo `DB_TRX_ID` de 6 *bytes* indica o identificador da *transaction* para a última *transaction* que inseriu ou atualizou a linha. Além disso, uma exclusão é tratada internamente como uma atualização onde um *bit* especial na linha é definido para marcá-la como excluída.

* Um campo `DB_ROLL_PTR` de 7 *bytes* chamado *roll pointer*. O *roll pointer* aponta para um registro de *undo log* escrito no *rollback segment*. Se a linha foi atualizada, o registro de *undo log* contém as informações necessárias para reconstruir o conteúdo da linha antes de ser atualizada.

* Um campo `DB_ROW_ID` de 6 *bytes* contém um ID de linha (*row ID*) que aumenta monotonicamente à medida que novas linhas são inseridas. Se o `InnoDB` gera um *clustered index* automaticamente, o *index* contém valores de *row ID*. Caso contrário, a coluna `DB_ROW_ID` não aparece em nenhum *index*.

Os *undo logs* no *rollback segment* são divididos em *insert undo logs* e *update undo logs*. Os *insert undo logs* são necessários apenas no *transaction rollback* e podem ser descartados assim que a *transaction* faz *commit*. Os *Update undo logs* também são usados em *consistent reads*, mas só podem ser descartados após não haver mais nenhuma *transaction* presente para a qual o `InnoDB` tenha atribuído um *snapshot* que, em uma *consistent read*, poderia exigir a informação no *update undo log* para construir uma versão anterior de uma linha do *Database*. Para informações adicionais sobre *undo logs*, consulte a Seção 14.6.7, “Undo Logs”.

É recomendado que você faça o *commit* das *transactions* regularmente, incluindo *transactions* que emitem apenas *consistent reads*. Caso contrário, o `InnoDB` não pode descartar dados dos *update undo logs*, e o *rollback segment* pode crescer demais, preenchendo o *tablespace* no qual ele reside. Para informações sobre o gerenciamento de *undo tablespaces*, consulte a Seção 14.6.3.4, “Undo Tablespaces”.

O tamanho físico de um registro de *undo log* no *rollback segment* é tipicamente menor do que a linha correspondente inserida ou atualizada. Você pode usar essa informação para calcular o espaço necessário para o seu *rollback segment*.

No esquema de *multi-versioning* do `InnoDB`, uma linha não é fisicamente removida do *Database* imediatamente quando você a exclui com uma instrução SQL. O `InnoDB` remove fisicamente a linha correspondente e seus registros de *index* somente quando descarta o registro de *update undo log* escrito para a exclusão. Esta operação de remoção é chamada *purge*, e é bastante rápida, geralmente levando a mesma ordem de tempo que a instrução SQL que executou a exclusão.

Se você insere e exclui linhas em lotes pequenos, aproximadamente na mesma taxa na tabela, o *purge thread* pode começar a ficar atrasado (*lag behind*) e a tabela pode crescer cada vez mais devido a todas as linhas "mortas", tornando tudo dependente de disco (*disk-bound*) e muito lento. Nesses casos, estrangule (*throttle*) novas operações de linha e aloque mais recursos ao *purge thread* ajustando a *system variable* `innodb_max_purge_lag`. Para mais informações, consulte a Seção 14.8.10, “Purge Configuration”.

### Multi-Versioning e Secondary Indexes

O controle de *concurrency* multi-versão do `InnoDB` (*MVCC*) trata os *secondary indexes* de forma diferente dos *clustered indexes*. Registros em um *clustered index* são atualizados *in-place*, e suas colunas de sistema ocultas apontam para entradas de *undo log* a partir das quais versões anteriores dos registros podem ser reconstruídas. Diferentemente dos registros de *clustered index*, os registros de *secondary index* não contêm colunas de sistema ocultas nem são atualizados *in-place*.

Quando uma coluna de *secondary index* é atualizada, registros antigos de *secondary index* são marcados para exclusão (*delete-marked*), novos registros são inseridos e os registros marcados para exclusão são eventualmente submetidos ao *purge*. Quando um registro de *secondary index* é marcado para exclusão ou a página do *secondary index* é atualizada por uma *transaction* mais recente, o `InnoDB` procura o registro do *Database* no *clustered index*. No *clustered index*, o `DB_TRX_ID` do registro é verificado, e a versão correta do registro é recuperada do *undo log* se o registro foi modificado após a *transaction* de leitura ter sido iniciada.

Se um registro de *secondary index* for marcado para exclusão ou a página do *secondary index* for atualizada por uma *transaction* mais recente, a técnica de *covering index* não é utilizada. Em vez de retornar valores da estrutura do *index*, o `InnoDB` procura o registro no *clustered index*.

No entanto, se a otimização *index condition pushdown* (*ICP*) estiver habilitada, e partes da condição *WHERE* puderem ser avaliadas usando apenas campos do *index*, o servidor MySQL ainda envia (*pushes*) essa parte da condição *WHERE* para o *storage engine*, onde ela é avaliada usando o *index*. Se nenhum registro correspondente for encontrado, a *clustered index lookup* é evitada. Se registros correspondentes forem encontrados, mesmo entre registros marcados para exclusão, o `InnoDB` procura o registro no *clustered index*.