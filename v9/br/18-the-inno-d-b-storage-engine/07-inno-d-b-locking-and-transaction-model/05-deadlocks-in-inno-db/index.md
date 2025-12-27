### 17.7.5 Blo quedas em InnoDB

17.7.5.1 Um exemplo de blo queda em InnoDB

17.7.5.2 Detecção de blo quedas

17.7.5.3 Como minimizar e lidar com blo quedas

Um blo queda é uma situação em que múltiplas transações não conseguem prosseguir porque cada transação mantém um bloqueio que é necessário por outra. Como todas as transações envolvidas estão esperando pelo mesmo recurso ficar disponível, nenhuma delas libera o bloqueio que mantém.

Um blo queda pode ocorrer quando as transações bloqueiam linhas em múltiplas tabelas (através de instruções como `UPDATE` ou `SELECT ... FOR UPDATE`), mas na ordem inversa. Um blo queda também pode ocorrer quando tais instruções bloqueiam faixas de registros de índice e lacunas, com cada transação adquirindo alguns bloqueios, mas não outros devido a um problema de sincronização. Para um exemplo de blo queda, consulte a Seção 17.7.5.1, “Um exemplo de blo queda em InnoDB”.

Para reduzir a possibilidade de blo quedas, use transações em vez de instruções `LOCK TABLES`; mantenha as transações que inserem ou atualizam dados pequenas o suficiente para não permanecerem abertas por longos períodos de tempo; quando diferentes transações atualizam múltiplas tabelas ou grandes faixas de linhas, use a mesma ordem de operações (como `SELECT ... FOR UPDATE`) em cada transação; crie índices nas colunas usadas nas instruções `SELECT ... FOR UPDATE` e `UPDATE ... WHERE`. A possibilidade de blo quedas não é afetada pelo nível de isolamento, porque o nível de isolamento altera o comportamento das operações de leitura, enquanto os blo quedas ocorrem devido a operações de escrita. Para mais informações sobre como evitar e recuperar de condições de blo queda, consulte a Seção 17.7.5.3, “Como minimizar e lidar com blo quedas”.

Quando a detecção de impasses está habilitada (o padrão) e um impasse ocorre, o `InnoDB` detecta a condição e desfaz uma das transações (a vítima). Se a detecção de impasses estiver desabilitada usando a variável `innodb_deadlock_detect`, o `InnoDB` depende da configuração `innodb_lock_wait_timeout` para desfazer transações em caso de impasse. Assim, mesmo que a lógica da sua aplicação esteja correta, você ainda deve lidar com o caso em que uma transação deve ser retente. Para ver o último impasse em uma transação de usuário do `InnoDB`, use `SHOW ENGINE INNODB STATUS`. Se impasses frequentes destacam um problema com a estrutura da transação ou o tratamento de erros da aplicação, habilite `innodb_print_all_deadlocks` para imprimir informações sobre todos os impasses no log de erro do **mysqld**. Para obter mais informações sobre como os impasses são detectados e tratados automaticamente, consulte a Seção 17.7.5.2, “Detecção de Impasses”.