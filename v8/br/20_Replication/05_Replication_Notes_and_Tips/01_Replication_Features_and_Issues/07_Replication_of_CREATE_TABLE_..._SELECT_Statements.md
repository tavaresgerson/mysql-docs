#### 19.5.1.7 Replicação de declarações CREATE TABLE ... SELECT

O MySQL aplica essas regras quando as instruções `CREATE TABLE ... SELECT` são replicadas:

- `CREATE TABLE ... SELECT` sempre realiza um commit implícito (seção 15.3.3, "Declarações que causam um commit implícito").

- Se a tabela de destino não existir, o registro ocorre da seguinte forma. Não importa se o `IF NOT EXISTS` está presente.

  - Formato `STATEMENT` ou `MIXED`: A declaração é registrada conforme escrito.

  - Formato `ROW`: A declaração é registrada como uma declaração `CREATE TABLE` seguida por uma série de eventos de inserção de linha.

    Antes do MySQL 8.0.21, a declaração é registrada como duas transações. A partir do MySQL 8.0.21, em motores de armazenamento que suportam DDL atômico, ela é registrada como uma única transação. Para mais informações, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômicos”.

- Se a instrução `CREATE TABLE ... SELECT` falhar, nada é registrado. Isso inclui o caso em que a tabela de destino existe e `IF NOT EXISTS` não é fornecido.

- Se a tabela de destino existir e `IF NOT EXISTS` for fornecido, o MySQL 8.0 ignora completamente a instrução; nada é inserido ou registrado.

O MySQL 8.0 não permite que uma instrução `CREATE TABLE ... SELECT` faça alterações em tabelas diferentes daquela criada pela instrução.
