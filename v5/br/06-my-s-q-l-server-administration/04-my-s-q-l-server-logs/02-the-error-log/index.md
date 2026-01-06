### 5.4.2 Diário de Erros

5.4.2.1 Registro de erros no Windows

5.4.2.2 Registro de erros em sistemas Unix e Unix-like

5.4.2.3 Registro de erros no log do sistema

5.4.2.4 Filtro do Log de Erros

5.4.2.5 Formato de Saída do Log de Erros

5.4.2.6 Limpeza e renomeação do arquivo de registro de erros

Esta seção discute como configurar o servidor MySQL para registrar mensagens de diagnóstico no log de erros. Para obter informações sobre a seleção do conjunto de caracteres e idioma da mensagem de erro, consulte Seção 10.6, “Conjunto de caracteres de mensagem de erro” e Seção 10.12, “Definindo o idioma da mensagem de erro”.

O log de erros contém um registro dos tempos de inicialização e desligamento do **mysqld**. Ele também contém mensagens de diagnóstico, como erros, avisos e notas que ocorrem durante a inicialização e o desligamento do servidor, além de quando o servidor estiver em execução. Por exemplo, se o **mysqld** perceber que uma tabela precisa ser verificada ou reparada automaticamente, ele escreve uma mensagem no log de erros.

Em alguns sistemas operacionais, o log de erros contém uma traça de pilha se o **mysqld** sair anormalmente. A traça pode ser usada para determinar onde o **mysqld** saiu. Veja Seção 5.8, “Depuração do MySQL”.

Se usado para iniciar o **mysqld**, o **mysqld\_safe** pode escrever mensagens no log de erro. Por exemplo, quando o **mysqld\_safe** detecta uma saída anormal do **mysqld**, ele reinicia o **mysqld** e escreve uma mensagem de `mysqld reiniciado` no log de erro.

As seções a seguir discutem aspectos da configuração do registro de erros. Na discussão, "console" significa `stderr`, a saída padrão de erro. Este é seu terminal ou janela de console, a menos que a saída padrão de erro tenha sido redirecionada para um destino diferente.

O servidor interpreta as opções que determinam onde escrever as mensagens de erro de maneira um pouco diferente para sistemas Windows e Unix. Certifique-se de configurar o registro de erros usando as informações apropriadas para sua plataforma.
