#### B.3.3.7 Problemas com fuso horário

Se você tiver um problema com o `SELECT NOW()` retornando valores em UTC e não em sua hora local, você precisa informar ao servidor seu fuso horário atual. O mesmo se aplica se o [`UNIX_TIMESTAMP()`](date-and-time-functions.html#function_unix-timestamp) retornar o valor errado. Isso deve ser feito para o ambiente em que o servidor está rodando (por exemplo, em [**mysqld\_safe**](mysqld-safe.html) ou [**mysql.server**](mysql-server.html)). Veja [Seção 4.9, “Variáveis de Ambiente”](environment-variables.html).

Você pode definir o fuso horário do servidor com a opção [`--timezone=timezone_name`](mysqld-safe.html#option_mysqld_safe_timezone) no [**mysqld\_safe**](mysqld-safe.html). Você também pode defini-lo configurando a variável de ambiente `TZ` antes de iniciar o [**mysqld**](mysqld.html).

Os valores permitidos para [`--timezone`](mysqld-safe.html#option_mysqld_safe_timezone) ou `TZ` dependem do sistema. Consulte a documentação do seu sistema operacional para ver quais valores são aceitáveis.
