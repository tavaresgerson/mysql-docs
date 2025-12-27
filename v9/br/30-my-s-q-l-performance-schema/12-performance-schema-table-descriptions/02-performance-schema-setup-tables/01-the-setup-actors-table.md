#### 29.12.2.1 A tabela `setup_actors`

A tabela `setup_actors` contém informações que determinam se o monitoramento e o registro de eventos históricos devem ser habilitados para novos threads de servidor em primeiro plano (threads associados a conexões de cliente). Essa tabela tem um tamanho máximo de 100 linhas por padrão. Para alterar o tamanho da tabela, modifique a variável de sistema `performance_schema_setup_actors_size` no início do servidor.

Para cada novo thread em primeiro plano, o Schema de Desempenho compara o usuário e o host do thread com as linhas da tabela `setup_actors`. Se uma linha daquela tabela corresponder, seus valores nas colunas `ENABLED` e `HISTORY` são usados para definir as colunas `INSTRUMENTED` e `HISTORY`, respectivamente, da linha da tabela `threads` para o thread. Isso permite que o monitoramento e o registro de eventos históricos sejam aplicados seletivamente por host, usuário ou conta (combinação de usuário e host). Se não houver correspondência, as colunas `INSTRUMENTED` e `HISTORY` para o thread são definidas como `NO`.

Para threads em segundo plano, não há um usuário associado. `INSTRUMENTED` e `HISTORY` são `YES` por padrão e `setup_actors` não é consultado.

O conteúdo inicial da tabela `setup_actors` corresponde a qualquer combinação de usuário e host, portanto, o monitoramento e a coleta de eventos históricos são habilitados por padrão para todos os threads em primeiro plano:

```
mysql> SELECT * FROM performance_schema.setup_actors;
+------+------+------+---------+---------+
| HOST | USER | ROLE | ENABLED | HISTORY |
+------+------+------+---------+---------+
| %    | %    | %    | YES     | YES     |
+------+------+------+---------+---------+
```

Para obter informações sobre como usar a tabela `setup_actors` para afetar o monitoramento de eventos, consulte a Seção 29.4.6, “Pré-filtragem por Thread”.

As modificações na tabela `setup_actors` afetam apenas threads em primeiro plano criadas após a modificação, não threads existentes. Para afetar threads existentes, modifique as colunas `INSTRUMENTED` e `HISTORY` das linhas da tabela `threads`.

A tabela `setup_actors` tem essas colunas:

* `HOST`

O nome do host. Deve ser um nome literal ou `'%'` para significar “qualquer host”.

* `USER`

  O nome do usuário. Deve ser um nome literal ou `'%'` para significar “qualquer usuário”.

* `ROLE`

  Não utilizado.

* `ENABLED`

  Se habilitar a instrumentação para os threads em primeiro plano correspondentes à linha. O valor é `YES` ou `NO`.

* `HISTORY`

  Se registrar eventos históricos para os threads em primeiro plano correspondentes à linha. O valor é `YES` ou `NO`.

A tabela `setup_actors` tem esses índices:

* Chave primária em (`HOST`, `USER`, `ROLE`)

O `TRUNCATE TABLE` é permitido para a tabela `setup_actors`. Ele remove as linhas.