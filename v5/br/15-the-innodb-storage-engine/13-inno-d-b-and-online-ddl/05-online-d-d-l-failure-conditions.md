### 14.13.5 Condições de falha do DDL online

O fracasso de uma operação DDL online geralmente ocorre devido a uma das seguintes condições:

- Uma cláusula `ALGORITHM` especifica um algoritmo que não é compatível com o tipo específico de operação de DDL ou motor de armazenamento.

- Uma cláusula `LOCK` especifica um baixo grau de bloqueio (`SHARED` ou `NONE`) que não é compatível com o tipo específico de operação de DDL.

- Um tempo de espera ocorre enquanto se aguarda por um bloqueio exclusivo na tabela, o que pode ser necessário brevemente durante as fases inicial e final da operação DDL.

- O sistema de arquivos `tmpdir` ou `innodb_tmpdir` fica sem espaço em disco, enquanto o MySQL escreve arquivos temporários de ordenação no disco durante a criação de índices. Para obter mais informações, consulte a Seção 14.13.3, “Requisitos de Espaço DDL Online”.

- A operação leva muito tempo e a DML concorrente modifica a tabela tanto que o tamanho do log online temporário excede o valor da opção de configuração `innodb_online_alter_log_max_size`. Essa condição causa um erro `DB_ONLINE_LOG_TOO_BIG`.

- A DML concorrente faz alterações na tabela que são permitidas com a definição original da tabela, mas não com a nova. A operação só falha no final, quando o MySQL tenta aplicar todas as alterações das instruções DML concorrentes. Por exemplo, você pode inserir valores duplicados em uma coluna enquanto um índice único está sendo criado, ou pode inserir valores `NULL` em uma coluna enquanto cria um índice de chave primária nessa coluna. As alterações feitas pela DML concorrente têm precedência, e a operação `ALTER TABLE` é efetivamente revertida.
