#### B.3.3.7 Problemas de Time Zone

Se você tiver um problema com `SELECT NOW()` retornando valores em UTC e não em sua hora local, você deve informar ao server o seu `time zone` atual. O mesmo se aplica se `UNIX_TIMESTAMP()` retornar o valor incorreto. Isso deve ser configurado no environment em que o server é executado (por exemplo, em **mysqld_safe** ou **mysql.server**). Consulte Seção 4.9, “Environment Variables”.

Você pode definir o `time zone` para o server usando a opção `--timezone=timezone_name` no **mysqld_safe**. Você também pode configurá-lo definindo a environment variable `TZ` antes de iniciar o **mysqld**.

Os valores permitidos para `--timezone` ou `TZ` são dependentes do sistema. Consulte a documentação do seu sistema operacional para verificar quais valores são aceitáveis.