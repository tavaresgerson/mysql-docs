#### 5.4.2.3 Registro de erros no log do sistema

É possível fazer com que o **mysqld** escreva o log de erro no log do sistema (o Log de Eventos no Windows e `syslog` em sistemas Unix e sistemas semelhantes ao Unix). Para fazer isso, use essas variáveis de sistema:

- `log_syslog`: Ative esta variável para enviar o log de erro para o log do sistema. (No Windows, `log_syslog` está habilitado por padrão.)

  Se `log_syslog` estiver habilitado, as seguintes variáveis de sistema também podem ser usadas para um controle mais preciso.

- `log_syslog_facility`: A facilidade padrão para mensagens `syslog` é `daemon`. Defina essa variável para especificar uma facilidade diferente.

- `log_syslog_include_pid`: Se incluir o ID do processo do servidor em cada linha de saída do `syslog`.

- `log_syslog_tag`: Esta variável define uma tag para adicionar ao identificador do servidor (`mysqld`) nas mensagens `syslog`. Se definida, a tag é anexada ao identificador com um hífen no início.

Nota

Para registrar erros no log do sistema, pode ser necessário configurar o sistema adicionalmente. Consulte a documentação do log do sistema para sua plataforma.

Em sistemas Unix e similares, o controle de saída para o `syslog` também está disponível usando **mysqld\_safe**, que pode capturar a saída de erros do servidor e passá-la para o `syslog`.

Nota

O uso de **mysqld\_safe** para registro de erros do `syslog` está desatualizado; você deve usar as variáveis do sistema do servidor.

**mysqld\_safe** tem três opções de registro de erros, `--syslog`, `--skip-syslog` e `--log-error`. O padrão sem opções de registro ou com `--skip-syslog` é usar o arquivo de log padrão. Para especificar explicitamente o uso de um arquivo de log de erro, especifique `--log-error=file_name` para **mysqld\_safe**, que então organiza para **mysqld** escrever mensagens em um arquivo de log. Para usar `syslog`, especifique a opção `--syslog`. Para a saída `syslog`, uma tag pode ser especificada com `--syslog-tag=tag_val`; isso é anexado ao identificador do servidor `mysqld` com um hífen antes.
