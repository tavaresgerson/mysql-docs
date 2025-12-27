#### 29.12.22.11 A tabela `tls_channel_status`

As propriedades da interface de conexão TLS são definidas durante o início do servidor e podem ser atualizadas em tempo de execução usando a instrução `ALTER INSTANCE RELOAD TLS`. Consulte Configuração e monitoramento em tempo de execução no lado do servidor para conexões criptografadas.

A tabela `tls_channel_status` fornece informações sobre as propriedades da interface de conexão TLS:

```
mysql> SELECT * FROM performance_schema.tls_channel_status\G
*************************** 1. row ***************************
 CHANNEL: mysql_main
PROPERTY: Enabled
   VALUE: Yes
*************************** 2. row ***************************
 CHANNEL: mysql_main
PROPERTY: ssl_accept_renegotiates
   VALUE: 0
*************************** 3. row ***************************
 CHANNEL: mysql_main
PROPERTY: Ssl_accepts
   VALUE: 2
...
*************************** 29. row ***************************
 CHANNEL: mysql_admin
PROPERTY: Enabled
   VALUE: No
*************************** 30. row ***************************
 CHANNEL: mysql_admin
PROPERTY: ssl_accept_renegotiates
   VALUE: 0
*************************** 31. row ***************************
 CHANNEL: mysql_admin
PROPERTY: Ssl_accepts
   VALUE: 0
...
```

A tabela `tls_channel_status` tem as seguintes colunas:

* `CHANNEL`

  O nome da interface de conexão para a qual a linha da propriedade TLS se aplica. `mysql_main` e `mysql_admin` são os nomes dos canais para as interfaces de conexão principal e administrativa, respectivamente. Para informações sobre as diferentes interfaces, consulte a Seção 7.1.12.1, “Interfaces de conexão”.

* `PROPERTY`

  O nome da propriedade TLS. A linha da propriedade `Enabled` indica o status geral da interface, onde a interface e seu status são nomeados nas colunas `CHANNEL` e `VALUE`, respectivamente. Outros nomes de propriedades indicam propriedades TLS específicas. Esses frequentemente correspondem aos nomes de variáveis de status relacionadas ao TLS.

* `VALUE`

  O valor da propriedade TLS.

As propriedades expostas por esta tabela não são fixas e dependem da instrumentação implementada por cada canal.

Para cada canal, a linha com um `PROPERTY` de `Enabled` indica se o canal suporta conexões criptografadas, e outras linhas do canal indicam propriedades de contexto TLS:

* Para `mysql_main`, a propriedade `Enabled` é `yes` ou `no` para indicar se a interface principal suporta conexões criptografadas. Outras linhas do canal exibem propriedades de contexto TLS para a interface principal.

  Para a interface principal, informações de status semelhantes podem ser obtidas usando essas instruções:

  ```
  SHOW GLOBAL STATUS LIKE 'current_tls%';
  SHOW GLOBAL STATUS LIKE 'ssl%';
  ```

* Para `mysql_admin`, a propriedade `Enabled` é `no` se a interface administrativa não estiver habilitada ou estiver habilitada, mas não suportar conexões criptografadas. `Enabled` é `yes` se a interface estiver habilitada e suportar conexões criptografadas.

Quando `Enabled` é `yes`, as outras linhas de `mysql_admin` indicam as propriedades do canal para o contexto TLS da interface administrativa apenas se algum valor de parâmetro TLS não padrão for configurado para essa interface. (Esse é o caso se alguma variável de sistema `admin_tls_xxx` ou `admin_ssl_xxx` for definida com um valor diferente do padrão.) Caso contrário, a interface administrativa usa o mesmo contexto TLS que a interface principal.

A tabela `tls_channel_status` não tem índices.

A operação `TRUNCATE TABLE` não é permitida para a tabela `tls_channel_status`.