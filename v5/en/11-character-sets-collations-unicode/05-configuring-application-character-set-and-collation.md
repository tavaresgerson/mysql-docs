## 10.5 Configurando o Character Set e a Collation da Aplicação

Para aplicações que armazenam dados usando o character set e a collation padrão do MySQL (`latin1`, `latin1_swedish_ci`), nenhuma configuração especial deve ser necessária. Se as aplicações exigirem o armazenamento de dados usando um character set ou collation diferente, você pode configurar as informações de character set de várias maneiras:

* Especifique as configurações de character set por Database. Por exemplo, aplicações que usam um Database podem usar o padrão `latin1`, enquanto aplicações que usam outro Database podem usar `sjis`.

* Especifique as configurações de character set na inicialização do Server. Isso faz com que o Server utilize as configurações fornecidas para todas as aplicações que não fizerem outros arranjos.

* Especifique as configurações de character set no momento da configuração, se você compilar o MySQL a partir do código-fonte. Isso faz com que o Server utilize as configurações fornecidas como os defaults para todas as aplicações, sem a necessidade de especificá-las na inicialização do Server.

Quando diferentes aplicações exigem diferentes configurações de character set, a técnica por Database oferece uma boa flexibilidade. Se a maioria ou todas as aplicações usarem o mesmo character set, especificar as configurações de character set na inicialização ou no momento da configuração do Server pode ser mais conveniente.

Para as técnicas por Database ou de inicialização do Server, as configurações controlam o character set para o armazenamento de dados. As aplicações também devem informar ao Server qual character set usar para as comunicações client/server, conforme descrito nas instruções a seguir.

Os exemplos mostrados aqui assumem o uso do character set `utf8` e da collation `utf8_general_ci` em contextos específicos como uma alternativa aos defaults de `latin1` e `latin1_swedish_ci`.

* **Especifique as configurações de character set por Database.** Para criar um Database de modo que suas tabelas usem um dado character set e collation default para armazenamento de dados, use uma instrução `CREATE DATABASE` como esta:

  ```sql
  CREATE DATABASE mydb
    CHARACTER SET utf8
    COLLATE utf8_general_ci;
  ```

  As tabelas criadas no Database usam `utf8` e `utf8_general_ci` por default para quaisquer colunas de caracteres.

  As aplicações que usam o Database também devem configurar sua Connection com o Server toda vez que se conectarem. Isso pode ser feito executando uma instrução `SET NAMES 'utf8'` após a conexão. A instrução pode ser usada independentemente do método de conexão (o Client **mysql**, scripts PHP, e assim por diante).

  Em alguns casos, pode ser possível configurar a Connection para usar o character set desejado de outra forma. Por exemplo, para se conectar usando o **mysql**, você pode especificar a opção de linha de comando `--default-character-set=utf8` para obter o mesmo efeito que `SET NAMES 'utf8'`.

  Para mais informações sobre a configuração de Client Connections, consulte a Seção 10.4, “Connection Character Sets and Collations”.

  Nota

  Se você usar `ALTER DATABASE` para alterar o character set ou a collation default do Database, as Stored Routines existentes no Database que usam esses defaults devem ser removidas e recriadas para que passem a usar os novos defaults. (Em uma Stored Routine, as variáveis com tipos de dados de caracteres usam os defaults do Database se o character set ou a collation não forem especificados explicitamente. Consulte a Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.)

* **Especifique as configurações de character set na inicialização do Server.** Para selecionar um character set e uma collation na inicialização do Server, use as opções `--character-set-server` e `--collation-server`. Por exemplo, para especificar as opções em um arquivo de opções, inclua estas linhas:

  ```sql
  [mysqld]
  character-set-server=utf8
  collation-server=utf8_general_ci
  ```

  Essas configurações se aplicam em todo o Server e funcionam como defaults para Databases criados por qualquer aplicação e para tabelas criadas nesses Databases.

  Ainda é necessário que as aplicações configurem sua Connection usando `SET NAMES` ou equivalente após se conectarem, conforme descrito anteriormente. Você pode ficar tentado a iniciar o Server com a opção `--init_connect="SET NAMES 'utf8'"` para fazer com que `SET NAMES` seja executado automaticamente para cada Client que se conectar. No entanto, isso pode gerar resultados inconsistentes, pois o valor de `init_connect` não é executado para usuários que possuem o privilégio `SUPER`.

* **Especifique as configurações de character set no momento da configuração do MySQL.** Para selecionar um character set e uma collation se você configurar e compilar o MySQL a partir do código-fonte, use as opções **CMake** `DEFAULT_CHARSET` e `DEFAULT_COLLATION`:

  ```sql
  cmake . -DDEFAULT_CHARSET=utf8 \
    -DDEFAULT_COLLATION=utf8_general_ci
  ```

  O Server resultante usa `utf8` e `utf8_general_ci` como default para Databases e tabelas e para Client Connections. É desnecessário usar `--character-set-server` e `--collation-server` para especificar esses defaults na inicialização do Server. Também é desnecessário que as aplicações configurem sua Connection usando `SET NAMES` ou equivalente após se conectarem ao Server.

Independentemente de como você configurar o character set do MySQL para o uso da aplicação, você também deve considerar o ambiente no qual essas aplicações são executadas. Por exemplo, se você enviar instruções usando texto UTF-8 retirado de um arquivo que você cria em um editor, você deve editar o arquivo com a localidade (locale) do seu ambiente definida como UTF-8 para que a codificação do arquivo esteja correta e para que o sistema operacional o manipule corretamente. Se você usar o Client **mysql** a partir de uma janela de terminal, a janela deve ser configurada para usar UTF-8 ou os caracteres podem não ser exibidos corretamente. Para um script que é executado em um ambiente Web, o script deve lidar com a codificação de caracteres corretamente para sua interação com o MySQL Server, e deve gerar páginas que indiquem corretamente a codificação para que os navegadores saibam como exibir o conteúdo das páginas. Por exemplo, você pode incluir esta tag `<meta>` dentro do seu elemento `<head>`:

```sql
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
```
