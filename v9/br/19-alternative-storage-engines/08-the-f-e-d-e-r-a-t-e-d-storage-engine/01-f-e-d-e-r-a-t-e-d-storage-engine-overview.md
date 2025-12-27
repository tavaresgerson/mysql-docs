### 18.8.1 Visão Geral do Motor de Armazenamento FEDERATED

Quando você cria uma tabela usando um dos motores de armazenamento padrão (como `MyISAM`, `CSV` ou `InnoDB`), a tabela consiste na definição da tabela e nos dados associados. Quando você cria uma tabela `FEDERATED`, a definição da tabela é a mesma, mas o armazenamento físico dos dados é gerenciado em um servidor remoto.

Uma tabela `FEDERATED` consiste em dois elementos:

* Um *servidor remoto* com uma tabela de banco de dados, que por sua vez consiste na definição da tabela (armazenada no dicionário de dados do MySQL) e na tabela associada. O tipo de tabela do servidor remoto pode ser qualquer tipo suportado pelo servidor `mysqld` remoto, incluindo `MyISAM` ou `InnoDB`.

* Um *servidor local* com uma tabela de banco de dados, onde a definição da tabela corresponde à da tabela correspondente no servidor remoto. A definição da tabela é armazenada no dicionário de dados. Não há arquivo de dados no servidor local. Em vez disso, a definição da tabela inclui uma string de conexão que aponta para a tabela remota.

Ao executar consultas e instruções em uma tabela `FEDERATED` no servidor local, as operações que normalmente inseririam, atualizariam ou excluiriam informações de um arquivo de dados local são enviadas ao servidor remoto para execução, onde elas atualizam o arquivo de dados no servidor remoto ou retornam linhas correspondentes do servidor remoto.

A estrutura básica de configuração de uma tabela `FEDERATED` é mostrada na Figura 18.2, “Estrutura da Tabela FEDERATED”.

**Figura 18.2 Estrutura da Tabela FEDERATED**

![O conteúdo é descrito no texto ao redor.](images/se-federated-structure.png)

Quando um cliente emite uma instrução SQL que se refere a uma tabela `FEDERATED`, o fluxo de informações entre o servidor local (onde a instrução SQL é executada) e o servidor remoto (onde os dados são armazenados fisicamente) é o seguinte:

1. O mecanismo de armazenamento examina cada coluna que a tabela `FEDERATED` possui e constrói uma instrução SQL apropriada que se refere à tabela remota.

2. A instrução é enviada ao servidor remoto usando as funções da API do cliente MySQL.

3. O servidor remoto processa a instrução e o servidor local recupera qualquer resultado que a instrução produza (um contador de linhas afetadas ou um conjunto de resultados).

4. Se a instrução produzir um conjunto de resultados, cada coluna é convertida para o formato do mecanismo de armazenamento interno que o mecanismo `FEDERATED` espera e pode usar para exibir o resultado ao cliente que emitiu a instrução original.

O servidor local comunica-se com o servidor remoto usando as funções da API C do cliente MySQL. Ele invoca `mysql_real_query()` para enviar a instrução. Para ler um conjunto de resultados, ele usa `mysql_store_result()` e recupera linhas uma de cada vez usando `mysql_fetch_row()`.