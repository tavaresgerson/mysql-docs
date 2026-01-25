### 7.6.5 Configurando um Cronograma de Manutenção de Tables MyISAM

É uma boa prática realizar *checks* (verificações) nas *tables* regularmente, em vez de esperar que os problemas ocorram. Uma maneira de verificar (*check*) e reparar (*repair*) *tables* `MyISAM` é usando os *statements* `CHECK TABLE` e `REPAIR TABLE`. Consulte a Seção 13.7.2, “Table Maintenance Statements”.

Outra maneira de verificar (*check*) as *tables* é usar o **myisamchk**. Para fins de manutenção, você pode usar **myisamchk -s**. A opção `-s` (abreviação de `--silent`) faz com que o **myisamchk** execute em modo silencioso, imprimindo mensagens apenas quando erros ocorrem.

Também é uma boa ideia habilitar a verificação (*checking*) automática de *tables* `MyISAM`. Por exemplo, sempre que a máquina tiver feito um *restart* no meio de um *update*, você geralmente precisa verificar (*check*) cada *table* que pode ter sido afetada antes de ser usada novamente. (Estas são "expected crashed tables" – *tables* corrompidas esperadas). Para fazer com que o *server* verifique *tables* `MyISAM` automaticamente, inicie-o com a variável de sistema `myisam_recover_options` configurada. Consulte a Seção 5.1.7, “Server System Variables”.

Você também deve verificar (*check*) suas *tables* regularmente durante a operação normal do sistema. Por exemplo, você pode executar um *cron job* para verificar *tables* importantes uma vez por semana, usando uma linha como esta em um arquivo `crontab`:

```sql
35 0 * * 0 /path/to/myisamchk --fast --silent /path/to/datadir/*/*.MYI
```

Isso imprime informações sobre *crashed tables* (tables corrompidas) para que você possa examiná-las e repará-las (*repair*) conforme necessário.

Para começar, execute **myisamchk -s** todas as noites em todas as *tables* que foram atualizadas (*updated*) durante as últimas 24 horas. À medida que você perceber que os problemas ocorrem com pouca frequência, você pode reduzir a frequência de verificação (*checking*) para uma vez por semana ou algo assim.

Normalmente, as *tables* MySQL precisam de pouca manutenção. Se você estiver realizando muitos *updates* em *tables* `MyISAM` com linhas de tamanho dinâmico (*tables* com colunas `VARCHAR`, `BLOB` ou `TEXT`) ou tiver *tables* com muitas linhas deletadas, você pode querer desfragmentar/reivindicar espaço das *tables* de tempos em tempos. Você pode fazer isso usando `OPTIMIZE TABLE` nas *tables* em questão. Alternativamente, se você puder parar o *server* **mysqld** por um tempo, mude para o diretório de dados (*data directory*) e use este comando enquanto o *server* estiver parado:

```sql
$> myisamchk -r -s --sort-index --myisam_sort_buffer_size=16M */*.MYI
```
