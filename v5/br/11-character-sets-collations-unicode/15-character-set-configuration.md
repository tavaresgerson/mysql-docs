## 10.15 Configuração do Conjunto de Caracteres

O servidor MySQL tem um conjunto de caracteres e uma ordenação padrão compilados. Para alterar esses padrões, use as opções `--character-set-server` e `--collation-server` ao iniciar o servidor. Consulte a Seção 5.1.6, “Opções de comando do servidor”. A ordenação deve ser uma ordenação legal para o conjunto de caracteres padrão. Para determinar quais ordenações estão disponíveis para cada conjunto de caracteres, use a instrução `SHOW COLLATION` ou consulte a tabela `INFORMATION_SCHEMA` `COLLATIONS`.

Se você tentar usar um conjunto de caracteres que não está compilado em seu binário, você pode encontrar os seguintes problemas:

- Se o seu programa usar um caminho incorreto para determinar onde os conjuntos de caracteres estão armazenados (que geralmente é o diretório `share/mysql/charsets` ou `share/charsets` sob o diretório de instalação do MySQL), isso pode ser corrigido usando a opção `--character-sets-dir` ao executar o programa. Por exemplo, para especificar um diretório a ser usado pelos programas cliente do MySQL, liste-o no grupo `[client]` do seu arquivo de opções. Os exemplos fornecidos aqui mostram como o ajuste pode parecer para Unix ou Windows, respectivamente:

  ```sql
  [client]
  character-sets-dir=/usr/local/mysql/share/mysql/charsets

  [client]
  character-sets-dir="C:/Program Files/MySQL/MySQL Server 5.7/share/charsets"
  ```

- Se o conjunto de caracteres for um conjunto de caracteres complexo que não pode ser carregado dinamicamente, você deve recompilar o programa com suporte para o conjunto de caracteres.

  Para conjuntos de caracteres Unicode, você pode definir colatações sem recompilar usando a notação LDML. Veja a Seção 10.14.4, “Adicionando uma colatação UCA a um conjunto de caracteres Unicode”.

- Se o conjunto de caracteres for um conjunto de caracteres dinâmico, mas você não tiver um arquivo de configuração para ele, você deve instalar o arquivo de configuração para o conjunto de caracteres de uma nova distribuição do MySQL.

- Se o arquivo de índice do conjunto de caracteres (`Index.xml`) não contiver o nome do conjunto de caracteres, o programa exibirá uma mensagem de erro:

  ```sql
  Character set 'charset_name' is not a compiled character set and is not
  specified in the '/usr/share/mysql/charsets/Index.xml' file
  ```

  Para resolver esse problema, você deve obter um novo arquivo de índice ou adicionar manualmente o nome de quaisquer conjuntos de caracteres ausentes ao arquivo atual.

Você pode forçar os programas cliente a usarem um conjunto de caracteres específico da seguinte forma:

```sql
[client]
default-character-set=charset_name
```

Isso normalmente não é necessário. No entanto, quando `character_set_system` difere de `character_set_server` ou `character_set_client`, e você digita caracteres manualmente (como identificadores de objetos de banco de dados, valores de coluna ou ambos), esses caracteres podem ser exibidos incorretamente na saída do cliente ou a própria saída pode estar formatada incorretamente. Nesses casos, iniciar o cliente mysql com `--default-character-set=system_character_set` — ou seja, definir o conjunto de caracteres do cliente para corresponder ao conjunto de caracteres do sistema — deve resolver o problema.
