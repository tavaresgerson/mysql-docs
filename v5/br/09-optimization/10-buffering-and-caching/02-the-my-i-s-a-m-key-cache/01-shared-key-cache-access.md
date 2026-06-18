#### 8.10.2.1 Acesso à Cache de Chave Compartilhada

Os threads podem acessar os buffers de cache principais simultaneamente, sujeito às seguintes condições:

- Um buffer que não está sendo atualizado pode ser acessado por múltiplas sessões.

- Um buffer que está sendo atualizado faz com que as sessões que precisam usá-lo esperem até que a atualização seja concluída.

- Várias sessões podem iniciar solicitações que resultam em substituições de blocos de cache, desde que não interfiram umas nas outras (ou seja, desde que precisem de blocos de índice diferentes e, portanto, causem a substituição de diferentes blocos de cache).

O acesso compartilhado ao cache de chaves permite que o servidor melhore significativamente o desempenho.
