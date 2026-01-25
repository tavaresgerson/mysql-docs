### 5.4.2 O Log de Erros

[5.4.2.1 Registro de Erros no Windows](error-log-windows.html)

[5.4.2.2 Registro de Erros em Sistemas Unix e Semelhantes a Unix](error-log-unix.html)

[5.4.2.3 Registro de Erros no System Log](error-log-syslog.html)

[5.4.2.4 Filtragem do Log de Erros](error-log-filtering.html)

[5.4.2.5 Formato de Saída do Log de Erros](error-log-format.html)

[5.4.2.6 Limpeza (Flushing) e Renomeação do Arquivo de Log de Erros](error-log-rotation.html)

Esta seção discute como configurar o servidor MySQL para o registro de mensagens de diagnóstico no log de erros. Para obter informações sobre como selecionar o *character set* e o idioma das mensagens de erro, consulte [Seção 10.6, “Character Set de Mensagens de Erro”](charset-errors.html "10.6 Character Set de Mensagens de Erro"), e [Seção 10.12, “Definindo o Idioma da Mensagem de Erro”](error-message-language.html "10.12 Setting the Error Message Language").

O log de erros contém um registro dos horários de inicialização (*startup*) e desligamento (*shutdown*) do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Ele também contém mensagens de diagnóstico, como erros, avisos (*warnings*) e notas que ocorrem durante a inicialização e desligamento do servidor, e enquanto o servidor está em execução. Por exemplo, se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") notar que uma *table* precisa ser automaticamente checada ou reparada, ele escreve uma mensagem no log de erros.

Em alguns sistemas operacionais, o log de erros contém um *stack trace* se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") for encerrado de forma anormal. O *trace* pode ser usado para determinar onde o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") foi encerrado. Consulte [Seção 5.8, “Debugging MySQL”](debugging-mysql.html "5.8 Debugging MySQL").

Se usado para iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") pode escrever mensagens no log de erros. Por exemplo, quando o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") nota encerramentos anormais do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), ele reinicia o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") e escreve uma mensagem `mysqld restarted` no log de erros.

As seções a seguir discutem aspectos da configuração do registro de erros (*error logging*). Na discussão, "console" significa `stderr`, a saída de erro padrão (*standard error output*). Este é o seu terminal ou janela de console, a menos que a saída de erro padrão tenha sido redirecionada para um destino diferente.

O servidor interpreta as opções que determinam onde escrever as mensagens de erro de maneira ligeiramente diferente para sistemas Windows e Unix. Certifique-se de configurar o *error logging* utilizando as informações apropriadas para a sua plataforma.