#### 27.3.6.11 API de Transação JavaScript

O MLE suporta uma API de transação MySQL em JavaScript que imita as ações da maioria das instruções SQL transacionais MySQL. Todas as funções listadas aqui, juntamente com suas descrições e equivalentes em SQL, são métodos do objeto `Session`:

* `commit()`: Confirmar a transação em andamento.

  Equivalente a `COMMIT`.

* `releaseSavepoint()`: Liberar um savepoint dado de uma transação em andamento. Lança um erro se o nome do savepoint estiver vazio.

  Equivalente a `RELEASE SAVEPOINT`.

* `rollback()`: Reverter a transação em andamento.

  Equivalente a `ROLLBACK`.

* `rollbackTo()`: Voltar para um savepoint existente. Lança um erro se o nome do savepoint estiver vazio.

  Equivalente a `ROLLBACK TO SAVEPOINT`.

* `setSavepoint()`: Criar um novo savepoint com o nome fornecido (e retorná-lo). Se não for fornecido um nome de savepoint, um é gerado.

  Equivalente a `SAVEPOINT`.

* `startTransaction()`: Iniciar uma nova transação.

  Equivalente a `START TRANSACTION`.

* `autocommit()`: Obter ou definir o valor da variável de sistema `autocommit`: Se `session.autocommit()` for chamado sem um valor, ele retorna o valor atual de `autocommit`; caso contrário, ele define o valor de `autocommit`.

  Equivalente a `SET AUTOCOMMIT`.