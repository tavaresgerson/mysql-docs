#### 19.5.1.7 Replicação de declarações `CREATE TABLE ... SELECT`

O MySQL aplica essas regras quando as declarações `CREATE TABLE ... SELECT` são replicadas:

* A declaração `CREATE TABLE ... SELECT` sempre realiza um commit implícito (Seção 15.3.3, “Declarações que causam um commit implícito”).

* Se a tabela de destino não existir, o registro ocorre da seguinte forma. Não importa se o `IF NOT EXISTS` está presente.

  + Formato `STATEMENT` ou `MIXED`: A declaração é registrada como escrita.

  + Formato `ROW`: A declaração é registrada como uma declaração `CREATE TABLE` seguida de uma série de eventos de inserção de linha.

Com os motores de armazenamento que suportam DDL atômico, a declaração é registrada como uma transação. Para mais informações, consulte a Seção 15.1.1, “Suporte a Declarações de Definição de Dados Atômicos”.

* Se a declaração `CREATE TABLE ... SELECT` falhar, nada é registrado. Isso inclui o caso em que a tabela de destino existe e o `IF NOT EXISTS` não é fornecido.

* Se a tabela de destino existir e o `IF NOT EXISTS` for fornecido, o MySQL 9.5 ignora a declaração completamente; nada é inserido ou registrado.

O MySQL 9.5 não permite que uma declaração `CREATE TABLE ... SELECT` faça quaisquer alterações em tabelas que não sejam a tabela criada pela declaração.