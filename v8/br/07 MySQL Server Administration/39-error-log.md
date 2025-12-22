### 7.4.2 Registro de erros

Esta seção discute como configurar o servidor MySQL para o registro de mensagens de diagnóstico no registro de erros. Para informações sobre a seleção do conjunto de caracteres e da linguagem da mensagem de erro, consulte a Seção 12.6, Conjunto de caracteres da mensagem de erro, e a Seção 12.12, Configuração da linguagem da mensagem de erro.

O log de erros contém um registro dos tempos de inicialização e desligamento do `mysqld`. Ele também contém mensagens de diagnóstico, como erros, avisos e notas que ocorrem durante a inicialização e desligamento do servidor e enquanto o servidor está em execução. Por exemplo, se `mysqld` notar que uma tabela precisa ser verificada ou reparada automaticamente, ele escreve uma mensagem para o log de erros.

Dependendo da configuração do log de erros, as mensagens de erro também podem preencher a tabela de Performance Schema `error_log`, para fornecer uma interface SQL para o log e permitir que seu conteúdo seja consultado.

Em alguns sistemas operacionais, o log de erro contém um rastreamento de pilha se `mysqld` sair anormalmente. O rastreamento pode ser usado para determinar onde `mysqld` saiu. Veja Seção 7.9, "Debugging MySQL".

Se usado para iniciar `mysqld`, **mysqld\_safe** pode escrever mensagens para o log de erros. Por exemplo, quando **mysqld\_safe** percebe saídas anormais do `mysqld`, ele reinicia `mysqld` e escreve uma mensagem `mysqld restarted` para o log de erros.

As seções a seguir discutem aspectos da configuração do registo de erros.
