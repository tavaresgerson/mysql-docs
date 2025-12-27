#### 15.7.4.6 Declaração de DESINSTALAÇÃO DE PLUGIN

```
UNINSTALL PLUGIN plugin_name
```

Esta declaração remove um plugin de servidor instalado. `DESINSTALA PLUGIN` é o complemento de `INSTALA PLUGIN`. Requer o privilégio `DELETE` para a tabela de sistema `mysql.plugin` porque remove a linha dessa tabela que registra o plugin.

*`plugin_name`* deve ser o nome de algum plugin que está listado na tabela `mysql.plugin`. O servidor executa a função de desinicialização do plugin e remove a linha do plugin da tabela de sistema `mysql.plugin`, para que os reinícios subsequentes do servidor não carreguem e inicializem o plugin. `DESINSTALA PLUGIN` não remove o arquivo de biblioteca compartilhada do plugin.

Você não pode desinstalar um plugin se qualquer tabela que o use estiver aberta.

A remoção de um plugin tem implicações para o uso de tabelas associadas. Por exemplo, se um plugin de analisador de texto completo estiver associado a um índice `FULLTEXT` na tabela, a desinstalação do plugin torna a tabela inutilizável. Qualquer tentativa de acessar a tabela resulta em um erro. A tabela nem pode ser aberta, então você não pode descartar um índice para o qual o plugin é usado. Isso significa que desinstalar um plugin é algo a ser feito com cuidado, a menos que você não se importe com o conteúdo da tabela. Se você está desinstalando um plugin sem a intenção de reinstalá-lo mais tarde e se importa com o conteúdo da tabela, você deve dumper a tabela com **mysqldump** e remover a cláusula `WITH PARSER` da declaração `CREATE TABLE` dumper para que você possa recarregar a tabela mais tarde. Se você não se importar com a tabela, o `DROP TABLE` pode ser usado mesmo que quaisquer plugins associados à tabela estejam ausentes.