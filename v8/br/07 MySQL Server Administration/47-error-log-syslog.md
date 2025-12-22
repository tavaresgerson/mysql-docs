#### 7.4.2.8 Registro de erros no registo do sistema

É possível ter `mysqld` escrever o log de erro para o log do sistema (o Log de Eventos no Windows, e `syslog` em Unix e sistemas semelhantes a Unix).

Esta seção descreve como configurar o registro de erros usando o filtro embutido, `log_filter_internal`, e o sink de registro do sistema, `log_sink_syseventlog`, para entrar em vigor imediatamente e para subsequentes inicializações do servidor.

Para habilitar o sink do log do sistema, primeiro carregue o componente do sink, em seguida, modifique o valor `log_error_services`:

```
INSTALL COMPONENT 'file://component_log_sink_syseventlog';
SET PERSIST log_error_services = 'log_filter_internal; log_sink_syseventlog';
```

Para configurar o `log_error_services` para ter efeito na inicialização do servidor, use as instruções na Seção 7.4.2.1, Configuração do Registro de Erros. Estas instruções também se aplicam a outras variáveis do sistema de registro de erros.

::: info Note

O registo de erros no registo do sistema pode exigir uma configuração adicional do sistema. Consulte a documentação do registo do sistema para a sua plataforma.

:::

No Windows, as mensagens de erro escritas no Registro de Eventos dentro do Registro de Aplicações têm estas características:

- As entradas marcadas como `Error`, `Warning`, e `Note` são escritas no Registro de Eventos, mas não mensagens como declarações de informações de motores de armazenamento individuais.
- As entradas do log de eventos têm uma fonte de `MySQL` (ou `MySQL-tag` se `syseventlog.tag` for definido como `tag`).

Em sistemas Unix e Unix-like, o log para o log do sistema usa `syslog`.

- `syseventlog.facility`: A facilidade padrão para mensagens `syslog` é `daemon`.
- `syseventlog.include_pid`: Se deve incluir o ID do processo do servidor em cada linha da saída `syslog`.
- `syseventlog.tag`: Esta variável define uma tag para adicionar ao identificador do servidor (`mysqld`) nas mensagens `syslog`. Se definida, a tag é anexada ao identificador com um hífen inicial.

O MySQL usa o rótulo personalizado System para mensagens importantes do sistema sobre situações sem erros, como inicialização, desligamento e algumas mudanças significativas nas configurações. Em registros que não suportam rótulos personalizados, incluindo o Registro de Eventos no Windows e `syslog` em sistemas Unix e Unix-like, as mensagens do sistema são atribuídas o rótulo usado para o nível de prioridade de informação. No entanto, essas mensagens são impressas no registro mesmo que a configuração MySQL `log_error_verbosity` normalmente exclua mensagens no nível de informação.

Quando um sink de log deve cair de volta para um rótulo de Informação em vez de Sistema desta forma, e o evento de log é processado fora do servidor MySQL (por exemplo, filtrado ou encaminhado por uma configuração `syslog`), esses eventos podem, por padrão, ser processados pelo aplicativo secundário como sendo de prioridade Informação em vez de prioridade Sistema.
