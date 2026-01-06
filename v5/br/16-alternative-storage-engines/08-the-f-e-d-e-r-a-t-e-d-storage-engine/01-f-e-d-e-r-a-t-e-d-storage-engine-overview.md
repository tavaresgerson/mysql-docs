### 15.8.1 Visão geral do mecanismo de armazenamento FEDERATED

Quando você cria uma tabela usando um dos motores de armazenamento padrão (como `MyISAM`, `CSV` ou `InnoDB`), a tabela consiste na definição da tabela e nos dados associados. Quando você cria uma tabela `FEDERATED`, a definição da tabela é a mesma, mas o armazenamento físico dos dados é gerenciado em um servidor remoto.

Uma tabela `FEDERATED` é composta por dois elementos:

- Um *servidor remoto* com uma tabela de banco de dados, que por sua vez consiste na definição da tabela (armazenada no arquivo `.frm`) e na tabela associada. O tipo de tabela do banco de dados remoto pode ser qualquer tipo suportado pelo servidor `mysqld` remoto, incluindo `MyISAM` ou `InnoDB`.

- Um *servidor local* com uma tabela de banco de dados, onde a definição da tabela corresponde à tabela correspondente no servidor remoto. A definição da tabela é armazenada dentro do arquivo `.frm`. No entanto, não há nenhum arquivo de dados no servidor local. Em vez disso, a definição da tabela inclui uma string de conexão que aponta para a tabela remota.

Ao executar consultas e declarações em uma tabela `FEDERATED` no servidor local, as operações que normalmente inseririam, atualizariam ou excluiriam informações de um arquivo de dados local são enviadas ao servidor remoto para execução, onde elas atualizam o arquivo de dados no servidor remoto ou retornam linhas correspondentes do servidor remoto.

A estrutura básica de uma configuração de tabela `FEDERATED` é mostrada na Figura 15.2, "Estrutura da Tabela FEDERATED".

**Figura 15.2 Estrutura da Tabela FEDERATED**

![O conteúdo é descrito no texto ao redor.](images/se-federated-structure.png)

Quando um cliente emite uma instrução SQL que se refere a uma tabela `FEDERATED`, o fluxo de informações entre o servidor local (onde a instrução SQL é executada) e o servidor remoto (onde os dados são armazenados fisicamente) é o seguinte:

1. O mecanismo de armazenamento examina cada coluna que a tabela `FEDERATED` possui e constrói uma declaração SQL apropriada que faz referência à tabela remota.

2. A declaração é enviada ao servidor remoto usando a API do cliente MySQL.

3. O servidor remoto processa a declaração e o servidor local recupera qualquer resultado que a declaração produza (um número de linhas afetadas ou um conjunto de resultados).

4. Se a declaração produzir um conjunto de resultados, cada coluna é convertida para o formato do motor de armazenamento interno que o motor `FEDERATED` espera e pode usar para exibir o resultado ao cliente que emitiu a declaração original.

O servidor local comunica-se com o servidor remoto usando as funções do cliente C da MySQL. Ele invoca `mysql_real_query()` para enviar a instrução. Para ler um conjunto de resultados, ele usa `mysql_store_result()` e recupera as linhas uma de cada vez usando `mysql_fetch_row()`.
