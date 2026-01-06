#### 16.4.1.6 Replicação de declarações CREATE TABLE ... SELECT

Esta seção discute como o MySQL replica as instruções `CREATE TABLE ... SELECT`.

O MySQL 5.7 não permite que uma instrução `CREATE TABLE ... SELECT` faça alterações em tabelas diferentes daquela criada pela instrução. Algumas versões mais antigas do MySQL permitiam que essas instruções fizessem isso; isso significa que, ao usar replicação entre uma replica do MySQL 5.6 ou posterior e uma fonte executando uma versão anterior do MySQL, uma instrução `CREATE TABLE ... SELECT` que causa alterações em outras tabelas na fonte falha na replica, fazendo com que a replicação pare. Para evitar que isso aconteça, você deve usar a replicação baseada em linhas, reescrever a instrução ofensiva antes de executá-la na fonte ou atualizar a fonte para o MySQL 5.7. (Se você optar por atualizar a fonte, tenha em mente que tal instrução `CREATE TABLE ... SELECT` falha após a atualização, a menos que seja reescrita para remover quaisquer efeitos colaterais em outras tabelas.)

Esses comportamentos não dependem da versão do MySQL:

- `CREATE TABLE ... SELECT` sempre realiza um commit implícito (Seção 13.3.3, “Declarações que Causam um Commit Implícito”).

- Se a tabela de destino não existir, o registro ocorre da seguinte forma. Não importa se o `IF NOT EXISTS` está presente.

  - Formato `DECLARATIVO` ou `MISTO`: A declaração é registrada conforme escrito.

  - Formato `ROW`: A declaração é registrada como uma declaração de `CREATE TABLE` seguida por uma série de eventos de inserção de linha.

- Se a declaração falhar, nada é registrado. Isso inclui o caso em que a tabela de destino existe e o `IF NOT EXISTS` não é fornecido.

Quando a tabela de destino existe e o comando `IF NOT EXISTS` é fornecido, o MySQL 5.7 ignora completamente a instrução; nada é inserido ou registrado.
