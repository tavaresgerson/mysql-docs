#### 10.10.2.1 Acesso ao Cache de Chave Compartilhado

Os threads podem acessar os buffers do cache de chave simultaneamente, sujeito às seguintes condições:

* Um buffer que não está sendo atualizado pode ser acessado por múltiplas sessões.

* Um buffer que está sendo atualizado faz com que as sessões que precisam usá-lo esperem até que a atualização esteja completa.

* Múltiplas sessões podem iniciar solicitações que resultam em substituições de blocos de cache, desde que não interfiram umas com as outras (ou seja, desde que precisem de blocos de índice diferentes e, portanto, causem a substituição de blocos de cache diferentes).

O acesso compartilhado ao cache de chave permite que o servidor melhore significativamente o desempenho.