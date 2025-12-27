### 9.6.5 Configurando um Cronograma de Manutenção de Tabelas MyISAM

É uma boa ideia realizar verificações de tabelas regularmente, em vez de esperar que problemas ocorram. Uma maneira de verificar e reparar tabelas `MyISAM` é com as instruções `CHECK TABLE` e `REPAIR TABLE`. Veja a Seção 15.7.3, “Instruções de Manutenção de Tabelas”.

Outra maneira de verificar tabelas é usar `myisamchk`. Para fins de manutenção, você pode usar `myisamchk -s`. A opção `-s` (abreviação de `--silent`) faz com que `myisamchk` seja executado no modo silencioso, imprimindo mensagens apenas quando erros ocorrem.

Também é uma boa ideia habilitar a verificação automática de tabelas `MyISAM`. Por exemplo, sempre que a máquina for reiniciada durante uma atualização, geralmente é necessário verificar cada tabela que poderia ter sido afetada antes de ser usada novamente. (Essas são as “tabelas que provavelmente falharam”.) Para fazer com que o servidor verifique as tabelas `MyISAM` automaticamente, inicie-o com a variável de sistema `myisam_recover_options` definida. Veja a Seção 7.1.8, “Variáveis de Sistema do Servidor”.

Você também deve verificar suas tabelas regularmente durante o funcionamento normal do sistema. Por exemplo, você pode executar um trabalho `cron` para verificar tabelas importantes uma vez por semana, usando uma linha como esta em um arquivo `crontab`:

```
35 0 * * 0 /path/to/myisamchk --fast --silent /path/to/datadir/*/*.MYI
```

Isso imprime informações sobre tabelas que falharam, para que você possa examiná-las e repará-las conforme necessário.

Para começar, execute `myisamchk -s` todas as noites em todas as tabelas que foram atualizadas nas últimas 24 horas. À medida que você perceber que os problemas ocorrem com pouca frequência, pode reduzir a frequência de verificação para uma vez por semana ou mais.

Normalmente, as tabelas do MySQL precisam de pouca manutenção. Se você estiver realizando muitas atualizações em tabelas `MyISAM` com linhas de tamanho dinâmico (tabelas com colunas `VARCHAR`, `BLOB` ou `TEXT`) ou tiver tabelas com muitas linhas excluídas, você pode querer desfragmentar/reclamar espaço das tabelas de tempos em tempos. Você pode fazer isso usando `OPTIMIZE TABLE` nas tabelas em questão. Alternativamente, se você puder interromper o servidor `mysqld` por um tempo, mude para o diretório de dados e use este comando enquanto o servidor estiver parado:

```
$> myisamchk -r -s --sort-index --myisam_sort_buffer_size=16M */*.MYI
```