### 7.4.2 O Log de Erros

Esta seção discute como configurar o servidor MySQL para registrar mensagens de diagnóstico no log de erros. Para informações sobre a seleção do conjunto de caracteres e idioma da mensagem de erro, consulte a Seção 12.6, “Conjunto de Caracteres da Mensagem de Erro”, e a Seção 12.12, “Definindo o Idioma da Mensagem de Erro”.

O log de erros contém um registro dos tempos de inicialização e desligamento do `mysqld`. Ele também contém mensagens de diagnóstico, como erros, avisos e notas que ocorrem durante a inicialização e o desligamento do servidor, e enquanto o servidor estiver em execução. Por exemplo, se o `mysqld` notar que uma tabela precisa ser verificada ou reparada automaticamente, ele escreve uma mensagem no log de erros.

Dependendo da configuração do log de erros, as mensagens de erro também podem ser inseridas na tabela `error_log` do Schema de Desempenho, para fornecer uma interface SQL ao log e permitir que seu conteúdo seja pesquisado. Consulte a Seção 29.12.22.2, “A Tabela `error_log’”.

Em alguns sistemas operacionais, o log de erros contém uma traça de pilha se o `mysqld` sair anormalmente. A traça pode ser usada para determinar onde o `mysqld` saiu. Consulte a Seção 7.9, “Depuração do MySQL”.

Se usado para iniciar o `mysqld`, o `mysqld_safe` pode escrever mensagens no log de erros. Por exemplo, quando o `mysqld_safe` nota saídas anormais do `mysqld`, ele reinicia o `mysqld` e escreve uma mensagem “`mysqld` reiniciado” no log de erros.

As seções a seguir discutem aspectos da configuração do registro de erros.