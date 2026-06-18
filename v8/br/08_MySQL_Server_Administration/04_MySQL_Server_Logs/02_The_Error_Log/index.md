### 7.4.2 Diário de Erros

7.4.2.1 Configuração do Log de Erros

7.4.2.2 Configuração de destino do log de erro padrão

7.4.2.3 Campos de evento de erro

7.4.2.4 Tipos de filtragem do log de erros

7.4.2.5 Filtragem do log de erros com prioridade (log\_filter\_internal)

7.4.2.6 Filtro do Diário de Erros Baseado em Regras (log\_filter\_dragnet)

7.4.2.7 Registro de erros no formato JSON

7.4.2.8 Registro de erros no log do sistema

7.4.2.9 Formato de Saída do Log de Erros

7.4.2.10 Limpeza e renomeação do arquivo de registro de erros

Esta seção discute como configurar o servidor MySQL para registrar mensagens de diagnóstico no log de erros. Para obter informações sobre a seleção do conjunto de caracteres e do idioma da mensagem de erro, consulte a Seção 12.6, “Conjunto de caracteres da mensagem de erro”, e a Seção 12.12, “Definindo o idioma da mensagem de erro”.

O log de erros contém um registro dos tempos de inicialização e desligamento do **mysqld**. Ele também contém mensagens de diagnóstico, como erros, avisos e notas que ocorrem durante a inicialização e o desligamento do servidor, além de quando o servidor estiver em execução. Por exemplo, se o **mysqld** perceber que uma tabela precisa ser verificada ou reparada automaticamente, ele escreve uma mensagem no log de erros.

Dependendo da configuração do log de erros, as mensagens de erro também podem ser inseridas na tabela do Schema de Desempenho `error_log`, para fornecer uma interface SQL ao log e permitir que seus conteúdos sejam consultados. Veja a Seção 29.12.21.2, “A tabela error\_log”.

Em alguns sistemas operacionais, o log de erros contém uma traça de pilha se o **mysqld** sair de forma anormal. A traça pode ser usada para determinar onde o **mysqld** saiu. Veja a Seção 7.9, “Depuração do MySQL”.

Se usado para iniciar o **mysqld**, o **mysqld\_safe** pode escrever mensagens no log de erro. Por exemplo, quando o **mysqld\_safe** detecta uma saída anormal do **mysqld**, ele reinicia o **mysqld** e escreve uma mensagem `mysqld restarted` no log de erro.

As seções a seguir discutem aspectos da configuração do registro de erros.
