## 10.5 Configurando o conjunto de caracteres e a codificação de aplicativos

Para aplicações que armazenam dados usando o conjunto de caracteres e a ordenação padrão do MySQL (`latin1`, `latin1_swedish_ci`), não é necessário configurar nada de especial. Se as aplicações exigirem armazenamento de dados usando um conjunto de caracteres ou ordenação diferente, você pode configurar as informações do conjunto de caracteres de várias maneiras:

- Especifique as configurações de caracteres por banco de dados. Por exemplo, aplicativos que usam um banco de dados podem usar o padrão `latin1`, enquanto aplicativos que usam outro banco de dados podem usar `sjis`.

- Especifique as configurações de caracteres no início do servidor. Isso faz com que o servidor use as configurações fornecidas para todas as aplicações que não fazem outros ajustes.

- Especifique as configurações de caracteres no momento da configuração, se você construir o MySQL a partir do código-fonte. Isso faz com que o servidor use as configurações fornecidas como padrão para todas as aplicações, sem precisar especificá-las no momento do início do servidor.

Quando diferentes aplicativos exigem configurações de caracteres diferentes, a técnica por banco de dados oferece bastante flexibilidade. Se a maioria ou todos os aplicativos usarem o mesmo conjunto de caracteres, especificar as configurações de caracteres no momento do início ou da configuração do servidor pode ser mais conveniente.

Para as técnicas de inicialização por banco de dados ou servidor, as configurações controlam o conjunto de caracteres para armazenamento de dados. As aplicações também devem informar ao servidor qual conjunto de caracteres usar para comunicações cliente/servidor, conforme descrito nas instruções a seguir.

Os exemplos mostrados aqui assumem o uso do conjunto de caracteres `utf8` e da ordenação `utf8_general_ci` em contextos específicos como uma alternativa aos padrões de `latin1` e `latin1_swedish_ci`.

- **Especifique as configurações de caracteres por banco de dados.** Para criar um banco de dados de modo que suas tabelas utilizem um conjunto de caracteres padrão e uma ordem de classificação de dados específicos, use uma instrução `CREATE DATABASE` como esta:

  ```sql
  CREATE DATABASE mydb
    CHARACTER SET utf8
    COLLATE utf8_general_ci;
  ```

  As tabelas criadas no banco de dados usam `utf8` e `utf8_general_ci` por padrão para qualquer coluna de caracteres.

  As aplicações que utilizam o banco de dados também devem configurar sua conexão com o servidor cada vez que se conectam. Isso pode ser feito executando uma instrução `SET NAMES 'utf8'` após a conexão. A instrução pode ser usada independentemente do método de conexão (o cliente **mysql**, scripts PHP, etc.).

  Em alguns casos, pode ser possível configurar a conexão para usar o conjunto de caracteres desejado de outra maneira. Por exemplo, para se conectar usando **mysql**, você pode especificar a opção de linha de comando `--default-character-set=utf8` para obter o mesmo efeito que `SET NAMES 'utf8'`.

  Para obter mais informações sobre a configuração de conexões de clientes, consulte a Seção 10.4, “Conjunto de caracteres de conexão e colagens”.

  Nota

  Se você usar `ALTER DATABASE` para alterar o conjunto de caracteres padrão ou a collation padrão do banco de dados, as rotinas armazenadas existentes no banco de dados que utilizam esses padrões devem ser excluídas e recriadas para que utilizem os novos padrões. (Em uma rotina armazenada, as variáveis com tipos de dados de caracteres usam os padrões do banco de dados se o conjunto de caracteres ou a collation não forem especificados explicitamente. Consulte a Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.)

- **Especifique as configurações de caracteres no início do servidor.** Para selecionar um conjunto de caracteres e uma ordenação no início do servidor, use as opções `--character-set-server` e `--collation-server`. Por exemplo, para especificar as opções em um arquivo de opções, inclua as seguintes linhas:

  ```sql
  [mysqld]
  character-set-server=utf8
  collation-server=utf8_general_ci
  ```

  Essas configurações são aplicadas em todo o servidor e são as configurações padrão para bancos de dados criados por qualquer aplicativo e para tabelas criadas nesses bancos de dados.

  Ainda é necessário que as aplicações configurem sua conexão usando `SET NAMES` ou equivalente após se conectarem, conforme descrito anteriormente. Você pode ser tentado a iniciar o servidor com a opção `--init_connect="SET NAMES 'utf8'"` para fazer com que `SET NAMES` seja executado automaticamente para cada cliente que se conecta. No entanto, isso pode resultar em resultados inconsistentes, pois o valor `init_connect` não é executado para usuários que têm o privilégio `SUPER`.

- **Especifique as configurações de caracteres no momento da configuração do MySQL.** Para selecionar um conjunto de caracteres e uma ordenação se você configurar e compilar o MySQL a partir da fonte, use as opções `DEFAULT_CHARSET` e `DEFAULT_COLLATION` do **CMake**:

  ```sql
  cmake . -DDEFAULT_CHARSET=utf8 \
    -DDEFAULT_COLLATION=utf8_general_ci
  ```

  O servidor resultante usa `utf8` e `utf8_general_ci` como padrão para bancos de dados e tabelas e para conexões de clientes. Não é necessário usar `--character-set-server` e `--collation-server` para especificar esses padrões no início do servidor. Também não é necessário que as aplicações configurem suas conexões usando `SET NAMES` ou equivalente após se conectarem ao servidor.

Independentemente de como você configure o conjunto de caracteres MySQL para uso de aplicativos, você também deve considerar o ambiente em que esses aplicativos são executados. Por exemplo, se você enviar instruções usando texto UTF-8 extraído de um arquivo que você cria em um editor, você deve editar o arquivo com o idioma do seu ambiente configurado para UTF-8 para que o arquivo seja codificado corretamente e para que o sistema operacional o trate corretamente. Se você usar o cliente **mysql** dentro de uma janela de terminal, a janela deve ser configurada para usar UTF-8, caso contrário, os caracteres podem não ser exibidos corretamente. Para um script que é executado em um ambiente web, o script deve lidar corretamente com a codificação de caracteres para sua interação com o servidor MySQL e deve gerar páginas que indiquem corretamente a codificação para que os navegadores saibam como exibir o conteúdo das páginas. Por exemplo, você pode incluir esta tag `<meta>` dentro do seu elemento `<head>`:

```sql
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
```
