#### 8.10.2.1 Acesso Compartilhado ao Key Cache

Threads podem acessar os buffers do Key Cache simultaneamente, sujeitas às seguintes condições:

* Um buffer que não está sendo atualizado pode ser acessado por múltiplas sessions.

* Um buffer que está sendo atualizado faz com que as sessions que precisam usá-lo esperem até que o update seja concluído.

* Múltiplas sessions podem iniciar requests que resultam em substituições de blocos do Cache (*cache block replacements*), desde que não interfiram umas nas outras (ou seja, desde que precisem de diferentes index blocks e, consequentemente, causem a substituição de diferentes cache blocks).

O acesso compartilhado ao Key Cache permite que o server melhore significativamente o throughput.