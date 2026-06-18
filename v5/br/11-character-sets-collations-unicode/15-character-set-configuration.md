## 10.15 Configuração de Character Set

O MySQL server possui um *default character set* e *collation* compilados internamente. Para alterar esses *defaults*, use as opções `--character-set-server` e `--collation-server` ao iniciar o *server*. Consulte a Seção 5.1.6, “Opções de Comando do Server”. O *collation* deve ser um *collation* legal para o *default character set*. Para determinar quais *collations* estão disponíveis para cada *character set*, use a instrução `SHOW COLLATION` ou execute um *query* na tabela `COLLATIONS` do `INFORMATION_SCHEMA`.

Se você tentar usar um *character set* que não está compilado no seu binário, você pode encontrar os seguintes problemas:

* Se o seu programa usar um *path* incorreto para determinar onde os *character sets* estão armazenados (o que é tipicamente o diretório `share/mysql/charsets` ou `share/charsets` sob o diretório de instalação do MySQL), isso pode ser corrigido usando a opção `--character-sets-dir` ao executar o programa. Por exemplo, para especificar um diretório a ser usado pelos programas *client* do MySQL, liste-o no grupo `[client]` do seu arquivo de opções. Os exemplos fornecidos aqui mostram como a configuração pode se parecer para Unix ou Windows, respectivamente:

  ```sql
  [client]
  character-sets-dir=/usr/local/mysql/share/mysql/charsets

  [client]
  character-sets-dir="C:/Program Files/MySQL/MySQL Server 5.7/share/charsets"
  ```

* Se o *character set* for um *character set* complexo que não pode ser carregado dinamicamente, você deve recompilar o programa com suporte para o *character set*.

  Para *character sets* Unicode, você pode definir *collations* sem recompilar, usando a notação LDML. Consulte a Seção 10.14.4, “Adicionando um UCA Collation a um Unicode Character Set”.

* Se o *character set* for um *character set* dinâmico, mas você não tiver um arquivo de configuração para ele, você deve instalar o arquivo de configuração para o *character set* de uma nova distribuição MySQL.

* Se o seu arquivo de índice de *character set* (`Index.xml`) não contiver o nome para o *character set*, seu programa exibirá uma mensagem de erro:

  ```sql
  Character set 'charset_name' is not a compiled character set and is not
  specified in the '/usr/share/mysql/charsets/Index.xml' file
  ```

  Para resolver este problema, você deve obter um novo arquivo de índice ou adicionar manualmente o nome de quaisquer *character sets* ausentes ao arquivo atual.

Você pode forçar os programas *client* a usar um *character set* específico da seguinte forma:

```sql
[client]
default-character-set=charset_name
```

Isso é normalmente desnecessário. No entanto, quando `character_set_system` for diferente de `character_set_server` ou `character_set_client`, e você inserir caracteres manualmente (como identificadores de objetos de *database*, valores de colunas ou ambos), eles podem ser exibidos incorretamente na saída do *client* ou a própria saída pode estar formatada incorretamente. Nesses casos, iniciar o *client* mysql com `--default-character-set=system_character_set` — isto é, configurar o *character set* do *client* para corresponder ao *character set* do sistema — deve corrigir o problema.