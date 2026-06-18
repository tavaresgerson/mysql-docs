#### B.3.3.7 Problemas com fuso horário

Se você tiver um problema com o `SELECT NOW()` retornando valores em UTC e não em sua hora local, você precisa informar ao servidor sua zona horária atual. O mesmo se aplica se o `UNIX_TIMESTAMP()` retornar o valor errado. Isso deve ser feito para o ambiente em que o servidor está rodando (por exemplo, em **mysqld\_safe** ou **mysql.server**). Veja a Seção 6.9, “Variáveis de Ambiente”.

Você pode definir o fuso horário do servidor com a opção `--timezone=timezone_name` para **mysqld\_safe**. Você também pode defini-lo configurando a variável de ambiente `TZ` antes de iniciar o **mysqld**.

Os valores permitidos para `--timezone` ou `TZ` dependem do sistema. Consulte a documentação do seu sistema operacional para ver quais valores são aceitáveis.
