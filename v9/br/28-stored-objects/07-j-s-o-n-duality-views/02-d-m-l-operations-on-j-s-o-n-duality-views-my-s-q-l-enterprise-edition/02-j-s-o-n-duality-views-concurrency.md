#### 27.7.2.2 Visões de Dualidade JSON — Concorrência

As operações de Múltiplo Acesso e Modificação (DML) para visões de dualidade JSON na Edição Empresarial do MySQL suportam o controle de concorrência otimista sem bloqueio (LOCC).

O uso do LOCC protege contra conflitos e inconsistências de dados para operações concorrentes. Isso é especialmente importante para operações de leitura e escrita que usam chamadas sem estado separadas, como solicitações REST.

Considere o seguinte exemplo:

* Um usuário acessa dados em um aplicativo móvel com uma solicitação `REST GET`, e depois decide atualizar algumas informações com uma solicitação `REST PUT`.

* Se outro usuário atualizar os dados subjacentes com outra solicitação `REST PUT` entre o momento da solicitação `REST GET` anterior e a solicitação `REST PUT`, a segunda solicitação `REST PUT` sobrescreverá os dados, tornando-os inconsistentes.

Essa situação ocorre porque os recursos não podem ser bloqueados por um tempo não determinístico entre as duas solicitações REST. Mais importante, as chamadas REST são sem estado, e não há garantia de que as chamadas usarão a mesma conexão com o banco de dados onde a transação começou.

Para resolver isso, o LOCC verifica no ponto de atualização se os dados foram alterados desde que foram lidos pela última vez. Se os dados foram alterados, a atualização é rejeitada, o que permite que o aplicativo lide com o conflito de maneira apropriada.

O LOCC usa o suporte embutido para cálculo de `ETAG()`, e usa valores de `ETAG()` armazenados no campo `etag` do sub-objeto `_metadata` nos documentos JSON. O campo `etag` representa um hash do estado atual do documento, excluindo (por padrão) `_metadata`. Ele serve como uma assinatura que identifica de forma única o objeto.

Nota

Os tipos `BLOB` são armazenados como binários, mas representados no formato codificado em base64 quando projetados como saída `SELECT`. Isso significa que o valor `etag` pode ser diferente quando executado com o mesmo input como um `BLOB` e como uma string formatada manualmente em base64.

A concorrência é tratada da seguinte forma:

1. O usuário lê os dados (usando `SELECT`), armazenando-os localmente.

2. O usuário modifica a cópia local dos dados, deixando o valor `etag` gerado inalterado.

3. A execução de uma declaração `UPDATE` reconstrui o objeto (incluindo metadados) usando `SELECT` e persiste quaisquer alterações apenas se o estado reconstruído (ou seja, o resultado de `ETAG()` no objeto reconstruído) corresponder ao estado lido anteriormente.

4. Se os valores `etag` não corresponderem, o MySQL gera um erro, que as aplicações podem lidar re lendo os dados e tentando novamente a operação, se desejado.

O valor `etag` serve apenas como um valor de controle e não é armazenado; ele é gerado no tempo de execução de `SELECT` ou `UPDATE`.