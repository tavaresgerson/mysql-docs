#### 7.4.2.7 Registro de Erros no Formato JSON

Esta seção descreve como configurar o registro de erros usando o filtro embutido, `log_filter_internal`, e o canal de saída JSON, `log_sink_json`, para que tenham efeito imediatamente e nas próximas inicializações do servidor. Para obter informações gerais sobre a configuração do registro de erros, consulte a Seção 7.4.2.1, “Configuração do Log de Erros”.

Para habilitar o canal de saída JSON, primeiro carregue o componente do canal de saída, em seguida, modifique o valor `log_error_services`:

```
INSTALL COMPONENT 'file://component_log_sink_json';
SET PERSIST log_error_services = 'log_filter_internal; log_sink_json';
```

Para definir `log_error_services` para ter efeito na inicialização do servidor, use as instruções na Seção 7.4.2.1, “Configuração do Log de Erros”. Essas instruções também se aplicam a outras variáveis do sistema de registro de erros.

É permitido nomear `log_sink_json` várias vezes no valor `log_error_services`. Por exemplo, para escrever eventos não filtrados com uma instância e eventos filtrados com outra instância, você pode definir `log_error_services` da seguinte forma:

```
SET PERSIST log_error_services = 'log_sink_json; log_filter_internal; log_sink_json';
```

O canal de saída JSON determina seu destino de saída com base no destino padrão do log de erro, que é fornecido pela variável de sistema `log_error`. Se `log_error` nomeia um arquivo, o canal de saída JSON baseia o nome do arquivo de saída nesse nome de arquivo, mais um sufixo numerado `.NN.json`, com *`NN`* começando em 00. Por exemplo, se `log_error` é *`file_name`*, instâncias sucessivas de `log_sink_json` nomeadas no valor `log_error_services` escrevem em `file_name.00.json`, `file_name.01.json`, e assim por diante.

Se `log_error` for `stderr`, o canal de saída JSON escreve na console. Se `log_sink_json` for nomeado várias vezes no valor `log_error_services`, todos eles escrevem na console, o que provavelmente não é útil.