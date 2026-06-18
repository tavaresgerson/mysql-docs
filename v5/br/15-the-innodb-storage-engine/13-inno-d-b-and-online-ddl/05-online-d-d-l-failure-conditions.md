### 14.13.5 Condições de Falha do DDL Online

A falha de uma operação de DDL online é tipicamente devida a uma das seguintes condições:

* Uma cláusula `ALGORITHM` especifica um algorithm que não é compatível com o tipo específico de operação DDL ou storage engine.

* Uma cláusula `LOCK` especifica um baixo grau de locking (`SHARED` ou `NONE`) que não é compatível com o tipo específico de operação DDL.

* Ocorre um timeout durante a espera por um exclusive lock na table, que pode ser necessário brevemente durante as fases inicial e final da operação DDL.

* O file system `tmpdir` ou `innodb_tmpdir` fica sem disk space enquanto o MySQL escreve temporary sort files no disk durante a criação de Index. Para mais informações, consulte a Seção 14.13.3, “Requisitos de Espaço do DDL Online”.

* A operação leva muito tempo e o DML concorrente modifica a table de tal forma que o tamanho do temporary online log excede o valor da opção de configuração `innodb_online_alter_log_max_size`. Essa condição causa um erro `DB_ONLINE_LOG_TOO_BIG`.

* O DML concorrente faz alterações na table que são permitidas com a definição original da table, mas não com a nova. A operação falha apenas no final, quando o MySQL tenta aplicar todas as alterações das instruções DML concorrentes. Por exemplo, você pode inserir valores duplicados em uma column enquanto um unique Index está sendo criado, ou pode inserir valores `NULL` em uma column enquanto cria um primary key Index nessa column. As alterações feitas pelo DML concorrente têm precedência, e a operação `ALTER TABLE` é efetivamente revertida (rolled back).