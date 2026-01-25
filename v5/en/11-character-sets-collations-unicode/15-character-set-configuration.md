## 10.15 Configuração de Character Set

O Server MySQL possui um Character Set e um Collation padrão embutidos na compilação. Para alterar esses padrões, use as opções `--character-set-server` e `--collation-server` ao iniciar o Server. Consulte a Seção 5.1.6, "Opções de Comando do Server". O Collation deve ser um Collation válido para o Character Set padrão. Para determinar quais Collations estão disponíveis para cada Character Set, use a instrução `SHOW COLLATION` ou execute uma Query na tabela `COLLATIONS` do `INFORMATION_SCHEMA`.

Se você tentar usar um Character Set que não está compilado em seu binário, poderá encontrar os seguintes problemas:

* Se o seu programa usar um caminho incorreto para determinar onde os Character Sets estão armazenados (que geralmente é o diretório `share/mysql/charsets` ou `share/charsets` sob o diretório de instalação do MySQL), isso pode ser corrigido usando a opção `--character-sets-dir` ao executar o programa. Por exemplo, para especificar um diretório a ser usado pelos programas Client do MySQL, liste-o no grupo `[client]` do seu arquivo de opções. Os exemplos fornecidos aqui mostram como a configuração pode parecer para Unix ou Windows, respectivamente:

  ```sql
  [client]
  character-sets-dir=/usr/local/mysql/share/mysql/charsets

  [client]
  character-sets-dir="C:/Program Files/MySQL/MySQL Server 5.7/share/charsets"
  ```

* Se o Character Set for um Character Set complexo que não pode ser carregado dinamicamente, você deve recompilar o programa com suporte para esse Character Set.

  Para Character Sets Unicode, você pode definir Collations sem recompilar, usando a notação LDML. Consulte a Seção 10.14.4, “Adicionar um UCA Collation a um Unicode Character Set”.

* Se o Character Set for um Character Set dinâmico, mas você não tiver um arquivo de configuração para ele, você deve instalar o arquivo de configuração do Character Set a partir de uma nova distribuição MySQL.

* Se o seu arquivo de Index de Character Set (`Index.xml`) não contiver o nome do Character Set, seu programa exibirá uma mensagem de erro:

  ```sql
  Character set 'charset_name' is not a compiled character set and is not
  specified in the '/usr/share/mysql/charsets/Index.xml' file
  ```

  Para resolver este problema, você deve obter um novo arquivo de Index ou adicionar manualmente o nome de quaisquer Character Sets ausentes ao arquivo atual.

Você pode forçar programas Client a usar Character Sets específicos da seguinte forma:

```sql
[client]
default-character-set=charset_name
```

Isso geralmente é desnecessário. No entanto, quando `character_set_system` difere de `character_set_server` ou `character_set_client`, e você insere caracteres manualmente (como identificadores de objeto de Database, valores de coluna ou ambos), eles podem ser exibidos incorretamente na saída do Client, ou a própria saída pode ser formatada incorretamente. Nesses casos, iniciar o Client mysql com `--default-character-set=system_character_set` — isto é, configurando o Character Set do Client para corresponder ao Character Set do sistema — deve corrigir o problema.