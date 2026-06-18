#### 7.4.2.8 Registro de erros no log do sistema

É possível fazer com que o **mysqld** escreva o log de erro no log do sistema (o Log de Eventos no Windows e `syslog` em sistemas Unix e Unix-like).

Esta seção descreve como configurar o registro de erros usando o filtro embutido `log_filter_internal` e o canal de registro do sistema `log_sink_syseventlog`, para que eles entrem em vigor imediatamente e nas próximas inicializações do servidor. Para informações gerais sobre a configuração do registro de erros, consulte a Seção 7.4.2.1, “Configuração do Log de Erros”.

Para habilitar o repositório de log do sistema, carregue primeiro o componente do repositório e, em seguida, modifique o valor `log_error_services`:

```
INSTALL COMPONENT 'file://component_log_sink_syseventlog';
SET PERSIST log_error_services = 'log_filter_internal; log_sink_syseventlog';
```

Para definir que o `log_error_services` entre em vigor ao iniciar o servidor, use as instruções na Seção 7.4.2.1, “Configuração do Log de Erros”. Essas instruções também se aplicam a outras variáveis do sistema de registro de erros.

Nota

Para a configuração do MySQL 8.0, você deve habilitar o registro de erros no log do sistema explicitamente. Isso difere do MySQL 5.7 e versões anteriores, para os quais o registro de erros no log do sistema é habilitado por padrão no Windows, e em todas as plataformas não requer carregamento de componentes.

Para registrar erros no log do sistema, pode ser necessário configurar o sistema adicionalmente. Consulte a documentação do log do sistema para sua plataforma.

Em Windows, as mensagens de erro escritas no Registro de Aplicativos do Registro de Eventos têm essas características:

- As entradas marcadas como `Error`, `Warning` e `Note` são escritas no Registro de Eventos, mas não as mensagens, como declarações de informações de motores de armazenamento individuais.

- As entradas do Registro de Eventos têm uma fonte de `MySQL` (ou `MySQL-tag` se `syseventlog.tag` for definido como `tag`).

Em sistemas Unix e Unix-like, o registro no log do sistema usa `syslog`. As seguintes variáveis de sistema afetam as mensagens `syslog`:

- `syseventlog.facility`: A instalação padrão para mensagens `syslog` é `daemon`. Defina esta variável para especificar uma instalação diferente.

- `syseventlog.include_pid`: Se incluir o ID do processo do servidor em cada linha do `syslog` de saída.

- `syseventlog.tag`: Esta variável define uma tag a ser adicionada ao identificador do servidor (`mysqld`) nas mensagens do `syslog`. Se definida, a tag é anexada ao identificador com um hífen inicial.

Nota

Antes do MySQL 8.0.13, use as variáveis de sistema `log_syslog_facility`, `log_syslog_include_pid` e `log_syslog_tag` em vez das variáveis `syseventlog.xxx`.

O MySQL usa a etiqueta personalizada “Sistema” para mensagens importantes do sistema sobre situações que não são erros, como inicialização, desligamento e algumas mudanças significativas nas configurações. Em logs que não suportam etiquetas personalizadas, incluindo o Log de Eventos no Windows e `syslog` em sistemas Unix e similares, as mensagens do sistema são atribuídas à etiqueta usada para o nível de prioridade da informação. No entanto, essas mensagens são impressas no log mesmo que o ajuste `log_error_verbosity` do MySQL normalmente exclua mensagens no nível de informação.

Quando um registro de registro deve ser rebaixado para o rótulo de “Informações” em vez de “Sistema” dessa maneira, e o evento de registro é processado posteriormente fora do servidor MySQL (por exemplo, filtrado ou encaminhado por uma configuração `syslog`), esses eventos podem ser processados, por padrão, pelo aplicativo secundário como tendo prioridade de “Informações” em vez de prioridade de “Sistema”.
