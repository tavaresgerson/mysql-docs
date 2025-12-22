#### 7.4.2.7 Registro de erros em formato JSON

Esta seção descreve como configurar o registro de erros usando o filtro embutido, `log_filter_internal`, e o sink JSON, `log_sink_json`, para entrar em vigor imediatamente e para subsequentes inicializações do servidor.

Para habilitar o sink JSON, primeiro carregue o componente sink, em seguida, modifique o valor `log_error_services`:

```
INSTALL COMPONENT 'file://component_log_sink_json';
SET PERSIST log_error_services = 'log_filter_internal; log_sink_json';
```

Para configurar o `log_error_services` para ter efeito na inicialização do servidor, use as instruções na Seção 7.4.2.1, Configuração do Registro de Erros. Estas instruções também se aplicam a outras variáveis do sistema de registro de erros.

É permitido nomear `log_sink_json` várias vezes no valor `log_error_services`. Por exemplo, para escrever eventos não filtrados com uma instância e eventos filtrados com outra instância, você pode definir `log_error_services` assim:

```
SET PERSIST log_error_services = 'log_sink_json; log_filter_internal; log_sink_json';
```

O sink JSON determina seu destino de saída com base no destino de registro de erro padrão, que é dado pela variável de sistema `log_error`. Se `log_error` nomeia um arquivo, o sink JSON baseia o nome do arquivo de saída nesse nome de arquivo, mais um sufixo `.NN.json` numerado, com `NN` começando em 00. Por exemplo, se `log_error` é `file_name`, instâncias sucessivas de `log_sink_json` nomeadas no valor `log_error_services` escrevem para `file_name.00.json`, `file_name.01.json`, e assim por diante.

Se `log_error` é `stderr`, o JSON sink escreve para o console. Se `log_sink_json` é nomeado várias vezes no valor `log_error_services`, todos eles escrevem para o console, o que provavelmente não é útil.
