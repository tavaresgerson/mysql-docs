### 7.6.5 Configurando um cronograma de manutenção de tabela MyISAM

É uma boa ideia realizar verificações de tabelas regularmente, em vez de esperar que os problemas ocorram. Uma maneira de verificar e reparar tabelas `MyISAM` é com as instruções `CHECK TABLE` e `REPAIR TABLE`. Veja a Seção 13.7.2, “Instruções de Manutenção de Tabelas”.

Outra maneira de verificar as tabelas é usar o **myisamchk**. Para fins de manutenção, você pode usar o **myisamchk -s**. A opção `-s` (abreviação de `--silent`) faz com que o **myisamchk** seja executado no modo silencioso, imprimindo mensagens apenas quando ocorrerem erros.

Também é uma boa ideia habilitar a verificação automática das tabelas `MyISAM`. Por exemplo, sempre que a máquina for reiniciada durante uma atualização, geralmente é necessário verificar cada tabela que possa ter sido afetada antes de usá-la novamente. (Estas são as tabelas "esperadas a falhar"). Para fazer com que o servidor verifique as tabelas `MyISAM` automaticamente, inicie-o com a variável de sistema `myisam_recover_options` definida. Veja a Seção 5.1.7, "Variáveis do Sistema do Servidor".

Você também deve verificar suas tabelas regularmente durante o funcionamento normal do sistema. Por exemplo, você pode executar um **cron** para verificar tabelas importantes uma vez por semana, usando uma linha como esta em um arquivo `crontab`:

```sql
35 0 * * 0 /path/to/myisamchk --fast --silent /path/to/datadir/*/*.MYI
```

Isso imprime informações sobre tabelas quebras, para que você possa examiná-las e repará-las conforme necessário.

Para começar, execute **myisamchk -s** todas as noites em todas as tabelas que foram atualizadas nas últimas 24 horas. Como você vê que os problemas ocorrem com pouca frequência, você pode reduzir a frequência de verificação para uma vez por semana ou mais.

Normalmente, as tabelas do MySQL precisam de pouca manutenção. Se você estiver realizando muitas atualizações em tabelas `MyISAM` com linhas de tamanho dinâmico (tabelas com colunas `VARCHAR`, `BLOB` ou `TEXT`) ou tiver tabelas com muitas linhas excluídas, você pode querer desfragmentar/reclamar espaço das tabelas de tempos em tempos. Você pode fazer isso usando `OPTIMIZE TABLE` nas tabelas em questão. Alternativamente, se você puder interromper o servidor **mysqld** por um tempo, mude para o diretório de dados e use este comando enquanto o servidor estiver parado:

```sql
$> myisamchk -r -s --sort-index --myisam_sort_buffer_size=16M */*.MYI
```
