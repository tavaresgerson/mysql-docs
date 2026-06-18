## 10.5 Configurando o Character Set e Collation da Aplicação

Para aplicações que armazenam dados usando o `character set` e `collation` padrão do MySQL (`latin1`, `latin1_swedish_ci`), nenhuma configuração especial deve ser necessária. Se as aplicações exigirem o armazenamento de dados usando um `character set` ou `collation` diferente, você pode configurar as informações do `character set` de várias maneiras:

* Especifique as configurações de caracteres por `Database`. Por exemplo, aplicações que usam um `Database` podem usar o padrão `latin1`, enquanto aplicações que usam outro `Database` podem usar `sjis`.

* Especifique as configurações de caracteres na inicialização do servidor (server startup). Isso fará com que o servidor use as configurações fornecidas para todas as aplicações que não fizerem outros ajustes.

* Especifique as configurações de caracteres no momento da configuração, caso você compile o MySQL a partir do código fonte. Isso fará com que o servidor use as configurações fornecidas como padrões para todas as aplicações, sem a necessidade de especificá-las no `server startup`.

Quando diferentes aplicações exigem diferentes configurações de caracteres, a técnica por `Database` oferece grande flexibilidade. Se a maioria ou todas as aplicações usam o mesmo `character set`, especificar as configurações de caracteres no `server startup` ou no momento da configuração pode ser mais conveniente.

Para as técnicas por `Database` ou `server-startup`, as configurações controlam o `character set` para armazenamento de dados. As aplicações também devem informar ao servidor qual `character set` usar para comunicações cliente/servidor, conforme descrito nas instruções a seguir.

Os exemplos mostrados aqui assumem o uso do `character set` `utf8` e do `collation` `utf8_general_ci` em contextos específicos, como uma alternativa aos padrões `latin1` e `latin1_swedish_ci`.

* **Especifique as configurações de caracteres por Database.** Para criar um `Database` de modo que suas `tables` usem um determinado `character set` e `collation` padrão para armazenamento de dados, use um `CREATE DATABASE` statement como este:

  ```sql
  CREATE DATABASE mydb
    CHARACTER SET utf8
    COLLATE utf8_general_ci;
  ```

  As `tables` criadas no `Database` usam `utf8` e `utf8_general_ci` por padrão para quaisquer `columns` de caracteres.

  Aplicações que usam o `Database` também devem configurar sua conexão com o servidor sempre que se conectarem. Isso pode ser feito executando um `SET NAMES 'utf8'` statement após a conexão. O `statement` pode ser usado independentemente do método de conexão (o **mysql** client, scripts PHP, e assim por diante).

  Em alguns casos, pode ser possível configurar a conexão para usar o `character set` desejado de alguma outra forma. Por exemplo, para conectar usando **mysql**, você pode especificar a opção de linha de comando `--default-character-set=utf8` para obter o mesmo efeito que `SET NAMES 'utf8'`.

  Para mais informações sobre como configurar conexões de `client`, consulte a Seção 10.4, “Connection Character Sets and Collations”.

  Note

  Se você usar `ALTER DATABASE` para mudar o `character set` ou `collation` padrão do `Database`, as `stored routines` existentes no `Database` que usam esses padrões devem ser descartadas (`dropped`) e recriadas para que utilizem os novos padrões. (Em uma `stored routine`, variáveis com `data types` de caracteres usam os padrões do `Database` se o `character set` ou `collation` não for especificado explicitamente. Consulte a Seção 13.1.16, “CREATE PROCEDURE and CREATE FUNCTION Statements”.)

* **Especifique as configurações de caracteres no server startup.** Para selecionar um `character set` e `collation` na inicialização do servidor, use as opções `--character-set-server` e `--collation-server`. Por exemplo, para especificar as opções em um `option file`, inclua estas linhas:

  ```sql
  [mysqld]
  character-set-server=utf8
  collation-server=utf8_general_ci
  ```

  Estas configurações se aplicam a todo o servidor (server-wide) e são aplicadas como padrões para `Databases` criados por qualquer aplicação, e para `tables` criadas nesses `Databases`.

  Ainda é necessário que as aplicações configurem sua conexão usando `SET NAMES` ou equivalente após se conectarem, conforme descrito anteriormente. Você pode ficar tentado a iniciar o servidor com a opção `--init_connect="SET NAMES 'utf8'"` para fazer com que `SET NAMES` seja executado automaticamente para cada `client` que se conecta. No entanto, isso pode resultar em inconsistência, pois o valor de `init_connect` não é executado para usuários que possuem o `SUPER privilege`.

* **Especifique as configurações de caracteres no momento da configuração do MySQL.** Para selecionar um `character set` e `collation` se você configurar e compilar o MySQL a partir do código fonte, use as opções **CMake** `DEFAULT_CHARSET` e `DEFAULT_COLLATION`:

  ```sql
  cmake . -DDEFAULT_CHARSET=utf8 \
    -DDEFAULT_COLLATION=utf8_general_ci
  ```

  O servidor resultante usa `utf8` e `utf8_general_ci` como padrão para `Databases` e `tables` e para conexões de `client`. Não é necessário usar `--character-set-server` e `--collation-server` para especificar esses padrões no `server startup`. Também não é necessário que as aplicações configurem sua conexão usando `SET NAMES` ou equivalente após se conectarem ao servidor.

Independentemente de como você configure o `character set` do MySQL para uso da aplicação, você também deve considerar o ambiente no qual essas aplicações são executadas. Por exemplo, se você envia `statements` usando texto UTF-8 tirado de um arquivo que você cria em um editor, você deve editar o arquivo com o `locale` do seu ambiente definido como UTF-8 para que a codificação do arquivo esteja correta e para que o sistema operacional lide com ele corretamente. Se você usar o **mysql** client em uma janela de terminal, a janela deve ser configurada para usar UTF-8, ou os caracteres podem não ser exibidos corretamente. Para um script executado em um ambiente Web, o script deve lidar com a codificação de caracteres corretamente para sua interação com o MySQL server, e deve gerar páginas que indiquem corretamente a codificação para que os `browsers` saibam como exibir o conteúdo das páginas. Por exemplo, você pode incluir esta `meta tag` dentro do seu elemento `<head>`:

```sql
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
```