#### 7.4.2.8 Registro de Erros no Log do Sistema

É possível fazer com que o `mysqld` escreva o log de erros no log do sistema (o Log de Eventos no Windows e `syslog` em sistemas Unix e semelhantes).

Esta secção descreve como configurar o registro de erros usando o filtro integrado `log_filter_internal` e o canal de saída do log do sistema `log_sink_syseventlog`, para que tenham efeito imediatamente e nas subsequentes inicializações do servidor. Para informações gerais sobre a configuração do registro de erros, consulte a Seção 7.4.2.1, “Configuração do Log de Erros”.

Para ativar o canal de saída do log do sistema, carregue primeiro o componente do canal de saída, depois modifique o valor `log_error_services`:

```
INSTALL COMPONENT 'file://component_log_sink_syseventlog';
SET PERSIST log_error_services = 'log_filter_internal; log_sink_syseventlog';
```

Para definir `log_error_services` para ter efeito na inicialização do servidor, use as instruções na Seção 7.4.2.1, “Configuração do Log de Erros”. Essas instruções também se aplicam a outras variáveis de registro de erros do sistema.

::: info Nota

O registro de erros no log do sistema pode requerer uma configuração adicional do sistema. Consulte a documentação do log do sistema da sua plataforma.

:::

No Windows, os mensagens de erro escritas no Log de Eventos dentro do log de Aplicação têm estas características:

* As entradas marcadas como `Erro`, `Aviso` e `Nota` são escritas no Log de Eventos, mas não as mensagens como declarações de informações de motores de armazenamento individuais.
* As entradas do Log de Eventos têm uma fonte de `MySQL` (ou `MySQL-tag` se `syseventlog.tag` for definido como *`tag`*).

Em sistemas Unix e semelhantes, o registro no log do sistema usa `syslog`. As seguintes variáveis de sistema afetam as mensagens `syslog`:

*  `syseventlog.facility`: A facilidade padrão para as mensagens `syslog` é `daemon`. Defina esta variável para especificar uma facilidade diferente.
*  `syseventlog.include_pid`: Se incluir o ID do processo do servidor em cada linha de saída `syslog`.
*  `syseventlog.tag`: Esta variável define um tag para adicionar ao identificador do servidor (`mysqld`) nas mensagens `syslog`. Se definido, o tag é anexado ao identificador com um hífen antes.

O MySQL usa a etiqueta personalizada “Sistema” para mensagens importantes do sistema sobre situações não relacionadas a erros, como inicialização, desligamento e algumas mudanças significativas nas configurações. Em logs que não suportam etiquetas personalizadas, incluindo o Log de Eventos no Windows e o `syslog` em sistemas Unix e similares, as mensagens do sistema são atribuídas à etiqueta usada para o nível de prioridade da informação. No entanto, essas mensagens são impressas no log mesmo que o ajuste `log_error_verbosity` do MySQL normalmente exclua mensagens no nível de informação.

Quando um canal de registro deve recorrer a uma etiqueta de “Informação” em vez de “Sistema” dessa maneira, e o evento do log é processado posteriormente fora do servidor MySQL (por exemplo, filtrado ou encaminhado por uma configuração de `syslog`), esses eventos podem, por padrão, ser processados pelo aplicativo secundário como tendo prioridade de “Informação” em vez de prioridade de “Sistema”.